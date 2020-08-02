export const fetcher = async (key: string) => {
  const r = await fetch(key);
  return await r.json();
};
