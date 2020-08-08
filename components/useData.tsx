import {useCallback} from 'react';
import {
  DeviceUpdateInput,
  DeviceCreateInput,
  List,
  Device,
  ListUpdateInput,
  ListCreateInput,
  Transactions,
  CartItem,
} from '@prisma/client';
import {message} from 'antd';
import {useRecoilState} from 'recoil';
import {requiresLoginAtom} from './Login';
import useSWR from 'swr';

export type Type = 'devices' | 'transactions' | 'lists';

export const getAPIUrl = (type: Type) => `/api/dashboard/${type}`;
export const fetcher = async (type: Type, init?: RequestInit) => {
  const res = await fetch(getAPIUrl(type), init);
  if (!res.ok) {
    throw res;
  }
  return await res.json();
};

const generateHook = <T, U, C>(type: Type, primaryKey: string) => (
  initialData: T[] = [],
) => {
  const [, setRequiresLogin] = useRecoilState(requiresLoginAtom);

  const {data: items, mutate} = useSWR<T[]>(type, fetcher, {
    initialData: initialData,
    onError: (err: Response) => {
      if (err.status === 401) {
        setRequiresLogin(true);
      } else {
        message.error(`Fehler: ${err.status}: ${err.statusText}`);
      }
    },
  });

  const deleteItem = useCallback(async (id: string | string[]) => {
    const data = await fetcher(type, {
      method: 'DELETE',
      body: JSON.stringify({[primaryKey]: id}),
    });
    mutate(data, false);
  }, []);

  const updateItem = useCallback(async (item: U) => {
    const data = await fetcher(type, {
      method: 'POST',
      body: JSON.stringify(item),
    });
    mutate(data, false);
    message.success('Änderung gespeichert');
  }, []);

  const createItem = useCallback(async (device: C) => {
    const data = await fetcher(type, {
      method: 'PUT',
      body: JSON.stringify(device),
    });
    mutate(data, false);
  }, []);

  return {items, deleteItem, updateItem, createItem};
};

export const useDevices = generateHook<
  Device,
  DeviceUpdateInput,
  DeviceCreateInput
>('devices', 'id');

export const useLists = generateHook<List, ListUpdateInput, ListCreateInput>(
  'lists',
  'name',
);

export type TransactionData = Transactions & {cartItems: CartItem[]};

export const useTransactions = generateHook<
  TransactionData,
  ListUpdateInput,
  ListCreateInput
>('transactions', 'id');
