import {GetServerSideProps} from 'next';
import {createHash} from 'crypto';
import Card from '../../components/Card';

function verifySignature(payload: Buffer): boolean {
  const buffer = Buffer.concat([
    payload.subarray(0, 12),
    Buffer.from(process.env.SALT ?? '', 'utf-8'),
  ]);

  const signature = createHash('sha1')
    .update(buffer)
    .digest('hex')
    .substring(0, 10);
  return signature === payload.subarray(12).toString('hex');
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const payload = String(context.query.payload);

  const payloadBuffer = Buffer.from(payload, 'base64');
  if (verifySignature(payloadBuffer)) {
    const deposit = payloadBuffer.slice(9, 10).readUInt8();
    const balance = payloadBuffer.slice(10, 12).readUInt16LE();
    return {props: {balance, deposit}};
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
