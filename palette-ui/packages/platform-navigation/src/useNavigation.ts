import { useContext } from 'react';
import { NavigationContext } from './NavigationContext';
import type { NavigationContextValue } from './navigation-types';

export function useNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}
