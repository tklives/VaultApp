// src/components/AddVaulterForm.tsx

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface Vaulter {
  id: string;
  name: string;
  team: string;
  pr: string;
  notes?: string;
}

interface AddVaulterFormProps {
  onSuccess: (newVaulter: Vaulter) => void;
}

export default function AddVaulterForm({ onSuccess }: AddVaulterFormProps) {
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [pr, setPr] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const docRef = await addDoc(collection(db, 'vaulters'), {
      name,
      team,
      pr,
      notes,
      createdAt: new Date().toISOString(),
    });

    const newVaulter = {
      id: docRef.id,
      name,
      team,
      pr,
      notes,
    };

    setName('');
    setTeam('');
    setPr('');
    setNotes('');
    setSubmitting(false);

    onSuccess(newVaulter);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <h2 className="text-xl font-semibold">Add New Vaulter</h2>

      <input
        className="w-full border px-3 py-2 rounded"
        type="text"
        placeholder={`Name`}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        className="w-full border px-3 py-2 rounded"
        type="text"
        placeholder={`Team`}
        value={team}
        onChange={(e) => setTeam(e.target.value)}
      />

      <input
        className="w-full border px-3 py-2 rounded"
        type="text"
        placeholder={`PR (e.g. 12'6")`}
        value={pr}
        onChange={(e) => setPr(e.target.value)}
      />

      <textarea
        className="w-full border px-3 py-2 rounded"
        placeholder={`Notes (optional)`}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={submitting}
      >
        {submitting ? 'Saving...' : 'Add Vaulter'}
      </button>
    </form>
  );
}
