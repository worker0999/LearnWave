'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { VoiceNavigation } from '@/components/ui/voice-navigation'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Home,
  BookOpen,
  Brain,
  Users,
  Calendar,
  MessageSquare,
  Settings,
  Award,
  Target,
  FileText,
  BarChart3,
  UserCheck,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Zap,
  Bell,
  Search,
  HelpCircle
} from 'lucide-react'

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  badge?: string | number
  description?: string
  roles?: string[]
}

interface SidebarNavProps {
  userRole: 'STUDENT' | 'MENTOR' | 'ADMIN'
  userName?: string
  userAvatar?: string
}

const studentNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/student',
    icon: <Home className="w-5 h-5" />,
    description: 'Overview and quick actions'
  },
  {
    title: 'AI Assistant',
    href: '/student/ai-assistant',
    icon: <Brain className="w-5 h-5" />,
    badge: 'New',
    description: 'Get help from AI tutor'
  },
  {
    title: 'Resources',
    href: '/student/resources',
    icon: <BookOpen className="w-5 h-5" />,
    description: 'Study materials and notes'
  },
  {
    title: 'Timetable',
    href: '/student/timetable',
    icon: <Calendar className="w-5 h-5" />,
    description: 'View class schedule'
  },
  {
    title: 'Announcements',
    href: '/student/announcements',
    icon: <Bell className="w-5 h-5" />,
    badge: 'New',
    description: 'Latest notices and circulars'
  },
  {
    title: 'Find Mentors',
    href: '/student/mentors',
    icon: <Users className="w-5 h-5" />,
    description: 'Connect with experts'
  },
  {
    title: 'Booked Sessions',
    href: '/student/sessions',
    icon: <Calendar className="w-5 h-5" />,
    description: 'Upcoming mentoring sessions'
  },
  {
    title: 'Forum',
    href: '/student/forum',
    icon: <MessageSquare className="w-5 h-5" />,
    description: 'Discussion boards'
  },
  {
    title: 'Results',
    href: '/student/results',
    icon: <Award className="w-5 h-5" />,
    description: 'View your performance'
  }
]

const mentorNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/mentor',
    icon: <Home className="w-5 h-5" />,
    description: 'Overview and earnings'
  },
  {
    title: 'My Sessions',
    href: '/mentor/sessions',
    icon: <Calendar className="w-5 h-5" />,
    badge: 3,
    description: 'Manage your sessions'
  },
  {
    title: 'Students',
    href: '/mentor/students',
    icon: <Users className="w-5 h-5" />,
    description: 'View your students'
  },
  {
    title: 'Resources',
    href: '/mentor/resources',
    icon: <FileText className="w-5 h-5" />,
    description: 'Upload study materials'
  },
  {
    title: 'Earnings',
    href: '/mentor/earnings',
    icon: <BarChart3 className="w-5 h-5" />,
    description: 'Track your income'
  },
  {
    title: 'Profile',
    href: '/mentor/profile',
    icon: <Settings className="w-5 h-5" />,
    description: 'Manage your profile'
  }
]

const adminNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: <Home className="w-5 h-5" />,
    description: 'Platform overview'
  },
  {
    title: 'Mentor Approvals',
    href: '/admin/mentors',
    icon: <UserCheck className="w-5 h-5" />,
    badge: 12,
    description: 'Review mentor applications'
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: <Users className="w-5 h-5" />,
    description: 'Manage all users'
  },
  {
    title: 'Resources',
    href: '/admin/resources',
    icon: <BookOpen className="w-5 h-5" />,
    description: 'Manage study materials'
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    description: 'Platform statistics'
  },
  {
    title: 'Announcements',
    href: '/admin/announcements',
    icon: <Bell className="w-5 h-5" />,
    description: 'Send notifications'
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: <Settings className="w-5 h-5" />,
    description: 'Platform configuration'
  }
]

export function SidebarNav({ userRole, userName, userAvatar }: SidebarNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const getNavItems = () => {
    switch (userRole) {
      case 'STUDENT':
        return studentNavItems
      case 'MENTOR':
        return mentorNavItems
      case 'ADMIN':
        return adminNavItems
      default:
        return []
    }
  }

  const navItems = getNavItems()

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className={cn(
          "flex items-center space-x-3 transition-all duration-300",
          isCollapsed && "justify-center"
        )}>
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold text-white transition-opacity duration-300">
              LearnWave
            </span>
          )}
        </div>
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:text-purple-300 hover:bg-white/10 transition-all"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        )}
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileOpen(false)}
            className="text-white hover:text-purple-300 hover:bg-white/10 transition-all"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* User Profile */}
      <button
        onClick={() => {
          const profilePath = userRole === 'STUDENT' ? '/student/profile' : userRole === 'MENTOR' ? '/mentor/profile' : '/admin/profile'
          router.push(profilePath)
          if (isMobile) setIsMobileOpen(false)
        }}
        className={cn(
          "w-full p-4 border-b border-white/10 transition-all duration-300 hover:bg-white/5 cursor-pointer",
          isCollapsed ? "text-center" : ""
        )}
      >
        <div className={cn(
          "flex items-center space-x-3",
          isCollapsed ? "flex-col space-x-0 space-y-2" : ""
        )}>
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
            {userAvatar ? (
              <img src={userAvatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <span className="text-white font-bold">
                {userName?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{userName || 'User'}</p>
              <p className="text-purple-300 text-sm capitalize">{userRole.toLowerCase()}</p>
            </div>
          )}
        </div>
      </button>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
                          (item.href !== '/admin' && pathname.startsWith(item.href))
          
          return (
            <TooltipProvider key={item.href} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                      isActive 
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" 
                        : "text-purple-200 hover:bg-white/10 hover:text-white",
                      isCollapsed && "justify-center"
                    )}
                    onClick={() => isMobile && setIsMobileOpen(false)}
                  >
                    <div className="flex-shrink-0">
                      {item.icon}
                    </div>
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 transition-opacity duration-300">
                          {item.title}
                        </span>
                        {item.badge && (
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              "text-xs",
                              isActive ? "bg-white/20 text-white" : "bg-purple-500/20 text-purple-200"
                            )}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="bg-slate-800 border-slate-700">
                    <p className="font-medium">{item.title}</p>
                    {item.description && (
                      <p className="text-xs text-slate-400">{item.description}</p>
                    )}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </nav>

      {/* Voice Navigation */}
      <div className="px-4 py-2">
        <VoiceNavigation userRole={userRole} />
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-purple-200 hover:bg-white/10 hover:text-white transition-all",
                  isCollapsed && "justify-center"
                )}
              >
                <HelpCircle className="w-5 h-5" />
                {!isCollapsed && <span className="ml-3">Help & Support</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="bg-slate-800 border-slate-700">
                <p>Help & Support</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all",
                  isCollapsed && "justify-center"
                )}
                onClick={() => {
                  logout()
                  router.push('/auth/login')
                }}
              >
                <LogOut className="w-5 h-5" />
                {!isCollapsed && <span className="ml-3">Logout</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="bg-slate-800 border-slate-700">
                <p>Logout</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMobileOpen(true)}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div className={cn(
          "fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-slate-900 to-purple-900 border-r border-white/20 z-50 transform transition-transform duration-300 md:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <NavContent />
        </div>
      </>
    )
  }

  return (
    <div className={cn(
      "relative bg-gradient-to-b from-slate-900 to-purple-900 border-r border-white/20 transition-all duration-300 h-screen",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <NavContent />
    </div>
  )
}