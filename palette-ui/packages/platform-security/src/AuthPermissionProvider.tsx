import { useAuth } from './auth/AuthProvider';
import { PermissionProvider } from './PermissionProvider';
import type { Permission } from './permissions';

export interface AuthPermissionProviderProps {
  fallbackPermissions?: Permission[];
  children: React.ReactNode;
}

/** Permission provider that reads permissions from BFF auth context. */
export function AuthPermissionProvider({
  fallbackPermissions = [],
  children,
}: AuthPermissionProviderProps) {
  const { user, isLoading } = useAuth();
  const permissions = isLoading ? fallbackPermissions : (user?.permissions ?? []);

  return <PermissionProvider permissions={permissions}>{children}</PermissionProvider>;
}
