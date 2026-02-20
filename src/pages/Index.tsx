import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardState } from '@/types/card';
import CardCanvas from '@/components/CardCanvas';
import Sidebar from '@/components/Sidebar';
import Credits from '@/components/Credits';
import ExportButton from '@/components/ExportButton';
import { BulkGenerator } from '@/components/BulkGenerator';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

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
  fontFamily: 'Inter',
  imagePosition: 'left',
  imageShape: 'rect',
  brandName: 'YourBrand',
};

const Index = () => {
  const [cardState, setCardState] = useState<CardState>(DEFAULT_STATE);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Conditionally render only one view to ensure canvasRef attaches correctly
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Global paste listener: Ctrl+V / Cmd+V
  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        const blob = item.getAsFile();
        if (!blob) continue;
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          if (!url) return;
          if (cardState.template === 'image-text') {
            setCardState((prev) => ({ ...prev, cardImage: url }));
          } else {
            setCardState((prev) => ({ ...prev, backgroundImage: url }));
          }
        };
        reader.readAsDataURL(blob);
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
    <div className="flex h-[100dvh] w-full overflow-hidden" style={{ fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif" }}>
      <Credits />
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

      <div className="relative flex w-full h-full z-10">

        {!isMobile ? (
          // {/* === DESKTOP LAYOUT === */}
          <div className="flex w-full h-full">
            <PanelGroup direction="horizontal">
              <Panel defaultSize={20} minSize={15} maxSize={40} className="h-full">
                <Sidebar cardState={cardState} setCardState={setCardState} canvasRef={canvasRef} className="!w-full" />
              </Panel>
              <PanelResizeHandle className="w-2 bg-black/20 hover:bg-purple-500/50 active:bg-purple-500 transition-colors cursor-col-resize z-50 flex items-center justify-center border-x border-white/5">
                <div className="w-0.5 h-8 bg-white/30 rounded-full" />
              </PanelResizeHandle>
              <Panel className="flex flex-col relative h-full">
                {/* Top Header for Export/Bulk Gen */}
                <div className="w-full shrink-0 border-b border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between px-6 py-3 z-[100]">
                  <ExportButton canvasRef={canvasRef}>
                    <BulkGenerator cardState={cardState} setCardState={setCardState} canvasRef={canvasRef} />
                  </ExportButton>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 flex items-center justify-center min-w-0 relative bg-black/5">
                  <CardCanvas cardState={cardState} setCardState={setCardState} canvasRef={canvasRef} />

                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 items-center gap-2 px-3 py-1.5 rounded-full text-white/30 text-xs backdrop-blur-sm border border-white/5 hidden xl:flex">
                    <kbd className="font-mono">⌘V</kbd>
                    <span>paste image as background</span>
                  </div>
                </div>
              </Panel>
            </PanelGroup>
          </div>
        ) : (
          // {/* === MOBILE LAYOUT === */}
          <div className="flex flex-col w-full h-full overflow-hidden">
            {/* Sticky Top Header */}
            <div className="w-full shrink-0 border-b border-white/10 bg-black/60 backdrop-blur-xl flex flex-col items-center px-4 py-3 gap-3 z-[100]">
              <div className="flex w-full items-center justify-center">
                <ExportButton canvasRef={canvasRef}>
                  <BulkGenerator cardState={cardState} setCardState={setCardState} canvasRef={canvasRef} />
                </ExportButton>
              </div>
            </div>

            {/* Always visible Canvas */}
            <div className="w-full shrink-0 flex items-center justify-center relative bg-black/20 overflow-hidden z-20 h-[38vh]">
              <CardCanvas cardState={cardState} setCardState={setCardState} canvasRef={canvasRef} />
            </div>

            {/* Scrollable Customization Menus below Canvas */}
            <div className="flex-1 overflow-y-auto w-full flex flex-col relative shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-20 bg-[#0d0d1a]">
              <Sidebar cardState={cardState} setCardState={setCardState} canvasRef={canvasRef} className="!w-full border-t border-white/10 rounded-t-3xl" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Index;
