import {NextApiRequest, NextApiResponse} from 'next';
import prismaClient from '../../../utils/prismaClient';
import dashboardAuthentication from '../../../utils/dashboardAuthentication';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!(await dashboardAuthentication(req, res))) {
    return;
  }

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
