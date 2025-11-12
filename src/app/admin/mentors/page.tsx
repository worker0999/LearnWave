'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { 
  UserCheck, 
  Users,
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Star,
  Calendar,
  DollarSign,
  Award,
  BookOpen,
  Clock,
  Mail,
  Phone
} from 'lucide-react'

interface Mentor {
  id: string
  name: string
  email: string
  usn?: string
  branch?: string
  semester?: number
  createdAt: string
  mentorProfile: {
    id: string
    bio: string
    expertise: string[]
    experience: string
    resume?: string
    approved: boolean
    rating?: number
    hourlyRate?: number
    createdAt: string
  }
  _count?: {
    mentorSessions: number
  }
}

export default function AdminMentorsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  // Filtering
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [branchFilter, setBranchFilter] = useState('ALL')

  const fetchMentors = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'ALL' && { status: statusFilter }),
        ...(branchFilter !== 'ALL' && { branch: branchFilter })
      })

      const response = await fetch(`/api/admin/mentors?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setMentors(data.mentors || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch mentors",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching mentors:', error)
      toast({
        title: "Error",
        description: "Failed to fetch mentors",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
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
        
        fetchMentors()
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

  const viewMentorDetails = (mentor: Mentor) => {
    setSelectedMentor(mentor)
    setDetailDialogOpen(true)
  }

  const getStatusColor = (approved: boolean) => {
    return approved ? 'bg-green-500' : 'bg-yellow-500'
  }

  const getStatusText = (approved: boolean) => {
    return approved ? 'Approved' : 'Pending'
  }

  const branches = [
    'Computer Science', 'Information Science', 'Electronics', 'Electrical',
    'Mechanical', 'Civil', 'Biotechnology', 'AI & ML', 'Data Science'
  ]

  useEffect(() => {
    if (user) {
      fetchMentors()
    }
  }, [user])

  useEffect(() => {
    fetchMentors()
  }, [searchTerm, statusFilter, branchFilter])

  return (
    <DashboardLayout userRole="ADMIN">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Mentor Approvals</h1>
            <p className="text-purple-200">Review and manage mentor applications</p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => fetchMentors()}
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
              <CardTitle className="text-sm font-medium text-purple-200">Total Mentors</CardTitle>
              <Users className="h-4 w-4 text-purple-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{mentors.length}</div>
              <p className="text-xs text-purple-300">Registered mentors</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Pending Approval</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {mentors.filter(m => !m.mentorProfile.approved).length}
              </div>
              <p className="text-xs text-purple-300">Awaiting review</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Approved Mentors</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {mentors.filter(m => m.mentorProfile.approved).length}
              </div>
              <p className="text-xs text-purple-300">Active mentors</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Avg. Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {mentors.length > 0 
                  ? (mentors.reduce((sum, m) => sum + (m.mentorProfile.rating || 0), 0) / mentors.length).toFixed(1)
                  : '0.0'
                }
              </div>
              <p className="text-xs text-purple-300">Average rating</p>
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
                    placeholder="Search by name, email, or expertise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-purple-300"
                  />
                </div>
              </div>
              <div className="w-full md:w-40">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-40">
                <Select value={branchFilter} onValueChange={setBranchFilter}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Branches</SelectItem>
                    {branches.map(branch => (
                      <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mentors Table */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Mentor Applications</CardTitle>
            <CardDescription className="text-purple-200">
              Review and approve mentor applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 text-purple-300 animate-spin" />
              </div>
            ) : mentors.length === 0 ? (
              <div className="text-center py-8">
                <UserCheck className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No mentor applications found</h3>
                <p className="text-purple-200">
                  {searchTerm || statusFilter !== 'ALL' || branchFilter !== 'ALL'
                    ? 'Try adjusting your filters' 
                    : 'No mentor applications yet'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-purple-200">Mentor</TableHead>
                      <TableHead className="text-purple-200">Expertise</TableHead>
                      <TableHead className="text-purple-200">Experience</TableHead>
                      <TableHead className="text-purple-200">Hourly Rate</TableHead>
                      <TableHead className="text-purple-200">Status</TableHead>
                      <TableHead className="text-purple-200">Applied</TableHead>
                      <TableHead className="text-purple-200">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mentors.map((mentor) => (
                      <TableRow key={mentor.id} className="border-white/10">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">
                                {mentor.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-white font-medium">{mentor.name}</p>
                              <p className="text-purple-300 text-sm">{mentor.email}</p>
                              {mentor.branch && (
                                <p className="text-purple-300 text-xs">{mentor.branch}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {mentor.mentorProfile.expertise.slice(0, 2).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-200 text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {mentor.mentorProfile.expertise.length > 2 && (
                              <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 text-xs">
                                +{mentor.mentorProfile.expertise.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-purple-200">
                          <div className="max-w-xs">
                            <p className="text-sm truncate">{mentor.mentorProfile.experience}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-purple-200">
                          {mentor.mentorProfile.hourlyRate ? `₹${mentor.mentorProfile.hourlyRate}/hr` : 'Not set'}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(mentor.mentorProfile.approved)}>
                            {getStatusText(mentor.mentorProfile.approved)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-purple-200">
                          {new Date(mentor.mentorProfile.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-purple-400 text-purple-200"
                              onClick={() => viewMentorDetails(mentor)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {!mentor.mentorProfile.approved && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-500 hover:bg-green-600"
                                  onClick={() => handleMentorAction(mentor.mentorProfile.id, 'approve')}
                                  disabled={actionLoading === mentor.id}
                                >
                                  {actionLoading === mentor.id ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleMentorAction(mentor.mentorProfile.id, 'reject')}
                                  disabled={actionLoading === mentor.id}
                                >
                                  {actionLoading === mentor.id ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <XCircle className="w-4 h-4" />
                                  )}
                                </Button>
                              </>
                            )}
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

        {/* Mentor Details Dialog */}
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="bg-slate-900 border-white/20 max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedMentor && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-white">Mentor Application Details</DialogTitle>
                  <DialogDescription className="text-purple-200">
                    Review mentor profile and application
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-purple-300 text-sm">Name</p>
                        <p className="text-white">{selectedMentor.name}</p>
                      </div>
                      <div>
                        <p className="text-purple-300 text-sm">Email</p>
                        <p className="text-white">{selectedMentor.email}</p>
                      </div>
                      {selectedMentor.usn && (
                        <div>
                          <p className="text-purple-300 text-sm">USN</p>
                          <p className="text-white">{selectedMentor.usn}</p>
                        </div>
                      )}
                      {selectedMentor.branch && (
                        <div>
                          <p className="text-purple-300 text-sm">Branch</p>
                          <p className="text-white">{selectedMentor.branch}</p>
                        </div>
                      )}
                      {selectedMentor.semester && (
                        <div>
                          <p className="text-purple-300 text-sm">Semester</p>
                          <p className="text-white">{selectedMentor.semester}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-purple-300 text-sm">Applied On</p>
                        <p className="text-white">{new Date(selectedMentor.mentorProfile.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Professional Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-purple-300 text-sm mb-2">Bio</p>
                        <p className="text-white bg-white/5 p-3 rounded-lg">{selectedMentor.mentorProfile.bio}</p>
                      </div>
                      <div>
                        <p className="text-purple-300 text-sm mb-2">Expertise</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedMentor.mentorProfile.expertise.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-200">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-purple-300 text-sm mb-2">Experience</p>
                        <p className="text-white bg-white/5 p-3 rounded-lg">{selectedMentor.mentorProfile.experience}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-purple-300 text-sm">Hourly Rate</p>
                          <p className="text-white">{selectedMentor.mentorProfile.hourlyRate ? `₹${selectedMentor.mentorProfile.hourlyRate}/hr` : 'Not set'}</p>
                        </div>
                        <div>
                          <p className="text-purple-300 text-sm">Sessions Completed</p>
                          <p className="text-white">{selectedMentor._count?.mentorSessions || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {!selectedMentor.mentorProfile.approved && (
                    <div className="flex justify-end space-x-2 pt-4 border-t border-white/10">
                      <Button
                        variant="outline"
                        onClick={() => setDetailDialogOpen(false)}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        Close
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleMentorAction(selectedMentor.mentorProfile.id, 'reject')
                          setDetailDialogOpen(false)
                        }}
                        disabled={actionLoading === selectedMentor.id}
                      >
                        {actionLoading === selectedMentor.id ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4 mr-2" />
                        )}
                        Reject Application
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        onClick={() => {
                          handleMentorAction(selectedMentor.mentorProfile.id, 'approve')
                          setDetailDialogOpen(false)
                        }}
                        disabled={actionLoading === selectedMentor.id}
                      >
                        {actionLoading === selectedMentor.id ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        Approve Application
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}