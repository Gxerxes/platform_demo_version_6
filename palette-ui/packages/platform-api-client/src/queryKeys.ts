export function createQueryKeyFactory<T extends string>(root: T) {
  const all = [root] as const;

  return {
    all,
    lists: () => [...all, 'list'] as const,
    list: (params?: unknown) => [...all, 'list', params] as const,
    details: () => [...all, 'detail'] as const,
    detail: (id: string) => [...all, 'detail', id] as const,
  };
}
