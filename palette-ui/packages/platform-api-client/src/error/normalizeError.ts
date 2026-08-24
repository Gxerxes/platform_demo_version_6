import axios from 'axios';
import { ApiError } from './ApiError';
import { ErrorCode, statusToErrorCode } from './ErrorCode';
import type { PaletteError } from './types';

function extractMessage(data: unknown, fallback: string): string {
  if (typeof data === 'object' && data !== null && 'message' in data) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === 'string' && message.length > 0) {
      return message;
    }
  }

  return fallback;
}

function extractCode(data: unknown, status: number): string {
  if (typeof data === 'object' && data !== null && 'code' in data) {
    const code = (data as { code?: unknown }).code;
    if (typeof code === 'string' && code.length > 0) {
      return code;
    }
  }

  return statusToErrorCode(status);
}

function extractRequestId(
  headers: Record<string, unknown> | undefined,
  configHeaders?: Record<string, unknown>,
): string | undefined {
  const fromResponse =
    headers?.['x-request-id'] ?? headers?.['X-Request-ID'] ?? headers?.['X-Request-Id'];
  if (typeof fromResponse === 'string') {
    return fromResponse;
  }

  const fromRequest =
    configHeaders?.['X-Request-ID'] ??
    configHeaders?.['x-request-id'] ??
    configHeaders?.['X-Request-Id'];
  return typeof fromRequest === 'string' ? fromRequest : undefined;
}

export function normalizeAxiosError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const configHeaders = error.config?.headers as Record<string, unknown> | undefined;

    if (error.code === 'ECONNABORTED' || error.message.toLowerCase().includes('timeout')) {
      return new ApiError({
        message: 'Request timed out',
        code: ErrorCode.REQUEST_TIMEOUT,
        status: 408,
        originalError: error,
        requestId: extractRequestId(undefined, configHeaders),
      });
    }

    if (!error.response) {
      return new ApiError({
        message: error.message || 'Network error',
        code: ErrorCode.NETWORK_ERROR,
        status: 0,
        originalError: error,
        requestId: extractRequestId(undefined, configHeaders),
      });
    }

    const { status, data, headers } = error.response;
    const requestId = extractRequestId(headers as Record<string, unknown>, configHeaders);

    return new ApiError({
      message: extractMessage(data, error.message || 'Request failed'),
      code: extractCode(data, status),
      status,
      details: data,
      requestId,
      originalError: error,
    });
  }

  if (error instanceof Error) {
    return new ApiError({
      message: error.message,
      code: ErrorCode.UNKNOWN_ERROR,
      originalError: error,
    });
  }

  return new ApiError({
    message: 'An unexpected error occurred',
    code: ErrorCode.UNKNOWN_ERROR,
    details: error,
    originalError: error,
  });
}

export function isPaletteError(error: unknown): error is PaletteError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    typeof (error as PaletteError).code === 'string' &&
    typeof (error as PaletteError).message === 'string'
  );
}

export function normalizeError(error: unknown): PaletteError {
  if (isPaletteError(error)) {
    return error;
  }

  if (error instanceof ApiError) {
    return {
      code: error.code,
      message: error.message,
      status: error.status,
      details: error.details,
      requestId: error.requestId,
    };
  }

  if (error instanceof Error) {
    return {
      code: ErrorCode.UNKNOWN_ERROR,
      message: error.message,
    };
  }

  return {
    code: ErrorCode.UNKNOWN_ERROR,
    message: 'An unexpected error occurred',
    details: error,
  };
}
