export interface Note {
  id: string;
  title: string;
  content: string;
  updated_at: string;
}

const API_BASE = "/api/notes";

// PUBLIC_INTERFACE
export async function fetchNotes(search: string = ""): Promise<Note[]> {
  const resp = await fetch(
    search ? `${API_BASE}?search=${encodeURIComponent(search)}` : API_BASE
  );
  if (!resp.ok) throw new Error("Failed to fetch notes");
  return await resp.json();
}

// PUBLIC_INTERFACE
export async function fetchNote(id: string): Promise<Note> {
  const resp = await fetch(`${API_BASE}/${id}`);
  if (!resp.ok) throw new Error("Failed to fetch note");
  return await resp.json();
}

// PUBLIC_INTERFACE
export async function createNote(note: { title: string; content: string }): Promise<Note> {
  const resp = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  if (!resp.ok) throw new Error("Failed to create note");
  return await resp.json();
}

// PUBLIC_INTERFACE
export async function updateNote(
  id: string,
  note: { title: string; content: string }
): Promise<Note> {
  const resp = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  if (!resp.ok) throw new Error("Failed to update note");
  return await resp.json();
}

// PUBLIC_INTERFACE
export async function deleteNote(id: string): Promise<void> {
  const resp = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!resp.ok) throw new Error("Failed to delete note");
}
