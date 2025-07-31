import { component$, Slot } from "@builder.io/qwik";

/**
 * Minimalistic Sidebar wrapper for sidebar navigation and content.
 */
export const Sidebar = component$(() => (
  <aside
    class="sidebar"
    style={{
      background: "var(--sidebar-bg)",
      borderRight: "1px solid var(--border-color)",
      minWidth: "220px",
      height: "100vh",
      padding: "2rem 1rem 1rem 1rem",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
    }}
  >
    <Slot />
  </aside>
));

export default Sidebar;
