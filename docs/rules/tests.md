## 0. General Guidelines

Tests should follow general TypeScript guidelines. Tests should cover:

- Normal behavior
- Edge cases
- Invalid input
- Boundary values
- Unexpected states
- TypeScript's type check, via Vitest's type assertion features. See [more](https://vitest.dev/guide/testing-types) and [more](https://github.com/mmkal/expect-type)

## 1. Unit Tests (Node.js)

Use these for pure TypeScript utility files. These tests run in Node.js for maximum speed.

### Guidelines:

- File Extension: Use `.test.ts`.
- Location: `tests/unit/` directory.
- Environment: Default (Node.js).
- Concurrency: High. Use `it.concurrent` freely as these should be stateless.

```typescript
// utils.ts (Pure TypeScript logic)
export async function fetchUserList(): Promise<User[]> {
    return [{ id: 1, name: "Ms. Example" }];
}

// utils.test.ts (The Test)
import { describe, it, expect, expectTypeOf } from "vitest";

import { fetchUserList } from "./utils";

describe("User List", () => {
    it.concurrent("should fetch user list", async () => {
        const users = await fetchUserList();
        expectTypeOf(users).toEqualTypeOf<User[]>();
        expect(users).toHaveLength(1);
    });
});
```

## 2. Browser Tests (DOM Environment)

Use these for testing Svelte components and browser-only APIs. These tests run in a jsdom environment, allowing you to test component rendering, event handling, and DOM interactions without a real browser.

### Guidelines:

- File Extension: Use `.test.ts`.
- Location: `tests/browser/` directory.
- Tooling: Use `render` from `@testing-library/svelte` to mount components.
- Queries: Use `screen` queries from `@testing-library/svelte` for element selection.
- A11y First: Prioritize `getByRole` for locating interactive elements.
    - ✅ Prefer: `screen.getByRole("button", { name: "Save" })`
    - ❌ Avoid: `screen.getByTestId`, use only as a last resort for non-semantic elements.
- User Interactions: Use `@testing-library/user-event` for realistic event simulation.

```typescript
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
// routes.test.ts (Svelte route test)
import { describe, expect, it } from "vitest";

import App from "@/App.svelte";

describe("application routes", () => {
    it("navigates to the about route", async () => {
        const user = userEvent.setup();
        render(App);

        await user.click(screen.getByRole("link", { name: "About" }));

        expect(
            await screen.findByRole("heading", { name: "About this template" })
        ).toBeInTheDocument();
    });
});
```
