import {NextApiRequest, NextApiResponse} from 'next';
import {getSession} from 'next-auth/client';

export default async function dashboardAuthentication(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({req});
  if (session && new Date(session.expires) > new Date()) {
    return true;
  }
  res.status(401).send('Unauthorized');
  return false;
}
