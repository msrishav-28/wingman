"use client"

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Check, ChevronRight } from 'lucide-react'

interface LiquidSwipeProps {
    onConfirm?: () => void
    label?: string
    confirmLabel?: string
    className?: string
}

export default function LiquidSwipe({
    onConfirm,
    label = "SWIPE TO MARK",
    confirmLabel = "MARKED",
    className
}: LiquidSwipeProps) {
    const x = useMotionValue(0)
    const maxDrag = 200
    const dragConstraintsRef = { left: 0, right: maxDrag }

    const opacity = useTransform(x, [0, maxDrag - 50], [1, 0])
    const bgOpacity = useTransform(x, [0, maxDrag], [0, 1])
    const [confirmed, setConfirmed] = useState(false)

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x > 100 && !confirmed) {
            setConfirmed(true)
            if (navigator.vibrate) navigator.vibrate(50) // Heavy thud
            if (onConfirm) onConfirm()
        }
    }

    return (
        <div className={cn("relative w-full h-16 rounded-xl overflow-hidden bg-black/40 border border-white/10 backdrop-blur-sm select-none", className)}>

            {/* Success State Background */}
            <motion.div
                className="absolute inset-0 bg-neon-green flex items-center justify-center font-bold text-black tracking-widest"
                style={{ opacity: bgOpacity }}
            >
                <div className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    {confirmLabel}
                </div>
            </motion.div>

            {/* Swipeable Handle */}
            <motion.div
                drag="x"
                dragConstraints={confirmed ? { left: 0, right: 0 } : { left: 0, right: maxDrag }}
                dragElastic={0.7} // "Sticky/Heavy" feel
                dragMomentum={false}
                dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
                onDrag={(event, info) => {
                    // Haptic feedback as you drag
                    if (info.offset.x > 50 && info.offset.x < 55) {
                        if (navigator.vibrate) navigator.vibrate(10)
                    }
                    if (info.offset.x > 100 && info.offset.x < 105) {
                        if (navigator.vibrate) navigator.vibrate([10, 30])
                    }
                }}
                onDragEnd={handleDragEnd}
                style={{ x }}
                whileTap={{ cursor: "grabbing" }}
                className="absolute top-1 bottom-1 left-1 w-14 bg-white/10 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-white/20 transition-colors z-20 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
                <ChevronRight className="w-6 h-6 text-white" />
            </motion.div>

            {/* Label Text */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center text-xs font-mono text-white/50 tracking-widest pointer-events-none z-10 ml-8"
                style={{ opacity }}
            >
                {label} {'>>>'}
            </motion.div>
        </div>
    )
}
