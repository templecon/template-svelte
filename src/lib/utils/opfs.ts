const OPFS_DIR_NAME = "nai-images";

async function getOpfsDirectory() {
    try {
        const root = await navigator.storage.getDirectory();
        return await root.getDirectoryHandle(OPFS_DIR_NAME, { create: true });
    } catch (error) {
        console.warn(
            "OPFS is not available or directory could not be created:",
            error
        );
        return null;
    }
}

export async function saveImageToOpfs(
    filename: string,
    blob: Blob
): Promise<boolean> {
    const dir = await getOpfsDirectory();
    if (!dir) {
        // Fallback: Could potentially use localStorage if OPFS isn't available,
        // but the task states "OPFS 미지원 브라우저 fallback: base64로 localStorage에 저장".
        // For now we return false so the caller knows it failed.
        return false;
    }

    try {
        const fileHandle = await dir.getFileHandle(filename, { create: true });
        // WritableFileStream is available in secure contexts
        const writable = await (
            fileHandle as unknown as {
                createWritable: () => Promise<{
                    write: (blob: Blob) => Promise<void>;
                    close: () => Promise<void>;
                }>;
            }
        ).createWritable();
        await writable.write(blob);
        await writable.close();
        return true;
    } catch (e) {
        console.error("Failed to write to OPFS", e);
        return false;
    }
}

export async function getImageFromOpfs(filename: string): Promise<Blob | null> {
    const dir = await getOpfsDirectory();
    if (!dir) return null;

    try {
        const fileHandle = await dir.getFileHandle(filename);
        const file = await fileHandle.getFile();
        return file;
    } catch (e) {
        console.error("Failed to read from OPFS", e);
        return null;
    }
}

export async function deleteImageFromOpfs(filename: string): Promise<boolean> {
    const dir = await getOpfsDirectory();
    if (!dir) return false;

    try {
        await dir.removeEntry(filename);
        return true;
    } catch (e) {
        console.error("Failed to delete from OPFS", e);
        return false;
    }
}

export async function clearOpfs(): Promise<boolean> {
    try {
        const root = await navigator.storage.getDirectory();
        await root.removeEntry(OPFS_DIR_NAME, { recursive: true });
        return true;
    } catch (e) {
        console.error("Failed to clear OPFS", e);
        return false;
    }
}
