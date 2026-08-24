import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

export type ApiRequestInterceptor = (
  config: InternalAxiosRequestConfig,
) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;

export type ApiResponseInterceptor = (
  response: AxiosResponse,
) => AxiosResponse | Promise<AxiosResponse>;

export type ApiErrorInterceptor = (error: unknown) => unknown | Promise<unknown>;

export interface ApiRequestContext {
  method: string;
  url: string;
  baseURL?: string;
  headers: Record<string, unknown>;
  requestId?: string;
}

export interface ApiResponseContext<T = unknown> {
  method: string;
  url: string;
  status: number;
  data: T;
  headers: Record<string, unknown>;
  requestId?: string;
  durationMs?: number;
}
