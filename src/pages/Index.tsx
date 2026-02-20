import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardState } from '@/types/card';
import CardCanvas from '@/components/CardCanvas';
import Sidebar from '@/components/Sidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Settings2, Sparkles } from 'lucide-react';

const DEFAULT_STATE: CardState = {
  template: 'quote',
  aspectRatio: '1:1',
  glassMode: 'light',
  gradientIndex: 6, // Aurora
  backgroundImage: null,
  cardImage: null,
  quoteText: 'Design is not just what it looks like. Design is how it works.',
  quoteAuthor: '— Steve Jobs',
  questionText: 'What makes a great user experience?',
  answerText: 'A great UX is invisible — it removes friction and makes complex things feel effortlessly simple.',
  imageTitle: 'Creative Vision',
  imageDescription: 'Every pixel tells a story. Every detail shapes the experience.',
  selectedIcon: 'Sparkles',
};

const Index = () => {
  const [cardState, setCardState] = useState<CardState>(DEFAULT_STATE);
  const [mobileOpen, setMobileOpen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Global paste listener: Ctrl+V / Cmd+V
  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile();
        if (!blob) continue;
        const url = URL.createObjectURL(blob);
        if (cardState.template === 'image-text') {
          setCardState((prev) => ({ ...prev, cardImage: url }));
        } else {
          setCardState((prev) => ({ ...prev, backgroundImage: url }));
        }
        e.preventDefault();
        break;
      }
    }
  }, [cardState.template]);

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif" }}>
      {/* App background (dark, matches glass aesthetic) */}
      <div className="absolute inset-0 bg-[#0d0d1a]" />

      {/* Subtle ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #ec4899, transparent 70%)' }}
        />
      </div>

      {/* === DESKTOP LAYOUT === */}
      <div className="relative flex w-full h-full z-10">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex h-full">
          <Sidebar cardState={cardState} setCardState={setCardState} canvasRef={canvasRef} />
        </div>

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center min-w-0 relative">
          <CardCanvas cardState={cardState} setCardState={setCardState} canvasRef={canvasRef} />

          {/* Mobile settings trigger */}
          <div className="md:hidden absolute bottom-6 right-6">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl text-white text-sm font-semibold shadow-2xl backdrop-blur-xl"
                  style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.8), rgba(236,72,153,0.8))', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  <Settings2 size={16} />
                  Customize
                </motion.button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="h-[80vh] p-0 border-t border-white/10 overflow-hidden"
                style={{ background: 'rgba(13,13,26,0.95)', backdropFilter: 'blur(24px)' }}
              >
                <div className="flex h-full">
                  <Sidebar cardState={cardState} setCardState={setCardState} canvasRef={canvasRef} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Paste hint overlay */}
          <div className="hidden md:flex absolute bottom-5 left-1/2 -translate-x-1/2 items-center gap-2 px-3 py-1.5 rounded-full text-white/30 text-xs backdrop-blur-sm border border-white/5">
            <kbd className="font-mono">⌘V</kbd>
            <span>paste image as background</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
