import { describe, expect, it } from 'vitest';
import { createQueryClient } from './createQueryClient';

describe('createQueryClient', () => {
  it('uses platform query defaults', () => {
    const client = createQueryClient();
    const defaults = client.getDefaultOptions().queries;

    expect(defaults?.staleTime).toBe(30_000);
    expect(defaults?.gcTime).toBe(300_000);
    expect(defaults?.retry).toBe(1);
    expect(defaults?.refetchOnWindowFocus).toBe(false);
    expect(defaults?.refetchOnReconnect).toBe(true);
  });

  it('applies application query overrides', () => {
    const client = createQueryClient({
      staleTime: 60_000,
      retry: 0,
      refetchOnWindowFocus: true,
    });
    const defaults = client.getDefaultOptions().queries;

    expect(defaults?.staleTime).toBe(60_000);
    expect(defaults?.retry).toBe(0);
    expect(defaults?.refetchOnWindowFocus).toBe(true);
    expect(defaults?.gcTime).toBe(300_000);
  });
});
