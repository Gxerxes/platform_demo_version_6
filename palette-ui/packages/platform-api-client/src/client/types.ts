export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestConfig {
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeout?: number;
}

/** @deprecated Use ApiRequestConfig */
export type RequestOptions = ApiRequestConfig;

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
  requestId?: string;
}

export type { ApiClientConfig, ResolvedApiClientConfig } from '../config/ApiClientConfig';
export type { AuthProvider, AuthConfig } from '../auth/types';
export type { ApiLogger } from '../observability/types';
export type {
  ApiRequestInterceptor,
  ApiResponseInterceptor,
  ApiErrorInterceptor,
} from '../interceptors/types';
export type { BeforeRequestHook, AfterResponseHook, OnErrorHook } from '../hooks/types';
export type { RetryConfig } from '../retry/RetryPolicy';
