export { createApiClient } from './client/createApiClient';
export { ApiClient } from './client/ApiClient';
export type {
  ApiClientConfig,
  ApiRequestConfig,
  ApiRequestInterceptor,
  ApiResponse,
  ApiResponseInterceptor,
  ApiErrorInterceptor,
  AuthConfig,
  AuthProvider,
  HttpMethod,
  RequestOptions,
  ResolvedApiClientConfig,
  RetryConfig,
  AfterResponseHook,
  BeforeRequestHook,
  OnErrorHook,
  ApiLogger,
} from './client/types';

export { DEFAULT_API_CLIENT_CONFIG } from './config/ApiClientDefaults';
export { mergeConfig } from './config/mergeConfig';

export { ErrorCode } from './error/ErrorCode';
export { ApiError } from './error/ApiError';
export { normalizeAxiosError, normalizeError, isPaletteError } from './error/normalizeError';
export type { ApiErrorOptions, PaletteError } from './error/types';

export { sanitizeMetadata, createSafeLogger } from './observability/types';
export type { RequestMetricEvent, RequestMetrics } from './observability/types';

export {
  shouldRetryRequest,
  calculateRetryDelay,
  DEFAULT_RETRY_METHODS,
} from './retry/RetryPolicy';

export { createQueryClient } from './createQueryClient';
export { createQueryKeyFactory } from './queryKeys';
export {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  normalizePageResponse,
  resolvePageRequest,
  toPageQueryParams,
} from './pagination';
export type { PageRequest, PageResponse } from './pagination';

export { ApiClientProvider, useApiClient } from './react/ApiClientProvider';
export type { ApiClientProviderProps } from './react/ApiClientProvider';
export { PlatformQueryClientProvider, usePlatformQueryClient } from './react/PlatformQueryClientProvider';
export type { PlatformQueryClientProviderProps } from './react/PlatformQueryClientProvider';
export { usePaginatedQuery } from './react/usePaginatedQuery';
export type { UsePaginatedQueryOptions } from './react/usePaginatedQuery';

export const PLATFORM_API_CLIENT_VERSION = '1.0.0';
