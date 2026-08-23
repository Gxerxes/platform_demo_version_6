import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import type { PaletteApiConfig, PaletteAppMetadata } from '@palette/platform-config';

export interface AxiosClientOptions {
  api: PaletteApiConfig;
  metadata?: PaletteAppMetadata;
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function attachRequestHeaders(
  config: InternalAxiosRequestConfig,
  metadata?: PaletteAppMetadata,
): InternalAxiosRequestConfig {
  const requestId = generateId();
  const headers = config.headers;

  headers.set('X-Request-ID', requestId);
  headers.set('X-Correlation-ID', requestId);

  if (metadata?.applicationId) {
    headers.set('X-Application-ID', metadata.applicationId);
  }

  if (metadata?.clientVersion) {
    headers.set('X-Client-Version', metadata.clientVersion);
  }

  return config;
}

export function createAxiosInstance(options: AxiosClientOptions): AxiosInstance {
  const { api, metadata } = options;

  const instance = axios.create({
    baseURL: api.baseUrl.replace(/\/$/, ''),
    timeout: api.timeout ?? 30_000,
    withCredentials: api.withCredentials ?? true,
    headers: {
      'Content-Type': 'application/json',
      ...api.headers,
    },
  });

  instance.interceptors.request.use((config) => attachRequestHeaders(config, metadata));

  return instance;
}
