import {NextApiRequest, NextApiResponse} from 'next';
import prismaClient from '../../../utils/prismaClient';
import {List} from '@prisma/client';
import dashboardAuthentication from '../../../utils/dashboardAuthentication';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dashboardAuthentication(req, res);
  const list: List | null = JSON.parse(req.body || 'null');

  if (list && (req.method === 'POST' || req.method === 'PUT')) {
    await prismaClient.list.upsert({
      create: list,
      update: list,
      where: {
        name: list.name,
      },
    });
  } else if (list?.name && req.method === 'DELETE') {
    await prismaClient.list.delete({
      where: {
        name: list.name,
      },
    });
  }
  res.json(await prismaClient.list.findMany());
};
