import { Vaulter } from '../pages/VaultersPage';

interface Props {
  vaulter: Vaulter;
  onEdit: () => void;
  onDelete: () => void;
}

export default function VaulterCard({ vaulter, onEdit, onDelete }: Props) {
  return (
    <div className="border p-4 rounded shadow-sm">
      <h3 className="text-lg font-bold">{vaulter.name}</h3>
      <p className="text-sm text-gray-600">{vaulter.team}</p>
      <p className="text-sm">PR: {vaulter.pr}</p>
      {vaulter.notes && (
        <p className="text-sm italic text-gray-500">Notes: {vaulter.notes}</p>
      )}

      <div className="mt-3 flex gap-4 text-sm">
        <button onClick={onEdit} className="text-blue-600 hover:underline">
          Edit
        </button>
        <button onClick={onDelete} className="text-red-600 hover:underline">
          Delete
        </button>
      </div>
    </div>
  );
}
