'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import HolographicCard from '@/components/ui/holographic/HolographicCard'
import Button from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Settings, User, Bell, Shield, Smartphone, ArrowRight, LogOut, Trash2, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

import HolographicID from '@/components/ui/holographic/HolographicID'

export default function SettingsPage() {
    const [loading, setLoading] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    const { data: profile } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const { data: user } = await supabase.auth.getUser()
            if (!user.user) return null
            const { data } = await supabase
                .from('students')
                .select('*')
                .eq('id', user.user.id)
                .single()
            return {
                name: data?.name || 'Cadet',
                department: data?.department || 'Rookie',
                rollNo: user.user.email?.split('@')[0] || 'Unknown',
                year: data?.year?.toString() || new Date().getFullYear().toString()
            }
        }
    })

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const handleExportData = async () => {
        toast.loading('Compiling Neural Records...')
        // Mock export delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        toast.dismiss()

        // Create dummy JSON file
        const data = JSON.stringify({ profile, timestamp: new Date() }, null, 2)
        const blob = new Blob([data], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'student-companion-data.json'
        a.click()
        toast.success('System Dump downloaded successfully')
    }

    const toggleSection = (label: string, checked: boolean) => {
        // Haptic feedback
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(20)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-20">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-display font-bold flex items-center gap-3 mb-2">
                    <span className="p-2 rounded-lg bg-white/5 border border-white/10">
                        <Settings className="w-8 h-8 text-white" />
                    </span>
                    <span className="gradient-text">SYSTEM CONFIG</span>
                </h1>
                <p className="text-text-secondary font-mono text-sm ml-14">
                    PREFERENCES // ACCOUNT // DATA
                </p>
            </motion.div>

            {/* Profile Section */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <User className="w-5 h-5 text-neon-blue" />
                    Pilot Profile
                </h2>
                <div className="flex flex-col items-center">
                    <HolographicID
                        studentName={profile.name}
                        department={profile.department}
                        rollNumber={profile.rollNo}
                        year={profile.year}
                    />
                </div>
            </section>

            {/* Interface Settings */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-neon-purple" />
                    Interface
                </h2>
                <HolographicCard className="p-0 overflow-hidden">
                    {[
                        { label: 'Haptic Feedback', desc: 'Vibrate on interaction', default: true },
                        { label: 'Sound Effects', desc: 'System sounds and alerts', default: true },
                        { label: 'High Performance', desc: 'Reduce motion for battery', default: false },
                        { label: 'Show Laser Grid', desc: 'Background mesh visualization', default: true },
                    ].map((setting, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                            <div>
                                <h3 className="font-bold text-sm">{setting.label}</h3>
                                <p className="text-xs text-text-secondary">{setting.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked={setting.default} className="sr-only peer" onChange={(e) => toggleSection(setting.label, e.target.checked)} />
                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-purple"></div>
                            </label>
                        </div>
                    ))}
                </HolographicCard>
            </section>

            {/* Data & Privacy */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-neon-green" />
                    Data & Privacy
                </h2>
                <HolographicCard className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold">Export Neural Log</h3>
                            <p className="text-sm text-text-secondary">Download all your grades & attendance data.</p>
                        </div>
                        <Button onClick={handleExportData} variant="outline" className="border-neon-green/50 hover:bg-neon-green/10 text-neon-green">
                            <Download className="w-4 h-4 mr-2" /> Download JSON
                        </Button>
                    </div>
                </HolographicCard>
            </section>

            {/* Session */}
            <section className="pt-8 border-t border-white/10">
                <Button onClick={handleLogout} className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20">
                    <LogOut className="w-4 h-4 mr-2" /> Disconnect System
                </Button>
            </section>
        </div>
    )
}
