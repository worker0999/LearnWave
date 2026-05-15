'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { useAuth } from '@/contexts/AuthContext'
import { useUI } from '@/contexts/UIContext'
import { DashboardView } from './components/DashboardView'
import { UsersView } from './components/UsersView'
import { MentorsView } from './components/MentorsView'
import { SettingsView } from './components/SettingsView'
import { AnnouncementsView } from './components/AnnouncementsView'
import { SessionsView } from './components/SessionsView'
import { ResourcesView } from './components/ResourcesView'
import { AnalyticsView } from './components/AnalyticsView'
import { Search, Bell, User, LogOut, Settings as SettingsIcon, UserCircle, ChevronDown, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function AdminPortal() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const { navType, isSideExpanded } = useUI()
  const [expanded, setExpanded] = useState(true)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const pageParam = params.get('page')
    if (pageParam) {
      setCurrentPage(pageParam)
    }
  }, [])

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
      <div className="flex items-center justify-center h-screen bg-[#f4f4f0] dark:bg-[#1c1b19]">
        <div className="text-[#42413b] dark:text-[#f4f4f0] text-xl font-medium">Please log in to access your dashboard</div>
      </div>
    )
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardView setView={setCurrentPage} />
      case 'users':
        return <UsersView />
      case 'mentors':
        return <MentorsView />
      case 'settings':
        return <SettingsView />
      case 'announcements':
        return <AnnouncementsView />
      case 'sessions':
        return <SessionsView />
      case 'resources':
        return <ResourcesView />
      case 'analytics':
        return <AnalyticsView />
      default:
        return <DashboardView setView={setCurrentPage} />
    }
  }

  return (
    <div className={`min-h-screen bg-[#f4f4f0] dark:bg-[#1c1b19] transition-all duration-300 ${navType === 'bottom' ? 'pb-24' : ''}`}>
      <Sidebar
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
        currentPage={currentPage}
        onNavClick={(page) => {
          setCurrentPage(page)
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
        <header className="h-16 px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40 bg-[#f4f4f0]/80 dark:bg-[#1c1b19]/80 backdrop-blur-md border-b border-[#dfd3c3] dark:border-[#42413b]">
          <div className="flex items-center gap-4 w-80">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a9a29e]" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-[#2a2826] border border-[#dfd3c3] dark:border-[#42413b] focus:border-[#42413b] focus:ring-1 focus:ring-[#42413b]/10 text-[#42413b] dark:text-[#f4f4f0] placeholder-[#a9a29e] outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-[#a9a29e] hover:text-[#42413b] dark:hover:text-[#f4f4f0] hover:bg-white dark:hover:bg-[#2a2826] rounded-xl transition-all"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="p-2 text-[#a9a29e] hover:text-[#42413b] dark:hover:text-[#f4f4f0] hover:bg-white dark:hover:bg-[#2a2826] rounded-xl transition-all relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#c8ced8] border-2 border-[#f4f4f0] dark:border-[#1c1b19] rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-[#dfd3c3] dark:border-[#42413b] relative">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-[#42413b] dark:text-[#f4f4f0]">{user.name}</p>
                <p className="text-[10px] text-[#a9a29e] font-medium uppercase tracking-wider">{user.role}</p>
              </div>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 hover:bg-white dark:hover:bg-[#2a2826] p-1.5 rounded-xl transition-colors"
              >
                <div className="w-9 h-9 rounded-2xl bg-[#c8ced8] flex items-center justify-center text-[#42413b]">
                  <User size={16} />
                </div>
                <ChevronDown size={14} className="text-[#a9a29e]" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-[#2a2826] border border-[#dfd3c3] dark:border-[#42413b] rounded-2xl shadow-lg py-2 z-50">
                  <button
                    onClick={() => { setCurrentPage('profile'); setShowUserMenu(false); }}
                    className="w-full px-4 py-2.5 text-left hover:bg-[#f4f4f0] dark:hover:bg-[#1c1b19] transition-colors flex items-center gap-3 text-[#42413b] dark:text-[#f4f4f0] text-sm"
                  >
                    <UserCircle size={16} className="text-[#a9a29e]" />
                    <span className="font-medium">My Profile</span>
                  </button>
                  <button
                    onClick={() => { setCurrentPage('settings'); setShowUserMenu(false); }}
                    className="w-full px-4 py-2.5 text-left hover:bg-[#f4f4f0] dark:hover:bg-[#1c1b19] transition-colors flex items-center gap-3 text-[#42413b] dark:text-[#f4f4f0] text-sm"
                  >
                    <SettingsIcon size={16} className="text-[#a9a29e]" />
                    <span className="font-medium">Settings</span>
                  </button>
                  <div className="my-2 border-t border-[#dfd3c3] dark:border-[#42413b]" />
                  <button
                    onClick={() => { logout(); setShowUserMenu(false); }}
                    className="w-full px-4 py-2.5 text-left hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-3 text-red-500 text-sm"
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
