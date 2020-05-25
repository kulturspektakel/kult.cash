import {Transaction} from '@prisma/client';

export default function TransactionStats(props: {data: Transaction[]}) {
  return <div>{props.data.length}</div>;
}
