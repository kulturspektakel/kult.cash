import {NextApiRequest, NextApiResponse} from 'next';
import {CartItemCreateWithoutTransactionInput} from '@prisma/client';
import prismaClient from '../../utils/prismaClient';
import {postTransaction} from '../../utils/slack';
import deviceAuthentication from '../../utils/deviceAuthentication';
import updateLastSeen from '../../utils/updateLastSeen';
import {TransactionMessage, ITransactionMessage} from '../../proto/index';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await deviceAuthentication(req, res);
  await updateLastSeen(req);

  let buffer: Buffer = Buffer.from('');
  req.on('data', (chunk: Buffer) => {
    buffer = Buffer.concat([buffer, chunk]);
  });

  req.on('end', async () => {
    try {
      const message = TransactionMessage.decode(buffer);

      const {
        deviceId,
        deviceTime,
        cartItems,
        ...data
      } = TransactionMessage.toObject(message, {
        defaults: true,
      }) as ITransactionMessage;

      const existingTransaction = await prismaClient.transaction.findOne({
        where: {id: data.id},
      });
      if (existingTransaction) {
        return res.send('OK');
      }

      const cartItemsCreate: CartItemCreateWithoutTransactionInput[] = Array.from(
        (cartItems ?? [])
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
      return res.status(201).send('Created');
    } catch (e) {
      console.error(e);
      return res.status(400).send('Bad Request');
    }
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};
