import currencyFormatter from '../utils/currencyFormatter';
import {Button, Drawer, Radio, Modal} from 'antd';
import TransactionStats, {GroupBy} from './TransactionStats';
import {useState, useCallback, useRef} from 'react';
import {FileExcelOutlined, DeleteOutlined} from '@ant-design/icons';
import zipcelx from 'zipcelx';
import {TransactionData} from './useData';
import {ColumnsType} from 'antd/lib/table';
import styles from './TransactionBar.module.css';

export const BAR_HEIGHT = 60;
export default function TransactionBar({
  data,
  columns,
  onDelete,
}: {
  data: TransactionData[];
  columns: ColumnsType<TransactionData>;
  onDelete: () => void;
}) {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [groupBy, setGroupBy] = useState<GroupBy>(GroupBy.List);
  const ref = useRef<HTMLDivElement>(null);

  const revenue = data.reduce(
    (acc, cv) => (acc += cv.balanceBefore - cv.balanceAfter),
    0,
  );

  const devices = data.reduce((acc, cv) => acc.add(cv.deviceId), new Set())
    .size;

  const cards = data.reduce((acc, cv) => acc.add(cv.card), new Set()).size;

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

  const onDeleteClick = useCallback(() => {
    Modal.confirm({
      title: `${data.length} Transaktionen löschen?`,
      onOk: (...args) => {
        onDelete();
      },
      cancelText: 'Abbrechen',
      okText: 'Löschen',
      okButtonProps: {
        danger: true,
      },
    });
  }, [onDelete, data.length]);

  const content = {
    deviceTime: (
      <>
        {data.length} Transaktionen{' '}
        {data.length > 0 && (
          <DeleteOutlined color="red" onClick={onDeleteClick} />
        )}
      </>
    ),
    card: <>{cards} Karten</>,
    deviceId: <>{devices} Geräte</>,
    total: <>{currencyFormatter.format(revenue / 100)}</>,
  };

  return (
    <>
      <div
        ref={ref}
        className={styles.bar}
        onClick={(e: React.MouseEvent<HTMLElement>) => {
          if (e.target === ref.current || e.target.parentNode === ref.current) {
            setDrawerVisible(true);
          }
        }}
      >
        {columns.map((col) => (
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
        <TransactionStats data={data} groupBy={groupBy} />
      </Drawer>
    </>
  );
}
