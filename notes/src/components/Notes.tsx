import { useEffect, useState } from "react";
import axios from "axios";

interface Note {
  _id: string;
  content: string;
  createdAt: string;
}

interface NotesProps {
  token: string; 
}

const Notes = ({ token }: NotesProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { Authorization: `Bearer ${token}` },
  });


  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const res = await api.get("/notes");
        setNotes(res.data);
      } catch (error) {
        console.error("Error fetching notes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      const res = await api.post("/notes", { content: newNote });
      setNotes([res.data, ...notes]);
      setNewNote("");
    } catch (error) {
      console.error("Error adding note", error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Error deleting note", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Your Notes</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a note..."
          className="flex-grow border rounded px-2 py-1"
        />
        <button
          onClick={handleAddNote}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {loading ? (
        <p>Loading notes...</p>
      ) : (
        <ul className="space-y-2">
          {notes.map((note) => (
            <li
              key={note._id}
              className="flex justify-between items-center border rounded px-3 py-2"
            >
              <span>{note.content}</span>
              <button
                onClick={() => handleDeleteNote(note._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notes;
