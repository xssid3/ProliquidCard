import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardState, AspectRatio, GlassMode } from '@/types/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import TemplatePicker from './TemplatePicker';
import GradientPicker from './GradientPicker';
import IconPicker from './IconPicker';
import ExportButton from './ExportButton';
import {
  Image, Upload, Square, Monitor, Smartphone, Crop,
  Sun, Moon, X, Layers, Palette, Grid3X3, Sparkles, Download,
} from 'lucide-react';

interface SidebarProps {
  cardState: CardState;
  setCardState: React.Dispatch<React.SetStateAction<CardState>>;
  canvasRef: React.RefObject<HTMLDivElement>;
}

const ASPECT_RATIOS: { value: AspectRatio; label: string; icon: React.ReactNode }[] = [
  { value: '1:1', label: '1:1', icon: <Square size={14} /> },
  { value: '16:9', label: '16:9', icon: <Monitor size={14} /> },
  { value: '9:16', label: '9:16', icon: <Smartphone size={14} /> },
  { value: '4:5', label: '4:5', icon: <Crop size={14} /> },
];

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({
  title, icon, children,
}) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-2">
      <span className="text-white/40">{icon}</span>
      <p className="text-xs font-semibold tracking-widest uppercase text-white/50">{title}</p>
    </div>
    {children}
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({ cardState, setCardState, canvasRef }) => {
  const bgUploadRef = useRef<HTMLInputElement>(null);
  const cardImgUploadRef = useRef<HTMLInputElement>(null);

  const update = (patch: Partial<CardState>) => setCardState((p) => ({ ...p, ...patch }));

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    update({ backgroundImage: url });
    e.target.value = '';
  };

  const handleCardImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    update({ cardImage: url });
    e.target.value = '';
  };

  return (
    <motion.aside
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-[280px] flex-shrink-0 flex flex-col h-full
        bg-white/8 backdrop-blur-2xl border-r border-white/10
        shadow-[inset_-1px_0_0_rgba(255,255,255,0.05)]"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
          >
            <Sparkles size={14} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">Liquid Glass</h1>
            <p className="text-[10px] text-white/40 tracking-wide">Card Generator</p>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-5 py-5 flex flex-col gap-6">

          {/* Template */}
          <Section title="Template" icon={<Layers size={13} />}>
            <TemplatePicker
              selected={cardState.template}
              onSelect={(t) => update({ template: t })}
            />
          </Section>

          <div className="h-px bg-white/8" />

          {/* Aspect Ratio */}
          <Section title="Aspect Ratio" icon={<Crop size={13} />}>
            <div className="grid grid-cols-4 gap-1.5">
              {ASPECT_RATIOS.map(({ value, label, icon }) => (
                <button
                  key={value}
                  onClick={() => update({ aspectRatio: value })}
                  className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg border text-xs transition-all ${
                    cardState.aspectRatio === value
                      ? 'bg-white/20 border-white/40 text-white'
                      : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/70'
                  }`}
                >
                  {icon}
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </Section>

          <div className="h-px bg-white/8" />

          {/* Glass Mode */}
          <Section title="Glass Mode" icon={<Sun size={13} />}>
            <div className="flex gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
              {(['light', 'dark'] as GlassMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => update({ glassMode: mode })}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all ${
                    cardState.glassMode === mode
                      ? 'bg-white/20 text-white'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {mode === 'light' ? <Sun size={12} /> : <Moon size={12} />}
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </Section>

          <div className="h-px bg-white/8" />

          {/* Background */}
          <Section title="Background" icon={<Palette size={13} />}>
            {/* Upload + Clear row */}
            <div className="flex gap-2">
              <button
                onClick={() => bgUploadRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs transition-all"
              >
                <Upload size={12} />
                Upload BG
              </button>
              {cardState.backgroundImage && (
                <button
                  onClick={() => update({ backgroundImage: null })}
                  className="py-2 px-3 rounded-lg border border-white/15 bg-white/5 hover:bg-red-500/20 hover:border-red-400/30 text-white/50 hover:text-red-300 text-xs transition-all"
                  title="Remove background image"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            <input ref={bgUploadRef} type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />

            {/* Gradient picker */}
            <GradientPicker
              selectedIndex={cardState.gradientIndex}
              onSelect={(i) => update({ gradientIndex: i, backgroundImage: null })}
            />
          </Section>

          {/* Card image upload — only for image-text template */}
          <AnimatePresence>
            {cardState.template === 'image-text' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="h-px bg-white/8 mb-6" />
                <Section title="Card Image" icon={<Image size={13} />}>
                  <div className="flex gap-2">
                    <button
                      onClick={() => cardImgUploadRef.current?.click()}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs transition-all"
                    >
                      <Upload size={12} />
                      Upload Photo
                    </button>
                    {cardState.cardImage && (
                      <button
                        onClick={() => update({ cardImage: null })}
                        className="py-2 px-3 rounded-lg border border-white/15 bg-white/5 hover:bg-red-500/20 hover:border-red-400/30 text-white/50 hover:text-red-300 text-xs transition-all"
                        title="Remove card image"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                  <input
                    id="card-image-upload"
                    ref={cardImgUploadRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCardImgUpload}
                  />
                </Section>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="h-px bg-white/8" />

          {/* Icon picker */}
          <Section title="Card Icon" icon={<Grid3X3 size={13} />}>
            <IconPicker
              selected={cardState.selectedIcon}
              onSelect={(name) => update({ selectedIcon: name })}
            />
          </Section>

          <div className="h-px bg-white/8" />

          {/* Export */}
          <Section title="Export" icon={<Download size={13} />}>
            <ExportButton canvasRef={canvasRef} />
          </Section>

          <div className="pb-4" />
        </div>
      </ScrollArea>
    </motion.aside>
  );
};

export default Sidebar;
