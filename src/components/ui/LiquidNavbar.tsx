"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, TrendingUp, Zap, X, Menu } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function LiquidNavbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="hidden md:block fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4">
            <motion.div
                layout
                initial={{ borderRadius: 24 }}
                className={cn(
                    "bg-black/80 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden",
                    isOpen ? "rounded-3xl" : "rounded-full"
                )}
            >
                <div className="relative">
                    {/* Collapsed State (Pill) */}
                    <AnimatePresence mode="popLayout">
                        {!isOpen ? (
                            <motion.div
                                key="collapsed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-between p-2 pl-6"
                            >
                                <span className="text-xs font-mono text-neon-green tracking-widest animate-pulse">
                                    SYSTEM_READY
                                </span>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsOpen(true)}
                                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                                >
                                    <Menu className="w-5 h-5 text-white" />
                                </motion.button>
                            </motion.div>
                        ) : (
                            /* Expanded State (Menu) */
                            <motion.div
                                key="expanded"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-4 space-y-4"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">
                                        Command Deck
                                    </span>
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setIsOpen(false)}
                                        className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10"
                                    >
                                        <X className="w-4 h-4 text-white" />
                                    </motion.button>
                                </div>

                                <div className="grid gap-2">
                                    <Link href="/dashboard/attendance/mark">
                                        <button className="w-full p-4 rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-center gap-3 hover:bg-neon-green/20 transition-all group">
                                            <div className="w-8 h-8 rounded-lg bg-neon-green/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Calendar className="w-4 h-4 text-neon-green" />
                                            </div>
                                            <span className="font-display font-bold text-white text-sm">MARK ATTENDANCE</span>
                                        </button>
                                    </Link>

                                    <Link href="/dashboard/grades/entry">
                                        <button className="w-full p-4 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center gap-3 hover:bg-neon-purple/20 transition-all group">
                                            <div className="w-8 h-8 rounded-lg bg-neon-purple/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <TrendingUp className="w-4 h-4 text-neon-purple" />
                                            </div>
                                            <span className="font-display font-bold text-white text-sm">UPDATE GRADES</span>
                                        </button>
                                    </Link>

                                    <Link href="/dashboard/ai-buddy">
                                        <button className="w-full p-4 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center gap-3 hover:bg-neon-blue/20 transition-all group">
                                            <div className="w-8 h-8 rounded-lg bg-neon-blue/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Zap className="w-4 h-4 text-neon-blue" />
                                            </div>
                                            <span className="font-display font-bold text-white text-sm">AI ASSISTANT</span>
                                        </button>
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    )
}
