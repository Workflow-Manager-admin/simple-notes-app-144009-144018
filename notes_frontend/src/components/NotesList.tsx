import { component$ } from "@builder.io/qwik";

export type NoteListItem = {
  id: string;
  title: string;
  updated_at: string;
};

interface NotesListProps {
  notes: NoteListItem[];
  selectedNoteId?: string;
  onSelect$: (id: string) => void;
  onDelete$: (id: string) => void;
}

export const NotesList = component$<NotesListProps>(
  ({ notes, selectedNoteId, onSelect$, onDelete$ }) => (
    <ul
      class="notes-list"
      style={{
        padding: 0,
        margin: 0,
        listStyle: "none",
        width: "100%",
        flex: "1 1 auto",
      }}
    >
      {notes.length === 0 ? (
        <li
          style={{
            padding: "1rem",
            color: "var(--secondary-color)",
            fontStyle: "italic",
          }}
        >
          No notes found.
        </li>
      ) : (
        notes.map((note) => (
          <li
            key={note.id}
            class={"note-list-item" + (selectedNoteId === note.id ? " selected" : "")}
            style={{
              margin: 0,
              border: "1px solid var(--border-color)",
              borderRadius: "6px",
              marginBottom: "0.55rem",
              cursor: "pointer",
              background: selectedNoteId === note.id ? "var(--accent-color)" : "#fff",
              color: selectedNoteId === note.id ? "#fff" : "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.75rem 1rem",
              transition: "background 0.2s",
            }}
            onClick$={$(() => onSelect$(note.id))}
          >
            <div style={{ flex: "1 1 auto", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", fontWeight: 500 }}>
              {note.title || "(Untitled)"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span
                style={{
                  color: selectedNoteId === note.id ? "#fffada" : "#888",
                  fontSize: "0.85rem",
                  marginRight: "0.6rem"
                }}
              >
                {new Date(note.updated_at).toLocaleString()}
              </span>
              <button
                aria-label="Delete note"
                style={{
                  background: "transparent",
                  border: "none",
                  color: selectedNoteId === note.id ? "#fff" : "var(--secondary-color)",
                  fontSize: "1.08rem",
                  cursor: "pointer",
                  padding: "0",
                  margin: "0 0 0 2px",
                  opacity: 0.75
                }}
                onClick$={$((e) => { e.stopPropagation(); onDelete$(note.id); })}
              >
                🗑️
              </button>
            </div>
          </li>
        ))
      )}
    </ul>
  )
);

export default NotesList;
