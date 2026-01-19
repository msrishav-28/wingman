'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import HolographicCard from '@/components/ui/holographic/HolographicCard'
import { Shield, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error('IDENTITY_REQUIRED')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error

      toast.success('MAGIC_LINK_DISPATCHED', {
        style: {
          background: '#050505',
          color: '#00FF94',
          border: '1px solid #00FF94'
        }
      })
      setEmail('')
    } catch (error: any) {
      toast.error(error.message || 'ACCESS DENIED')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background-DEFAULT relative overflow-hidden">
      {/* Background Mesh */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <HolographicCard className="w-full max-w-md border-neon-blue/30 relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-neon-blue/10 border border-neon-blue/50 flex items-center justify-center shadow-[0_0_30px_rgba(0,212,255,0.3)]">
            <Shield className="w-8 h-8 text-neon-blue" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-2 text-white tracking-tight">
            SYSTEM ACCESS
          </h1>
          <p className="text-text-secondary font-mono text-xs tracking-widest uppercase">
            Identify yourself, Pilot
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            type="email"
            label="Neural Link (Email)"
            placeholder="pilot@academy.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full rounded-none skew-x-[-10deg] border border-neon-blue/50 hover:bg-neon-blue/20"
            isLoading={loading}
          >
            <span className="skew-x-[10deg] flex items-center justify-center gap-2 font-mono tracking-widest">
              <Lock className="w-4 h-4" /> INITIATE LINK
            </span>
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-xs text-text-secondary font-mono">
            NO CREDENTIALS?{' '}
            <a href="/register" className="text-neon-blue hover:text-white transition-colors border-b border-neon-blue/50 pb-0.5">
              REGISTER IDENTITY
            </a>
          </p>
        </div>
      </HolographicCard>
    </div>
  )
}
