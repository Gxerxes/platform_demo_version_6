import type { ApiClientConfig, ResolvedApiClientConfig } from './ApiClientConfig';
import { DEFAULT_API_CLIENT_CONFIG } from './ApiClientDefaults';

function mergeRecords(
  base: Record<string, string>,
  override?: Record<string, string>,
): Record<string, string> {
  return override ? { ...base, ...override } : { ...base };
}

export function mergeConfig(config?: ApiClientConfig): ResolvedApiClientConfig {
  const baseURL = (config?.baseURL ?? DEFAULT_API_CLIENT_CONFIG.baseURL).replace(/\/$/, '');

  return {
    baseURL,
    timeout: config?.timeout ?? DEFAULT_API_CLIENT_CONFIG.timeout,
    withCredentials: config?.withCredentials ?? DEFAULT_API_CLIENT_CONFIG.withCredentials,
    headers: mergeRecords(DEFAULT_API_CLIENT_CONFIG.headers, config?.headers),
    auth: { ...DEFAULT_API_CLIENT_CONFIG.auth, ...config?.auth },
    retry: {
      ...DEFAULT_API_CLIENT_CONFIG.retry,
      ...config?.retry,
      retryOn: config?.retry?.retryOn
        ? [...config.retry.retryOn]
        : [...DEFAULT_API_CLIENT_CONFIG.retry.retryOn],
      retryMethods: config?.retry?.retryMethods
        ? [...config.retry.retryMethods]
        : [...DEFAULT_API_CLIENT_CONFIG.retry.retryMethods],
    },
    interceptors: {
      request: [
        ...DEFAULT_API_CLIENT_CONFIG.interceptors.request,
        ...(config?.interceptors?.request ?? []),
      ],
      response: [
        ...DEFAULT_API_CLIENT_CONFIG.interceptors.response,
        ...(config?.interceptors?.response ?? []),
      ],
      error: [
        ...DEFAULT_API_CLIENT_CONFIG.interceptors.error,
        ...(config?.interceptors?.error ?? []),
      ],
    },
    hooks: config?.hooks ? { ...config.hooks } : undefined,
    logger: config?.logger,
    requestId: { ...DEFAULT_API_CLIENT_CONFIG.requestId, ...config?.requestId },
    metadata: config?.metadata ? { ...config.metadata } : undefined,
  };
}
