import prismaClient from './prismaClient';
import {NextApiRequest} from 'next';

export function parseUserAgent(
  req: NextApiRequest,
): {id: string | undefined; version: number | undefined} {
  let version = undefined;
  let id = undefined;

  const userAgent = req.headers['user-agent'];
  if (userAgent) {
    const userAgentMatcher = /([A-F0-9]{2}:[A-F0-9]{2}:[A-F0-9]{2})\/(\d+)/;
    const matches = userAgent.match(userAgentMatcher);

    if (matches?.length === 3) {
      const [_, i, v] = matches;
      version = parseInt(v, 10);
      id = i;
    }
  }
  return {id, version};
}

export default async function (req: NextApiRequest) {
  const {id, version} = parseUserAgent(req);

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
