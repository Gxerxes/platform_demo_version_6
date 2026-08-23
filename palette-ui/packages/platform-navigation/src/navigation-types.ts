import type { ReactNode } from 'react';
import type { NavItem } from './types';

export interface NavigationContextValue {
  items: NavItem[];
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export interface NavigationProviderProps {
  items: NavItem[];
  defaultCollapsed?: boolean;
  children: ReactNode;
}
