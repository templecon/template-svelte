<script lang="ts">
  import { sessionStore } from "../stores/session.svelte";

  const models = [
    { value: "nai-diffusion-4-5-full", label: "v4.5 Full" },
    { value: "nai-diffusion-4-5-curated", label: "v4.5 Curated" },
    { value: "nai-diffusion-4-full", label: "v4 Full" },
    { value: "nai-diffusion-4-curated", label: "v4 Curated" },
    { value: "nai-diffusion-3", label: "v3 Full" },
    { value: "nai-diffusion-3-curated", label: "v3 Curated" },
  ];
</script>

<div class="px-4 py-2 flex items-center justify-between gap-4 border-y border-gray-100 bg-gray-50/50">
  <div class="flex items-center gap-2 bg-gray-200/50 p-1 rounded-lg">
    <button
      class="p-2 rounded {sessionStore.session.size === 'portrait' ? 'bg-white shadow-sm' : 'text-gray-500'}"
      onclick={() => sessionStore.session.size = 'portrait'}
      title="세로 (832x1216)"
    >
      <div class="w-3 h-4 border-2 border-current rounded-sm"></div>
    </button>
    <button
      class="p-2 rounded {sessionStore.session.size === 'landscape' ? 'bg-white shadow-sm' : 'text-gray-500'}"
      onclick={() => sessionStore.session.size = 'landscape'}
      title="가로 (1216x832)"
    >
      <div class="w-4 h-3 border-2 border-current rounded-sm"></div>
    </button>
    <button
      class="p-2 rounded {sessionStore.session.size === 'square' ? 'bg-white shadow-sm' : 'text-gray-500'}"
      onclick={() => sessionStore.session.size = 'square'}
      title="정사각 (1024x1024)"
    >
      <div class="w-3 h-3 border-2 border-current rounded-sm"></div>
    </button>
  </div>

  <div class="flex-1 flex justify-end">
    <select
      bind:value={sessionStore.session.model}
      class="bg-white border border-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none shadow-sm font-medium"
    >
      {#each models as model (model.value)}
        <option value={model.value}>{model.label}</option>
      {/each}
    </select>
  </div>
</div>
