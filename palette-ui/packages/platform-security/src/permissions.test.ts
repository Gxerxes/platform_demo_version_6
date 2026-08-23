import { describe, it, expect } from 'vitest';
import { createPermissionChecker } from './permissions';

describe('createPermissionChecker', () => {
  const checker = createPermissionChecker(['read', 'write']);

  it('checks single permission', () => {
    expect(checker.hasPermission('read')).toBe(true);
    expect(checker.hasPermission('delete')).toBe(false);
  });

  it('checks any permission', () => {
    expect(checker.hasAnyPermission(['read', 'delete'])).toBe(true);
    expect(checker.hasAnyPermission(['delete', 'admin'])).toBe(false);
  });

  it('checks all permissions', () => {
    expect(checker.hasAllPermissions(['read', 'write'])).toBe(true);
    expect(checker.hasAllPermissions(['read', 'delete'])).toBe(false);
  });
});
