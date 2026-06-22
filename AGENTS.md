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
