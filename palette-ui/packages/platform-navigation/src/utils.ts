import type { BreadcrumbItem, NavItem } from './types';

function flattenNavItems(items: NavItem[]): NavItem[] {
  const result: NavItem[] = [];

  for (const item of items) {
    if (item.hidden) continue;
    result.push(item);
    if (item.children?.length) {
      result.push(...flattenNavItems(item.children));
    }
  }

  return result;
}

export function findActiveNavItem(items: NavItem[], pathname: string): NavItem | undefined {
  const flat = flattenNavItems(items);
  const matches = flat.filter((item) => item.path && pathname.startsWith(item.path));

  return matches.sort((a, b) => (b.path?.length ?? 0) - (a.path?.length ?? 0))[0];
}

export function buildBreadcrumbs(items: NavItem[], pathname: string): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [{ label: 'Home', path: '/' }];
  const segments = findBreadcrumbPath(items, pathname);

  for (const segment of segments) {
    crumbs.push({ label: segment.label, path: segment.path });
  }

  return crumbs;
}

function findBreadcrumbPath(items: NavItem[], pathname: string, trail: NavItem[] = []): NavItem[] {
  for (const item of items) {
    if (item.hidden) continue;

    const nextTrail = [...trail, item];

    if (item.path && (pathname === item.path || pathname.startsWith(`${item.path}/`))) {
      if (item.children?.length) {
        const childTrail = findBreadcrumbPath(item.children, pathname, nextTrail);
        if (childTrail.length > trail.length) {
          return childTrail;
        }
      }
      return nextTrail;
    }

    if (item.children?.length) {
      const childTrail = findBreadcrumbPath(item.children, pathname, nextTrail);
      if (childTrail.length > trail.length) {
        return childTrail;
      }
    }
  }

  return trail;
}
