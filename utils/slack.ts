import {WebClient} from '@slack/web-api';
import {Transactions} from '@prisma/client';
import currencyFormatter from './currencyFormatter';
import prismaClient from './prismaClient';

const web = new WebClient(process.env.SLACK_TOKEN);

export async function postDeviceUpdate(id: string, version: number) {
  web.chat.postMessage({
    text: `Gerät *${id}* auf Firmware *${version}* aktualisiert.`,
    icon_emoji: ':calling:',
    channel: process.env.SLACK_CHANNEL ?? '',
  });
}

export async function postTransaction(transaction: Transactions) {
  const listName = transaction.listName;
  const total = currencyFormatter.format(
    (transaction.balanceBefore - transaction.balanceAfter) / 100,
  );

  const tokens = transaction.tokensBefore - transaction.tokensAfter;
  const cart = await prismaClient.cartItem.findMany({
    where: {
      transaction,
    },
  });

  let list;
  if (listName) {
    list = await prismaClient.list.findOne({
      where: {
        name: listName,
      },
    });
  }

  const products = cart
    .map((item) => `${item.amount}× ${item.product}`)
    .join('\n');

  return web.chat.postMessage({
    text: `${listName}: ${total}`,
    icon_emoji: list?.emoji ?? ':credit_card:',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${listName}*`,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Produkte:*\n${products}`,
          },
          {
            type: 'mrkdwn',
            text:
              tokens > 0
                ? `*Pfandmarken:*\n${tokens}`
                : `*Pfandrückgabe:*\n${Math.abs(tokens)}`,
          },
          {
            type: 'mrkdwn',
            text: `*Abgebucht:*\n${total}`,
          },
          {
            type: 'mrkdwn',
            text: `*Restguthaben:*\n${currencyFormatter.format(
              transaction.balanceAfter / 100,
            )} (${transaction.tokensAfter} Pfandmarken)`,
          },
        ],
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Karten-ID: ${transaction.card} ⸱ Geräte-ID: ${transaction.deviceId}`,
          },
        ],
      },
    ],
    channel: process.env.SLACK_CHANNEL ?? '',
  });
}
