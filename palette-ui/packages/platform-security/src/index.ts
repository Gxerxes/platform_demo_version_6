export { AuthGuard } from './auth/AuthGuard';
export type { AuthGuardProps } from './auth/AuthGuard';
export { AuthProvider, useAuth } from './auth/AuthProvider';
export type { AuthContextValue, AuthProviderProps } from './auth/AuthProvider';
export { UserMenu } from './auth/UserMenu';
export { AuthError, createAuthApi } from './auth/authApi';
export type { AuthApiConfig, AuthSession, AuthStatusResponse, AuthUser } from './auth/authApi';
export { AuthPermissionProvider } from './AuthPermissionProvider';
export type { AuthPermissionProviderProps } from './AuthPermissionProvider';
export { PermissionGuard } from './PermissionGuard';
export type { PermissionGuardProps } from './PermissionGuard';
export { PermissionProvider, usePermission } from './PermissionProvider';
export type { PermissionProviderProps } from './PermissionProvider';
export { filterNavigationByPermission } from './filterNavigation';
export { createPermissionChecker } from './permissions';
export type { Permission, PermissionContextValue } from './permissions';

export const PLATFORM_SECURITY_VERSION = '0.5.0';
