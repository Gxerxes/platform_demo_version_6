import type { ReactNode } from 'react';

export interface NavItem {
  id: string;
  label: string;
  path?: string;
  icon?: ReactNode;
  children?: NavItem[];
  hidden?: boolean;
  permission?: string;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}
