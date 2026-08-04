/// <reference types="vite/client" />
// Don't use import or export statements in this file, as it is
// treated as a module and can cause issues with Vite's type detection.

interface ViteTypeOptions {
    strictImportEnv: unknown;
}

interface ImportMetaEnv {
    VITEST_MODE?: "node" | "browser";
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
