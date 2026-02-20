import React from 'react';
import { motion } from 'framer-motion';
import { CardTemplate } from '@/types/card';
import { Quote, MessageSquare, Image } from 'lucide-react';

interface TemplatePickerProps {
  selected: CardTemplate;
  onSelect: (t: CardTemplate) => void;
}

const TEMPLATES: { id: CardTemplate; label: string; icon: React.ReactNode; desc: string }[] = [
  {
    id: 'quote',
    label: 'Quote',
    icon: <Quote size={18} strokeWidth={1.5} />,
    desc: 'Elegant centered quote',
  },
  {
    id: 'qa',
    label: 'Q&A',
    icon: <MessageSquare size={18} strokeWidth={1.5} />,
    desc: 'Question and answer',
  },
  {
    id: 'image-text',
    label: 'Image + Text',
    icon: <Image size={18} strokeWidth={1.5} />,
    desc: 'Photo with caption',
  },
];

const TemplatePicker: React.FC<TemplatePickerProps> = ({ selected, onSelect }) => {
  return (
    <div className="flex flex-col gap-2">
      {TEMPLATES.map((t) => (
        <motion.button
          key={t.id}
          onClick={() => onSelect(t.id)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
            selected === t.id
              ? 'bg-white/20 border-white/40 text-white'
              : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white/90'
          }`}
        >
          <div className="flex-shrink-0">{t.icon}</div>
          <div>
            <p className="text-sm font-medium leading-none mb-0.5">{t.label}</p>
            <p className="text-xs opacity-60">{t.desc}</p>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default TemplatePicker;
