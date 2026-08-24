import { describe, expect, it, vi, beforeEach } from 'vitest';
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
        interceptors: { request: { use: vi.fn() } },
      })),
      isAxiosError: actual.default.isAxiosError,
    },
  };
});

describe('ApiClient.getPage', () => {
  beforeEach(() => {
    request.mockReset();
  });

  it('sends page query params and normalizes page response', async () => {
    request.mockResolvedValue({
      status: 200,
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

    const client = new ApiClient({ baseUrl: '/api' });
    const page = await client.getPage<{ id: string }>('/trades', { page: 2, pageSize: 10 });

    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: '/trades',
        params: expect.objectContaining({ page: 2, pageSize: 10 }),
      }),
    );
    expect(page.items).toEqual([{ id: '1' }]);
    expect(page.total).toBe(25);
  });
});
