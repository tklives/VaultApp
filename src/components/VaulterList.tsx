interface Vaulter {
    id: string;
    name: string;
    team: string;
    pr: string;
    notes?: string;
  }
  
  interface VaulterListProps {
    vaulters: Vaulter[];
  }
  
  export default function VaulterList({ vaulters }: VaulterListProps) {
    if (vaulters.length === 0) return <p>No vaulters yet.</p>;
  
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Vaulters</h2>
        {vaulters.map((v) => (
          <div key={v.id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-bold">{v.name}</h3>
            <p className="text-sm text-gray-600">{v.team}</p>
            <p className="text-sm">PR: {v.pr}</p>
            {v.notes && <p className="text-sm italic text-gray-500">Notes: {v.notes}</p>}
          </div>
        ))}
      </div>
    );
  }
  