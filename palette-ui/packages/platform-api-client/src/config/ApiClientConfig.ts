import type { PaletteAppMetadata } from '@palette/platform-config';
import type { EventBus } from '@palette/platform-event';
import type { AuthConfig } from '../auth/types';
import type { ApiError } from '../error/ApiError';
import type { ApiLogger } from '../observability/types';
import type {
  ApiErrorInterceptor,
  ApiRequestInterceptor,
  ApiResponseInterceptor,
} from '../interceptors/types';
import type {
  AfterResponseHook,
  BeforeRequestHook,
  OnErrorHook,
} from '../hooks/types';
import type { RetryConfig } from '../retry/RetryPolicy';

export interface RequestIdConfig {
  enabled?: boolean;
  headerName?: string;
  correlationHeaderName?: string;
}

export interface InterceptorConfig {
  request?: ApiRequestInterceptor[];
  response?: ApiResponseInterceptor[];
  error?: ApiErrorInterceptor[];
}

export interface LifecycleHooksConfig {
  beforeRequest?: BeforeRequestHook;
  afterResponse?: AfterResponseHook;
  onError?: OnErrorHook;
}

export interface ApiClientConfig {
  /** Preferred base URL property */
  baseURL?: string;
  /** Legacy Palette alias — merged with baseURL */
  baseUrl?: string;
  timeout?: number;
  withCredentials?: boolean;
  headers?: Record<string, string>;
  auth?: AuthConfig;
  retry?: RetryConfig;
  interceptors?: InterceptorConfig;
  hooks?: LifecycleHooksConfig;
  logger?: ApiLogger;
  requestId?: RequestIdConfig;
  /** Application metadata injected as outbound headers */
  metadata?: PaletteAppMetadata;
  /** @deprecated Prefer hooks.onError — kept for platform integration */
  onError?: (error: ApiError) => void;
  /** @deprecated Platform event bus integration */
  eventBus?: EventBus;
}

export interface ResolvedApiClientConfig {
  baseURL: string;
  timeout: number;
  withCredentials: boolean;
  headers: Record<string, string>;
  auth: Required<Pick<AuthConfig, 'enabled'>> & AuthConfig;
  retry: Required<RetryConfig>;
  interceptors: Required<InterceptorConfig>;
  hooks?: LifecycleHooksConfig;
  logger?: ApiLogger;
  requestId: Required<RequestIdConfig>;
  metadata?: PaletteAppMetadata;
  onError?: (error: ApiError) => void;
  eventBus?: EventBus;
}
