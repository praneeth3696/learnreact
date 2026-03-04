// ============================================================
//  App.jsx  –  React Frontend for Notes App
//  Place this in your  src/  folder
//  Your backend (server.js) must be running on port 5000
// ============================================================

import { useState, useEffect } from "react";
import "./App.css";

// The base URL of our Express backend
const API = "http://localhost:5000";

function App() {
  // ── State ───────────────────────────────────────────────────
  // notes        → array of all notes fetched from backend
  // title        → controlled input for note title
  // content      → controlled input for note content
  // editingId    → if not null, we are editing that note's id
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  // ── useEffect: runs once when component mounts ──────────────
  // Fetches all notes from backend on page load
  useEffect(() => {
    fetchNotes();
  }, []); // empty array = run only once

  // ============================================================
  //  FUNCTIONS  (each one calls a different backend route)
  // ============================================================

  // ── Fetch all notes  (GET /notes) ───────────────────────────
  async function fetchNotes() {
    const response = await fetch(`${API}/notes`);
    const data = await response.json();
    setNotes(data); // update state → React re-renders
  }

  // ── Add or Update a note  (POST or PUT) ─────────────────────
  async function handleSubmit() {
    if (!title || !content) {
      alert("Please fill in both title and content!");
      return;
    }

    if (editingId) {
      // ── UPDATE existing note  (PUT /notes/:id) ──────────────
      await fetch(`${API}/notes/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      setEditingId(null); // clear edit mode
    } else {
      // ── CREATE new note  (POST /notes) ──────────────────────
      await fetch(`${API}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
    }

    // Clear the input fields and refresh the list
    setTitle("");
    setContent("");
    fetchNotes();
  }

  // ── Load note into form for editing ─────────────────────────
  function handleEdit(note) {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  }

  // ── Delete a note  (DELETE /notes/:id) ──────────────────────
  async function handleDelete(id) {
    await fetch(`${API}/notes/${id}`, {
      method: "DELETE",
    });
    fetchNotes(); // refresh list after delete
  }

  // ── Cancel editing ───────────────────────────────────────────
  function handleCancel() {
    setEditingId(null);
    setTitle("");
    setContent("");
  }

  // ============================================================
  //  JSX  (what gets rendered on screen)
  // ============================================================
  return (
    <div className="app">
      <h1>📝 My Notes</h1>

      {/* ── FORM: Add / Edit note ── */}
      <div className="form">
        <h2>{editingId ? "✏️ Edit Note" : "➕ Add Note"}</h2>

        {/* Controlled input: value tied to state, onChange updates state */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />

        <div className="form-buttons">
          <button onClick={handleSubmit}>
            {editingId ? "Update Note" : "Save Note"}
          </button>
          {editingId && (
            <button onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ── LIST: All notes from backend ── */}
      <div className="notes-list">
        <h2>All Notes ({notes.length})</h2>

        {notes.length === 0 && <p>No notes yet. Add one above!</p>}

        {notes.map((note) => (
          // Each note gets a card. key= is required in React lists
          <div key={note.id} className="note-card">
            <h3>{note.title}</h3>
            <p>{note.content}</p>

            <div className="note-buttons">
              <button onClick={() => handleEdit(note)}>✏️ Edit</button>
              <button
                onClick={() => handleDelete(note.id)}
                className="delete-btn"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;