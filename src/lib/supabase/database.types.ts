export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            students: {
                Row: {
                    id: string
                    email: string | null
                    name: string | null
                    department: string | null
                    year: number | null
                    semester: number | null
                    total_xp: number
                    level: number
                    avatar_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    name?: string | null
                    department?: string | null
                    year?: number | null
                    semester?: number | null
                    total_xp?: number
                    level?: number
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    name?: string | null
                    department?: string | null
                    year?: number | null
                    semester?: number | null
                    total_xp?: number
                    level?: number
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            subjects: {
                Row: {
                    id: string
                    student_id: string
                    name: string
                    code: string | null
                    credits: number
                    professor: string | null
                    room: string | null
                    color: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    student_id: string
                    name: string
                    code?: string | null
                    credits?: number
                    professor?: string | null
                    room?: string | null
                    color?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    student_id?: string
                    name?: string
                    code?: string | null
                    credits?: number
                    professor?: string | null
                    room?: string | null
                    color?: string | null
                    created_at?: string
                }
            }
            attendance: {
                Row: {
                    id: string
                    student_id: string
                    subject_id: string
                    status: 'present' | 'absent' | 'medical' | 'cancelled'
                    date: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    student_id: string
                    subject_id: string
                    status: 'present' | 'absent' | 'medical' | 'cancelled'
                    date?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    student_id?: string
                    subject_id?: string
                    status?: 'present' | 'absent' | 'medical' | 'cancelled'
                    date?: string
                    created_at?: string
                }
            }
            grades: {
                Row: {
                    id: string
                    student_id: string
                    subject_id: string
                    exam_type: string
                    marks_obtained: number
                    total_marks: number
                    grade_letter: string | null
                    semester: number | null
                    exam_date: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    student_id: string
                    subject_id: string
                    exam_type: string
                    marks_obtained: number
                    total_marks: number
                    grade_letter?: string | null
                    semester?: number | null
                    exam_date?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    student_id?: string
                    subject_id?: string
                    exam_type?: string
                    marks_obtained?: number
                    total_marks?: number
                    grade_letter?: string | null
                    semester?: number | null
                    exam_date?: string | null
                    created_at?: string
                }
            }
            assignments: {
                Row: {
                    id: string
                    student_id: string
                    subject_id: string
                    title: string
                    description: string | null
                    due_date: string | null
                    priority: 'low' | 'medium' | 'high'
                    status: 'pending' | 'completed' | 'overdue'
                    created_at: string
                }
                Insert: {
                    id?: string
                    student_id: string
                    subject_id: string
                    title: string
                    description?: string | null
                    due_date?: string | null
                    priority?: 'low' | 'medium' | 'high'
                    status?: 'pending' | 'completed' | 'overdue'
                    created_at?: string
                }
                Update: {
                    id?: string
                    student_id?: string
                    subject_id?: string
                    title?: string
                    description?: string | null
                    due_date?: string | null
                    priority?: 'low' | 'medium' | 'high'
                    status?: 'pending' | 'completed' | 'overdue'
                    created_at?: string
                }
            }
            achievements: {
                Row: {
                    id: string
                    student_id: string
                    achievement_id: string
                    title: string
                    description: string | null
                    icon: string | null
                    rarity: 'common' | 'rare' | 'epic' | 'legendary' | null
                    xp_earned: number
                    unlocked_at: string
                }
                Insert: {
                    id?: string
                    student_id: string
                    achievement_id: string
                    title: string
                    description?: string | null
                    icon?: string | null
                    rarity?: 'common' | 'rare' | 'epic' | 'legendary' | null
                    xp_earned?: number
                    unlocked_at?: string
                }
                Update: {
                    id?: string
                    student_id?: string
                    achievement_id?: string
                    title?: string
                    description?: string | null
                    icon?: string | null
                    rarity?: 'common' | 'rare' | 'epic' | 'legendary' | null
                    xp_earned?: number
                    unlocked_at?: string
                }
            }
            xp_transactions: {
                Row: {
                    id: string
                    student_id: string
                    amount: number
                    reason: string | null
                    source: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    student_id: string
                    amount: number
                    reason?: string | null
                    source?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    student_id?: string
                    amount?: number
                    reason?: string | null
                    source?: string | null
                    created_at?: string
                }
            }
            streaks: {
                Row: {
                    id: string
                    student_id: string
                    streak_type: string
                    current_streak: number
                    longest_streak: number
                    last_activity_date: string | null
                    updated_at: string
                }
                Insert: {
                    id?: string
                    student_id: string
                    streak_type: string
                    current_streak?: number
                    longest_streak?: number
                    last_activity_date?: string | null
                    updated_at?: string
                }
                Update: {
                    id?: string
                    student_id?: string
                    streak_type?: string
                    current_streak?: number
                    longest_streak?: number
                    last_activity_date?: string | null
                    updated_at?: string
                }
            }
            ai_messages: {
                Row: {
                    id: string
                    conversation_id: string
                    role: 'user' | 'assistant' | 'system'
                    content: string
                    tokens_used: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    conversation_id: string
                    role: 'user' | 'assistant' | 'system'
                    content: string
                    tokens_used?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    conversation_id?: string
                    role?: 'user' | 'assistant' | 'system'
                    content?: string
                    tokens_used?: number | null
                    created_at?: string
                }
            }
            predictions: {
                Row: {
                    id: string
                    student_id: string
                    subject_id: string | null
                    model_version: string | null
                    prediction_type: string | null
                    predicted_value: number | null
                    confidence: number | null
                    features_used: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    student_id: string
                    subject_id?: string | null
                    model_version?: string | null
                    prediction_type?: string | null
                    predicted_value?: number | null
                    confidence?: number | null
                    features_used?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    student_id?: string
                    subject_id?: string | null
                    model_version?: string | null
                    prediction_type?: string | null
                    predicted_value?: number | null
                    confidence?: number | null
                    features_used?: Json | null
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
