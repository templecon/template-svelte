<script lang="ts">
  import { onMount } from "svelte";
  import { setupSessionAutosave, sessionStore } from "./lib/stores/session.svelte";
  import { galleryStore } from "./lib/stores/gallery.svelte";
  import { generateImage } from "./lib/api/client";
  import { buildPrompt } from "./lib/utils/prompt-builder";
  import { presetsStore } from "./lib/stores/presets.svelte";
  import { extractMetadataFromPng } from "./lib/utils/png-meta";
  import { saveImageToOpfs } from "./lib/utils/opfs";

  import PromptInput from "./lib/components/PromptInput.svelte";
  import PresetBar from "./lib/components/PresetBar.svelte";
  import SizeSelector from "./lib/components/SizeSelector.svelte";
  import GenerateBar from "./lib/components/GenerateBar.svelte";
  import Preview from "./lib/components/Preview.svelte";
  import Settings from "./lib/components/Settings.svelte";
  import Gallery from "./lib/components/Gallery.svelte";
  import { Gear, Image } from "phosphor-svelte";

  setupSessionAutosave();

  let showSettings = $state(false);
  let showPwaToast = $state(false);
  let isGenerating = $state(false);
  let currentImage = $state<string | null>(null);
  let continuousCount = $state(0);
  let abortController = $state<AbortController | null>(null);
  let showGallery = $state(false);

  let combinedPrompt = $derived(buildPrompt(
    sessionStore.session.mainPrompt,
    sessionStore.session.negativePrompt,
    sessionStore.session.activePresetIds.map(id => presetsStore.presets.find(p => p.id === id)).filter(Boolean) as any
  ));

  onMount(() => {
    if (sessionStore.restored) {
      console.log("Session restored.");
    }

    // Check if app is installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
       console.log("Running as PWA");
    } else {
       // Show toast to install PWA on mobile after a short delay
       if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
           setTimeout(() => {
               if (localStorage.getItem('nai:pwa-prompted') !== 'true') {
                   showPwaToast = true;
               }
           }, 3000);
       }
    }
  });

  function dismissPwaToast() {
      showPwaToast = false;
      localStorage.setItem('nai:pwa-prompted', 'true');
  }

  async function handleGenerate() {
    if (isGenerating && sessionStore.session.infiniteMode) {
      // Stop generation
      sessionStore.session.infiniteMode = false;
      if (abortController) {
        abortController.abort();
        abortController = null;
      }
      isGenerating = false;
      continuousCount = 0;
      return;
    }

    if (isGenerating) return;

    isGenerating = true;
    continuousCount = sessionStore.session.infiniteMode ? 1 : 0;

    do {
      try {
        abortController = new AbortController();

        let width = 832, height = 1216;
        if (sessionStore.session.size === "landscape") { width = 1216; height = 832; }
        else if (sessionStore.session.size === "square") { width = 1024; height = 1024; }

        const currentSeed = sessionStore.session.seed !== null && sessionStore.session.seed !== undefined && sessionStore.session.seed !== 0
            ? sessionStore.session.seed
            : Math.floor(Math.random() * 4294967295);

        const result = await generateImage({
          prompt: combinedPrompt.prompt,
          negativePrompt: combinedPrompt.negativePrompt,
          model: sessionStore.session.model,
          width,
          height,
          sampler: sessionStore.session.sampler,
          cfgScale: sessionStore.session.cfgScale,
          seed: currentSeed
        }, abortController.signal);

        // Try extracting metadata, if not available build from request
        let meta = await extractMetadataFromPng(result.blob);
        if (!meta) {
          meta = {
            prompt: combinedPrompt.prompt,
            negativePrompt: combinedPrompt.negativePrompt,
            seed: currentSeed,
            steps: 28,
            scale: sessionStore.session.cfgScale,
            sampler: sessionStore.session.sampler,
            model: sessionStore.session.model,
            size: { w: width, h: height },
            raw: {}
          };
        }

        const timestamp = Date.now();
        const filename = `${timestamp}_${meta.seed}.png`;

        const saved = await saveImageToOpfs(filename, result.blob);
        if (saved) {
          galleryStore.addEntry({
            id: `${timestamp}_${meta.seed}`,
            filename,
            createdAt: timestamp,
            meta
          });

          if (currentImage) URL.revokeObjectURL(currentImage);
          currentImage = URL.createObjectURL(result.blob);
        } else {
          console.error("Failed to save to OPFS");
        }

      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log("Generation aborted");
        } else {
          console.error("Generation failed:", err);
          alert(`Generation failed: ${err.message}`);
          sessionStore.session.infiniteMode = false; // Stop on error
        }
      }

      if (sessionStore.session.infiniteMode) {
        continuousCount++;
        // Generate a new seed for the next iteration if we are in infinite mode
        sessionStore.session.seed = null;
      }

    } while (sessionStore.session.infiniteMode);

    isGenerating = false;
    abortController = null;
    continuousCount = 0;
  }

  $effect(() => {
    if (sessionStore.session.infiniteMode && !isGenerating) {
      handleGenerate();
    }
  });

  async function handleDrop(e: DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    if (file && file.type === "image/png") {
      const meta = await extractMetadataFromPng(file);
      if (meta) {
        if (confirm(`메타데이터를 찾았습니다.\nPrompt: ${meta.prompt.slice(0, 50)}...\n이 설정으로 복원하시겠습니까?`)) {
          sessionStore.session.mainPrompt = meta.prompt;
          sessionStore.session.negativePrompt = meta.negativePrompt;
          sessionStore.session.seed = null; // New seed
          sessionStore.session.cfgScale = meta.scale;
          sessionStore.session.sampler = meta.sampler;
          if (meta.model) sessionStore.session.model = meta.model;

          if (meta.size.w === 832 && meta.size.h === 1216) sessionStore.session.size = "portrait";
          else if (meta.size.w === 1216 && meta.size.h === 832) sessionStore.session.size = "landscape";
          else if (meta.size.w === 1024 && meta.size.h === 1024) sessionStore.session.size = "square";

          sessionStore.session.activePresetIds = [];
          alert("설정을 복원했습니다.");
        }
      } else {
        alert("이 PNG 파일에서 NovelAI 메타데이터를 찾을 수 없습니다.");
      }
    }
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
  }
</script>

<div
  class="min-h-screen bg-white text-gray-900 pb-24 md:pb-0 md:flex md:h-screen"
  ondrop={handleDrop}
  ondragover={handleDragOver}
>

  <!-- Main Column -->
  <div class="flex-1 flex flex-col h-full overflow-y-auto w-full md:max-w-md border-r border-gray-200">
    <header class="flex justify-between items-center p-4 sticky top-0 bg-white/90 backdrop-blur z-10 border-b border-gray-100">
      <h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">NovelAI Client</h1>
      <div class="flex gap-2">
        <button class="p-2 text-gray-600 hover:bg-gray-100 rounded-full md:hidden" onclick={() => showGallery = !showGallery}>
          <Image size={24} weight="bold" />
        </button>
        <button class="p-2 text-gray-600 hover:bg-gray-100 rounded-full" onclick={() => showSettings = true}>
          <Gear size={24} weight="bold" />
        </button>
      </div>
    </header>

    <main class="flex-1 pb-24">
      <PromptInput bind:prompt={sessionStore.session.mainPrompt} />
      <PresetBar />
      <SizeSelector />

      <div class="p-4 border-b border-gray-100">
        <details class="group">
          <summary class="text-sm font-semibold text-gray-700 cursor-pointer flex items-center gap-2 outline-none">
            <span class="text-gray-400 group-open:rotate-90 transition-transform">▶</span>
            🚫 네거티브 프롬프트
          </summary>
          <div class="mt-2">
            <textarea
              bind:value={sessionStore.session.negativePrompt}
              class="w-full p-2 border border-gray-300 rounded-lg text-sm min-h-[60px]"
              placeholder="lowres, bad anatomy..."
            ></textarea>
          </div>
        </details>
      </div>

      <div class="p-4 border-b border-gray-100 bg-gray-50/50">
        <details class="group">
          <summary class="text-sm font-semibold text-gray-700 cursor-pointer flex items-center gap-2 outline-none">
            <span class="text-gray-400 group-open:rotate-90 transition-transform">▶</span>
            📋 최종 프롬프트 (미리보기)
          </summary>
          <div class="mt-2 space-y-2 text-xs text-gray-600 bg-white p-3 rounded border border-gray-200">
            <div><strong>Prompt:</strong> {combinedPrompt.prompt}</div>
            <div><strong>Negative:</strong> {combinedPrompt.negativePrompt}</div>
          </div>
        </details>
      </div>

      <div class="p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-2">최신 이미지</h3>
        <Preview isGenerating={isGenerating} currentImage={currentImage} count={continuousCount} />
      </div>
    </main>

    <GenerateBar
      isGenerating={isGenerating}
      bind:infiniteMode={sessionStore.session.infiniteMode}
      onGenerate={handleGenerate}
    />
  </div>

  <!-- Desktop Gallery Column / Mobile Fullscreen Overlay -->
  {#if showGallery || window.innerWidth >= 768}
    <div class="fixed md:static inset-0 bg-white z-40 md:z-auto md:flex-1 md:border-l md:border-gray-200" style={window.innerWidth >= 768 ? 'display: block;' : (showGallery ? 'display: block;' : 'display: none;')}>
      <div class="md:hidden flex justify-between items-center p-4 border-b border-gray-100">
        <h2 class="text-lg font-bold">갤러리</h2>
        <button class="p-2 text-gray-500 hover:bg-gray-100 rounded-full" onclick={() => showGallery = false}>✕</button>
      </div>
      <div class="h-full overflow-hidden">
        <Gallery />
      </div>
    </div>
  {/if}

  {#if showSettings}
    <Settings onClose={() => showSettings = false} />
  {/if}

  {#if showPwaToast}
    <div class="fixed top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-xl z-50 flex items-center gap-3 w-[90%] max-w-sm">
      <div class="flex-1 text-sm font-medium">홈 화면에 추가하여 앱처럼 사용해보세요! (공유 > 홈 화면에 추가)</div>
      <button onclick={dismissPwaToast} class="p-1 hover:bg-white/20 rounded">✕</button>
    </div>
  {/if}
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: #f9fafb;
    overscroll-behavior-y: none;
  }
</style>
