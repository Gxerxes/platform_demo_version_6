export interface RetryConfig {
  enabled?: boolean;
  retries?: number;
  retryDelay?: number;
  retryOn?: number[];
  retryMethods?: string[];
}

export const DEFAULT_RETRY_METHODS = ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'] as const;

export const NON_RETRYABLE_STATUS = new Set([401, 403, 404]);

export function shouldRetryRequest(
  method: string | undefined,
  status: number | undefined,
  retryCount: number,
  config: Required<RetryConfig>,
): boolean {
  if (!config.enabled || retryCount >= config.retries) {
    return false;
  }

  const normalizedMethod = (method ?? 'GET').toUpperCase();
  if (!config.retryMethods.map((m) => m.toUpperCase()).includes(normalizedMethod)) {
    return false;
  }

  if (status !== undefined && NON_RETRYABLE_STATUS.has(status)) {
    return false;
  }

  if (status === undefined) {
    // Network errors may retry for idempotent methods.
    return true;
  }

  return config.retryOn.includes(status);
}

export function calculateRetryDelay(retryDelay: number, retryCount: number): number {
  return retryDelay * 2 ** retryCount;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

interface RetryAxiosConfig {
  __retryCount?: number;
}

export function getRetryCount(config: RetryAxiosConfig | undefined): number {
  return config?.__retryCount ?? 0;
}

export function incrementRetryCount<T extends RetryAxiosConfig>(config: T): T {
  return {
    ...config,
    __retryCount: getRetryCount(config) + 1,
  };
}
