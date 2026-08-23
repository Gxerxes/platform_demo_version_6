export { ApiClient } from './ApiClient';
export type { ApiClientConfig, HttpMethod, RequestOptions } from './ApiClient';
export { ApiClientProvider, useApiClient } from './ApiClientProvider';
export type { ApiClientProviderProps } from './ApiClientProvider';
export { ApiError, isPaletteError, normalizeError } from './errors';
export type { PaletteError } from './errors';

export const PLATFORM_API_CLIENT_VERSION = '0.3.0';
