import axios from 'axios';
import { ErrorCode } from '../error/ErrorCode';
import { ApiError } from '../error/ApiError';
import { normalizeAxiosError } from '../error/normalizeError';
import type { ResolvedApiClientConfig } from '../config/ApiClientConfig';

export async function handleUnauthorized(
  error: unknown,
  config: ResolvedApiClientConfig,
): Promise<unknown> {
  const apiError = error instanceof ApiError ? error : normalizeAxiosError(error);

  if (apiError.code === ErrorCode.UNAUTHORIZED || apiError.status === 401) {
    try {
      await config.auth.onUnauthorized?.();
    } catch {
      // Isolated handler failure must not mask the original error.
    }
  }

  return Promise.reject(apiError);
}

export function createErrorNormalizationInterceptor(): (
  error: unknown,
) => Promise<never> {
  return async (error) => {
    if (error instanceof ApiError) {
      return Promise.reject(error);
    }

    if (axios.isAxiosError(error)) {
      return Promise.reject(normalizeAxiosError(error));
    }

    return Promise.reject(
      new ApiError({
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        code: ErrorCode.UNKNOWN_ERROR,
        originalError: error,
      }),
    );
  };
}
