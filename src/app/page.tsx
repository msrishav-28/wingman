'use client'

import Link from 'next/link'
import { BookOpen, TrendingUp, Calendar, FileText, ChevronRight, Calculator, Shield } from 'lucide-react'
import HolographicCard from '@/components/ui/holographic/HolographicCard'
import GlassTorus from '@/components/ui/holographic/GlassTorus'
import { motion } from 'framer-motion'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden font-body text-text-primary selection:bg-neon-green/30 selection:text-white">

      {/* Background Mesh (Global) */}
      <div className="absolute inset-0 z-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Hero Section */}
      <div className="relative z-10 pt-32 pb-20 lg:pt-48 lg:pb-32 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="text-xs font-mono text-neon-green tracking-widest uppercase">System Online v2.0</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              ACADEMIC <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">INTELLIGENCE</span>
            </h1>

            <p className="text-xl text-text-secondary max-w-lg mb-10 leading-relaxed">
              Advanced telemetry for your student life. Track attendance, predict grades, and manage assignments with military-grade precision.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/register">
                <button className="group relative px-8 py-4 bg-neon-green/10 border border-neon-green/50 text-neon-green font-bold font-mono tracking-wider overflow-hidden hover:bg-neon-green/20 transition-all skew-x-[-10deg]">
                  <span className="flex items-center gap-2 skew-x-[10deg]">
                    INITIALIZE <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  {/* Scanline effect on hover */}
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-[-200%] transition-transform duration-700 blur-md" />
                </button>
              </Link>

              <Link href="/login">
                <button className="px-8 py-4 border border-white/10 text-white font-bold font-mono tracking-wider hover:bg-white/5 transition-all skew-x-[-10deg]">
                  <span className="skew-x-[10deg]">
                    System Access
                  </span>
                </button>
              </Link>
            </div>
          </motion.div>

          <div className="relative h-[400px] lg:h-[600px] w-full flex items-center justify-center pointer-events-none">
            {/* 3D Element */}
            <div className="absolute inset-0">
              <GlassTorus status="safe" />
            </div>
            {/* Decorative Circles */}
            <div className="absolute inset-0 border border-white/5 rounded-full scale-75 animate-pulse" />
            <div className="absolute inset-0 border border-white/5 rounded-full scale-50 opacity-50" />
          </div>

        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-mono text-neon-blue tracking-[0.2em] uppercase mb-4">Core Modules</h2>
          <h3 className="text-3xl md:text-4xl font-display font-bold">OPERATIONAL CAPABILITIES</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-neon-purple" />}
            title="ATTENDANCE PROTOCOL"
            description="Liquid swipe interface to log presence. Real-time safety status indicators."
            delay={0.1}
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8 text-neon-blue" />}
            title="GRADE PROJECTION"
            description="Neural engine for CGPA calculation and target path prediction."
            delay={0.2}
          />
          <FeatureCard
            icon={<FileText className="w-8 h-8 text-neon-pink" />}
            title="ASSIGNMENT LOG"
            description="Centralized deadline tracking with priority-based alerts."
            delay={0.3}
          />
          <FeatureCard
            icon={<BookOpen className="w-8 h-8 text-neon-green" />}
            title="SECURE WALLET"
            description="Encrypted storage for academic credentials and ID cards."
            delay={0.4}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 relative z-10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-mono">ALL SYSTEMS OPERATIONAL</span>
          </div>
          <p className="text-text-muted text-sm font-mono">
            © 2026 STUDENT COMPANION // END OF LINE
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <HolographicCard delay={delay} className="group hover:border-white/20 transition-colors">
      <div className="mb-6 p-4 rounded-xl bg-white/5 w-fit group-hover:scale-110 transition-transform duration-500 border border-white/5 group-hover:border-white/10">
        {icon}
      </div>
      <h3 className="text-lg font-bold font-display mb-3 text-white group-hover:text-neon-blue transition-colors">{title}</h3>
      <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
    </HolographicCard>
  )
}
