<script lang="ts">
  import { presetsStore, type Preset } from "../stores/presets.svelte";
  import { generateImage } from "../api/client";
  import { extractMetadataFromPng } from "../utils/png-meta";

  let { presetId, onClose } = $props<{ presetId?: string, onClose: () => void }>();

  let preset = $state<Preset>({
    id: crypto.randomUUID(),
    name: "",
    type: "custom",
    prefix: "",
    suffix: "",
    negative: "",
    thumbnail: null
  });

  let isGeneratingThumb = $state(false);

  $effect(() => {
    if (presetId) {
      const p = presetsStore.presets.find(p => p.id === presetId);
      if (p) {
        preset = { ...p };
      }
    }
  });

  function save() {
    if (!preset.name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }
    if (presetId) {
      presetsStore.updatePreset(preset.id, preset);
    } else {
      presetsStore.addPreset(preset);
    }
    onClose();
  }

  async function generateThumbnail() {
    isGeneratingThumb = true;
    try {
      const prompt = [preset.prefix, "1girl, upper body, simple background", preset.suffix].filter(Boolean).join(", ");
      const result = await generateImage({
        prompt,
        negativePrompt: preset.negative,
        model: "nai-diffusion-4-5-full",
        width: 832,
        height: 1216,
        sampler: "k_euler",
        cfgScale: 5,
        seed: Math.floor(Math.random() * 4294967295)
      });

      const img = new Image();
      const url = URL.createObjectURL(result.blob);
      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = url;
      });

      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128 * (1216/832);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      preset.thumbnail = canvas.toDataURL("image/jpeg", 0.7);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("썸네일 생성 실패");
      console.error(e);
    } finally {
      isGeneratingThumb = false;
    }
  }

  function deletePreset() {
    if (confirm("삭제하시겠습니까?")) {
      presetsStore.removePreset(preset.id);
      onClose();
    }
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onclick={onClose}>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-full" onclick={e => e.stopPropagation()}>
    <div class="p-4 border-b border-gray-100 flex justify-between items-center">
      <h2 class="font-bold text-lg">{presetId ? '프리셋 편집' : '새 프리셋'}</h2>
      <button onclick={onClose} class="p-2 text-gray-500 rounded-full hover:bg-gray-100">✕</button>
    </div>

    <div class="p-4 overflow-y-auto flex-1 space-y-4">
      <div>
        <label class="block text-sm font-semibold mb-1">이름</label>
        <input type="text" bind:value={preset.name} class="w-full border border-gray-300 rounded p-2" placeholder="My Preset" />
      </div>

      <div class="flex gap-4">
        <div class="flex-1">
          <label class="block text-sm font-semibold mb-1">Prefix (앞 프롬프트)</label>
          <textarea bind:value={preset.prefix} class="w-full border border-gray-300 rounded p-2 h-20 text-sm" placeholder="masterpiece, best quality..."></textarea>
        </div>
        <div class="flex-1">
          <label class="block text-sm font-semibold mb-1">Suffix (뒤 프롬프트)</label>
          <textarea bind:value={preset.suffix} class="w-full border border-gray-300 rounded p-2 h-20 text-sm" placeholder=""></textarea>
        </div>
      </div>

      <div>
        <label class="block text-sm font-semibold mb-1">Negative</label>
        <textarea bind:value={preset.negative} class="w-full border border-gray-300 rounded p-2 h-20 text-sm" placeholder="lowres..."></textarea>
      </div>

      <div>
        <label class="block text-sm font-semibold mb-1">썸네일</label>
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center overflow-hidden">
            {#if preset.thumbnail}
              <img src={preset.thumbnail} alt="thumb" class="w-full h-full object-cover" />
            {:else}
              <span class="text-gray-400 text-xs">None</span>
            {/if}
          </div>
          <button
            onclick={generateThumbnail}
            disabled={isGeneratingThumb}
            class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium border border-gray-200 disabled:opacity-50"
          >
            {isGeneratingThumb ? '생성 중...' : '자동 생성'}
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-1">이 프리셋 설정으로 작은 이미지를 생성하여 저장합니다.</p>
      </div>
    </div>

    <div class="p-4 border-t border-gray-100 bg-gray-50 flex gap-2 justify-end">
      {#if presetId}
        <button onclick={deletePreset} class="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded border border-red-200 font-medium mr-auto">삭제</button>
      {/if}
      <button onclick={onClose} class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 font-medium">취소</button>
      <button onclick={save} class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">저장</button>
    </div>
  </div>
</div>
