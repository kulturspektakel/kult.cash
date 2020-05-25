import {parseUserAgent} from './updateLastSeen';
import {NextApiRequest, NextApiResponse} from 'next';
import sha1 from './sha1';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const matcher = /^Bearer (.+)$/;
  const authorization: string | undefined = req.headers['authorization'];
  const {id} = parseUserAgent(req);
  const match = authorization?.match(matcher);
  if (
    !match ||
    match.length !== 2 ||
    match[1] !== sha1(`${id}${process.env.SALT}`)
  ) {
    throw res.status(401).send('Unauthorizeed');
  }
}
