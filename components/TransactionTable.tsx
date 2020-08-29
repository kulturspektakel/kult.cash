import {useDevices, TransactionData, useTransactions} from './useData';
import {Transactions, Device} from '@prisma/client';
import React, {useState, useEffect, useMemo, useCallback} from 'react';
import TransactionBar from './TransactionBar';
import currencyFormatter from '../utils/currencyFormatter';
import TimeFilter from './TimeFilter';
import VirtualTable from './VirtualTable';
import {Spin, Tooltip} from 'antd';
import {ColumnsType} from 'antd/lib/table';
import {revenueFromTransaction, filterBonbude} from '../utils/transaction';
import {ShoppingCartOutlined} from '@ant-design/icons';
import {useRouter} from 'next/router';
import styles from './TransactionTable.module.css';
import moment from 'antd/node_modules/moment';

const getColums = (
  devices: Device[] | undefined,
  lists: Set<string>,
  [cardFilter, setCardFilter]: [
    string | null,
    React.Dispatch<React.SetStateAction<string | null>>,
  ],
): ColumnsType<TransactionData> => [
  {
    title: 'Zeit',
    dataIndex: 'deviceTime',
    key: 'deviceTime',
    width: '15%',
    render: (date) => moment(date).format('dd. DD.MM.YYYY HH:mm'),
    sorter: (a, b) => (b.deviceTime > a.deviceTime ? 1 : -1),
    filterDropdown: TimeFilter,
    defaultSortOrder: 'descend',
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
    filterDropdown: () => setCardFilter(null),
    // filteredValue: [cardFilter[0]],
    // filters: cardFilter[0] ? [cardFilter[0]] : undefined,
    render: (cardID) => (
      <a onClick={() => setCardFilter(cardID)} className={styles.cardCell}>
        {cardID}
      </a>
    ),
    onFilter: (value) => cardFilter === null || cardFilter === value,
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
    align: 'right',
    render: (_, transaction) => {
      return (
        <div className={styles.revenueCell}>
          {currencyFormatter.format(revenueFromTransaction(transaction) / 100)}
          {transaction.cartItems.length > 0 && (
            <Tooltip
              title={transaction.cartItems.map((item) => (
                <div key={item.product}>
                  {item.amount}&times;&nbsp;{item.product}
                </div>
              ))}
            >
              <ShoppingCartOutlined color="#4591F7" />
            </Tooltip>
          )}
        </div>
      );
    },
    sorter: (a: TransactionData, b: TransactionData) =>
      revenueFromTransaction(a) - revenueFromTransaction(b),
  },
  {
    title: 'Pfand',
    key: 'token',
    width: '15%',
    render: (_, transaction: Transactions) => {
      const tokenBalance = transaction.tokensAfter - transaction.tokensBefore;
      if (tokenBalance === 0) {
        return null;
      }
      return (
        <>
          {Math.abs(tokenBalance)}&times;&nbsp;
          {tokenBalance > 0 ? 'Ausgabe' : 'Rückgabe'}
        </>
      );
    },
    sorter: (a: Transactions, b: Transactions) =>
      a.tokensBefore - a.tokensAfter - (b.tokensBefore - b.tokensAfter),
  },
];

// function useFilteredTransactions(initialTransactions?: TransactionData[]) {
//   return filteredTransactions;
// }

export default function TransactionTable({
  initialDevices,
  initialTransactions,
}: {
  initialDevices?: Device[];
  initialTransactions?: TransactionData[];
}) {
  const router = useRouter();
  const isBonbude = Boolean(router.query.bonbude);
  const {items: items, deleteItem: deleteTransactions} = useTransactions(
    initialTransactions,
  );
  const transactions = useMemo(
    () => items?.filter((t) => filterBonbude(t) === isBonbude),
    [items, isBonbude],
  );
  const {items: devices} = useDevices(initialDevices);
  const [data, setData] = useState<TransactionData[] | null>(null);
  const cardFilter = useState<string | null>(null);
  const [currentDataSource, setCurrentDataSource] = useState<
    TransactionData[] | null
  >(null);

  useEffect(() => setData(currentDataSource || transactions || []), [
    transactions,
    currentDataSource,
  ]);

  const onDelete = useCallback(() => {
    const ids = transactions?.map((t) => t.id);
    if (ids) {
      deleteTransactions(ids);
    }
  }, [transactions, deleteTransactions]);

  const lists =
    transactions?.reduce<Set<string>>((acc, cv) => {
      if (cv.listName) {
        acc.add(cv.listName);
      }
      return acc;
    }, new Set()) ?? new Set();

  const columns = getColums(devices, lists, cardFilter);

  return (
    <>
      <div className={styles.transactionsTableContainer}>
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
      {data && (
        <TransactionBar data={data} columns={columns} onDelete={onDelete} />
      )}
    </>
  );
}
