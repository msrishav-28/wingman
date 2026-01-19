'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/use-auth'
import { attendanceService } from '@/lib/services/attendance'
import { toast } from 'react-hot-toast'
import LiquidSwipe from '@/components/ui/holographic/LiquidSwipe'
import HolographicCard from '@/components/ui/holographic/HolographicCard'
import { BookOpen, CheckCircle, XCircle, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function MarkAttendancePage() {
    const router = useRouter()
    const { user } = useAuth()
    const supabase = createClient()
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
    const [markingType, setMarkingType] = useState<'present' | 'absent'>('present')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Fetch subjects
    const { data: subjects, isLoading } = useQuery({
        queryKey: ['subjects', user?.id],
        queryFn: async () => {
            if (!user?.id) return []
            const { data, error } = await supabase
                .from('subjects')
                .select('*')
                .eq('student_id', user.id)

            if (error) throw error
            return data || []
        },
        enabled: !!user
    })

    const handleSwipe = async () => {
        if (!selectedSubject || !user) return

        setIsSubmitting(true)
        try {
            await attendanceService.markAttendance(user.id, selectedSubject, markingType)

            // Haptic success logic passed to LiquidSwipe, but doubling down here
            if (navigator.vibrate) navigator.vibrate([50, 50, 50])

            toast.success(markingType === 'present' ? 'MARKED PRESENT +10XP' : 'MARKED ABSENT')

            // Delay for visual effect then redirect
            setTimeout(() => {
                router.push('/dashboard')
            }, 1000)
        } catch (error) {
            console.error(error)
            toast.error('Failed to mark attendance')
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6 max-w-lg mx-auto pb-20">

            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6 text-text-muted" />
                </Link>
                <h1 className="text-2xl font-display font-bold text-white">INITIALIZE PROTOCOL</h1>
            </div>

            <div className="space-y-2">
                <h2 className="text-sm font-mono text-neon-blue tracking-widest">1. SELECT MODULE</h2>

                {isLoading ? (
                    <div className="text-white/20 font-mono animate-pulse">LOADING SUBJECT_DATA...</div>
                ) : subjects?.length === 0 ? (
                    <div className="text-text-muted border border-white/10 rounded-xl p-4 text-center">
                        No subjects found. Please add subjects first.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {subjects?.map((subject) => (
                            <motion.button
                                key={subject.id}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedSubject(subject.id)}
                                className={cn(
                                    "relative p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group overflow-hidden bg-black/40",
                                    selectedSubject === subject.id
                                        ? "border-neon-green shadow-[0_0_20px_rgba(0,255,148,0.2)] bg-neon-green/5"
                                        : "border-white/10 hover:border-white/20 hover:bg-white/5"
                                )}
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center border",
                                        selectedSubject === subject.id ? "border-neon-green text-neon-green bg-neon-green/10" : "border-white/10 text-text-muted bg-white/5"
                                    )}>
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className={cn("font-bold font-display", selectedSubject === subject.id ? "text-white" : "text-text-secondary")}>
                                            {subject.name}
                                        </h3>
                                        <p className="text-xs font-mono text-text-muted">{subject.code || "CODE_MISSING"}</p>
                                    </div>
                                </div>

                                {selectedSubject === subject.id && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-2 h-2 rounded-full bg-neon-green shadow-[0_0_10px_#00FF94]"
                                    />
                                )}
                            </motion.button>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedSubject && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <h2 className="text-sm font-mono text-neon-blue tracking-widest uppercase">2. STATUS DECLARATION</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setMarkingType('present')}
                                    className={cn(
                                        "p-4 rounded-xl border flex flex-col items-center gap-2 transition-all",
                                        markingType === 'present'
                                            ? "bg-neon-green/10 border-neon-green text-neon-green shadow-glow-green"
                                            : "bg-black/20 border-white/10 text-text-muted hover:bg-white/5"
                                    )}
                                >
                                    <CheckCircle className="w-6 h-6" />
                                    <span className="font-bold tracking-wider">PRESENT</span>
                                </button>

                                <button
                                    onClick={() => setMarkingType('absent')}
                                    className={cn(
                                        "p-4 rounded-xl border flex flex-col items-center gap-2 transition-all",
                                        markingType === 'absent'
                                            ? "bg-neon-danger/10 border-status-danger text-status-danger shadow-glow-pink" // Using pink glow for danger for now as per theme
                                            : "bg-black/20 border-white/10 text-text-muted hover:bg-white/5"
                                    )}
                                >
                                    <XCircle className="w-6 h-6" />
                                    <span className="font-bold tracking-wider">ABSENT</span>
                                </button>
                            </div>
                        </div>

                        <div className="fixed bottom-6 left-4 right-4 max-w-lg mx-auto z-50">
                            <LiquidSwipe
                                onConfirm={handleSwipe}
                                label={markingType === 'present' ? "SWIPE TO CONFIRM" : "SWIPE TO BUNK"}
                                confirmLabel={markingType === 'present' ? "ATTENDANCE LOGGED" : "BUNK RECORDED"}
                                className={markingType === 'absent' ? "border-status-danger/50" : "border-neon-green/50"}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}
