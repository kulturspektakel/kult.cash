import {Transaction} from '@prisma/client';
import currencyFormatter from '../utils/currencyFormatter';
import {Button, Drawer} from 'antd';
import TransactionStats from './TransactionStats';
import {useState, useCallback} from 'react';
import {FileExcelOutlined} from '@ant-design/icons';
import zipcelx from 'zipcelx';

export default function TransactionBar(props: {data: Transaction[]}) {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const total = props.data.reduce(
    (acc, cv) => (acc += cv.balanceBefore - cv.balanceAfter),
    0,
  );

  const devices = props.data.reduce(
    (acc, cv) => acc.add(cv.deviceId),
    new Set(),
  ).size;

  const cards = props.data.reduce((acc, cv) => acc.add(cv.card), new Set())
    .size;

  const onDownload = useCallback(() => {
    zipcelx({
      filename: 'transactions',
      sheet: {
        data: props.data.map((t: Transaction) =>
          Object.values(t).map((value) => ({
            value: String(value),
            type: 'string',
          })),
        ),
      },
    });
  }, [props.data]);

  return (
    <Drawer
      placement="bottom"
      visible
      closable={false}
      mask={false}
      height={60}
      bodyStyle={{
        padding: 15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {props.data.length} Transaktionen {cards} Karten
      <strong>{currencyFormatter.format(total / 100)}</strong> {devices} Geräte
      <Button
        type="primary"
        ghost
        icon={<FileExcelOutlined />}
        onClick={onDownload}
      >
        Download
      </Button>
      <Button type="primary" ghost onClick={() => setDrawerVisible(true)}>
        Details
      </Button>
      <Drawer
        placement="bottom"
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        <TransactionStats data={props.data} />
      </Drawer>
    </Drawer>
  );
}
