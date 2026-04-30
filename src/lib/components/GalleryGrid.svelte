<script lang="ts">
  import { galleryStore } from "../stores/gallery.svelte";
  import { getImageFromOpfs } from "../utils/opfs";

  let { onImageClick } = $props<{ onImageClick: (index: number) => void }>();

  let imageUrls = $state<Record<string, string>>({});

  $effect(() => {
    galleryStore.entries.forEach(async (entry) => {
      if (!imageUrls[entry.id]) {
        const blob = await getImageFromOpfs(entry.filename);
        if (blob) {
          imageUrls[entry.id] = URL.createObjectURL(blob);
        }
      }
    });
  });
</script>

<div class="grid grid-cols-3 gap-1 p-1 pb-24">
  {#each galleryStore.entries as entry, i (entry.id)}
    <button
      class="aspect-square bg-gray-200 relative overflow-hidden"
      onclick={() => onImageClick(i)}
    >
      {#if imageUrls[entry.id]}
        <img src={imageUrls[entry.id]} alt="Gallery" class="w-full h-full object-cover" loading="lazy" />
      {:else}
        <div class="w-full h-full flex items-center justify-center text-gray-400 text-xs">Loading...</div>
      {/if}
      <div class="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1 rounded backdrop-blur-sm">
        {entry.meta.seed}
      </div>
    </button>
  {/each}
  {#if galleryStore.entries.length === 0}
    <div class="col-span-3 text-center py-10 text-gray-500">
      갤러리가 비어있습니다.
    </div>
  {/if}
</div>
