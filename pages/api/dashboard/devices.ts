import {NextApiRequest, NextApiResponse} from 'next';
import prismaClient from '../../../utils/prismaClient';
import {DeviceCreateInput} from '@prisma/client';
import dashboardAuthentication from '../../../utils/dashboardAuthentication';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!(await dashboardAuthentication(req, res))) {
    return;
  }

  const deviceInput: DeviceCreateInput | null = JSON.parse(req.body || 'null');
  if (deviceInput && (req.method === 'POST' || req.method === 'PUT')) {
    const {list, ...device} = deviceInput;
    await prismaClient.device.upsert({
      create: device,
      update: {
        ...device,
        // Why, TS, why?!
        list: list ?? undefined,
        transactions: device.transactions ?? undefined,
      },
      where: {
        id: device.id,
      },
    });
  } else if (deviceInput && req.method === 'DELETE') {
    await prismaClient.device.delete({
      where: {
        id: deviceInput.id,
      },
    });
  }
  res.json(await prismaClient.device.findMany());
};
