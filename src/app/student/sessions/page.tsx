'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import {
  Calendar,
  Clock,
  User,
  Video,
  Phone,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  RefreshCw,
  IndianRupee,
  TrendingUp,
  Users,
  LogOut
} from 'lucide-react'

interface StudentSession {
  id: string
  mentorId: string
  studentId: string
  mentor: {
    id: string
    name: string
    email: string
    expertise: string[]
    hourlyRate: number
    avatar?: string
  }
  scheduledAt: string
  duration: number
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  amount: number
  meetLink?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function StudentSessionsPage() {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [sessions, setSessions] = useState<StudentSession[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState<string | null>(null)

  const fetchSessions = async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/sessions?studentId=${user.id}`)
      const data = await response.json()

      if (data.success) {
        setSessions(data.sessions)
      } else {
        console.error('Failed to fetch sessions:', data.error)
        toast({
          title: "Error",
          description: "Failed to fetch sessions",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
      toast({
        title: "Error",
        description: "Failed to fetch sessions",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false)
      return
    }

    fetchSessions()
  }, [isAuthenticated, user])

  const handleCancelSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to cancel this session?')) return

    setCancelling(sessionId)
    try {
      const response = await fetch('/api/sessions/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Session Cancelled",
          description: "Your session has been cancelled successfully",
        })
        fetchSessions() // Refresh sessions
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to cancel session",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error cancelling session:', error)
      toast({
        title: "Error",
        description: "Failed to cancel session",
        variant: "destructive"
      })
    } finally {
      setCancelling(null)
    }
  }

  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link)
      toast({
        title: "Link Copied",
        description: "Meeting link copied to clipboard",
      })
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-yellow-500">Pending</Badge>
      case 'CONFIRMED':
        return <Badge className="bg-green-500">Confirmed</Badge>
      case 'COMPLETED':
        return <Badge className="bg-blue-500">Completed</Badge>
      case 'CANCELLED':
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'CONFIRMED':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-blue-500" />
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  if (!isAuthenticated || !user) {
    return (
      <DashboardLayout userRole="STUDENT">
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Please log in to view your sessions</div>
        </div>
      </DashboardLayout>
    )
  }

  if (loading) {
    return (
      <DashboardLayout userRole="STUDENT">
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading sessions...</div>
        </div>
      </DashboardLayout>
    )
  }

  const totalSpent = sessions.reduce((total, session) => total + session.amount, 0)
  const completedSessions = sessions.filter(s => s.status === 'COMPLETED').length
  const upcomingSessions = sessions.filter(s => s.status === 'PENDING' || s.status === 'CONFIRMED').length

  return (
    <DashboardLayout userRole="STUDENT">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Booked Mentor Sessions</h1>
            <p className="text-purple-200">
              Manage and track your upcoming mentorship sessions
            </p>
          </div>
          <Button
            onClick={fetchSessions}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {sessions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-200">Total Spent</CardTitle>
                <IndianRupee className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">₹{totalSpent}</div>
                <p className="text-xs text-purple-300">On mentorship sessions</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-200">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{completedSessions}</div>
                <p className="text-xs text-purple-300">Sessions finished</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-200">Upcoming</CardTitle>
                <Calendar className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{upcomingSessions}</div>
                <p className="text-xs text-purple-300">Sessions scheduled</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sessions List */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Your Sessions
            </CardTitle>
            <CardDescription className="text-purple-200">
              {sessions.length} {sessions.length === 1 ? 'Session' : 'Sessions'} Booked
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No sessions booked yet</h3>
                <p className="text-purple-200 mb-6">
                  You haven't booked any mentor sessions yet. Browse available mentors and book your first session!
                </p>
                <Button
                  onClick={() => window.location.href = '/student/mentors'}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Find Mentors
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-6 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        {/* Mentor Avatar */}
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                          {session.mentor.avatar ? (
                            <img
                              src={session.mentor.avatar}
                              alt={session.mentor.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-bold">
                              {session.mentor.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>

                        {/* Session Details */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">
                              {session.mentor.name}
                            </h3>
                            {getStatusBadge(session.status)}
                            {getStatusIcon(session.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-200">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(session.scheduledAt).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span>
                                {new Date(session.scheduledAt).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })} ({session.duration} minutes)
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <IndianRupee className="w-4 h-4" />
                              <span>₹{session.amount}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4" />
                              <span>{session.mentor.expertise.join(', ')}</span>
                            </div>
                          </div>

                          {session.notes && (
                            <div className="mt-3 p-3 bg-white/5 rounded-lg">
                              <p className="text-sm text-purple-200">
                                <strong>Notes:</strong> {session.notes}
                              </p>
                            </div>
                          )}

                          {session.meetLink && (session.status === 'CONFIRMED' || session.status === 'PENDING') && (
                            <div className="mt-3 flex items-center space-x-2">
                              <Video className="w-4 h-4 text-green-400" />
                              <a
                                href={session.meetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-green-400 hover:text-green-300 flex items-center space-x-1"
                              >
                                <span>Join Meeting</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCopyLink(session.meetLink!)}
                                className="h-6 px-2 text-purple-300 hover:text-white"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-2">
                        {(session.status === 'PENDING' || session.status === 'CONFIRMED') && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCancelSession(session.id)}
                            disabled={cancelling === session.id}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            {cancelling === session.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <LogOut className="w-4 h-4" />
                            )}
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}