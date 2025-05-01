import { useEffect, useState } from 'react';
import { seedMeetsWithVaultersAndAttempts } from '../seed';

export default function DevSeeder() {
  const [status, setStatus] = useState('Seeding...');

  useEffect(() => {
    seedMeetsWithVaultersAndAttempts()
      .then(() => setStatus('✅ Seeding complete.'))
      .catch((err) => {
        console.error(err);
        setStatus('❌ Seeding failed. Check console.');
      });
  }, []);

  return <div className="p-4 font-mono text-sm text-green-700">{status}</div>;
}
