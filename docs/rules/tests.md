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

## 2. Browser Tests (Playwright)

Use these for testing DOM manipulation and browser-only APIs. These tests run in a real browser, allowing you to test layout, real event bubbling, and browser-only APIs (like `IntersectionObserver`).

### Guidelines:

- File Extension: Use `.test.ts`.
- Location: `tests/browser/` directory.
- Tooling: Use `@vitest/browser-playwright` with `page` from `@vitest/browser/context` for interactions.
- Concurrency: Use `it.concurrent` carefully. Browser tests may have shared state.
- A11y First: When using helpers returned by `page` object, prioritize `getByRole` above all else.
    - ❌ Avoid: `getByLabelText`, `getByText` (Use only as a last resort).
    - ✅ Prefer: `getByRole("button", { name: "Save" })` (Explicit selection based on Accessibility Tree).
- Upgrade Selectors: Even if user's provided example uses simple selectors, you must upgrade them to Accessibility (Role) based selectors in your final code.

```typescript
// button.ts (The Component)
export function createButton(text: string): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.textContent = text;
    return btn;
}

// button.test.ts (The Test)
import { describe, it, expect } from "vitest";
import { page } from "@vitest/browser/context";
import { createButton } from "./button";

describe("Button Component", () => {
    it.concurrent("should render and handle clicks", async () => {
        // 1. Render component
        const btn = createButton("Click Me");
        document.body.appendChild(btn);

        // 2. Locate using ARIA roles (best practice)
        const button = page.getByRole("button", { name: /click me/i });

        // 3. Assert visibility and state
        await expect.element(button).toBeVisible();

        // 4. Perform real browser interaction
        await button.click();

        // 5. Assert result
        await expect.element(button).toHaveTextContent("Clicked");
    });
});
```

## Documentation

- [Vitest docs](https://vitest.dev/guide/)
- [Playwright docs](https://playwright.dev/docs/intro)
