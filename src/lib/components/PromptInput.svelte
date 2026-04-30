<script lang="ts">
  import { PencilSimple } from "phosphor-svelte";
  let { prompt = $bindable() } = $props<{ prompt: string }>();

  function autoResize(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = target.scrollHeight + 'px';
  }
</script>

<div class="flex flex-col gap-2 p-4">
  <label for="prompt" class="text-sm font-semibold text-gray-700 flex items-center gap-1">
    <PencilSimple weight="bold" /> 📝 프롬프트
  </label>
  <textarea
    id="prompt"
    bind:value={prompt}
    oninput={autoResize}
    placeholder="Enter prompt here..."
    class="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none overflow-hidden"
  ></textarea>
</div>
