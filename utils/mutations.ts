import {getAPIUrl} from '../components/useData';
import {mutate} from 'swr';

export const updateDevice = async <T extends {id: string}>(item: T) => {
  const key = getAPIUrl('devices');
  mutate(key);
  const data = await fetch(key, {
    method: 'POST',
    body: JSON.stringify(item),
  });

  mutate(key, (current: T[]) => {
    const index = current.findIndex((c) => c.id === item.id);
    return current.splice(index, 1, item);
  });
};
