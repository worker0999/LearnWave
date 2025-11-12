'use client'

import { ReactNode } from 'react'
import { SidebarNav } from '@/components/ui/sidebar-nav'
import { useAuth } from '@/contexts/AuthContext'

interface DashboardLayoutProps {
  children: ReactNode
  userRole?: 'STUDENT' | 'MENTOR' | 'ADMIN'
}

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const { user } = useAuth()

  const effectiveRole = userRole ?? ((user as any)?.role ? String((user as any).role).toUpperCase() : 'STUDENT')
  const sanitizedRole = (['STUDENT', 'MENTOR', 'ADMIN'] as const).includes(effectiveRole as any)
    ? (effectiveRole as 'STUDENT' | 'MENTOR' | 'ADMIN')
    : 'STUDENT'

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Sidebar */}
      <div className="relative z-10">
        <SidebarNav 
          userRole={sanitizedRole}
          userName={user?.name}
          userAvatar={(user as any)?.avatar}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 relative z-10 overflow-hidden">
        <main className="h-full overflow-y-auto">
          {children}
        </main>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}