import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CardState } from '@/types/card';
import * as LucideIcons from 'lucide-react';

interface GlassCardProps {
  cardState: CardState;
  setCardState: React.Dispatch<React.SetStateAction<CardState>>;
}

const EditableText: React.FC<{
  value: string;
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
  multiLine?: boolean;
}> = ({ value, onChange, className = '', placeholder = 'Click to edit…', multiLine = false }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value;
    }
  }, [value]);

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onChange(e.currentTarget.innerText)}
      data-placeholder={placeholder}
      className={`outline-none cursor-text focus:ring-0 relative ${className}`}
      style={{ whiteSpace: multiLine ? 'pre-wrap' : 'nowrap', minWidth: 20 }}
    />
  );
};

const GlassCard: React.FC<GlassCardProps> = ({ cardState, setCardState }) => {
  const { template, glassMode, selectedIcon } = cardState;

  const glassBg = glassMode === 'light'
    ? 'bg-white/20 border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.18)]'
    : 'bg-black/40 border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)]';

  const textColor = 'text-white';
  const subTextColor = 'text-white/70';
  const subPanelBg = glassMode === 'light'
    ? 'bg-white/10 border-white/20'
    : 'bg-black/15 border-white/10';

  // Render selected icon
  const IconComponent = selectedIcon
    ? (LucideIcons as unknown as Record<string, React.FC<{ size: number; strokeWidth: number; className: string }>>)[selectedIcon]
    : null;

  const updateCard = (patch: Partial<CardState>) =>
    setCardState((prev) => ({ ...prev, ...patch }));

  return (
    <motion.div
      layout
      className={`relative w-full h-full rounded-2xl border backdrop-blur-3xl ${glassBg} p-7 flex flex-col overflow-hidden`}
      style={{ fontFamily: cardState.fontFamily }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      key={template}
    >
      {/* Subtle inner highlight at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      {/* Icon badge */}
      {IconComponent && (
        <div className="absolute top-4 right-4 opacity-70">
          <IconComponent size={22} strokeWidth={1.5} className={textColor} />
        </div>
      )}

      {/* === QUOTE TEMPLATE === */}
      {template === 'quote' && (
        <div className="flex flex-col flex-1 items-center justify-center text-center gap-4">
          <span className="text-7xl leading-none text-white/30 font-serif select-none">"</span>
          <EditableText
            value={cardState.quoteText}
            onChange={(v) => updateCard({ quoteText: v })}
            className={`text-2xl font-light leading-relaxed ${textColor} -mt-6`}
            placeholder="Your quote here…"
            multiLine
          />
          <div className="w-12 h-px bg-white/30 mt-2" />
          <EditableText
            value={cardState.quoteAuthor}
            onChange={(v) => updateCard({ quoteAuthor: v })}
            className={`text-sm tracking-widest uppercase ${subTextColor}`}
            placeholder="— Author"
          />
        </div>
      )}

      {/* === Q&A TEMPLATE === */}
      {template === 'qa' && (
        <div className="flex flex-col flex-1 gap-4 justify-center">
          <div className={`rounded-xl border ${subPanelBg} backdrop-blur-sm p-4`}>
            <p className={`text-xs font-bold tracking-widest uppercase mb-2 ${subTextColor}`}>Question</p>
            <EditableText
              value={cardState.questionText}
              onChange={(v) => updateCard({ questionText: v })}
              className={`text-lg font-medium ${textColor}`}
              placeholder="What is your question?"
              multiLine
            />
          </div>
          <div className={`rounded-xl border ${subPanelBg} backdrop-blur-sm p-4 flex-1`}>
            <p className={`text-xs font-bold tracking-widest uppercase mb-2 ${subTextColor}`}>Answer</p>
            <EditableText
              value={cardState.answerText}
              onChange={(v) => updateCard({ answerText: v })}
              className={`text-base ${textColor} leading-relaxed`}
              placeholder="Type the answer here…"
              multiLine
            />
          </div>
        </div>
      )}

      {/* === IMAGE + TEXT TEMPLATE === */}
      {template === 'image-text' && (
        <div className={`flex flex-1 gap-5 ${cardState.imagePosition === 'top'
          ? 'flex-col items-center justify-center text-center'
          : cardState.imagePosition === 'right'
            ? `flex-row-reverse ${cardState.imageShape === 'rect' ? 'items-stretch' : 'items-center'}`
            : `flex-row ${cardState.imageShape === 'rect' ? 'items-stretch' : 'items-center'}`
          }`}>
          {/* Image container */}
          <div
            className={`relative flex-shrink-0 overflow-hidden border ${subPanelBg} flex items-center justify-center cursor-pointer group transition-all duration-300 ${cardState.imagePosition === 'top'
              ? cardState.imageShape === 'circle' ? 'w-32 h-32 rounded-full' : cardState.imageShape === 'square' ? 'w-32 h-32 rounded-xl' : 'w-full h-40 rounded-xl'
              : cardState.imageShape === 'circle' ? 'w-1/3 aspect-square rounded-full' : cardState.imageShape === 'square' ? 'w-1/3 aspect-square rounded-xl' : 'w-2/5 rounded-xl'
              }`}
            onClick={() => document.getElementById('card-image-upload')?.click()}
          >
            {cardState.cardImage ? (
              <img src={cardState.cardImage} alt="card" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-white/40 group-hover:text-white/60 transition-colors p-4 text-center w-full h-full">
                <LucideIcons.ImageIcon size={28} strokeWidth={1} />
                <p className="text-xs">Image</p>
              </div>
            )}
          </div>

          {/* Text area */}
          <div className={`flex flex-col flex-1 justify-center gap-3 ${cardState.imagePosition === 'top' ? 'items-center' : ''}`}>
            <EditableText
              value={cardState.imageTitle}
              onChange={(v) => updateCard({ imageTitle: v })}
              className={`text-xl font-semibold ${textColor} leading-snug`}
              placeholder="Title"
              multiLine
            />
            <div className="w-8 h-0.5 bg-white/40" />
            <EditableText
              value={cardState.imageDescription}
              onChange={(v) => updateCard({ imageDescription: v })}
              className={`text-sm ${subTextColor} leading-relaxed`}
              placeholder="Description text…"
              multiLine
            />
          </div>
        </div>
      )}

      {/* Bottom right Brand Name area inside glass */}
      <div className="absolute right-6 bottom-5 opacity-50 hover:opacity-100 transition-opacity z-10 flex items-center justify-end">
        <EditableText
          value={cardState.brandName}
          onChange={(v) => updateCard({ brandName: v })}
          className={`text-[11px] uppercase tracking-[0.2em] font-medium ${textColor} text-right`}
          placeholder="Brand Name"
        />
      </div>

      {/* Bottom shine */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </motion.div>
  );
};

export default GlassCard;
