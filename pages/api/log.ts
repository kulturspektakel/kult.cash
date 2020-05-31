import {NextApiRequest, NextApiResponse} from 'next';
import {CartItemCreateWithoutTransactionInput} from '@prisma/client';
import prismaClient from '../../utils/prismaClient';
import {postTransaction} from '../../utils/slack';
import deviceAuthentication from '../../utils/deviceAuthentication';
import updateLastSeen from '../../utils/updateLastSeen';
import {TransactionMessage} from '../../proto/index';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await deviceAuthentication(req, res);
  await updateLastSeen(req);

  const error = TransactionMessage.verify(req.body);
  if (error) {
    return res.status(400).send('Bad Request');
  }

  const {deviceId, deviceTime, cartItems, ...data} = TransactionMessage.decode(
    req.body,
  );

  const cartItemsCreate: CartItemCreateWithoutTransactionInput[] = Array.from(
    cartItems
      .reduce((acc, {price, product}) => {
        const item = acc.get(product) ?? {
          amount: 0,
          price,
          product,
        };

        item.amount++;
        return acc.set(product, item);
      }, new Map<string, CartItemCreateWithoutTransactionInput>())
      .values(),
  );

  const transaction = await prismaClient.transaction.create({
    data: {
      ...data,
      device: {
        connect: {id: deviceId},
      },
      deviceTime: new Date(deviceTime),
      cartItems: {
        create: cartItemsCreate,
      },
    },
  });
  // postTransaction(transaction);
  return res.send('ok');
};
