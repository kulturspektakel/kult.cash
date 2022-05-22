import {GetServerSideProps} from 'next';
import {createHash} from 'crypto';
import Card from '../../../components/Card';

const verifySignature = (
  balance: number,
  deposit: number,
  id: string,
  signature: string,
) => {
  return (
    createHash('sha1')
      .update(`${balance}${deposit}${id}${process.env.SALT}`)
      .digest('hex')
      .substr(0, 10) === signature
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const BALANCE_ROUTE = /^\/([A-F0-9]+)\/([0-9]{4})([0-9]{1})([0-9a-f]+)$/;
  const pathname = context.resolvedUrl;

  if (BALANCE_ROUTE.test(pathname)) {
    const [, id, b, t, signature] = pathname.match(BALANCE_ROUTE) ?? [];
    const balance = parseInt(b, 10);
    const deposit = parseInt(t, 10);

    if (verifySignature(balance, deposit, id, signature)) {
      return {props: {balance, deposit}};
    }
  }
  context.res.statusCode = 404;
  context.res.end();
  return {props: {balance: -1, deposit: -1}};
};

type Props = {
  balance: number;
  deposit: number;
};

export default function Balance(props: Props) {
  return <Card {...props} />;
}
