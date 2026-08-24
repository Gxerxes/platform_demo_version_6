import { beforeEach, describe, expect, it, vi } from 'vitest';
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
  });

  it('getPage normalizes paginated response', async () => {
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

    const page = await createApiClient({ baseURL: '/api' }).getPage<{ id: string }>('/trades', {
      page: 2,
      pageSize: 10,
    });

    expect(page.total).toBe(25);
  });
});

describe('ApiClient', () => {
  beforeEach(() => {
    request.mockReset();
  });

  it('sends pagination query params', async () => {
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
        retry: { enabled: false, retries: 0, retryDelay: 500, retryOn: [], retryMethods: [] },
        interceptors: { request: [], response: [], error: [] },
        requestId: {
          enabled: true,
          headerName: 'X-Request-ID',
          correlationHeaderName: 'X-Correlation-ID',
        },
      },
    );

    await client.getPage('/trades', { page: 2, pageSize: 10 });

    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        params: expect.objectContaining({ page: 2, pageSize: 10 }),
      }),
    );
  });
});
