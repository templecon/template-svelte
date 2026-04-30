export class ConfigStore {
    apiKey: string = $state("");
    endpointMode: "direct" | "template" = $state("direct");
    endpointDirect: string = $state(
        "https://image.novelai.net/ai/generate-image"
    );
    endpointTemplate: string = $state(
        "https://my-proxy.example.com/?url={{endpoint}}"
    );

    constructor() {
        this.load();
    }

    get activeEndpoint(): string {
        const base = "https://image.novelai.net/ai/generate-image";
        if (this.endpointMode === "template") {
            return this.endpointTemplate.replace(
                "{{endpoint}}",
                encodeURIComponent(base)
            );
        }
        return this.endpointDirect;
    }

    load() {
        if (typeof localStorage !== "undefined") {
            try {
                const stored = localStorage.getItem("nai:config");
                if (stored) {
                    const parsed = JSON.parse(stored);
                    this.apiKey = parsed.apiKey ?? this.apiKey;
                    this.endpointMode =
                        parsed.endpointMode ?? this.endpointMode;
                    this.endpointDirect =
                        parsed.endpointDirect ?? this.endpointDirect;
                    this.endpointTemplate =
                        parsed.endpointTemplate ?? this.endpointTemplate;
                }
            } catch (e) {
                console.error("Failed to load config", e);
            }
        }
    }

    save() {
        if (typeof localStorage !== "undefined") {
            localStorage.setItem(
                "nai:config",
                JSON.stringify({
                    apiKey: this.apiKey,
                    endpointMode: this.endpointMode,
                    endpointDirect: this.endpointDirect,
                    endpointTemplate: this.endpointTemplate,
                })
            );
        }
    }
}

export const configStore = new ConfigStore();
