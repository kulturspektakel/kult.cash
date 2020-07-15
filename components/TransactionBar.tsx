import currencyFormatter from '../utils/currencyFormatter';
import {Button, Drawer, Radio} from 'antd';
import TransactionStats, {GroupBy} from './TransactionStats';
import {useState, useCallback} from 'react';
import {FileExcelOutlined} from '@ant-design/icons';
import zipcelx from 'zipcelx';
import {TransactionData} from './useData';
import {ColumnsType} from 'antd/lib/table';
import styles from './TransactionBar.module.css';

export const BAR_HEIGHT = 60;
export default function TransactionBar(props: {
  data: TransactionData[];
  columns: ColumnsType<TransactionData>;
}) {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [groupBy, setGroupBy] = useState<GroupBy>(GroupBy.List);

  const revenue = props.data.reduce(
    (acc, cv) => (acc += cv.balanceBefore - cv.balanceAfter),
    0,
  );

  const devices = props.data.reduce(
    (acc, cv) => acc.add(cv.deviceId),
    new Set(),
  ).size;

  const cards = props.data.reduce((acc, cv) => acc.add(cv.card), new Set())
    .size;

  // const onDownload = useCallback(() => {
  //   zipcelx({
  //     filename: 'transactions',
  //     sheet: {
  //       data: props.data.map((t) =>
  //         Object.values(t).map((value) => ({
  //           value: String(value),
  //           type: 'string',
  //         })),
  //       ),
  //     },
  //   });
  // }, [props.data]);

  const content = {
    deviceTime: <>{props.data.length} Transaktionen</>,
    card: <>{cards} Karten</>,
    deviceId: <>{devices} Geräte</>,
    total: <>{currencyFormatter.format(revenue / 100)}</>,
  };

  return (
    <>
      <div className={styles.bar} onClick={() => setDrawerVisible(true)}>
        {props.columns.map((col) => (
          <div key={col.key} style={{width: col.width}}>
            {content[col.key as keyof typeof content]}
          </div>
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
          <div className={styles.header}>
            Statistik
            <Radio.Group
              options={[
                {label: 'nach Buden', value: GroupBy.List},
                {label: 'nach Produkten', value: GroupBy.Product},
              ]}
              onChange={(e) => setGroupBy(e.target.value)}
              value={groupBy}
              optionType="button"
            />
          </div>
        }
        height="70%"
      >
        <TransactionStats data={props.data} groupBy={groupBy} />
      </Drawer>
    </>
  );
}
