'use client'

import { motion } from 'framer-motion'
import { Zap, Lock } from 'lucide-react'
import HolographicCard from '@/components/ui/holographic/HolographicCard'

interface AchievementBadgeProps {
  title: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  xpEarned: number
  unlocked: boolean
  unlockedAt?: string
}

export default function AchievementBadge({
  title,
  description,
  icon,
  rarity,
  xpEarned,
  unlocked,
  unlockedAt,
}: AchievementBadgeProps) {

  const rarityConfig = {
    common: { border: 'border-white/20', bg: 'bg-white/5', text: 'text-white', glow: 'shadow-none' },
    rare: { border: 'border-neon-blue/50', bg: 'bg-neon-blue/10', text: 'text-neon-blue', glow: 'shadow-[0_0_15px_rgba(0,212,255,0.3)]' },
    epic: { border: 'border-neon-purple/50', bg: 'bg-neon-purple/10', text: 'text-neon-purple', glow: 'shadow-[0_0_15px_rgba(123,97,255,0.3)]' },
    legendary: { border: 'border-neon-yellow/50', bg: 'bg-neon-yellow/10', text: 'text-neon-yellow', glow: 'shadow-[0_0_20px_rgba(255,217,61,0.5)]' },
  }

  const config = rarityConfig[rarity]

  return (
    <HolographicCard
      className={`relative group ${unlocked ? config.border : 'border-white/5'} ${unlocked ? config.glow : ''}`}
      hoverEffect={unlocked}
    >
      {/* Badge Icon */}
      <div className="text-center mb-4 relative z-10">
        <div className={`
          inline-flex items-center justify-center
          w-20 h-20 rounded-full text-4xl border
          ${unlocked ? `${config.bg} ${config.border} ${config.text}` : 'bg-white/5 border-white/5 text-white/10 grayscale'}
          transition-all duration-500 group-hover:scale-110
        `}>
          {icon}
        </div>
      </div>

      {/* Badge Info */}
      <div className="text-center relative z-10">
        <h3 className={`font-display font-bold mb-1 ${unlocked ? 'text-white' : 'text-text-muted'}`}>{title}</h3>
        <p className="text-xs font-mono text-text-secondary mb-3">{description}</p>

        {/* XP Badge */}
        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase border ${unlocked ? 'border-neon-green/30 bg-neon-green/10 text-neon-green' : 'border-white/10 bg-white/5 text-white/20'}`}>
          <Zap className="w-3 h-3" />
          +{xpEarned} XP
        </div>

        {/* Unlock Date */}
        {unlocked && unlockedAt && (
          <p className="text-[10px] font-mono text-text-secondary mt-3 opacity-80">
            UNLOCKED: {new Date(unlockedAt).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Rarity Label */}
      <div className="absolute top-2 right-2">
        <span className={`
          px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-widest border
          ${unlocked ? `${config.bg} ${config.border} ${config.text}` : 'bg-white/5 border-white/5 text-white/20'}
        `}>
          {rarity}
        </span>
      </div>

      {/* Locked Overlay */}
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="opacity-20 rotate-12 select-none border-2 border-white/20 p-4 rounded-full">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>
      )}
    </HolographicCard>
  )
}
