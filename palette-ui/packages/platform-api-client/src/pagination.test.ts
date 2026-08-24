import { describe, expect, it } from 'vitest';
import {
  normalizePageResponse,
  resolvePageRequest,
  toPageQueryParams,
} from './pagination';

describe('resolvePageRequest', () => {
  it('applies defaults', () => {
    expect(resolvePageRequest()).toEqual({ page: 1, pageSize: 20 });
  });

  it('clamps invalid values', () => {
    expect(resolvePageRequest({ page: 0, pageSize: -1 })).toEqual({ page: 1, pageSize: 20 });
  });
});

describe('toPageQueryParams', () => {
  it('serializes page request for query string', () => {
    expect(toPageQueryParams({ page: 2, pageSize: 10 })).toEqual({ page: 2, pageSize: 10 });
  });
});

describe('normalizePageResponse', () => {
  it('normalizes platform page response', () => {
    const result = normalizePageResponse<{ id: string }>({
      items: [{ id: '1' }],
      page: 2,
      pageSize: 10,
      total: 25,
      totalPages: 3,
      hasNext: true,
      hasPrevious: true,
    });

    expect(result.items).toHaveLength(1);
    expect(result.page).toBe(2);
    expect(result.totalPages).toBe(3);
    expect(result.hasNext).toBe(true);
  });

  it('normalizes spring page response', () => {
    const result = normalizePageResponse<{ id: string }>({
      content: [{ id: '1' }, { id: '2' }],
      number: 1,
      size: 10,
      totalElements: 25,
      totalPages: 3,
      first: false,
      last: false,
    });

    expect(result.page).toBe(2);
    expect(result.pageSize).toBe(10);
    expect(result.total).toBe(25);
    expect(result.hasPrevious).toBe(true);
    expect(result.hasNext).toBe(true);
  });

  it('wraps plain arrays as a single page', () => {
    const result = normalizePageResponse(['a', 'b'], { page: 1, pageSize: 20 });

    expect(result.items).toEqual(['a', 'b']);
    expect(result.total).toBe(2);
    expect(result.totalPages).toBe(1);
  });
});
