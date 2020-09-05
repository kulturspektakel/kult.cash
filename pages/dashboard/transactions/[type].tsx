import App from '../../../components/App';
import {TransactionData, TransactionType} from '../../../components/useData';
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

export default function TransactionsPage(props: {
  initialDevices?: Device[];
  initialTransactions?: TransactionData[];
  transactionType: TransactionType;
}) {
  const {
    query: {card},
  } = useRouter();
  return (
    <App>
      <TransactionTable
        {...props}
        defaultFilteredValue={{card: card ? [String(card)] : undefined}}
      />
    </App>
  );
}

TransactionsPage.getInitialProps = async ({req, query}: NextPageContext) => {
  const transactionType = query.type;
  const [initialDevices, initialTransactions] = await Promise.all([
    getInitialDevices(req),
    transactionType === TransactionType.Real
      ? getInitialTransactionsReal(req)
      : getInitialTransactionsVirtual(req),
  ]);
  return {initialDevices, initialTransactions, transactionType: query.type};
};
