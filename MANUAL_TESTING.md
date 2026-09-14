# Manual testing

## Prerequisites

- Node.js 20 or newer
- A modern browser with Developer Tools

## Local browser steps

1. Run `npm ci` and `npm run dev`.
2. Open the local URL printed by Vite.
3. Open Developer Tools and select **Console**.
4. Use the keyboard or pointer to activate **Run reproduction**.
5. Compare the visible Event log with console entries prefixed `[reproduction]`.

Expected visible results:

- The resolved case displays `{"status":"unsupported"}` instead of a synchronous-parser `TypeError`.
- The rejected case displays `{"status":"unsupported"}; captured unhandled rejection: decode failed`.
- The console contains the same timeline. Its single `[reproduction] Captured intentional unhandled rejection: decode failed.` error is the behavior being demonstrated, not an unrelated application failure.

## CodeSandbox steps

1. Open [the CodeSandbox import URL](https://codesandbox.io/p/sandbox/github/rickvian/ultrastorage-repro-async-parser) after the public repository is available.
2. Start the development preview.
3. Open the preview's Developer Tools, run the reproduction, and compare results as above.

## Reset and repeat

The page uses only an in-memory storage instance. Press **Run reproduction** again to perform a fresh deterministic run; reload the page to clear the rendered evidence. The demo does not read cookies or unrelated browser storage.

## Verification checklist

- [ ] Page loads without unrelated console errors.
- [ ] Keyboard focus reaches the Run reproduction button and every documentation link.
- [ ] Resolved case visibly reports `unsupported`.
- [ ] Rejected case visibly reports the captured `decode failed` rejection.
- [ ] Event log and console timeline match.
- [ ] A repeated run gives the same result.
- [ ] Page remains usable at narrow and desktop widths.
- [ ] Production build has no absolute local filesystem paths.
