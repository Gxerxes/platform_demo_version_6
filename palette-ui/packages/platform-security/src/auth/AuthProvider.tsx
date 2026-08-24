import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { PalettePlatformConfig } from '@palette/platform-config';
import { PaletteEvents, useEventBus } from '@palette/platform-event';
import { AuthError, createAuthApi, type AuthSession, type AuthUser } from './authApi';

export interface AuthContextValue {
  user: AuthUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export interface AuthProviderProps {
  config: PalettePlatformConfig;
  children: ReactNode;
  onSessionExpired?: () => void;
}

export function AuthProvider({ config, children, onSessionExpired }: AuthProviderProps) {
  const eventBus = useEventBus();
  const authApi = useMemo(
    () =>
      createAuthApi({
        baseURL: config.api.baseURL,
        loginPath: config.auth?.loginPath,
        logoutPath: config.auth?.logoutPath,
        userPath: config.auth?.userPath,
        sessionPath: config.auth?.sessionPath,
        statusPath: config.auth?.statusPath,
      }),
    [config],
  );

  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const status = await authApi.getStatus();
      setUser(status.user);
      setSession(status.session);
    } catch (err) {
      setUser(null);
      setSession(null);
      if (err instanceof AuthError && err.status === 401) {
        setError(null);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load auth status');
      }
    } finally {
      setIsLoading(false);
    }
  }, [authApi]);

  const login = useCallback(async () => {
    await authApi.login();
    await refresh();
  }, [authApi, refresh]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setSession(null);
    }
  }, [authApi]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const unsubscribe = eventBus.on(PaletteEvents.AUTH_EXPIRED, () => {
      setUser(null);
      setSession(null);
      onSessionExpired?.();
    });
    return unsubscribe;
  }, [eventBus, onSessionExpired]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      isAuthenticated: Boolean(user),
      isLoading,
      error,
      login,
      logout,
      refresh,
    }),
    [user, session, isLoading, error, login, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
