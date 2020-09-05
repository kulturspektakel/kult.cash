import {Table, Badge, Tooltip} from 'antd';
import App, {Route} from '../../components/App';
import {TransactionData} from '../../components/useData';
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
} from '../../utils/transaction';
import currencyFormatter from '../../utils/currencyFormatter';
import Link from 'next/link';

type CardSum = {
  card: string;
  firstDay: Date;
  days: [boolean, boolean, boolean];
  realTransactionsCount: number;
  realTransactionsSum: number;
  virtualTransactionsCount: number;
  virtualTransactionsSum: number;
};

function useCardData(
  initialTransactionsReal?: TransactionData[],
  initialTransactionsVirtual?: TransactionData[],
) {
  return useMemo(() => {
    const cards = new Set<string>();
    const reducer = (
      acc: Map<string, TransactionData[]>,
      t: TransactionData,
    ) => {
      let transactions = acc.get(t.card);
      cards.add(t.card);
      if (!transactions) {
        transactions = [];
        acc.set(t.card, transactions);
      }
      transactions.push(t);
      return acc;
    };
    const virtual = initialTransactionsVirtual?.reduce(reducer, new Map());
    const real = initialTransactionsReal?.reduce(reducer, new Map());

    return Array.from(cards).map((card: string) => ({
      card,
      firstDay: new Date(
        [...(real?.get(card) ?? []), ...(virtual?.get(card) ?? [])].reduce(
          (acc, t) => Math.min(acc, t.deviceTime),
          new Date(),
        ),
      ),
      days: [true, false, true],
      realTransactionsCount: real?.get(card)?.length ?? 0,
      realTransactionsSum:
        real
          ?.get(card)
          ?.reduce((acc, t) => (acc += realRevenueFromTransaction(t)), 0) ?? 0,
      virtualTransactionsCount: virtual?.get(card)?.length ?? 0,
      virtualTransactionsSum:
        virtual
          ?.get(card)
          ?.reduce((acc, t) => (acc += revenueFromTransaction(t)), 0) ?? 0,
    }));
  }, [initialTransactionsReal, initialTransactionsVirtual]);
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
              b.virtualTransactionsSum > a.virtualTransactionsSum ? -1 : 1,
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
            width: '45%',
            sorter: (a, b) =>
              b.realTransactionsCount > a.realTransactionsCount ? -1 : 1,
            render: (v, t) => (
              <Link href={{pathname: Route.Real, query: {card: t.card}}}>
                <a>{currencyFormatter.format(v / 100)}</a>
              </Link>
            ),
          },
          {
            key: 'days',
            dataIndex: 'days',
            title: 'Tage',
            width: '20%',
            render: (v) => (
              <>
                {v.map((vv: boolean, i: number) => (
                  <Tooltip key={i} title="as">
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
      />
    </App>
  );
}

Cards.getInitialProps = async ({req}: NextPageContext) => {
  const [
    initialTransactionsReal,
    initialTransactionsVirtual,
  ] = await Promise.all([
    getInitialTransactionsReal(req),
    getInitialTransactionsVirtual(req),
  ]);
  return {initialTransactionsReal, initialTransactionsVirtual};
};
