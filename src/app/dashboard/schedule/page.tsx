'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import HolographicCard from '@/components/ui/holographic/HolographicCard'
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react'
import { format, addDays, startOfWeek, isSameDay } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'

const calculateDuration = (start: string, end: string) => {
    const [sh, sm] = start.split(':').map(Number)
    const [eh, em] = end.split(':').map(Number)
    return (eh - sh) + (em - sm) / 60
}

export default function SchedulePage() {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [currentTime, setCurrentTime] = useState(new Date())
    const supabase = createClient()

    // Week view logic
    const startDate = startOfWeek(selectedDate, { weekStartsOn: 1 }) // Monday start
    const weekDays = Array.from({ length: 5 }).map((_, i) => addDays(startDate, i))

    useEffect(() => {
        // Update "Laser Line" every minute
        const timer = setInterval(() => setCurrentTime(new Date()), 60000)
        return () => clearInterval(timer)
    }, [])

    // Real Schedule Query
    const { data: scheduleData } = useQuery({
        queryKey: ['schedule'],
        queryFn: async () => {
            const { data: user } = await supabase.auth.getUser()
            if (!user.user) return []

            const { data } = await supabase
                .from('schedules')
                .select(`
                    *,
                    subjects (name, color)
                `)
                .eq('student_id', user.user.id)

            return data || []
        }
    })

    const getDaySchedule = (date: Date) => {
        const dayName = format(date, 'EEEE') // 'Monday', 'Tuesday'...
        if (!scheduleData) return []

        return scheduleData.filter((s: any) => s.day_of_week === dayName).map((s: any) => ({
            id: s.id,
            time: s.start_time.slice(0, 5), // '09:00:00' -> '09:00'
            duration: calculateDuration(s.start_time, s.end_time),
            subject: s.subjects?.name || 'Unknown',
            room: s.room || 'TBD',
            type: s.type || 'Lecture'
        }))
    }

    const timeSlots = Array.from({ length: 9 }).map((_, i) => i + 9) // 9 AM to 5 PM

    // Current time position calculation
    const getCurrentTimePosition = () => {
        const hours = currentTime.getHours()
        const minutes = currentTime.getMinutes()
        if (hours < 9 || hours > 17) return null
        return ((hours - 9) * 64) + (minutes / 60 * 64) // 64px is row height
    }

    const timePos = getCurrentTimePosition()

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold flex items-center gap-3">
                        <span className="p-2 rounded-lg bg-neon-purple/10 border border-neon-purple/20">
                            <Calendar className="w-8 h-8 text-neon-purple" />
                        </span>
                        <span className="gradient-text">TEMPORAL GRID</span>
                    </h1>
                </div>

                <div className="flex items-center gap-2 bg-white/5 rounded-full p-1 border border-white/10">
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 font-mono text-sm font-bold">
                        {format(selectedDate, 'MMMM yyyy')}
                    </span>
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Week Navigation */}
            <div className="grid grid-cols-5 gap-2">
                {weekDays.map((date, i) => {
                    const isSelected = isSameDay(date, selectedDate)
                    const isToday = isSameDay(date, new Date())

                    return (
                        <button
                            key={i}
                            onClick={() => setSelectedDate(date)}
                            className={`
                flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300
                ${isSelected
                                    ? 'bg-neon-purple/20 border-neon-purple/50 shadow-[0_0_15px_rgba(123,97,255,0.2)]'
                                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                                }
              `}
                        >
                            <span className={`text-xs uppercase font-bold mb-1 ${isSelected ? 'text-neon-purple' : 'text-text-secondary'}`}>
                                {format(date, 'EEE')}
                            </span>
                            <span className={`text-xl font-display font-bold ${isSelected ? 'text-white' : 'text-text-primary'}`}>
                                {format(date, 'd')}
                            </span>
                            {isToday && (
                                <div className="mt-1 w-1 h-1 rounded-full bg-neon-green shadow-[0_0_5px_#00FF94]" />
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Timetable Grid */}
            <HolographicCard className="flex-1 overflow-hidden flex flex-col p-0 relative">
                <div className="flex-1 overflow-y-auto relative custom-scrollbar">

                    {/* Current Time Laser Line */}
                    {isSameDay(selectedDate, new Date()) && timePos !== null && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute left-0 w-full border-t border-neon-red z-20 pointer-events-none flex items-center"
                            style={{ top: `${timePos}px` }}
                        >
                            <div className="w-2 h-2 -ml-1 rounded-full bg-neon-red shadow-[0_0_10px_#FF2E2E]" />
                            <div className="ml-2 px-2 py-0.5 bg-neon-red/10 rounded text-[10px] font-mono text-neon-red font-bold backdrop-blur-sm border border-neon-red/20">
                                CURRENT TIME
                            </div>
                        </motion.div>
                    )}

                    {/* Grid Rows */}
                    <div className="pb-20">
                        {timeSlots.map((hour) => (
                            <div key={hour} className="flex border-b border-white/5 min-h-[64px] relative group">
                                {/* Time Column */}
                                <div className="w-20 border-r border-white/5 p-2 text-right">
                                    <span className="text-xs font-mono text-text-secondary block">
                                        {hour}:00
                                    </span>
                                </div>

                                {/* Content Area */}
                                <div className="flex-1 p-2 relative">
                                    {/* Grid Lines */}
                                    <div className="absolute inset-x-0 top-1/2 border-t border-white/5 border-dashed opacity-0 group-hover:opacity-30 transition-opacity" />
                                </div>
                            </div>
                        ))}

                        {/* Render Events Absolute */}
                        {getDaySchedule(selectedDate).map((event) => {
                            // Simple conversion: 9:00 starts at 0px. Each hour is 64px.
                            const startHour = parseInt(event.time.split(':')[0])
                            const top = (startHour - 9) * 64
                            const height = event.duration * 64 - 4 // minus gap

                            return (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.02, zIndex: 10 }}
                                    className={`
                    absolute left-20 right-2 mx-2 rounded-lg p-3 border-l-4 overflow-hidden
                    ${event.type === 'Lab'
                                            ? 'bg-neon-purple/20 border-neon-purple/80 hover:bg-neon-purple/30'
                                            : 'bg-neon-blue/20 border-neon-blue/80 hover:bg-neon-blue/30'
                                        }
                  `}
                                    style={{ top: `${top}px`, height: `${height}px` }}
                                >
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-sm text-white truncate">{event.subject}</h4>
                                        <span className="text-[10px] font-mono uppercase opacity-70 px-1.5 py-0.5 rounded bg-black/30">
                                            {event.type}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-xs opacity-80">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {event.time}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {event.room}
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </HolographicCard>
        </div>
    )
}
