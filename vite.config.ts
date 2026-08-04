/// <reference types="vitest/config" />

import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { type UserConfig, defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
type Config = Required<UserConfig>;
const resolveAlias: Config["resolve"] = {
    alias: {
        "@": fileURLToPath(new URL("src", import.meta.url)),
    },
    conditions: ["module", "import", "browser", "default"],
};

const testConfig: Config["test"] = {
    coverage: {
        enabled: true,
        include: ["src/**/*.ts", "src/**/*.svelte"],
        exclude: ["**/*.d.ts"],
        provider: "v8",
        reportOnFailure: true,
        reporter: ["text", "json-summary", "html"],
    },
    environment: "node",
    exclude: ["**/node_modules/**", "**/dist/**"],
    globals: true,
    projects: [
        {
            extends: true,
            test: {
                environment: "node",
                include: ["tests/unit/**/*.test.ts"],
                name: "node",
                env: {
                    VITEST_MODE: "node",
                },
            },
        },
        {
            extends: true,
            test: {
                environment: "jsdom",
                environmentOptions: {
                    jsdom: {
                        url: "http://localhost/",
                    },
                },
                include: ["tests/browser/**/*.test.ts"],
                name: "browser",
                setupFiles: ["tests/setup.ts"],
                env: {
                    VITEST_MODE: "browser",
                },
            },
        },
    ],
};

export default defineConfig({
    base: "./",
    build: {
        outDir: "dist",
        rolldownOptions: {
            input: {
                main: resolve(import.meta.dirname, "index.html"),
                notFound: resolve(import.meta.dirname, "404.html"),
            },
        },
        sourcemap: true,
    },
    clearScreen: false,
    plugins: [svelte()],
    resolve: resolveAlias,
    server: {
        open: "/",
    },
    test: testConfig,
});
