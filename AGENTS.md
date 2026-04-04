# AGENTS.md

This file provides guidance to AI agents when working with code in this repository.
All agents, such as Claude Code, should keep `**/AGENTS.md` in mind.

## Project Type

This is a **Svelte 5 web application template** (not a library) built with Vite. It uses the new **Runes** system for reactivity ($state, $derived, $props, etc.) and emphasizes modern Svelte patterns.

## Development Commands

```bash
# Start development server (auto-opens browser to index.html)
pnpm dev

# Build for production (runs TypeScript compilation, then Vite build)
pnpm build

# Preview production build locally
pnpm preview

# Format code
pnpm format

# Lint code
pnpm lint

# Run tests (Vitest with Playwright and Node environment)
pnpm test
```

## Architecture

- **Entry point**: `src/main.ts` - Initializes the application and mounts the `App.svelte` component to the `#app` div in `index.html`
- **Svelte 5 Runes**: Entire reactive logic follows Svelte 5 runes (`$state`, `$derived`, `$props`, `$effect`).
- **ES modules** throughout (`"type": "module"` in package.json)
- **Static assets**: Place in `public/` directory

## Coding Standards

See `docs/rules/` for TypeScript, testing, and tooling guidelines.

## TypeScript Configuration

- **Path alias**: `@/*` maps to `src/*` (configured in `tsconfig.base.json`)
- **Project references**: Uses `tsconfig.json` with `app` and `node` references
- **Strict mode** enabled

## Styling

- **Tailwind CSS v4** with new directive-based syntax: `@import "tailwindcss"`
- Custom styles in `src/style.css` for layout and theming
- PostCSS configured in `postcss.config.mjs`

## Package Manager

This project uses **pnpm**.
