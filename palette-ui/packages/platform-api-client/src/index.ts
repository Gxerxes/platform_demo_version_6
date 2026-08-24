export { ApiClient, createApiClient } from './ApiClient';
export type { ApiClientConfig, HttpMethod, RequestOptions } from './ApiClient';
export { ApiClientProvider, useApiClient } from './ApiClientProvider';
export type { ApiClientProviderProps } from './ApiClientProvider';
export { createQueryClient } from './createQueryClient';
export { PlatformQueryClientProvider, usePlatformQueryClient } from './PlatformQueryClientProvider';
export type { PlatformQueryClientProviderProps } from './PlatformQueryClientProvider';
export { createQueryKeyFactory } from './queryKeys';
export {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  normalizePageResponse,
  resolvePageRequest,
  toPageQueryParams,
} from './pagination';
export type { PageRequest, PageResponse } from './pagination';
export { usePaginatedQuery } from './usePaginatedQuery';
export type { UsePaginatedQueryOptions } from './usePaginatedQuery';
export { ApiError, isPaletteError, normalizeError } from './errors';
export type { PaletteError } from './errors';

export const PLATFORM_API_CLIENT_VERSION = '0.5.0';
