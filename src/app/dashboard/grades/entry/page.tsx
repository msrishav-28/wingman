'use client'

import { motion } from 'framer-motion'
import { TrendingUp, ChevronLeft, Save } from 'lucide-react'
import HolographicCard from '@/components/ui/holographic/HolographicCard'
import Link from 'next/link'
import { useState } from 'react'

export default function GradesEntryPage() {
    // Visual demo state
    const [mockSubjects] = useState(['Mathematics', 'Physics', 'Computer Science'])

    return (
        <div className="space-y-6 pb-20 max-w-lg mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6 text-text-muted" />
                </Link>
                <h1 className="text-2xl font-display font-bold text-white">UPDATE METRICS</h1>
            </div>

            <div className="space-y-4">
                {mockSubjects.map((sub, i) => (
                    <motion.div key={sub} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                        <div className="glass-card p-4 border-l-4 border-l-neon-purple flex items-center gap-4">
                            <div className="flex-1">
                                <h3 className="font-display font-bold text-white">{sub}</h3>
                                <p className="text-xs text-text-secondary font-mono">Current: 8.5 GPA</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    placeholder="0.0"
                                    className="w-20 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-right font-mono text-neon-purple focus:outline-none focus:border-neon-purple focus:shadow-glow-purple transition-all"
                                />
                                <button className="p-2 bg-white/5 rounded-lg hover:bg-neon-purple/20 hover:text-neon-purple transition-colors">
                                    <Save className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <HolographicCard className="mt-8">
                <div className="flex items-center gap-4 mb-4">
                    <TrendingUp className="w-5 h-5 text-neon-green" />
                    <h2 className="font-display font-bold">PROJECTED GPA</h2>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-xs text-text-secondary mb-1">CURRENT</p>
                        <p className="text-2xl font-mono text-white">8.92</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-text-secondary mb-1">TARGET</p>
                        <p className="text-4xl font-mono text-neon-green font-bold">9.20</p>
                    </div>
                </div>
                <div className="mt-4 w-full bg-white/10 h-1 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-white to-neon-green w-[85%] shadow-[0_0_10px_rgba(0,255,148,0.5)]" />
                </div>
            </HolographicCard>
        </div>
    )
}
