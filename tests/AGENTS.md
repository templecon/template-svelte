Structure:

tests/

- tests/browser/ : Contains jsdom integration tests for observable route rendering and browser navigation using Vitest and `@testing-library/svelte`.
- tests/unit/ : Contains Node.js tests for environment-specific configuration and pure modules. Keep them fast and isolated.

Each subdirectory should follow same structure as src/ for easy mapping between source files and tests.
