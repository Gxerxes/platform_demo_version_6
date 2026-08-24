import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
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
import { runAfterResponseHook, runBeforeRequestHook, runOnErrorHook } from '../hooks/hooks';
import { ApiError } from '../error/ApiError';
import { normalizeAxiosError } from '../error/normalizeError';
import { ApiClient } from './ApiClient';

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
    (requestConfig as InternalAxiosRequestConfig & { __startedAt?: number }).__startedAt =
      Date.now();

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
      requestId,
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
    const headerName = config.requestId.headerName;
    const requestId =
      response.headers[headerName.toLowerCase()] ??
      response.headers[headerName] ??
      response.config.headers.get(headerName);

    await runAfterResponseHook(config, {
      method: (response.config.method ?? 'GET').toUpperCase(),
      url: response.config.url ?? '',
      status: response.status,
      data: response.data,
      headers: response.headers as Record<string, unknown>,
      requestId: requestId ? String(requestId) : undefined,
      durationMs: startedAt ? Date.now() - startedAt : undefined,
    });

    config.logger?.info?.('HTTP request completed', {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
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
    instance.interceptors.response.use((response) => response, interceptor);
  }

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const apiError = error instanceof ApiError ? error : normalizeAxiosError(error);
      await runOnErrorHook(config, apiError);

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
