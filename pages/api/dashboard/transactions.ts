import {NextApiRequest, NextApiResponse} from 'next';
import prismaClient from '../../../utils/prismaClient';
import dashboardAuthentication from '../../../utils/dashboardAuthentication';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dashboardAuthentication(req, res);

  const transactions = await prismaClient.transactions.findMany({
    include: {
      cartItems: {
        select: {
          amount: true,
          price: true,
          product: true,
        },
      },
    },
  });
  res.json(transactions);
};
