// @vitest-environment jsdom

import { it, expect, describe } from "vitest";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import Counter from "@/lib/Counter.svelte";

describe("Counter Component", () => {
    it("should render with default initial count", () => {
        render(Counter);
        expect(screen.getByText("Count is 0")).toBeInTheDocument();
    });

    it("should render with custom initial count", () => {
        render(Counter, { initialCount: 5 });
        expect(screen.getByText("Count is 5")).toBeInTheDocument();
    });

    it("should increment count", async () => {
        const user = userEvent.setup();
        render(Counter, { initialCount: 0 });
        await user.click(screen.getByRole("button", { name: "Increment" }));
        expect(screen.getByText("Count is 1")).toBeInTheDocument();
    });

    it("should reset count", async () => {
        const user = userEvent.setup();
        render(Counter, { initialCount: 5 });
        await user.click(screen.getByRole("button", { name: "Increment" }));
        await user.click(screen.getByRole("button", { name: "Reset" }));
        expect(screen.getByText("Count is 5")).toBeInTheDocument();
    });
});
