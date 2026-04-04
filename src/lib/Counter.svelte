<script lang="ts">
    interface CounterProps {
        initialCount?: number;
        onCountChange?: (count: number) => void;
    }
    const { initialCount = 0, onCountChange }: CounterProps = $props();

    // svelte-ignore state_referenced_locally
    let count = $state(initialCount);
    // svelte-ignore state_referenced_locally
    const resetValue = initialCount;

    function increment() {
        count++;
        onCountChange?.(count);
    }

    function reset() {
        count = resetValue;
        onCountChange?.(count);
    }
</script>

<div>
    <button onclick={increment} aria-label="Increment">Increment</button>
    <button onclick={reset} aria-label="Reset">Reset</button>
    <p>Count is {count}</p>
</div>

<style>
    div {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }
    button {
        padding: 0.4rem 0.6rem;
    }
</style>
