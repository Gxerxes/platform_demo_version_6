import { describe, it, expect } from 'vitest';
import { AuthError } from './authApi';

describe('AuthError', () => {
  it('creates error with code and status', () => {
    const error = new AuthError('AUTH_REQUIRED', 'Authentication required', 401);
    expect(error.code).toBe('AUTH_REQUIRED');
    expect(error.status).toBe(401);
    expect(error.message).toBe('Authentication required');
  });
});
