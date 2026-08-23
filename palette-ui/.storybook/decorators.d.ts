import type { PaletteAppConfig } from '@palette/platform-config';
import type { PalettePlatformConfig } from '@palette/platform-config';
import type { NavItem } from '@palette/platform-navigation';
import type { ReactNode } from 'react';
export declare const mockAppConfig: PaletteAppConfig;
export declare const mockPlatformConfig: PalettePlatformConfig;
export declare const mockNavigation: NavItem[];
export declare const mockPermissions: string[];
export declare function withNavigation(Story: () => ReactNode): import("react").JSX.Element;
export declare function withPermissions(permissions?: string[]): (Story: () => ReactNode) => import("react").JSX.Element;
export declare function withPlatform(Story: () => ReactNode): import("react").JSX.Element;
//# sourceMappingURL=decorators.d.ts.map