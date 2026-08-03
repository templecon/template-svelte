# AGENTS.md

## Project

This Svelte 5 web template (runes-based, not a library) builds HTTP(S)-hosted
assets for GitHub Pages. It is a single-page component demo without a router.
Vite multi-page inputs emit the same app from `index.html` and a SPA-bearing
custom `404.html`, which GitHub Pages serves for a refresh or direct visit to a
URL that does not map to a static file. GitHub Pages keeps an HTTP 404 status
for those fallback responses, which can affect SEO, crawlers, and link previews.
`file://` viewing is unsupported.

## Using this template

Install dependencies with `pnpm install`. To update dependencies after creating
a project, run `pnpm up --latest`, review the manifest and lockfile changes,
then run `pnpm run check` before committing them.

## Commands

```bash
pnpm dev
pnpm build
pnpm preview
pnpm format
pnpm lint
pnpm test
pnpm run check
```

## Important files

- `src/main.ts`: application entry point that mounts `App.svelte`.
- `src/App.svelte`: single-page demo layout using Svelte 5 runes.
- `vite.config.ts`: Vite multi-page HTML inputs (`index.html`, `404.html`) and
  Vitest configuration.
- `404.html`: second Vite input emitted to `dist/404.html` as the GitHub Pages
  SPA fallback.
- `.github/workflows/deploy.yml`: builds with the configure-pages repository
  base path and deploys `dist/` to GitHub Pages.
- `docs/rules/`: TypeScript, schema, and testing guidelines.
- `tests/browser/`: jsdom Testing Library tests for rendered components.
- `tests/unit/`: Node-only tests for pure logic.

## Conventions

- Use TypeScript with Svelte 5 runes (`$state`, `$derived`, `$props`, etc.).
- Use pnpm and keep `pnpm-lock.yaml` in sync with `package.json`.
- Run `pnpm run check` after changes that affect source, tests, or configuration.
