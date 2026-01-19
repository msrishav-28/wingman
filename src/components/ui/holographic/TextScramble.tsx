"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TextScrambleProps {
    value: string | number
    className?: string
    duration?: number
    trigger?: boolean
}

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"

export default function TextScramble({ value, className, duration = 1000, trigger = true }: TextScrambleProps) {
    const [displayValue, setDisplayValue] = useState(value)
    const targetValue = String(value)

    useEffect(() => {
        if (!trigger) return

        let startTime: number
        let animationFrame: number

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = timestamp - startTime

            if (progress < duration) {
                setDisplayValue(
                    targetValue
                        .split("")
                        .map((char, index) => {
                            if (index < (progress / duration) * targetValue.length) {
                                return targetValue[index]
                            }
                            return chars[Math.floor(Math.random() * chars.length)]
                        })
                        .join("")
                )
                animationFrame = requestAnimationFrame(animate)
            } else {
                setDisplayValue(targetValue)
            }
        }

        animationFrame = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animationFrame)
    }, [value, duration, targetValue, trigger])

    return (
        <motion.span className={cn("font-mono mono-nums", className)}>
            {displayValue}
        </motion.span>
    )
}
