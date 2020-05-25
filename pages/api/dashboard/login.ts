import {NextApiRequest, NextApiResponse} from 'next';
import {serialize} from 'cookie';
import prismaClient from '../../../utils/prismaClient';
import {v4 as uuidv4} from 'uuid';
import absoluteUrl from 'next-absolute-url';

export type OAuthSuccess = {
  ok: true;
  access_token: string;
  scope: string;
  user_id: string;
  team_id: string;
  enterprise_id: null | string;
  team_name: string;
};

const TOKEN_NAME = 'token';
const MAX_AGE = 60 * 60 * 8; // 8 hours

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {code} = req.query;
  if (code) {
    const {protocol, host} = absoluteUrl(req);
    const redirectUri = `${protocol}//${host}${req.url.split('?')[0]}`;
    const data = await fetch(
      `https://slack.com/api/oauth.access?client_id=${process.env.NEXT_PUBLIC_SLACK_CLIENT_ID}&client_secret=${process.env.SLACK_CLIENT_SECRET}&code=${code}&redirect_uri=${redirectUri}`,
    );
    const result: OAuthSuccess | {ok: false} = await data.json();
    if (result && result.ok) {
      const expires = new Date(Date.now() + MAX_AGE * 1000);
      const token = uuidv4();
      await prismaClient.session.create({
        data: {
          expires,
          token,
          userId: result.user_id,
        },
      });

      res.writeHead(301, {
        Location: '/dashboard',
        'Set-Cookie': serialize(TOKEN_NAME, token, {
          maxAge: MAX_AGE,
          expires,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          sameSite: 'lax',
        }),
      });
      return res.end();
    }
  }
  return res.status(401).send('Unauthorized');
};
