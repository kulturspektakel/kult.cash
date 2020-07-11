import App from '../../components/App';
import {
  useTransactions,
  useDevices,
  TransactionData,
} from '../../components/useData';
import {Transactions, Device, List} from '@prisma/client';
import React, {useState, useEffect, useMemo} from 'react';
import TransactionBar from '../../components/TransactionBar';
import currencyFormatter from '../../utils/currencyFormatter';
import RelativeDate from '../../components/RelativeDate';
import TimeFilter, {
  dateRangeFilterAtom,
  DateRange,
} from '../../components/TimeFilter';
import VirtualTable from '../../components/VirtualTable';
import {Spin, Tooltip} from 'antd';
import {ColumnsType} from 'antd/lib/table';
import {useRecoilState} from 'recoil';
import {NextPageContext} from 'next';
import {
  getInitialDevices,
  getInitialTransactions,
} from '../../components/getInitialProps';
import {Emoji} from 'emoji-mart';
import {revenueFromTransaction, filterBonbude} from '../../utils/transaction';
import {ShoppingCartOutlined} from '@ant-design/icons';
import {useRouter} from 'next/router';

const getColums = (
  devices: Device[] | null,
  lists: Set<string>,
  dateRange: DateRange,
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
    filters:
      lists.size > 0
        ? Array.from(lists).map((name) => ({
            text: name,
            value: name,
          }))
        : undefined,
    onFilter: (value, t) => t.listName === value,
  },
  {
    title: 'Umsatz',
    key: 'total',
    width: '15%',
    render: (_, transaction) => {
      return (
        <>
          <span>
            {currencyFormatter.format(
              revenueFromTransaction(transaction) / 100,
            )}
          </span>
          {transaction.cartItems.length > 0 && (
            <>
              &nbsp;
              <Tooltip
                title={transaction.cartItems.map((item) => (
                  <div key={item.product}>
                    {item.amount}&times;&nbsp;{item.product}
                  </div>
                ))}
              >
                <ShoppingCartOutlined />
              </Tooltip>
            </>
          )}
        </>
      );
    },
    sorter: (a: Transactions, b: Transactions) =>
      a.balanceBefore - a.balanceAfter - (b.balanceBefore - b.balanceAfter),
  },
  {
    title: 'Pfand',
    key: 'token',
    width: '15%',
    render: (_, transaction: Transactions) =>
      transaction.tokensAfter - transaction.tokensBefore,
    sorter: (a: Transactions, b: Transactions) =>
      a.tokensBefore - a.tokensAfter - (b.tokensBefore - b.tokensAfter),
  },
];

function useFilteredTransactions(initialTransactions?: TransactionData[]) {
  const router = useRouter();
  const isBonbude = Boolean(router.query.bonbude);
  useEffect(() => {}, []);
  const {items} = useTransactions(initialTransactions);
  const filteredTransactions = useMemo(
    () => items?.filter((t) => filterBonbude(t) === isBonbude),
    [items, isBonbude],
  );
  return filteredTransactions;
}

export default function TransactionsPage({
  initialDevices,
  initialTransactions,
}: {
  initialDevices?: Device[];
  initialTransactions?: TransactionData[];
}) {
  const transactions = useFilteredTransactions(initialTransactions);
  const {items: devices} = useDevices(initialDevices);
  const [timeRange] = useRecoilState(dateRangeFilterAtom);
  const [data, setData] = useState<TransactionData[] | null>(null);
  const [currentDataSource, setCurrentDataSource] = useState<
    TransactionData[] | null
  >(null);

  useEffect(() => setData(currentDataSource || transactions || []), [
    transactions,
    currentDataSource,
  ]);

  const lists = transactions?.reduce<Set<string>>((acc, cv) => {
    if (cv.listName) {
      acc.add(cv.listName);
    }
    return acc;
  }, new Set());

  const columns = getColums(devices, lists, timeRange);

  return (
    <App>
      <div style={{flexGrow: 1}}>
        {!transactions ? (
          <Spin size="large" style={{marginTop: 100}} />
        ) : (
          <VirtualTable<TransactionData>
            bordered
            size="small"
            columns={columns}
            dataSource={transactions}
            pagination={false}
            showSorterTooltip={false}
            rowKey="id"
            onChange={(_, __, ___, {currentDataSource}) =>
              setCurrentDataSource(currentDataSource)
            }
          />
        )}
      </div>
      {data && <TransactionBar data={data} columns={columns} />}
    </App>
  );
}

TransactionsPage.getInitialProps = async ({req}: NextPageContext) => {
  const [initialDevices, initialTransactions] = await Promise.all([
    getInitialDevices(req),
    getInitialTransactions(req),
  ]);
  return {initialDevices, initialTransactions};
};
