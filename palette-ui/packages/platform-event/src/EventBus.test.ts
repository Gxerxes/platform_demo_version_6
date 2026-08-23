import { describe, it, expect } from 'vitest';
import { EventBus, PaletteEvents } from './EventBus';

describe('EventBus', () => {
  it('subscribes and emits events', () => {
    const bus = new EventBus();
    let received: string | undefined;

    bus.on(PaletteEvents.NOTIFICATION, (payload: unknown) => {
      received = (payload as { message: string }).message;
    });

    bus.emit(PaletteEvents.NOTIFICATION, { message: 'hello' });
    expect(received).toBe('hello');
  });

  it('unsubscribes via returned function', () => {
    const bus = new EventBus();
    let count = 0;

    const unsubscribe = bus.on('test', () => {
      count += 1;
    });

    bus.emit('test');
    unsubscribe();
    bus.emit('test');

    expect(count).toBe(1);
  });
});
