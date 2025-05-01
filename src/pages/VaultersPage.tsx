import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import AddVaulterForm from '../components/AddVaulterForm';
import VaulterCard from '../components/VaulterCard';
import EditVaulterForm from '../components/EditVaulterForm';
import Modal from '../components/Modal';

export interface Vaulter {
  id: string;
  name: string;
  team: string;
  pr: string;
  notes?: string;
}

export default function VaultersPage() {
  const [vaulters, setVaulters] = useState<Vaulter[]>([]);
  const [editTarget, setEditTarget] = useState<Vaulter | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchVaulters();
  }, []);

  async function fetchVaulters() {
    const snapshot = await getDocs(collection(db, 'vaulters'));
    const results = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Vaulter[];
    setVaulters(results);
  }

  async function handleDelete(id: string) {
    const confirmed = confirm('Are you sure you want to delete this vaulter?');
    if (!confirmed) return;

    await deleteDoc(doc(db, 'vaulters', id));
    setVaulters((prev) => prev.filter((v) => v.id !== id));
    showToast('🗑️ Vaulter deleted');
  }

  async function handleUpdate(id: string, updated: Partial<Vaulter>) {
    await updateDoc(doc(db, 'vaulters', id), updated);
    setVaulters((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updated } : v))
    );
    setEditTarget(null);
  }

  function handleVaulterAdded(newVaulter: Vaulter) {
    setVaulters((prev) => [...prev, newVaulter]);
    setModalOpen(false);
    showToast('✅ Vaulter added!');
  }

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="max-w-4xl w-full relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow z-50">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Vaulters</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          + Add Vaulter
        </button>
      </div>

      <div className="space-y-4">
        {vaulters.length === 0 ? (
          <p className="text-gray-600">No vaulters yet.</p>
        ) : (
          vaulters.map((v) =>
            editTarget?.id === v.id ? (
              <EditVaulterForm
                key={v.id}
                vaulter={v}
                onCancel={() => setEditTarget(null)}
                onSave={(updated) => handleUpdate(v.id, updated)}
              />
            ) : (
              <VaulterCard
                key={v.id}
                vaulter={v}
                onEdit={() => setEditTarget(v)}
                onDelete={() => handleDelete(v.id)}
              />
            )
          )
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <AddVaulterForm onSuccess={handleVaulterAdded} />
      </Modal>
    </div>
  );
}
