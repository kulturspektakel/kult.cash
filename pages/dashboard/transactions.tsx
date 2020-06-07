import App from '../../components/App';
import {
  useTransactions,
  useDevices,
  useLists,
  TransactionData,
} from '../../components/useData';
import {Transaction, Device, List} from '@prisma/client';
import React, {useState, useEffect} from 'react';
import TransactionBar from '../../components/TransactionBar';
import currencyFormatter from '../../utils/currencyFormatter';
import RelativeDate from '../../components/RelativeDate';
import TimeFilter, {dateRangeFilterAtom} from '../../components/TimeFilter';
import VirtualTable from '../../components/VirtualTable';
import {Spin, Tooltip} from 'antd';
import {ColumnsType} from 'antd/lib/table';
import {atom, useRecoilState} from 'recoil';
import {NextPageContext} from 'next';
import {
  getInitialLists,
  getInitialDevices,
  getInitialTransactions,
} from '../../components/getInitialProps';
import {Emoji} from 'emoji-mart';

const getColums = (
  devices: Device[] | null,
  listMap: Map<string, List> | undefined,
  timeFrom: moment.Moment | null,
  timeUntil: moment.Moment | null,
): ColumnsType<TransactionData> => [
  {
    title: 'Zeit',
    dataIndex: 'deviceTime',
    key: 'deviceTime',
    width: '15%',
    render: RelativeDate,
    sorter: (a, b) => (b.deviceTime > a.deviceTime ? 1 : -1),
    filterDropdown: TimeFilter,
    onFilter: (value) => {
      // console.log(value, timeFrom, timeUntil);
      // return timeFrom >= value && value <= timeUntil;
      return true;
    },
  },
  {
    title: 'Karte',
    dataIndex: 'card',
    key: 'card',
    width: '15%',
  },
  {
    title: 'Gerät',
    dataIndex: 'deviceId',
    key: 'deviceId',
    width: '15%',
    filters: (devices || []).map((d) => ({
      text: d.id,
      value: d.id,
    })),
    onFilter: (value, t) => t.deviceId === value,
  },
  {
    title: 'Liste',
    key: 'listName',
    dataIndex: 'listName',
    width: '25%',
    filters: listMap
      ? Array.from(listMap.values()).map(({name}) => ({
          text: name,
          value: name,
        }))
      : undefined,
    onFilter: (value, t) => t.listName === value,
    render: (listName: string, t) => {
      const emoji = listMap?.get(listName)?.emoji;
      return (
        <>
          {emoji && (
            <>
              <span style={{position: 'relative', top: 2}}>
                <Emoji size={16} emoji={emoji} />
              </span>
              &nbsp;
            </>
          )}
          {listName}
        </>
      );
    },
  },
  {
    title: 'Betrag',
    key: 'total',
    width: '15%',
    render: (_, transaction) => {
      const name = (
        <span>
          {currencyFormatter.format(
            (transaction.balanceBefore - transaction.balanceAfter) / 100,
          )}
        </span>
      );

      if (transaction.cartItems.length === 0) {
        return name;
      }

      return (
        <Tooltip
          title={transaction.cartItems.map((item) => (
            <div key={item.product}>
              {item.amount}&times;&nbsp;{item.product}
            </div>
          ))}
        >
          {name}
        </Tooltip>
      );
    },
    sorter: (a: Transaction, b: Transaction) =>
      a.balanceBefore - a.balanceAfter - (b.balanceBefore - b.balanceAfter),
  },
  {
    title: 'Pfand',
    key: 'token',
    width: '15%',
    render: (_, transaction: Transaction) =>
      transaction.tokensBefore - transaction.tokensAfter,
    sorter: (a: Transaction, b: Transaction) =>
      a.tokensBefore - a.tokensAfter - (b.tokensBefore - b.tokensAfter),
  },
];

export default function Transactions({
  initialLists,
  initialDevices,
  initialTransactions,
}: {
  initialLists?: List[];
  initialDevices?: Device[];
  initialTransactions?: TransactionData[];
}) {
  const {items: transactions} = useTransactions(initialTransactions);
  const {items: devices} = useDevices(initialDevices);
  const {items: lists} = useLists(initialLists);
  const [[timeFrom, timeUntil]] = useRecoilState(dateRangeFilterAtom);
  const [data, setData] = useState<Transaction[] | null>(null);
  const [currentDataSource, setCurrentDataSource] = useState<
    Transaction[] | null
  >(null);

  useEffect(() => {
    setData(currentDataSource || transactions || []);
  }, [transactions, currentDataSource]);

  const listMap = lists?.reduce<Map<string, List>>(
    (acc, cv) => acc.set(cv.name, cv),
    new Map(),
  );

  return (
    <App>
      {!transactions ? (
        <Spin size="large" style={{marginTop: 100}} />
      ) : (
        <VirtualTable<TransactionData>
          bordered
          size="small"
          columns={getColums(devices, listMap, timeFrom, timeUntil)}
          dataSource={transactions}
          pagination={false}
          showSorterTooltip={false}
          rowKey="id"
          onChange={(_, __, ___, {currentDataSource}) =>
            setCurrentDataSource(currentDataSource)
          }
        />
      )}
      {data && <TransactionBar data={data} />}
    </App>
  );
}

Transactions.getInitialProps = async ({req}: NextPageContext) => {
  const [
    initialLists,
    initialDevices,
    initialTransactions,
  ] = await Promise.all([
    getInitialLists(req),
    getInitialDevices(req),
    getInitialTransactions(req),
  ]);
  return {initialLists, initialDevices, initialTransactions};
};
