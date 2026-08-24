import type { InternalAxiosRequestConfig } from 'axios';
import type { ResolvedApiClientConfig } from '../config/ApiClientConfig';
import { generateRequestId } from '../utils/requestId';

export function createRequestIdInterceptor(
  config: ResolvedApiClientConfig,
): (requestConfig: InternalAxiosRequestConfig) => InternalAxiosRequestConfig {
  const headerName = config.requestId.headerName;
  const correlationHeaderName = config.requestId.correlationHeaderName;

  return (requestConfig) => {
    if (!config.requestId.enabled) {
      return requestConfig;
    }

    const headers = requestConfig.headers;
    const existing =
      headers.get(headerName) ??
      headers.get(headerName.toLowerCase()) ??
      headers.get('X-Request-Id');

    const requestId = existing ? String(existing) : generateRequestId();

    if (!existing) {
      headers.set(headerName, requestId);
    }

    if (correlationHeaderName && !headers.get(correlationHeaderName)) {
      headers.set(correlationHeaderName, requestId);
    }

    return requestConfig;
  };
}

export function createMetadataInterceptor(
  config: ResolvedApiClientConfig,
): (requestConfig: InternalAxiosRequestConfig) => InternalAxiosRequestConfig {
  return (requestConfig) => {
    if (!config.metadata) {
      return requestConfig;
    }

    const headers = requestConfig.headers;

    if (config.metadata.applicationId && !headers.get('X-Application-ID')) {
      headers.set('X-Application-ID', config.metadata.applicationId);
    }

    if (config.metadata.clientVersion && !headers.get('X-Client-Version')) {
      headers.set('X-Client-Version', config.metadata.clientVersion);
    }

    return requestConfig;
  };
}

export function createAuthInterceptor(
  config: ResolvedApiClientConfig,
): (requestConfig: InternalAxiosRequestConfig) => Promise<InternalAxiosRequestConfig> {
  return async (requestConfig) => {
    if (!config.auth.enabled || !config.auth.getAccessToken) {
      return requestConfig;
    }

    const headers = requestConfig.headers;
    const existingAuth = headers.get('Authorization') ?? headers.get('authorization');

    if (existingAuth) {
      return requestConfig;
    }

    try {
      const token = await config.auth.getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    } catch {
      // Token retrieval failure must not expose sensitive information.
    }

    return requestConfig;
  };
}
