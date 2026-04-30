<script lang="ts">
  let { isGenerating, infiniteMode = $bindable(), onGenerate } = $props<{
    isGenerating: boolean;
    infiniteMode: boolean;
    onGenerate: () => void;
  }>();
</script>

<div class="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 z-40 pb-safe">
  <div class="flex gap-3 max-w-lg mx-auto">
    <button
      class="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
      disabled={isGenerating && !infiniteMode}
      onclick={onGenerate}
    >
      {#if isGenerating}
        <span class="animate-spin inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
        {infiniteMode ? '생성 중지' : '생성 중...'}
      {:else}
        🎨 생성하기
      {/if}
    </button>
    <button
      class="w-14 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl border border-gray-200 shadow-sm hover:bg-gray-200 flex items-center justify-center transition-all {infiniteMode ? 'ring-2 ring-blue-500 bg-blue-50 text-blue-600 border-blue-200' : ''}"
      onclick={() => infiniteMode = !infiniteMode}
      title="무한 생성 모드"
    >
      <span class="text-xl">∞</span>
    </button>
  </div>
</div>

<style>
  .pb-safe {
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }
</style>
