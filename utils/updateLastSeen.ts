import prismaClient from './prismaClient';
import {NextApiRequest} from 'next';

type DeviceData = {id: string | undefined; version: number | undefined};

export function parseDeviceData(req: NextApiRequest): DeviceData {
  const macAddress = req.headers['x-esp8266-sta-mac'];
  const version = req.headers['x-esp8266-version'];
  const result: DeviceData = {id: undefined, version: undefined};
  if (typeof macAddress === 'string' && macAddress.length === 17) {
    result.id = macAddress.substr(9);
  }
  if (typeof version === 'string') {
    result.version = parseInt(version, 10);
  }
  return result;
}

export default async function (req: NextApiRequest) {
  const {id, version} = parseDeviceData(req);

  if (id) {
    const device = {
      id,
      lastSeen: new Date(),
      latestVersion: version,
    };

    await prismaClient.device.upsert({
      where: {
        id,
      },
      create: device,
      update: device,
    });
  }
}
