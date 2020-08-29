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

export default function TransactionsPage(props: {
  initialDevices?: Device[];
  initialTransactions?: TransactionData[];
}) {
  return (
    <App>
      <TransactionTable {...props} />
    </App>
  );
}

TransactionsPage.getInitialProps = async ({req, query}: NextPageContext) => {
  const transactionType: TransactionType = query.type;
  const [initialDevices, initialTransactions] = await Promise.all([
    getInitialDevices(req),
    transactionType === 'real'
      ? getInitialTransactionsReal(req)
      : getInitialTransactionsVirtual(req),
  ]);
  return {initialDevices, initialTransactions};
};
