import { motion } from 'framer-motion'
import { TrendingUp, ChevronLeft, Save } from 'lucide-react'
import HolographicCard from '@/components/ui/holographic/HolographicCard'
import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export default function GradesEntryPage() {
    const supabase = createClient()
    const queryClient = useQueryClient()
    const [inputs, setInputs] = useState<Record<string, string>>({})

    // Fetch Subjects
    const { data: subjects } = useQuery({
        queryKey: ['subjects'],
        queryFn: async () => {
            const { data: user } = await supabase.auth.getUser()
            if (!user.user) return []
            const { data } = await supabase
                .from('subjects')
                .select('*')
                .eq('student_id', user.user.id)
            return data || []
        }
    })

    // Save Grade Mutation
    const saveMutation = useMutation({
        mutationFn: async ({ subjectId, marks }: { subjectId: string, marks: number }) => {
            const { data: user } = await supabase.auth.getUser()
            if (!user.user) throw new Error('No user')

            const { error } = await supabase
                .from('grades')
                .insert({
                    student_id: user.user.id,
                    subject_id: subjectId,
                    exam_type: 'Assessment', // Default for quick entry
                    marks_obtained: marks,
                    total_marks: 100, // Default assumption
                    grade_letter: marks >= 90 ? 'A' : marks >= 80 ? 'B' : 'C', // Simple auto-grade
                    exam_date: new Date().toISOString()
                })

            if (error) throw error
        },
        onSuccess: () => {
            toast.success('Grade Recorded')
            queryClient.invalidateQueries({ queryKey: ['grades'] })
        },
        onError: () => {
            toast.error('Failed to save grade')
        }
    })

    const handleSave = (subjectId: string) => {
        const val = parseFloat(inputs[subjectId])
        if (isNaN(val)) return toast.error('Invalid number')
        saveMutation.mutate({ subjectId, marks: val })
    }

    return (
        <div className="space-y-6 pb-20 max-w-lg mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6 text-text-muted" />
                </Link>
                <h1 className="text-2xl font-display font-bold text-white">UPDATE METRICS</h1>
            </div>

            <div className="space-y-4">
                {subjects?.length === 0 && (
                    <div className="text-center text-text-secondary py-10">
                        No subjects found.
                    </div>
                )}
                {subjects?.map((sub: any, i: number) => (
                    <motion.div key={sub.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                        <div className="glass-card p-4 border-l-4 border-l-neon-purple flex items-center gap-4">
                            <div className="flex-1">
                                <h3 className="font-display font-bold text-white">{sub.name}</h3>
                                <p className="text-xs text-text-secondary font-mono">{sub.code || 'No Code'}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    placeholder="0.0"
                                    value={inputs[sub.id] || ''}
                                    onChange={(e) => setInputs(prev => ({ ...prev, [sub.id]: e.target.value }))}
                                    className="w-20 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-right font-mono text-neon-purple focus:outline-none focus:border-neon-purple focus:shadow-glow-purple transition-all"
                                />
                                <button
                                    onClick={() => handleSave(sub.id)}
                                    disabled={saveMutation.isPending}
                                    className="p-2 bg-white/5 rounded-lg hover:bg-neon-purple/20 hover:text-neon-purple transition-colors disabled:opacity-50"
                                >
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
                        <p className="text-2xl font-mono text-white">--</p>
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
