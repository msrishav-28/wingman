"use client"

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Download } from 'lucide-react'

interface HolographicIDProps {
    studentName: string
    rollNumber: string
    department: string
    year: string
    profileImage?: string
    className?: string
}

export default function HolographicID({
    studentName = "CADET UNKNOWN",
    rollNumber = "000000",
    department = "ENGINEERING",
    year = "2026",
    profileImage,
    className
}: HolographicIDProps) {
    const ref = useRef<HTMLDivElement>(null)

    // Mouse position state
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    // Spring physics for smooth tilt
    const mouseX = useSpring(x, { stiffness: 150, damping: 15 })
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 })

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        const mouseXVal = e.clientX - rect.left
        const mouseYVal = e.clientY - rect.top

        // Calculate rotation (max 15 degrees)
        const rotateXVal = ((mouseYVal - height / 2) / height) * -15
        const rotateYVal = ((mouseXVal - width / 2) / width) * 15

        x.set(rotateYVal)
        y.set(rotateXVal)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    // Holographic sheen transform
    const sheenGradient = useTransform(
        [mouseX, mouseY],
        ([latestX, latestY]) => `linear-gradient(${115 + latestX * 2}deg, transparent 30%, rgba(255, 255, 255, 0.4) 45%, rgba(0, 255, 148, 0.2) 50%, rgba(255, 255, 255, 0.4) 55%, transparent 70%)`
    )

    return (
        <div className="perspective-1000 w-full max-w-sm mx-auto">
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX: mouseY,
                    rotateY: mouseX,
                    transformStyle: "preserve-3d",
                }}
                className={cn(
                    "relative aspect-[1.58/1] rounded-xl bg-black border border-white/10 shadow-2xl overflow-hidden cursor-pointer group",
                    className
                )}
            >
                {/* Background Texture - Mesh */}
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />

                {/* Content Layer (Raised in Z) */}
                <div
                    className="relative z-10 w-full h-full p-6 flex flex-col justify-between select-none"
                    style={{ transform: "translateZ(30px)" }}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] text-neon-green tracking-widest font-mono mb-1">IDENTIFICATION</p>
                            <h2 className="text-2xl font-display font-bold text-white uppercase leading-none">{studentName}</h2>
                        </div>
                        <div className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center overflow-hidden">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-neon-purple to-neon-blue opacity-50" />
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[9px] text-zinc-500 font-mono tracking-wider">ROLL NO</p>
                                <p className="text-lg font-mono font-bold text-white">{rollNumber}</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-zinc-500 font-mono tracking-wider">EXPIRY</p>
                                <p className="text-lg font-mono font-bold text-neon-green">{year}</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                            <div>
                                <p className="text-[9px] text-zinc-500 font-mono tracking-wider">DEPARTMENT</p>
                                <p className="text-sm font-bold text-white uppercase">{department}</p>
                            </div>
                            <div className="text-xs font-mono text-zinc-600">
                                [SECURE_ACCESS]
                            </div>
                        </div>
                    </div>
                </div>

                {/* Holographic Overlay */}
                <motion.div
                    className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay"
                    style={{ background: sheenGradient }}
                />

                {/* Border Glow */}
                <div className="absolute inset-0 border border-white/5 rounded-xl z-30 group-hover:border-neon-green/30 transition-colors" />

            </motion.div>

            <div className="mt-4 flex justify-center">
                <button className="text-xs flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                    <Download className="w-3 h-3" /> Save to Wallet
                </button>
            </div>
        </div>
    )
}
