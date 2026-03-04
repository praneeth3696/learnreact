// ============================================================
//  server.js  –  Express Backend for Notes App
//  Run with:  node server.js
//  Make sure you did:  npm install express cors
// ============================================================

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// ── Middleware ────────────────────────────────────────────────
// cors()  → lets your React app (port 5173) talk to this server (port 5000)
// express.json() → lets us read JSON from request body
app.use(cors());
app.use(express.json());

// ── In-Memory "Database" ──────────────────────────────────────
// We store notes in a plain array (no real DB needed for exam)
// Each note: { id, title, content }
let notes = [];
let nextId = 1; // auto-increment ID counter

// ============================================================
//  ROUTES  (CRUD = Create, Read, Update, Delete)
// ============================================================

// ── GET /notes  →  Return ALL notes ──────────────────────────
app.get("/notes", (req, res) => {
  res.json(notes); // send the whole array as JSON
});

// ── GET /notes/:id  →  Return ONE note by id ─────────────────
app.get("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id); // :id comes from the URL
  const note = notes.find((n) => n.id === id);

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }
  res.json(note);
});

// ── POST /notes  →  CREATE a new note ────────────────────────
app.post("/notes", (req, res) => {
  const { title, content } = req.body; // data sent from React

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  const newNote = {
    id: nextId++,      // assign ID then increment
    title,
    content,
  };

  notes.push(newNote);              // add to our array
  res.status(201).json(newNote);    // 201 = Created
});

// ── PUT /notes/:id  →  UPDATE an existing note ───────────────
app.put("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;

  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Note not found" });
  }

  // Update only the fields that were sent
  notes[index] = { ...notes[index], title, content };
  res.json(notes[index]);
});

// ── DELETE /notes/:id  →  DELETE a note ──────────────────────
app.delete("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = notes.findIndex((n) => n.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Note not found" });
  }

  notes.splice(index, 1);           // remove 1 item at that index
  res.json({ message: "Note deleted" });
});

// ── Start the server ──────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});