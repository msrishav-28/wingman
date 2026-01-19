"use client"

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface HolographicCardProps {
    children: ReactNode
    className?: string
    delay?: number
    hoverEffect?: boolean
}

export default function HolographicCard({ children, className, delay = 0, hoverEffect = true }: HolographicCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={cn(
                "glass-card relative overflow-hidden group p-6",
                "bg-zinc-900/40 backdrop-blur-md border border-white/5",
                "hover:border-white/10 hover:shadow-glow-blue transition-all duration-500",
                className
            )}
        >
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </motion.div>
    )
}
