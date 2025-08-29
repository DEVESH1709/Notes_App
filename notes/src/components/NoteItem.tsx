interface Props {
  note: { _id: string; content: string };
  onDelete: (id: string) => void;
}

const NoteItem = ({ note, onDelete }: Props) => {
  return (
    <li className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 mb-3 border border-gray-200 hover:shadow-lg transition">
      <p className="text-gray-800 text-base">{note.content}</p>
      <button
        onClick={() => onDelete(note._id)}
        className="ml-4 px-3 py-1 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
      >
        Delete
      </button>
    </li>
  );
};

export default NoteItem;
