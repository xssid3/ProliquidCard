import React from 'react';
import { GRADIENTS } from '@/data/gradients';

interface GradientPickerProps {
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const GradientPicker: React.FC<GradientPickerProps> = ({ selectedIndex, onSelect }) => {
  return (
    <div className="grid grid-cols-4 gap-2">
      {GRADIENTS.map((g, i) => (
        <button
          key={i}
          title={g.name}
          onClick={() => onSelect(i)}
          className={`relative h-10 rounded-lg overflow-hidden transition-all duration-200 hover:scale-105 hover:shadow-lg ${
            selectedIndex === i
              ? 'ring-2 ring-white/80 ring-offset-1 ring-offset-transparent scale-105'
              : 'ring-1 ring-white/10'
          }`}
          style={{ background: g.css }}
        >
          {selectedIndex === i && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white shadow-lg" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default GradientPicker;
