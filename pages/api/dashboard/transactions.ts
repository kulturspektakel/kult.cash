import {NextApiRequest, NextApiResponse} from 'next';
import prismaClient from '../../../utils/prismaClient';
import dashboardAuthentication from '../../../utils/dashboardAuthentication';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!(await dashboardAuthentication(req, res))) {
    return;
  }

  const idsToDelete: string[] = JSON.parse(req.body || '[]');
  if (req.method === 'DELETE' && idsToDelete.length > 0) {
    await prismaClient.transactions.deleteMany({
      where: {
        id: {
          in: idsToDelete,
        },
      },
    });
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
