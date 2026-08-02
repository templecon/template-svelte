// @vitest-environment jsdom

import { it, expect, describe } from "vitest";
import { render, screen } from "@testing-library/svelte";
import Form from "@/lib/Form.svelte";

describe("Form Component", () => {
    it("should render form with input fields", () => {
        render(Form);
        expect(screen.getByLabelText("Name")).toBeInTheDocument();
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
    });

    it("should have submit button", () => {
        render(Form);
        expect(
            screen.getByRole("button", { name: "Submit" })
        ).toBeInTheDocument();
    });
});
