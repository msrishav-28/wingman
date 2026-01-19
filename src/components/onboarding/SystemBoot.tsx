"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, ChevronRight, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SystemBootProps {
    onComplete: () => void
}

export default function SystemBoot({ onComplete }: SystemBootProps) {
    const [step, setStep] = useState(0)
    const [bootLog, setBootLog] = useState<string[]>([])

    const logs = [
        "> INITIALIZING ACADEMIC PROTOCOLS...",
        "> CONNECTING TO NEURAL DATA...",
        "> LOADING VISUAL DNA [V2.0]...",
        "> CALIBRATING HOLOGRAPHIC INTERFACE...",
        "> SYSTEM ONLINE."
    ]

    useEffect(() => {
        let timeout: NodeJS.Timeout

        if (step < logs.length) {
            timeout = setTimeout(() => {
                setBootLog(prev => [...prev, logs[step]])
                setStep(prev => prev + 1)
            }, 600) // 600ms per log line
        }

        return () => clearTimeout(timeout)
    }, [step])

    return (
        <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center p-6 font-mono text-neon-green/80">
            <div className="max-w-md w-full space-y-8">
                {/* Terminal Window */}
                <div className="w-full bg-black/50 border border-white/10 rounded-lg p-6 min-h-[300px] relative overflow-hidden backdrop-blur-sm shadow-[0_0_50px_-20px_rgba(0,255,148,0.2)]">
                    {/* Scanline */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[4px] w-full animate-scanline pointer-events-none" />

                    <div className="flex items-center gap-2 mb-4 text-xs text-white/40 border-b border-white/5 pb-2">
                        <Terminal className="w-3 h-3" />
                        <span>ROOT_ACCESS // SECURE_SHELL</span>
                    </div>

                    <div className="space-y-2 text-sm">
                        {bootLog.map((log, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-start gap-2"
                            >
                                <span className="text-neon-green">{log}</span>
                            </motion.div>
                        ))}
                        {step < logs.length && (
                            <motion.div
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.8 }}
                                className="w-3 h-5 bg-neon-green"
                            />
                        )}
                    </div>
                </div>

                {/* Main Action Button - Appears after logs */}
                <AnimatePresence>
                    {step >= logs.length && (
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={onComplete}
                            className="w-full group relative overflow-hidden rounded-xl bg-neon-green/10 border border-neon-green/20 p-6 transition-all hover:bg-neon-green/20 hover:border-neon-green/50 hover:shadow-[0_0_30px_rgba(0,255,148,0.3)]"
                        >
                            <div className="relative z-10 flex items-center justify-center gap-3">
                                <Shield className="w-6 h-6 text-neon-green" />
                                <span className="text-lg font-bold tracking-widest text-neon-green">
                                    ENGAGE SYSTEM
                                </span>
                                <ChevronRight className="w-5 h-5 text-neon-green transition-transform group-hover:translate-x-1" />
                            </div>
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Background Grid */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(0,255,148,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,148,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>
    )
}
