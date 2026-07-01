import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Search, Plus, FileText, Download, Trash2, RefreshCw, UploadCloud, FileType, Filter, Check, GraduationCap, BookOpen } from 'lucide-react'
import { getSubjectsForSemester } from '@/lib/vtu-scheme-2025'

export function ResourcesView() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('ALL')

  // Form State
  const [isLibrary, setIsLibrary] = useState(false)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadScheme, setUploadScheme] = useState('2025')
  const [uploadBranch, setUploadBranch] = useState('CSE')
  const [uploadSemester, setUploadSemester] = useState('3')
  const [uploadSubject, setUploadSubject] = useState('')
  const [uploadTargetSection, setUploadTargetSection] = useState('1')
  const [isCustomSubject, setIsCustomSubject] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const fetchResources = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const url = new URL('/api/admin/resources', window.location.origin)
      if (searchTerm) url.searchParams.append('search', searchTerm)
      if (categoryFilter !== 'ALL') url.searchParams.append('subject', categoryFilter)
      
      const res = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setResources(data.resources || [])
      }
    } catch (error) {
      console.error(error)
      toast({ title: 'Error', description: 'Failed to fetch resources', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResources()
  }, [searchTerm, categoryFilter])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/admin/resources?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        toast({ title: 'Success', description: 'Resource deleted' })
        fetchResources()
      } else {
        toast({ title: 'Error', description: 'Failed to delete resource', variant: 'destructive' })
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete resource', variant: 'destructive' })
    }
  }

  const handleUpload = async () => {
    if (!uploadTitle || !uploadFile) {
      toast({ title: 'Error', description: 'Title and File are required', variant: 'destructive' })
      return
    }

    if (!isLibrary && !uploadSubject) {
      toast({ title: 'Error', description: 'Subject is required for syllabus notes', variant: 'destructive' })
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('title', uploadTitle)
    formData.append('description', '')
    formData.append('is_library', String(isLibrary))
    formData.append('file', uploadFile)

    if (!isLibrary) {
      const isModelPaper = uploadTargetSection === 'papers'
      const isSyllabus = uploadTargetSection === 'syllabus'
      
      let moduleNumber = ''
      let type = 'NOTES'
      if (isModelPaper) {
        type = 'QUESTION_PAPER'
      } else if (isSyllabus) {
        type = 'SYLLABUS'
      } else {
        moduleNumber = uploadTargetSection
      }

      formData.append('semester', uploadSemester)
      formData.append('subject', uploadSubject)
      formData.append('scheme', uploadScheme)
      formData.append('branch', uploadBranch)
      formData.append('module_number', moduleNumber)
      formData.append('is_model_paper', String(isModelPaper))
      formData.append('type', type)
    } else {
      formData.append('semester', '0')
      formData.append('subject', 'Library Book')
      formData.append('type', uploadFile.name.split('.').pop()?.toUpperCase() || 'UNKNOWN')
    }

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      if (res.ok) {
        toast({ title: 'Success', description: 'Resource uploaded successfully' })
        setUploadDialogOpen(false)
        setUploadTitle('')
        setUploadSubject('')
        setUploadScheme('2025')
        setUploadBranch('CSE')
        setUploadSemester('3')
        setUploadTargetSection('1')
        setIsCustomSubject(false)
        setUploadFile(null)
        fetchResources()
      } else {
        toast({ title: 'Error', description: 'Failed to upload resource', variant: 'destructive' })
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to upload resource', variant: 'destructive' })
    } finally {
      setUploading(false)
    }
  }

  const handleApprove = async (resourceId: string) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/admin/resources', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ resourceId, approved: true })
      })

      if (res.ok) {
        toast({ title: 'Success', description: 'Resource approved successfully' })
        fetchResources()
      } else {
        toast({ title: 'Error', description: 'Failed to approve resource', variant: 'destructive' })
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to approve resource', variant: 'destructive' })
    }
  }

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getCorrectFileUrl = (url: string) => {
    if (!url) return ''
    if (url.startsWith('/uploads/')) {
      return `/api${url}`
    }
    return url
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#42413b] dark:text-[#f4f4f0] tracking-tight">Resource Library</h1>
          <p className="text-[#a9a29e] mt-1 text-lg">Manage global learning materials and files</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={fetchResources} 
            variant="outline" 
            className="border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0] bg-transparent hover:bg-[#f4f4f0] dark:hover:bg-[#1c1b19]"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button 
            onClick={() => setUploadDialogOpen(true)}
            className="bg-[#42413b] hover:bg-[#2a2826] text-[#f4f4f0] dark:bg-[#f4f4f0] dark:text-[#42413b] dark:hover:bg-[#dfd3c3] shadow-sm transform hover:-translate-y-0.5 transition-all active:translate-y-0"
          >
            <Plus className="w-4 h-4 mr-2" /> Upload Resource
          </Button>
        </div>
      </div>

      <Card className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-[#dfd3c3] dark:border-[#42413b] bg-gray-50/50 dark:bg-black/10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a9a29e] w-4 h-4" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#ffffff] dark:bg-[#1c1b19] border-[#dfd3c3] dark:border-[#42413b] focus-visible:ring-[#c8ced8] text-[#42413b] dark:text-[#f4f4f0] h-10 rounded-xl"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 bg-[#ffffff] dark:bg-[#1c1b19] border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0] h-10 rounded-xl">
                <Filter className="w-4 h-4 mr-2 text-[#a9a29e]" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b]">
                <SelectItem value="ALL">All Categories</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Web Development">Web Development</SelectItem>
                <SelectItem value="AI & ML">AI & ML</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-[#dfd3c3] dark:border-[#42413b] hover:bg-transparent">
                <TableHead className="text-[#a9a29e] font-medium h-12 px-6">File Name</TableHead>
                <TableHead className="text-[#a9a29e] font-medium h-12">Category</TableHead>
                <TableHead className="text-[#a9a29e] font-medium h-12">Type & Size</TableHead>
                <TableHead className="text-[#a9a29e] font-medium h-12">Uploaded</TableHead>
                <TableHead className="text-[#a9a29e] font-medium h-12 text-center">Status</TableHead>
                <TableHead className="text-right text-[#a9a29e] font-medium h-12 px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((res) => (
                <TableRow key={res.id} className="border-[#dfd3c3] dark:border-[#42413b] hover:bg-[#f4f4f0]/50 dark:hover:bg-[#1c1b19]/50 transition-colors group">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#c8ced8]/30 dark:bg-[#42413b] flex items-center justify-center flex-shrink-0 text-[#42413b] dark:text-[#f4f4f0]">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#42413b] dark:text-[#f4f4f0]">{res.title}</div>
                        {res.is_library && (
                          <span className="text-[10px] bg-[#5C59E8]/10 text-[#5C59E8] dark:bg-[#5C59E8]/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Library Section</span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#a9a29e]">{res.subject}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium bg-[#f4f4f0] dark:bg-[#1c1b19] border border-[#dfd3c3] dark:border-[#42413b] px-2 py-1 rounded text-[#42413b] dark:text-[#f4f4f0]">
                        {res.type}
                      </span>
                      <span className="text-sm text-[#a9a29e]">{formatSize(res.fileSize)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#a9a29e] text-sm">{new Date(res.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-center">
                    {res.is_approved ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400">Approved</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400">Pending Review</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!res.is_approved && (
                        <Button onClick={() => handleApprove(res.id)} size="icon" variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/30 h-8 w-8 rounded-full transition-colors" title="Approve Upload">
                          <Check size={16} />
                        </Button>
                      )}
                      <a href={getCorrectFileUrl(res.fileUrl)} target="_blank" rel="noreferrer" className="p-2 text-[#a9a29e] hover:text-[#42413b] dark:hover:text-[#f4f4f0] hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors" title="Download File">
                        <Download size={16} />
                      </a>
                      <Button onClick={() => handleDelete(res.id)} size="icon" variant="ghost" className="text-[#a9a29e] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 h-8 w-8 rounded-full transition-colors" title="Delete File">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {resources.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-[#a9a29e]">
                    No resources found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] rounded-2xl sm:max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#42413b] dark:text-[#f4f4f0]">Upload Resource</DialogTitle>
            <DialogDescription className="text-[#a9a29e]">Upload a new document to the global library.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <div>
              <label className="text-xs font-semibold text-[#a9a29e] uppercase tracking-wider mb-1 block">Title</label>
              <Input 
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="e.g., Computer Networks Notes" 
                className="bg-[#f4f4f0] dark:bg-[#1c1b19] border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0]" 
              />
            </div>
            {/* Category Toggle */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#a9a29e] uppercase tracking-wider mb-1 block">Resource Category</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsLibrary(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border text-xs font-bold transition-all ${
                    !isLibrary
                      ? 'border-[#5C59E8] bg-[#5C59E8]/5 text-[#5C59E8]'
                      : 'border-[#dfd3c3] dark:border-[#42413b] text-[#a9a29e]'
                  }`}
                >
                  <GraduationCap size={16} />
                  <span>Syllabus Notes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsLibrary(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border text-xs font-bold transition-all ${
                    isLibrary
                      ? 'border-[#5C59E8] bg-[#5C59E8]/5 text-[#5C59E8]'
                      : 'border-[#dfd3c3] dark:border-[#42413b] text-[#a9a29e]'
                  }`}
                >
                  <BookOpen size={16} />
                  <span>Virtual Library Book</span>
                </button>
              </div>
            </div>

            {!isLibrary && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#a9a29e] uppercase tracking-wider mb-1 block">VTU Scheme</label>
                    <Select value={uploadScheme} onValueChange={setUploadScheme}>
                      <SelectTrigger className="bg-[#f4f4f0] dark:bg-[#1c1b19] border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b]">
                        <SelectItem value="2025">2025 NEP</SelectItem>
                        <SelectItem value="2022">2022 Scheme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#a9a29e] uppercase tracking-wider mb-1 block">Branch</label>
                    <Select value={uploadBranch} onValueChange={setUploadBranch}>
                      <SelectTrigger className="bg-[#f4f4f0] dark:bg-[#1c1b19] border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b]">
                        {['CSE', 'ECE', 'ISE', 'ME', 'CE', 'AIML'].map((b) => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#a9a29e] uppercase tracking-wider mb-1 block">Semester</label>
                    <Select value={uploadSemester} onValueChange={(val) => { setUploadSemester(val); setUploadSubject(''); setIsCustomSubject(false); }}>
                      <SelectTrigger className="bg-[#f4f4f0] dark:bg-[#1c1b19] border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b]">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <SelectItem key={i} value={String(i + 1)}>Semester {i + 1}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#a9a29e] uppercase tracking-wider mb-1 block">Target Section</label>
                    <Select value={uploadTargetSection} onValueChange={setUploadTargetSection}>
                      <SelectTrigger className="bg-[#f4f4f0] dark:bg-[#1c1b19] border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b]">
                        <SelectItem value="1">Module 1 Notes</SelectItem>
                        <SelectItem value="2">Module 2 Notes</SelectItem>
                        <SelectItem value="3">Module 3 Notes</SelectItem>
                        <SelectItem value="4">Module 4 Notes</SelectItem>
                        <SelectItem value="5">Module 5 Notes</SelectItem>
                        <SelectItem value="papers">Question Papers</SelectItem>
                        <SelectItem value="syllabus">Syllabus Copy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#a9a29e] uppercase tracking-wider mb-1 block">Subject</label>
                  <Select
                    value={isCustomSubject ? 'custom' : uploadSubject}
                    onValueChange={(val) => {
                      if (val === 'custom') {
                        setIsCustomSubject(true)
                        setUploadSubject('')
                      } else {
                        setIsCustomSubject(false)
                        setUploadSubject(val)
                      }
                    }}
                  >
                    <SelectTrigger className="bg-[#f4f4f0] dark:bg-[#1c1b19] border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0]">
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b]">
                      {getSubjectsForSemester(parseInt(uploadSemester)).map((sub, i) => (
                        <SelectItem key={i} value={sub}>{sub}</SelectItem>
                      ))}
                      <SelectItem value="custom">Other (Enter custom subject)</SelectItem>
                    </SelectContent>
                  </Select>

                  {isCustomSubject && (
                    <Input
                      placeholder="Enter custom subject name"
                      value={uploadSubject}
                      onChange={(e) => setUploadSubject(e.target.value)}
                      className="bg-[#f4f4f0] dark:bg-[#1c1b19] border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0] mt-2"
                    />
                  )}
                </div>
              </>
            )}
            <div className="border-2 border-dashed border-[#dfd3c3] dark:border-[#42413b] rounded-xl p-8 text-center bg-[#f4f4f0]/50 dark:bg-[#1c1b19]/50 hover:bg-[#f4f4f0] dark:hover:bg-[#1c1b19] transition-colors relative group">
              <input 
                type="file" 
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
              <UploadCloud className="w-10 h-10 text-[#a9a29e] group-hover:text-[#42413b] dark:group-hover:text-[#f4f4f0] mx-auto mb-3 transition-colors" />
              <p className="text-sm font-medium text-[#42413b] dark:text-[#f4f4f0]">
                {uploadFile ? uploadFile.name : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-[#a9a29e] mt-1">PDF, DOCX, PPTX up to 50MB</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)} className="border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0] hover:bg-[#f4f4f0] dark:hover:bg-[#1c1b19]">Cancel</Button>
            <Button 
              onClick={handleUpload}
              disabled={uploading || !uploadFile || !uploadTitle}
              className="bg-[#42413b] hover:bg-[#2a2826] text-[#f4f4f0] dark:bg-[#f4f4f0] dark:text-[#42413b] dark:hover:bg-[#dfd3c3]"
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
