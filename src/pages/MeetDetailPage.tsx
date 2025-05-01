import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { X, Trash } from 'lucide-react';
import { db } from '../firebase';
import {
    doc,
    getDoc,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
} from 'firebase/firestore';

interface Meet {
    id: string;
    name: string;
    date: string;
    location?: string;
}

interface Attempt {
    id: string;
    height: string;
    result: string;
    grip: string;
    takeoff: string;
    startMark: string;
    standards: string;
    comments: string;
}

interface AssignedVaulter {
    id: string;
    vaulterId: string;
    name: string;
    attempts?: Attempt[];
}



interface Vaulter {
    id: string;
    name: string;
}

export default function MeetDetailPage() {
    const { id: meetId } = useParams<{ id: string }>();

    if (!meetId) {
        return <div className="p-4">Invalid Meet ID.</div>;
    }
    const [meet, setMeet] = useState<Meet | null>(null);
    const [assignedVaulters, setAssignedVaulters] = useState<AssignedVaulter[]>([]);
    const [allVaulters, setAllVaulters] = useState<Vaulter[]>([]);

    useEffect(() => {
        if (meetId) {
            fetchMeet();
            fetchAssignedVaulters();
            fetchAllVaulters();
        }
    }, [meetId]);

    async function fetchMeet() {
        const snap = await getDoc(doc(db, 'meets', meetId!));
        if (snap.exists()) {
            setMeet({ id: snap.id, ...snap.data() } as Meet);
        }
    }

    async function fetchAssignedVaulters() {
        const snap = await getDocs(collection(db, 'meets', meetId!, 'assignedVaulters'));

        const list: AssignedVaulter[] = [];

        for (const docSnap of snap.docs) {
            const vaulterData = { id: docSnap.id, ...docSnap.data() } as AssignedVaulter;

            const attemptsSnap = await getDocs(
                collection(db, 'meets', meetId!, 'assignedVaulters', docSnap.id, 'attempts')
            );

            const attempts: Attempt[] = attemptsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Attempt[];

            vaulterData.attempts = attempts;
            list.push(vaulterData);
        }

        setAssignedVaulters(list);
    }


    async function fetchAllVaulters() {
        const snap = await getDocs(collection(db, 'vaulters'));
        const options = snap.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
        }));
        setAllVaulters(options);
    }

    async function assignVaulter(vaulterId: string) {
        const vaulter = allVaulters.find((v) => v.id === vaulterId);
        if (!vaulter) return;

        // Step 1: Assign the vaulter
        const vaulterDocRef = await addDoc(
            collection(db, 'meets', meetId!, 'assignedVaulters'),
            {
                vaulterId: vaulter.id,
                name: vaulter.name,
            }
        );

        // Step 2: Create a blank first attempt
        await addDoc(
            collection(db, 'meets', meetId!, 'assignedVaulters', vaulterDocRef.id, 'attempts'),
            {
                height: '',
                result: '',
                grip: '',
                takeoff: '',
                startMark: '',
                standards: '',
                comments: '',
            }
        );

        fetchAssignedVaulters();
    }

    async function addAttempt(assignedVaulterId: string) {
        await addDoc(
            collection(
                db,
                'meets',
                meetId!,
                'assignedVaulters',
                assignedVaulterId,
                'attempts'
            ),
            {
                height: '',
                result: '',
                grip: '',
                takeoff: '',
                startMark: '',
                standards: '',
                comments: '',
            }
        );

        fetchAssignedVaulters(); // Refresh UI with new attempt
    }

    async function deleteAttempt(assignedVaulterId: string, attemptId: string) {
        await deleteDoc(
            doc(
                db,
                'meets',
                meetId!,
                'assignedVaulters',
                assignedVaulterId,
                'attempts',
                attemptId
            )
        );

        fetchAssignedVaulters(); // Refresh to remove the row
    }


    async function handleUpdateAttempt(
        assignedVaulterId: string,
        attemptId: string,
        field: string,
        value: string
    ) {
        const attemptRef = doc(
            db,
            'meets',
            meetId!,
            'assignedVaulters',
            assignedVaulterId,
            'attempts',
            attemptId
        );

        await updateDoc(attemptRef, { [field]: value });
    }

    async function removeVaulter(assignedId: string) {
        await deleteDoc(doc(db, 'meets', meetId!, 'assignedVaulters', assignedId));
        fetchAssignedVaulters();
    }

    return (

        <div className="max-w-4xl w-full">
            {meet ? (
                <>
                    <h1 className="text-2xl font-bold text-blue-700 mb-2">{meet.name}</h1>
                    <p className="text-sm text-gray-600 mb-4">📅 {meet.date}</p>
                    {meet.location && (
                        <p className="text-sm text-gray-500 mb-6">📍 {meet.location}</p>
                    )}

                    <div className="mb-8">
                        <h3 className="text-md font-medium mb-1">Add Vaulter</h3>
                        <select
                            onChange={(e) => assignVaulter(e.target.value)}
                            className="border rounded px-3 py-1"
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select a vaulter...
                            </option>
                            {allVaulters
                                .filter(av => !assignedVaulters.some(assigned => assigned.vaulterId === av.id))
                                .map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="space-y-2 mb-6">
                        <h2 className="text-lg font-semibold mb-2">Vaulters</h2>
                        {assignedVaulters.map((vaulter) => (
                            <details key={vaulter.id} className="mb-4 border rounded">
                                <summary className="cursor-pointer px-4 py-2 font-semibold bg-blue-700 flex justify-between items-center">
                                    <h3 className="text-white text-xl">{vaulter.name}</h3>
                                    <button
                                        className="text-red-600 text-sm hover:underline"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm(`Remove ${vaulter.name} from this meet?`)) {
                                                removeVaulter(vaulter.id);
                                            }
                                        }}
                                    >
                                        <Trash size={28} className="transition-transform hover:scale-110 cursor-pointer" />
                                    </button>
                                </summary>


                                <div className="p-4">
                                    {vaulter.attempts && vaulter.attempts.length > 0 ? (
                                        <table className="w-full text-sm border mt-2">
                                            <thead>
                                                <tr className="bg-gray-200">
                                                    <th className="p-2 border">Height</th>
                                                    <th className="p-2 border">Result</th>
                                                    <th className="p-2 border">Start</th>
                                                    <th className="p-2 border">Grip</th>
                                                    <th className="p-2 border">Takeoff</th>
                                                    <th className="p-2 border">Standards</th>
                                                    <th className="p-2 border">Comments</th>
                                                    <th className="p-2 border w-8"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {vaulter.attempts.map((a) => (
                                                    <tr key={a.id}>
                                                        {['height', 'result', 'startMark', 'grip', 'takeoff', 'standards', 'comments'].map((field) => (
                                                            <td key={field} className="border p-1">
                                                                <input
                                                                    className="w-full p-1 text-sm border rounded"
                                                                    defaultValue={(a as any)[field]}
                                                                    onBlur={(e) => handleUpdateAttempt(vaulter.id, a.id, field, e.target.value)}
                                                                />
                                                            </td>
                                                        ))}
                                                        <td className="border text-center align-middle">
                                                            <button
                                                                onClick={() => {
                                                                    const confirmDelete = confirm('Are you sure you want to delete this attempt?');
                                                                    if (confirmDelete) {
                                                                        deleteAttempt(vaulter.id, a.id);
                                                                    }
                                                                }}
                                                                className="text-red-600 hover:text-red-700 p-1"
                                                                title="Delete attempt"
                                                            >
                                                                <Trash size={24} className="transition-transform hover:scale-110 cursor-pointer" />

                                                            </button>
                                                        </td>

                                                    </tr>
                                                ))}
                                            </tbody>


                                        </table>
                                    ) : (
                                        <p className="text-sm italic text-gray-500">No attempts yet.</p>
                                    )}
                                    <button
                                        onClick={() => addAttempt(vaulter.id)}
                                        className="mt-3 text-sm text-blue-600 hover:underline"
                                    >
                                        + Add Attempt
                                    </button>

                                </div>
                            </details>
                        ))}

                    </div>
                </>
            ) : (
                <p>Loading meet...</p>
            )}
        </div>
    );
}
