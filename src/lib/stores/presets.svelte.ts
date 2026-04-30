export interface Preset {
    id: string;
    name: string;
    type: "quality" | "style" | "character" | "custom";
    prefix: string;
    suffix: string;
    negative: string;
    thumbnail: string | null;
}

const DEFAULT_PRESETS: Preset[] = [
    {
        id: "quality",
        name: "Quality Boost",
        type: "quality",
        prefix: "masterpiece, best quality",
        suffix: "",
        negative: "lowres, bad anatomy, bad hands",
        thumbnail: null,
    },
    {
        id: "anime",
        name: "Anime Style",
        type: "style",
        prefix: "anime style, detailed eyes",
        suffix: "",
        negative: "",
        thumbnail: null,
    },
];

export class PresetsStore {
    presets: Preset[] = $state(DEFAULT_PRESETS);

    constructor() {
        this.load();
    }

    load() {
        if (typeof localStorage !== "undefined") {
            try {
                const stored = localStorage.getItem("nai:presets");
                if (stored) {
                    this.presets = JSON.parse(stored);
                }
            } catch (e) {
                console.error("Failed to load presets", e);
            }
        }
    }

    save() {
        if (typeof localStorage !== "undefined") {
            localStorage.setItem("nai:presets", JSON.stringify(this.presets));
        }
    }

    addPreset(preset: Preset) {
        this.presets.push(preset);
        this.save();
    }

    updatePreset(id: string, updates: Partial<Preset>) {
        const idx = this.presets.findIndex((p) => p.id === id);
        if (idx !== -1) {
            this.presets[idx] = { ...this.presets[idx], ...updates };
            this.save();
        }
    }

    removePreset(id: string) {
        this.presets = this.presets.filter((p) => p.id !== id);
        this.save();
    }
}

export const presetsStore = new PresetsStore();
