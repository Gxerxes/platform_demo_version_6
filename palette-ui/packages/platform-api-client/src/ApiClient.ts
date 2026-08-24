import type { PaletteApiConfig, PaletteAppMetadata } from '@palette/platform-config';
import type { EventBus } from '@palette/platform-event';
import { PaletteEvents } from '@palette/platform-event';
import { createAxiosInstance } from './internal/createAxiosInstance';
import { normalizeAxiosError } from './internal/normalizeAxiosError';
import { ApiError } from './errors';
import {
  normalizePageResponse,
  toPageQueryParams,
  type PageRequest,
  type PageResponse,
} from './pagination';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export interface ApiClientConfig extends PaletteApiConfig {
  eventBus?: EventBus;
  metadata?: PaletteAppMetadata;
  onError?: (error: ApiError) => void;
}

export class ApiClient {
  private readonly axios;
  private eventBus?: EventBus;
  private onError?: (error: ApiError) => void;

  constructor(config: ApiClientConfig) {
    this.axios = createAxiosInstance({
      api: config,
      metadata: config.metadata,
    });
    this.eventBus = config.eventBus;
    this.onError = config.onError;
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', path, undefined, options);
  }

  async getPage<T>(
    path: string,
    pageRequest?: PageRequest,
    options?: RequestOptions,
  ): Promise<PageResponse<T>> {
    const params = {
      ...options?.params,
      ...toPageQueryParams(pageRequest),
    };
    const data = await this.get<unknown>(path, { ...options, params });
    return normalizePageResponse<T>(data, pageRequest);
  }

  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', path, body, options);
  }

  async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', path, body, options);
  }

  async patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', path, body, options);
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', path, undefined, options);
  }

  private async request<T>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    const url = this.buildUrl(path, options?.params);

    this.eventBus?.emit(PaletteEvents.API_REQUEST, { method, url });

    try {
      const response = await this.axios.request<T>({
        method,
        url: path.startsWith('/') ? path : `/${path}`,
        data: body,
        params: options?.params,
        headers: options?.headers,
        signal: options?.signal,
      });

      this.eventBus?.emit(PaletteEvents.API_RESPONSE, {
        method,
        url,
        status: response.status,
      });

      return response.data;
    } catch (error) {
      const apiError = normalizeAxiosError(error);

      if (apiError.status === 401) {
        this.eventBus?.emit(PaletteEvents.AUTH_EXPIRED);
      }

      this.onError?.(apiError);
      this.eventBus?.emit(PaletteEvents.ERROR, apiError);
      throw apiError;
    }
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    if (!params) {
      return normalizedPath;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.set(key, String(value));
      }
    });

    const query = searchParams.toString();
    return query ? `${normalizedPath}?${query}` : normalizedPath;
  }
}

export function createApiClient(config: ApiClientConfig): ApiClient {
  return new ApiClient(config);
}
