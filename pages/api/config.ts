import {List} from '@prisma/client';
import {crc32} from 'crc';
import {NextApiRequest, NextApiResponse} from 'next';
import deviceAuthentication from '../../utils/deviceAuthentication';
import prismaClient from '../../utils/prismaClient';
import updateLastSeen, {parseUserAgent} from '../../utils/updateLastSeen';

function asciinize(s: string): string {
  const replacements = {
    ae: /ä/g,
    oe: /ö/g,
    ue: /ü/g,
    Ae: /Ä/g,
    Oe: /Ö/g,
    Ue: /Ü/g,
    ss: /ß/g,
  };

  return Object.entries(replacements)
    .reduce((acc, [target, search]) => acc.replace(search, target), s)
    .normalize('NFD') // remove diacritics
    .replace(/[\u0300-\u036f]/g, '');
}

export function getConfig(list: List) {
  const name = list.name;
  const products: [number | null, string | null][] = [
    [list.price1, list.product1],
    [list.price2, list.product2],
    [list.price3, list.product3],
    [list.price4, list.product4],
    [list.price5, list.product5],
    [list.price6, list.product6],
    [list.price7, list.product7],
    [list.price8, list.product8],
    [list.price9, list.product9],
  ];

  const productList: string[] = [];
  for (let [price, product] of products) {
    if (!price) {
      break;
    }
    productList.push(`${price},${asciinize(product)}`);
  }
  const p = productList.join('\n');

  return [crc32(p), name, p].join('\n');
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await deviceAuthentication(req, res);
  await updateLastSeen(req);

  const {id} = parseUserAgent(req);
  const list = await prismaClient.device
    .findOne({
      where: {
        id,
      },
    })
    .list();

  if (!list) {
    return res.status(404).send('Not Found');
  }

  res.send(getConfig(list));
};
