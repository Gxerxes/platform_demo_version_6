export const PaletteEvents = {
  ERROR: 'palette:error',
  AUTH_EXPIRED: 'palette:auth-expired',
  NOTIFICATION: 'palette:notification',
  API_REQUEST: 'palette:api-request',
  API_RESPONSE: 'palette:api-response',
} as const;

export type PaletteEventName = (typeof PaletteEvents)[keyof typeof PaletteEvents];

type EventHandler<T = unknown> = (payload: T) => void;

export class EventBus {
  private listeners = new Map<string, Set<EventHandler>>();

  on<T = unknown>(event: string, handler: EventHandler<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler as EventHandler);

    return () => this.off(event, handler);
  }

  off<T = unknown>(event: string, handler: EventHandler<T>): void {
    this.listeners.get(event)?.delete(handler as EventHandler);
  }

  emit<T = unknown>(event: string, payload?: T): void {
    this.listeners.get(event)?.forEach((handler) => handler(payload));
  }

  clear(event?: string): void {
    if (event) {
      this.listeners.delete(event);
      return;
    }
    this.listeners.clear();
  }
}

export const globalEventBus = new EventBus();
