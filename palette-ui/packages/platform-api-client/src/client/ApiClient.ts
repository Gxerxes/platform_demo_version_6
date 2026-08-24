import type { AxiosInstance } from 'axios';
import type { ResolvedApiClientConfig } from '../config/ApiClientConfig';
import {
  normalizePageResponse,
  toPageQueryParams,
  type PageRequest,
  type PageResponse,
} from '../pagination';
import type { ApiRequestConfig, ApiResponse, HttpMethod } from './types';

export class ApiClient {
  constructor(
    private readonly axios: AxiosInstance,
    private readonly config: ResolvedApiClientConfig,
  ) {}

  get<T>(url: string, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>({ method: 'GET', url, ...config });
  }

  getPage<T>(url: string, pageRequest?: PageRequest, config?: ApiRequestConfig): Promise<PageResponse<T>> {
    const params = { ...config?.params, ...toPageQueryParams(pageRequest) };
    return this.get<unknown>(url, { ...config, params }).then((data) =>
      normalizePageResponse<T>(data, pageRequest),
    );
  }

  post<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>({ method: 'POST', url, data, ...config });
  }

  put<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>({ method: 'PUT', url, data, ...config });
  }

  patch<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>({ method: 'PATCH', url, data, ...config });
  }

  delete<T>(url: string, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>({ method: 'DELETE', url, ...config });
  }

  async request<T>(
    requestConfig: ApiRequestConfig & { method: HttpMethod; url: string; data?: unknown },
  ): Promise<T> {
    const response = await this.requestWithMeta<T>(requestConfig);
    return response.data;
  }

  async requestWithMeta<T>(
    requestConfig: ApiRequestConfig & { method: HttpMethod; url: string; data?: unknown },
  ): Promise<ApiResponse<T>> {
    const { method, url, data, params, headers, signal, timeout } = requestConfig;

    const response = await this.axios.request<T>({
      method,
      url: url.startsWith('/') ? url : `/${url}`,
      data,
      params,
      headers,
      signal,
      timeout: timeout ?? this.config.timeout,
    });

    const requestIdHeader = this.config.requestId.headerName;

    return {
      data: response.data,
      status: response.status,
      headers: response.headers as Record<string, string>,
      requestId:
        response.headers[requestIdHeader.toLowerCase()] ??
        response.headers[requestIdHeader] ??
        undefined,
    };
  }
}
