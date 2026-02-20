import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { CardState } from '@/types/card';
import { GRADIENTS } from '@/data/gradients';
import GlassCard from './GlassCard';

interface CardCanvasProps {
  cardState: CardState;
  setCardState: React.Dispatch<React.SetStateAction<CardState>>;
  canvasRef: React.RefObject<HTMLDivElement>;
}

const ASPECT_RATIO_CLASSES: Record<string, string> = {
  '1:1': 'aspect-square',
  '16:9': 'aspect-video',
  '9:16': 'aspect-[9/16]',
  '4:5': 'aspect-[4/5]',
};

const ASPECT_RATIO_DIMS: Record<string, { maxW: string }> = {
  '1:1': { maxW: 'max-w-[560px]' },
  '16:9': { maxW: 'max-w-[700px]' },
  '9:16': { maxW: 'max-w-[360px]' },
  '4:5': { maxW: 'max-w-[480px]' },
};

const CardCanvas: React.FC<CardCanvasProps> = ({ cardState, setCardState, canvasRef }) => {
  const gradient = GRADIENTS[cardState.gradientIndex];
  const { maxW } = ASPECT_RATIO_DIMS[cardState.aspectRatio];

  const backgroundStyle: React.CSSProperties = cardState.backgroundImage
    ? {
        backgroundImage: `url(${cardState.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : { background: gradient.css };

  return (
    <div className="flex-1 flex items-center justify-center p-6 md:p-10 min-h-0">
      <motion.div
        ref={canvasRef}
        className={`relative w-full ${maxW} ${ASPECT_RATIO_CLASSES[cardState.aspectRatio]} rounded-3xl overflow-hidden shadow-2xl`}
        style={backgroundStyle}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
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
  );
};

export default CardCanvas;
