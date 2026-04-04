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

## 2. Browser Tests (Vitest Browser + Svelte)

Use these for testing Svelte components and browser-only APIs. These tests run in a real browser (via Playwright), allowing you to test layout, real event bubbling, and component lifecycle in a native environment.

### Guidelines:

- File Extension: Use `.test.ts`.
- Location: `tests/browser/` directory.
- Tooling: Use `render` from `vitest-browser-svelte` to mount components.
- Locators: Use `screen` methods returned by `render` for robust selection.
- A11y First: Prioritize `getByRole` for locating interactive elements.
    - ✅ Prefer: `screen.getByRole("button", { name: "Save" })`
    - ❌ Avoid: `screen.getByTestId`, use only as a last resort for non-semantic elements.

```typescript
// Counter.test.ts (Svelte Component Test)
import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-svelte";
import Counter from "@/lib/Counter.svelte";

describe("Counter Component", () => {
    it("should increment count on click", async () => {
        // 1. Render component with props
        const screen = render(Counter, { props: { initialCount: 0 } });

        // 2. Locate using ARIA roles (best practice)
        const btn = screen.getByRole("button", { name: /increment/i });
        const display = screen.getByText(/count is 0/i);

        // 3. Perform real browser interaction
        await btn.click();

        // 4. Assert updated state
        await expect.element(display).toHaveTextContent("Count is 1");
    });
});
```

## Documentation

- [Vitest docs](https://vitest.dev/guide/)
- [Playwright docs](https://playwright.dev/docs/intro)
