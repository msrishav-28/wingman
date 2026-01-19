'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/lib/hooks/use-auth'
import HolographicCard from '@/components/ui/holographic/HolographicCard'
import GlassTorus from '@/components/ui/holographic/GlassTorus'
import TextScramble from '@/components/ui/holographic/TextScramble'
import SystemBoot from '@/components/onboarding/SystemBoot'
import LiquidNavbar from '@/components/ui/LiquidNavbar'
import { TrendingUp, Calendar, Award, Zap, Target, Flame } from 'lucide-react'
import { attendanceService } from '@/lib/services/attendance'
import { gamificationService } from '@/lib/services/gamification'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

export default function DashboardPage() {
  const { user } = useAuth()
  const supabase = createClient()
  const [showBoot, setShowBoot] = useState(false)
  const [bootComplete, setBootComplete] = useState(false)

  useEffect(() => {
    const hasBooted = localStorage.getItem('system_boot_v2')
    if (!hasBooted) {
      setShowBoot(true)
    } else {
      setBootComplete(true)
    }
  }, [])

  const handleBootComplete = () => {
    setShowBoot(false)
    setBootComplete(true)
    localStorage.setItem('system_boot_v2', 'true')
    toast.success('ACADEMIC PROTOCOLS INITIALIZED', {
      icon: '🚀',
      style: {
        background: '#050505',
        color: '#00FF94',
        border: '1px solid rgba(0,255,148,0.2)'
      }
    })
  }

  interface Profile {
    id: string
    name: string
    email: string
  }

  const { data: profile } = useQuery<Profile | null>({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null
      const { data } = await supabase
        .from('students')
        .select('*')
        .eq('id', user.id)
        .single()

      // Force cast if Supabase types aren't fully generated yet
      return data as unknown as Profile
    },
    enabled: !!user,
  })

  // Real Stats Query
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null

      // 1. Fetch Attendance Stats
      const attendanceStats = await attendanceService.getStats(user.id)

      // 2. Fetch Gamification Stats
      const { data: student } = await supabase
        .from('students')
        .select('total_xp, level')
        .eq('id', user.id)
        .single()

      // 3. Fetch Streak
      // For now, we'll get the 'study' streak or max of all streaks
      const { data: streaks } = await supabase
        .from('streaks')
        .select('current_streak')
        .eq('student_id', user.id)
        .order('current_streak', { ascending: false })
        .limit(1)

      const bestStreak = streaks?.[0]?.current_streak || 0

      return {
        attendance: attendanceStats.percentage,
        streak: bestStreak,
        xp: student?.total_xp || 0,
        level: student?.level || 1,
      }
    },
    enabled: !!user,
  })

  return (
    <>
      <AnimatePresence>
        {showBoot && (
          <motion.div
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
          >
            <SystemBoot onComplete={handleBootComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`space-y-6 relative transition-opacity duration-1000 ${!bootComplete ? 'opacity-0' : 'opacity-100'}`}>

        {/* Hero Section with 3D Torus */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <HolographicCard className="lg:col-span-2 min-h-[300px] flex flex-col justify-center relative overflow-visible">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-50 pointer-events-none">
              <GlassTorus status={stats && stats.attendance < 75 ? 'critical' : stats && stats.attendance < 85 ? 'warning' : 'safe'} />
            </div>

            <div className="relative z-10 max-w-lg">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h1 className="font-display font-bold mb-4">
                  <span className="text-xl text-text-secondary font-body font-normal block mb-2">Welcome back,</span>
                  <span className="text-5xl md:text-7xl gradient-text tracking-tight">{profile?.name?.split(' ')[0] || 'Cadet'}</span>
                </h1>
                <p className="text-text-secondary text-lg font-body mb-6">
                  System Status: <span className="text-neon-green">ONLINE</span> <br />
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </motion.div>
            </div>
          </HolographicCard>

          {/* Quick Stats Column */}
          <div className="space-y-4">
            <Link href="/dashboard/attendance">
              <HolographicCard className="cursor-pointer group h-[140px] flex flex-col justify-between" delay={0.1}>
                <div className="flex justify-between items-start">
                  <p className="text-text-secondary text-sm font-mono">ATTENDANCE</p>
                  <Calendar className={`w-5 h-5 ${(stats?.attendance || 0) >= 85 ? 'text-neon-green' :
                    (stats?.attendance || 0) >= 75 ? 'text-neon-yellow' : 'text-neon-pink'
                    }`} />
                </div>
                <div className="text-4xl font-mono font-bold">
                  <TextScramble value={`${stats?.attendance.toFixed(1) || '0.0'}%`} />
                </div>
                <div className="w-full bg-white/5 h-1 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full ${(stats?.attendance || 0) >= 85 ? 'bg-neon-green' :
                      (stats?.attendance || 0) >= 75 ? 'bg-neon-yellow' : 'bg-neon-pink'
                      }`}
                    style={{ width: `${stats?.attendance || 0}%` }}
                  />
                </div>
              </HolographicCard>
            </Link>

            <div className="grid grid-cols-2 gap-4">
              <Link href="/dashboard/achievements">
                <HolographicCard className="cursor-pointer h-[140px] flex flex-col justify-between" delay={0.2}>
                  <div className="flex justify-between items-start">
                    <p className="text-text-secondary text-xs font-mono">LEVEL</p>
                    <Award className="w-4 h-4 text-neon-purple" />
                  </div>
                  <div className="text-3xl font-mono font-bold text-neon-purple">
                    <TextScramble value={stats?.level || 1} />
                  </div>
                </HolographicCard>
              </Link>

              <HolographicCard className="h-[140px] flex flex-col justify-between" delay={0.3}>
                <div className="flex justify-between items-start">
                  <p className="text-text-secondary text-xs font-mono">STREAK</p>
                  <Flame className="w-4 h-4 text-neon-orange" />
                </div>
                <div className="text-3xl font-mono font-bold text-neon-orange">
                  <TextScramble value={stats?.streak || 0} />
                </div>
              </HolographicCard>
            </div>
          </div>
        </div>

        {/* Mobile Quick Actions (Inline Command Deck) */}
        <div className="md:hidden grid gap-4 mt-8">
          <h3 className="text-xs font-mono text-text-secondary tracking-widest uppercase mb-2">COMMAND DECK</h3>

          <Link href="/dashboard/attendance/mark">
            <HolographicCard className="flex items-center gap-4 p-4 border-neon-green/30 bg-neon-green/5 active:scale-95 transition-transform" hoverEffect={false}>
              <div className="w-10 h-10 rounded-lg bg-neon-green/10 flex items-center justify-center border border-neon-green/20">
                <Calendar className="w-5 h-5 text-neon-green" />
              </div>
              <div>
                <h4 className="font-bold text-white font-display">MARK ATTENDANCE</h4>
                <p className="text-xs text-neon-green/70 font-mono">INITIATE PROTOCOL</p>
              </div>
            </HolographicCard>
          </Link>

          <Link href="/dashboard/grades/entry">
            <HolographicCard className="flex items-center gap-4 p-4 border-neon-purple/30 bg-neon-purple/5 active:scale-95 transition-transform" hoverEffect={false}>
              <div className="w-10 h-10 rounded-lg bg-neon-purple/10 flex items-center justify-center border border-neon-purple/20">
                <TrendingUp className="w-5 h-5 text-neon-purple" />
              </div>
              <div>
                <h4 className="font-bold text-white font-display">UPDATE GRADES</h4>
                <p className="text-xs text-neon-purple/70 font-mono">DATA ENTRY</p>
              </div>
            </HolographicCard>
          </Link>

          <Link href="/dashboard/ai-buddy">
            <HolographicCard className="flex items-center gap-4 p-4 border-neon-blue/30 bg-neon-blue/5 active:scale-95 transition-transform" hoverEffect={false}>
              <div className="w-10 h-10 rounded-lg bg-neon-blue/10 flex items-center justify-center border border-neon-blue/20">
                <Zap className="w-5 h-5 text-neon-blue" />
              </div>
              <div>
                <h4 className="font-bold text-white font-display">AI ASSISTANT</h4>
                <p className="text-xs text-neon-blue/70 font-mono">NEURAL LINK</p>
              </div>
            </HolographicCard>
          </Link>
        </div>

        {/* Floating Navbar Replaces Static Command Center (Desktop Only) */}
        <LiquidNavbar />

      </div>
    </>
  )
}
