import {
  useDevices,
  TransactionData,
  useTransactions,
  TransactionType,
} from './useData';
import {Transactions, Device} from '@prisma/client';
import React, {useState, useCallback} from 'react';
import TransactionBar from './TransactionBar';
import currencyFormatter from '../utils/currencyFormatter';
import TimeFilter from './TimeFilter';
import VirtualTable from './VirtualTable';
import {Spin, Tooltip} from 'antd';
import {ColumnsType} from 'antd/lib/table';
import {revenueFromTransaction} from '../utils/transaction';
import {ShoppingCartOutlined} from '@ant-design/icons';
import styles from './TransactionTable.module.css';
import moment from 'antd/node_modules/moment';
import {FilterDropdownProps} from 'antd/lib/table/interface';
import memoize from 'lodash.memoize';
import CardFilter from './CardFilter';

const getColums = memoize(
  (
    devices: Device[] | undefined,
    transactions: TransactionData[],
  ): ColumnsType<TransactionData> => {
    let cardFilter: FilterDropdownProps;

    const lists =
      transactions?.reduce<Set<string>>((acc, cv) => {
        if (cv.listName) {
          acc.add(cv.listName);
        }
        return acc;
      }, new Set()) ?? new Set();

    const cards = transactions.reduce(
      (acc, cv) => acc.add(cv.card),
      new Set<string>(),
    );

    return [
      {
        title: 'Zeit',
        dataIndex: 'deviceTime',
        key: 'deviceTime',
        width: '15%',
        render: (date) => moment(date).format('dd. DD.MM.YYYY HH:mm'),
        sorter: (a, b) => (b.deviceTime > a.deviceTime ? 1 : -1),
        filterDropdown: TimeFilter,
        defaultSortOrder: 'descend',
        onFilter: (value, t) => {
          if (value) {
            return (
              value[0].isBefore(t.deviceTime) && value[1].isAfter(t.deviceTime)
            );
          }
          return true;
        },
      },
      {
        title: 'Karte',
        dataIndex: 'card',
        key: 'card',
        width: '15%',
        filterDropdown: (filterProps) => {
          cardFilter = filterProps;
          return <CardFilter {...filterProps} cards={cards} />;
        },
        render: (cardID) => (
          <a
            onClick={() => {
              cardFilter.setSelectedKeys([cardID]);
              cardFilter.confirm();
            }}
            className={styles.cardCell}
          >
            {cardID}
          </a>
        ),
        onFilter: (value, t) => value === t.card,
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
        onFilter: (value, t) => value === t.deviceId,
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
              {currencyFormatter.format(
                revenueFromTransaction(transaction) / 100,
              )}
              {transaction.cartItems.length > 0 && (
                <Tooltip
                  title={transaction.cartItems.map((item) => (
                    <div key={item.product}>
                      {item.amount}&times;&nbsp;{item.product}
                    </div>
                  ))}
                >
                  <ShoppingCartOutlined />
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
          const tokenBalance =
            transaction.tokensAfter - transaction.tokensBefore;
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
  },
  // memoize multiple arguments
  (...args) => args.map((arg) => arg.length).join(','),
);

export default function TransactionTable({
  initialDevices,
  initialTransactions,
}: {
  initialDevices?: Device[];
  initialTransactions?: TransactionData[];
  transactionType: TransactionType;
}) {
  const {items: devices} = useDevices(initialDevices);
  const {items: transactions, deleteItem: deleteTransactions} = useTransactions(
    initialTransactions,
  );
  const [currentDataSource, setCurrentDataSource] = useState<TransactionData[]>(
    transactions || [],
  );

  const onChange = useCallback(
    (_, __, ___, {currentDataSource}) =>
      setCurrentDataSource(currentDataSource),
    [],
  );

  const onDelete = useCallback(() => {
    const ids = transactions?.map((t) => t.id);
    if (ids) {
      deleteTransactions(ids);
    }
  }, [transactions, deleteTransactions]);

  const columns = getColums(devices, transactions);

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
            onChange={onChange}
          />
        )}
      </div>
      {currentDataSource && (
        <TransactionBar
          data={currentDataSource}
          columns={columns}
          onDelete={onDelete}
        />
      )}
    </>
  );
}
