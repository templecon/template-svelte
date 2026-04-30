export interface GalleryEntry {
    id: string;
    filename: string;
    createdAt: number;
    meta: {
        prompt: string;
        negativePrompt: string;
        seed: number;
        steps: number;
        scale: number;
        sampler: string;
        model: string;
        size: { w: number; h: number };
        raw: Record<string, unknown>;
    };
}

export class GalleryStore {
    entries: GalleryEntry[] = $state([]);

    constructor() {
        this.load();
    }

    load() {
        if (typeof localStorage !== "undefined") {
            try {
                const stored = localStorage.getItem("nai:gallery-index");
                if (stored) {
                    this.entries = JSON.parse(stored);
                }
            } catch (e) {
                console.error("Failed to load gallery index", e);
            }
        }
    }

    save() {
        if (typeof localStorage !== "undefined") {
            localStorage.setItem(
                "nai:gallery-index",
                JSON.stringify(this.entries)
            );
        }
    }

    addEntry(entry: GalleryEntry) {
        this.entries.unshift(entry); // Add to the beginning
        this.save();
    }

    removeEntry(id: string) {
        this.entries = this.entries.filter((e) => e.id !== id);
        this.save();
    }

    clear() {
        this.entries = [];
        this.save();
    }
}

export const galleryStore = new GalleryStore();
