<script lang="ts">
    import Counter from "@/lib/Counter.svelte";
    import Form from "@/lib/Form.svelte";
    import DerivedLabel from "@/lib/DerivedLabel.svelte";
    import CallbackExample from "@/lib/CallbackExample.svelte";
    import SnippetExample from "@/lib/SnippetExample.svelte";

    let count = $state(0);

    function onCountChange(v: number) {
        count = v;
    }

    function handleForm(data: unknown) {
        // Minimal example handler for template
        // In real projects, replace with actionable logic

        // oxlint-disable-next-line no-console
        console.log("form submit:", data);
    }
</script>

<main>
    <h1>Template Svelte (Svelte 5 - runes)</h1>

    <section>
        <h2>Counter</h2>
        <Counter initialCount={count} {onCountChange} />
        <p>App count: {count}</p>
    </section>

    <section>
        <h2>Form</h2>
        <Form onSubmit={handleForm} />
    </section>

    <section>
        <h2>Derived</h2>
        <DerivedLabel />
    </section>

    <section>
        <h2>Callback</h2>
        <CallbackExample onAction={(p) => console.log("action", p)} />
    </section>

    <section>
        <h2>Snippet</h2>
        {#snippet header()}
            <h3>Header snippet</h3>
        {/snippet}
        {#snippet main()}
            <div>Main snippet</div>
        {/snippet}
        {#snippet footer()}
            <small>Footer snippet</small>
        {/snippet}
        <!-- eslint-disable-next-line svelte/no-useless-children-snippet -->
        {#snippet children()}
            <p>Children snippet</p>
        {/snippet}
        <SnippetExample {header} {main} {footer} {children} />
    </section>
</main>

<style>
    main {
        padding: 1rem;
        font-family:
            system-ui,
            -apple-system,
            "Segoe UI",
            Roboto,
            "Helvetica Neue",
            Arial;
    }
    section {
        margin: 1rem 0;
        padding: 0.5rem;
        border: 1px solid #eee;
        border-radius: 6px;
    }
</style>
