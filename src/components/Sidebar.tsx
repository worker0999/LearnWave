import React from 'react';
import { Home, Settings, User, MessageCircle, Library, Bot, Users, Bell, UserCircle, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
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

  const allItems = [
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

  if (navType === 'side') {
    return (
      <motion.aside
        initial={false}
        animate={{ width: isSideExpanded ? 280 : 88 }}
        className="fixed left-0 top-0 h-screen bg-white text-[#1E1E1E] z-[999] flex flex-col shadow-sm border-r border-[#DDE3EA] transition-all duration-300"
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
                <div className="w-8 h-8 bg-[#1E1E1E] rounded-xl flex items-center justify-center font-bold text-white text-sm">L</div>
                <span className="font-extrabold text-xl tracking-tight">LearnWave</span>
              </motion.div>
            ) : (
              <motion.div
                key="logo-short"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-10 h-10 bg-[#1E1E1E] rounded-xl flex items-center justify-center font-extrabold text-white text-lg mx-auto"
              >
                L
              </motion.div>
            )}
          </AnimatePresence>
          {isSideExpanded && (
            <button 
              onClick={() => setIsSideExpanded(false)}
              className="p-1.5 hover:bg-[#F4F6F8] rounded-lg text-[#8A919B]"
            >
              <ChevronLeft size={20} />
            </button>
          )}
        </div>

        {!isSideExpanded && (
          <button 
            onClick={() => setIsSideExpanded(true)}
            className="absolute -right-3 top-20 w-6 h-6 bg-[#1E1E1E] rounded-full flex items-center justify-center text-white shadow-md z-50"
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
              <div className="bg-[#F4F6F8] rounded-2xl p-3.5 flex items-center gap-3 border border-[#DDE3EA]">
                <div className="w-10 h-10 rounded-2xl bg-[#D4E4C8] flex items-center justify-center text-[#1E1E1E] font-bold shrink-0">
                  {user?.name?.[0] || 'U'}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-sm truncate text-[#1E1E1E]">{user?.name}</p>
                  <p className="text-[10px] text-[#8A919B] font-medium uppercase tracking-widest">{user?.role}</p>
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
                    ? 'bg-[#E5F0A0] text-[#1E1E1E] font-bold' 
                    : 'text-[#8A919B] hover:bg-[#F4F6F8] hover:text-[#1E1E1E]'
                }`}
              >
                <span className={`shrink-0 ${isActive ? 'text-[#1E1E1E]' : 'group-hover:text-[#1E1E1E]'}`}>
                  {item.icon}
                </span>
                {isSideExpanded && (
                  <span className="text-sm tracking-tight whitespace-nowrap">
                    {item.label}
                  </span>
                )}
                {!isSideExpanded && (
                  <div className="absolute left-full ml-4 px-2.5 py-1 bg-[#1E1E1E] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[1000]">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-3 mt-auto border-t border-[#DDE3EA]">
          <button
            onClick={() => logout()}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-red-400 hover:bg-red-50 hover:text-red-500 ${!isSideExpanded ? 'justify-center' : ''}`}
          >
            <LogOut size={20} />
            {isSideExpanded && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </motion.aside>
    );
  }

  // DEFAULT: Bottom Nav
  return (
    <nav 
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[999] w-auto max-w-[95vw] pointer-events-auto"
      aria-label="Main Navigation"
    >
      <div className="bg-white/90 backdrop-blur-xl p-1.5 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-[#DDE3EA] flex items-center gap-0.5 overflow-x-auto no-scrollbar px-2">
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
                  ? 'text-[#1E1E1E]' 
                  : 'text-[#8A919B] hover:text-[#1E1E1E] hover:bg-[#F4F6F8]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activePill-sidebar-final"
                  className="absolute inset-0 bg-[#E5F0A0] rounded-full -z-10"
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