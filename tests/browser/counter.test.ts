import { setupCounter } from "@/counter";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("setupCounter increasing", () => {
    let button: HTMLButtonElement;

    beforeEach(() => {
        // Create a fresh button element for each test
        button = document.createElement("button");
    });

    it("should initialize counter to 0", () => {
        setupCounter(button);

        expect(button.innerHTML).toBe("count is 0");
    });

    it("should increment counter on click", () => {
        setupCounter(button);

        button.click();

        expect(button.innerHTML).toBe("count is 1");
    });

    it("should increment counter multiple times on multiple clicks", () => {
        setupCounter(button);

        button.click();
        button.click();
        button.click();

        expect(button.innerHTML).toBe("count is 3");
    });

    it("should increment counter sequentially", () => {
        setupCounter(button);

        expect(button.innerHTML).toBe("count is 0");

        button.click();
        expect(button.innerHTML).toBe("count is 1");

        button.click();
        expect(button.innerHTML).toBe("count is 2");

        button.click();
        expect(button.innerHTML).toBe("count is 3");
    });

    it("should only add event listener once", () => {
        const addEventListenerSpy = vi.spyOn(button, "addEventListener");

        setupCounter(button);

        expect(addEventListenerSpy).toHaveBeenCalledOnce();
        expect(addEventListenerSpy).toHaveBeenCalledWith(
            "click",
            expect.any(Function)
        );
    });

    it("should maintain separate counter state for each element", () => {
        const button1 = document.createElement("button");
        const button2 = document.createElement("button");

        setupCounter(button1);
        setupCounter(button2);

        button1.click();
        button1.click();
        button2.click();

        expect(button1.innerHTML).toBe("count is 2");
        expect(button2.innerHTML).toBe("count is 1");
    });
});
