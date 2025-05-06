interface DualFieldProps {
    value: { feet: number; inches: number };
    onUpdate: (newValue: { feet: number; inches: number; totalInches: number }) => void;
  }
  
  export default function DualField({ value, onUpdate }: DualFieldProps) {
    function updateFeet(feet: string) {
      const safeFeet = isNaN(parseFloat(feet)) ? 0 : parseFloat(feet);
      onUpdate({
        feet: safeFeet,
        inches: value.inches,
        totalInches: safeFeet * 12 + value.inches,
      });
    }
    
    function updateInches(inches: string) {
      const safeInches = isNaN(Number(inches)) ? 0 : Number(inches);
      onUpdate({
        feet: value.feet,
        inches: safeInches,
        totalInches: value.feet * 12 + safeInches,
      });
    }
    
  
    return (
      <div className="flex gap-1 items-center">
        <input
          type="number"
          min={0}
          value={value.feet ?? 0}
          onChange={(e) => updateFeet(e.target.value)}
          className="w-12 border rounded p-1 text-sm text-center"
          placeholder="ft"
        />
        <span className="text-sm">′</span>
        <input
          type="number"
          min={0}
          max={11}
          value={value.inches ?? 0}
          onChange={(e) => updateInches(e.target.value)}
          className="w-12 border rounded p-1 text-sm text-center"
          placeholder="in"
        />
        <span className="text-sm">″</span>
      </div>
    );
  }
  