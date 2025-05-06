import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  addDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import MeetCard from '../components/MeetCard';
import MeetForm from '../components/MeetForm';
import Modal from '../components/Modal';

export interface Meet {
  id: string;
  name: string;
  date: string;
  location?: string;
}

export default function MeetsPage() {
  const [meets, setMeets] = useState<Meet[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMeet, setEditingMeet] = useState<Meet | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchMeets();
  }, []);

  async function fetchMeets() {
    const snapshot = await getDocs(collection(db, 'meets'));
    const results = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as Meet[];
    setMeets(results);
  }

  async function handleUpdate(id: string, updated: Partial<Meet>) {
    await updateDoc(doc(db, 'meets', id), updated);
    setMeets((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updated } : m))
    );
    setToast('✅ Meet updated!');
    setModalOpen(false);
    setEditingMeet(null);
  }

  async function handleCreate(data: Partial<Meet>) {
    await addDoc(collection(db, 'meets'), data);
    fetchMeets();
    setToast('✅ Meet added!');
    setModalOpen(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this meet?')) return;
    await deleteDoc(doc(db, 'meets', id));
    setMeets((prev) => prev.filter((m) => m.id !== id));
    setToast('🗑️ Meet deleted!');
  }

  return (
    <div className="max-w-4xl w-full relative">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow z-50">
          {toast}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Track Meets</h1>
        <button
          onClick={() => {
            setEditingMeet(null);
            setModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          ➕ Add Meet
        </button>
      </div>

      <div className="space-y-4">
        {meets.length === 0 ? (
          <p className="text-gray-600 italic">No meets yet.</p>
        ) : (
          meets.map((meet) => (
            <MeetCard
              key={meet.id}
              meet={meet}
              onEdit={() => {
                setEditingMeet(meet);
                setModalOpen(true);
              }}
              onDelete={() => handleDelete(meet.id)}
            />
          ))
        )}
      </div>

      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingMeet(null);
          }}
        >
          <MeetForm
            initialData={editingMeet || undefined}
            onCancel={() => {
              setModalOpen(false);
              setEditingMeet(null);
            }}
            onSave={(data) => {
              if (editingMeet) {
                handleUpdate(editingMeet.id, data);
              } else {
                handleCreate(data);
              }
            }}
          />
        </Modal>
      )}
    </div>
  );
}
