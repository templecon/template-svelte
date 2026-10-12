import { existsSync, globSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import js from "@eslint/js";
import oxlint from "eslint-plugin-oxlint";
import svelte from "eslint-plugin-svelte";
import { defineConfig, includeIgnoreFile } from "eslint/config";
import globals from "globals";
import ts from "typescript-eslint";

import oxlintConfig from "./oxlint.config.ts";
import svelteConfig from "./svelte.config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const isCI = process.env.CI ? true : false;

/**
 * Rules ESLint keeps even where Oxlint runs a rule of the same name, because
 * the meaning differs:
 * - no-unused-vars: Oxlint ignores values used only as types
 *   (`reportVarsOnlyUsedAsTypes` is false by default).
 * - no-global-assign: ESLint knows browser globals (`globals.browser`), while
 *   Oxlint's `env` only has `builtin`.
 * - no-irregular-whitespace: Oxlint skips template literals, regular
 *   expressions, and JSX text by default; ESLint checks them.
 */
const keptInEslint = new Set([
    "no-unused-vars",
    "@typescript-eslint/no-unused-vars",
    "no-global-assign",
    "no-irregular-whitespace",
]);

/** True for a rule entry Oxlint treats as off ("off", "allow", 0, or an array starting with one). */
const isOff = (entry: unknown): boolean => {
    const severity: unknown = Array.isArray(entry)
        ? (entry as unknown[])[0]
        : entry;
    return severity === "off" || severity === "allow" || severity === 0;
};

/**
 * The part of an Oxlint config read below. oxlint's exported override and
 * rule-map types are too large for the type checker to resolve, so configs
 * are read through this smaller shape.
 */
type OverrideScope = {
    extends?: OverrideScope[];
    overrides?: { files: string[]; rules?: Record<string, unknown> }[];
};

/** A config and everything it extends, at any depth. */
const withExtends = (config: OverrideScope): OverrideScope[] => [
    config,
    ...(config.extends ?? []).flatMap(withExtends),
];
const oxlintScopes = withExtends(oxlintConfig);

/**
 * Patterns from every git ignore file Oxlint honours (each .gitignore, at any
 * depth, and .git/info/exclude), rewritten for a config-level `ignores`.
 * - includeIgnoreFile writes patterns as if the file sat at the config root,
 *   so a nested file's directory is prefixed.
 * - Negations (`!pattern`) are dropped. In one flat `ignores` list they would
 *   also cancel unrelated exclusions (Oxlint's ignorePatterns, overrides), and
 *   git's precedence across files cannot be flattened. Dropping them only
 *   keeps more files in ESLint, never fewer.
 * - A pattern like `**\/.svelte-kit` matches the directory only as a path in a
 *   config-level `ignores`, so a `/**` variant reaches the files inside.
 * The global core.excludesFile is not read: Oxlint does not honour it either.
 */
const gitIgnored = [
    ...globSync("**/.gitignore", {
        cwd: __dirname,
        exclude: (path) => /(^|[\\/])(node_modules|\.git)$/u.test(path),
    }),
    ...(existsSync(join(__dirname, ".git/info/exclude"))
        ? [".git/info/exclude"]
        : []),
].flatMap((ignoreFile) => {
    const directory = ignoreFile.endsWith(".gitignore")
        ? dirname(ignoreFile).replaceAll("\\", "/")
        : ".";
    const prefix = directory === "." ? "" : `${directory}/`;
    return (includeIgnoreFile(join(__dirname, ignoreFile)).ignores ?? [])
        .filter((pattern) => !pattern.startsWith("!"))
        .flatMap((pattern) => {
            const scoped = `${prefix}${pattern}`;
            return scoped.endsWith("/**")
                ? [scoped]
                : [scoped, `${scoped.replace(/\/$/u, "")}/**`];
        });
});

/**
 * Paths where Oxlint does not enforce its rules as configured, so ESLint must
 * keep them: Oxlint's root ignorePatterns (not inherited through `extends`),
 * its built-in skip of minified file names, git-ignored paths (Oxlint
 * respects them, ESLint does not), and the files of any override (own or
 * inherited) that turns a rule off.
 */
const oxlintGaps = [
    ...(oxlintConfig.ignorePatterns ?? []),
    "**/*.min.*",
    "**/*-min.*",
    "**/*_min.*",
    ...gitIgnored,
    ...oxlintScopes
        .flatMap((config) => config.overrides ?? [])
        .filter((override) => Object.values(override.rules ?? {}).some(isOff))
        .flatMap((override) => override.files),
];

/**
 * ESLint rules that Oxlint already enforces, turned off for `.svelte.ts` only.
 * - `.svelte` keeps every ESLint rule: Oxlint reads only `<script>`, so markup
 *   expressions (`{x === NaN}`, event handlers) rely on ESLint alone.
 * - `typeAware: false` keeps type-aware rules in ESLint, since they need the
 *   Svelte-aware program ESLint builds.
 * - Configs with their own `files` come from Oxlint overrides and only turn
 *   rules off; they are dropped, and their paths are excluded via `oxlintGaps`.
 * The builder mutates its input, so it gets a copy. Its bundled OxlintConfig
 * type rejects oxlint's config objects in `extends`, which it resolves at runtime.
 */
const oxlintCoveredRules = oxlint
    .buildFromOxlintConfig(
        structuredClone(oxlintConfig) as unknown as Parameters<
            typeof oxlint.buildFromOxlintConfig
        >[0],
        { typeAware: false }
    )
    .filter((config) => !config.files)
    // Only name and rules carry over; the builder's own ignores target
    // .svelte/.vue/.astro files, which never match **/*.svelte.ts.
    .map(({ name, rules }) => ({
        name: `${name ?? "oxlint"}/svelte-ts`,
        files: ["**/*.svelte.ts"],
        ignores: oxlintGaps,
        rules: Object.fromEntries(
            Object.entries(rules ?? {}).filter(
                ([rule]) => !keptInEslint.has(rule)
            )
        ),
    }))
    .filter((config) => Object.keys(config.rules).length > 0);

export default defineConfig([
    {
        ignores: ["dist/", "node_modules/", "*.config.*", "coverage/"],
    },
    {
        files: ["**/*.svelte", "**/*.svelte.ts"],
        extends: [
            js.configs.recommended,
            ...ts.configs.recommendedTypeChecked,
            ...svelte.configs["flat/recommended"],
        ],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
            parserOptions: {
                projectService: true,
                tsconfigRootDir: __dirname,
                extraFileExtensions: [".svelte"],
            },
        },
    },

    {
        files: ["**/*.svelte", "**/*.svelte.ts"],
        languageOptions: {
            parserOptions: {
                parser: ts.parser,
                svelteConfig,
            },
        },
    },
    {
        files: ["**/*.svelte", "**/*.svelte.ts"],
        rules: {
            // Disable slow & conflicting rule.
            "svelte/require-store-reactive-access": "off",
            "no-restricted-syntax": [
                "error",
                {
                    selector:
                        "CallExpression[callee.name=/^(writable|readable)$/]",
                    message:
                        "Direct use of 'writable' or 'readable' is discouraged in Svelte 5. You should use Runes instead.",
                },
            ],
            "svelte/block-lang": ["error", { script: "ts" }],
        },
    },
    {
        files: ["**/*.svelte", "**/*.svelte.ts"],
        rules: {
            // Allow unused vars prefixed with _
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            // Allow empty interfaces for placeholders
            "@typescript-eslint/no-empty-object-type": "off",
            // Disable require-await - adapter pattern uses async for interface compatibility
            "@typescript-eslint/require-await": "off",
            // Disable unbound-method - false positives with Svelte stores
            "@typescript-eslint/unbound-method": "off",
            "svelte/no-useless-children-snippet": "warn",
            "no-debugger": isCI ? "error" : "warn",
            // Use dedicated logger. Console is unrecommended since it's not pretty
            "no-console": "warn",
        },
    },
    // Turn off rules Oxlint already enforces, in .svelte.ts only. Keep this last.
    ...oxlintCoveredRules,
]);
