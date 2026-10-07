import createFrontendOxlintConfig from "@concertypin/config/oxlint/frontend";
import { defineConfig } from "oxlint";

export default defineConfig({
    jsPlugins: ["oxlint-tailwindcss"],
    plugins: ["typescript", "unicorn", "import", "vitest", "promise"],
    env: {
        builtin: true,
    },
    ignorePatterns: [
        "**/node_modules/**",
        "**/dist/**",
        "**/dist-ts/**",
        "**/coverage/**",
        "**/.cache/**",
        "**/.vscode/**",
        "**/.git/**",
    ],
    options: {
        denyWarnings: true,
        reportUnusedDisableDirectives: "error",
        typeAware: true,
        typeCheck: true,
    },
    settings: { tailwindcss: { entryPoint: "src/style.css" } },
    overrides: [
        {
            files: ["**/*.svelte"],
            rules: {
                "prefer-const": "off",
                "no-unassigned-vars": "off",
            },
        },
    ],
    extends: [createFrontendOxlintConfig("src/style.css")],
});
