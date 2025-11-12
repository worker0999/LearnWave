'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { 
  Users, 
  Calendar,
  DollarSign,
  Star,
  Clock,
  TrendingUp,
  Video,
  MessageSquare,
  Award,
  Zap,
  Play,
  Plus,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface MentorData {
  name: string
  email: string
  bio: string
  expertise: string[]
  experience: string
  rating: number
  hourlyRate: number
  totalSessions: number
  totalEarnings: number
  upcomingSessions: number
}

interface Session {
  id: string
  studentName: string
  title: string
  scheduledAt: string
  duration: number
  price: number
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
}

interface EarningData {
  month: string
  earnings: number
  sessions: number
}

export default function MentorDashboard() {
  const [mentorData, setMentorData] = useState<MentorData | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [earnings, setEarnings] = useState<EarningData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading
    const mockMentorData: MentorData = {
      name: 'Dr. Jane Doe',
      email: 'jane@example.com',
      bio: 'Experienced professor with 10+ years in Computer Science',
      expertise: ['Data Structures', 'Algorithms', 'Web Development'],
      experience: '10+ years of industry and academic experience',
      rating: 4.8,
      hourlyRate: 50,
      totalSessions: 156,
      totalEarnings: 7800,
      upcomingSessions: 8
    }

    const mockSessions: Session[] = [
      {
        id: '1',
        studentName: 'John Smith',
        title: 'Data Structures Doubt Clearing',
        scheduledAt: '2024-01-25T14:00:00Z',
        duration: 60,
        price: 50,
        status: 'SCHEDULED'
      },
      {
        id: '2',
        studentName: 'Emily Johnson',
        title: 'Algorithm Analysis Help',
        scheduledAt: '2024-01-25T16:00:00Z',
        duration: 45,
        price: 37.5,
        status: 'SCHEDULED'
      },
      {
        id: '3',
        studentName: 'Michael Brown',
        title: 'Web Development Guidance',
        scheduledAt: '2024-01-24T10:00:00Z',
        duration: 60,
        price: 50,
        status: 'COMPLETED'
      }
    ]

    const mockEarnings: EarningData[] = [
      { month: 'Jan', earnings: 1200, sessions: 24 },
      { month: 'Feb', earnings: 950, sessions: 19 },
      { month: 'Mar', earnings: 1400, sessions: 28 },
      { month: 'Apr', earnings: 1100, sessions: 22 },
      { month: 'May', earnings: 1350, sessions: 27 },
      { month: 'Jun', earnings: 800, sessions: 16 }
    ]

    setTimeout(() => {
      setMentorData(mockMentorData)
      setSessions(mockSessions)
      setEarnings(mockEarnings)
      setLoading(false)
    }, 1000)
  }, [])

  const handleStartSession = (sessionId: string) => {
    console.log('Starting session:', sessionId)
    // Navigate to session or open meeting link
  }

  const handleCompleteSession = (sessionId: string) => {
    console.log('Completing session:', sessionId)
    // Update session status
  }

  if (loading) {
    return (
      <DashboardLayout userRole="MENTOR">
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    )
  }

  if (!mentorData) return null

  return (
    <DashboardLayout userRole="MENTOR">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {mentorData.name}!</h1>
            <p className="text-purple-200">Empower students with your expertise</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${mentorData.totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-purple-300">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Total Sessions</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{mentorData.totalSessions}</div>
              <p className="text-xs text-purple-300">Lifetime sessions</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{mentorData.rating}</div>
              <p className="text-xs text-purple-300">Excellent mentor</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Upcoming</CardTitle>
              <Calendar className="h-4 w-4 text-purple-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{mentorData.upcomingSessions}</div>
              <p className="text-xs text-purple-300">Sessions this week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-purple-200">
                  Manage your mentorship activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex flex-col space-y-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105">
                    <Plus className="w-6 h-6" />
                    <span className="text-xs">New Session</span>
                  </Button>
                  <Button className="h-20 flex flex-col space-y-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105">
                    <Calendar className="w-6 h-6" />
                    <span className="text-xs">Schedule</span>
                  </Button>
                  <Button className="h-20 flex flex-col space-y-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105">
                    <MessageSquare className="w-6 h-6" />
                    <span className="text-xs">Messages</span>
                  </Button>
                  <Button className="h-20 flex flex-col space-y-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105">
                    <Award className="w-6 h-6" />
                    <span className="text-xs">Profile</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sessions */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Recent Sessions</CardTitle>
                <CardDescription className="text-purple-200">
                  Manage your mentoring sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-white font-semibold">{session.title}</h3>
                          <p className="text-purple-200 text-sm">with {session.studentName}</p>
                        </div>
                        <Badge 
                          className={
                            session.status === 'COMPLETED' ? 'bg-green-500' :
                            session.status === 'SCHEDULED' ? 'bg-blue-500' : 'bg-red-500'
                          }
                        >
                          {session.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-purple-200">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {new Date(session.scheduledAt).toLocaleDateString()} {new Date(session.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            ${session.price}
                          </span>
                          <span>{session.duration} minutes</span>
                        </div>
                        <div className="flex space-x-2">
                          {session.status === 'SCHEDULED' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-500 hover:bg-green-600"
                                onClick={() => handleStartSession(session.id)}
                              >
                                <Play className="w-4 h-4 mr-1" />
                                Start
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-purple-400 text-purple-200"
                              >
                                <Video className="w-4 h-4 mr-1" />
                                Join
                              </Button>
                            </>
                          )}
                          {session.status === 'COMPLETED' && (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Earnings Overview */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Earnings Overview</CardTitle>
                <CardDescription className="text-purple-200">
                  Track your monthly earnings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <p className="text-purple-200">Earnings chart would go here</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-purple-200 text-sm">This Month</p>
                    <p className="text-white font-bold text-lg">$1,200</p>
                  </div>
                  <div className="text-center">
                    <p className="text-purple-200 text-sm">Last Month</p>
                    <p className="text-white font-bold text-lg">$950</p>
                  </div>
                  <div className="text-center">
                    <p className="text-purple-200 text-sm">Average</p>
                    <p className="text-white font-bold text-lg">$1,150</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Profile Overview */}
            <Card className="bg-gradient-to-br from-purple-500 to-pink-500 border-none">
              <CardHeader>
                <CardTitle className="text-white">Profile Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-purple-100 text-sm">Expertise</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {mentorData.expertise.map((skill, index) => (
                        <Badge key={index} className="bg-white/20 text-white text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-purple-100 text-sm">Hourly Rate</p>
                    <p className="text-white font-bold">${mentorData.hourlyRate}/hour</p>
                  </div>
                  <div>
                    <p className="text-purple-100 text-sm">Experience</p>
                    <p className="text-white text-sm">{mentorData.experience}</p>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-white text-purple-600 hover:bg-purple-50 transition-all">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-purple-200">Response Rate</span>
                      <span className="text-white">95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-purple-200">On-time Rate</span>
                      <span className="text-white">98%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-purple-200">Student Satisfaction</span>
                      <span className="text-white">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sessions
                    .filter(s => s.status === 'SCHEDULED' && new Date(s.scheduledAt).toDateString() === new Date().toDateString())
                    .map((session) => (
                      <div key={session.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium text-sm">{session.studentName}</span>
                          <span className="text-purple-200 text-xs">
                            {new Date(session.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        <p className="text-purple-200 text-xs">{session.title}</p>
                      </div>
                    ))}
                  {sessions.filter(s => s.status === 'SCHEDULED' && new Date(s.scheduledAt).toDateString() === new Date().toDateString()).length === 0 && (
                    <p className="text-purple-200 text-center text-sm">No sessions today</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}