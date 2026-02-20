import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileJson, FolderDown, Play, Info, Loader2, X, CheckCircle2, Copy, Check, Sparkles } from 'lucide-react';
import { CardState } from '@/types/card';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface BulkGeneratorProps {
    cardState: CardState;
    setCardState: React.Dispatch<React.SetStateAction<CardState>>;
    canvasRef: React.RefObject<HTMLDivElement>;
}

export const BulkGenerator: React.FC<BulkGeneratorProps> = ({ cardState, setCardState, canvasRef }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [jsonItems, setJsonItems] = useState<any[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [imageTarget, setImageTarget] = useState<'background' | 'card'>('background');
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [pastedJson, setPastedJson] = useState('');

    const [startIndex, setStartIndex] = useState<number>(1);
    const [endIndex, setEndIndex] = useState<number>(1);
    const [resolution, setResolution] = useState<number>(2);
    const [copySuccess, setCopySuccess] = useState(false);

    const jsonUploadRef = useRef<HTMLInputElement>(null);
    const folderUploadRef = useRef<HTMLInputElement>(null);

    const totalAvailable = Math.max(jsonItems.length, images.length, 0);

    useEffect(() => {
        if (totalAvailable > 0) {
            setStartIndex(1);
            setEndIndex(totalAvailable);
        } else {
            setStartIndex(1);
            setEndIndex(1);
        }
    }, [totalAvailable]);

    const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target?.result as string);
                if (Array.isArray(parsed)) {
                    setJsonItems(parsed);
                    setPastedJson(''); // Clear pasted text if file uploaded
                } else {
                    alert('JSON must be an array of objects');
                }
            } catch (err) {
                alert('Invalid JSON file');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const handlePastedJson = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setPastedJson(val);

        if (!val.trim()) {
            setJsonItems([]);
            return;
        }

        try {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) {
                setJsonItems(parsed);
            }
        } catch (err) {
            // Invalid JSON structurally while typing, suppress error
        }
    };

    const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const ArrayFiles = Array.from(files)
            .filter(file => file.type.startsWith('image/'))
            .sort((a, b) => a.name.localeCompare(b.name));

        const promises = ArrayFiles.map((file) => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    resolve((event.target?.result as string) || '');
                };
                reader.readAsDataURL(file);
            });
        });

        const urls = await Promise.all(promises);
        setImages(urls.filter(url => url !== ''));
        e.target.value = '';
    };

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const startGeneration = async () => {
        if (!canvasRef.current || totalAvailable === 0) return;

        setIsGenerating(true);
        setProgress(0);

        const zip = new JSZip();

        let actualStart = Math.max(1, startIndex);
        let actualEnd = Math.min(totalAvailable, endIndex);
        if (actualStart > actualEnd) {
            actualStart = actualEnd;
        }

        const count = actualEnd - actualStart + 1;

        for (let idx = actualStart - 1; idx < actualEnd; idx++) {
            const item = idx < jsonItems.length ? jsonItems[idx] : {};
            const imgUrl = idx < images.length ? images[idx] : images[images.length - 1]; // Cycle or use last if out of bounds

            // Update state
            setCardState(prev => {
                let nextState = { ...prev, ...item };
                if (imgUrl) {
                    if (imageTarget === 'card' && prev.template === 'image-text') {
                        nextState.cardImage = imgUrl;
                    } else if (imageTarget === 'background') {
                        nextState.backgroundImage = imgUrl;
                    }
                }
                return nextState;
            });

            // Wait for React to render and fonts to load/paint
            await delay(400);

            try {
                // Remove the useCORS and allowTaint that are native to html2canvas, not html-to-image
                const dataUrl = await toPng(canvasRef.current, {
                    cacheBust: true,
                    pixelRatio: resolution,
                    skipFonts: true,
                    style: {
                        transform: 'scale(1)',
                        transformOrigin: 'top left',
                    }
                });
                const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
                zip.file(`card-${idx + 1}.png`, base64Data, { base64: true });
            } catch (err) {
                console.error('Error generating image', idx, err);
            }

            setProgress(idx - actualStart + 1);
            await delay(100);
        }

        try {
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, 'liquid-glass-cards.zip');
        } catch (e) {
            console.error(e);
        }

        setIsGenerating(false);
    };

    // Instruction logic based on template
    const getAiPrompt = () => {
        if (cardState.template === 'quote') {
            return `I need a JSON array of objects. Each object should have the following keys: "quoteText" (the main quote), "quoteAuthor" (the author, e.g., "— Name"), and "brandName" (the brand watermarking). Please generate [INSERT NUMBER] examples. Output ONLY the valid JSON array inside a standard JSON code block so that I can easily one-click copy and paste it. Example:\n[\n  { "quoteText": "Stay hungry, stay foolish.", "quoteAuthor": "— Steve Jobs", "brandName": "YourBrand" }\n]`;
        } else if (cardState.template === 'qa') {
            return `I need a JSON array of objects. Each object should have the following keys: "questionText" (a specific question), "answerText" (the detailed answer), and "brandName" (the brand watermarking). Please generate [INSERT NUMBER] examples. Output ONLY the valid JSON array inside a standard JSON code block so that I can easily one-click copy and paste it. Example:\n[\n  { "questionText": "What is Liquid Glass?", "answerText": "It is a modern design aesthetic.", "brandName": "YourBrand" }\n]`;
        } else {
            return `I need a JSON array of objects. Each object should have the following keys: "imageTitle" (a short title), "imageDescription" (a descriptive paragraph), and "brandName" (the brand watermarking). Please generate [INSERT NUMBER] examples. Output ONLY the valid JSON array inside a standard JSON code block so that I can easily one-click copy and paste it. Example:\n[\n  { "imageTitle": "Creative Vision", "imageDescription": "Every pixel tells a story.", "brandName": "YourBrand" }\n]`;
        }
    };

    const getPreviewJson = () => {
        if (cardState.template === 'quote') {
            return `[\n  { "quoteText": "Line 1", "quoteAuthor": "Author 1", "brandName": "YourBrand" }\n]`;
        } else if (cardState.template === 'qa') {
            return `[\n  { "questionText": "Q1", "answerText": "A1", "brandName": "YourBrand" }\n]`;
        } else {
            return `[\n  { "imageTitle": "Title 1", "imageDescription": "Desc 1", "brandName": "YourBrand" }\n]`;
        }
    };

    const copyPrompt = () => {
        navigator.clipboard.writeText(getAiPrompt());
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 shrink-0 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-sm font-semibold tracking-wide transition-all md:ml-auto flex-1 md:w-auto md:flex-none"
            >
                <FileJson size={16} />
                Bulk Generation
            </button>

            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
                        >
                            <motion.div
                                initial={{ scale: 0.95, y: 10 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.95, y: 10 }}
                                className="bg-[#121222] border border-white/10 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative my-auto max-h-[90vh] flex flex-col"
                            >
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="absolute top-4 right-4 text-white/50 hover:text-white"
                                >
                                    <X size={18} />
                                </button>

                                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2 flex-shrink-0">
                                    <FileJson size={20} className="text-purple-400" />
                                    Bulk Generator (ZIP Export)
                                </h2>
                                <p className="text-sm text-white/50 mb-6 flex-shrink-0">
                                    Connect data and sequenced images to generate multiple cards automatically.
                                </p>

                                <div className="space-y-6 overflow-y-auto flex-1 pr-2">
                                    {/* Step 1: Data Setup */}
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                                <span className="bg-purple-500/20 text-purple-400 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0">1</span>
                                                Data Preparation
                                            </h3>
                                            <div className="flex flex-wrap shrink-0 items-center justify-end gap-2">
                                                <a
                                                    href="https://gemini.google.com/gem/19kzfgezyOnWMXKb_A6u1jFbVGD2PGFR-?usp=sharing"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 text-xs bg-[linear-gradient(135deg,rgba(139,92,246,0.3),rgba(236,72,153,0.3))] hover:opacity-80 text-purple-100 py-1.5 px-3 rounded-md transition-all font-semibold border-purple-500/30 border shrink-0 backdrop-blur-sm"
                                                >
                                                    <Sparkles size={12} className="text-pink-300" />
                                                    Use Custom Gem
                                                </a>
                                                <button
                                                    onClick={copyPrompt}
                                                    className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-white py-1.5 px-3 rounded-md transition-all border border-white/10 shrink-0"
                                                >
                                                    {copySuccess ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                                                    {copySuccess ? 'Copied!' : 'Copy AI Prompt'}
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-white/50 mb-3 leading-relaxed">
                                            Generate JSON data instantly with our custom <strong>Gemini Gem</strong>, or ask ChatGPT/Claude by copying the prompt above. It will give you JSON data based on your current template (<strong>{cardState.template}</strong>). The JSON looks like this:
                                        </p>
                                        <pre className="text-[11px] text-white/70 bg-black/40 p-3 rounded-lg overflow-x-auto border border-white/5">
                                            {getPreviewJson()}
                                        </pre>
                                    </div>

                                    {/* Step 2: Uploads & Paste */}
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-4 h-40">
                                            <div className="flex flex-col gap-2 h-full">
                                                <button
                                                    onClick={() => jsonUploadRef.current?.click()}
                                                    className={`flex-1 flex flex-col items-center justify-center gap-1 p-2 rounded-xl border transition-all ${jsonItems.length > 0 && !pastedJson ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                        }`}
                                                >
                                                    {jsonItems.length > 0 && !pastedJson ? <CheckCircle2 size={20} className="text-green-400" /> : <FileJson size={20} className="text-white/40" />}
                                                    <span className="text-xs font-semibold text-white/80">
                                                        {jsonItems.length > 0 && !pastedJson ? `${jsonItems.length} Records Loaded` : 'Upload JSON'}
                                                    </span>
                                                </button>
                                                <input ref={jsonUploadRef} type="file" accept=".json" className="hidden" onChange={handleJsonUpload} />
                                                <textarea
                                                    placeholder="Or paste JSON array here..."
                                                    value={pastedJson}
                                                    onChange={handlePastedJson}
                                                    className={`flex-1 w-full bg-black/40 border text-white text-[10px] p-2 rounded-xl outline-none transition-all resize-none ${pastedJson && jsonItems.length > 0 ? 'border-green-500/50' : pastedJson ? 'border-red-500/50' : 'border-white/10 focus:border-white/30'}`}
                                                />
                                            </div>

                                            <button
                                                onClick={() => folderUploadRef.current?.click()}
                                                className={`flex flex-col items-center justify-center gap-2 p-5 rounded-xl border transition-all h-full ${images.length > 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                    }`}
                                            >
                                                {images.length > 0 ? <CheckCircle2 size={24} className="text-green-400" /> : <FolderDown size={24} className="text-white/40" />}
                                                <span className="text-sm font-semibold text-white/80 mt-1">
                                                    {images.length > 0 ? `${images.length} Images Loaded` : 'Upload Image Folder'}
                                                </span>
                                            </button>
                                            <input ref={folderUploadRef} type="file" {...{ webkitdirectory: '', directory: '' } as any} multiple className="hidden" onChange={handleFolderUpload} />
                                        </div>
                                        <div className="text-xs text-center text-white/50">
                                            Total Data Records Read: <span className="font-bold text-white text-sm">{totalAvailable}</span>
                                        </div>
                                    </div>

                                    {/* Step 3: Export Settings */}
                                    {totalAvailable > 0 && (
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                                            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                                <span className="bg-purple-500/20 text-purple-400 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
                                                Export Settings
                                            </h3>

                                            {images.length > 0 && (
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-xs font-medium text-white/60">Apply folder images to:</label>
                                                    <select
                                                        value={imageTarget}
                                                        onChange={(e) => setImageTarget(e.target.value as any)}
                                                        className="w-full bg-black/40 border border-white/10 text-white text-sm py-2 px-3 rounded-lg outline-none"
                                                    >
                                                        <option value="background">Background Pattern</option>
                                                        {cardState.template === 'image-text' && <option value="card">Inner Subject Image</option>}
                                                    </select>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-xs font-medium text-white/60">Export Resolution</label>
                                                    <select
                                                        value={resolution}
                                                        onChange={(e) => setResolution(Number(e.target.value))}
                                                        className="w-full bg-black/40 border border-white/10 text-white text-sm py-2 px-3 rounded-lg outline-none"
                                                    >
                                                        <option value={1}>1x (Standard)</option>
                                                        <option value={2}>2x (High Quality / Retina)</option>
                                                        <option value={3}>3x (Ultra HD)</option>
                                                        <option value={4}>4x (Maximum Details)</option>
                                                    </select>
                                                </div>

                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-xs font-medium text-white/60">Images Range</label>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            max={totalAvailable}
                                                            value={startIndex}
                                                            onChange={(e) => setStartIndex(Number(e.target.value))}
                                                            className="w-full bg-black/40 border border-white/10 text-white text-sm py-2 px-3 rounded-lg outline-none"
                                                        />
                                                        <span className="text-white/40">to</span>
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            max={totalAvailable}
                                                            value={endIndex}
                                                            onChange={(e) => setEndIndex(Number(e.target.value))}
                                                            className="w-full bg-black/40 border border-white/10 text-white text-sm py-2 px-3 rounded-lg outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action */}
                                    <div className="pt-2">
                                        <button
                                            onClick={startGeneration}
                                            disabled={isGenerating || totalAvailable === 0}
                                            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-[15px] text-white disabled:opacity-50 transition-all bg-gradient-to-r from-purple-600 to-pink-600 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <Loader2 size={18} className="animate-spin" />
                                                    Generating {progress} of {endIndex - Math.max(1, startIndex) + 1} ...
                                                </>
                                            ) : (
                                                <>
                                                    <Play size={18} />
                                                    Generate & Download ZIP
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
};

export default BulkGenerator;
