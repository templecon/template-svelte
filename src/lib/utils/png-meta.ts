import extract from "png-chunks-extract";
import text from "png-chunk-text";

export interface NaiMetadata {
    prompt: string;
    negativePrompt: string;
    seed: number;
    steps: number;
    scale: number;
    sampler: string;
    model: string;
    size: { w: number; h: number };
    raw: Record<string, unknown>;
}

export async function extractMetadataFromPng(
    blob: Blob
): Promise<NaiMetadata | null> {
    try {
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        // Extract chunks
        const chunks = extract(uint8Array);

        // Find text chunks
        const textChunks = chunks
            .filter(
                (c: { name: string; data: Uint8Array }) => c.name === "tEXt"
            )
            .map((c: { name: string; data: Uint8Array }) =>
                text.decode(c.data)
            );

        let meta: NaiMetadata = {
            prompt: "",
            negativePrompt: "",
            seed: 0,
            steps: 28,
            scale: 5,
            sampler: "k_euler",
            model: "nai-diffusion-4-5-full",
            size: { w: 832, h: 1216 },
            raw: {},
        };

        let foundMetadata = false;

        for (const chunk of textChunks) {
            if (chunk.keyword === "Comment") {
                try {
                    const parsed = JSON.parse(chunk.text);
                    meta.raw = { ...meta.raw, ...parsed };

                    if (parsed.prompt !== undefined)
                        meta.prompt = parsed.prompt;
                    if (parsed.uc !== undefined)
                        meta.negativePrompt = parsed.uc;
                    if (parsed.seed !== undefined)
                        meta.seed = Number(parsed.seed);
                    if (parsed.steps !== undefined)
                        meta.steps = Number(parsed.steps);
                    if (parsed.scale !== undefined)
                        meta.scale = Number(parsed.scale);
                    if (parsed.sampler !== undefined)
                        meta.sampler = parsed.sampler;

                    // Width and height might not be in comment directly but inside comment, but in some generation they are
                    // Actually they might be in separate tEXt chunks or IHDR.
                    foundMetadata = true;
                } catch (e) {
                    console.warn("Failed to parse PNG Comment tEXt chunk", e);
                }
            } else if (chunk.keyword === "Description") {
                meta.prompt = chunk.text;
                meta.raw.Description = chunk.text;
                foundMetadata = true;
            }
        }

        // Try to get resolution from IHDR
        const ihdr = chunks.find(
            (c: { name: string; data: Uint8Array }) => c.name === "IHDR"
        );
        if (ihdr) {
            const dv = new DataView(
                ihdr.data.buffer,
                ihdr.data.byteOffset,
                ihdr.data.byteLength
            );
            meta.size.w = dv.getUint32(0);
            meta.size.h = dv.getUint32(4);
        }

        if (!foundMetadata) return null;
        return meta;
    } catch (error) {
        console.error("Failed to extract metadata from PNG", error);
        return null;
    }
}
