# Tools Configuration

This document provides guidelines for configuring the tools in your project. The tools help maintain code quality and consistency by enforcing coding standards and identifying potential issues.

## Linter Configuration

This project uses both oxlint and ESLint for linting, to ensure fast linting.

### oxlint

Fast linter for TypeScript.

It supports:

- Most of the rules of typescript-eslint, including type-aware rules.
- ESLint's JS plugins, while it might not support all of the plugins.

But doesn't support:

- ESLint's every single plugin.
- Some of HTML-superset code, which oxlint only checks its `<script>` block.
- Little bit of rules of typescript-eslint.
- Clean rule definition, like ESLint's `somePlugin.configs.recommended`.

#### Instructions

When using new plugins, including ESLint's plugins, you should try oxlint's [ESLint compatibility](https://oxc.rs/docs/guide/usage/linter/js-plugins.html) first.

- Add the plugin-specific rules to `oxlint.config.ts`.
- Extend or override the shared configuration there.

### ESLint

ESLint is used for rules that are not supported by oxlint.
It supports:

- All of the rules of typescript-eslint, including type-aware rules.
- All of ESLint's plugins.
- All of HTML-superset code, including non-script block.

But super-slow. ESLint should be used only for:

- Rules that are not supported by oxlint but important to be checked.
- Fast enough to be used on local, about 0.5 second to be fully linted, while oxlint is still recommended.

## Formatter Configuration

This project uses Prettier for formatting, since it's not super-fast but still acceptable for formatting.
