import type { Preset } from "../stores/presets.svelte";

export function buildPrompt(
    basePrompt: string,
    baseNegative: string,
    activePresets: Preset[]
): { prompt: string; negativePrompt: string } {
    let prefixes: string[] = [];
    let suffixes: string[] = [];
    let negatives: string[] = [];

    for (const preset of activePresets) {
        if (preset.prefix && preset.prefix.trim() !== "") {
            prefixes.push(preset.prefix.trim());
        }
        if (preset.suffix && preset.suffix.trim() !== "") {
            suffixes.push(preset.suffix.trim());
        }
        if (preset.negative && preset.negative.trim() !== "") {
            negatives.push(preset.negative.trim());
        }
    }

    const cleanBasePrompt = basePrompt.trim();
    const promptParts = [...prefixes, cleanBasePrompt, ...suffixes].filter(
        (p) => p !== ""
    );

    const cleanBaseNegative = baseNegative.trim();
    const negativeParts = [...negatives, cleanBaseNegative].filter(
        (n) => n !== ""
    );

    return {
        prompt: promptParts.join(", "),
        negativePrompt: negativeParts.join(", "),
    };
}
