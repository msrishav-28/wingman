'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import HolographicCard from '@/components/ui/holographic/HolographicCard'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Circle, Clock, AlertTriangle, FileText, Plus, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import Button from '@/components/ui/button'
import { gamificationService } from '@/lib/services/gamification'
import { assignmentService } from '@/lib/services/assignments'

export default function AssignmentsPage() {
    const [filter, setFilter] = useState<'pending' | 'completed'>('pending')
    const supabase = createClient()
    const queryClient = useQueryClient()

    // Fetch Assignments
    const { data: assignments, isLoading } = useQuery({
        queryKey: ['assignments', filter],
        queryFn: async () => {
            const { data: user } = await supabase.auth.getUser()
            if (!user.user) return []

            const allAssignments = await assignmentService.getAssignments(user.user.id)
            return allAssignments?.filter((a: any) => a.status === filter) || []
        }
    })

    // Mark Complete Mutation
    const completeMutation = useMutation({
        mutationFn: async (id: string) => {
            const { data: user } = await supabase.auth.getUser()
            if (!user.user) throw new Error('No user')

            // Update status via service
            await assignmentService.updateStatus(id, 'completed')

            // Award XP
            await gamificationService.awardXP(user.user.id, 50, 'Mission Accomplished', 'tasks')
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assignments'] })
            toast.success('Mission Complete +50 XP')
            // Haptic feedback
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate([50, 50, 50])
            }
        },
        onError: () => {
            toast.error('Failed to update status')
        }
    })

    // Priority Colors
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-neon-pink shadow-[0_0_10px_#FF006E]'
            case 'medium': return 'text-neon-yellow shadow-[0_0_10px_#FFD93D]'
            case 'low': return 'text-neon-blue shadow-[0_0_10px_#00D4FF]'
            default: return 'text-text-secondary'
        }
    }

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
    }

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-display font-bold flex items-center gap-3 mb-1">
                        <span className="p-2 rounded-lg bg-neon-blue/10 border border-neon-blue/20">
                            <FileText className="w-8 h-8 text-neon-blue" />
                        </span>
                        <span className="gradient-text">MISSION CONTROL</span>
                    </h1>
                    <p className="text-text-secondary font-mono text-sm ml-14">
                        TASK MANAGEMENT SYSTEM // {filter.toUpperCase()}
                    </p>
                </div>

                <Button className="hidden md:flex">
                    <Plus className="w-4 h-4 mr-2" /> New Task
                </Button>
            </motion.div>

            {/* Filter Tabs */}
            <div className="flex gap-4 border-b border-white/5 pb-1">
                <button
                    onClick={() => setFilter('pending')}
                    className={`pb-3 px-2 text-sm font-bold uppercase tracking-wider transition-colors relative ${filter === 'pending' ? 'text-white' : 'text-text-secondary hover:text-white'
                        }`}
                >
                    Active Missions
                    {filter === 'pending' && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-purple shadow-[0_0_10px_#7B61FF]" />
                    )}
                </button>
                <button
                    onClick={() => setFilter('completed')}
                    className={`pb-3 px-2 text-sm font-bold uppercase tracking-wider transition-colors relative ${filter === 'completed' ? 'text-white' : 'text-text-secondary hover:text-white'
                        }`}
                >
                    Completed Logs
                    {filter === 'completed' && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-purple shadow-[0_0_10px_#7B61FF]" />
                    )}
                </button>
            </div>

            {/* Task List */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-4"
            >
                <AnimatePresence mode="popLayout">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : assignments?.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-20 opacity-50"
                        >
                            <CheckCircle2 className="w-16 h-16 mb-4 text-neon-purple" />
                            <p className="font-mono text-lg">ALL SYSTEMS CLEAR</p>
                            <p className="text-sm">No {filter} assignments found.</p>
                        </motion.div>
                    ) : (
                        assignments?.map((assignment) => (
                            <motion.div
                                key={assignment.id}
                                variants={item}
                                layout
                                exit={{ opacity: 0, x: -50 }}
                            >
                                <HolographicCard className="group hover:border-neon-purple/50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        {/* Checkbox Trigger */}
                                        <button
                                            onClick={() => filter === 'pending' && completeMutation.mutate(assignment.id)}
                                            disabled={filter === 'completed' || completeMutation.isPending}
                                            className={`
                        mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                        ${filter === 'completed'
                                                    ? 'bg-neon-green border-neon-green text-black'
                                                    : 'border-white/20 hover:border-neon-purple hover:scale-110'
                                                }
                      `}
                                        >
                                            {filter === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                                            {filter === 'pending' && <Circle className="w-4 h-4 opacity-0 group-hover:opacity-100 text-neon-purple" />}
                                        </button>

                                        <div className="flex-1 space-y-1">
                                            <div className="flex flex-wrap justify-between items-start gap-2">
                                                <h3 className={`font-bold text-lg ${filter === 'completed' ? 'line-through opacity-50' : ''}`}>
                                                    {assignment.title}
                                                </h3>

                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${getPriorityColor(assignment.priority)}`} />
                                                    <span className="text-xs font-mono uppercase opacity-70 border border-white/10 px-2 py-0.5 rounded">
                                                        {assignment.subjects?.name || 'General'}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="text-text-secondary text-sm line-clamp-2">
                                                {assignment.description || 'No additional details provided.'}
                                            </p>

                                            <div className="flex items-center gap-4 pt-2 text-xs font-mono text-text-muted">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-neon-blue" />
                                                    <span>
                                                        {assignment.due_date
                                                            ? format(new Date(assignment.due_date), 'MMM d, h:mm a')
                                                            : 'NO DEADLINE'}
                                                    </span>
                                                </div>
                                                {assignment.priority === 'high' && (
                                                    <div className="flex items-center gap-1.5 text-neon-pink">
                                                        <AlertTriangle className="w-3.5 h-3.5" />
                                                        <span>CRITICAL</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </HolographicCard>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Mobile FAB */}
            <button className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-neon-purple rounded-full flex items-center justify-center shadow-glow-purple z-50 hover:scale-110 transition-transform active:scale-95">
                <Plus className="w-8 h-8 text-black" />
            </button>
        </div>
    )
}
