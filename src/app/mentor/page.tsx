'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Sidebar } from '@/components/Sidebar'
import { useAuth } from '@/contexts/AuthContext'
import { useUI } from '@/contexts/UIContext'
import { Search, Bell, User, LogOut, Settings as SettingsIcon, UserCircle, ChevronDown } from 'lucide-react'

// Dynamic imports for components
const MentorDashboard = dynamic(() => import('@/components/mentor/MentorDashboard').then(mod => mod.MentorDashboard))
const MentorStudents = dynamic(() => import('@/components/mentor/MentorStudents').then(mod => mod.MentorStudents))
const MentorSessions = dynamic(() => import('@/components/mentor/MentorSessions').then(mod => mod.MentorSessions))
const MentorEarnings = dynamic(() => import('@/components/mentor/MentorEarnings').then(mod => mod.MentorEarnings))
const MentorResources = dynamic(() => import('@/components/mentor/MentorResources').then(mod => mod.MentorResources))
const MentorMessages = dynamic(() => import('@/components/mentor/MentorMessages').then(mod => mod.MentorMessages))
const MentorProfile = dynamic(() => import('@/components/mentor/MentorProfile').then(mod => mod.MentorProfile))
const MentorSettings = dynamic(() => import('@/components/mentor/MentorSettings').then(mod => mod.MentorSettings))

export default function MentorHome() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const { navType, isSideExpanded } = useUI()
  const [expanded, setExpanded] = useState(true)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Handle deep linking on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const pageParam = params.get('page')
    if (pageParam) {
      setCurrentPage(pageParam)
    }
  }, [])

  // Sync URL with state
  useEffect(() => {
    const url = new URL(window.location.href)
    if (currentPage === 'dashboard') {
      url.searchParams.delete('page')
    } else {
      url.searchParams.set('page', currentPage)
    }
    window.history.pushState({}, '', url.toString())
  }, [currentPage])

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F4F6F8]">
        <div className="text-[#335765] text-xl font-bold">Please log in to access your dashboard</div>
      </div>
    )
  }

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <MentorDashboard onNavigate={handleNavigate} />
      case 'students':
        return <MentorStudents onNavigate={handleNavigate} />
      case 'sessions':
        return <MentorSessions />
      case 'earnings':
        return <MentorEarnings />
      case 'resources':
        return <MentorResources />
      case 'messages':
        return <MentorMessages />
      case 'profile':
        return <MentorProfile />
      case 'settings':
        return <MentorSettings />
      default:
        return (
          <div className="space-y-6">
            <div className="text-center text-[#74A8A4] mt-12 font-bold">
              <p>Content for {currentPage} coming soon...</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className={`min-h-screen bg-[#F4F6F8] transition-all duration-300 ${navType === 'bottom' ? 'pb-24' : ''}`}>
      <Sidebar
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
        currentPage={currentPage}
        onNavClick={handleNavigate}
      />

      <div
        className={`transition-all duration-300 ease-in-out flex flex-col min-h-screen w-full ${
          navType === 'side' 
            ? (isSideExpanded ? 'pl-[280px]' : 'pl-[88px]') 
            : ''
        }`}
      >
        {/* Top Header Area */}
        <header className="h-16 px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40 bg-[#F4F6F8]/80 backdrop-blur-md">
          <div className="flex items-center gap-4 w-80">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#74A8A4]" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white border border-[#B6D9E0] focus:border-[#335765] focus:ring-1 focus:ring-[#335765]/10 text-[#335765] placeholder-[#74A8A4] outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-[#74A8A4] hover:text-[#335765] hover:bg-white rounded-xl transition-all relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#B6D9E0] border-2 border-[#F4F6F8] rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-[#B6D9E0]/50 relative">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-[#335765]">{user.name}</p>
                <p className="text-[10px] text-[#74A8A4] font-medium uppercase tracking-wider">{user.role}</p>
              </div>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 hover:bg-white p-1.5 rounded-xl transition-colors"
              >
                <div className="w-9 h-9 rounded-2xl bg-[#B6D9E0] flex items-center justify-center text-[#335765]">
                  <User size={16} />
                </div>
                <ChevronDown size={14} className="text-[#74A8A4]" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#B6D9E0]/50 rounded-2xl shadow-lg py-2 z-50">
                  <button
                    onClick={() => { setCurrentPage('profile'); setShowUserMenu(false); }}
                    className="w-full px-4 py-2.5 text-left hover:bg-[#DBE2DC]/30 transition-colors flex items-center gap-3 text-[#335765] text-sm"
                  >
                    <UserCircle size={16} className="text-[#74A8A4]" />
                    <span className="font-bold">My Profile</span>
                  </button>
                  <button
                    onClick={() => { setCurrentPage('settings'); setShowUserMenu(false); }}
                    className="w-full px-4 py-2.5 text-left hover:bg-[#DBE2DC]/30 transition-colors flex items-center gap-3 text-[#335765] text-sm"
                  >
                    <SettingsIcon size={16} className="text-[#74A8A4]" />
                    <span className="font-bold">Settings</span>
                  </button>
                  <div className="my-2 border-t border-[#B6D9E0]/50" />
                  <button
                    onClick={() => { logout(); setShowUserMenu(false); }}
                    className="w-full px-4 py-2.5 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-red-500 text-sm"
                  >
                    <LogOut size={16} />
                    <span className="font-bold">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
