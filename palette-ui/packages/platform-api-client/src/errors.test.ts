import { describe, it, expect } from 'vitest';
import { ApiError, normalizeError } from './errors';

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
