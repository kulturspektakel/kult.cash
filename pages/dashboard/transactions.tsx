import App from '../../components/App';
import {useTransactions, useDevices, useLists} from '../../components/useData';
import {Transaction, Device, List} from '@prisma/client';
import React, {useState, useEffect} from 'react';
import TransactionBar from '../../components/TransactionBar';
import currencyFormatter from '../../utils/currencyFormatter';
import RelativeDate from '../../components/RelativeDate';
import TimeFilter from '../../components/TimeFilter';
import VirtualTable from '../../components/VirtualTable';
import {Spin} from 'antd';
import {ColumnsType} from 'antd/lib/table';
import {atom, useRecoilState} from 'recoil';
import {NextPageContext} from 'next';
import {
  getInitialLists,
  getInitialDevices,
  getInitialTransactions,
} from '../../components/getInitialProps';

export const dateRangeFilterAtom = atom({
  key: 'dateRangeFilter',
  default: [],
});

const getColums = (
  devices: Device[],
  lists: List[],
  timeFrom: number | null,
  timeUntil: number | null,
): ColumnsType<Transaction> => [
  {
    title: 'Zeit',
    dataIndex: 'deviceTime',
    key: 'deviceTime',
    width: '15%',
    render: RelativeDate,
    sorter: (a: Transaction, b: Transaction) =>
      b.deviceTime > a.deviceTime ? 1 : -1,
    filterDropdown: TimeFilter,
    onFilter: (value) => {
      // console.log(value, timeFrom, timeUntil);
      return timeFrom >= value && value <= timeUntil;
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
    onFilter: (value, t: Transaction) => t.deviceId === value,
  },
  {
    title: 'Liste',
    key: 'listName',
    dataIndex: 'listName',
    width: '25%',
    filters: (lists || []).map(({name}) => ({
      text: name,
      value: name,
    })),
    onFilter: (value, t: Transaction) => t.listName === value,
  },
  {
    title: 'Betrag',
    key: 'total',
    width: '15%',
    render: (_, transaction: Transaction) =>
      currencyFormatter.format(
        (transaction.balanceBefore - transaction.balanceAfter) / 100,
      ),
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
  initialTransactions?: Transaction[];
}) {
  const {items: transactions} = useTransactions(initialTransactions);
  const {items: devices} = useDevices(initialDevices);
  const {items: lists} = useLists(initialLists);
  const [[timeFrom, timeUntil]] = useRecoilState(dateRangeFilterAtom);
  const [data, setData] = useState<Transaction[]>(null);
  const [currentDataSource, setCurrentDataSource] = useState<Transaction[]>(
    null,
  );

  useEffect(() => {
    setData(currentDataSource || transactions || []);
  }, [transactions, currentDataSource]);

  console.log('render', timeFrom, timeUntil);

  return (
    <App>
      {!transactions ? (
        <Spin size="large" style={{marginTop: 100}} />
      ) : (
        <VirtualTable<Transaction>
          bordered
          size="small"
          columns={getColums(devices, lists, timeFrom, timeUntil)}
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
