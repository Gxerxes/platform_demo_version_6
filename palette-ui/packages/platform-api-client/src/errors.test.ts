import { describe, expect, it } from 'vitest';
import { ApiError, normalizeError } from './errors';
import { normalizeAxiosError } from './internal/normalizeAxiosError';
import axios from 'axios';

describe('normalizeError', () => {
  it('normalizes ApiError', () => {
    const error = new ApiError('Not found', 404, 'NOT_FOUND');
    const result = normalizeError(error);
    expect(result.code).toBe('NOT_FOUND');
    expect(result.status).toBe(404);
  });

  it('normalizes generic Error', () => {
    const result = normalizeError(new Error('Something failed'));
    expect(result.code).toBe('UNKNOWN_ERROR');
    expect(result.message).toBe('Something failed');
  });
});

describe('normalizeAxiosError', () => {
  it('maps HTTP status codes', () => {
    const error = new axios.AxiosError(
      'Forbidden',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 403,
        statusText: 'Forbidden',
        headers: {},
        config: { headers: new axios.AxiosHeaders() },
        data: { message: 'Access denied' },
      },
    );

    const result = normalizeAxiosError(error);
    expect(result.status).toBe(403);
    expect(result.code).toBe('FORBIDDEN');
    expect(result.message).toBe('Access denied');
  });

  it('maps timeout errors', () => {
    const error = new axios.AxiosError('timeout of 30000ms exceeded', 'ECONNABORTED');
    const result = normalizeAxiosError(error);
    expect(result.code).toBe('TIMEOUT_ERROR');
    expect(result.status).toBe(0);
  });

  it('maps network errors', () => {
    const error = new axios.AxiosError('Network Error', 'ERR_NETWORK');
    const result = normalizeAxiosError(error);
    expect(result.code).toBe('NETWORK_ERROR');
    expect(result.status).toBe(0);
  });
});
