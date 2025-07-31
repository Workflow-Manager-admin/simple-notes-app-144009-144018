import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { NotesList } from "../components/NotesList";
import type { NoteListItem } from "../components/NotesList";
import { NotesEditor } from "../components/NotesEditor";
import * as notesApi from "../api/notesApi";

// PUBLIC_INTERFACE
export default component$(() => {
  const notes = useSignal<NoteListItem[]>([]);
  const selectedNoteId = useSignal<string | undefined>(undefined);
  const editingNote = useSignal<{ id?: string; title: string; content: string } | null>(null);
  const searchText = useSignal("");
  const isLoading = useSignal(false);
  const error = useSignal<string | null>(null);

  // Fetch notes, re-run on search
  useVisibleTask$(async ({ track }) => {
    track(() => searchText.value);
    isLoading.value = true;
    error.value = null;
    try {
      notes.value = await notesApi.fetchNotes(searchText.value);
    } catch (e: any) {
      error.value = e?.message || "Error loading notes";
    }
    isLoading.value = false;
  });

  // Fetch note on selection
  const handleSelectNote = $((id: string) => {
    isLoading.value = true;
    notesApi.fetchNote(id)
      .then(note => {
        editingNote.value = note;
        selectedNoteId.value = id;
      })
      .catch((e: any) => {
        error.value = e?.message || "Error loading note";
      })
      .finally(() => { isLoading.value = false; });
  });

  // Create new note UI
  const handleCreateNote = $(() => {
    editingNote.value = { title: "", content: "" };
    selectedNoteId.value = undefined;
  });

  // Save handler (create or update)
  const handleSaveNote = $((note: { id?: string; title: string; content: string }) => {
    isLoading.value = true;
    (async () => {
      try {
        if (note.id) {
          await notesApi.updateNote(note.id, note);
        } else {
          const created = await notesApi.createNote(note);
          editingNote.value = created;
          selectedNoteId.value = created.id;
        }
        notes.value = await notesApi.fetchNotes(searchText.value);
        if (note.id) {
          const updated = await notesApi.fetchNote(note.id);
          editingNote.value = updated;
        }
      } catch (e: any) {
        error.value = e?.message || "Failed to save note";
      }
      isLoading.value = false;
    })();
  });
  // Delete handler
  const handleDeleteNote = $((idOrNone?: string) => {
    const noteId = idOrNone ?? editingNote.value?.id;
    if (!noteId) return;
    if (!(typeof window !== "undefined" && window.confirm("Delete this note?"))) return;
    isLoading.value = true;
    (async () => {
      try {
        await notesApi.deleteNote(noteId);
        notes.value = await notesApi.fetchNotes(searchText.value);
        editingNote.value = null;
        selectedNoteId.value = undefined;
      } catch (e: any) {
        error.value = e?.message || "Failed to delete note";
      }
      isLoading.value = false;
    })();
  });

  // When typing in search box
  const onSearchInput = $((event: Event) => {
    searchText.value = (event.target as HTMLInputElement).value;
  });

  // When cancel on editor
  const onCancelEdit = $(() => {
    editingNote.value = null;
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar>
        <NotesList
          notes={notes.value}
          selectedNoteId={selectedNoteId.value}
          onSelect$={$((id: string) => handleSelectNote(id))}
          onDelete$={$((id: string) => handleDeleteNote(id))}
        />
      </Sidebar>
      <div style={{ flex: "1 1 auto", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header
          searchValue={searchText.value}
          onSearchInput$={$((event: Event) => onSearchInput(event))}
          onCreateNote$={$(() => handleCreateNote())}
        />
        <main style={{ flex: "1 1 auto", background: "var(--background-color)", padding: "2rem 3vw", overflow: "auto" }}>
          {isLoading.value && <div style={{ color: "var(--primary-color)" }}>Loading...</div>}
          {error.value && <div style={{ color: "#d32f2f", marginBottom: "1.3rem" }}>{error.value}</div>}
          {editingNote.value ? (
            <NotesEditor
              note={editingNote.value}
              onSave$={handleSaveNote}
              onCancel$={onCancelEdit}
              onDelete$={
                editingNote.value && editingNote.value.id
                  ? () => handleDeleteNote(editingNote.value.id)
                  : undefined
              }
            />
          ) : notes.value.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: "3rem", color: "var(--secondary-color)" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.8rem" }}>
                No notes found
              </div>
              <button
                style={{
                  background: "var(--accent-color)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.7rem 1.6rem",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  boxShadow: "0 1px 5px rgba(31,41,55,0.08)",
                }}
                onClick$={$(() => handleCreateNote())}
              >
                + Create Your First Note
              </button>
            </div>
          ) : selectedNoteId.value ? (
            <div style={{ color: "var(--secondary-color)", margin: "2rem auto", maxWidth: "650px" }}>
              <div style={{ fontSize: "1.7rem", fontWeight: 600, marginBottom: "1.2rem" }}>
                Select a note from the sidebar or create a new one.
              </div>
            </div>
          ) : (
            <div style={{ color: "var(--secondary-color)", margin: "2rem auto", maxWidth: "650px" }}>
              <div style={{ fontSize: "1.7rem", fontWeight: 600, marginBottom: "1.2rem" }}>
                Select a note from the sidebar or create a new one.
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Simple Notes",
  meta: [
    {
      name: "description",
      content: "A minimalistic notes app built with Qwik.",
    },
  ],
};
