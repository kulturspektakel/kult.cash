#!/usr/bin/env npx ts-node --script-mode

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {CartItemCreateWithoutTransactionInput} from '@prisma/client';
import prismaClient from '../utils/prismaClient';
import {TransactionMessage} from '../proto';
import {Command} from 'commander';

const program = new Command();
program.requiredOption('-i, --input <type>', 'Input log file');
program.parse(process.argv);
let timeBase = 0;
let lastTransactionDate = new Date('2019-07-19 15:00:00+2');
let deviceID = '00:00:00';

(async () => {
  let imports = 0;
  if (fs.existsSync(program.input)) {
    const lines = fs.readFileSync(program.input).toString().split('\n');

    for (const line of lines) {
      if (await parseLine(line)) {
        imports++;
      }
    }
  } else {
    console.error(`File ${program.input} does not exist.`);
  }
  console.log(`✅ Done importing ${imports} logs!`);
  process.exit(0);
})();

async function parseLine(line: string): Promise<boolean> {
  const [
    timeOffsetS,
    card,
    modeS,
    balanceBefore,
    tokensBefore,
    balanceAfter,
    tokensAfter,
    cartS,
  ] = line.trim().split(',');

  if (!timeOffsetS) {
    return false;
  }

  const timeOffset = parseInt(timeOffsetS, 10);
  const mode = parseMode(modeS);

  if (mode === null) {
    return false;
  } else if (mode === TransactionMessage.Mode.TIME_ENTRY) {
    deviceID = tokensBefore;
    timeBase = parseDate(balanceBefore).getTime() - timeOffset;
    return false;
  }

  const cart = parseCart(cartS);
  const id = generateID(line);

  try {
    await prismaClient.device.create({
      data: {
        id: deviceID,
      },
    });
  } catch (e) {}

  await prismaClient.cartItem.deleteMany({
    where: {
      transactionId: id,
    },
  });

  await prismaClient.transactions.deleteMany({
    where: {
      id,
    },
  });

  lastTransactionDate = new Date(timeBase + timeOffset);
  let listName = path.basename(program.input, path.extname(program.input));
  listName = listName.charAt(0).toUpperCase() + listName.slice(1);

  const transaction = await prismaClient.transactions.create({
    data: {
      id,
      mode,
      deviceTime: lastTransactionDate,
      card,
      listName,
      device: {
        connect: {
          id: deviceID,
        },
      },
      balanceBefore: parseInt(balanceBefore, 10),
      tokensBefore: parseInt(tokensBefore, 10),
      balanceAfter: parseInt(balanceAfter, 10),
      tokensAfter: parseInt(tokensAfter, 10),
      cartItems: cart
        ? {
            create: cart,
          }
        : undefined,
    },
  });
  console.log(`Imported ${transaction.id}`);
  return true;
}

function parseCart(
  cart: string,
): CartItemCreateWithoutTransactionInput[] | null {
  if (!cart) {
    return null;
  }
  const productMap = cart
    .split('::')
    .filter(Boolean)
    .reduce(
      (acc, product) => acc.set(product, (acc.get(product) ?? 0) + 1),
      new Map<string, number>(),
    );

  return Array.from(productMap.entries()).map(([priceProduct, amount]) => {
    let [price, product] = priceProduct.split(':');

    return {
      price: parseInt(price),
      product,
      amount,
    };
  });
}

function parseMode(mode: string): TransactionMessage.Mode | null {
  switch (mode) {
    case 'TIME':
      return TransactionMessage.Mode.TIME_ENTRY;
    case 'CHARGE':
      return TransactionMessage.Mode.CHARGE;
    case 'TOP_UP':
      return TransactionMessage.Mode.TOP_UP;
    case 'CASHOUT':
      return TransactionMessage.Mode.CASHOUT;
  }

  return null;
}

function parseDate(date: string): Date {
  let day = parseInt(date.substr(5, 2), 10);
  let hour = parseInt(date.substr(11, 2), 10);
  if (day < 19 || day > 21 || hour > 23) {
    // invalid date, let's use the last transaction as base
    return lastTransactionDate;
  }
  let minute = parseInt(date.substr(14, 2), 10);
  if (minute > 59) {
    minute = 0;
  }
  const d = new Date();
  d.setMonth(6);
  d.setFullYear(2019);
  d.setDate(day);
  d.setUTCHours(hour - 2); // time zone
  d.setMinutes(minute);

  return d;
}

function generateID(line: string): string {
  return crypto
    .createHash('sha1')
    .update(line)
    .digest('hex')
    .toUpperCase()
    .substr(0, 7);
}
