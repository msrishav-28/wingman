'use client'

import { useAuth } from '@/lib/hooks/use-auth'
import { redirect } from 'next/navigation'
import { Home, Calendar, GraduationCap, Trophy, Bot, Bell, LogOut, User, Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth()
  const pathname = usePathname()
  const [showUserMenu, setShowUserMenu] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="text-center space-y-4">
          <div className="text-neon-purple font-mono text-sm tracking-widest animate-pulse">SYSTEM_LOADING...</div>
          <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-neon-purple w-1/3 animate-[loading_1s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    redirect('/login')
  }

  const navItems = [
    { icon: Home, label: 'Home', href: '/dashboard' },
    { icon: Calendar, label: 'Attendance', href: '/dashboard/attendance' },
    { icon: GraduationCap, label: 'Grades', href: '/dashboard/grades' },
    { icon: Trophy, label: 'Achievements', href: '/dashboard/achievements' },
    { icon: Bot, label: 'AI Buddy', href: '/dashboard/ai-buddy' },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href
    return pathname?.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-neon-purple/30">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/dashboard">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-green rounded-full shadow-[0_0_10px_#00FF94]" />
                <h1 className="text-xl font-display font-bold text-white tracking-wide">
                  STUDENT<span className="text-neon-purple">COMPANION</span>
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg transition-all border font-mono text-sm',
                      active
                        ? 'bg-neon-purple/10 border-neon-purple/50 text-neon-purple shadow-[0_0_15px_rgba(123,97,255,0.2)]'
                        : 'border-transparent text-text-secondary hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 hover:bg-white/10 rounded-lg transition-colors group">
                <Bell className="w-5 h-5 text-text-secondary group-hover:text-white" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-neon-purple rounded-full shadow-[0_0_5px_#7B61FF]" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 pl-2 hover:bg-white/5 rounded-full transition-all border border-transparent hover:border-white/10"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center font-bold text-xs ring-2 ring-black">
                    {user.email?.[0].toUpperCase()}
                  </div>
                </button>

                {/* Dropdown */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-4 w-64 bg-[#0A0A0A] border border-white/10 rounded-xl p-2 z-50 shadow-2xl">
                      <div className="px-3 py-3 border-b border-white/5 mb-2">
                        <p className="font-bold text-white text-sm">{user.email}</p>
                        <p className="text-[10px] text-neon-blue font-mono uppercase tracking-wider">Cadet Level 5</p>
                      </div>
                      <div className="space-y-1">
                        <Link
                          href="/dashboard/profile"
                          className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors text-sm text-text-secondary hover:text-white"
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        <button
                          onClick={() => signOut()}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-status-danger/10 text-status-danger rounded-lg transition-colors text-sm"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 pb-32 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-black/80 backdrop-blur-xl border border-white/10 z-40 rounded-2xl shadow-2xl">
        <div className="flex justify-around py-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 p-2 rounded-xl transition-all',
                  active
                    ? 'text-neon-purple'
                    : 'text-text-secondary opacity-60'
                )}
              >
                <Icon className={cn('w-5 h-5', active && 'drop-shadow-[0_0_5px_rgba(123,97,255,0.5)]')} />
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
