import { useState, useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export function AnnouncementBanner() {
  const { user } = useAuth()
  const [banner, setBanner] = useState<any | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('/api/announcements', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          // Find highest priority active announcement
          const highPriority = data.announcements.find((a: any) => a.priority === 'HIGH' || a.priority === 'URGENT')
          
          if (highPriority) {
            // Check if dismissed
            const dismissed = JSON.parse(sessionStorage.getItem('dismissed_banners') || '[]')
            if (!dismissed.includes(highPriority.id)) {
              setBanner(highPriority)
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch announcements', err)
      }
    }
    
    if (user) fetchBanner()
  }, [user])

  if (!banner || !isVisible) return null

  const dismiss = () => {
    setIsVisible(false)
    const dismissed = JSON.parse(sessionStorage.getItem('dismissed_banners') || '[]')
    sessionStorage.setItem('dismissed_banners', JSON.stringify([...dismissed, banner.id]))
  }

  return (
    <div className="bg-red-500 text-white px-4 py-3 shadow-md flex items-center justify-between z-50 relative">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-red-100" />
        <div>
          <span className="font-bold mr-2">{banner.title}:</span>
          <span className="text-red-50 text-sm">{banner.content}</span>
        </div>
      </div>
      <button 
        onClick={dismiss}
        className="p-1 hover:bg-red-600 rounded-md transition-colors"
      >
        <X className="w-4 h-4 text-red-100" />
      </button>
    </div>
  )
}
