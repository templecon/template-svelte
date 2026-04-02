<script lang="ts">
    interface FormProps {
        onSubmit?: (data: { name: string; email: string }) => void;
    }
    const { onSubmit }: FormProps = $props();

    const form = $state({ name: "", email: "" });

    function handleSubmit(e: SubmitEvent) {
        // prefer explicit preventDefault over event modifiers
        e.preventDefault();
        onSubmit?.({ ...form });
    }
</script>

<form onsubmit={handleSubmit} aria-label="sample-form">
    <div>
        <label for="name">Name</label>
        <input
            id="name"
            aria-label="Name"
            placeholder="Name"
            bind:value={form.name}
        />
    </div>
    <div>
        <label for="email">Email</label>
        <input
            id="email"
            aria-label="Email"
            placeholder="Email"
            bind:value={form.email}
        />
    </div>
    <button type="submit">Submit</button>
</form>

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    input {
        padding: 0.4rem;
    }
</style>
