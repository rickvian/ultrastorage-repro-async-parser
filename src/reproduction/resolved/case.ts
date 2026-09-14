import { createMemoryStorage, createStorage } from 'ultrastorage';

export interface TimelineEntry {
  level: 'info' | 'error';
  message: string;
}

export interface ReproductionCase {
  name: 'resolved parser';
  expected: string;
  actual: string;
  reproduced: boolean;
  timeline: TimelineEntry[];
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

function validEnvelope() {
  return { __us: true, version: 1, value: 'valid value', expiry: null };
}