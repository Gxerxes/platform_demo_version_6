import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { EventBus } from './EventBus';

const EventBusContext = createContext<EventBus | null>(null);

export interface EventBusProviderProps {
  bus?: EventBus;
  children: ReactNode;
}

export function EventBusProvider({ bus, children }: EventBusProviderProps) {
  const eventBus = useMemo(() => bus ?? new EventBus(), [bus]);

  return <EventBusContext.Provider value={eventBus}>{children}</EventBusContext.Provider>;
}

export function useEventBus(): EventBus {
  const context = useContext(EventBusContext);
  if (!context) {
    throw new Error('useEventBus must be used within EventBusProvider');
  }
  return context;
}
