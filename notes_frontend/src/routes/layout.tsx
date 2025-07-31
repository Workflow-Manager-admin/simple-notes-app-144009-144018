import { component$, Slot } from "@builder.io/qwik";

/**
 * Layout wrapper just provides <main> slot for routed children.
 */
// PUBLIC_INTERFACE
export default component$(() => (
  <main>
    <Slot />
  </main>
));
