<script lang="ts">
    import { Link, Route, Router } from "svelte5-router";

    const basepath =
        import.meta.env.BASE_URL === "./"
            ? "/"
            : import.meta.env.BASE_URL.replace(/\/$/, "") || "/";
    const aboutPath = basepath === "/" ? "/about" : `${basepath}/about`;
</script>

<Router {basepath}>
    <header class="mx-auto flex max-w-3xl items-center justify-between p-6">
        <Link class="font-semibold" to={basepath}>Svelte template</Link>
        <nav class="flex gap-4" aria-label="Primary navigation">
            <Link to={basepath}>Home</Link>
            <Link to={aboutPath}>About</Link>
        </nav>
    </header>

    <Route path="/">
        <main class="mx-auto max-w-3xl p-6">
            <h1 class="text-3xl font-semibold">Svelte 5 + Vite</h1>
            <p class="mt-3">
                A lightweight TypeScript template with History API routing.
            </p>
        </main>
    </Route>

    <Route path="/about">
        <main class="mx-auto max-w-3xl p-6">
            <h1 class="text-3xl font-semibold">About this template</h1>
            <p class="mt-3">
                Use this as a clean starting point for a Svelte application.
            </p>
        </main>
    </Route>

    <Route>
        <main class="mx-auto max-w-3xl p-6">
            <p role="alert">Page not found.</p>
            <Link to={basepath}>Return home</Link>
        </main>
    </Route>
</Router>
