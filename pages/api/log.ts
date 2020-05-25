import {NextApiRequest, NextApiResponse} from 'next';
import {
  TransactionCreateInput,
  CartItemCreateWithoutTransactionInput,
} from '@prisma/client';
import prismaClient from '../../utils/prismaClient';
import {postTransaction} from '../../utils/slack';
import deviceAuthentication from '../../utils/deviceAuthentication';
import updateLastSeen from '../../utils/updateLastSeen';

export function parseCart(
  cart: string,
): CartItemCreateWithoutTransactionInput[] {
  return Array.from(
    cart
      .split('::')
      .filter(Boolean)
      .map((i) => i.split(':'))
      .reduce((acc, [p, product]) => {
        const price = parseInt(p, 10);
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
}

export function parseLog(log: string): TransactionCreateInput | null {
  // ABCDEFG,AA:A3:55,0,1571277103,9A826EAE,571,0,570,0,Frittiererei,250:Fritten::
  const logParser = /^([A-Z0-9]+),([A-F0-9]{2}:[A-F0-9]{2}:[A-F0-9]{2}),(\d+),(\d+),([0-9A-F]+),(\d+),(\d+),(\d+),(\d+),(\w*),(.*)$/m;
  const parsedLog = log.match(logParser);

  if (!parsedLog) {
    return null;
  }

  const [
    _,
    id,
    deviceId,
    mode,
    deviceTime,
    card,
    balanceBefore,
    tokensBefore,
    balanceAfter,
    tokensAfter,
    listName,
    cart,
  ] = parsedLog;

  return {
    id,
    mode: parseInt(mode, 10),
    deviceTime: new Date(parseInt(deviceTime, 10) * 1000),
    card,
    balanceBefore: parseInt(balanceBefore, 10),
    tokensBefore: parseInt(tokensBefore, 10),
    balanceAfter: parseInt(balanceAfter, 10),
    tokensAfter: parseInt(tokensAfter, 10),
    listName,
    device: {
      connect: {id: deviceId},
    },
    cartItems: {
      create: parseCart(cart),
    },
  };
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await deviceAuthentication(req, res);
  await updateLastSeen(req);

  const data = parseLog(req.body);
  if (!data) {
    return res.status(400).send('Bad Request');
  }
  const transaction = await prismaClient.transaction.create({
    data,
  });
  res.send('ok');
  // postTransaction(transaction);
};
