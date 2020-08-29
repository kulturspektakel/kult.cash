import {NextApiRequest, NextApiResponse} from 'next';
import prismaClient from '../../../../utils/prismaClient';
import dashboardAuthentication from '../../../../utils/dashboardAuthentication';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!(await dashboardAuthentication(req, res))) {
    return;
  }

  const {id: idsToDelete}: {id?: string[]} = JSON.parse(req.body || '{}');
  if (req.method === 'DELETE' && idsToDelete && idsToDelete.length > 0) {
    // missing support for cascading deletes
    const deleteCartItems = prismaClient.cartItem.deleteMany({
      where: {
        transactionId: {
          in: idsToDelete,
        },
      },
    });

    const deleteTransactions = prismaClient.transactions.deleteMany({
      where: {
        id: {
          in: idsToDelete,
        },
      },
    });

    await prismaClient.$transaction([deleteCartItems, deleteTransactions]);
  }

  const realTransaction = {
    listName: {
      startsWith: 'Bon',
    },
  };

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
    where:
      req.query.type === 'real'
        ? realTransaction
        : {
            NOT: realTransaction,
          },
  });
  res.json(transactions);
};
