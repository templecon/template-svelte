<script lang="ts">
    interface CallbackExampleProps {
        onAction?: (payload: string) => void;
    }
    const { onAction }: CallbackExampleProps = $props();

    function doAction() {
        onAction?.("payload");
    }
</script>

<div>
    <button onclick={doAction}>Action</button>
</div>
