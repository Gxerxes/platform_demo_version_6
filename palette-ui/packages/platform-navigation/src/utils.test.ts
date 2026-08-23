import { describe, it, expect } from 'vitest';
import { buildBreadcrumbs, findActiveNavItem } from './utils';
import type { NavItem } from './types';

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', path: '/' },
  {
    id: 'components',
    label: 'Components',
    children: [
      { id: 'table', label: 'Table', path: '/components/table' },
    ],
  },
  { id: 'settings', label: 'Settings', path: '/settings' },
];

describe('platform-navigation utils', () => {
  it('finds active nav item by path', () => {
    expect(findActiveNavItem(navItems, '/settings')?.id).toBe('settings');
    expect(findActiveNavItem(navItems, '/components/table')?.id).toBe('table');
  });

  it('builds breadcrumbs from navigation', () => {
    const crumbs = buildBreadcrumbs(navItems, '/components/table');
    expect(crumbs.map((c) => c.label)).toEqual(['Home', 'Components', 'Table']);
  });
});
