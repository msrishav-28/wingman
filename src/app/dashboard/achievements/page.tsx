'use client'

import { motion } from 'framer-motion'
import { Award, Lock, Star, Trophy, Zap } from 'lucide-react'
import HolographicCard from '@/components/ui/holographic/HolographicCard'
import TextScramble from '@/components/ui/holographic/TextScramble'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

import { useQuery } from '@tanstack/react-query'
import { gamificationService } from '@/lib/services/gamification'
import { createClient } from '@/lib/supabase/client'
import * as Icons from 'lucide-react'

export default function AchievementsPage() {
    const supabase = createClient()

    // 1. Fetch User Stats (XP, Level)
    const { data: stats } = useQuery({
        queryKey: ['xp-stats'],
        queryFn: async () => {
            const { data: user } = await supabase.auth.getUser()
            if (!user.user) return { xp: 0, level: 1 }

            const { data: student } = await supabase
                .from('students')
                .select('total_xp, level')
                .eq('id', user.user.id)
                .single()

            return {
                xp: student?.total_xp || 0,
                level: student?.level || 1
            }
        }
    })

    // 2. Fetch Achievements List
    const { data: achievements } = useQuery({
        queryKey: ['achievements-list'],
        queryFn: async () => {
            const { data: user } = await supabase.auth.getUser()
            if (!user.user) return []
            return await gamificationService.getAchievements(user.user.id)
        }
    })

    // Helper to get icon component dynamically
    const getIcon = (iconName: string) => {
        // Map emoji/string to Lucide icon or default
        const map: Record<string, any> = {
            '🎯': Icons.Target,
            '🔥': Icons.Flame,
            '⭐': Icons.Star,
            '🏆': Icons.Trophy,
            '📚': Icons.BookOpen,
            '🎓': Icons.GraduationCap,
            '🌟': Icons.Sparkles,
            '🐦': Icons.Bird,
            '🤝': Icons.Handshake,
            '💪': Icons.Dumbbell
        }
        return map[iconName] || Icons.Award
    }

    // Calculate Progress
    const currentLevel = stats?.level || 1
    const currentXP = stats?.xp || 0
    const nextLevelXP = gamificationService.calculateXPForNextLevel(currentLevel)
    const prevLevelXP = gamificationService.calculateXPForNextLevel(currentLevel - 1)

    // Progress within current level
    const levelProgress = Math.min(100, Math.max(0,
        ((currentXP - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100
    ))

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <Icons.ChevronLeft className="w-6 h-6 text-text-muted" />
                </Link>
                <h1 className="text-2xl font-display font-bold text-white">ACHIEVEMENT LOG</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements?.map((ach: any, i: number) => {
                    const IconComp = getIcon(ach.icon)
                    return (
                        <HolographicCard key={ach.id} delay={i * 0.1} className={ach.unlocked ? "border-neon-purple/30 bg-neon-purple/5" : "opacity-60 grayscale"}>
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${ach.unlocked ? 'bg-neon-purple/20 text-neon-purple' : 'bg-white/5 text-white/20'}`}>
                                    {ach.unlocked ? <IconComp className="w-6 h-6" /> : <Icons.Lock className="w-6 h-6" />}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`font-display font-bold ${ach.unlocked ? 'text-white' : 'text-text-muted'}`}>{ach.title}</h3>
                                    <p className="text-xs text-text-secondary mb-2">{ach.description}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono text-neon-purple">+{ach.xp_earned} XP</span>
                                        {ach.unlocked && <span className="text-[10px] bg-neon-purple/20 text-neon-purple px-2 py-0.5 rounded-full">UNLOCKED</span>}
                                    </div>
                                </div>
                            </div>
                        </HolographicCard>
                    )
                })}
            </div>

            <HolographicCard className="mt-8 border-neon-blue/30">
                <div className="text-center space-y-4">
                    <h2 className="text-xl font-display font-bold text-white">TOTAL PROGRESS</h2>
                    <div className="text-5xl font-mono font-bold text-neon-blue">
                        <TextScramble value={currentXP} /> <span className="text-lg text-white/50">XP</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${levelProgress}%` }}
                            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                            className="h-full bg-neon-blue shadow-[0_0_15px_#00D4FF]"
                        />
                    </div>
                    <p className="text-xs font-mono text-neon-blue">LEVEL {currentLevel} &gt;&gt;&gt; LEVEL {currentLevel + 1}</p>
                </div>
            </HolographicCard>
        </div>
    )
}
