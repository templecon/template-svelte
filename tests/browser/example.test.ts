// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { render } from "@testing-library/svelte";
import SnippetExample from "@/lib/SnippetExample.svelte";

describe("browser environment test", () => {
    it("should run in browser environment", () => {
        // localStorage is only available in DOM environment
        expect(localStorage).not.toBeNull();
    });

    it("should access window object in browser", () => {
        expect(window).toBeDefined();
        expect(document).toBeDefined();
    });

    it("should render SnippetExample component", () => {
        const { container } = render(SnippetExample);
        expect(container.querySelector(".snippet")).toBeInTheDocument();
    });
});
