import {Table} from 'antd';
import App from '../../components/App';
import {TransactionData} from '../../components/useData';
import {
  getInitialTransactionsReal,
  getInitialTransactionsVirtual,
} from '../../utils/initialProps';
import {NextPageContext} from 'next';

export default function Cards({
  initialTransactionsReal,
  initialTransactionsVirtual,
}: {
  initialTransactionsReal: TransactionData[];
  initialTransactionsVirtual: TransactionData[];
}) {
  const cards = new Map<
    string,
    {
      firstTransactionTime: number;
      lastTransactionTime: number;
      realTransactionsCount: number;
      realTransactionsSum: number;
      virtualTransactionsCount: number;
      virtualTransactionsSum: number;
    }
  >();
  initialTransactionsReal?.forEach((t) => {
    cards.set(t.card, {
      firstTransactionTime: 0,
      lastTransactionTime: 0,
      realTransactionsCount: 0,
      realTransactionsSum: 0,
      virtualTransactionsCount: 0,
      virtualTransactionsSum: 0,
    });
  });

  return (
    <App>
      {/* <Table
        loading={!devices}
        columns={getColumns(lists, updateDevice)}
        dataSource={devices ?? undefined}
        pagination={false}
        rowKey="id"
      /> */}
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
