import { useState } from 'react';
import { Meet } from '../pages/MeetsPage';

interface MeetFormProps {
  initialData?: Meet | null;
  onSave: (data: Omit<Meet, 'id'>) => void;
  onCancel: () => void;
}

export default function MeetForm({ initialData, onSave, onCancel }: MeetFormProps) {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    date: initialData?.date || '',
    location: initialData?.location || '',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">
        {initialData ? 'Edit Meet' : 'Add New Meet'}
      </h2>

      <input
        className="w-full border px-3 py-2 rounded"
        type="text"
        placeholder="Meet name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        required
      />

      <input
        className="w-full border px-3 py-2 rounded"
        type="date"
        value={form.date}
        onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
        required
      />

      <input
        className="w-full border px-3 py-2 rounded"
        type="text"
        placeholder="Location (optional)"
        value={form.location}
        onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
      />

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
}
