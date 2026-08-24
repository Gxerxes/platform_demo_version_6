import type { AuthConfig } from '../auth/types';
import type { ApiLogger } from '../observability/types';
import type {
  ApiErrorInterceptor,
  ApiRequestInterceptor,
  ApiResponseInterceptor,
} from '../interceptors/types';
import type { AfterResponseHook, BeforeRequestHook, OnErrorHook } from '../hooks/hooks';
import type { RetryConfig } from '../retry/RetryPolicy';

export interface AppMetadata {
  applicationId?: string;
  clientVersion?: string;
}

export interface RequestIdConfig {
  enabled?: boolean;
  headerName?: string;
  correlationHeaderName?: string;
}

export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  withCredentials?: boolean;
  headers?: Record<string, string>;
  auth?: AuthConfig;
  retry?: RetryConfig;
  interceptors?: {
    request?: ApiRequestInterceptor[];
    response?: ApiResponseInterceptor[];
    error?: ApiErrorInterceptor[];
  };
  hooks?: {
    beforeRequest?: BeforeRequestHook;
    afterResponse?: AfterResponseHook;
    onError?: OnErrorHook;
  };
  logger?: ApiLogger;
  requestId?: RequestIdConfig;
  metadata?: AppMetadata;
}

export interface ResolvedApiClientConfig {
  baseURL: string;
  timeout: number;
  withCredentials: boolean;
  headers: Record<string, string>;
  auth: Required<Pick<AuthConfig, 'enabled'>> & AuthConfig;
  retry: Required<RetryConfig>;
  interceptors: {
    request: ApiRequestInterceptor[];
    response: ApiResponseInterceptor[];
    error: ApiErrorInterceptor[];
  };
  hooks?: ApiClientConfig['hooks'];
  logger?: ApiLogger;
  requestId: Required<RequestIdConfig>;
  metadata?: AppMetadata;
}
