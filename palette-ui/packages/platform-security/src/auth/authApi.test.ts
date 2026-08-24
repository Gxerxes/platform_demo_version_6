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
  const location = { href: '' };

  beforeEach(() => {
    location.href = '';
    vi.stubGlobal('window', { location });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('uses default auth paths when optional paths are undefined', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      type: 'basic',
    });
    vi.stubGlobal('fetch', fetchMock);

    const api = createAuthApi({
      baseURL: '/api',
      loginPath: undefined,
      logoutPath: undefined,
      userPath: undefined,
      sessionPath: undefined,
      statusPath: undefined,
    });

    await api.login();

    expect(fetchMock).toHaveBeenCalledWith('/api/auth/login', {
      credentials: 'include',
      redirect: 'manual',
    });
  });
});
