import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import type { ResolvedApiClientConfig } from '../config/ApiClientConfig';
import {
  calculateRetryDelay,
  shouldRetryRequest,
  sleep,
} from './RetryPolicy';

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  __retryCount?: number;
}

export function attachRetryInterceptor(
  instance: AxiosInstance,
  config: ResolvedApiClientConfig,
): void {
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const requestConfig = error.config as RetryAxiosRequestConfig | undefined;

      if (!requestConfig || !config.retry.enabled) {
        return Promise.reject(error);
      }

      const retryCount = requestConfig.__retryCount ?? 0;
      const status = error.response?.status;

      if (!shouldRetryRequest(requestConfig.method, status, retryCount, config.retry)) {
        return Promise.reject(error);
      }

      requestConfig.__retryCount = retryCount + 1;
      const delay = calculateRetryDelay(config.retry.retryDelay, retryCount);

      config.logger?.warn?.('Retrying HTTP request', {
        method: requestConfig.method?.toUpperCase(),
        url: requestConfig.url,
        attempt: retryCount + 1,
        delayMs: delay,
        status,
      });

      await sleep(delay);
      return instance.request(requestConfig);
    },
  );
}

export function isAxiosRetryError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error);
}
