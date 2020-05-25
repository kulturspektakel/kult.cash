import prismaClient from '../utils/prismaClient';

(async () => {
  const devices = [];
  for (let i = 0; i < 50; i++) {
    const a = Math.random().toString(16).toUpperCase();
    const id = `${a.substr(2, 2)}:${a.substr(4, 2)}:${a.substr(6, 2)}`;
    devices.push(id);
    await prismaClient.device.create({
      data: {
        id,
        lastSeen: new Date(),
        latestVersion: 1,
      },
    });
  }

  for (let i = 0; i < 10000; i++) {
    const balanceBefore = Math.floor(Math.random() * 10000);
    await prismaClient.transaction.create({
      data: {
        balanceAfter: Math.max(
          0,
          balanceBefore - Math.floor(Math.random() * 1000),
        ),
        balanceBefore,
        card: Math.random().toString(16).toUpperCase().substr(2, 8),
        device: {
          connect: {
            id: devices[Math.floor(Math.random() * devices.length)],
          },
        },
        deviceTime: new Date(),
        mode: 0,
        id: Math.random().toString(16).toUpperCase().substr(2, 7),
        tokensAfter: 0,
        tokensBefore: 0,
        listName: '',
      },
    });
  }
  console.log('done');
})();
