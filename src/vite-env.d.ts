/// <reference types="vite/client" />
// Don't use import or export statements in this file, as it is
// treated as a module and can cause issues with Vite's type detection.

interface ViteTypeOptions {
    strictImportEnv: unknown;
}

interface ImportMetaEnv {
    /**
     * VITE_SOMETHING_COOL_ENV will be available in your code as
     * import.meta.env.VITE_SOMETHING_COOL_ENV
     */
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
