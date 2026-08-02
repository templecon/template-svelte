// @vitest-environment jsdom

import { it, expect, describe } from "vitest";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import DerivedLabel from "@/lib/DerivedLabel.svelte";

describe("DerivedLabel Component", () => {
    it("should render initial values", () => {
        render(DerivedLabel);
        expect(screen.getByText(/Count: 0/)).toBeInTheDocument();
        expect(screen.getByText(/Double: 0/)).toBeInTheDocument();
    });

    it("should update double value when count changes", async () => {
        const user = userEvent.setup();
        render(DerivedLabel);
        await user.click(screen.getByRole("button", { name: "+1" }));
        expect(screen.getByText(/Count: 1/)).toBeInTheDocument();
        expect(screen.getByText(/Double: 2/)).toBeInTheDocument();
    });
});
