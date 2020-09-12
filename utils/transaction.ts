import {TransactionData, TransactionType} from '../components/useData';

const TOKEN_VALUE = 200;

export function revenueFromTransaction(
  transaction: TransactionData,
  type: TransactionType,
): number {
  return type === TransactionType.Real
    ? realRevenueFromTransaction(transaction)
    : virtualRevenueFromTransaction(transaction);
}

export function virtualRevenueFromTransaction(
  transaction: TransactionData,
): number {
  return (
    transaction.balanceBefore -
    transaction.balanceAfter -
    (transaction.tokensAfter - transaction.tokensBefore) * TOKEN_VALUE
  );
}

export function realRevenueFromTransaction(
  transaction: TransactionData,
): number {
  return virtualRevenueFromTransaction(transaction) * -1;
}
