import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import NoteItem from "../components/NoteItem";
import logo2 from "../assets/top (2).png";

const Dashboard = () => {
  const [notes, setNotes] = useState<{ _id: string; content: string }[]>([]);
  const [newNote, setNewNote] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchNotes();
  }, [navigate]);

  const fetchNotes = async () => {
    try {
      const res = await api.get("/api/notes");
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateNote = async () => {
    if (!newNote.trim()) return;
    try {
      const res = await api.post("/api/notes", { content: newNote });
      setNotes([res.data, ...notes]);
      setNewNote("");
    } catch (err: any) {
      alert(err.response?.data?.message || "Error creating note");
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
          className="text-blue-600 font-medium hover:underline">
          Sign Out
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="w-full mb-6">
          <button
            onClick={handleCreateNote}
            className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Create Note
          </button>
        </div>
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Notes</h3>
          <ul className="space-y-3">
            {notes.map((note) => (
              <NoteItem key={note._id} note={note} onDelete={handleDelete} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
