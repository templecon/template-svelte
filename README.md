> [!NOTE]
> This is a **Svelte 5** template repository for website projects, and not a library. Check out the [library template](https://github.com/templecon/template-typescript-vite) for library development.

# How to use

```bash
git clone <repository-url> template-svelte
```

## Requirements

Node.js 24 or higher is required. The templates run TypeScript configuration and hooks directly with Node's built-in type stripping.

## Conventions and Rules

This project follows specific conventions and rules for code style, data validation, testing, and more. Please refer to the following documentation for detailed guidelines.

- [Typescript](./docs/rules/typescript.md)
- [Typescript Schema Validation](./docs/rules/typescript_schema.md)
- [Testing Guidelines](./docs/rules/tests.md)

---

## Static Hosting

Deploy the `dist/` output over HTTP(S), such as GitHub Pages or `pnpm preview`.
This template is a single-page Svelte 5 demo without a router. The build emits
the same app from two Vite inputs, `index.html` and `404.html`. GitHub Pages
serves the app-bearing `404.html` for a refresh or direct visit to any URL that
does not map to a static file, so the demo loads on deep links and refreshes
under the repository base path.

GitHub Pages fallback responses retain an HTTP 404 status even though the app
renders. This can affect SEO, crawlers, and link previews.

**Routing limitation:** every URL renders the same demo content; there are no
client-side routes or per-route views. Add a Svelte 5 router and per-route
pages once the project grows.

`file://` viewing is unsupported.
