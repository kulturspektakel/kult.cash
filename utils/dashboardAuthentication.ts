import {NextApiRequest, NextApiResponse} from 'next';
import {parse} from 'cookie';
import prismaClient from './prismaClient';

export default async function dashboardAuthentication(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const cookie = req.headers?.cookie;
  const {token} = parse(cookie || '');
  if (token) {
    const session = await prismaClient.session.findOne({
      where: {
        token,
      },
    });
    if (session && session.expires > new Date()) {
      return true;
    }
    try {
      await prismaClient.session.delete({
        where: {
          token,
        },
      });
    } catch (e) {}
  }
  res.status(401).send('Unauthorized');
  return false;
}
