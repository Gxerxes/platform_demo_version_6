export interface PageRequest {
  /** 1-based page index */
  page?: number;
  pageSize?: number;
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;

export function resolvePageRequest(request?: PageRequest): Required<PageRequest> {
  const page = request?.page ?? DEFAULT_PAGE;
  const pageSize = request?.pageSize ?? DEFAULT_PAGE_SIZE;

  return {
    page: page < 1 ? DEFAULT_PAGE : page,
    pageSize: pageSize < 1 ? DEFAULT_PAGE_SIZE : pageSize,
  };
}

export function toPageQueryParams(request?: PageRequest): Record<string, number> {
  const resolved = resolvePageRequest(request);
  return {
    page: resolved.page,
    pageSize: resolved.pageSize,
  };
}

function computePageMeta(total: number, page: number, pageSize: number) {
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);

  return {
    total,
    totalPages,
    hasNext: totalPages > 0 && page < totalPages,
    hasPrevious: page > 1 && totalPages > 0,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isPageResponseShape(value: unknown): value is PageResponse<unknown> {
  return (
    isRecord(value) &&
    Array.isArray(value.items) &&
    typeof value.page === 'number' &&
    typeof value.pageSize === 'number' &&
    typeof value.total === 'number'
  );
}

function isSpringPageShape(value: unknown): value is {
  content: unknown[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first?: boolean;
  last?: boolean;
} {
  return (
    isRecord(value) &&
    Array.isArray(value.content) &&
    typeof value.number === 'number' &&
    typeof value.size === 'number' &&
    typeof value.totalElements === 'number'
  );
}

/**
 * Normalizes common backend pagination shapes into a platform PageResponse.
 */
export function normalizePageResponse<T>(
  data: unknown,
  request?: PageRequest,
): PageResponse<T> {
  const resolved = resolvePageRequest(request);

  if (isPageResponseShape(data)) {
    const meta = computePageMeta(data.total, data.page, data.pageSize);
    return {
      items: data.items as T[],
      page: data.page,
      pageSize: data.pageSize,
      total: meta.total,
      totalPages: data.totalPages ?? meta.totalPages,
      hasNext: data.hasNext ?? meta.hasNext,
      hasPrevious: data.hasPrevious ?? meta.hasPrevious,
    };
  }

  if (isSpringPageShape(data)) {
    const page = data.number + 1;
    const meta = computePageMeta(data.totalElements, page, data.size);
    return {
      items: data.content as T[],
      page,
      pageSize: data.size,
      total: meta.total,
      totalPages: data.totalPages ?? meta.totalPages,
      hasNext: data.last !== undefined ? !data.last : meta.hasNext,
      hasPrevious: data.first !== undefined ? !data.first : meta.hasPrevious,
    };
  }

  if (Array.isArray(data)) {
    const meta = computePageMeta(data.length, resolved.page, resolved.pageSize);
    return {
      items: data as T[],
      page: resolved.page,
      pageSize: resolved.pageSize,
      total: meta.total,
      totalPages: meta.totalPages,
      hasNext: meta.hasNext,
      hasPrevious: meta.hasPrevious,
    };
  }

  throw new Error('Unable to normalize paginated response');
}
