import {NextApiRequest, NextApiResponse} from 'next';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

const options = {
  providers: [
    Providers.Slack({
      clientId: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID ?? '',
      clientSecret: process.env.SLACK_CLIENT_SECRET ?? '',
    }),
  ],
  // database: process.env.DATABASE_URL,
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);
