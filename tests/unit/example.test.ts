import { describe, expect, expectTypeOf, it } from "vitest";

describe("example test", () => {
    it.concurrent("should pass", () => {
        // Example test
        expect(1 + 1).toBe(2);
        // Type check example
        expectTypeOf<"asdf">().toBeString();
    });
    it.concurrent("should run in node environment", () => {
        // Process is only available in node environment,
        // Not in browser.
        // If this test runs successfully, the node environment works.
        expect(globalThis.localStorage).not.toBeDefined();
    });
});
