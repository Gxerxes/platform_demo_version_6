export type Permission = string;

export interface PermissionContextValue {
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
}

export function createPermissionChecker(permissions: Permission[]): Omit<PermissionContextValue, 'permissions'> {
  const permissionSet = new Set(permissions);

  return {
    hasPermission: (permission) => permissionSet.has(permission),
    hasAnyPermission: (required) => required.some((p) => permissionSet.has(p)),
    hasAllPermissions: (required) => required.every((p) => permissionSet.has(p)),
  };
}
