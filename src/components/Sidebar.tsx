import React from 'react';
import { Home, Settings, User, MessageCircle, Library, Bot, Users, Bell, UserCircle, ChevronLeft, ChevronRight, LogOut, LayoutDashboard, Calendar, DollarSign, FileText, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUI } from '@/contexts/UIContext';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  onNavClick: (page: string) => void;
  expanded?: boolean;
  onToggle?: () => void;
  currentPage: string;
}

export function Sidebar({ onNavClick, currentPage }: SidebarProps) {
  const { navType, isSideExpanded, setIsSideExpanded } = useUI();
  const { user, logout } = useAuth();
  
  const isMentor = user?.role === 'MENTOR';
  const isAdmin = user?.role === 'ADMIN';

  const studentItems = [
    { id: 'home', label: 'Home', icon: <Home size={20} /> },
    { id: 'resource-hub', label: 'Resources', icon: <Library size={20} /> },
    { id: 'ai-assistant', label: 'AI', icon: <Bot size={20} /> },
    { id: 'community', label: 'Community', icon: <Users size={20} /> },
    { id: 'announcements', label: 'Notices', icon: <Bell size={20} /> },
    { id: 'mentors', label: 'Mentors', icon: <UserCircle size={20} /> },
    { id: 'messages', label: 'Chats', icon: <MessageCircle size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
  ];

  const mentorItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'students', label: 'Students', icon: <Users size={20} /> },
    { id: 'sessions', label: 'Sessions', icon: <Calendar size={20} /> },
    { id: 'earnings', label: 'Earnings', icon: <DollarSign size={20} /> },
    { id: 'resources', label: 'Resources', icon: <FileText size={20} /> },
    { id: 'messages', label: 'Chats', icon: <MessageCircle size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const adminItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'mentors', label: 'Approvals', icon: <UserCheck size={20} /> },
    { id: 'resources', label: 'Resources', icon: <FileText size={20} /> },
    { id: 'announcements', label: 'Notices', icon: <Bell size={20} /> },
    { id: 'sessions', label: 'Sessions', icon: <Calendar size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <Bot size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const allItems = isAdmin ? adminItems : (isMentor ? mentorItems : studentItems);

  // Theme colors
  const activeBg = isAdmin ? 'bg-[#c8ced8]' : (isMentor ? 'bg-[#DBE2DC]' : 'bg-[#E5F0A0]');
  const activeText = isAdmin ? 'text-[#42413b]' : (isMentor ? 'text-[#335765]' : 'text-[#1E1E1E]');
  const hoverBg = isAdmin ? 'hover:bg-[#dfd3c3]/30' : (isMentor ? 'hover:bg-[#DBE2DC]/30' : 'hover:bg-[#F4F6F8]');
  const defaultText = isAdmin ? 'text-[#a9a29e]' : (isMentor ? 'text-[#74A8A4]' : 'text-[#8A919B]');
  const iconBg = isAdmin ? 'bg-[#c8ced8]' : (isMentor ? 'bg-[#B6D9E0]' : 'bg-[#D4E4C8]');
  const bgTheme = isAdmin ? 'bg-[#f4f4f0] border-[#dfd3c3]' : (isMentor ? 'bg-white border-[#B6D9E0]' : 'bg-white border-[#DDE3EA]');
  const logoBg = isAdmin ? 'bg-[#42413b]' : (isMentor ? 'bg-[#335765]' : 'bg-[#1E1E1E]');
  const logoText = isAdmin ? 'text-[#42413b]' : (isMentor ? 'text-[#335765]' : '');

  if (navType === 'side') {
    return (
      <>
        <motion.aside
          initial={false}
          animate={{ width: isSideExpanded ? 280 : 88 }}
          className={`hidden md:flex fixed left-0 top-0 h-screen ${bgTheme} text-[#1E1E1E] z-[999] flex-col shadow-sm border-r transition-all duration-300`}
        >
          {/* Logo Section */}
          <div className="p-6 mb-4 flex items-center justify-between">
            <AnimatePresence mode="wait">
              {isSideExpanded ? (
                <motion.div
                  key="logo-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3"
                >
                  <img src="/logo.png" alt="LearnWave Logo" className="w-8 h-8 object-contain rounded-xl" />
                  <span className={`font-extrabold text-xl tracking-tight ${logoText}`}>LearnWave</span>
                </motion.div>
              ) : (
                <motion.div
                  key="logo-short"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto overflow-hidden"
                >
                  <img src="/logo.png" alt="LearnWave Logo" className="w-full h-full object-contain" />
                </motion.div>
              )}
            </AnimatePresence>
            {isSideExpanded && (
              <button 
                onClick={() => setIsSideExpanded(false)}
                className={`p-1.5 ${hoverBg} rounded-lg ${defaultText}`}
              >
                <ChevronLeft size={20} />
              </button>
            )}
          </div>

          {!isSideExpanded && (
            <button 
              onClick={() => setIsSideExpanded(true)}
              className={`absolute -right-3 top-20 w-6 h-6 ${logoBg} rounded-full flex items-center justify-center text-white shadow-md z-50`}
            >
              <ChevronRight size={14} />
            </button>
          )}

          {/* Profile Section (Only when expanded) */}
          <AnimatePresence>
            {isSideExpanded && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="px-5 mb-6"
              >
                <div className={`rounded-2xl p-3.5 flex items-center gap-3 border ${bgTheme}`}>
                  <div className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center ${activeText} font-bold shrink-0 overflow-hidden`}>
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.[0] || 'U'
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className={`font-bold text-sm truncate ${activeText}`}>{user?.name}</p>
                    <p className={`text-[10px] ${defaultText} font-medium uppercase tracking-widest`}>{user?.role}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nav Items */}
          <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto no-scrollbar">
            {allItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavClick(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group relative ${
                    isActive 
                      ? `${activeBg} ${activeText} font-bold` 
                      : `${defaultText} ${hoverBg} hover:${activeText}`
                  }`}
                >
                  <span className={`shrink-0 ${isActive ? activeText : `group-hover:${activeText}`}`}>
                    {item.icon}
                  </span>
                  {isSideExpanded && (
                    <span className="text-sm tracking-tight whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                  {!isSideExpanded && (
                    <div className={`absolute left-full ml-4 px-2.5 py-1 ${isMentor ? 'bg-[#335765]' : 'bg-[#1E1E1E]'} text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[1000]`}>
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer / Logout */}
          <div className={`p-3 mt-auto border-t ${bgTheme.includes('border-') ? bgTheme.split(' ').find(c => c.startsWith('border-')) : 'border-[#DDE3EA]'}`}>
            <button
              onClick={() => logout()}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-red-400 hover:bg-red-50 hover:text-red-500 ${!isSideExpanded ? 'justify-center' : ''}`}
            >
              <LogOut size={20} />
              {isSideExpanded && <span className="font-medium text-sm">Logout</span>}
            </button>
          </div>
        </motion.aside>

        {/* Mobile bottom nav fallback when navType is 'side' */}
        <nav 
          className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-[999] w-auto max-w-[95vw] pointer-events-auto"
          aria-label="Main Navigation Mobile"
        >
          <div className={`bg-white/90 backdrop-blur-xl p-1.5 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border ${bgTheme.includes('border-') ? bgTheme.split(' ').find(c => c.startsWith('border-')) : 'border-[#DDE3EA]'} flex items-center gap-0.5 overflow-x-auto no-scrollbar px-2`}>
            {allItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onNavClick(item.id);
                  }}
                  className={`relative flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-full transition-all duration-300 shrink-0 z-50 group ${
                    isActive 
                      ? activeText 
                      : `${defaultText} hover:${activeText} ${hoverBg}`
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePill-sidebar-mobile-fallback"
                      className={`absolute inset-0 ${activeBg} rounded-full -z-10`}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="shrink-0 pointer-events-none">{item.icon}</span>
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="font-bold text-sm whitespace-nowrap overflow-hidden pr-1 tracking-tight pointer-events-none"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>
        </nav>
      </>
    );
  }

  // DEFAULT: Bottom Nav
  return (
    <nav 
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[999] w-auto max-w-[95vw] pointer-events-auto"
      aria-label="Main Navigation"
    >
      <div className={`bg-white/90 backdrop-blur-xl p-1.5 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border ${bgTheme.includes('border-') ? bgTheme.split(' ').find(c => c.startsWith('border-')) : 'border-[#DDE3EA]'} flex items-center gap-0.5 overflow-x-auto no-scrollbar px-2`}>
        {allItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onNavClick(item.id);
              }}
              className={`relative flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-full transition-all duration-300 shrink-0 z-50 group ${
                isActive 
                  ? activeText 
                  : `${defaultText} hover:${activeText} ${hoverBg}`
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activePill-sidebar-final"
                  className={`absolute inset-0 ${activeBg} rounded-full -z-10`}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="shrink-0 pointer-events-none">{item.icon}</span>
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="font-bold text-sm whitespace-nowrap overflow-hidden pr-1 tracking-tight pointer-events-none"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </nav>
  );
}