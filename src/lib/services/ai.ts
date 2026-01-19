import { createClient } from '@/lib/supabase/client'

// OpenAI Integration for AI Study Buddy (Phase 4)
export class AIService {
  private supabase = createClient()

  /**
   * Send a message to AI Study Buddy
   */
  async sendMessage(
    conversationId: string,
    message: string,
    context?: {
      subjects?: any[]
      attendance?: any
      grades?: any
      recentActivity?: any
    }
  ): Promise<{
    response: string
    conversationId: string
  }> {
    // Build context-aware system message
    const systemMessage = this.buildSystemMessage(context)

    // Get conversation history
    const { data: history } = await this.supabase
      .from('ai_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(10)

    const messages = [
      { role: 'system', content: systemMessage },
      ...(history || []).map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ]

    try {
      // Call Secure Next.js API Route
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          conversation_id: conversationId,
          model: 'gpt-4',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch from AI API')
      }

      const data = await response.json()

      // Database saving is now handled by the API route for security/consistency

      return {
        response: data.response,
        conversationId,
      }
    } catch (error) {
      console.error('AI Service Error:', error)
      throw new Error('Failed to get AI response')
    }
  }

  /**
   * Build context-aware system message
   */
  private buildSystemMessage(context?: any): string {
    let systemMsg = `You are a supportive AI Study Buddy for college students in India. 
You help with academic planning, motivation, study techniques, and emotional support.
Be empathetic, encouraging, and provide actionable advice.`

    if (context?.attendance) {
      systemMsg += `\n\nStudent's Current Attendance: ${context.attendance}%`
      if (context.attendance < 75) {
        systemMsg += ` (CRITICAL - below safe zone)`
      }
    }

    if (context?.grades) {
      systemMsg += `\n\nStudent's Current CGPA: ${context.grades.cgpa}/10`
    }

    if (context?.subjects) {
      systemMsg += `\n\nCurrent Subjects: ${context.subjects.map((s: any) => s.name).join(', ')}`
    }

    return systemMsg
  }

  /**
   * Generate study plan using AI
   */
  async generateStudyPlan(params: {
    subjects: any[]
    examDates: any[]
    hoursPerDay: number
    targetGrades?: any
  }): Promise<{
    plan: any[]
    recommendations: string[]
  }> {
    const prompt = `Create a personalized study plan for a student with:
- Subjects: ${params.subjects.map(s => s.name).join(', ')}
- Available study time: ${params.hoursPerDay} hours/day
- Upcoming exams in: ${params.examDates.length} subjects

Provide a day-by-day breakdown and prioritization strategy.`

    const response = await this.sendMessage('study-plan', prompt)

    return {
      plan: [],
      recommendations: [response.response],
    }
  }

  /**
   * Get motivational message based on performance
   */
  async getMotivationalMessage(performance: {
    attendance: number
    grades: number
    streak: number
  }): Promise<string> {
    const prompt = `Give an encouraging motivational message for a student with:
- Attendance: ${performance.attendance}%
- CGPA: ${performance.grades}/10
- Study streak: ${performance.streak} days

Make it personal and actionable.`

    const response = await this.sendMessage('motivation', prompt)
    return response.response
  }

  /**
   * Analyze stress patterns and provide support
   */
  async analyzeStressPatterns(moodData: any[]): Promise<{
    insights: string[]
    recommendations: string[]
    riskLevel: 'low' | 'medium' | 'high'
  }> {
    const avgStress = moodData.reduce((sum, m) => sum + m.stress_level, 0) / moodData.length

    return {
      insights: [
        `Average stress level: ${avgStress.toFixed(1)}/10`,
        'Stress tends to spike before exams',
      ],
      recommendations: [
        'Consider taking short breaks every hour',
        'Try meditation or breathing exercises',
        'Maintain regular sleep schedule',
      ],
      riskLevel: avgStress > 7 ? 'high' : avgStress > 5 ? 'medium' : 'low',
    }
  }
}

export const aiService = new AIService()
