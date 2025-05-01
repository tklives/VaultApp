import { useNavigate } from 'react-router-dom';
import { Meet } from '../pages/MeetsPage';

interface MeetCardProps {
  meet: Meet;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MeetCard({ meet, onEdit, onDelete }: MeetCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/meets/${meet.id}`)}
      className="border p-4 rounded shadow-sm hover:bg-gray-100 cursor-pointer transition"
    >
      <h2 className="text-lg font-bold">{meet.name}</h2>
      <p className="text-sm text-gray-600">📅 {meet.date}</p>
      {meet.location && (
        <p className="text-sm text-gray-500">📍 {meet.location}</p>
      )}

      <div className="mt-3 flex gap-4 text-sm">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="text-blue-600 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
