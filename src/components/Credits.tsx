import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X, Youtube, GraduationCap, Phone } from 'lucide-react';

const Credits = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-6 right-6 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white/70 hover:text-white transition-all shadow-lg hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] md:top-8 md:right-8"
                aria-label="Developer Credits"
            >
                <Info size={20} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        onClick={() => setIsOpen(false)} // Close when clicking outside
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 10, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.95, y: 10, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                            className="relative w-full max-w-[360px] bg-[#121222] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                        >
                            {/* Header Banner */}
                            <div
                                className="h-28 w-full bg-cover bg-center"
                                style={{ backgroundImage: 'linear-gradient(135deg, rgba(139,92,246,0.8), rgba(236,72,153,0.8))' }}
                            />

                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white rounded-full p-1.5 transition-colors backdrop-blur-md"
                            >
                                <X size={16} />
                            </button>

                            <div className="px-6 pb-8 pt-0 flex flex-col items-center">
                                {/* Profile Image - positioned halfway over header */}
                                <div className="w-24 h-24 rounded-full border-4 border-[#121222] overflow-hidden -mt-12 mb-3 bg-[#1a1a2e] flex-shrink-0 relative shadow-xl">
                                    {/* Photo of Sayed Johon - User must place sayed-johon.jpg in public/ folder */}
                                    <img src="/sayed-johon.jpg" alt="Sayed Johon" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                </div>

                                <h2 className="text-xl font-bold text-white mb-1 tracking-wide">Sayed Johon</h2>
                                <p className="text-sm text-white/50 mb-6 font-medium text-center">Creator & Fullstack Developer</p>

                                <div className="w-full space-y-3">
                                    <a
                                        href="https://www.youtube.com/@junoverseAI"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                                            <Youtube size={16} />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm font-semibold text-white/90">JunoverseAI</p>
                                            <p className="text-xs text-white/40 truncate">YouTube Channel</p>
                                        </div>
                                    </a>

                                    <a
                                        href="https://www.peeai.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                            <GraduationCap size={16} />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm font-semibold text-white/90">ChatGPT & AI Mastercourse</p>
                                            <p className="text-xs text-white/40 truncate">peeai.com</p>
                                        </div>
                                    </a>

                                    <a
                                        href="https://wa.me/8801972072408"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                                            <Phone size={16} />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm font-semibold text-white/90">+880 1972072408</p>
                                            <p className="text-xs text-white/40 truncate">WhatsApp Contact</p>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Credits;
