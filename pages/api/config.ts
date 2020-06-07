import {crc32} from 'crc';
import {NextApiRequest, NextApiResponse} from 'next';
import deviceAuthentication from '../../utils/deviceAuthentication';
import prismaClient from '../../utils/prismaClient';
import updateLastSeen, {parseUserAgent} from '../../utils/updateLastSeen';
import {ConfigMessage} from '../../proto/index';

function asciinize(s: string | null): string | null {
  if (!s) {
    return null;
  }
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
    return res.status(204).send('No Content');
  }

  const message = ConfigMessage.encode({
    ...list,
    product1: asciinize(list.product1),
    product2: asciinize(list.product2),
    product3: asciinize(list.product3),
    product4: asciinize(list.product4),
    product5: asciinize(list.product5),
    product6: asciinize(list.product6),
    product7: asciinize(list.product7),
    product8: asciinize(list.product8),
    product9: asciinize(list.product9),
    checksum: crc32(JSON.stringify(list)),
  }).finish();

  res.setHeader('Content-Type', 'application/x-protobuf');
  res.send(message);
};
