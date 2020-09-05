import {TransactionData} from '../components/useData';

const TOKEN_VALUE = 200;

export function revenueFromTransaction(transaction: TransactionData): number {
  return (
    transaction.balanceBefore -
    transaction.balanceAfter -
    (transaction.tokensAfter - transaction.tokensBefore) * TOKEN_VALUE
  );
}

export function realRevenueFromTransaction(
  transaction: TransactionData,
): number {
  return (
    transaction.balanceAfter -
    transaction.balanceBefore -
    (transaction.tokensAfter - transaction.tokensBefore) * TOKEN_VALUE
  );
}
