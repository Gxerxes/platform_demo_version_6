import { useCallback, useMemo, useState } from 'react';
import { NavigationContext } from './NavigationContext';
import type { NavigationProviderProps } from './navigation-types';

export function NavigationProvider({
  items,
  defaultCollapsed = false,
  children,
}: NavigationProviderProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(defaultCollapsed);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({
      items,
      sidebarCollapsed,
      toggleSidebar,
      setSidebarCollapsed,
    }),
    [items, sidebarCollapsed, toggleSidebar],
  );

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}
