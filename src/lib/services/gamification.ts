import { createClient } from '@/lib/supabase/client'

// Gamification Service for badges, XP, streaks (Phase 3)
export class GamificationService {
  private supabase = createClient()

  /**
   * Award XP to student
   */
  async awardXP(
    studentId: string,
    amount: number,
    reason: string,
    source: string
  ): Promise<{
    totalXP: number
    newLevel: number
    leveledUp: boolean
  }> {

    // Get current student XP
    const { data: student, error: fetchError } = await this.supabase
      .from('students')
      .select('total_xp, level')
      .eq('id', studentId)
      .single()

    if (fetchError || !student) throw new Error('Student not found')

    const currentXP = student.total_xp || 0
    const totalXP = currentXP + amount
    const oldLevel = student.level || 1
    const newLevel = this.calculateLevel(totalXP)

    // Update student XP
    const { error: updateError } = await this.supabase
      .from('students')
      .update({
        total_xp: totalXP,
        level: newLevel,
        updated_at: new Date().toISOString()
      })
      .eq('id', studentId)

    if (updateError) throw updateError

    // Create XP transaction record
    const { error: logError } = await this.supabase
      .from('xp_transactions')
      .insert({
        student_id: studentId,
        amount,
        reason,
        source
      })

    if (logError) console.error('Error logging XP transaction:', logError)

    return {
      totalXP,
      newLevel,
      leveledUp: newLevel > oldLevel,
    }
  }

  /**
   * Calculate level from XP
   */
  calculateLevel(xp: number): number {
    return Math.floor(Math.sqrt(xp / 100)) + 1
  }

  /**
   * Calculate XP needed for next level
   */
  calculateXPForNextLevel(currentLevel: number): number {
    return (currentLevel * currentLevel) * 100
  }

  /**
   * Update streak
   */
  async updateStreak(
    studentId: string,
    streakType: 'attendance' | 'study' | 'assignment' | 'login'
  ): Promise<{
    currentStreak: number
    longestStreak: number
    newAchievement?: any
  }> {
    const today = new Date().toISOString().split('T')[0]

    // Query for existing streak
    const { data: streaks } = await this.supabase
      .from('streaks')
      .select('*')
      .eq('student_id', studentId)
      .eq('streak_type', streakType)
      .limit(1)

    let currentStreak = 1
    let longestStreak = 1
    let streakId: string | null = null
    const existingStreak = streaks?.[0]

    if (existingStreak) {
      streakId = existingStreak.id
      const lastDate = new Date(existingStreak.last_activity_date)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        // Continue streak
        currentStreak = existingStreak.current_streak + 1
        longestStreak = Math.max(currentStreak, existingStreak.longest_streak)
      } else if (diffDays > 1) {
        // Streak broken, restart
        currentStreak = 1
        longestStreak = existingStreak.longest_streak
      } else {
        // Same day, no update needed
        return {
          currentStreak: existingStreak.current_streak,
          longestStreak: existingStreak.longest_streak
        }
      }
    }

    // Update or create streak
    if (streakId) {
      await this.supabase
        .from('streaks')
        .update({
          current_streak: currentStreak,
          longest_streak: longestStreak,
          last_activity_date: today,
          updated_at: new Date().toISOString()
        })
        .eq('id', streakId)
    } else {
      await this.supabase
        .from('streaks')
        .insert({
          student_id: studentId,
          streak_type: streakType,
          current_streak: currentStreak,
          longest_streak: longestStreak,
          last_activity_date: today
        })
    }

    const streakCount = currentStreak

    // Check for streak achievements
    let newAchievement = null
    if (streakCount === 7) {
      newAchievement = await this.unlockAchievement(studentId, 'week_streak', streakType)
    } else if (streakCount === 30) {
      newAchievement = await this.unlockAchievement(studentId, 'month_streak', streakType)
    } else if (streakCount === 100) {
      newAchievement = await this.unlockAchievement(studentId, 'century_streak', streakType)
    }

    return {
      currentStreak: streakCount,
      longestStreak: Math.max(longestStreak, streakCount),
      newAchievement,
    }
  }

  /**
   * Unlock achievement
   */
  async unlockAchievement(
    studentId: string,
    badgeType: string,
    context?: string
  ): Promise<any> {
    // Check if already unlocked
    const { data: existing } = await this.supabase
      .from('achievements')
      .select('id')
      .eq('student_id', studentId)
      .eq('achievement_id', badgeType) // Using achievement_id based on schema

    if (existing && existing.length > 0) return null

    const achievement = this.getAchievementDetails(badgeType, context)

    const { data: inserted, error } = await this.supabase
      .from('achievements')
      .insert({
        student_id: studentId,
        achievement_id: badgeType,
        ...achievement,
        unlocked_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error || !inserted) {
      console.error("Error unlocking achievement", error)
      return null
    }

    // Award XP for the achievement
    if (achievement.xp_earned) {
      await this.awardXP(studentId, achievement.xp_earned, `Unlocked ${achievement.title}`, 'achievement')
    }

    return inserted
  }

  /**
   * Get achievement details
   * (Static definition kept same as before, but ensure matching types)
   */
  private getAchievementDetails(badgeType: string, context?: string) {
    const achievements: Record<string, any> = {
      // Attendance Achievements
      perfect_week: {
        title: 'Perfect Week',
        description: '100% attendance for 1 week straight',
        icon: '🎯',
        rarity: 'common',
        xp_earned: 50,
      },
      week_streak: {
        title: '7-Day Streak',
        description: 'Maintained your streak for 7 days',
        icon: '🔥',
        rarity: 'common',
        xp_earned: 100,
      },
      month_streak: {
        title: '30-Day Streak',
        description: 'Maintained your streak for 30 days',
        icon: '⭐',
        rarity: 'rare',
        xp_earned: 500,
      },
      century_streak: {
        title: 'Century Streak',
        description: '100 days of consistency!',
        icon: '🏆',
        rarity: 'legendary',
        xp_earned: 2000,
      },
      // Grade Achievements
      first_a_plus: {
        title: 'First A+',
        description: 'Scored your first A+ grade',
        icon: '📚',
        rarity: 'common',
        xp_earned: 100,
      },
      dean_list: {
        title: 'Dean\'s List',
        description: 'Achieved 9+ CGPA',
        icon: '🎓',
        rarity: 'epic',
        xp_earned: 1000,
      },
      all_rounder: {
        title: 'All-Rounder',
        description: 'A+ in all subjects this semester',
        icon: '🌟',
        rarity: 'legendary',
        xp_earned: 2500,
      },
      // Assignment Achievements
      early_bird: {
        title: 'Early Bird',
        description: 'Submitted 10 assignments early',
        icon: '🐦',
        rarity: 'common',
        xp_earned: 150,
      },
      // Social Achievements
      helpful_peer: {
        title: 'Helpful Peer',
        description: 'Helped 10 classmates with notes',
        icon: '🤝',
        rarity: 'rare',
        xp_earned: 400,
      },
      // Recovery
      attendance_recovery: {
        title: 'Recovery Master',
        description: 'Brought attendance from danger to safe zone',
        icon: '💪',
        rarity: 'rare',
        xp_earned: 600,
      },
    }

    return achievements[badgeType] || achievements.perfect_week
  }

  /**
   * Get student's total XP
   */
  async getTotalXP(studentId: string): Promise<number> {
    const { data: student } = await this.supabase
      .from('students')
      .select('total_xp')
      .eq('id', studentId)
      .single()
    return student?.total_xp || 0
  }
}

export const gamificationService = new GamificationService()
