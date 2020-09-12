import {Badge, Tooltip} from 'antd';
import App, {Route} from '../../components/App';
import {
  TransactionData,
  useVirtualTransactions,
  useRealTransactions,
} from '../../components/useData';
import {
  getInitialTransactionsReal,
  getInitialTransactionsVirtual,
} from '../../utils/initialProps';
import {NextPageContext} from 'next';
import {useMemo} from 'react';
import VirtualTable from '../../components/VirtualTable';
import {
  revenueFromTransaction,
  realRevenueFromTransaction,
  virtualRevenueFromTransaction,
} from '../../utils/transaction';
import currencyFormatter from '../../utils/currencyFormatter';
import Link from 'next/link';
import moment, {Moment} from 'moment';

type CardSum = {
  card: string;
  lastDay: Moment;
  days: [boolean, boolean, boolean];
  realTransactionsCount: number;
  realTransactionsSum: number;
  virtualTransactionsCount: number;
  virtualTransactionsSum: number;
  balance: number;
  tokens: number;
  lastTransactionDate: Moment;
};

const DAY_FORMAT = 'dd, DD.MM.YYYY';

function useCardData(
  initialTransactionsReal?: TransactionData[],
  initialTransactionsVirtual?: TransactionData[],
) {
  const {items: transactionsVirtual} = useVirtualTransactions(
    initialTransactionsVirtual,
  );
  const {items: transactionsReal} = useRealTransactions(
    initialTransactionsReal,
  );

  return useMemo((): CardSum[] => {
    const cards = new Set<string>();
    let maxTime = 0;
    const reducer = (
      acc: Map<string, TransactionData[]>,
      t: TransactionData,
    ) => {
      let transactions = acc.get(t.card);
      maxTime = Math.max(maxTime, new Date(t.deviceTime).getTime());
      cards.add(t.card);
      if (!transactions) {
        transactions = [];
        acc.set(t.card, transactions);
      }
      transactions.push(t);
      return acc;
    };
    const virtual = transactionsVirtual?.reduce(reducer, new Map());
    const real = transactionsReal?.reduce(reducer, new Map());

    const getDays = (card: string): [boolean, boolean, boolean] => {
      const dayMap = [
        ...(real?.get(card) ?? []),
        ...(virtual?.get(card) ?? []),
      ].reduce((acc, t) => {
        acc.set(moment(t.deviceTime).format(DAY_FORMAT), true);
        return acc;
      }, new Map<string, boolean>());

      return [
        dayMap.has(moment(maxTime).subtract(2, 'days').format(DAY_FORMAT)),
        dayMap.has(moment(maxTime).subtract(1, 'days').format(DAY_FORMAT)),
        dayMap.has(moment(maxTime).format(DAY_FORMAT)),
      ];
    };

    const lastTransaction = (card: string) => {
      const {balanceAfter, tokensAfter, deviceTime} = [
        ...(real?.get(card) ?? []),
        ...(virtual?.get(card) ?? []),
      ]
        .sort((a, b) => (a.deviceTime > b.deviceTime ? 1 : -1))
        .pop() as TransactionData;
      return {
        balance: balanceAfter,
        tokens: tokensAfter,
        lastTransactionDate: moment(deviceTime),
      };
    };

    return Array.from(cards).map((card: string) => ({
      card,
      days: getDays(card),
      lastDay: moment(maxTime),
      realTransactionsCount: real?.get(card)?.length ?? 0,
      realTransactionsSum:
        real
          ?.get(card)
          ?.reduce((acc, t) => (acc += realRevenueFromTransaction(t)), 0) ?? 0,
      virtualTransactionsCount: virtual?.get(card)?.length ?? 0,
      virtualTransactionsSum:
        virtual
          ?.get(card)
          ?.reduce((acc, t) => (acc += virtualRevenueFromTransaction(t)), 0) ??
        0,
      ...lastTransaction(card),
    }));
  }, [transactionsReal, transactionsVirtual]);
}

export default function Cards({
  initialTransactionsReal,
  initialTransactionsVirtual,
}: {
  initialTransactionsReal?: TransactionData[];
  initialTransactionsVirtual?: TransactionData[];
}) {
  const cards = useCardData(
    initialTransactionsReal,
    initialTransactionsVirtual,
  );

  return (
    <App>
      <VirtualTable<CardSum>
        columns={[
          {
            key: 'card',
            dataIndex: 'card',
            title: 'Karte',
            width: '15%',
          },
          {
            key: 'virtualTransactionsSum',
            dataIndex: 'virtualTransactionsSum',
            align: 'right',
            title: 'Ausgaben',
            sorter: (a, b) =>
              a.virtualTransactionsSum - b.virtualTransactionsSum,
            render: (v, t) => (
              <Link href={{pathname: Route.Virtual, query: {card: t.card}}}>
                <a>{currencyFormatter.format(v / 100)}</a>
              </Link>
            ),
            width: '20%',
          },
          {
            key: 'realTransactionsCount',
            dataIndex: 'realTransactionsCount',
            title: 'Bonbude',
            align: 'right',
            width: '15%',
            sorter: (a, b) => a.realTransactionsCount - b.realTransactionsCount,
            render: (v, t) => (
              <Link href={{pathname: Route.Real, query: {card: t.card}}}>
                <a>{currencyFormatter.format(v / 100)}</a>
              </Link>
            ),
          },
          {
            key: 'balance',
            dataIndex: 'balance',
            title: 'Guthaben',
            align: 'right',
            width: '20%',
            sorter: (a, b) => a.balance - b.balance,
            render: (v, t) => (
              <Tooltip
                title={`Stand: ${t.lastTransactionDate.format(
                  'DD.MM.YYYY HH:mm',
                )}`}
              >
                {currencyFormatter.format(v / 100) as any}
              </Tooltip>
            ),
          },
          {
            key: 'tokens',
            dataIndex: 'tokens',
            title: 'Pfandmarken',
            align: 'right',
            width: '20%',
            sorter: (a, b) => a.tokens - b.tokens,
          },
          {
            key: 'days',
            dataIndex: 'days',
            title: 'Tage',
            width: '15%',
            sorter: (a, b) =>
              a.days.reduce((acc, v) => acc + (v ? 1 : 0), 0) -
              b.days.reduce((acc, v) => acc + (v ? 1 : 0), 0),
            render: (v, r) => (
              <>
                {v.map((vv: boolean, i: number) => (
                  <Tooltip
                    key={i}
                    title={moment(r.lastDay)
                      .subtract(v.length - i - 1, 'days')
                      .format(DAY_FORMAT)}
                  >
                    <Badge status={vv ? 'success' : 'default'} />
                  </Tooltip>
                ))}
              </>
            ),
          },
        ]}
        dataSource={cards}
        pagination={false}
        rowKey="id"
        bordered
        size="small"
        showSorterTooltip={false}
      />
    </App>
  );
}

export const getServerSideProps = async ({req}: NextPageContext) => {
  const [
    initialTransactionsReal,
    initialTransactionsVirtual,
  ] = await Promise.all([
    getInitialTransactionsReal(req),
    getInitialTransactionsVirtual(req),
  ]);
  return {
    props: {initialTransactionsReal, initialTransactionsVirtual},
  };
};
