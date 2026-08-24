export { createApiClient } from './client/createApiClient';
export { ApiClient } from './client/ApiClient';

export type { ApiClientConfig, AppMetadata, ResolvedApiClientConfig } from './config/ApiClientConfig';
export type { ApiRequestConfig, ApiResponse, HttpMethod } from './client/types';
export type { AuthConfig } from './auth/types';
export type {
  ApiRequestInterceptor,
  ApiResponseInterceptor,
  ApiErrorInterceptor,
} from './interceptors/types';
export type { BeforeRequestHook, AfterResponseHook, OnErrorHook } from './hooks/hooks';
export type { ApiLogger } from './observability/types';
export type { RetryConfig } from './retry/RetryPolicy';
export type { PageRequest, PageResponse } from './pagination';

export { DEFAULT_API_CLIENT_CONFIG } from './config/ApiClientDefaults';
export { mergeConfig } from './config/mergeConfig';

export { ApiError } from './error/ApiError';
export { ErrorCode } from './error/ErrorCode';
export { normalizeError } from './error/normalizeError';
export type { NormalizedError } from './error/types';

export { createQueryClient } from './createQueryClient';
export { createQueryKeyFactory } from './queryKeys';
export {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  normalizePageResponse,
  resolvePageRequest,
  toPageQueryParams,
} from './pagination';

export { ApiClientProvider, useApiClient } from './react/ApiClientProvider';
export type { ApiClientProviderProps } from './react/ApiClientProvider';
export { PlatformQueryClientProvider, usePlatformQueryClient } from './react/PlatformQueryClientProvider';
export type { PlatformQueryClientProviderProps } from './react/PlatformQueryClientProvider';
export { usePaginatedQuery } from './react/usePaginatedQuery';
export type { UsePaginatedQueryOptions } from './react/usePaginatedQuery';

export const PLATFORM_API_CLIENT_VERSION = '1.0.0';
