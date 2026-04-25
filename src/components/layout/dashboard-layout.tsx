'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Settings,
    LogOut,
    UserCheck,
    Bell,
    BarChart3,
    Calendar,
    MessageSquare,
    IndianRupee,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useUI } from '@/contexts/UIContext'

interface DashboardLayoutProps {
    children: React.ReactNode
    userRole?: 'ADMIN' | 'MENTOR' | 'STUDENT'
}

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
    const { logout, user } = useAuth()
    const { navType, isSideExpanded, setIsSideExpanded } = useUI()
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = () => {
        logout()
        router.push('/auth/login')
    }

    const role = userRole || user?.role || 'STUDENT'

    const getAllItems = () => {
        switch (role) {
            case 'ADMIN':
                return [
                    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
                    { label: 'Users', href: '/admin/users', icon: <Users size={20} /> },
                    { label: 'Approvals', href: '/admin/mentors', icon: <UserCheck size={20} /> },
                    { label: 'Sessions', href: '/admin/sessions', icon: <Calendar size={20} /> },
                    { label: 'Resources', href: '/admin/resources', icon: <BookOpen size={20} /> },
                    { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 size={20} /> },
                    { label: 'Announcements', href: '/admin/announcements', icon: <Bell size={20} /> },
                    { label: 'Settings', href: '/admin/settings', icon: <Settings size={20} /> },
                ]
            case 'MENTOR':
                return [
                    { label: 'Dashboard', href: '/mentor', icon: <LayoutDashboard size={20} /> },
                    { label: 'Students', href: '/mentor/students', icon: <Users size={20} /> },
                    { label: 'Sessions', href: '/mentor/sessions', icon: <Calendar size={20} /> },
                    { label: 'Earnings', href: '/mentor/earnings', icon: <IndianRupee size={20} /> },
                    { label: 'Resources', href: '/mentor/resources', icon: <BookOpen size={20} /> },
                    { label: 'Messages', href: '/mentor/messages', icon: <MessageSquare size={20} /> },
                    { label: 'Settings', href: '/mentor/settings', icon: <Settings size={20} /> },
                    { label: 'Profile', href: '/mentor/profile', icon: <Users size={20} /> },
                ]
            default:
                return [
                    { label: 'Dashboard', href: '/student', icon: <LayoutDashboard size={20} /> },
                    { label: 'Mentors', href: '/student/mentors', icon: <Users size={20} /> },
                    { label: 'Resources', href: '/student/resources', icon: <BookOpen size={20} /> },
                    { label: 'Messages', href: '/student/messages', icon: <MessageSquare size={20} /> },
                    { label: 'Settings', href: '/student/settings', icon: <Settings size={20} /> },
                    { label: 'Profile', href: '/student/profile', icon: <Users size={20} /> },
                ]
        }
    }

    const allItems = getAllItems()

    return (
        <div className="min-h-screen bg-[#FDFBF9]">
            {navType === 'side' ? (
                <motion.aside
                    initial={false}
                    animate={{ width: isSideExpanded ? 280 : 88 }}
                    className="fixed left-0 top-0 h-screen bg-[#13131a] text-white z-[999] flex flex-col shadow-2xl transition-all duration-300"
                >
                    <div className="p-6 mb-8 flex items-center justify-between">
                        <AnimatePresence mode="wait">
                            {isSideExpanded ? (
                                <motion.div key="logo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[#E76F51] rounded-lg flex items-center justify-center font-bold">L</div>
                                    <span className="font-black text-xl tracking-tighter">LearnWave</span>
                                </motion.div>
                            ) : (
                                <motion.div key="logo-s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-10 h-10 bg-[#E76F51] rounded-xl flex items-center justify-center font-black text-xl mx-auto">L</motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {!isSideExpanded && (
                        <button onClick={() => setIsSideExpanded(true)} className="absolute -right-3 top-20 w-6 h-6 bg-[#E76F51] rounded-full flex items-center justify-center text-white shadow-lg z-50">
                            <ChevronRight size={14} />
                        </button>
                    )}

                    <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
                        {allItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <button
                                    key={item.href}
                                    onClick={() => router.push(item.href)}
                                    className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all group relative ${
                                        isActive ? 'bg-[#E76F51] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <span className={isActive ? 'text-white' : 'group-hover:text-white'}>{item.icon}</span>
                                    {isSideExpanded && <span className="font-bold text-sm tracking-tight">{item.label}</span>}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="p-4 mt-auto">
                        <button onClick={handleLogout} className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all text-red-400 hover:bg-red-500/10 ${!isSideExpanded ? 'justify-center' : ''}`}>
                            <LogOut size={20} />
                            {isSideExpanded && <span className="font-bold text-sm">Logout</span>}
                        </button>
                    </div>
                </motion.aside>
            ) : (
                <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] w-auto max-w-[95vw] pointer-events-auto">
                    <div className="bg-[#FFF5EB]/95 backdrop-blur-md p-2 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-orange-500/20 flex items-center gap-1 overflow-x-auto no-scrollbar px-3">
                        {allItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <button
                                    key={item.href}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        router.push(item.href);
                                    }}
                                    className={`relative flex items-center justify-center gap-2 px-4 py-3 rounded-full transition-all duration-300 shrink-0 z-50 group ${
                                        isActive ? 'text-white' : 'text-[#E76F51] hover:bg-orange-500/10'
                                    }`}
                                >
                                    {isActive && <motion.div layoutId="activePill-dashboard-final" className="absolute inset-0 bg-[#E76F51] rounded-full -z-10 shadow-lg shadow-orange-500/20" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                                    <span className="shrink-0 pointer-events-none">{item.icon}</span>
                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: 'auto', opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="font-bold text-sm whitespace-nowrap overflow-hidden pr-1 tracking-tight pointer-events-none">
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </button>
                            );
                        })}
                        <button onClick={handleLogout} className="flex items-center justify-center p-3 rounded-full transition-all text-red-500 hover:bg-red-50 shrink-0 z-50" title="Logout">
                            <LogOut size={20} />
                        </button>
                    </div>
                </nav>
            )}

            <main className={`transition-all duration-300 ease-in-out w-full ${navType === 'side' ? (isSideExpanded ? 'pl-[280px]' : 'pl-[88px]') : 'pb-32'}`}>
                {children}
            </main>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    )
}
