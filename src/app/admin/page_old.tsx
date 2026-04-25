'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { 
  Users, 
  UserCheck, 
  BookOpen, 
  MessageSquare, 
  Calendar, 
  TrendingUp,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  BarChart3,
  Award,
  Clock,
  Zap,
  Search,
  Filter,
  Trash2,
  RefreshCw,
  IndianRupee,
  Star,
  UserPlus,
  Activity,
  Bell,
  Plus,
  Edit,
  Settings
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

interface User {
  id: string
  name: string
  email: string
  role: string
  usn?: string
  branch?: string
  semester?: number
  createdAt: string
  mentorProfile?: {
    approved: boolean
    rating?: number
    hourlyRate?: number
    expertise?: string[]
  }
  _count?: {
    mentorSessions: number
    studentSessions: number
  }
}

interface Announcement {
  id: string
  title: string
  content: string
  type: string
  createdAt: string
  createdBy: string
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [pendingMentors, setPendingMentors] = useState<User[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [usersLoading, setUsersLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('mentors')

  // Pagination and filtering
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')

  // Announcement form state
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false)
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    type: 'GENERAL'
  })

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.analytics)
      } else {
        console.error('Failed to fetch analytics')
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  const fetchUsers = async (page = 1, search = '', role = 'ALL') => {
    setUsersLoading(true)
    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(role !== 'ALL' && { role })
      })

      const response = await fetch(`/api/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        setTotalPages(data.pagination.pages)
        setCurrentPage(data.pagination.page)
        
        // Filter pending mentors
        const pending = data.users.filter((user: User) => 
          user.role === 'MENTOR' && user.mentorProfile && !user.mentorProfile.approved
        )
        setPendingMentors(pending)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      })
    } finally {
      setUsersLoading(false)
    }
  }

  const handleMentorAction = async (mentorId: string, action: 'approve' | 'reject') => {
    setActionLoading(mentorId)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/mentors/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ mentorId, action })
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: data.message,
        })
        
        // Refresh data
        fetchUsers(currentPage, searchTerm, roleFilter)
        fetchAnalytics()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to process action",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error processing mentor action:', error)
      toast({
        title: "Error",
        description: "Failed to process action",
        variant: "destructive"
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    setActionLoading(userId)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        })
        
        // Refresh data
        fetchUsers(currentPage, searchTerm, roleFilter)
        fetchAnalytics()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to delete user",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      })
    } finally {
      setActionLoading(null)
    }
  }

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/announcements', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data.announcements)
      } else {
        console.error('Failed to fetch announcements')
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    }
  }

  const handleCreateAnnouncement = async () => {
    if (!announcementForm.title || !announcementForm.content) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive"
      })
      return
    }

    setActionLoading('create-announcement')
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(announcementForm)
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: data.message,
        })
        
        // Reset form and refresh
        setAnnouncementForm({
          title: '',
          content: '',
          type: 'GENERAL'
        })
        setShowAnnouncementDialog(false)
        fetchAnnouncements()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to create announcement",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error creating announcement:', error)
      toast({
        title: "Error",
        description: "Failed to create announcement",
        variant: "destructive"
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteAnnouncement = async (announcementId: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return
    }

    setActionLoading(announcementId)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/announcements?id=${announcementId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Announcement deleted successfully",
        })
        
        fetchAnnouncements()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to delete announcement",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting announcement:', error)
      toast({
        title: "Error",
        description: "Failed to delete announcement",
        variant: "destructive"
      })
    } finally {
      setActionLoading(null)
    }
  }

  useEffect(() => {
    if (user) {
      fetchAnalytics()
      fetchUsers()
      fetchAnnouncements()
    }
  }, [user])

  useEffect(() => {
    fetchUsers(currentPage, searchTerm, roleFilter)
  }, [currentPage, searchTerm, roleFilter])

  // Handle hash-based navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) // Remove the # symbol
      if (hash && ['mentors', 'users', 'announcements', 'resources', 'analytics', 'settings'].includes(hash)) {
        setActiveTab(hash)
      }
    }

    // Check initial hash
    handleHashChange()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (loading && !analytics) {
    return (
      <DashboardLayout userRole="ADMIN">
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="ADMIN">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-cyan-200">Manage LearnWave platform</p>
          </div>
          <div className="flex space-x-2">
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

        {/* Stats Grid */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-cyan-200">Total Users</CardTitle>
                <Users className="h-4 w-4 text-cyan-300" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{analytics.overview.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-cyan-300">
                  {analytics.overview.totalStudents} students, {analytics.overview.totalMentors} mentors
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-cyan-200">Active Students</CardTitle>
                <BookOpen className="h-4 w-4 text-cyan-300" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{analytics.overview.totalStudents.toLocaleString()}</div>
                <p className="text-xs text-cyan-300">Registered students</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-cyan-200">Expert Mentors</CardTitle>
                <Award className="h-4 w-4 text-cyan-300" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{analytics.overview.approvedMentors}</div>
                <p className="text-xs text-cyan-300">{analytics.overview.pendingMentors} pending approval</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-cyan-200">Total Revenue</CardTitle>
                <IndianRupee className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">₹{analytics.sessions.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-cyan-300">From {analytics.sessions.completedSessions} sessions</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="mentors" className="text-white data-[state=active]:bg-cyan-500">
              <UserCheck className="w-4 h-4 mr-2" />
              Mentor Approvals
              {pendingMentors.length > 0 && (
                <Badge className="ml-2 bg-yellow-500 text-white text-xs">
                  {pendingMentors.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="users" className="text-white data-[state=active]:bg-cyan-500">
              <Users className="w-4 h-4 mr-2" />
              All Users
            </TabsTrigger>
            <TabsTrigger value="announcements" className="text-white data-[state=active]:bg-cyan-500">
              <Bell className="w-4 h-4 mr-2" />
              Announcements
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-cyan-500">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Mentor Approvals Tab */}
          <TabsContent value="mentors">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-yellow-400" />
                  Pending Mentor Approvals
                </CardTitle>
                <CardDescription className="text-cyan-200">
                  Review and approve mentor applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingMentors.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <p className="text-cyan-200">No pending mentor approvals</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/20">
                        <TableHead className="text-cyan-200">Name</TableHead>
                        <TableHead className="text-cyan-200">Email</TableHead>
                        <TableHead className="text-cyan-200">Expertise</TableHead>
                        <TableHead className="text-cyan-200">Hourly Rate</TableHead>
                        <TableHead className="text-cyan-200">Applied</TableHead>
                        <TableHead className="text-cyan-200">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingMentors.map((mentor) => (
                        <TableRow key={mentor.id} className="border-white/10">
                          <TableCell className="text-white">{mentor.name}</TableCell>
                          <TableCell className="text-cyan-200">{mentor.email}</TableCell>
                          <TableCell className="text-cyan-200">
                            {mentor.mentorProfile?.expertise ? 
                              (Array.isArray(mentor.mentorProfile.expertise) ? 
                                mentor.mentorProfile.expertise.join(', ') : 
                                mentor.mentorProfile.expertise) : 'N/A'}
                          </TableCell>
                          <TableCell className="text-cyan-200">
                            ₹{mentor.mentorProfile?.hourlyRate || 0}/hr
                          </TableCell>
                          <TableCell className="text-cyan-200">
                            {new Date(mentor.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                className="bg-green-500 hover:bg-green-600"
                                onClick={() => handleMentorAction(mentor.id, 'approve')}
                                disabled={actionLoading === mentor.id}
                              >
                                {actionLoading === mentor.id ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                )}
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleMentorAction(mentor.id, 'reject')}
                                disabled={actionLoading === mentor.id}
                              >
                                {actionLoading === mentor.id ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <XCircle className="w-4 h-4 mr-1" />
                                )}
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Users Tab */}
          <TabsContent value="users">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">All Users</CardTitle>
                <CardDescription className="text-cyan-200">
                  Manage all platform users
                </CardDescription>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-300 w-4 h-4" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder-cyan-300"
                      />
                    </div>
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Roles</SelectItem>
                      <SelectItem value="STUDENT">Students</SelectItem>
                      <SelectItem value="MENTOR">Mentors</SelectItem>
                      <SelectItem value="ADMIN">Admins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 text-cyan-300 mx-auto mb-4 animate-spin" />
                    <p className="text-cyan-200">Loading users...</p>
                  </div>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/20">
                          <TableHead className="text-cyan-200">Name</TableHead>
                          <TableHead className="text-cyan-200">Email</TableHead>
                          <TableHead className="text-cyan-200">Role</TableHead>
                          <TableHead className="text-cyan-200">Details</TableHead>
                          <TableHead className="text-cyan-200">Sessions</TableHead>
                          <TableHead className="text-cyan-200">Joined</TableHead>
                          <TableHead className="text-cyan-200">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id} className="border-white/10">
                            <TableCell className="text-white">{user.name}</TableCell>
                            <TableCell className="text-cyan-200">{user.email}</TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  user.role === 'ADMIN' ? 'bg-red-500' :
                                  user.role === 'MENTOR' ? 'bg-blue-500' : 'bg-green-500'
                                }
                              >
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-cyan-200">
                              {user.role === 'STUDENT' ? `${user.branch} - Sem ${user.semester}` : 
                               user.role === 'MENTOR' ? (
                                <div className="space-y-1">
                                  <div className="flex items-center">
                                    <Star className="w-3 h-3 mr-1" />
                                    {user.mentorProfile?.rating || 'N/A'}
                                  </div>
                                  <div className="text-xs">
                                    {user.mentorProfile?.approved ? 'Approved' : 'Pending'}
                                  </div>
                                </div>
                               ) : '-'}
                            </TableCell>
                            <TableCell className="text-cyan-200">
                              {user._count ? (
                                <div className="text-xs">
                                  {user.role === 'MENTOR' ? user._count.mentorSessions : user._count.studentSessions}
                                </div>
                              ) : '0'}
                            </TableCell>
                            <TableCell className="text-cyan-200">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-cyan-400 text-cyan-200"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {user.id !== user?.id && (
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteUser(user.id)}
                                    disabled={actionLoading === user.id}
                                  >
                                    {actionLoading === user.id ? (
                                      <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="w-4 h-4" />
                                    )}
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center space-x-2 mt-6">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="bg-white/10 border-white/20 text-white"
                        >
                          Previous
                        </Button>
                        <span className="text-cyan-200">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="bg-white/10 border-white/20 text-white"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white flex items-center">
                      <Bell className="w-5 h-5 mr-2 text-yellow-400" />
                      Manage Announcements
                    </CardTitle>
                    <CardDescription className="text-cyan-200">
                      Create and manage platform announcements
                    </CardDescription>
                  </div>
                  <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Announcement
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-white/20">
                      <DialogHeader>
                        <DialogTitle className="text-white">Create New Announcement</DialogTitle>
                        <DialogDescription className="text-cyan-200">
                          Send an announcement to all platform users
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-white text-sm font-medium mb-2 block">Title</label>
                          <Input
                            placeholder="Enter announcement title"
                            value={announcementForm.title}
                            onChange={(e) => setAnnouncementForm(prev => ({ ...prev, title: e.target.value }))}
                            className="bg-white/10 border-white/20 text-white placeholder-cyan-300"
                          />
                        </div>
                        <div>
                          <label className="text-white text-sm font-medium mb-2 block">Content</label>
                          <Textarea
                            placeholder="Enter announcement content"
                            value={announcementForm.content}
                            onChange={(e) => setAnnouncementForm(prev => ({ ...prev, content: e.target.value }))}
                            className="bg-white/10 border-white/20 text-white placeholder-cyan-300 min-h-[100px]"
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="text-white text-sm font-medium mb-2 block">Type</label>
                            <Select value={announcementForm.type} onValueChange={(value) => setAnnouncementForm(prev => ({ ...prev, type: value }))}>
                              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="GENERAL">General</SelectItem>
                                <SelectItem value="EXAM">Exam</SelectItem>
                                <SelectItem value="VTU_CIRCULAR">VTU Circular</SelectItem>
                                <SelectItem value="COLLEGE_EVENT">College Event</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setShowAnnouncementDialog(false)}
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleCreateAnnouncement}
                            disabled={actionLoading === 'create-announcement'}
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                          >
                            {actionLoading === 'create-announcement' ? (
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Plus className="w-4 h-4 mr-2" />
                            )}
                            Create Announcement
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {announcements.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="w-12 h-12 text-cyan-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No announcements yet</h3>
                    <p className="text-cyan-200 mb-6">
                      Create your first announcement to keep users informed
                    </p>
                    <Button
                      onClick={() => setShowAnnouncementDialog(true)}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Announcement
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/20">
                        <TableHead className="text-cyan-200">Title</TableHead>
                        <TableHead className="text-cyan-200">Type</TableHead>
                        <TableHead className="text-cyan-200">Created</TableHead>
                        <TableHead className="text-cyan-200">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {announcements.map((announcement) => (
                        <TableRow key={announcement.id} className="border-white/10">
                          <TableCell className="text-white">
                            <div>
                              <p className="font-medium">{announcement.title}</p>
                              <p className="text-cyan-300 text-sm mt-1 line-clamp-2">
                                {announcement.content}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                announcement.type === 'EXAM' ? 'bg-red-500' :
                                announcement.type === 'VTU_CIRCULAR' ? 'bg-blue-500' :
                                announcement.type === 'COLLEGE_EVENT' ? 'bg-green-500' : 'bg-cyan-500'
                              }
                            >
                              {announcement.type.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-cyan-200">
                            {new Date(announcement.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-cyan-400 text-cyan-200"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteAnnouncement(announcement.id)}
                                disabled={actionLoading === announcement.id}
                              >
                                {actionLoading === announcement.id ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analytics && (
                <>
                  <Card className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Session Statistics</CardTitle>
                      <CardDescription className="text-cyan-200">
                        Platform session overview
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-cyan-200">Total Sessions</span>
                          <span className="text-white font-bold">{analytics.sessions.totalSessions}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-cyan-200">Completed Sessions</span>
                          <span className="text-green-400 font-bold">{analytics.sessions.completedSessions}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-cyan-200">Pending Sessions</span>
                          <span className="text-yellow-400 font-bold">{analytics.sessions.pendingSessions}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-cyan-200">Confirmed Sessions</span>
                          <span className="text-blue-400 font-bold">{analytics.sessions.confirmedSessions}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-cyan-200">Total Revenue</span>
                          <span className="text-green-400 font-bold">₹{analytics.sessions.totalRevenue.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Top Mentors</CardTitle>
                      <CardDescription className="text-cyan-200">
                        Best performing mentors
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
                                <p className="text-cyan-300 text-xs">{mentor.expertise.slice(0, 2).join(', ')}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-bold">{mentor.totalSessions}</p>
                              <p className="text-cyan-300 text-xs">sessions</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Recent Activity</CardTitle>
                      <CardDescription className="text-cyan-200">
                        Latest user registrations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analytics.recentActivity.recentUsers.map((recentUser) => (
                          <div key={recentUser.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <UserPlus className="w-4 h-4 text-green-400" />
                              <div>
                                <p className="text-white font-medium">{recentUser.name}</p>
                                <p className="text-cyan-300 text-xs">{recentUser.email}</p>
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

                  <Card className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Recent Sessions</CardTitle>
                      <CardDescription className="text-cyan-200">
                        Latest mentorship sessions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analytics.recentActivity.recentSessions.map((session) => (
                          <div key={session.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Activity className="w-4 h-4 text-blue-400" />
                              <div>
                                <p className="text-white font-medium">{session.student.name} ↔ {session.mentor.name}</p>
                                <p className="text-cyan-300 text-xs">₹{session.amount} • {session.status}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-cyan-300 text-xs">
                                {new Date(session.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
                  Manage Resources
                </CardTitle>
                <CardDescription className="text-cyan-200">
                  Upload and manage study materials, notes, and resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-cyan-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Resource Management</h3>
                  <p className="text-cyan-200 mb-6">
                    Upload and organize study materials for students
                  </p>
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Resource
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-gray-400" />
                  Platform Settings
                </CardTitle>
                <CardDescription className="text-cyan-200">
                  Configure platform settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">General Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Maintenance Mode</p>
                          <p className="text-cyan-300 text-sm">Temporarily disable platform access</p>
                        </div>
                        <Button variant="outline" className="border-cyan-400 text-cyan-200">
                          Configure
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Email Notifications</p>
                          <p className="text-cyan-300 text-sm">Manage system email settings</p>
                        </div>
                        <Button variant="outline" className="border-cyan-400 text-cyan-200">
                          Configure
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Payment Settings</p>
                          <p className="text-cyan-300 text-sm">Configure payment gateway</p>
                        </div>
                        <Button variant="outline" className="border-cyan-400 text-cyan-200">
                          Configure
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
