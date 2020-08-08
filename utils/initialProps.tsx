import {IncomingMessage} from 'http';
import {Type, getAPIUrl} from '../components/useData';
import {List} from '@prisma/client';
import absoluteUrl from 'next-absolute-url';

const generateGetInitialData = <T,>(api: Type) => async (
  req: IncomingMessage | undefined,
): Promise<null | T[]> => {
  let transactions = null;
  if (!req) {
    return transactions;
  }
  if (req.headers.cookie) {
    try {
      const {protocol, host} = absoluteUrl(req);
      const requestUrl = `${protocol}//${host}`;
      const res = await fetch(requestUrl + getAPIUrl(api), {
        headers: {
          cookie: req.headers.cookie,
        },
      });
      if (res.ok) {
        transactions = await res.json();
      }
    } catch (e) {
      console.error(e);
    }
  }
  return transactions;
};

export const getInitialLists = generateGetInitialData<List>('lists');
export const getInitialDevices = generateGetInitialData<List>('devices');
export const getInitialTransactionsVirtual = generateGetInitialData<List>(
  'transactions/virtual',
);
export const getInitialTransactionsReal = generateGetInitialData<List>(
  'transactions/real',
);
