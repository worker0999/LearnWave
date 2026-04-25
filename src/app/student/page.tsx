'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Sidebar } from '@/components/Sidebar'
import { WelcomeCard } from '@/components/WelcomeCard'
import { useAuth } from '@/contexts/AuthContext'
import { useUI } from '@/contexts/UIContext'
import { Button } from '@/components/ui/button'

// Dynamic imports for large components to save memory and improve performance
const HomeContent = dynamic(() => import('@/components/HomeContent').then(mod => mod.HomeContent))
const ResourceHub = dynamic(() => import('@/components/ResourceHub').then(mod => mod.ResourceHub))
const AIAssistant = dynamic(() => import('@/components/AIAssistant').then(mod => mod.AIAssistant))
const Announcements = dynamic(() => import('@/components/Announcements').then(mod => mod.Announcements))
const Community = dynamic(() => import('@/components/Community').then(mod => mod.Community))
const Mentors = dynamic(() => import('@/components/Mentors').then(mod => mod.Mentors))
const BookedSessions = dynamic(() => import('@/components/BookedSessions').then(mod => mod.BookedSessions))
const Settings = dynamic(() => import('@/components/Settings').then(mod => mod.Settings))
const Profile = dynamic(() => import('@/components/Profile').then(mod => mod.Profile))
import { Search, Bell, User, LogOut, Settings as SettingsIcon, UserCircle, ChevronDown } from 'lucide-react'

export default function StudentHome() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const { navType, isSideExpanded } = useUI()
  const [expanded, setExpanded] = useState(true)
  const [currentPage, setCurrentPage] = useState('home')
  const [leavesTrigger, setLeavesTrigger] = useState(0)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Handle deep linking on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const pageParam = params.get('page')
    if (pageParam) {
      setCurrentPage(pageParam)
    }
  }, [])

  // Sync URL with state (optional but good for UX)
  useEffect(() => {
    const url = new URL(window.location.href)
    if (currentPage === 'home') {
      url.searchParams.delete('page')
    } else {
      url.searchParams.set('page', currentPage)
    }
    window.history.pushState({}, '', url.toString())
  }, [currentPage])

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#E8EDF3]">
        <div className="text-[#1E1E1E] text-xl font-medium">Please log in to access your dashboard</div>
      </div>
    )
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="space-y-6">
            <WelcomeCard />
            <HomeContent user={user} />
          </div>
        )
      case 'resource-hub':
        return <ResourceHub />
      case 'ai-assistant':
        return <AIAssistant />
      case 'announcements':
      case 'circulars':
        return <Announcements />
      case 'community':
        return <Community />
      case 'mentors':
        return <Mentors onMessage={() => router.push('/student/messages')} />
      case 'booked-sessions':
        return <BookedSessions />
      case 'settings':
        return <Settings />
      case 'profile':
        return <Profile />
      default:
        return (
          <div className="space-y-6">
            <WelcomeCard />
            <div className="text-center text-[#8A919B] mt-12">
              <p>Content for {currentPage} coming soon...</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className={`min-h-screen bg-[#E8EDF3] transition-all duration-300 ${navType === 'bottom' ? 'pb-24' : ''}`}>
      <Sidebar
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
        currentPage={currentPage}
        onNavClick={(page) => {
          if (page === 'messages') {
            router.push('/student/messages')
          } else {
            setCurrentPage(page)
          }
        }}
      />

      <div
        className={`transition-all duration-300 ease-in-out flex flex-col min-h-screen w-full ${
          navType === 'side' 
            ? (isSideExpanded ? 'pl-[280px]' : 'pl-[88px]') 
            : ''
        }`}
      >
        {/* Top Header Area */}
        <header className="h-16 px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40 bg-[#E8EDF3]/80 backdrop-blur-md">
          <div className="flex items-center gap-4 w-80">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A919B]" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white border border-[#DDE3EA] focus:border-[#1E1E1E] focus:ring-1 focus:ring-[#1E1E1E]/10 text-[#1E1E1E] placeholder-[#B0B7BF] outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-[#8A919B] hover:text-[#1E1E1E] hover:bg-white rounded-xl transition-all relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D4E4C8] border-2 border-[#E8EDF3] rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-[#DDE3EA] relative">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-[#1E1E1E]">{user.name}</p>
                <p className="text-[10px] text-[#8A919B] font-medium uppercase tracking-wider">{user.role}</p>
              </div>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 hover:bg-white p-1.5 rounded-xl transition-colors"
              >
                <div className="w-9 h-9 rounded-2xl bg-[#D4E4C8] flex items-center justify-center text-[#1E1E1E]">
                  <User size={16} />
                </div>
                <ChevronDown size={14} className="text-[#8A919B]" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#DDE3EA] rounded-2xl shadow-lg py-2 z-50">
                  <button
                    onClick={() => { setCurrentPage('profile'); setShowUserMenu(false); }}
                    className="w-full px-4 py-2.5 text-left hover:bg-[#F4F6F8] transition-colors flex items-center gap-3 text-[#1E1E1E] text-sm"
                  >
                    <UserCircle size={16} className="text-[#8A919B]" />
                    <span className="font-medium">My Profile</span>
                  </button>
                  <button
                    onClick={() => { setCurrentPage('settings'); setShowUserMenu(false); }}
                    className="w-full px-4 py-2.5 text-left hover:bg-[#F4F6F8] transition-colors flex items-center gap-3 text-[#1E1E1E] text-sm"
                  >
                    <SettingsIcon size={16} className="text-[#8A919B]" />
                    <span className="font-medium">Settings</span>
                  </button>
                  <div className="my-2 border-t border-[#DDE3EA]" />
                  <button
                    onClick={() => { logout(); setShowUserMenu(false); }}
                    className="w-full px-4 py-2.5 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-red-500 text-sm"
                  >
                    <LogOut size={16} />
                    <span className="font-medium">Logout</span>
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
