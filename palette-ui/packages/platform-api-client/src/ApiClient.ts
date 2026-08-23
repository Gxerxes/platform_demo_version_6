import type { PaletteApiConfig } from '@palette/platform-config';
import type { EventBus } from '@palette/platform-event';
import { PaletteEvents } from '@palette/platform-event';
import { ApiError } from './errors';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export interface ApiClientConfig extends PaletteApiConfig {
  eventBus?: EventBus;
  onError?: (error: ApiError) => void;
}

export class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private eventBus?: EventBus;
  private onError?: (error: ApiError) => void;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.timeout = config.timeout ?? 30000;
    this.eventBus = config.eventBus;
    this.onError = config.onError;
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', path, undefined, options);
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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const requestInit: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      credentials: 'include',
      signal: options?.signal ?? controller.signal,
    };

    if (body !== undefined && method !== 'GET' && method !== 'DELETE') {
      requestInit.body = JSON.stringify(body);
    }

    this.eventBus?.emit(PaletteEvents.API_REQUEST, { method, url });

    try {
      const response = await fetch(url, requestInit);
      clearTimeout(timeoutId);

      const data = await this.parseResponse(response);

      this.eventBus?.emit(PaletteEvents.API_RESPONSE, {
        method,
        url,
        status: response.status,
      });

      if (!response.ok) {
        const error = new ApiError(
          (data as { message?: string })?.message ?? response.statusText,
          response.status,
          (data as { code?: string })?.code,
          data,
        );

        if (response.status === 401) {
          this.eventBus?.emit(PaletteEvents.AUTH_EXPIRED);
        }

        this.onError?.(error);
        this.eventBus?.emit(PaletteEvents.ERROR, error);
        throw error;
      }

      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      const apiError = new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0,
        'NETWORK_ERROR',
      );

      this.onError?.(apiError);
      this.eventBus?.emit(PaletteEvents.ERROR, apiError);
      throw apiError;
    }
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(`${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private async parseResponse(response: Response): Promise<unknown> {
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      return response.json();
    }

    const text = await response.text();
    return text ? { message: text } : null;
  }
}
