import { component$, useSignal } from "@builder.io/qwik";

interface NotesEditorProps {
  note: { id?: string; title: string; content: string };
  onSave$: (note: { id?: string; title: string; content: string }) => void;
  onCancel$: () => void;
  onDelete$?: () => void;
}

export const NotesEditor = component$<NotesEditorProps>(
  ({ note, onSave$, onCancel$, onDelete$ }) => {
    const titleSig = useSignal(note.title);
    const contentSig = useSignal(note.content);

    // Update signals if the note prop changes.
    if (note.title !== titleSig.value) titleSig.value = note.title;
    if (note.content !== contentSig.value) contentSig.value = note.content;

    return (
      <form
        class="notes-editor"
        style={{
          width: "100%",
          maxWidth: "720px",
          margin: "2rem auto 0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
        preventdefault:submit
        onSubmit$={$((e) => {
          e.preventDefault?.();
          onSave$({ id: note.id, title: titleSig.value, content: contentSig.value });
        })}
      >
        <input
          type="text"
          placeholder="Title"
          value={titleSig.value}
          onInput$={e => (titleSig.value = (e.target as HTMLInputElement).value)}
          class="editor-title"
          style={{
            fontSize: "1.32rem",
            fontWeight: "bold",
            padding: "0.5rem 1rem",
            border: "1px solid var(--input-border)",
            borderRadius: "6px",
            background: "var(--input-bg)",
            width: "100%",
            outline: "none"
          }}
        />
        <textarea
          placeholder="Type your note here..."
          value={contentSig.value}
          onInput$={e => (contentSig.value = (e.target as HTMLTextAreaElement).value)}
          class="editor-content"
          rows={12}
          style={{
            fontSize: "1.08rem",
            fontFamily: "inherit",
            padding: "0.56rem 1rem",
            border: "1px solid var(--input-border)",
            borderRadius: "6px",
            background: "var(--input-bg)",
            width: "100%",
            resize: "vertical",
            outline: "none"
          }}
        />
        <div style={{ display: "flex", gap: "0.7rem", marginTop: "0.5rem" }}>
          <button
            type="submit"
            style={{
              background: "var(--primary-color)",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "0.55rem 1.25rem",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Save
          </button>
          <button
            type="button"
            style={{
              background: "#fff",
              color: "var(--primary-color)",
              border: "1px solid var(--primary-color)",
              borderRadius: "6px",
              padding: "0.55rem 1.25rem",
              cursor: "pointer",
              fontSize: "1rem",
            }}
            onClick$={$(() => onCancel$())}
          >
            Cancel
          </button>
          {note.id && onDelete$ && (
            <button
              type="button"
              style={{
                background: "var(--accent-color)",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "0.55rem 1.25rem",
                cursor: "pointer",
                fontSize: "1rem",
                marginLeft: "auto",
              }}
              onClick$={$(() => onDelete$())}
            >
              Delete
            </button>
          )}
        </div>
      </form>
    );
  }
);

export default NotesEditor;
