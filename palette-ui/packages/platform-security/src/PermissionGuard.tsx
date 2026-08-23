import type { ReactNode } from 'react';
import { usePermission } from './PermissionProvider';
import type { Permission } from './permissions';

export interface PermissionGuardProps {
  permission?: Permission;
  anyOf?: Permission[];
  allOf?: Permission[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGuard({
  permission,
  anyOf,
  allOf,
  fallback = null,
  children,
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();

  const allowed = (() => {
    if (permission && !hasPermission(permission)) return false;
    if (anyOf && !hasAnyPermission(anyOf)) return false;
    if (allOf && !hasAllPermissions(allOf)) return false;
    return true;
  })();

  return allowed ? <>{children}</> : <>{fallback}</>;
}
