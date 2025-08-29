import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import NoteItem from '../components/NoteItem';

const Dashboard = () => {
  const [notes, setNotes] = useState<{ _id: string, content: string }[]>([]);
  const [newNote, setNewNote] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    fetchNotes();
  }, [navigate]);

  const fetchNotes = async () => {
    try {
      const res = await api.get('/notes');
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateNote = async () => {
    if (!newNote.trim()) return;
    try {
      const res = await api.post('/notes', { content: newNote });
      setNotes([res.data, ...notes]);
      setNewNote('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating note');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter(note => note._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error deleting note');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome to Your Notes</h2>
      <button onClick={handleLogout}>Logout</button>
      <div>
        <textarea
          rows={3}
          placeholder="Write a new note..."
          value={newNote}
          onChange={e => setNewNote(e.target.value)}
        />
        <button onClick={handleCreateNote}>Add Note</button>
      </div>
      <ul>
        {notes.map(note => (
          <NoteItem key={note._id} note={note} onDelete={handleDelete} />
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
