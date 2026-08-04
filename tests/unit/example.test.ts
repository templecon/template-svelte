import { describe, expect, it } from "vitest";

describe("Node test project", () => {
    it.concurrent("provides the Node process global", () => {
        expect(globalThis).toHaveProperty("process");
    });
});
