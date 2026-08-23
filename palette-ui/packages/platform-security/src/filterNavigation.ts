import type { NavItem } from '@palette/platform-navigation';
import type { Permission } from './permissions';

function hasNavPermission(
  item: NavItem,
  checker: (permission: Permission) => boolean,
): boolean {
  if (item.permission && !checker(item.permission)) {
    return false;
  }
  return true;
}

export function filterNavigationByPermission(
  items: NavItem[],
  hasPermission: (permission: Permission) => boolean,
): NavItem[] {
  return items
    .filter((item) => hasNavPermission(item, hasPermission))
    .map((item) => {
      if (!item.children?.length) {
        return item;
      }

      const children = filterNavigationByPermission(item.children, hasPermission);

      if (children.length === 0 && !item.path) {
        return null;
      }

      return { ...item, children };
    })
    .filter((item): item is NavItem => item !== null);
}
