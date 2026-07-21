import { defineConfig } from "oxlint";
import eslintError from "./oxlint-eslint-error.ts";
import eslintWarn from "./oxlint-eslint-warn.ts";
export default defineConfig({
    extends: [eslintError, eslintWarn],
    overrides: [
        {
            // node scripts
            files: [
                "scripts/**/*.ts",
                "scripts/**/*.mjs",
                "scripts/**/*.js",
                "*.ts",
                "*.mjs",
                "*.js",
            ],
            excludeFiles: ["src/**/*", "tests/**/*"],
            rules: {
                "import/no-relative-parent-imports": "off",
                "no-console": "off",
            },
        },
    ],
});
