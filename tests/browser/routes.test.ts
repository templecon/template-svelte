// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { navigate } from "svelte5-router";
import App from "@/App.svelte";

afterEach(() => {
    cleanup();
    navigate("/");
});

describe("application routes", () => {
    it("navigates to the about page with a clean URL", async () => {
        const user = userEvent.setup();
        navigate("/");
        render(App);

        await user.click(screen.getByRole("link", { name: "About" }));

        expect(
            await screen.findByRole("heading", { name: "About this template" })
        ).toBeInTheDocument();
        expect(window.location.pathname).toBe("/about");
    });

    it("renders the fallback route for an unknown URL", () => {
        navigate("/missing");
        render(App);

        expect(screen.getByRole("alert")).toHaveTextContent("Page not found.");
        expect(
            screen.getByRole("link", { name: "Return home" })
        ).toHaveAttribute("href", "/");
    });
});
