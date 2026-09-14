import { createMemoryStorage, createStorage } from 'ultrastorage';

export type LogLevel = 'info' | 'error';

export interface TimelineEntry {
  level: LogLevel;
  message: string;
}

export interface ReproductionCase {
  name: 'resolved parser' | 'rejected parser';
  expected: string;
  actual: string;
  reproduced: boolean;
  timeline: TimelineEntry[];
}

export interface ReproductionResult {
  resolved: ReproductionCase;
  rejected: ReproductionCase;
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

export function runResolvedParserCase(): ReproductionCase {
  const storage = createStorage({
    storage: createMemoryStorage(),
    serializer: {
      stringify: JSON.stringify,
      parse: () => Promise.resolve(validEnvelope()),
    },
  });
  storage.setItem('demo', 'raw bytes');
  const result = storage.getItemResult('demo');
  const actual = JSON.stringify(result);

  return {
    name: 'resolved parser',
    expected: 'Throw TypeError: custom parsers must be synchronous.',
    actual,
    reproduced: result.status === 'unsupported',
    timeline: [
      { level: 'info', message: 'Configured parser returned Promise.resolve(valid envelope).' },
      { level: 'info', message: `getItemResult("demo") returned ${actual}.` },
    ],
  };
}

export function installIntentionalRejectionListener(target: RejectionTarget, intentionalReason: unknown) {
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

export async function runRejectedParserCase(
  target = globalThis as unknown as RejectionTarget,
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

export async function runReproduction(): Promise<ReproductionResult> {
  const resolved = runResolvedParserCase();
  const rejected = await runRejectedParserCase();
  return { resolved, rejected, timeline: [...resolved.timeline, ...rejected.timeline] };
}

function validEnvelope() {
  return { __us: true, version: 1, value: 'valid value', expiry: null };
}

function nextTurn(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}
