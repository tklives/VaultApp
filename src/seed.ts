// src/seed.ts
import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  limit,
} from 'firebase/firestore';

export async function seedMeetsWithVaultersAndAttempts() {
  console.log('Starting seed...');

  // STEP 1: Fetch existing vaulters
  const vaulterSnapshot = await getDocs(query(collection(db, 'vaulters'), limit(3)));
  const vaulters = vaulterSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as { id: string; name: string; team?: string; pr?: string }[];

  if (vaulters.length === 0) {
    console.warn('No vaulters found. Add some to /vaulters first.');
    return;
  }

  // STEP 2: Create a new meet
  const meetRef = await addDoc(collection(db, 'meets'), {
    name: 'Seeded Test Meet',
    date: '2025-05-01',
    location: 'Test Facility',
  });

  console.log(`Added meet: ${meetRef.id}`);

  // STEP 3: Assign vaulters to meet and seed 2 attempts each
  for (const vaulter of vaulters) {
    const assignedVaulterRef = await addDoc(
      collection(db, 'meets', meetRef.id, 'assignedVaulters'),
      {
        vaulterId: vaulter.id,
        name: vaulter.name,
        team: vaulter.team || '',
        pr: vaulter.pr || '',
      }
    );

    console.log(`Assigned vaulter ${vaulter.name}`);

    // Add 2 attempts per vaulter
    const attempts = [
      {
        height: "10'6\"",
        result: 'make',
        grip: '13',
        takeoff: 'left',
        startMark: '72',
        standards: '80',
        comments: 'Clean jump',
      },
      {
        height: "11'0\"",
        result: 'miss',
        grip: '13',
        takeoff: 'left',
        startMark: '72',
        standards: '80',
        comments: 'Bar clipped on way down',
      },
    ];

    for (const attempt of attempts) {
      await addDoc(
        collection(
          db,
          'meets',
          meetRef.id,
          'assignedVaulters',
          assignedVaulterRef.id,
          'attempts'
        ),
        attempt
      );
    }
  }

  console.log('Seeding complete ✅');
}

// You can now call `seedMeetsWithVaultersAndAttempts()` from a dev-only button or useEffect
