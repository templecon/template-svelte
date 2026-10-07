/* v8 ignore file -- @preserve */
import "@/style.css";
import { mount } from "svelte";

import App from "@/App.svelte";

const target = document.getElementById("app");
if (!target) {
    throw new Error("Failed to find target element with id 'app'");
}
const app = mount(App, { target });
export default app;
