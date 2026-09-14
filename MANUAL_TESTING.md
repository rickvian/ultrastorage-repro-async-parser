# Manual testing

## Prerequisites

- Node.js 20 or newer
- A modern browser with Developer Tools

## Local browser steps

1. Run `npm ci` and `npm run dev`.
2. Open the local URL printed by Vite.
3. Open Developer Tools and select **Console**.
4. On the home page, open a case: **Promise resolves to a valid envelope** (`/case/resolved`) or **Promise rejects during parsing** (`/case/rejected`).
5. Use the keyboard or pointer to activate **Run this case**.
6. Compare the visible Event log with console entries prefixed `[reproduction]`.

Each case runs in isolation and shows only its own result and event log.

Expected visible results:

- The resolved case displays `{"status":"unsupported"}` instead of a synchronous-parser `TypeError`.
- The rejected case displays `{"status":"unsupported"}` and, when captured, records the `decode failed` rejection. Some runtimes do not deliver the browser `unhandledrejection` event; in that case the log shows the intentional rejection was not captured.
- The console contains the same timeline. Its single `[reproduction]` error entry is the behavior being demonstrated, not an unrelated application failure.

## CodeSandbox steps

1. Open [the CodeSandbox import URL](https://codesandbox.io/p/github/rickvian/ultrastorage-repro-async-parser/main) after the public repository is available.
2. Start the development preview.
3. Open the preview's Developer Tools, run the reproduction, and compare results as above.

## Reset and repeat

The page uses only an in-memory storage instance. Press **Run this case** again to perform a fresh deterministic run; reload the page to clear the rendered evidence. The demo does not read cookies or unrelated browser storage.

## Verification checklist

- [ ] Page loads without unrelated console errors.
- [ ] Keyboard focus reaches the Run reproduction button and every documentation link.
- [ ] Resolved case visibly reports `unsupported`.
- [ ] Rejected case visibly reports the captured `decode failed` rejection.
- [ ] Event log and console timeline match.
- [ ] A repeated run gives the same result.
- [ ] Page remains usable at narrow and desktop widths.
- [ ] Production build has no absolute local filesystem paths.
