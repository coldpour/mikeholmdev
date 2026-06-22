# React + MUI static migration handoff

## Current state

The site is currently a custom static generator:

- `index.js` renders pages with `jshtml`.
- `src/index.scss` owns all global styling.
- `yarn build` deletes and regenerates `dist/`.
- `python3 -m http.server 8890 -d dist` is being used for local preview.
- The latest pushed commit before this handoff is `9da2a0c Add build vs buy portfolio section`.

The current implementation has useful content, but weak style guardrails. Similar sections can drift because they are hand-authored with broad global selectors, raw element styles, and slightly different DOM structures.

## Product goals

- Sell design-systems thinking and robust front-end engineering through the site itself.
- Keep build-time HTML for SEO.
- Add client-side React so project demos can have rich interaction and local state.
- Support automatic dark mode via the user's device setting.
- Avoid a database and avoid a production Node server unless a future feature truly needs one.

## Recommended target architecture

Use **Next.js App Router + static export + Material UI**.

This gives:

- Static HTML generation at build time.
- Client-side React hydration for interactive demos.
- Static hosting output via `next export` behavior through `output: 'export'`.
- MUI theme tokens for typography, color, spacing, breakpoints, and component variants.
- A clear path for dark mode through `prefers-color-scheme`.

Suggested dependencies:

- `next`
- `react`
- `react-dom`
- `@mui/material`
- `@mui/icons-material`
- `@emotion/react`
- `@emotion/styled`
- `typescript`
- `oxlint`
- `playwright`

## Suggested structure

```txt
src/
  app/
    layout.tsx
    page.tsx
    projects/
      [slug]/
        page.tsx
  components/
    CaseStudy.tsx
    ComparisonGrid.tsx
    Hero.tsx
    ProjectCard.tsx
    RoleMeta.tsx
    SectionHeading.tsx
    SiteShell.tsx
  content/
    projects.ts
    experience.ts
  project-demos/
    SvgAnimationDemo.tsx
    ResultsMapDemo.tsx
    IdentityUploadDemo.tsx
    BuildVsBuyDemo.tsx
  theme/
    components.ts
    theme.ts
    typography.ts
```

Content should move into typed data modules. Reusable presentation should live in components. New portfolio sections should not hand-roll markup unless they are defining a new reusable pattern.

Each current "deep dive" should become its own statically generated project page under `/projects/[slug]/`, with any interactive demo embedded directly in that page. There probably should not be a separate `/demo/` route. The homepage should tease these project pages with concise cards, summaries, and links into the full deep dives.

## Styling model

Use MUI as the design-system substrate.

- Define typography roles once in `theme/typography.ts`.
- Define spacing through the MUI spacing scale.
- Define light and dark color schemes in the theme.
- Use semantic palette keys instead of raw hex values in components.
- Prefer MUI primitives such as `Box`, `Stack`, `Container`, `Typography`, `Card`, `CardContent`, and `Link` when they express the pattern cleanly.

Dark mode should be system-driven:

```ts
defaultMode: 'system'
```

The implementation should use MUI color-scheme support so the page follows `prefers-color-scheme` without each component owning separate dark-mode CSS.

## Guardrails

Add guardrails that make inconsistency difficult to introduce:

1. **Typed content schema**
   Define types for projects, deep dives, comparison grids, role metadata, and links. Missing required fields should fail TypeScript.

2. **Component-only section rendering**
   Every deep dive should render through `CaseStudy`. Every project summary should render through `ProjectCard`.

3. **Theme-only typography and color**
   Ban arbitrary font sizes and raw color values outside `src/theme/`.

4. **Lint checks**
   Add oxlint for TypeScript and React. If stylelint is added later, use it to reject ad hoc CSS growth.

5. **Visual regression checks**
   Add Playwright screenshots for:
   - desktop homepage
   - mobile homepage
   - each project deep dive page
   - dark-mode homepage
   - project card grid

6. **Static export check**
   CI should run lint, typecheck, tests, build, and static export verification.

7. **Accessibility checks**
   Add at least heading-order and landmark checks. Interactive demos should have keyboard-accessible controls.

8. **Agent handoff checks**
   Add a repo-level `AGENTS.md` after the migration begins. It should instruct agents to run the relevant verification commands before committing, usually:

   ```sh
   yarn lint
   yarn typecheck
   yarn test
   yarn build
   ```

   Once CI exists, agents should also inspect the pushed branch's GitHub Actions result before calling work complete. If the GitHub CLI is available, use `gh run list` and `gh run view` for the latest run.

## Migration phases

### Phase 1: Scaffold

- Add Next.js, React, TypeScript, and MUI.
- Configure `next.config.js` with `output: 'export'`.
- Add `src/app/layout.tsx` and `src/app/page.tsx`.
- Add the MUI theme provider and system dark mode.
- Keep the current `dist/` build path only until the new build can replace it.

### Phase 2: Port static content

- Move portfolio content into typed data modules.
- Build `Hero`, `ProjectCard`, `CaseStudy`, `ComparisonGrid`, `RoleMeta`, and `SectionHeading`.
- Recreate the current page using only those components.
- Preserve current anchors, including `#build-vs-buy`, so external links do not break.
- Create static project detail pages for the current deep dives.
- Update the homepage so it teases the deep dive pages instead of carrying every full article inline.

### Phase 3: Normalize visual language

- Replace global element-driven typography with MUI variants.
- Normalize project card link typography.
- Make all Percipient deep dives use the same component structure.
- Decide whether "How I lead a front-end team" and "Growing engineers" are case studies or narrative sections, then style them intentionally.

### Phase 4: Embed project demos

- Create demo components under `src/project-demos/`.
- Embed demos in the relevant `/projects/[slug]/` pages.
- Use client components only where interaction is needed.
- Keep static project copy server-rendered.
- Lazy-load heavy demos so project pages hydrate only what they need.

### Phase 5: Verification

- Add Playwright visual checks.
- Add dark-mode screenshots.
- Add static build checks in CI.
- Add `AGENTS.md` with required agent verification commands.
- Replace the existing generated `dist` workflow with the Next static output workflow.

## Parallel development opportunities

These tracks can run mostly independently:

1. **Framework scaffold**
   Set up Next, TypeScript, MUI, oxlint, static export, scripts, and CI build commands.

2. **Theme system**
   Define typography, spacing, palette, light/dark schemes, and MUI component defaults.

3. **Content modeling**
   Convert existing portfolio sections into typed content objects without changing copy.

4. **Component library**
   Build `Hero`, `ProjectCard`, `CaseStudy`, `ComparisonGrid`, `RoleMeta`, and `SectionHeading` against mock content.

5. **Visual regression**
   Add Playwright screenshot infrastructure against the current site first, then repoint it to the migrated site.

6. **Interactive demo planning**
   Identify which project pages need embedded demos, what state each demo owns, and which demos should be lazy-loaded.

7. **Deployment workflow**
   Update the GitHub Pages workflow for the new static export output once the scaffold builds locally.

8. **Agent and CI guardrails**
   Add `AGENTS.md`, define required local commands, and wire CI to run the same checks so local agent behavior and remote enforcement match.

## Notes for the next session

- The current local preview was at `http://localhost:8890/#build-vs-buy`.
- The old local stash `stash@{0}: preserve-local-build-vs-buy-draft` may still exist, but the useful Build vs buy content has already been reapplied and pushed.
- Start with the scaffold and theme. Do not begin by polishing one-off CSS in the current generator unless the migration is intentionally deferred.
