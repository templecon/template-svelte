export interface Session {
    mainPrompt: string;
    negativePrompt: string;
    activePresetIds: string[];
    model: string;
    size: "portrait" | "landscape" | "square";
    sampler: string;
    cfgScale: number;
    seed: number | null;
    infiniteMode: boolean;
}

const DEFAULT_SESSION: Session = {
    mainPrompt: "",
    negativePrompt: "",
    activePresetIds: [],
    model: "nai-diffusion-4-5-full",
    size: "portrait",
    sampler: "k_euler",
    cfgScale: 5.0,
    seed: null,
    infiniteMode: false,
};

export class SessionStore {
    session: Session = $state(DEFAULT_SESSION);
    private saveTimeout: ReturnType<typeof setTimeout> | null = null;
    restored: boolean = $state(false);

    constructor() {
        this.load();
    }

    load() {
        if (typeof localStorage !== "undefined") {
            try {
                const stored = localStorage.getItem("nai:session");
                if (stored) {
                    const parsed = JSON.parse(stored);
                    this.session = { ...DEFAULT_SESSION, ...parsed };
                    this.restored = true;
                }
            } catch (e) {
                console.error("Failed to load session", e);
            }
        }
    }

    scheduleSave() {
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }
        this.saveTimeout = setTimeout(() => {
            this.save();
        }, 500);
    }

    save() {
        if (typeof localStorage !== "undefined") {
            localStorage.setItem("nai:session", JSON.stringify(this.session));
        }
    }
}

export const sessionStore = new SessionStore();

export function setupSessionAutosave() {
    $effect.root(() => {
        $effect(() => {
            // Re-run whenever session properties change
            JSON.stringify(sessionStore.session);
            sessionStore.scheduleSave();
        });
    });
}
