import App from '../../../components/App';
import {
  TransactionData,
  TransactionType,
  useVirtualTransactions,
  useRealTransactions,
  useDevices,
} from '../../../components/useData';
import {Device} from '@prisma/client';
import React from 'react';
import {NextPageContext} from 'next';
import {
  getInitialDevices,
  getInitialTransactionsReal,
  getInitialTransactionsVirtual,
} from '../../../utils/initialProps';
import TransactionTable from '../../../components/TransactionTable';
import {useRouter} from 'next/router';

type Props = {
  devices: Device[];
  initialTransactions?: TransactionData[];
  type: TransactionType;
};

function VirtualTransactionsPage({initialTransactions, ...props}: Props) {
  const {items, deleteItem} = useVirtualTransactions(initialTransactions);
  return (
    <TransactionTable
      {...props}
      transactions={items}
      deleteTransactions={deleteItem}
    />
  );
}

function RealTransactionsPage({initialTransactions, ...props}: Props) {
  const {items, deleteItem} = useRealTransactions(initialTransactions);
  return (
    <TransactionTable
      {...props}
      transactions={items}
      deleteTransactions={deleteItem}
    />
  );
}

export default function TransactionsPage({
  initialDevices,
  ...props
}: {
  initialDevices?: Device[];
  initialTransactions?: TransactionData[];
}) {
  const {
    query: {type, card},
  } = useRouter();
  const {items: devices} = useDevices(initialDevices);
  const p = {
    ...props,
    type: type as TransactionType,
    defaultFilteredValue: {card: card ? [String(card)] : undefined},
    devices: devices ?? [],
  };

  return (
    <App>
      {type === TransactionType.Real ? (
        <RealTransactionsPage {...p} />
      ) : (
        <VirtualTransactionsPage {...p} />
      )}
    </App>
  );
}

export const getServerSideProps = async ({req, query}: NextPageContext) => {
  const transactionType = query.type;
  const [initialDevices, initialTransactions] = await Promise.all([
    getInitialDevices(req),
    transactionType === TransactionType.Real
      ? getInitialTransactionsReal(req)
      : getInitialTransactionsVirtual(req),
  ]);
  return {
    props: {initialDevices, initialTransactions},
  };
};
