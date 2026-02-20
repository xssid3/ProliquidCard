import React from 'react';
import * as LucideIcons from 'lucide-react';
import { CARD_ICONS } from '@/data/icons';

interface IconPickerProps {
  selected: string | null;
  onSelect: (name: string | null) => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-6 gap-1.5">
      {/* None option */}
      <button
        onClick={() => onSelect(null)}
        title="No icon"
        className={`h-9 w-full rounded-lg border flex items-center justify-center transition-all duration-150 text-xs ${
          selected === null
            ? 'bg-white/25 border-white/50 text-white'
            : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/70'
        }`}
      >
        ✕
      </button>
      {CARD_ICONS.map((iconName) => {
        const Icon = (LucideIcons as unknown as Record<string, React.FC<{ size: number; strokeWidth: number }>>)[iconName];
        if (!Icon) return null;
        return (
          <button
            key={iconName}
            title={iconName}
            onClick={() => onSelect(selected === iconName ? null : iconName)}
            className={`h-9 w-full rounded-lg border flex items-center justify-center transition-all duration-150 ${
              selected === iconName
                ? 'bg-white/25 border-white/50 text-white'
                : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/70'
            }`}
          >
            <Icon size={14} strokeWidth={1.5} />
          </button>
        );
      })}
    </div>
  );
};

export default IconPicker;
