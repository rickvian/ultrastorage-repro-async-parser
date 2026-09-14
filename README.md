# ultrastorage asynchronous parser reproduction

This standalone Vite application demonstrates the behavior of `ultrastorage@0.8.0` when a custom serializer parser returns a Promise. It is a behavior reproduction, not a fix.

## Issue

Custom parsers are used synchronously by `getItemResult()`. In 0.8.0, a parser returning `Promise.resolve(validEnvelope)` is silently interpreted as unsupported data rather than rejected as an invalid asynchronous parser. A rejected Promise additionally reaches the browser's global `unhandledrejection` path.

Expected: Promise-like parser output should be detected, rejected with a clear synchronous-parser `TypeError`, and any rejection should be consumed.

Observed: the detailed read returns `{"status":"unsupported"}`. For the rejected case, the demo captures the intentional `decode failed` unhandled rejection so the page remains usable.

## Run locally

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
```

Open the printed local URL, open Developer Tools → Console, and press **Run reproduction**.

## Verification

```sh
npm ci
npm test
npm run build
```

## CodeSandbox

After this repository is public, import it directly with [CodeSandbox](https://codesandbox.io/p/sandbox/github/rickvian/ultrastorage-repro-async-parser).

## Minimal source excerpt

```ts
const storage = createStorage({
  storage: createMemoryStorage(),
  serializer: { stringify: JSON.stringify, parse: () => Promise.resolve(validEnvelope()) },
});
storage.setItem('demo', 'raw bytes');
storage.getItemResult('demo'); // { status: 'unsupported' }
```

See [src/reproduction.ts](./src/reproduction.ts) for the complete isolated reproduction and [MANUAL_TESTING.md](./MANUAL_TESTING.md) for browser steps.

## Links

- [ultrastorage 0.8.0 on npm](https://www.npmjs.com/package/ultrastorage/v/0.8.0)
- [Manual testing guide](./MANUAL_TESTING.md)
- [MIT License](./LICENSE)
