import { describe, expect, it, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { createAxiosInstance } from './internal/createAxiosInstance';

vi.mock('axios', async () => {
  const actual = await vi.importActual<typeof import('axios')>('axios');
  return {
    ...actual,
    default: {
      ...actual.default,
      create: vi.fn(actual.default.create),
    },
  };
});

describe('createAxiosInstance', () => {
  beforeEach(() => {
    vi.mocked(axios.create).mockClear();
  });

  it('applies axios configuration from platform api config', () => {
    createAxiosInstance({
      api: {
        baseUrl: '/palette/api/v1/',
        timeout: 10_000,
        withCredentials: false,
        headers: { 'X-Custom': 'value' },
      },
      metadata: {
        applicationId: 'trading-app',
        clientVersion: '1.0.0',
      },
    });

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: '/palette/api/v1',
      timeout: 10_000,
      withCredentials: false,
      headers: {
        'Content-Type': 'application/json',
        'X-Custom': 'value',
      },
    });
  });
});
