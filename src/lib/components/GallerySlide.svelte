<script lang="ts">
  import { galleryStore } from "../stores/gallery.svelte";
  import { sessionStore } from "../stores/session.svelte";
  import { getImageFromOpfs, deleteImageFromOpfs } from "../utils/opfs";

  let { initialIndex, onClose } = $props<{ initialIndex: number; onClose: () => void }>();

  let currentIndex = $state(initialIndex);
  let currentImageUrl = $state<string | null>(null);
  let showMeta = $state(false);

  async function loadImage(index: number) {
    if (index < 0 || index >= galleryStore.entries.length) return;
    const entry = galleryStore.entries[index];
    const blob = await getImageFromOpfs(entry.filename);
    if (currentImageUrl) URL.revokeObjectURL(currentImageUrl);
    if (blob) {
      currentImageUrl = URL.createObjectURL(blob);
    } else {
      currentImageUrl = null;
    }
  }

  $effect(() => {
    loadImage(currentIndex);
  });

  function next() {
    if (currentIndex < galleryStore.entries.length - 1) currentIndex++;
  }

  function prev() {
    if (currentIndex > 0) currentIndex--;
  }

  function generateLikeThis(reuseSeed: boolean) {
    const meta = galleryStore.entries[currentIndex].meta;
    sessionStore.session.mainPrompt = meta.prompt;
    sessionStore.session.negativePrompt = meta.negativePrompt;
    sessionStore.session.model = meta.model || "nai-diffusion-4-5-full";
    sessionStore.session.sampler = meta.sampler;
    sessionStore.session.cfgScale = meta.scale;
    sessionStore.session.activePresetIds = []; // Don't reuse presets as prompt is already combined

    if (reuseSeed) {
      sessionStore.session.seed = meta.seed;
    } else {
      sessionStore.session.seed = null;
    }

    // Convert size back if matched
    if (meta.size.w === 832 && meta.size.h === 1216) sessionStore.session.size = "portrait";
    else if (meta.size.w === 1216 && meta.size.h === 832) sessionStore.session.size = "landscape";
    else if (meta.size.w === 1024 && meta.size.h === 1024) sessionStore.session.size = "square";

    onClose();
    // In a real app we might trigger a toast here
    alert(`설정을 복원했습니다. ${reuseSeed ? '(Seed 포함)' : '(새로운 Seed)'}`);
  }

  async function deleteCurrent() {
    if (confirm("이 이미지를 삭제하시겠습니까?")) {
      const entry = galleryStore.entries[currentIndex];
      await deleteImageFromOpfs(entry.filename);
      galleryStore.removeEntry(entry.id);

      if (galleryStore.entries.length === 0) {
        onClose();
      } else {
        if (currentIndex >= galleryStore.entries.length) {
          currentIndex = galleryStore.entries.length - 1;
        } else {
          loadImage(currentIndex);
        }
      }
    }
  }

  let touchStartX = 0;
  let touchStartY = 0;
  let currentPinchDistance = 0;
  let scale = $state(1);
  let baseScale = $state(1);

  function handleTouchStart(e: TouchEvent) {
    if (e.touches.length === 1) {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    } else if (e.touches.length === 2) {
      currentPinchDistance = Math.hypot(
        e.touches[0].screenX - e.touches[1].screenX,
        e.touches[0].screenY - e.touches[1].screenY
      );
      baseScale = scale;
    }
  }

  function handleTouchMove(e: TouchEvent) {
    if (e.touches.length === 2) {
      e.preventDefault();
      const newDist = Math.hypot(
        e.touches[0].screenX - e.touches[1].screenX,
        e.touches[0].screenY - e.touches[1].screenY
      );
      scale = Math.min(Math.max(1, baseScale * (newDist / currentPinchDistance)), 5);
    }
  }

  function handleTouchEnd(e: TouchEvent) {
    if (e.changedTouches.length === 1 && scale === 1) {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;

      if (touchEndX < touchStartX - 50 && Math.abs(touchEndY - touchStartY) < 50) next();
      if (touchEndX > touchStartX + 50 && Math.abs(touchEndY - touchStartY) < 50) prev();

      // Swipe up or down to close
      if (touchEndY < touchStartY - 100 || touchEndY > touchStartY + 100) onClose();
    }
    if (scale < 1.1) {
      scale = 1;
      baseScale = 1;
    }
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="fixed inset-0 bg-black z-50 flex flex-col"
     ontouchstart={handleTouchStart}
     ontouchmove={handleTouchMove}
     ontouchend={handleTouchEnd}>

  <div class="flex justify-between items-center p-4 text-white bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
    <button class="p-2" onclick={onClose}>← 뒤로</button>
    <div class="text-sm opacity-80">
      {currentIndex + 1} / {galleryStore.entries.length}
    </div>
  </div>

  <div class="flex-1 flex items-center justify-center relative overflow-hidden">
    {#if currentImageUrl}
      <img src={currentImageUrl} alt="Full view" class="max-w-full max-h-full object-contain transition-transform duration-100 ease-out" style="transform: scale({scale})" />
    {:else}
      <div class="text-white">Loading...</div>
    {/if}
  </div>

  {#if showMeta}
    {@const meta = galleryStore.entries[currentIndex]?.meta}
    <div class="bg-gray-900 text-white p-4 max-h-[50vh] overflow-y-auto text-sm">
      <div class="flex justify-between items-center mb-2">
        <h3 class="font-bold">Metadata</h3>
        <button onclick={() => showMeta = false} class="text-gray-400">✕</button>
      </div>
      <div class="space-y-2 text-gray-300">
        <p><strong class="text-gray-100">Prompt:</strong> {meta?.prompt}</p>
        <p><strong class="text-gray-100">Negative:</strong> {meta?.negativePrompt}</p>
        <div class="grid grid-cols-2 gap-2 mt-2">
          <p>Seed: {meta?.seed}</p>
          <p>Steps: {meta?.steps}</p>
          <p>Scale: {meta?.scale}</p>
          <p>Sampler: {meta?.sampler}</p>
          <p>Size: {meta?.size.w}x{meta?.size.h}</p>
        </div>
      </div>
    </div>
  {/if}

  <div class="bg-gray-900 p-4 pb-safe flex justify-between items-center gap-2">
    <button onclick={() => showMeta = !showMeta} class="text-white p-2 rounded hover:bg-gray-800 text-sm">
      메타데이터
    </button>
    <div class="flex gap-2">
      <button onclick={() => generateLikeThis(false)} class="bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium">
        이것처럼 생성
      </button>
      <button onclick={() => generateLikeThis(true)} class="bg-gray-700 text-white px-3 py-2 rounded text-sm font-medium" title="같은 Seed로 재생성">
        재생성
      </button>
      <button onclick={deleteCurrent} class="bg-red-900/50 text-red-400 px-3 py-2 rounded text-sm">
        삭제
      </button>
    </div>
  </div>
</div>

<style>
  .pb-safe {
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }
</style>
