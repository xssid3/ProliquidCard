import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CardState } from '@/types/card';
import { GRADIENTS } from '@/data/gradients';
import GlassCard from './GlassCard';

interface CardCanvasProps {
  cardState: CardState;
  setCardState: React.Dispatch<React.SetStateAction<CardState>>;
  canvasRef: React.RefObject<HTMLDivElement>;
}

const ASPECT_RATIO_DIMS: Record<string, { w: number; h: number }> = {
  '1:1': { w: 560, h: 560 },
  '16:9': { w: 700, h: 394 },
  '9:16': { w: 360, h: 640 },
  '4:5': { w: 480, h: 600 },
};

const CardCanvas: React.FC<CardCanvasProps> = ({ cardState, setCardState, canvasRef }) => {
  const gradient = GRADIENTS[cardState.gradientIndex];
  const { w, h } = ASPECT_RATIO_DIMS[cardState.aspectRatio];
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        let { width, height } = entry.contentRect;

        // Safety margin (padding)
        const padding = 32;
        width -= padding;
        height -= padding;

        if (width <= 0 || height <= 0) continue;

        const scaleX = width / w;
        const scaleY = height / h;

        // Cap scale to prevent becoming extremely huge on ultrawides, but allow some scaling up
        let newScale = Math.min(scaleX, scaleY);
        newScale = Math.min(newScale, 1.2);

        setScale(newScale);
      }
    });

    observer.observe(containerRef.current);

    // Quick strictly-initial trigger after render
    setTimeout(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        let width = rect.width - 32;
        let height = rect.height - 32;
        if (width > 0 && height > 0) {
          setScale(Math.min(Math.min(width / w, height / h), 1.2));
        }
      }
    }, 10);

    return () => observer.disconnect();
  }, [w, h, cardState.aspectRatio]);

  const backgroundStyle: React.CSSProperties = cardState.backgroundImage
    ? {
      backgroundImage: `url(${cardState.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
    : { background: gradient.css };

  return (
    <div ref={containerRef} className="flex-1 w-full h-full flex items-center justify-center min-h-0 overflow-hidden relative">
      <div
        className="relative flex items-center justify-center pointer-events-none"
        style={{
          width: w * scale,
          height: h * scale
        }}
      >
        <motion.div
          ref={canvasRef}
          className="absolute top-0 left-0 rounded-3xl overflow-hidden shadow-2xl pointer-events-auto origin-top-left"
          style={{
            width: w,
            height: h,
            ...backgroundStyle,
            transform: `scale(${scale})`
          }}
          initial={{ opacity: 0, scale: scale * 0.95 }}
          animate={{ opacity: 1, scale: scale }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          key={cardState.aspectRatio}
        >
          {/* Animated gradient overlay for depth */}
          {!cardState.backgroundImage && (
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(255,255,255,0.08) 0%, transparent 50%)',
              }}
            />
          )}

          {/* Centered glass card */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <GlassCard cardState={cardState} setCardState={setCardState} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CardCanvas;
