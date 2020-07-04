import {TransactionData} from '../components/useData';

const TOKEN_VALUE = 200;

export function revenueFromTransaction(transaction: TransactionData): number {
  return (
    transaction.balanceBefore -
    transaction.balanceAfter -
    (transaction.tokensAfter - transaction.tokensBefore) * TOKEN_VALUE
  );
}

export function filterBonbude(transaction: TransactionData): boolean {
  return (transaction.listName || '').indexOf('Bon') > -1;
}
