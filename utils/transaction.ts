import {TransactionData} from '../components/useData';

const TOKEN_VALUE = 200;

export function revenueFromTransaction(transaction: TransactionData): number {
  return (
    transaction.balanceBefore -
    transaction.balanceAfter -
    (transaction.tokensAfter - transaction.tokensBefore) * TOKEN_VALUE
  );
}
