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
  BookOpen, 
  Upload,
  Search,
  Filter,
  Trash2,
  RefreshCw,
  Plus,
  Eye,
  Edit,
  Download,
  FileText,
  Video,
  Image,
  Archive
} from 'lucide-react'

interface Resource {
  id: string
  title: string
  description: string
  type: string
  subject: string
  semester: number
  unit?: string
  fileUrl: string
  fileName: string
  fileSize: number
  uploadedBy: string
  createdAt: string
  downloadCount: number
}

export default function AdminResourcesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  // Filtering
  const [searchTerm, setSearchTerm] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [semesterFilter, setSemesterFilter] = useState('ALL')

  // Upload form
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    type: 'PDF',
    subject: '',
    semester: 1,
    unit: '',
    file: null as File | null
  })

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Computer Science',
    'Electronics', 'Mechanical', 'Civil', 'Electrical',
    'Information Science', 'Biotechnology', 'AI & ML', 'Data Science'
  ]

  const fetchResources = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(subjectFilter !== 'ALL' && { subject: subjectFilter }),
        ...(typeFilter !== 'ALL' && { type: typeFilter }),
        ...(semesterFilter !== 'ALL' && { semester: semesterFilter.toString() })
      })

      const response = await fetch(`/api/admin/resources?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setResources(data.resources || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch resources",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching resources:', error)
      toast({
        title: "Error",
        description: "Failed to fetch resources",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async () => {
    if (!uploadForm.title || !uploadForm.subject || !uploadForm.file) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      })
      return
    }

    setActionLoading('upload')
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('title', uploadForm.title)
      formData.append('description', uploadForm.description)
      formData.append('type', uploadForm.type)
      formData.append('subject', uploadForm.subject)
      formData.append('semester', uploadForm.semester.toString())
      formData.append('unit', uploadForm.unit)
      formData.append('file', uploadForm.file)

      const response = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Resource uploaded successfully",
        })
        
        // Reset form and refresh
        setUploadForm({
          title: '',
          description: '',
          type: 'PDF',
          subject: '',
          semester: 1,
          unit: '',
          file: null
        })
        setUploadDialogOpen(false)
        fetchResources()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to upload resource",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error uploading resource:', error)
      toast({
        title: "Error",
        description: "Failed to upload resource",
        variant: "destructive"
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleDownloadResource = async (resource: Resource) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/uploads?id=${resource.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = resource.fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        fetchResources() // Refresh to update download count
      } else {
        toast({
          title: "Error",
          description: "Failed to download resource",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error downloading resource:', error)
      toast({
        title: "Error",
        description: "Failed to download resource",
        variant: "destructive"
      })
    }
  }

  const handlePreviewResource = async (resource: Resource) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/uploads?id=${resource.id}&preview=true`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        window.open(url, '_blank')
        setTimeout(() => window.URL.revokeObjectURL(url), 1000)
      } else {
        toast({
          title: "Error",
          description: "Failed to preview resource",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error previewing resource:', error)
      toast({
        title: "Error",
        description: "Failed to preview resource",
        variant: "destructive"
      })
    }
  }

  const handleDeleteResource = async (resourceId: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) {
      return
    }

    setActionLoading(resourceId)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/resources?id=${resourceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Resource deleted successfully",
        })
        
        fetchResources()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to delete resource",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting resource:', error)
      toast({
        title: "Error",
        description: "Failed to delete resource",
        variant: "destructive"
      })
    } finally {
      setActionLoading(null)
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="w-4 h-4 text-red-400" />
      case 'VIDEO': return <Video className="w-4 h-4 text-blue-400" />
      case 'IMAGE': return <Image className="w-4 h-4 text-green-400" /> // eslint-disable-line jsx-a11y/alt-text
      default: return <Archive className="w-4 h-4 text-gray-400" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  useEffect(() => {
    if (user) {
      fetchResources()
    }
  }, [user])

  useEffect(() => {
    fetchResources()
  }, [searchTerm, subjectFilter, typeFilter, semesterFilter])

  return (
    <DashboardLayout userRole="ADMIN">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#4A3F33] mb-2">Resource Management</h1>
            <p className="text-[#9B8B7E]">Manage study materials and resources</p>
          </div>
          <div className="flex space-x-2">
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#6B5844] hover:bg-[#4A3F33] text-white">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Resource
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-[#E8DFD3] max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-[#4A3F33]">Upload New Resource</DialogTitle>
                  <DialogDescription className="text-[#9B8B7E]">
                    Add study materials for students
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#4A3F33] text-sm font-medium mb-2 block">Title *</label>
                      <Input
                        placeholder="Enter resource title"
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                        className="bg-white border-[#E8DFD3] text-[#4A3F33] placeholder-[#D4C4B0]"
                      />
                    </div>
                    <div>
                      <label className="text-[#4A3F33] text-sm font-medium mb-2 block">Subject *</label>
                      <Select value={uploadForm.subject} onValueChange={(value) => setUploadForm(prev => ({ ...prev, subject: value }))}>
                        <SelectTrigger className="bg-white border-[#E8DFD3] text-[#4A3F33]">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map(subject => (
                            <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#4A3F33] text-sm font-medium mb-2 block">Semester</label>
                      <Select value={uploadForm.semester.toString()} onValueChange={(value) => setUploadForm(prev => ({ ...prev, semester: parseInt(value) }))}>
                        <SelectTrigger className="bg-white border-[#E8DFD3] text-[#4A3F33]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1,2,3,4,5,6,7,8].map(sem => (
                            <SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-[#4A3F33] text-sm font-medium mb-2 block">Unit</label>
                      <Input
                        placeholder="e.g., Unit 1"
                        value={uploadForm.unit}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, unit: e.target.value }))}
                        className="bg-white border-[#E8DFD3] text-[#4A3F33] placeholder-[#D4C4B0]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#4A3F33] text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      placeholder="Enter resource description"
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-white border-[#E8DFD3] text-[#4A3F33] placeholder-[#D4C4B0] min-h-[80px]"
                    />
                  </div>

                  <div>
                    <label className="text-[#4A3F33] text-sm font-medium mb-2 block">File *</label>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi,.mov,.jpg,.jpeg,.png,.zip"
                      onChange={(e) => setUploadForm(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                      className="bg-white border-[#E8DFD3] text-[#4A3F33] file:text-[#6B5844]"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setUploadDialogOpen(false)}
                      className="bg-white border-[#E8DFD3] text-[#4A3F33] hover:bg-[#F5F0EA]"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleFileUpload}
                      disabled={actionLoading === 'upload'}
                      className="bg-[#6B5844] hover:bg-[#4A3F33] text-white"
                    >
                      {actionLoading === 'upload' ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 mr-2" />
                      )}
                      Upload Resource
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button
              onClick={() => fetchResources()}
              variant="outline"
              className="bg-white border-[#E8DFD3] text-[#4A3F33] hover:bg-[#F5F0EA]"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-[#E8DFD3]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#9B8B7E]">Total Resources</CardTitle>
              <BookOpen className="h-4 w-4 text-[#6B5844]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#4A3F33]">{resources.length}</div>
              <p className="text-xs text-[#6B5844]">Study materials</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E8DFD3]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#9B8B7E]">PDFs</CardTitle>
              <FileText className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#4A3F33]">
                {resources.filter(r => r.type === 'PDF').length}
              </div>
              <p className="text-xs text-[#6B5844]">Documents</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E8DFD3]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#9B8B7E]">Videos</CardTitle>
              <Video className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#4A3F33]">
                {resources.filter(r => r.type === 'VIDEO').length}
              </div>
              <p className="text-xs text-[#6B5844]">Video content</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E8DFD3]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#9B8B7E]">Total Downloads</CardTitle>
              <Download className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#4A3F33]">
                {resources.reduce((sum, r) => sum + r.downloadCount, 0)}
              </div>
              <p className="text-xs text-[#6B5844]">Resource downloads</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white border-[#E8DFD3] mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B5844] w-4 h-4" />
                  <Input
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-[#E8DFD3] text-[#4A3F33] placeholder-[#D4C4B0]"
                  />
                </div>
              </div>
              <div className="w-full md:w-40">
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="bg-white border-[#E8DFD3] text-[#4A3F33]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Subjects</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-32">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="bg-white border-[#E8DFD3] text-[#4A3F33]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="PDF">PDFs</SelectItem>
                    <SelectItem value="VIDEO">Videos</SelectItem>
                    <SelectItem value="IMAGE">Images</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-32">
                <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                  <SelectTrigger className="bg-white border-[#E8DFD3] text-[#4A3F33]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Semesters</SelectItem>
                    {[1,2,3,4,5,6,7,8].map(sem => (
                      <SelectItem key={sem} value={sem.toString()}>Sem {sem}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources Table */}
        <Card className="bg-white border-[#E8DFD3]">
          <CardHeader>
            <CardTitle className="text-[#4A3F33]">All Resources</CardTitle>
            <CardDescription className="text-[#9B8B7E]">
              Manage and organize study materials
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 text-[#6B5844] animate-spin" />
              </div>
            ) : resources.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-[#6B5844] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#4A3F33] mb-2">No resources found</h3>
                <p className="text-[#9B8B7E] mb-6">
                  {searchTerm || subjectFilter !== 'ALL' || typeFilter !== 'ALL' || semesterFilter !== 'ALL'
                    ? 'Try adjusting your filters' 
                    : 'Upload your first resource to get started'
                  }
                </p>
                <Button
                  onClick={() => setUploadDialogOpen(true)}
                  className="bg-[#6B5844] hover:bg-[#4A3F33] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Resource
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#E8DFD3]">
                      <TableHead className="text-[#9B8B7E]">Resource</TableHead>
                      <TableHead className="text-[#9B8B7E]">Subject</TableHead>
                      <TableHead className="text-[#9B8B7E]">Semester</TableHead>
                      <TableHead className="text-[#9B8B7E]">Type</TableHead>
                      <TableHead className="text-[#9B8B7E]">Size</TableHead>
                      <TableHead className="text-[#9B8B7E]">Downloads</TableHead>
                      <TableHead className="text-[#9B8B7E]">Uploaded</TableHead>
                      <TableHead className="text-[#9B8B7E]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resources.map((resource) => (
                      <TableRow key={resource.id} className="border-[#E8DFD3]">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {getFileIcon(resource.type)}
                            <div>
                              <p className="text-[#4A3F33] font-medium">{resource.title}</p>
                              <p className="text-[#6B5844] text-sm">{resource.fileName}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-[#9B8B7E]">{resource.subject}</TableCell>
                        <TableCell className="text-[#9B8B7E]">Semester {resource.semester}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-cyan-500/20 text-[#9B8B7E]">
                            {resource.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[#9B8B7E]">{formatFileSize(resource.fileSize)}</TableCell>
                        <TableCell className="text-[#9B8B7E]">{resource.downloadCount}</TableCell>
                        <TableCell className="text-[#9B8B7E]">
                          {new Date(resource.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-cyan-400 text-[#9B8B7E]"
                              onClick={() => handlePreviewResource(resource)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-cyan-400 text-[#9B8B7E]"
                              onClick={() => handleDownloadResource(resource)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteResource(resource.id)}
                              disabled={actionLoading === resource.id}
                            >
                              {actionLoading === resource.id ? (
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

