> [!NOTE]
> This is a **Svelte 5** template repository for website projects, and not a library. Check out the [library template](https://github.com/templecon/template-typescript-vite) for library development.

# How to use

```bash
git clone <repository-url> template-svelte
```

## Requirements

Node.js 26 or higher is required. The templates run TypeScript configuration and hooks directly with Node's built-in type stripping.

Node 26 no longer bundles corepack, so install the pnpm version pinned in
`package.json` (`packageManager`) once, then install dependencies:

```sh
npm install -g pnpm@10.17.1
pnpm install
```

## Conventions and Rules

This project follows specific conventions and rules for code style, data validation, testing, and more. Please refer to the following documentation for detailed guidelines.

- [Typescript](./docs/rules/typescript.md)
- [Typescript Schema Validation](./docs/rules/typescript_schema.md)
- [Testing Guidelines](./docs/rules/tests.md)

---

## Static Hosting

`pnpm build` uses relative asset URLs and supports root hosting. For a site
mounted below the domain root, build with its absolute base path; for example,
`pnpm build --base "/<repo>/"` for a GitHub Pages project site. The included
deployment workflow supplies this repository base automatically.

This template uses `svelte5-router` with History API routes for `/` and
`/about`, plus an application-level fallback for unknown paths. The build emits
the same application shell from two Vite inputs, `index.html` and `404.html`.
GitHub Pages serves the app-bearing `404.html` for a refresh or direct visit to
a URL that does not map to a static file, so the router can render the matching
view under the configured base path.

GitHub Pages fallback responses retain an HTTP 404 status even when the client
router renders a known route. This can affect SEO, crawlers, and link previews.

`file://` viewing is unsupported.
