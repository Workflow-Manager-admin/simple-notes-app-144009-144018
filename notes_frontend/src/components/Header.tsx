import { component$ } from "@builder.io/qwik";

interface HeaderProps {
  searchValue: string;
  onSearchInput$: (event: Event) => void;
  onCreateNote$: () => void;
}
export const Header = component$<HeaderProps>(
  ({ searchValue, onSearchInput$, onCreateNote$ }) => (
    <header
      class="header"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "var(--header-bg)",
        borderBottom: "1px solid var(--border-color)",
        padding: "0.5rem 1rem",
        height: "56px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          color: "var(--primary-color)",
          fontSize: "1.18rem"
        }}
      >
        Simple Notes
      </div>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Search notes..."
          value={searchValue}
          class="search-input"
          style={{
            padding: "0.3rem 0.7rem",
            border: "1px solid var(--input-border)",
            borderRadius: "6px",
            background: "var(--input-bg)",
            color: "var(--primary-color)",
            fontSize: "1rem",
            minWidth: "190px",
            outline: "none"
          }}
          onInput$={$((e) => onSearchInput$(e))}
        />
        <button
          style={{
            background: "var(--accent-color)",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "0.45rem 1rem",
            cursor: "pointer",
            fontSize: "1rem",
          }}
          onClick$={$(() => onCreateNote$())}
        >
          + New Note
        </button>
      </div>
    </header>
  )
);
export default Header;
