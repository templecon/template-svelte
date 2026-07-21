import { defineConfig } from "oxlint";

import oxlintEslint from "./scripts/linter/oxlint-eslint.ts";
import oxlintSvelte from "./scripts/linter/oxlint-svelte.ts";

export default defineConfig({
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
        "**/.svelte-check/**",
        "**/.git/**",
    ],
    overrides: [
        {
            files: ["**/*.d.ts"],
            rules: {
                "no-unused-vars": "off",
            },
        },
    ],
    extends: [oxlintEslint, oxlintSvelte],
    options: {
        typeAware: true,
        typeCheck: true,
    },
});
