import { createClient } from '@/lib/supabase/client'

// ML Prediction Service for advanced analytics (Phase 4) - Supabase Version
export class MLPredictionService {
  private supabase = createClient()
  /**
   * Predict final grade based on mid-sem performance and attendance
   */
  async predictFinalGrade(
    studentId: string,
    subjectId: string
  ): Promise<{
    predictedGrade: number
    confidence: number
    factors: {
      midSemImpact: number
      attendanceImpact: number
      trendImpact: number
    }
  }> {
    // Get mid-sem grades
    const { data: midSemGrades } = await this.supabase
      .from('grades')
      .select('*')
      .eq('student_id', studentId)
      .eq('subject_id', subjectId)
      .eq('exam_type', 'mid')

    // Get attendance records
    const { data: attendanceRecords } = await this.supabase
      .from('attendance')
      .select('*')
      .eq('student_id', studentId)
      .eq('subject_id', subjectId)

    if (!midSemGrades || midSemGrades.length === 0 || !attendanceRecords || attendanceRecords.length === 0) {
      throw new Error('Insufficient data for prediction')
    }

    const midSemGrade = midSemGrades[0]

    // Calculate attendance percentage
    const totalClasses = attendanceRecords.length
    const presentClasses = attendanceRecords.filter((a: any) => a.status === 'present').length
    const attendancePercentage = (presentClasses / totalClasses) * 100

    // Simple ML model (linear regression approximation)
    const midSemPercentage = (midSemGrade.marks_obtained / midSemGrade.total_marks) * 100

    // Weights: mid-sem 60%, attendance 40%
    let predictedPercentage = midSemPercentage * 0.6 + attendancePercentage * 0.4

    // Adjust for attendance impact
    if (attendancePercentage < 75) {
      predictedPercentage *= 0.85 // Penalty for low attendance
    }

    const confidence = this.calculateConfidence(totalClasses, midSemGrade.marks_obtained)

    // Save prediction
    // Note: 'predictions' table not in initial schema, would need to be added or this call removed/refactored
    // For now, logging to console as placeholder or suggesting schema update.
    // await this.supabase.from('predictions').insert(...) 

    return {
      predictedGrade: Math.round(predictedPercentage),
      confidence,
      factors: {
        midSemImpact: midSemPercentage * 0.6,
        attendanceImpact: attendancePercentage * 0.4,
        trendImpact: 0,
      },
    }
  }

  /**
   * Predict semester CGPA
   */
  async predictSemesterCGPA(
    studentId: string,
    semester: number
  ): Promise<{
    predictedCGPA: number
    confidence: number
    subjectPredictions: any[]
  }> {
    // Get all subjects for the semester
    const { data: subjects } = await this.supabase
      .from('subjects')
      .select('*')
      .eq('student_id', studentId)

    const subjectPredictions: any[] = []
    let totalPredictedMarks = 0
    let totalCredits = 0

    if (!subjects) return { predictedCGPA: 0, confidence: 0, subjectPredictions: [] }

    for (const subject of subjects) {
      try {
        const prediction = await this.predictFinalGrade(studentId, subject.id)
        subjectPredictions.push({
          subjectName: subject.name,
          predictedGrade: prediction.predictedGrade,
          confidence: prediction.confidence,
        })

        totalPredictedMarks += prediction.predictedGrade * subject.credits
        totalCredits += subject.credits
      } catch (error) {
        // Skip subjects with insufficient data
        console.warn(`Skipping prediction for ${subject.name}:`, error)
      }
    }

    const predictedCGPA = totalCredits > 0 ? (totalPredictedMarks / totalCredits) / 10 : 0
    const confidence = subjects.length > 0 ? subjectPredictions.length / subjects.length : 0

    return {
      predictedCGPA,
      confidence,
      subjectPredictions,
    }
  }

  /**
   * Identify at-risk students
   */
  async identifyRisks(
    studentId: string
  ): Promise<{
    overallRisk: 'low' | 'medium' | 'high'
    risks: Array<{
      type: string
      severity: 'low' | 'medium' | 'high'
      description: string
      recommendations: string[]
    }>
  }> {
    const risks: any[] = []

    // Check attendance
    const { data: attendanceRecords } = await this.supabase
      .from('attendance')
      .select('*')
      .eq('student_id', studentId)

    if (attendanceRecords && attendanceRecords.length > 0) {
      const presentCount = attendanceRecords.filter((a: any) => a.status === 'present').length
      const attendancePercentage = (presentCount / attendanceRecords.length) * 100

      if (attendancePercentage < 75) {
        risks.push({
          type: 'attendance',
          severity: 'high',
          description: `Attendance at ${attendancePercentage.toFixed(1)}% (below 75% threshold)`,
          recommendations: [
            'Attend all upcoming classes',
            'Consider requesting medical leave documentation if applicable',
            'Meet with professors to discuss attendance concerns',
          ],
        })
      } else if (attendancePercentage < 85) {
        risks.push({
          type: 'attendance',
          severity: 'medium',
          description: `Attendance at ${attendancePercentage.toFixed(1)}% (below 85% safe zone)`,
          recommendations: [
            'Try to improve attendance to above 85%',
            'Avoid missing classes unless necessary',
          ],
        })
      }
    }

    // Check grades
    const { data: grades } = await this.supabase
      .from('grades')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(5)

    if (grades && grades.length > 0) {
      const avgPercentage = grades.reduce((sum: number, g: any) =>
        sum + (g.marks_obtained / g.total_marks * 100), 0) / grades.length

      if (avgPercentage < 50) {
        risks.push({
          type: 'academics',
          severity: 'high',
          description: `Average grade at ${avgPercentage.toFixed(1)}% (failing)`,
          recommendations: [
            'Seek tutoring or academic support',
            'Review study methods and time management',
            'Consult with professors during office hours',
            'Consider forming study groups',
          ],
        })
      } else if (avgPercentage < 65) {
        risks.push({
          type: 'academics',
          severity: 'medium',
          description: `Average grade at ${avgPercentage.toFixed(1)}% (below average)`,
          recommendations: [
            'Increase study time for difficult subjects',
            'Practice past papers and assignments',
            'Attend tutorial sessions',
          ],
        })
      }
    }

    // Calculate overall risk
    const highRisks = risks.filter(r => r.severity === 'high').length
    const mediumRisks = risks.filter(r => r.severity === 'medium').length

    let overallRisk: 'low' | 'medium' | 'high' = 'low'
    if (highRisks > 0) {
      overallRisk = 'high'
    } else if (mediumRisks > 0) {
      overallRisk = 'medium'
    }

    return {
      overallRisk,
      risks,
    }
  }

  /**
   * Calculate optimal study time allocation
   */
  async calculateStudyTimeAllocation(
    studentId: string,
    totalHoursPerWeek: number
  ): Promise<{
    subjectAllocations: Array<{
      subjectName: string
      hoursPerWeek: number
      priority: 'high' | 'medium' | 'low'
      reason: string
    }>
    totalHoursPerWeek: number
  }> {
    // Get subjects
    const { data: subjects } = await this.supabase
      .from('subjects')
      .select('*')
      .eq('student_id', studentId)

    if (!subjects) return { subjectAllocations: [], totalHoursPerWeek }

    // Get grades for each subject
    const allocations: any[] = []

    for (const subject of subjects) {
      const { data: grades } = await this.supabase
        .from('grades')
        .select('*')
        .eq('student_id', studentId)
        .eq('subject_id', subject.id)

      const { data: attendance } = await this.supabase
        .from('attendance')
        .select('*')
        .eq('student_id', studentId)
        .eq('subject_id', subject.id)

      // Calculate priority based on performance and attendance
      let priority: 'high' | 'medium' | 'low' = 'medium'
      let reason = 'Balanced study time'
      let weight = 1

      if (grades && grades.length > 0) {
        const avgPercentage = grades.reduce((sum: number, g: any) =>
          sum + (g.marks_obtained / g.total_marks * 100), 0) / grades.length

        if (avgPercentage < 60) {
          priority = 'high'
          reason = 'Low grades - needs more focus'
          weight = 1.5
        } else if (avgPercentage > 85) {
          priority = 'low'
          reason = 'Strong performance - maintain current effort'
          weight = 0.7
        }
      }

      if (attendance && attendance.length > 0) {
        const attendancePercentage = attendance.filter((a: any) => a.status === 'present').length / attendance.length * 100
        if (attendancePercentage < 75) {
          priority = 'high'
          reason = 'Critical: Low attendance affecting understanding'
          weight = Math.max(weight, 1.8)
        }
      }

      allocations.push({
        subjectName: subject.name,
        priority,
        reason,
        weight,
        credits: subject.credits || 3,
      })
    }

    // Calculate hours based on weights
    const totalWeight = allocations.reduce((sum: number, a: any) => sum + a.weight * a.credits, 0)

    allocations.forEach(alloc => {
      alloc.hoursPerWeek = Math.round((alloc.weight * alloc.credits / totalWeight) * totalHoursPerWeek * 10) / 10
    })

    return {
      subjectAllocations: allocations.map(({ weight, credits, ...rest }) => rest),
      totalHoursPerWeek,
    }
  }

  /**
   * Calculate confidence level
   */
  private calculateConfidence(sampleSize: number, performance: number): number {
    // Simple confidence calculation based on data availability
    const sizeFactor = Math.min(sampleSize / 30, 1) // Max confidence with 30+ data points
    const performanceFactor = performance > 0 ? 0.9 : 0.5
    return sizeFactor * performanceFactor
  }
}

export const mlPredictionService = new MLPredictionService()
