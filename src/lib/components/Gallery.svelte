<script lang="ts">
  import { Images } from "phosphor-svelte";
  import { galleryStore } from "../stores/gallery.svelte";
  import GalleryGrid from "./GalleryGrid.svelte";
  import GallerySlide from "./GallerySlide.svelte";

  let viewMode = $state<"grid" | "slide">("grid");
  let slideIndex = $state(0);

  function openSlide(index: number) {
    slideIndex = index;
    viewMode = "slide";
  }

  function closeSlide() {
    viewMode = "grid";
  }
</script>

<div class="flex flex-col h-full relative">
  <div class="flex justify-between items-center p-4 sticky top-0 bg-white/90 backdrop-blur z-10 border-b border-gray-100">
    <h2 class="text-lg font-bold flex items-center gap-2">
      <Images weight="bold" /> 갤러리
      <span class="text-sm font-normal text-gray-500">({galleryStore.entries.length})</span>
    </h2>
    <div class="flex bg-gray-100 rounded-lg p-1">
      <button
        class="px-3 py-1 rounded text-sm {viewMode === 'grid' ? 'bg-white shadow-sm font-medium' : 'text-gray-500'}"
        onclick={() => viewMode = 'grid'}
      >
        ⊞ 그리드
      </button>
      <button
        class="px-3 py-1 rounded text-sm {viewMode === 'slide' ? 'bg-white shadow-sm font-medium' : 'text-gray-500'}"
        onclick={() => viewMode = 'slide'}
        disabled={galleryStore.entries.length === 0}
      >
        ▷ 뷰어
      </button>
    </div>
  </div>

  <div class="flex-1 overflow-y-auto">
    {#if viewMode === "grid"}
      <GalleryGrid onImageClick={openSlide} />
    {/if}
  </div>

  {#if viewMode === "slide"}
    <GallerySlide initialIndex={slideIndex} onClose={closeSlide} />
  {/if}
</div>
