import type { AxiosResponse } from 'axios';
import type { ResolvedApiClientConfig } from '../config/ApiClientConfig';
import type { ApiLogger } from '../observability/types';

export function createResponseLoggingInterceptor(
  logger: ApiLogger | undefined,
): (response: AxiosResponse) => AxiosResponse {
  return (response) => {
    logger?.debug?.('HTTP response received', {
      status: response.status,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
    });
    return response;
  };
}

export function createPlatformResponseInterceptors(
  config: ResolvedApiClientConfig,
): Array<(response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>> {
  const interceptors: Array<(response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>> =
    [];

  if (config.logger) {
    interceptors.push(createResponseLoggingInterceptor(config.logger));
  }

  return interceptors;
}
