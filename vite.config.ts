/// <reference types="vitest/config" />

import { type UserConfig, defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { playwright } from "@vitest/browser-playwright";

type Config = Required<UserConfig>;
const resolve: Config["resolve"] = {
    alias: {
        "@": fileURLToPath(new URL("src", import.meta.url)),
    },
};

const browserInclude = ["**/tests/browser/**/*.test.ts"];
const browserTestConfig = {
    enabled: true,
    headless: true,
    instances: [
        {
            browser: "chromium",
            expect: {
                poll: {
                    timeout: 5000,
                },
            },
            include: browserInclude,
        },
    ],
    provider: playwright(),
} satisfies Config["test"]["browser"];
const testConfig: Config["test"] = {
    coverage: {
        enabled: true,
        include: ["src/**/*.ts"],
        provider: "v8",
        reportOnFailure: true,
        reporter: ["text", "json-summary", "html"],
    },
    environment: "node",
    exclude: ["**/node_modules/**", "**/dist/**"],
    globals: true,
    include: ["tests/**/*.test.ts"],
    projects: [
        {
            extends: true,
            test: {
                browser: browserTestConfig,
                name: "browser",
            },
        },
        {
            extends: true,
            test: {
                browser: {
                    enabled: false,
                },
                exclude: browserInclude,
                name: "node",
            },
        },
    ],
    setupFiles: "./tests/setup.ts",
};
export default defineConfig({
    build: {
        outDir: "dist",
        sourcemap: true,
    },
    clearScreen: false,
    plugins: [],
    resolve,
    server: {
        open: "index.html",
    },
    test: testConfig,
});
