<script lang="ts">
  import { configStore } from "../stores/config.svelte";
  import { sessionStore } from "../stores/session.svelte";
  import { galleryStore } from "../stores/gallery.svelte";
  import { clearOpfs } from "../utils/opfs";

  let { onClose } = $props<{ onClose: () => void }>();

  async function handleClearGallery() {
    if (confirm("모든 갤러리 이미지와 데이터를 삭제하시겠습니까? (이 작업은 되돌릴 수 없습니다)")) {
      await clearOpfs();
      galleryStore.clear();
      alert("갤러리가 초기화되었습니다.");
    }
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm" onclick={onClose}>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="w-full max-w-sm h-full bg-white shadow-2xl p-6 overflow-y-auto flex flex-col mt-auto rounded-t-2xl sm:rounded-none" onclick={(e) => e.stopPropagation()}>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">설정</h2>
      <button class="p-2 text-gray-500 hover:bg-gray-100 rounded-full" onclick={onClose}>✕</button>
    </div>

    <div class="space-y-6 flex-1">
      <section>
        <h3 class="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">인증</h3>
        <label class="block mb-1 text-sm font-medium">API Key</label>
        <input
          type="password"
          bind:value={configStore.apiKey}
          class="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          placeholder="pst-..."
          onchange={() => configStore.save()}
        />
      </section>

      <section>
        <h3 class="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">엔드포인트</h3>
        <div class="flex gap-4 mb-2 text-sm">
          <label class="flex items-center gap-1">
            <input type="radio" bind:group={configStore.endpointMode} value="direct" onchange={() => configStore.save()} /> 직접 입력
          </label>
          <label class="flex items-center gap-1">
            <input type="radio" bind:group={configStore.endpointMode} value="template" onchange={() => configStore.save()} /> 프록시 템플릿
          </label>
        </div>
        {#if configStore.endpointMode === 'direct'}
          <input
            type="text"
            bind:value={configStore.endpointDirect}
            class="w-full p-2 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
            onchange={() => configStore.save()}
          />
        {:else}
          <input
            type="text"
            bind:value={configStore.endpointTemplate}
            class="w-full p-2 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://my-proxy.example.com/?url=&#123;&#123;endpoint&#125;&#125;"
            onchange={() => configStore.save()}
          />
          <p class="text-xs text-gray-500 mt-1">&#123;&#123;endpoint&#125;&#125; 부분이 실제 URL로 치환됩니다.</p>
        {/if}
      </section>

      <section>
        <h3 class="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">생성 기본값</h3>

        <label class="block mb-1 text-sm font-medium">Sampler</label>
        <select bind:value={sessionStore.session.sampler} class="w-full p-2 border border-gray-300 rounded mb-3 bg-white">
          <option value="k_euler">Euler</option>
          <option value="k_euler_ancestral">Euler Ancestral</option>
          <option value="k_dpmpp_2m">DPM++ 2M</option>
          <option value="k_dpmpp_2m_sde">DPM++ 2M SDE</option>
        </select>

        <label class="block mb-1 text-sm font-medium">CFG Scale: {sessionStore.session.cfgScale}</label>
        <input type="range" min="1" max="10" step="0.1" bind:value={sessionStore.session.cfgScale} class="w-full mb-3" />

        <label class="block mb-1 text-sm font-medium">Seed (비우면 랜덤)</label>
        <input
          type="number"
          bind:value={sessionStore.session.seed}
          class="w-full p-2 border border-gray-300 rounded"
          placeholder="Random"
        />
      </section>

      <section>
        <h3 class="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">데이터 관리</h3>
        <button
          class="w-full py-2 bg-red-50 text-red-600 font-medium rounded border border-red-200 hover:bg-red-100 transition-colors"
          onclick={handleClearGallery}
        >
          갤러리 전체 삭제 (OPFS 비우기)
        </button>
      </section>
    </div>
  </div>
</div>
