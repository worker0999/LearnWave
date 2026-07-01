import { useState, useEffect } from 'react'
import { Bell, Megaphone } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export function NotificationBell({ isDark = false }: { isDark?: boolean }) {
  const { user } = useAuth()
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('/api/announcements', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setAnnouncements(data.announcements)
          
          // Check read status from localStorage
          const readIds = JSON.parse(localStorage.getItem('read_announcements') || '[]')
          const unread = data.announcements.filter((a: any) => !readIds.includes(a.id))
          setUnreadCount(unread.length)
        }
      } catch (err) {
        console.error('Failed to fetch announcements', err)
      }
    }
    
    if (user) fetchAnnouncements()
    
    // Poll every 2 minutes
    const interval = setInterval(fetchAnnouncements, 120000)
    return () => clearInterval(interval)
  }, [user])

  const handleOpen = () => {
    setIsOpen(!isOpen)
    if (!isOpen && unreadCount > 0) {
      // Mark all as read
      const allIds = announcements.map(a => a.id)
      const existingRead = JSON.parse(localStorage.getItem('read_announcements') || '[]')
      const combined = Array.from(new Set([...existingRead, ...allIds]))
      localStorage.setItem('read_announcements', JSON.stringify(combined))
      setUnreadCount(0)
    }
  }

  return (
    <div className="relative">
      <button 
        onClick={handleOpen}
        className={`p-2 rounded-xl transition-all relative ${
          isDark 
            ? 'text-[#a9a29e] hover:text-[#f4f4f0] hover:bg-[#2a2826]' 
            : 'text-[#8A919B] hover:text-[#1E1E1E] hover:bg-white'
        }`}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className={`absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white ${
            isDark ? 'bg-red-500 border-2 border-[#1c1b19]' : 'bg-red-500 border-2 border-[#E8EDF3]'
          }`}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={`absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-lg border py-2 z-50 ${
          isDark 
            ? 'bg-[#2a2826] border-[#42413b]' 
            : 'bg-white border-[#DDE3EA]'
        }`}>
          <div className={`px-4 py-2 font-bold text-sm border-b ${
            isDark ? 'text-[#f4f4f0] border-[#42413b]' : 'text-[#1E1E1E] border-[#DDE3EA]'
          }`}>
            Notifications
          </div>
          <div className="max-h-80 overflow-y-auto">
            {announcements.length === 0 ? (
              <div className={`px-4 py-8 text-center text-sm ${isDark ? 'text-[#a9a29e]' : 'text-[#8A919B]'}`}>
                No new notifications
              </div>
            ) : (
              announcements.map(announcement => (
                <div key={announcement.id} className={`p-4 border-b last:border-b-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
                  isDark ? 'border-[#42413b]' : 'border-[#DDE3EA]'
                }`}>
                  <div className="flex gap-3">
                    <div className={`mt-0.5 p-1.5 rounded-md ${
                      announcement.priority === 'HIGH' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                      isDark ? 'bg-[#1c1b19] text-[#c8ced8]' : 'bg-[#E8EDF3] text-[#1E1E1E]'
                    }`}>
                      <Megaphone size={14} />
                    </div>
                    <div>
                      <h4 className={`text-sm font-semibold ${isDark ? 'text-[#f4f4f0]' : 'text-[#1E1E1E]'}`}>
                        {announcement.title}
                      </h4>
                      <p className={`text-xs mt-1 line-clamp-2 ${isDark ? 'text-[#a9a29e]' : 'text-[#8A919B]'}`}>
                        {announcement.content}
                      </p>
                      <span className={`text-[10px] mt-2 block ${isDark ? 'text-[#a9a29e]/70' : 'text-[#8A919B]/70'}`}>
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
