import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AuthError, createAuthApi } from './authApi';

describe('AuthError', () => {
  it('creates error with code and status', () => {
    const error = new AuthError('AUTH_REQUIRED', 'Authentication required', 401);
    expect(error.code).toBe('AUTH_REQUIRED');
    expect(error.status).toBe(401);
    expect(error.message).toBe('Authentication required');
  });
});

describe('createAuthApi', () => {
  beforeEach(() => {
    vi.stubGlobal('location', { href: '' });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('uses default auth paths when optional paths are undefined', () => {
    const api = createAuthApi({
      baseUrl: '/api',
      loginPath: undefined,
      logoutPath: undefined,
      userPath: undefined,
      sessionPath: undefined,
      statusPath: undefined,
    });

    api.login();

    expect(window.location.href).toBe('/api/auth/login');
  });
});
