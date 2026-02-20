import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2 } from 'lucide-react';
import { toPng, toJpeg } from 'html-to-image';
import { ExportFormat } from '@/types/card';

interface ExportButtonProps {
  canvasRef: React.RefObject<HTMLDivElement>;
  children?: React.ReactNode;
}

const ExportButton: React.FC<ExportButtonProps> = ({ canvasRef, children }) => {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [resolution, setResolution] = useState<number>(2);
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setLoading(true);
    try {
      const opts = {
        cacheBust: true,
        pixelRatio: resolution,
        skipFonts: true,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        }
      };

      // small delay to ensure any layout transitions have fully stopped
      await new Promise(r => setTimeout(r, 100));

      let dataUrl: string;
      if (format === 'png') {
        dataUrl = await toPng(canvasRef.current, opts);
      } else {
        dataUrl = await toJpeg(canvasRef.current, { ...opts, quality: 0.95 });
      }
      const link = document.createElement('a');
      link.download = `liquid-glass-card.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
      {/* Format toggle */}
      <div className="flex gap-1 p-1 rounded-lg bg-white/5 border border-white/10 shrink-0">
        {(['png', 'jpg'] as ExportFormat[]).map((f) => (
          <button
            key={f}
            onClick={() => setFormat(f)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide uppercase transition-all ${format === f
              ? 'bg-white/20 text-white'
              : 'text-white/40 hover:text-white/70'
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Resolution Selection */}
      <select
        value={resolution}
        onChange={(e) => setResolution(Number(e.target.value))}
        className="bg-black/40 border border-white/10 text-white text-xs py-1.5 px-3 rounded-lg outline-none shrink-0"
      >
        <option value={1}>1x</option>
        <option value={2}>2x</option>
        <option value={4}>4x</option>
      </select>

      {/* Download button */}
      <motion.button
        onClick={handleDownload}
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.05 }}
        whileTap={{ scale: loading ? 1 : 0.95 }}
        className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl font-semibold text-sm text-white
          disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 md:ml-2 shrink-0 flex-1 md:flex-none"
        style={{
          background: 'linear-gradient(135deg, #8b5cf6, #a855f7, #ec4899)',
          boxShadow: '0 0 20px rgba(139,92,246,0.4)',
        }}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Download size={16} />
        )}
        {loading ? 'Exporting…' : `Download`}
      </motion.button>

      {children}
    </div>
  );
};

export default ExportButton;
