'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import HolographicCard from '@/components/ui/holographic/HolographicCard'
import { UserPlus, Cpu } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    college_name: '',
    department: '',
    year: 1,
    semester: 1,
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.name || !formData.college_name) {
      toast.error('MANDATORY_FIELDS_MISSING')
      return
    }

    setLoading(true)

    try {
      // Send magic link
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: formData.name,
            college_name: formData.college_name,
            department: formData.department,
            year: formData.year,
            semester: formData.semester,
          },
        },
      })

      if (authError) throw authError

      toast.success('VERIFICATION_LINK_SENT', {
        style: {
          background: '#050505',
          color: '#00FF94',
          border: '1px solid #00FF94'
        }
      })

    } catch (error: any) {
      toast.error(error.message || 'REGISTRATION FAILED')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background-DEFAULT relative overflow-hidden">
      {/* Background Mesh */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <HolographicCard className="w-full max-w-md border-neon-purple/30 relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-neon-purple/10 border border-neon-purple/50 flex items-center justify-center shadow-[0_0_30px_rgba(123,97,255,0.3)]">
            <Cpu className="w-8 h-8 text-neon-purple" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-2 text-white">
            NEW CADET
          </h1>
          <p className="text-text-secondary font-mono text-xs tracking-widest uppercase">
            Initialize Profile Sequence
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            type="text"
            label="Designation (Name) *"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={loading}
          />

          <Input
            type="email"
            label="Neural Link (Email) *"
            placeholder="cadet@academy.edu"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={loading}
          />

          <Input
            type="text"
            label="Base of Operations (College) *"
            placeholder="Institute of Technology"
            value={formData.college_name}
            onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
            disabled={loading}
          />

          <Input
            type="text"
            label="Sector (Branch/Dept)"
            placeholder="Computer Science"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            disabled={loading}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Year Level"
              min="1"
              max="5"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              disabled={loading}
            />

            <Input
              type="number"
              label="Cycle (Semester)"
              min="1"
              max="10"
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            variant="primary" // Assuming primary maps to a purplish gradient or we can change to 'neon' if configured for purple
            className="w-full rounded-none skew-x-[-10deg] border border-neon-purple/50 mt-6 bg-neon-purple/10 hover:bg-neon-purple/20 text-neon-purple"
            isLoading={loading}
          >
            <span className="skew-x-[10deg] flex items-center justify-center gap-2 font-mono tracking-widest">
              <UserPlus className="w-4 h-4" /> INITIALIZE
            </span>
          </Button>
        </form>

        <div className="mt-6 text-center border-t border-white/5 pt-6">
          <p className="text-xs text-text-secondary font-mono">
            EXISTING PROFILE?{' '}
            <a href="/login" className="text-neon-purple hover:text-white transition-colors border-b border-neon-purple/50 pb-0.5">
              ACCESS LOGIN
            </a>
          </p>
        </div>
      </HolographicCard>
    </div>
  )
}
