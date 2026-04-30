<script lang="ts">
  let { isGenerating, currentImage, count } = $props<{
    isGenerating: boolean;
    currentImage: string | null;
    count: number;
  }>();
</script>

<div class="relative w-full aspect-[2/3] bg-gray-100 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
  {#if currentImage}
    <img src={currentImage} alt="Generated" class="w-full h-full object-contain" />
  {:else}
    <div class="text-gray-400 flex flex-col items-center gap-2">
      <span class="text-4xl">🖼️</span>
      <span class="text-sm">이미지가 여기에 표시됩니다</span>
    </div>
  {/if}

  {#if isGenerating}
    <div class="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center flex-col gap-3">
      <div class="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
      {#if count > 0}
        <div class="bg-black/60 text-white text-sm px-3 py-1 rounded-full font-medium">
          연속 생성 중... {count}장째
        </div>
      {/if}
    </div>
  {/if}
</div>
