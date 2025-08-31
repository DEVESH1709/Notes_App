import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import NoteItem from "../components/NoteItem";
import logo2 from "../assets/top (2).png";

interface User {
  name: string;
  email: string;
}

const Dashboard = () => {
  const [notes, setNotes] = useState<{ _id: string; content: string }[]>([]);
  const [newNote, setNewNote] = useState("");
  const [showTextarea, setShowTextarea] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }

    fetchUserData();
    fetchNotes();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const res = await api.get("/api/auth/me");
      console.log("User data:", res.data); 
      setUser({
        name: res.data.name,
        email: res.data.email
      });
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

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
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
  <div className="h-screen w-screen flex flex-col bg-gray-50">
    <div className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <div className="flex items-center space-x-2">
        <img src={logo2} alt="Dashboard Logo" className="w-10 h-8" />
        <h1 className="text-lg font-bold">Dashboard</h1>
      </div>
      <button
        onClick={handleLogout}
        className="text-blue-600 font-medium cursor-pointer"
      >
        Sign Out
      </button>
    </div>

    <div className="w-full max-w-md mx-auto mt-6 p-4 bg-white shadow-md rounded-2xl">
      <h1 className="text-lg font-semibold">
        Welcome, {user?.name || "User"}!
      </h1>
      {user?.email && (
        <p className="text-sm text-gray-600">Email: {user.email}</p>
      )}
    </div>

    <div className="w-full max-w-md mx-auto mt-4 p-4">
      <button
        onClick={() => setShowTextarea(true)}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition cursor-pointer"
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
              className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 cursor-pointer hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNote}
              className="px-4 py-2 rounded-xl bg-blue-600 cursor-pointer text-white hover:bg-blue-700"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
    )}

    <div className="w-full max-w-3/2 mx-auto mt-4 p-4">
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
