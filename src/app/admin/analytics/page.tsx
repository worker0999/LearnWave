'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { 
  BarChart3, 
  TrendingUp,
  Users,
  BookOpen,
  Calendar,
  DollarSign,
  Activity,
  Star,
  Eye,
  RefreshCw,
  Download,
  UserPlus,
  Clock,
  Target,
  Zap
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalUsers: number
    totalStudents: number
    totalMentors: number
    totalAdmins: number
    pendingMentors: number
    approvedMentors: number
  }
  sessions: {
    totalSessions: number
    completedSessions: number
    pendingSessions: number
    confirmedSessions: number
    totalRevenue: number
    completedSessionsCount: number
  }
  monthlyRegistrations: any[]
  sessionStats: any[]
  topMentors: any[]
  recentActivity: {
    recentUsers: any[]
    recentSessions: any[]
  }
}

export default function AdminAnalyticsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [timeRange, setTimeRange] = useState('7d')

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.analytics)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch analytics",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast({
        title: "Error",
        description: "Failed to fetch analytics",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchAnalytics()
    }
  }, [user, timeRange])

  return (
    <DashboardLayout userRole="ADMIN">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-purple-200">Platform performance and insights</p>
          </div>
          <div className="flex space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => fetchAnalytics()}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 text-purple-300 animate-spin" />
          </div>
        ) : analytics ? (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-200">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-purple-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{analytics.overview.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-purple-300">
                    {analytics.overview.totalStudents} students, {analytics.overview.totalMentors} mentors
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-200">Total Sessions</CardTitle>
                  <Calendar className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{analytics.sessions.totalSessions}</div>
                  <p className="text-xs text-purple-300">
                    {analytics.sessions.completedSessions} completed
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-200">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">₹{analytics.sessions.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-purple-300">
                    From {analytics.sessions.completedSessions} sessions
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-200">Active Mentors</CardTitle>
                  <Star className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{analytics.overview.approvedMentors}</div>
                  <p className="text-xs text-purple-300">
                    {analytics.overview.pendingMentors} pending approval
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Detailed Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Session Statistics */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-blue-400" />
                    Session Statistics
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Platform session overview
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-purple-200">Total Sessions</span>
                      <span className="text-white font-bold">{analytics.sessions.totalSessions}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-purple-200">Completed Sessions</span>
                      <span className="text-green-400 font-bold">{analytics.sessions.completedSessions}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-purple-200">Pending Sessions</span>
                      <span className="text-yellow-400 font-bold">{analytics.sessions.pendingSessions}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-purple-200">Confirmed Sessions</span>
                      <span className="text-blue-400 font-bold">{analytics.sessions.confirmedSessions}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-purple-200">Total Revenue</span>
                      <span className="text-green-400 font-bold">₹{analytics.sessions.totalRevenue.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Growth */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                    User Growth
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Monthly registration trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.monthlyRegistrations.slice(0, 6).map((month, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                            <UserPlus className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{month.month}</p>
                            <p className="text-purple-300 text-xs">New registrations</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">{month.count}</p>
                          <p className="text-green-400 text-xs">
                            {month.growth > 0 ? `+${month.growth}%` : `${month.growth}%`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Mentors and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Mentors */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-400" />
                    Top Performing Mentors
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Best performing mentors this period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.topMentors.slice(0, 5).map((mentor, index) => (
                      <div key={mentor.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{index + 1}</span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{mentor.name}</p>
                            <p className="text-purple-300 text-xs">{mentor.expertise?.slice(0, 2).join(', ') || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">{mentor.totalSessions || 0}</p>
                          <p className="text-purple-300 text-xs">sessions</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-purple-400" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Latest platform activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.recentActivity.recentUsers.slice(0, 4).map((recentUser) => (
                      <div key={recentUser.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <UserPlus className="w-4 h-4 text-green-400" />
                          <div>
                            <p className="text-white font-medium">{recentUser.name}</p>
                            <p className="text-purple-300 text-xs">{recentUser.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            className={
                              recentUser.role === 'ADMIN' ? 'bg-red-500' :
                              recentUser.role === 'MENTOR' ? 'bg-blue-500' : 'bg-green-500'
                            }
                          >
                            {recentUser.role}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Session Activity */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 mt-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2 text-orange-400" />
                  Recent Sessions
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Latest mentorship sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.recentActivity.recentSessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Zap className="w-4 h-4 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">{session.student?.name} ↔ {session.mentor?.name}</p>
                          <p className="text-purple-300 text-xs">₹{session.amount || 0} • {session.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-purple-300 text-xs">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-purple-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No analytics data available</h3>
            <p className="text-purple-200">
              Start using the platform to see analytics here
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}