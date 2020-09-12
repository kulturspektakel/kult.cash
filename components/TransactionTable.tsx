import {TransactionData, TransactionType} from './useData';
import {Device} from '@prisma/client';
import React, {useState, useCallback} from 'react';
import TransactionBar from './TransactionBar';
import currencyFormatter from '../utils/currencyFormatter';
import TimeFilter from './TimeFilter';
import VirtualTable from './VirtualTable';
import {Tooltip} from 'antd';
import {ColumnsType} from 'antd/lib/table';
import {revenueFromTransaction} from '../utils/transaction';
import {ShoppingCartOutlined} from '@ant-design/icons';
import styles from './TransactionTable.module.css';
import moment from 'antd/node_modules/moment';
import {FilterDropdownProps} from 'antd/lib/table/interface';
import memoize from 'lodash.memoize';
import CardFilter from './CardFilter';

type DefaultFilters = {
  card?: string[];
};

const getColums = memoize(
  (
    devices: Device[] | undefined,
    transactions: TransactionData[] | undefined,
    type: TransactionType,
    defaultFilteredValue?: DefaultFilters,
  ): ColumnsType<TransactionData> => {
    let cardFilter: FilterDropdownProps;

    const lists =
      transactions?.reduce<Set<string>>((acc, cv) => {
        if (cv.listName) {
          acc.add(cv.listName);
        }
        return acc;
      }, new Set()) ?? new Set();

    const cards = transactions?.reduce(
      (acc, cv) => acc.add(cv.card),
      new Set<string>(),
    );

    return [
      {
        title: 'Zeit',
        dataIndex: 'deviceTime',
        key: 'deviceTime',
        width: '18%',
        render: (date) => moment(date).format('dd. DD.MM.YYYY HH:mm'),
        sorter: (a, b) => (b.deviceTime > a.deviceTime ? 1 : -1),
        filterDropdown: TimeFilter,
        defaultSortOrder: 'descend',
        onFilter: (value: any, t) => {
          if (value) {
            return (
              value[0]?.isBefore(t.deviceTime) &&
              value[1]?.isAfter(t.deviceTime)
            );
          }
          return true;
        },
      },
      {
        title: 'Karte',
        dataIndex: 'card',
        key: 'card',
        width: '12%',
        defaultFilteredValue: defaultFilteredValue?.card,
        filterDropdown: (filterProps) => {
          cardFilter = filterProps;
          return (
            <CardFilter {...filterProps} cards={Array.from(cards ?? [])} />
          );
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
                revenueFromTransaction(transaction, type) / 100,
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
          revenueFromTransaction(a, type) - revenueFromTransaction(b, type),
      },
      {
        title: 'Pfand',
        key: 'token',
        width: '15%',
        render: (_, transaction: TransactionData) => {
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
        sorter: (a: TransactionData, b: TransactionData) =>
          a.tokensBefore - a.tokensAfter - (b.tokensBefore - b.tokensAfter),
      },
    ];
  },
  // memoize multiple arguments
  (...args) => args.map((arg) => arg.length).join(','),
);

export default function TransactionTable({
  devices,
  transactions,
  deleteTransactions,
  defaultFilteredValue,
  type,
}: {
  devices: Device[];
  transactions: TransactionData[] | undefined;
  deleteTransactions: (ids: string[]) => void;
  type: TransactionType;
  defaultFilteredValue?: DefaultFilters;
}) {
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

  const columns = getColums(devices, transactions, type, defaultFilteredValue);

  return (
    <>
      <div className={styles.transactionsTableContainer}>
        <VirtualTable<TransactionData>
          bordered
          size="small"
          columns={columns}
          dataSource={transactions}
          loading={!transactions}
          pagination={false}
          showSorterTooltip={false}
          rowKey="id"
          onChange={onChange}
        />
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
