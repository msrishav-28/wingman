import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/database.types'

type Assignment = Database['public']['Tables']['assignments']['Row']
type CreateAssignmentDTO = Database['public']['Tables']['assignments']['Insert']

export class AssignmentService {
    private supabase = createClient()

    /**
     * Get all assignments for the current student
     */
    async getAssignments(studentId: string) {
        const { data, error } = await this.supabase
            .from('assignments')
            .select(`
                *,
                subjects (
                    name,
                    code,
                    color
                )
            `)
            .eq('student_id', studentId)
            .order('due_date', { ascending: true })

        if (error) throw error
        return data
    }

    /**
     * Create a new assignment
     */
    async createAssignment(assignment: CreateAssignmentDTO) {
        const { data, error } = await this.supabase
            .from('assignments')
            .insert(assignment)
            .select()
            .single()

        if (error) throw error
        return data
    }

    /**
     * Update assignment status
     */
    async updateStatus(id: string, status: 'pending' | 'completed' | 'overdue') {
        const { data, error } = await this.supabase
            .from('assignments')
            .update({ status })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    }

    /**
     * Delete an assignment
     */
    async deleteAssignment(id: string) {
        const { error } = await this.supabase
            .from('assignments')
            .delete()
            .eq('id', id)

        if (error) throw error
    }
}

export const assignmentService = new AssignmentService()
