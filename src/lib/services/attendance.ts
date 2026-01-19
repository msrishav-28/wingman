import { createClient } from '@/lib/supabase/client'
import { calculateAttendancePercentage } from '@/lib/utils/calculations'

export type AttendanceStatus = 'present' | 'absent' | 'medical' | 'cancelled'

export class AttendanceService {
    private supabase = createClient()

    async getStats(studentId: string) {
        const { data: records, error } = await this.supabase
            .from('attendance')
            .select('status')
            .eq('student_id', studentId)

        if (error) {
            console.error('Error fetching attendance stats:', error)
            return { percentage: 0, total: 0, present: 0 }
        }

        const total = records?.length || 0
        const present = records?.filter(r => r.status === 'present').length || 0
        const percentage = calculateAttendancePercentage(present, total)

        return {
            percentage,
            total,
            present,
            absent: total - present
        }
    }

    async markAttendance(studentId: string, subjectId: string, status: AttendanceStatus, date?: Date) {
        const { data, error } = await this.supabase
            .from('attendance')
            .insert({
                student_id: studentId,
                subject_id: subjectId,
                status,
                date: date ? date.toISOString() : new Date().toISOString()
            })
            .select()
            .single()

        if (error) throw error
        return data
    }

    async getHistory(studentId: string, limit = 5) {
        const { data, error } = await this.supabase
            .from('attendance')
            .select(`
        *,
        subjects (
          name,
          code,
          color
        )
      `)
            .eq('student_id', studentId)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) throw error
        return data
    }
}

export const attendanceService = new AttendanceService()
