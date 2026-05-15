import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import {
  UserCheck,
  Users,
  Search,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Star,
  Clock
} from 'lucide-react'

export function MentorsView() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [mentors, setMentors] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [selectedMentor, setSelectedMentor] = useState<any | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

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
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setMentors(data.mentors || [])
      } else {
        toast({ title: "Error", description: "Failed to fetch mentors", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch mentors", variant: "destructive" })
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
        toast({ title: "Success", description: data.message })
        fetchMentors()
      } else {
        const errorData = await response.json()
        toast({ title: "Error", description: errorData.error || "Failed to process action", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to process action", variant: "destructive" })
    } finally {
      setActionLoading(null)
    }
  }

  const viewMentorDetails = (mentor: any) => {
    setSelectedMentor(mentor)
    setDetailDialogOpen(true)
  }

  const branches = [
    'Computer Science', 'Information Science', 'Electronics', 'Electrical',
    'Mechanical', 'Civil', 'Biotechnology', 'AI & ML', 'Data Science'
  ]

  useEffect(() => {
    if (user) fetchMentors()
  }, [user, searchTerm, statusFilter, branchFilter])

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#42413b] dark:text-[#f4f4f0] tracking-tight">Mentor Approvals</h1>
          <p className="text-[#a9a29e] mt-1 text-lg">Review and manage mentor applications</p>
        </div>
        <Button 
          onClick={fetchMentors} 
          variant="outline" 
          className="border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0] bg-transparent hover:bg-[#f4f4f0] dark:hover:bg-[#1c1b19]"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#a9a29e]">Total Mentors</CardTitle>
            <Users className="h-4 w-4 text-[#c8ced8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#42413b] dark:text-[#f4f4f0]">{mentors.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#a9a29e]">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-[#dfd3c3]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#42413b] dark:text-[#f4f4f0]">
              {mentors.filter(m => !m.mentorProfile.approved).length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#a9a29e]">Approved Mentors</CardTitle>
            <CheckCircle className="h-4 w-4 text-[#c8ced8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#42413b] dark:text-[#f4f4f0]">
              {mentors.filter(m => m.mentorProfile.approved).length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#a9a29e]">Avg. Rating</CardTitle>
            <Star className="h-4 w-4 text-[#dfd3c3]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#42413b] dark:text-[#f4f4f0]">
              {mentors.length > 0
                ? (mentors.reduce((sum, m) => sum + (m.mentorProfile.rating || 0), 0) / mentors.length).toFixed(1)
                : '0.0'
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-[#dfd3c3] dark:border-[#42413b] bg-gray-50/50 dark:bg-black/10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a9a29e] w-4 h-4" />
              <Input
                placeholder="Search by name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#ffffff] dark:bg-[#1c1b19] border-[#dfd3c3] dark:border-[#42413b] focus-visible:ring-[#c8ced8] text-[#42413b] dark:text-[#f4f4f0] h-10 rounded-xl"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 bg-[#ffffff] dark:bg-[#1c1b19] border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0] h-10 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b]">
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="w-full md:w-40 bg-[#ffffff] dark:bg-[#1c1b19] border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0] h-10 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b]">
                <SelectItem value="ALL">All Branches</SelectItem>
                {branches.map(branch => (
                  <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {mentors.length === 0 && !loading ? (
            <div className="text-center py-12">
              <UserCheck className="w-12 h-12 text-[#a9a29e] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#42413b] dark:text-[#f4f4f0] mb-2">No applications found</h3>
              <p className="text-[#a9a29e]">Try adjusting your filters</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-[#dfd3c3] dark:border-[#42413b] hover:bg-transparent">
                  <TableHead className="text-[#a9a29e] font-medium h-12 px-6">Mentor</TableHead>
                  <TableHead className="text-[#a9a29e] font-medium h-12">Expertise</TableHead>
                  <TableHead className="text-[#a9a29e] font-medium h-12">Status</TableHead>
                  <TableHead className="text-[#a9a29e] font-medium h-12">Applied</TableHead>
                  <TableHead className="text-[#a9a29e] font-medium h-12 text-right px-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mentors.map((mentor) => (
                  <TableRow key={mentor.id} className="border-[#dfd3c3] dark:border-[#42413b] hover:bg-[#f4f4f0]/50 dark:hover:bg-[#1c1b19]/50 transition-colors group">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#f4f4f0] dark:bg-[#1c1b19] border border-[#dfd3c3] dark:border-[#42413b] flex items-center justify-center flex-shrink-0">
                          <span className="text-[#42413b] dark:text-[#f4f4f0] font-bold text-sm">
                            {mentor.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-[#42413b] dark:text-[#f4f4f0] font-semibold">{mentor.name}</p>
                          <p className="text-[#a9a29e] text-sm">{mentor.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {mentor.mentorProfile.expertise.slice(0, 2).map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary" className="bg-[#f4f4f0] dark:bg-[#1c1b19] text-[#a9a29e] border border-[#dfd3c3] dark:border-[#42413b]">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        mentor.mentorProfile.approved 
                        ? 'bg-[#c8ced8] text-[#42413b] border-none' 
                        : 'bg-[#dfd3c3] text-[#42413b] border-none'
                      }>
                        {mentor.mentorProfile.approved ? 'Approved' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#a9a29e] text-sm">
                      {new Date(mentor.mentorProfile.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost" onClick={() => viewMentorDetails(mentor)} className="text-[#a9a29e] hover:text-[#42413b] dark:hover:text-[#f4f4f0] h-8 w-8 rounded-full">
                          <Eye size={16} />
                        </Button>
                        {!mentor.mentorProfile.approved && (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleMentorAction(mentor.id, 'approve')}
                              disabled={actionLoading === mentor.id}
                              className="text-[#a9a29e] hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 h-8 w-8 rounded-full"
                            >
                              <CheckCircle size={16} />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleMentorAction(mentor.id, 'reject')}
                              disabled={actionLoading === mentor.id}
                              className="text-[#a9a29e] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 h-8 w-8 rounded-full"
                            >
                              <XCircle size={16} />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl">
          {selectedMentor && (
            <>
              <DialogHeader>
                <DialogTitle className="text-[#42413b] dark:text-[#f4f4f0] text-xl">Mentor Application Details</DialogTitle>
                <DialogDescription className="text-[#a9a29e]">Review mentor profile</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                <div>
                  <h3 className="text-sm font-semibold text-[#a9a29e] uppercase tracking-wider mb-3">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4 bg-[#f4f4f0] dark:bg-[#1c1b19] p-4 rounded-xl border border-[#dfd3c3] dark:border-[#42413b]">
                    <div>
                      <p className="text-[#a9a29e] text-xs uppercase mb-1">Name</p>
                      <p className="text-[#42413b] dark:text-[#f4f4f0] font-medium">{selectedMentor.name}</p>
                    </div>
                    <div>
                      <p className="text-[#a9a29e] text-xs uppercase mb-1">Email</p>
                      <p className="text-[#42413b] dark:text-[#f4f4f0] font-medium">{selectedMentor.email}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#a9a29e] uppercase tracking-wider mb-3">Professional Information</h3>
                  <div className="space-y-4 bg-[#f4f4f0] dark:bg-[#1c1b19] p-4 rounded-xl border border-[#dfd3c3] dark:border-[#42413b]">
                    <div>
                      <p className="text-[#a9a29e] text-xs uppercase mb-1">Bio</p>
                      <p className="text-[#42413b] dark:text-[#f4f4f0]">{selectedMentor.mentorProfile.bio}</p>
                    </div>
                    <div>
                      <p className="text-[#a9a29e] text-xs uppercase mb-1">Experience</p>
                      <p className="text-[#42413b] dark:text-[#f4f4f0]">{selectedMentor.mentorProfile.experience}</p>
                    </div>
                  </div>
                </div>
                {!selectedMentor.mentorProfile.approved && (
                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={() => setDetailDialogOpen(false)} className="border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0] hover:bg-[#f4f4f0] dark:hover:bg-[#1c1b19]">
                      Close
                    </Button>
                    <Button 
                      onClick={() => { handleMentorAction(selectedMentor.id, 'approve'); setDetailDialogOpen(false); }}
                      className="bg-[#c8ced8] hover:bg-[#b5bcc7] text-[#42413b] shadow-sm transform hover:-translate-y-0.5 transition-all active:translate-y-0 dark:bg-[#c8ced8]/90 dark:hover:bg-[#c8ced8]"
                    >
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
  )
}
