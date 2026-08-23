import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { createPermissionChecker, type Permission, type PermissionContextValue } from './permissions';

const PermissionContext = createContext<PermissionContextValue | null>(null);

export interface PermissionProviderProps {
  permissions: Permission[];
  children: ReactNode;
}

export function PermissionProvider({ permissions, children }: PermissionProviderProps) {
  const value = useMemo<PermissionContextValue>(
    () => ({
      permissions,
      ...createPermissionChecker(permissions),
    }),
    [permissions],
  );

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}

export function usePermission(): PermissionContextValue {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermission must be used within PermissionProvider');
  }
  return context;
}
