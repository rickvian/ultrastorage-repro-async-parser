import { describe, expect, it } from 'vitest';
import {
  installIntentionalRejectionListener,
  runResolvedParserCase,
} from './reproduction';

describe('asynchronous parser reproduction', () => {
  it('shows that a Promise-returning parser is classified as unsupported', () => {
    const result = runResolvedParserCase();

    expect(result.actual).toBe('{"status":"unsupported"}');
    expect(result.reproduced).toBe(true);
  });

  it('captures only the intentional rejection and removes its temporary listener', () => {
    const target = new ControlledRejectionTarget();
    const reason = new Error('decode failed');
    const capture = installIntentionalRejectionListener(target, reason);
    const event = { reason, prevented: false, preventDefault() { this.prevented = true; } };

    target.emit(event);

    expect(capture.getCapturedReason()).toBe(reason);
    expect(event.prevented).toBe(true);
    capture.dispose();
    expect(target.listenerCount()).toBe(0);
  });
});

class ControlledRejectionTarget {
  private readonly listeners = new Set<(event: { reason: unknown; preventDefault(): void }) => void>();

  addEventListener(_type: 'unhandledrejection', listener: (event: { reason: unknown; preventDefault(): void }) => void) {
    this.listeners.add(listener);
  }

  removeEventListener(_type: 'unhandledrejection', listener: (event: { reason: unknown; preventDefault(): void }) => void) {
    this.listeners.delete(listener);
  }

  emit(event: { reason: unknown; preventDefault(): void }) {
    for (const listener of this.listeners) listener(event);
  }

  listenerCount() {
    return this.listeners.size;
  }
}
