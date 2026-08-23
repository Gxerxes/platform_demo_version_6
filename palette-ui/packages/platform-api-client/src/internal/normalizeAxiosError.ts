import axios from 'axios';
import { ApiError } from '../errors';

const STATUS_CODE_MAP: Record<number, string> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'UNPROCESSABLE_ENTITY',
  429: 'TOO_MANY_REQUESTS',
  500: 'INTERNAL_SERVER_ERROR',
};

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

  return STATUS_CODE_MAP[status] ?? 'API_ERROR';
}

function extractRequestId(headers: Record<string, unknown> | undefined): string | undefined {
  if (!headers) {
    return undefined;
  }

  const requestId =
    headers['x-request-id'] ??
    headers['X-Request-ID'] ??
    headers['X-Request-Id'];

  return typeof requestId === 'string' ? requestId : undefined;
}

export function normalizeAxiosError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.message.toLowerCase().includes('timeout')) {
      return new ApiError('Request timed out', 0, 'TIMEOUT_ERROR', undefined, undefined);
    }

    if (!error.response) {
      return new ApiError(
        error.message || 'Network error',
        0,
        'NETWORK_ERROR',
        undefined,
        undefined,
      );
    }

    const { status, data, headers } = error.response;
    const requestId = extractRequestId(headers as Record<string, unknown>);
    const message = extractMessage(data, error.message || 'Request failed');
    const code = extractCode(data, status);

    return new ApiError(message, status, code, data, requestId);
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 0, 'UNKNOWN_ERROR', undefined, undefined);
  }

  return new ApiError('An unexpected error occurred', 0, 'UNKNOWN_ERROR', error, undefined);
}
