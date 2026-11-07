# Agent Instructions

## Verification

Before committing implementation changes, run:

```sh
yarn lint
yarn typecheck
yarn test
yarn build
```

If a command cannot run, document why in the final response. After pushing a branch with CI configured, inspect the latest GitHub Actions run before calling the work complete.

## Styling

Use MUI theme tokens and shared components for typography, spacing, color, and section structure. Do not add one-off font sizes or raw colors outside `src/theme`.

## Project Pages

Each deep dive should live at `/projects/[slug]`. Interactive demos belong inside the relevant project page, colocated as `Demo.tsx` when needed.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
