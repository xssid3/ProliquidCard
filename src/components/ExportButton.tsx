import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2 } from 'lucide-react';
import { toPng, toJpeg } from 'html-to-image';
import { ExportFormat } from '@/types/card';

interface ExportButtonProps {
  canvasRef: React.RefObject<HTMLDivElement>;
}

const ExportButton: React.FC<ExportButtonProps> = ({ canvasRef }) => {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setLoading(true);
    try {
      const opts = {
        cacheBust: true,
        pixelRatio: 2,
        skipFonts: false,
      };
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
    <div className="flex flex-col gap-2">
      {/* Format toggle */}
      <div className="flex gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
        {(['png', 'jpg'] as ExportFormat[]).map((f) => (
          <button
            key={f}
            onClick={() => setFormat(f)}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold tracking-wide uppercase transition-all ${
              format === f
                ? 'bg-white/20 text-white'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Download button */}
      <motion.button
        onClick={handleDownload}
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white
          disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
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
        {loading ? 'Exporting…' : `Download ${format.toUpperCase()}`}
      </motion.button>
    </div>
  );
};

export default ExportButton;
