'use client'

import { motion } from 'framer-motion'
import { Award, Lock, Star, Trophy, Zap } from 'lucide-react'
import HolographicCard from '@/components/ui/holographic/HolographicCard'
import TextScramble from '@/components/ui/holographic/TextScramble'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function AchievementsPage() {
    // Mock data for visual demo
    const achievements = [
        { id: 1, title: 'First Steps', desc: 'Complete onboarding', icon: Zap, unlocked: true, xp: 50 },
        { id: 2, title: 'Perfect Week', desc: '100% Attendance for 7 days', icon: Star, unlocked: true, xp: 200 },
        { id: 3, title: 'Data Cadet', desc: 'Enter grades for 3 subjects', icon: Award, unlocked: false, xp: 150 },
        { id: 4, title: 'System Overlord', desc: 'Reach Level 10', icon: Trophy, unlocked: false, xp: 1000 },
    ]

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6 text-text-muted" />
                </Link>
                <h1 className="text-2xl font-display font-bold text-white">ACHIEVEMENT LOG</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((ach, i) => (
                    <HolographicCard key={ach.id} delay={i * 0.1} className={ach.unlocked ? "border-neon-purple/30 bg-neon-purple/5" : "opacity-60 grayscale"}>
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${ach.unlocked ? 'bg-neon-purple/20 text-neon-purple' : 'bg-white/5 text-white/20'}`}>
                                {ach.unlocked ? <ach.icon className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                            </div>
                            <div className="flex-1">
                                <h3 className={`font-display font-bold ${ach.unlocked ? 'text-white' : 'text-text-muted'}`}>{ach.title}</h3>
                                <p className="text-xs text-text-secondary mb-2">{ach.desc}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono text-neon-purple">+{ach.xp} XP</span>
                                    {ach.unlocked && <span className="text-[10px] bg-neon-purple/20 text-neon-purple px-2 py-0.5 rounded-full">UNLOCKED</span>}
                                </div>
                            </div>
                        </div>
                    </HolographicCard>
                ))}
            </div>

            <HolographicCard className="mt-8 border-neon-blue/30">
                <div className="text-center space-y-4">
                    <h2 className="text-xl font-display font-bold text-white">TOTAL PROGRESS</h2>
                    <div className="text-5xl font-mono font-bold text-neon-blue">
                        <TextScramble value="2450" /> <span className="text-lg text-white/50">XP</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "65%" }}
                            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                            className="h-full bg-neon-blue shadow-[0_0_15px_#00D4FF]"
                        />
                    </div>
                    <p className="text-xs font-mono text-neon-blue">LEVEL 5 >>> LEVEL 6</p>
                </div>
            </HolographicCard>
        </div>
    )
}
