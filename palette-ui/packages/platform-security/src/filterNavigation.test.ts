import { describe, it, expect } from 'vitest';
import { filterNavigationByPermission } from './filterNavigation';
import type { NavItem } from '@palette/platform-navigation';

const items: NavItem[] = [
  { id: 'a', label: 'A', path: '/', permission: 'a:view' },
  {
    id: 'b',
    label: 'B',
    permission: 'b:view',
    children: [
      { id: 'b1', label: 'B1', path: '/b1', permission: 'b1:view' },
    ],
  },
];

describe('filterNavigationByPermission', () => {
  it('filters items without permission', () => {
    const result = filterNavigationByPermission(items, (p) => p === 'a:view');
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('a');
  });

  it('filters nested children', () => {
    const result = filterNavigationByPermission(items, (p) => ['b:view', 'b1:view'].includes(p));
    expect(result).toHaveLength(1);
    expect(result[0]?.children).toHaveLength(1);
  });
});
