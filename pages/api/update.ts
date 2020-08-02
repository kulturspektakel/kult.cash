import {NextApiRequest, NextApiResponse} from 'next';
import deviceAuthentication from '../../utils/deviceAuthentication';
import updateLastSeen, {parseDeviceData} from '../../utils/updateLastSeen';
import fs from 'fs-extra';
import path from 'path';
import {postDeviceUpdate} from '../../utils/slack';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await deviceAuthentication(req, res);
  await updateLastSeen(req);
  const {id, version} = parseDeviceData(req);
  if (!id || !version) {
    return res.status(400).send('Bad Request');
  }
  const updateDir = path.join(process.env.PROJECT_DIRNAME!, 'firmware');
  const updates = await fs.readdir(updateDir);
  const newerVersion = updates
    .filter((s) => /\d+\.bin/.test(s))
    .map((s) => parseInt(s, 10))
    .filter((v) => v > version)
    .sort((a, b) => b - a);
  if (newerVersion.length > 0) {
    const firmwareFile = path.join(updateDir, `${newerVersion[0]}.bin`);
    const {size} = fs.statSync(firmwareFile);
    res.writeHead(200, {
      'Content-Type': 'binary/octet-stream',
      'Content-Length': size,
    });
    fs.createReadStream(firmwareFile).pipe(res);
    return postDeviceUpdate(id, newerVersion[0]);
  } else {
    return res.status(204).send('No Content');
  }
};
