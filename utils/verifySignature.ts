import {createHash} from 'crypto';

export default (
  balance: number,
  tokens: number,
  id: string,
  signature: string,
) =>
  createHash('sha1')
    .update(`${balance}${tokens}${id}${process.env.SALT}`)
    .digest('hex')
    .substr(0, 10) === signature;
