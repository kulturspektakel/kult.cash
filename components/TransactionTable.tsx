import {
  useDevices,
  TransactionData,
  useTransactions,
  TransactionType,
} from './useData';
import {Transactions, Device} from '@prisma/client';
import React, {useState, useCallback, useRef} from 'react';
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
import CardFilter from './CardFilter';
import {FilterDropdownProps} from 'antd/lib/table/interface';

const getColums = (
  devices: Device[] | undefined,
  lists: Set<string>,
  cards: Set<string>,
): ColumnsType<TransactionData> => {
  let cardFilter: FilterDropdownProps;

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
      onFilter: (value, t, ...args) => {
        console.log(value, ...args);
        return String(value) === t.card;
      },
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
      onFilter: (value, t) =>
        cardFilter.selectedKeys.length === 0 ||
        cardFilter.selectedKeys.findIndex((i) => t.deviceId === i) > -1,
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
};

export type ControlledFilter<T> = {
  setFilter: (value: T[]) => void;
  addFilter: (value: T) => void;
  values: Set<T>;
  isFiltered: boolean;
  options: Set<T>;
};

function useControlledFilter<T>(options?: Set<T>): ControlledFilter<T> {
  const [values, setValues] = useState<Set<T>>(new Set());
  return {
    setFilter: (v: T[]) => setValues(new Set(v)),
    addFilter: (v: T) => setValues(new Set([...values, v])),
    values,
    isFiltered: values.size > 0,
    options: options ?? new Set(),
  };
}

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
  const cardFilter = useControlledFilter<string | null>(
    new Set(transactions?.map((t) => t.card)),
  );
  const [currentDataSource, setCurrentDataSource] = useState<TransactionData[]>(
    transactions || [],
  );

  const onChange = useCallback((_, filters, ___, {currentDataSource}) => {
    setCurrentDataSource(currentDataSource);
  }, []);

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

  const columns = getColums(
    devices,
    lists,
    transactions.reduce((acc, cv) => acc.add(cv.card), new Set()),
  );
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
            dataSource={currentDataSource}
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
