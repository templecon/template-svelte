<script lang="ts">
  import { presetsStore } from "../stores/presets.svelte";
  import { sessionStore } from "../stores/session.svelte";
  import PresetEditor from "./PresetEditor.svelte";

  let showOrder = $state(false);
  let editingPresetId = $state<string | undefined>(undefined);
  let showEditor = $state(false);

  let pressTimer: ReturnType<typeof setTimeout>;

  function handlePointerDown(id: string) {
    pressTimer = setTimeout(() => {
      editingPresetId = id;
      showEditor = true;
    }, 500); // long press 500ms
  }

  function handlePointerUp() {
    clearTimeout(pressTimer);
  }

  function togglePreset(id: string) {
    if (sessionStore.session.activePresetIds.includes(id)) {
      sessionStore.session.activePresetIds = sessionStore.session.activePresetIds.filter(pid => pid !== id);
    } else {
      sessionStore.session.activePresetIds = [...sessionStore.session.activePresetIds, id];
    }
  }

  function moveUp(index: number) {
    if (index > 0) {
      const arr = [...sessionStore.session.activePresetIds];
      const temp = arr[index];
      arr[index] = arr[index - 1];
      arr[index - 1] = temp;
      sessionStore.session.activePresetIds = arr;
    }
  }

  function moveDown(index: number) {
    if (index < sessionStore.session.activePresetIds.length - 1) {
      const arr = [...sessionStore.session.activePresetIds];
      const temp = arr[index];
      arr[index] = arr[index + 1];
      arr[index + 1] = temp;
      sessionStore.session.activePresetIds = arr;
    }
  }
</script>

<div class="p-4 flex flex-col gap-2">
  <div class="flex items-center justify-between">
    <label class="text-sm font-semibold text-gray-700 flex items-center gap-1">
      🏷️ 프리셋
    </label>
    <button class="text-xs text-blue-600 font-medium" onclick={() => showOrder = !showOrder}>
      {showOrder ? "접기 ▲" : "적용 순서 보기 ▼"}
    </button>
  </div>

  <div class="flex gap-3 overflow-x-auto pb-2 snap-x">
    {#each presetsStore.presets as preset (preset.id)}
      {@const isActive = sessionStore.session.activePresetIds.includes(preset.id)}
      <button
        class="flex-shrink-0 w-24 h-32 rounded-xl border-2 transition-all snap-start flex flex-col items-center justify-center p-2 relative overflow-hidden bg-gray-50
          {isActive ? 'border-blue-500 shadow-md ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}"
        onclick={() => togglePreset(preset.id)}
        onpointerdown={() => handlePointerDown(preset.id)}
        onpointerup={handlePointerUp}
        onpointerleave={handlePointerUp}
      >
        {#if preset.thumbnail}
          <img src={preset.thumbnail} alt={preset.name} class="absolute inset-0 w-full h-full object-cover opacity-50" />
        {/if}
        <div class="z-10 text-center flex flex-col items-center gap-1">
          <span class="text-xs font-bold bg-white/80 px-1 rounded truncate w-full max-w-full">{preset.name}</span>
          {#if isActive}
            <span class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">✓</span>
          {/if}
        </div>
      </button>
    {/each}
    <button class="flex-shrink-0 w-24 h-32 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 snap-start" onclick={() => { editingPresetId = undefined; showEditor = true; }}>
      <span class="text-2xl">+</span>
      <span class="text-xs mt-1">추가</span>
    </button>
  </div>

  {#if showOrder && sessionStore.session.activePresetIds.length > 0}
    <div class="mt-2 flex flex-col gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
      <div class="text-xs text-gray-500 mb-1">적용 순서 (위에서부터 아래로 적용)</div>
      {#each sessionStore.session.activePresetIds as pid, i (pid)}
        {@const p = presetsStore.presets.find(x => x.id === pid)}
        {#if p}
          <div class="flex items-center justify-between bg-white p-2 rounded shadow-sm text-sm border border-gray-100">
            <span class="truncate pr-2">{p.name}</span>
            <div class="flex gap-1">
              <button disabled={i === 0} onclick={() => moveUp(i)} class="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30">▲</button>
              <button disabled={i === sessionStore.session.activePresetIds.length - 1} onclick={() => moveDown(i)} class="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30">▼</button>
            </div>
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</div>

{#if showEditor}
  <PresetEditor presetId={editingPresetId} onClose={() => showEditor = false} />
{/if}
