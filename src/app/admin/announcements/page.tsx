'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { 
  Bell, 
  Plus,
  Search,
  Filter,
  Trash2,
  RefreshCw,
  Eye,
  Edit,
  Send,
  Megaphone,
  Calendar,
  Users,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface Announcement {
  id: string
  title: string
  content: string
  type: string
  createdAt: string
  createdBy: string
  status?: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED'
  scheduledFor?: string
  readCount?: number
}

export default function AdminAnnouncementsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  // Filtering
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Create form
  const [createForm, setCreateForm] = useState({
    title: '',
    content: '',
    type: 'GENERAL',
    status: 'PUBLISHED',
    scheduledFor: ''
  })

  const fetchAnnouncements = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(typeFilter !== 'ALL' && { type: typeFilter }),
        ...(statusFilter !== 'ALL' && { status: statusFilter })
      })

      const response = await fetch(`/api/admin/announcements?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data.announcements || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch announcements",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
      toast({
        title: "Error",
        description: "Failed to fetch announcements",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAnnouncement = async () => {
    if (!createForm.title || !createForm.content) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive"
      })
      return
    }

    setActionLoading('create')
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(createForm)
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Success",
          description: data.message,
        })
        
        // Reset form and refresh
        setCreateForm({
          title: '',
          content: '',
          type: 'GENERAL',
          status: 'PUBLISHED',
          scheduledFor: ''
        })
        setCreateDialogOpen(false)
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'EXAM': return 'bg-red-500'
      case 'VTU_CIRCULAR': return 'bg-blue-500'
      case 'COLLEGE_EVENT': return 'bg-green-500'
      case 'URGENT': return 'bg-orange-500'
      default: return 'bg-purple-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-500'
      case 'DRAFT': return 'bg-gray-500'
      case 'SCHEDULED': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'EXAM': return <AlertCircle className="w-4 h-4" />
      case 'VTU_CIRCULAR': return <Send className="w-4 h-4" />
      case 'COLLEGE_EVENT': return <Calendar className="w-4 h-4" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  useEffect(() => {
    if (user) {
      fetchAnnouncements()
    }
  }, [user])

  useEffect(() => {
    fetchAnnouncements()
  }, [searchTerm, typeFilter, statusFilter])

  return (
    <DashboardLayout userRole="ADMIN">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Announcement Management</h1>
            <p className="text-purple-200">Create and manage platform announcements</p>
          </div>
          <div className="flex space-x-2">
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Announcement
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-white/20 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Announcement</DialogTitle>
                  <DialogDescription className="text-purple-200">
                    Send an announcement to all platform users
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Title *</label>
                    <Input
                      placeholder="Enter announcement title"
                      value={createForm.title}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder-purple-300"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Type</label>
                      <Select value={createForm.type} onValueChange={(value) => setCreateForm(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GENERAL">General</SelectItem>
                          <SelectItem value="EXAM">Exam</SelectItem>
                          <SelectItem value="VTU_CIRCULAR">VTU Circular</SelectItem>
                          <SelectItem value="COLLEGE_EVENT">College Event</SelectItem>
                          <SelectItem value="URGENT">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Status</label>
                      <Select value={createForm.status} onValueChange={(value) => setCreateForm(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DRAFT">Draft</SelectItem>
                          <SelectItem value="PUBLISHED">Publish Now</SelectItem>
                          <SelectItem value="SCHEDULED">Schedule</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {createForm.status === 'SCHEDULED' && (
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Schedule For</label>
                      <Input
                        type="datetime-local"
                        value={createForm.scheduledFor}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, scheduledFor: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Content *</label>
                    <Textarea
                      placeholder="Enter announcement content"
                      value={createForm.content}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, content: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder-purple-300 min-h-[120px]"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setCreateDialogOpen(false)}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateAnnouncement}
                      disabled={actionLoading === 'create'}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      {actionLoading === 'create' ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      {createForm.status === 'PUBLISHED' ? 'Publish Now' : 'Create Announcement'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button
              onClick={() => fetchAnnouncements()}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Total Announcements</CardTitle>
              <Megaphone className="h-4 w-4 text-purple-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{announcements.length}</div>
              <p className="text-xs text-purple-300">All time</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Published</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {announcements.filter(a => a.status === 'PUBLISHED').length}
              </div>
              <p className="text-xs text-purple-300">Active announcements</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Drafts</CardTitle>
              <Edit className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {announcements.filter(a => a.status === 'DRAFT').length}
              </div>
              <p className="text-xs text-purple-300">Unpublished</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Total Reach</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {announcements.reduce((sum, a) => sum + (a.readCount || 0), 0)}
              </div>
              <p className="text-xs text-purple-300">Total reads</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-4 h-4" />
                  <Input
                    placeholder="Search announcements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-purple-300"
                  />
                </div>
              </div>
              <div className="w-full md:w-40">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="GENERAL">General</SelectItem>
                    <SelectItem value="EXAM">Exam</SelectItem>
                    <SelectItem value="VTU_CIRCULAR">VTU Circular</SelectItem>
                    <SelectItem value="COLLEGE_EVENT">College Event</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-32">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Announcements Table */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">All Announcements</CardTitle>
            <CardDescription className="text-purple-200">
              Manage and monitor platform announcements
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 text-purple-300 animate-spin" />
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No announcements found</h3>
                <p className="text-purple-200 mb-6">
                  {searchTerm || typeFilter !== 'ALL' || statusFilter !== 'ALL'
                    ? 'Try adjusting your filters' 
                    : 'Create your first announcement to get started'
                  }
                </p>
                <Button
                  onClick={() => setCreateDialogOpen(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Announcement
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-purple-200">Announcement</TableHead>
                      <TableHead className="text-purple-200">Type</TableHead>
                      <TableHead className="text-purple-200">Status</TableHead>
                      <TableHead className="text-purple-200">Reach</TableHead>
                      <TableHead className="text-purple-200">Created</TableHead>
                      <TableHead className="text-purple-200">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {announcements.map((announcement) => (
                      <TableRow key={announcement.id} className="border-white/10">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                              {getTypeIcon(announcement.type)}
                            </div>
                            <div>
                              <p className="text-white font-medium">{announcement.title}</p>
                              <p className="text-purple-300 text-sm line-clamp-1">
                                {announcement.content.substring(0, 100)}...
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(announcement.type)}>
                            {announcement.type.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(announcement.status || 'PUBLISHED')}>
                            {announcement.status || 'PUBLISHED'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-purple-200">
                          {announcement.readCount || 0} reads
                        </TableCell>
                        <TableCell className="text-purple-200">
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-purple-400 text-purple-200"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-purple-400 text-purple-200"
                            >
                              <Edit className="w-4 h-4" />
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}