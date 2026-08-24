export interface AuthUser {
  userId: string;
  username: string;
  displayName: string;
  email: string | null;
  permissions: string[];
}

export interface AuthSession {
  authenticated: boolean;
  expiresAt: string | null;
}

export interface AuthStatusResponse {
  authenticated: boolean;
  user: AuthUser | null;
  session: AuthSession | null;
}

export interface AuthApiConfig {
  baseURL: string;
  loginPath?: string;
  logoutPath?: string;
  userPath?: string;
  sessionPath?: string;
  statusPath?: string;
}

const DEFAULT_PATHS = {
  loginPath: '/auth/login',
  logoutPath: '/auth/logout',
  userPath: '/auth/user',
  sessionPath: '/auth/session',
  statusPath: '/auth/status',
} as const;

function resolveUrl(baseURL: string, path: string): string {
  const base = baseURL.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

export function createAuthApi(config: AuthApiConfig) {
  const paths = {
    loginPath: config.loginPath ?? DEFAULT_PATHS.loginPath,
    logoutPath: config.logoutPath ?? DEFAULT_PATHS.logoutPath,
    userPath: config.userPath ?? DEFAULT_PATHS.userPath,
    sessionPath: config.sessionPath ?? DEFAULT_PATHS.sessionPath,
    statusPath: config.statusPath ?? DEFAULT_PATHS.statusPath,
  };

  async function request<T>(url: string, init?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      credentials: 'include',
      ...init,
      headers: {
        Accept: 'application/json',
        ...init?.headers,
      },
    });

    if (response.status === 401) {
      throw new AuthError('AUTH_REQUIRED', 'Authentication required', 401);
    }

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const message = (body as { message?: string }).message ?? response.statusText;
      const code = (body as { code?: string }).code ?? 'AUTH_ERROR';
      throw new AuthError(code, message, response.status);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  return {
    getStatus: () => request<AuthStatusResponse>(resolveUrl(config.baseURL, paths.statusPath)),
    getUser: () => request<AuthUser>(resolveUrl(config.baseURL, paths.userPath)),
    getSession: () => request<AuthSession>(resolveUrl(config.baseURL, paths.sessionPath)),
    login: async () => {
      const url = resolveUrl(config.baseURL, paths.loginPath);
      const response = await fetch(url, {
        credentials: 'include',
        redirect: 'manual',
      });

      if (response.type === 'opaqueredirect' || response.status === 302) {
        window.location.href = url;
        return;
      }

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const message = (body as { message?: string }).message ?? response.statusText;
        throw new AuthError('AUTH_ERROR', message, response.status);
      }
    },
    logout: () =>
      request<void>(resolveUrl(config.baseURL, paths.logoutPath), { method: 'POST' }),
  };
}

export class AuthError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
