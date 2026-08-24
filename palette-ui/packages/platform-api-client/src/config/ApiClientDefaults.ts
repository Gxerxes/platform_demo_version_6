import type { ResolvedApiClientConfig } from './ApiClientConfig';

export const DEFAULT_API_CLIENT_CONFIG: ResolvedApiClientConfig = {
  baseURL: '',
  timeout: 10_000,
  withCredentials: true,
  headers: {},
  auth: {
    enabled: true,
  },
  retry: {
    enabled: false,
    retries: 0,
    retryDelay: 500,
    retryOn: [502, 503, 504],
    retryMethods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'],
  },
  interceptors: {
    request: [],
    response: [],
    error: [],
  },
  requestId: {
    enabled: true,
    headerName: 'X-Request-ID',
    correlationHeaderName: 'X-Correlation-ID',
  },
};
