import {useEffect, useCallback, useState} from 'react';
import {
  DeviceUpdateInput,
  DeviceCreateInput,
  List,
  Device,
  ListUpdateInput,
  ListCreateInput,
  Transaction,
  CartItem,
} from '@prisma/client';
import {message} from 'antd';
import {atom, useRecoilState, RecoilState} from 'recoil';
import {requiresLoginAtom} from './Login';

export type Type = 'devices' | 'transactions' | 'lists';

export const getAPIUrl = (type: Type) => `/api/dashboard/${type}`;

const generateHook = <T, U, C>(
  type: Type,
  primaryKey: string,
  atom: RecoilState<T[]>,
) => (initialData?: T[]) => {
  const url = getAPIUrl(type);
  const [, setRequiresLogin] = useRecoilState(requiresLoginAtom);

  const [cachedItems, setCachedItems]: [
    null | T[],
    (items: T[]) => void,
  ] = useRecoilState(atom);

  const [items, setItems] = useState(cachedItems ?? initialData);

  const update = async (res: Response) => {
    const data = await res.json();
    setItems(data);
    setCachedItems(data);
    return data;
  };

  useEffect(() => {
    (async () => {
      if (cachedItems) {
        // do nothing
      } else if (items) {
        setCachedItems(items);
      } else {
        const res = await fetch(url, {
          method: 'GET',
        });
        if (res.status === 401) {
          setRequiresLogin(true);
        } else {
          update(res);
        }
      }
    })();
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    const data = await fetch(url, {
      method: 'DELETE',
      body: JSON.stringify({[primaryKey]: id}),
    });
    update(data);
  }, []);

  const updateItem = useCallback(async (item: U) => {
    const data = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(item),
    });
    update(data);
    if (data.status === 200) {
      message.success('Änderung gespeichert');
    } else {
      message.error('Fehler beim Speichern');
    }
  }, []);

  const createItem = useCallback(async (device: C) => {
    const data = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(device),
    });
    update(data);
  }, []);

  return {items, deleteItem, updateItem, createItem};
};

const listsAtom = atom<List[]>({
  key: 'listsCache',
  default: null,
});

const devicesAtom = atom<Device[]>({
  key: 'devicesCache',
  default: null,
});

const transactionsAtom = atom<TransactionData[]>({
  key: 'transactionsCache',
  default: null,
});

export const useDevices = generateHook<
  Device,
  DeviceUpdateInput,
  DeviceCreateInput
>('devices', 'id', devicesAtom);

export const useLists = generateHook<List, ListUpdateInput, ListCreateInput>(
  'lists',
  'name',
  listsAtom,
);

export type TransactionData = Transaction & {cartItems: CartItem[]};

export const useTransactions = generateHook<
  TransactionData,
  ListUpdateInput,
  ListCreateInput
>('transactions', 'id', transactionsAtom);
