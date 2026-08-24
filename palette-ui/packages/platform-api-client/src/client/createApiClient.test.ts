import { describe, expect, it, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { createApiClient } from './createApiClient';
import { ApiClient } from './ApiClient';

const request = vi.fn();

vi.mock('axios', async () => {
  const actual = await vi.importActual<typeof import('axios')>('axios');
  return {
    ...actual,
    default: {
      ...actual.default,
      create: vi.fn(() => ({
        request,
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
        defaults: { headers: { common: {} } },
      })),
      isAxiosError: actual.default.isAxiosError,
    },
  };
});

describe('createApiClient', () => {
  beforeEach(() => {
    request.mockReset();
    vi.mocked(axios.create).mockClear();
  });

  it('creates isolated axios instances per client', () => {
    createApiClient({ baseURL: '/api' });
    createApiClient({ baseURL: '/reporting-api' });

    expect(axios.create).toHaveBeenCalledTimes(2);
    expect(axios.create).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ baseURL: '/api' }),
    );
    expect(axios.create).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ baseURL: '/reporting-api' }),
    );
  });

  it('getPage sends pagination params and normalizes response', async () => {
    request.mockResolvedValue({
      status: 200,
      headers: {},
      config: { headers: new axios.AxiosHeaders() },
      data: {
        items: [{ id: '1' }],
        page: 2,
        pageSize: 10,
        total: 25,
        totalPages: 3,
        hasNext: true,
        hasPrevious: true,
      },
    });

    const client = createApiClient({ baseURL: '/api' });
    const page = await client.getPage<{ id: string }>('/trades', { page: 2, pageSize: 10 });

    expect(page.items).toEqual([{ id: '1' }]);
    expect(page.total).toBe(25);
  });
});

describe('ApiClient.getPage integration', () => {
  beforeEach(() => {
    request.mockReset();
  });

  it('sends page query params through axios request', async () => {
    request.mockResolvedValue({
      status: 200,
      headers: {},
      config: { headers: new axios.AxiosHeaders() },
      data: {
        items: [],
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
      },
    });

    const client = new ApiClient(
      {
        request,
        interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
        defaults: { headers: { common: {} } },
      } as never,
      {
        baseURL: '/api',
        timeout: 10_000,
        withCredentials: true,
        headers: {},
        auth: { enabled: false },
        retry: {
          enabled: false,
          retries: 0,
          retryDelay: 500,
          retryOn: [],
          retryMethods: [],
        },
        interceptors: { request: [], response: [], error: [] },
        requestId: { enabled: true, headerName: 'X-Request-ID', correlationHeaderName: 'X-Correlation-ID' },
      },
    );

    await client.getPage('/trades', { page: 2, pageSize: 10 });

    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: '/trades',
        params: expect.objectContaining({ page: 2, pageSize: 10 }),
      }),
    );
  });
});
