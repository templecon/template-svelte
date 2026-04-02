<script lang="ts">
    let count = $state(0);
    let double = $derived(count * 2);
</script>

<div>
    <p>Count: {count}</p>
    <p>Double: {double}</p>
    <button onclick={() => count++}>+1</button>
    <button onclick={() => count--}>-1</button>
</div>

<style>
    div {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }
</style>
