import { useState } from 'react';
import { Vaulter } from '../pages/VaultersPage';

interface Props {
  vaulter: Vaulter;
  onCancel: () => void;
  onSave: (updated: Partial<Vaulter>) => void;
}

export default function EditVaulterForm({ vaulter, onCancel, onSave }: Props) {
  const [name, setName] = useState(vaulter.name);
  const [team, setTeam] = useState(vaulter.team);
  const [pr, setPr] = useState(vaulter.pr);
  const [notes, setNotes] = useState(vaulter.notes ?? '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ name, team, pr, notes });
  }

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm space-y-2">
      <input
        className="w-full border px-3 py-1 rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        className="w-full border px-3 py-1 rounded"
        value={team}
        onChange={(e) => setTeam(e.target.value)}
        placeholder="Team"
      />
      <input
        className="w-full border px-3 py-1 rounded"
        value={pr}
        onChange={(e) => setPr(e.target.value)}
        placeholder="PR"
      />
      <textarea
        className="w-full border px-3 py-1 rounded"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes"
      />
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-black px-4 py-1 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
