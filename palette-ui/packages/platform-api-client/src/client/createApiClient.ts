import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { PaletteEvents } from '@palette/platform-event';
import type { ApiClientConfig, ResolvedApiClientConfig } from '../config/ApiClientConfig';
import { mergeConfig } from '../config/mergeConfig';
import { createSafeLogger } from '../observability/types';
import {
  createAuthInterceptor,
  createMetadataInterceptor,
  createRequestIdInterceptor,
} from '../interceptors/requestInterceptor';
import { createPlatformResponseInterceptors } from '../interceptors/responseInterceptor';
import {
  createErrorNormalizationInterceptor,
  handleUnauthorized,
} from '../interceptors/errorInterceptor';
import { attachRetryInterceptor } from '../retry/retryInterceptor';
import {
  runAfterResponseHook,
  runBeforeRequestHook,
  runOnErrorHook,
} from '../hooks/types';
import { ApiError } from '../error/ApiError';
import { normalizeAxiosError } from '../error/normalizeError';
import { ApiClient } from './ApiClient';

/**
 * Interceptor pipeline (request):
 * 1. Platform request ID
 * 2. Platform metadata headers
 * 3. Authentication (Bearer token when configured)
 * 4. Consumer request interceptors
 *
 * Interceptor pipeline (response):
 * 1. Platform response interceptors (logging)
 * 2. Consumer response interceptors
 *
 * Error pipeline:
 * 1. Retry (idempotent methods only, when enabled)
 * 2. Error normalization → ApiError
 * 3. Unauthorized handler
 * 4. Consumer error interceptors
 * 5. Lifecycle onError hooks
 */
export function createApiClient(config?: ApiClientConfig): ApiClient {
  const resolved = mergeConfig(config);
  resolved.logger = createSafeLogger(resolved.logger);

  const instance = axios.create({
    baseURL: resolved.baseURL,
    timeout: resolved.timeout,
    withCredentials: resolved.withCredentials,
    headers: {
      'Content-Type': 'application/json',
      ...resolved.headers,
    },
  });

  registerRequestInterceptors(instance, resolved);
  attachRetryInterceptor(instance, resolved);
  registerResponseInterceptors(instance, resolved);
  registerErrorInterceptors(instance, resolved);

  return new ApiClient(instance, resolved);
}

function registerRequestInterceptors(
  instance: AxiosInstance,
  config: ResolvedApiClientConfig,
): void {
  instance.interceptors.request.use(createRequestIdInterceptor(config));
  instance.interceptors.request.use(createMetadataInterceptor(config));
  instance.interceptors.request.use(createAuthInterceptor(config));

  for (const interceptor of config.interceptors.request) {
    instance.interceptors.request.use(interceptor);
  }

  instance.interceptors.request.use(async (requestConfig) => {
    const startedAt = Date.now();
    (requestConfig as InternalAxiosRequestConfig & { __startedAt?: number }).__startedAt = startedAt;

    const headerName = config.requestId.headerName;
    const requestId =
      requestConfig.headers.get(headerName) ??
      requestConfig.headers.get(headerName.toLowerCase());

    await runBeforeRequestHook(config, {
      method: (requestConfig.method ?? 'GET').toUpperCase(),
      url: requestConfig.url ?? '',
      baseURL: requestConfig.baseURL,
      headers: requestConfig.headers as unknown as Record<string, unknown>,
      requestId: requestId ? String(requestId) : undefined,
    });

    config.logger?.debug?.('HTTP request started', {
      method: requestConfig.method?.toUpperCase(),
      url: requestConfig.url,
      baseURL: requestConfig.baseURL,
      requestId,
    });

    config.eventBus?.emit(PaletteEvents.API_REQUEST, {
      method: requestConfig.method?.toUpperCase(),
      url: requestConfig.url,
    });

    return requestConfig;
  });
}

function registerResponseInterceptors(
  instance: AxiosInstance,
  config: ResolvedApiClientConfig,
): void {
  for (const interceptor of createPlatformResponseInterceptors(config)) {
    instance.interceptors.response.use(interceptor);
  }

  for (const interceptor of config.interceptors.response) {
    instance.interceptors.response.use(interceptor);
  }

  instance.interceptors.response.use(async (response) => {
    const startedAt = (
      response.config as InternalAxiosRequestConfig & { __startedAt?: number }
    ).__startedAt;
    const durationMs = startedAt ? Date.now() - startedAt : undefined;
    const headerName = config.requestId.headerName;
    const requestId =
      response.headers[headerName.toLowerCase()] ??
      response.headers[headerName] ??
      response.config.headers.get(headerName);

    await runAfterResponseHook(config, {
      status: response.status,
      data: response.data,
      headers: response.headers as Record<string, unknown>,
      requestId: requestId ? String(requestId) : undefined,
      durationMs,
    });

    config.eventBus?.emit(PaletteEvents.API_RESPONSE, {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
    });

    config.logger?.info?.('HTTP request completed', {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
      durationMs,
      requestId,
    });

    return response;
  });
}

function registerErrorInterceptors(
  instance: AxiosInstance,
  config: ResolvedApiClientConfig,
): void {
  instance.interceptors.response.use(
    (response) => response,
    createErrorNormalizationInterceptor(),
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => handleUnauthorized(error, config),
  );

  for (const interceptor of config.interceptors.error) {
    instance.interceptors.response.use(
      (response) => response,
      interceptor,
    );
  }

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const apiError = error instanceof ApiError ? error : normalizeAxiosError(error);

      if (apiError.status === 401) {
        config.eventBus?.emit(PaletteEvents.AUTH_EXPIRED);
      }

      await runOnErrorHook(config, apiError);
      config.eventBus?.emit(PaletteEvents.ERROR, apiError);

      config.logger?.error?.('HTTP request failed', {
        code: apiError.code,
        status: apiError.status,
        message: apiError.message,
        requestId: apiError.requestId,
      });

      return Promise.reject(apiError);
    },
  );
}
