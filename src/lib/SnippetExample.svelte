<script lang="ts">
    import type { Snippet } from "svelte";

    interface SnippetExampleProps {
        header?: Snippet;
        main?: Snippet;
        footer?: Snippet;
        children?: Snippet;
    }
    const { header, main, footer, children }: SnippetExampleProps = $props();
</script>

<div class="snippet">
    <header>{@render header?.()}</header>
    <main>{@render main?.()}</main>
    <footer>{@render footer?.()}</footer>
    <section>{@render children?.()}</section>
</div>

<style>
    .snippet {
        border: 1px dashed #ddd;
        padding: 0.5rem;
    }
</style>
