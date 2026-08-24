import { describe, expect, it } from 'vitest';
import axios from 'axios';
import { ApiError } from './ApiError';
import { normalizeAxiosError, normalizeError } from './normalizeError';
import { ErrorCode } from './ErrorCode';

describe('normalizeAxiosError', () => {
  it('normalizes 401 to UNAUTHORIZED', () => {
    const error = new axios.AxiosError(
      'Unauthorized',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config: { headers: new axios.AxiosHeaders() },
        data: { message: 'Unauthorized' },
      },
    );

    const result = normalizeAxiosError(error);
    expect(result.code).toBe(ErrorCode.UNAUTHORIZED);
    expect(result.status).toBe(401);
  });

  it('normalizes timeout to REQUEST_TIMEOUT', () => {
    const error = new axios.AxiosError('timeout of 10000ms exceeded', 'ECONNABORTED');
    expect(normalizeAxiosError(error).code).toBe(ErrorCode.REQUEST_TIMEOUT);
  });

  it('normalizes network errors', () => {
    const error = new axios.AxiosError('Network Error', 'ERR_NETWORK');
    expect(normalizeAxiosError(error).code).toBe(ErrorCode.NETWORK_ERROR);
  });
});

describe('normalizeError', () => {
  it('normalizes ApiError to plain object', () => {
    const error = new ApiError({
      message: 'Not found',
      code: ErrorCode.NOT_FOUND,
      status: 404,
    });
    expect(normalizeError(error).code).toBe(ErrorCode.NOT_FOUND);
  });
});
