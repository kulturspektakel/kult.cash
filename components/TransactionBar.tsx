import currencyFormatter from '../utils/currencyFormatter';
import {Button, Drawer, Radio} from 'antd';
import TransactionStats from './TransactionStats';
import {useState, useCallback} from 'react';
import {FileExcelOutlined} from '@ant-design/icons';
import zipcelx from 'zipcelx';
import {TransactionData} from './useData';
import {ColumnsType} from 'antd/lib/table';
import styles from './TransactionBar.module.css';

export default function TransactionBar(props: {
  data: TransactionData[];
  columns: ColumnsType<TransactionData>;
}) {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [groupBy, setGroupBy] = useState<'list' | 'product'>('list');

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
        data: props.data.map((t) =>
          Object.values(t).map((value) => ({
            value: String(value),
            type: 'string',
          })),
        ),
      },
    });
  }, [props.data]);

  const content = {
    deviceTime: <>{props.data.length} Transaktionen</>,
    card: <>{cards} Karten</>,
    deviceId: <>{devices} Geräte</>,
    total: <>{currencyFormatter.format(total / 100)}</>,
  };

  return (
    <Drawer
      placement="bottom"
      visible
      closable={false}
      mask={false}
      height={60}
      bodyStyle={{
        padding: 0,
      }}
    >
      <div className={styles.bar} onClick={() => setDrawerVisible(true)}>
        {props.columns.map((col) => (
          <div style={{width: col.width}}>{content[col.key]}</div>
        ))}
      </div>

      {/* <Button
        type="primary"
        ghost
        icon={<FileExcelOutlined />}
        onClick={onDownload}
      >
        Download
      </Button> */}
      <Drawer
        placement="bottom"
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        title={
          <>
            Statistik
            <Radio.Group
              options={[
                {label: 'nach Preislisten', value: 'list'},
                {label: 'nach Produkten', value: 'product'},
              ]}
              onChange={(e) => setGroupBy(e.target.value)}
              value={groupBy}
              optionType="button"
            />
          </>
        }
        height="70%"
      >
        <TransactionStats data={props.data} />
      </Drawer>
    </Drawer>
  );
}
