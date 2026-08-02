import frontendConfig from "@concertypin/config/oxlint/frontend";
import { defineConfig } from "oxlint";

export default defineConfig({
    $schema: "./node_modules/oxlint/configuration_schema.json",
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
    overrides: [
        {
            files: ["**/*.svelte"],
            rules: {
                "prefer-const": "off",
                "no-unassigned-vars": "off",
            },
        },
    ],
    extends: [frontendConfig],
});
