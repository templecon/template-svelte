import JSZip from "jszip";
import { configStore } from "../stores/config.svelte";

export interface GenerateOptions {
    prompt: string;
    negativePrompt: string;
    model: string;
    width: number;
    height: number;
    sampler: string;
    cfgScale: number;
    seed: number;
}

export interface GenerateResult {
    blob: Blob;
    seed: number;
    rawResponse?: ArrayBuffer;
}

// Development flag: set to true to mock API calls
const USE_MOCK = false;

function generateMockImage(width: number, height: number): Blob {
    // Create a simple gray square for mock
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#888888";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "48px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("MOCK", width / 2, height / 2);

    // Try to return data url then convert to blob, but since this runs in browser we could use toBlob.
    // We'll use a hack to convert data URL to Blob synchronously for simplicity in this mock,
    // or just return a promise.

    const dataUrl = canvas.toDataURL("image/png");
    const byteString = atob(dataUrl.split(",")[1]);
    const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

export async function generateImage(
    options: GenerateOptions,
    signal?: AbortSignal
): Promise<GenerateResult> {
    if (USE_MOCK) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    blob: generateMockImage(options.width, options.height),
                    seed: options.seed,
                });
            }, 1500); // simulate delay
        });
    }

    const endpoint = configStore.activeEndpoint;
    const apiKey = configStore.apiKey;

    if (!apiKey) {
        throw new Error("API Key is missing");
    }

    const payload = {
        input: options.prompt,
        model: options.model,
        action: "generate",
        parameters: {
            params_version: 1,
            width: options.width,
            height: options.height,
            scale: options.cfgScale,
            sampler: options.sampler,
            steps: 28, // fixed as per spec
            seed: options.seed,
            n_samples: 1,
            ucPreset: 0,
            qualityToggle: false,
            sm: false,
            sm_dyn: false,
            dynamic_thresholding: false,
            controlnet_strength: 1,
            legacy: false,
            add_original_image: false,
            uncond_scale: 1,
            cfg_rescale: 0,
            noise_schedule: "native",
            legacy_v3_extend: false,
            reference_image_multiple: [],
            reference_information_extracted_multiple: [],
            reference_strength_multiple: [],
            negative_prompt: options.negativePrompt,
        },
    };

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
        signal,
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`API Error ${response.status}: ${text}`);
    }

    const buffer = await response.arrayBuffer();

    try {
        const zip = await JSZip.loadAsync(buffer);
        const files = Object.keys(zip.files);

        // Find the first png file
        const pngFilename = files.find((f) => f.endsWith(".png"));
        if (!pngFilename) {
            throw new Error("No PNG found in the response zip");
        }

        const fileData = await zip.files[pngFilename].async("blob");
        return {
            blob: fileData,
            seed: options.seed,
            rawResponse: buffer,
        };
    } catch (err) {
        console.error("Failed to decode zip", err);
        throw new Error(
            "Failed to decode response as zip. It might not be a valid generation response."
        );
    }
}
