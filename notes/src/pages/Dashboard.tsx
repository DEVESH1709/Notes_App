import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import NoteItem from "../components/NoteItem";
import logo2 from "../assets/top (2).png";

const Dashboard = () => {
  const [notes, setNotes] = useState<{ _id: string; content: string }[]>([]);
  const [newNote, setNewNote] = useState("");
  const [showTextarea, setShowTextarea] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchNotes();
  }, [navigate]);

  const handleSaveNote = async () => {
    if (!newNote.trim()) return;
    try {
      const res = await api.post("/api/notes", { content: newNote });
      setNotes([res.data, ...notes]);
      setNewNote("");
      setShowTextarea(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Error creating note");
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await api.get("/api/notes");
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/notes/${id}`);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Error deleting note");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      <div className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <div className="flex items-center space-x-2">
          <img src={logo2} alt="Dashboard Logo" className="w-8 h-8" />
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
        <button
          onClick={handleLogout}
          className="text-blue-600 font-medium cursor-pointer"
        >
          Sign Out
        </button>
      </div>
      <div className="flex flex-col gap-3 w-full max-w-md mx-auto mt-10 p-4 bg-white shadow-md rounded-2xl">
        <button
          onClick={() => setShowTextarea(true)}
          className="bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition"
        >
          Create Note
        </button>
      </div>

      {showTextarea && (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create a New Note</h2>
            <textarea
              rows={3}
              placeholder="Write a new note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowTextarea(false)}
                className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full mx-auto mt-6 p-4 bg-white rounded-2xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Notes</h3>
        <ul className="space-y-3">
          {notes.map((note) => (
            <NoteItem key={note._id} note={note} onDelete={handleDelete} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
