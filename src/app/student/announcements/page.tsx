'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuth } from '@/contexts/AuthContext'
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates'
import { 
  Bell, 
  Calendar, 
  Search, 
  Filter,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  BookOpen,
  Award,
  Users,
  RefreshCw
} from 'lucide-react'

interface Announcement {
  id: string
  title: string
  content: string
  type: 'VTU_CIRCULAR' | 'EXAM' | 'GENERAL' | 'EVENT' | 'RESULT' | 'HOLIDAY'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  source: string
  publishedAt: string
  expiresAt?: string
  attachments?: string[]
  read: boolean
}

export default function AnnouncementsPage() {
  const { user, isAuthenticated } = useAuth()
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')

  // Real-time updates for announcements
  const { data: announcements, loading, refresh } = useRealtimeUpdates<Announcement[]>({
    endpoint: '/api/student/announcements',
    interval: 20000, // 20 seconds
    enabled: isAuthenticated && !!user,
    dependencies: [searchTerm, filterType, filterPriority]
  })

  useEffect(() => {
    filterAnnouncements()
  }, [announcements, searchTerm, filterType, filterPriority])

  const filterAnnouncements = () => {
    if (!announcements) return
    
    let filtered = announcements

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(announcement =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(announcement => announcement.type === filterType)
    }

    // Filter by priority
    if (filterPriority !== 'all') {
      filtered = filtered.filter(announcement => announcement.priority === filterPriority)
    }

    // Sort by published date (newest first)
    filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    setFilteredAnnouncements(filtered)
  }

  const markAsRead = async (announcementId: string) => {
    setFilteredAnnouncements(prev =>
      prev.map(announcement =>
        announcement.id === announcementId
          ? { ...announcement, read: true }
          : announcement
      )
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'VTU_CIRCULAR':
        return <BookOpen className="w-4 h-4" />
      case 'EXAM':
        return <Award className="w-4 h-4" />
      case 'EVENT':
        return <Calendar className="w-4 h-4" />
      case 'RESULT':
        return <CheckCircle className="w-4 h-4" />
      case 'HOLIDAY':
        return <Clock className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'VTU_CIRCULAR':
        return 'bg-blue-500'
      case 'EXAM':
        return 'bg-red-500'
      case 'EVENT':
        return 'bg-green-500'
      case 'RESULT':
        return 'bg-purple-500'
      case 'HOLIDAY':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-600 text-white'
      case 'HIGH':
        return 'bg-orange-500 text-white'
      case 'MEDIUM':
        return 'bg-yellow-500 text-black'
      case 'LOW':
        return 'bg-green-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isAuthenticated || !user) {
    return (
      <DashboardLayout userRole="STUDENT">
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Please log in to view announcements</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="STUDENT">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Announcements & Circulars</h1>
            <p className="text-purple-200">Stay updated with the latest notices and circulars</p>
          </div>
          <Button onClick={refresh} variant="outline" className="border-purple-400 text-purple-200">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-4 h-4" />
                <Input
                  placeholder="Search announcements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-purple-300"
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="VTU_CIRCULAR">VTU Circulars</SelectItem>
                  <SelectItem value="EXAM">Examinations</SelectItem>
                  <SelectItem value="EVENT">Events</SelectItem>
                  <SelectItem value="GENERAL">General</SelectItem>
                  <SelectItem value="RESULT">Results</SelectItem>
                  <SelectItem value="HOLIDAY">Holidays</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2 text-purple-200">
                <Filter className="w-4 h-4" />
                <span className="text-sm">
                  {filteredAnnouncements.length} of {announcements?.length || 0} announcements
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Announcements List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-purple-300 animate-spin" />
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-12 text-center">
                <AlertCircle className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                <h3 className="text-white text-lg font-semibold mb-2">No announcements found</h3>
                <p className="text-purple-200">Try adjusting your filters or search terms</p>
              </CardContent>
            </Card>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <Card
                key={announcement.id}
                className={`bg-white/10 backdrop-blur-md border-white/20 transition-all hover:bg-white/20 ${
                  !announcement.read ? 'border-l-4 border-l-purple-400' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(announcement.type)}`}>
                        {getTypeIcon(announcement.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg flex items-center">
                          {announcement.title}
                          {!announcement.read && (
                            <span className="ml-2 w-2 h-2 bg-purple-400 rounded-full"></span>
                          )}
                        </h3>
                        <p className="text-purple-300 text-sm">
                          {announcement.source} • {formatDate(announcement.publishedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(announcement.priority)}>
                        {announcement.priority}
                      </Badge>
                      <Badge variant="outline" className="border-purple-400 text-purple-200">
                        {announcement.type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-purple-200 mb-4 leading-relaxed">
                    {announcement.content}
                  </p>

                  {announcement.attachments && announcement.attachments.length > 0 && (
                    <div className="mb-4">
                      <p className="text-purple-300 text-sm mb-2">Attachments:</p>
                      <div className="flex flex-wrap gap-2">
                        {announcement.attachments.map((attachment, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="border-purple-400 text-purple-200 hover:bg-purple-500 hover:text-white"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            {attachment}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-purple-300 text-sm">
                      {announcement.expiresAt && (
                        <span>Expires: {formatDate(announcement.expiresAt)}</span>
                      )}
                    </div>
                    {!announcement.read && (
                      <Button
                        onClick={() => markAsRead(announcement.id)}
                        variant="ghost"
                        size="sm"
                        className="text-purple-300 hover:text-white"
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}