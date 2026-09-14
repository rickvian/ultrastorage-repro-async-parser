import { createMemoryStorage, createStorage } from 'ultrastorage';

export interface TimelineEntry {
  level: 'info' | 'error';
  message: string;
}

export interface ReproductionCase {
  name: 'rejected parser';
  expected: string;
  actual: string;
  reproduced: boolean;
  timeline: TimelineEntry[];
}

export interface RejectionEventLike {
  reason: unknown;
  preventDefault(): void;
}

export interface RejectionTarget {
  addEventListener(type: 'unhandledrejection', listener: (event: RejectionEventLike) => void): void;
  removeEventListener(type: 'unhandledrejection', listener: (event: RejectionEventLike) => void): void;
}

export interface RejectionCapture {
  getCapturedReason(): unknown;
  dispose(): void;
}

export async function runRejectedParserCase(
  target: RejectionTarget = globalThis as unknown as RejectionTarget,
): Promise<ReproductionCase> {
  const rejection = new Error('decode failed');
  const capture = installIntentionalRejectionListener(target, rejection);

  try {
    const storage = createStorage({
      storage: createMemoryStorage(),
      serializer: {
        stringify: JSON.stringify,
        parse: () => Promise.reject(rejection),
      },
    });

    storage.setItem('demo', 'raw bytes');
    const result = storage.getItemResult('demo');
    await nextTurn();
    const captured = capture.getCapturedReason();

    return {
      name: 'rejected parser',
      expected: 'Throw TypeError and consume the parser rejection.',
      actual: captured === rejection
        ? `${JSON.stringify(result)}; captured unhandled rejection: ${rejection.message}`
        : `${JSON.stringify(result)}; no browser rejection event was captured`,
      reproduced: result.status === 'unsupported' && captured === rejection,
      timeline: [
        { level: 'info', message: 'Configured parser returned Promise.reject(Error: decode failed).' },
        { level: 'info', message: `getItemResult("demo") returned ${JSON.stringify(result)}.` },
        {
          level: 'error',
          message: captured === rejection
            ? 'Captured intentional unhandled rejection: decode failed.'
            : 'The intentional rejection was not captured by this runtime.',
        },
      ],
    };
  } finally {
    capture.dispose();
  }
}

export function installIntentionalRejectionListener(
  target: RejectionTarget,
  intentionalReason: unknown,
): RejectionCapture {
  let capturedReason: unknown;
  const listener = (event: RejectionEventLike) => {
    if (event.reason !== intentionalReason) return;
    capturedReason = event.reason;
    event.preventDefault();
  };
  target.addEventListener('unhandledrejection', listener);

  return {
    getCapturedReason: () => capturedReason,
    dispose: () => target.removeEventListener('unhandledrejection', listener),
  };
}

function nextTurn(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}