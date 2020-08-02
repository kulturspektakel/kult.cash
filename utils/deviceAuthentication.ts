import {parseDeviceData} from './updateLastSeen';
import {NextApiRequest, NextApiResponse} from 'next';
import sha1 from './sha1';

const MATCHER = /^Bearer (.+)$/;

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const authorization: string | undefined = req.headers['authorization'];
  const {id} = parseDeviceData(req);
  const match = authorization?.match(MATCHER);
  const signature = match && match.length > 1 ? match[1] : req.query['token'];
  if (signature !== sha1(`${id}${process.env.SALT}`)) {
    throw res.status(401).send('Unauthorizeed');
  }
}
