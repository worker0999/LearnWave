'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, UploadCloud, FileText, Download, Trash2, BookOpen, GraduationCap, CheckCircle2, Clock } from 'lucide-react'
import { getSubjectsForSemester } from '@/lib/vtu-scheme-2025'

export function MentorResources() {
  const { toast } = useToast()
  const { token } = useAuth()
  const [resources, setResources] = useState<any[]>([])
  const [loadingList, setLoadingList] = useState(false)
  const [activeTab, setActiveTab] = useState('upload')

  // Form State
  const [isLibrary, setIsLibrary] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [scheme, setScheme] = useState('2025')
  const [branch, setBranch] = useState('CSE')
  const [semester, setSemester] = useState('3')
  const [subject, setSubject] = useState('')
  const [targetSection, setTargetSection] = useState('1')
  const [isCustomSubject, setIsCustomSubject] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const fetchResources = async () => {
    setLoadingList(true)
    try {
      const response = await fetch('/api/mentor/resources', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setResources(data.resources || [])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingList(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchResources()
    }
  }, [activeTab])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !title) {
      toast({
        title: 'Missing information',
        description: 'Please provide a title and select a file before uploading.',
        variant: 'destructive'
      })
      return
    }

    if (!isLibrary && !subject) {
      toast({
        title: 'Missing Subject',
        description: 'Please provide the subject category for syllabus notes.',
        variant: 'destructive'
      })
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('is_library', String(isLibrary))
    formData.append('file', selectedFile)
    
    // Scheme-specific mappings
    if (!isLibrary) {
      const isModelPaper = targetSection === 'papers'
      const isSyllabus = targetSection === 'syllabus'
      
      let moduleNumber = ''
      let type = 'NOTES'
      if (isModelPaper) {
        type = 'QUESTION_PAPER'
      } else if (isSyllabus) {
        type = 'SYLLABUS'
      } else {
        moduleNumber = targetSection
      }

      formData.append('semester', semester)
      formData.append('subject', subject)
      formData.append('scheme', scheme)
      formData.append('branch', branch)
      formData.append('module_number', moduleNumber)
      formData.append('is_model_paper', String(isModelPaper))
      formData.append('type', type)
    } else {
      formData.append('semester', '0')
      formData.append('subject', 'Library Book')
      formData.append('type', selectedFile.name.split('.').pop()?.toUpperCase() || 'UNKNOWN')
    }

    try {
      const response = await fetch('/api/mentor/resources', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })

      if (response.ok) {
        toast({
          title: 'Upload Successful',
          description: `Resource "${title}" has been uploaded and is pending admin approval.`
        })
        // Reset Form
        setTitle('')
        setDescription('')
        setSubject('')
        setScheme('2025')
        setBranch('CSE')
        setSemester('3')
        setTargetSection('1')
        setIsCustomSubject(false)
        setSelectedFile(null)
        const fileInput = document.getElementById('file-upload') as HTMLInputElement
        if (fileInput) fileInput.value = ''
        setActiveTab('manage')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }
    } catch (error: any) {
      toast({
        title: 'Upload Error',
        description: error.message || 'Failed to upload resource.',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return

    try {
      const response = await fetch(`/api/mentor/resources?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Resource deleted successfully.'
        })
        fetchResources()
      } else {
        throw new Error('Deletion failed')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete resource.',
        variant: 'destructive'
      })
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
    <div className="space-y-8 max-w-7xl mx-auto px-4 md:px-8 py-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-[#1E1B4B] tracking-tight">Resources Management</h1>
        <p className="text-[#8E93B0] font-medium mt-1">Upload curriculum notes or general virtual library books for admin approval.</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-[#E2E8F0] border border-[#CBD5E1] rounded-xl p-1 mb-6">
          <TabsTrigger
            value="upload"
            className="rounded-lg data-[state=active]:bg-[#5C59E8] data-[state=active]:text-white text-[#64748B] font-bold transition-all px-6 py-2"
          >
            Upload Material
          </TabsTrigger>
          <TabsTrigger
            value="manage"
            className="rounded-lg data-[state=active]:bg-[#5C59E8] data-[state=active]:text-white text-[#64748B] font-bold transition-all px-6 py-2"
          >
            Manage Uploads
          </TabsTrigger>
        </TabsList>

        {/* Upload Form Tab */}
        <TabsContent value="upload">
          <Card className="bg-white border-[#DDE3EA] shadow-sm rounded-2xl overflow-hidden border">
            <CardHeader className="bg-slate-50 border-b border-[#F4F6F8] p-6">
              <CardTitle className="text-[#1E1B4B] text-lg font-black">Upload New Material</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {/* Type Switcher */}
              <div className="space-y-2">
                <Label className="text-[#8E93B0] font-bold text-xs uppercase tracking-wider">Resource Category</Label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsLibrary(false)}
                    className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border text-sm font-bold transition-all ${
                      !isLibrary
                        ? 'border-[#5C59E8] bg-[#5C59E8]/5 text-[#5C59E8]'
                        : 'border-[#DDE3EA] hover:bg-slate-50 text-[#64748B]'
                    }`}
                  >
                    <GraduationCap size={20} />
                    <span>Curriculum Syllabus Notes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLibrary(true)}
                    className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border text-sm font-bold transition-all ${
                      isLibrary
                        ? 'border-[#5C59E8] bg-[#5C59E8]/5 text-[#5C59E8]'
                        : 'border-[#DDE3EA] hover:bg-slate-50 text-[#64748B]'
                    }`}
                  >
                    <BookOpen size={20} />
                    <span>Virtual Library Book</span>
                  </button>
                </div>
              </div>

              {/* Title & category specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-[#64748B] font-bold text-sm">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Advanced Operating Systems Guide"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-[#F8FAFC] border-[#CBD5E1] rounded-xl h-11 text-[#1E1B4B] focus:border-[#5C59E8] transition-colors"
                  />
                </div>

                {!isLibrary ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[#64748B] font-bold text-sm">VTU Scheme</Label>
                      <Select value={scheme} onValueChange={setScheme}>
                        <SelectTrigger className="bg-[#F8FAFC] border-[#CBD5E1] rounded-xl h-11 text-[#1E1B4B]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2025">2025 NEP Scheme</SelectItem>
                          <SelectItem value="2022">2022 Scheme</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[#64748B] font-bold text-sm">Branch</Label>
                      <Select value={branch} onValueChange={setBranch}>
                        <SelectTrigger className="bg-[#F8FAFC] border-[#CBD5E1] rounded-xl h-11 text-[#1E1B4B]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['CSE', 'ECE', 'ISE', 'ME', 'CE', 'AIML'].map((b) => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 opacity-50">
                    <Label className="text-[#64748B] font-bold text-sm">Subject Name</Label>
                    <Input disabled value="Library Book" className="bg-slate-100 border-[#CBD5E1] rounded-xl h-11" />
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-[#64748B] font-bold text-sm">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Summarize what this resource covers..."
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-[#F8FAFC] border-[#CBD5E1] rounded-xl p-3 text-[#1E1B4B] focus:border-[#5C59E8] transition-colors resize-none"
                />
              </div>

              {/* Semester, Subject, and Target Module */}
              {!isLibrary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <Label className="text-[#64748B] font-bold text-sm">Semester</Label>
                    <Select value={semester} onValueChange={(val) => { setSemester(val); setSubject(''); setIsCustomSubject(false); }}>
                      <SelectTrigger className="bg-[#F8FAFC] border-[#CBD5E1] rounded-xl h-11 text-[#1E1B4B]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 8 }).map((_, i) => (
                          <SelectItem key={i} value={String(i + 1)}>Semester {i + 1}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#64748B] font-bold text-sm">Subject</Label>
                    <Select
                      value={isCustomSubject ? 'custom' : subject}
                      onValueChange={(val) => {
                        if (val === 'custom') {
                          setIsCustomSubject(true)
                          setSubject('')
                        } else {
                          setIsCustomSubject(false)
                          setSubject(val)
                        }
                      }}
                    >
                      <SelectTrigger className="bg-[#F8FAFC] border-[#CBD5E1] rounded-xl h-11 text-[#1E1B4B]">
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {getSubjectsForSemester(parseInt(semester)).map((sub, i) => (
                          <SelectItem key={i} value={sub}>{sub}</SelectItem>
                        ))}
                        <SelectItem value="custom">Other (Enter custom subject)</SelectItem>
                      </SelectContent>
                    </Select>

                    {isCustomSubject && (
                      <Input
                        placeholder="Enter custom subject name"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="bg-[#F8FAFC] border-[#CBD5E1] rounded-xl h-11 text-[#1E1B4B] focus:border-[#5C59E8] transition-colors mt-2"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#64748B] font-bold text-sm">Target Section</Label>
                    <Select value={targetSection} onValueChange={setTargetSection}>
                      <SelectTrigger className="bg-[#F8FAFC] border-[#CBD5E1] rounded-xl h-11 text-[#1E1B4B]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
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
              )}

              {/* File Dropzone */}
              <div className="space-y-2">
                <Label className="text-[#64748B] font-bold text-sm">Upload Document File</Label>
                <div className="border-2 border-dashed border-[#CBD5E1] rounded-2xl p-8 text-center bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-all relative group cursor-pointer">
                  <input
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.doc,.pptx,.ppt"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-12 h-12 text-[#94A3B8] group-hover:text-[#5C59E8] mx-auto mb-3 transition-colors" />
                  <p className="text-sm font-bold text-[#1E1B4B]">
                    {selectedFile ? selectedFile.name : 'Click to select files or drag and drop'}
                  </p>
                  <p className="text-xs text-[#94A3B8] mt-1">PDF, DOCX, or PPTX files up to 50MB</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#F1F5F9]">
                <Button
                  onClick={handleUpload}
                  disabled={uploading || !selectedFile || !title}
                  className="bg-[#5C59E8] hover:bg-[#4E4BC6] text-white font-bold h-11 px-8 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                    </>
                  ) : (
                    'Submit for Admin Approval'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manage Uploads Tab */}
        <TabsContent value="manage">
          <Card className="bg-white border-[#DDE3EA] shadow-sm rounded-2xl overflow-hidden border">
            <CardHeader className="bg-slate-50 border-b border-[#F4F6F8] p-6">
              <CardTitle className="text-[#1E1B4B] text-lg font-black">Your Upload History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loadingList ? (
                <div className="flex flex-col items-center justify-center py-20 text-[#64748B]">
                  <Loader2 className="h-10 w-10 animate-spin text-[#5C59E8] mb-3" />
                  <p className="font-bold">Syncing your resources index...</p>
                </div>
              ) : resources.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-[#64748B]">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                    <FileText className="h-6 w-6 text-[#94A3B8]" />
                  </div>
                  <p className="font-bold text-base">No uploads found</p>
                  <p className="text-xs text-[#94A3B8] mt-1">Submit your learning files or textbooks in the Upload tab.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-[#CBD5E1] text-left">
                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-[#64748B]">Resource File</th>
                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-[#64748B]">Category</th>
                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-[#64748B]">Details</th>
                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-[#64748B] text-center">Status</th>
                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-[#64748B] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resources.map((res) => (
                        <tr key={res.id} className="border-b border-[#F1F5F9] last:border-0 hover:bg-slate-50/50 transition-colors group">
                          <td className="py-5 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-[#5C59E8]/10 text-[#5C59E8] flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <span className="font-bold text-[#1E1B4B] block text-sm">{res.title}</span>
                                <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">{res.type} &bull; {formatSize(res.fileSize)}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 px-6">
                            {res.is_library ? (
                              <Badge className="bg-[#5C59E8]/10 text-[#5C59E8] border-none font-bold text-[9px] uppercase px-2.5">
                                Virtual Library
                              </Badge>
                            ) : (
                              <Badge className="bg-emerald-100 text-emerald-800 border-none font-bold text-[9px] uppercase px-2.5">
                                Syllabus notes
                              </Badge>
                            )}
                          </td>
                          <td className="py-5 px-6">
                            {res.is_library ? (
                              <span className="text-xs text-[#94A3B8] font-bold uppercase">Library E-Book</span>
                            ) : (
                              <div className="text-xs text-[#1E1B4B]">
                                <span className="font-semibold">{res.subject}</span>
                                <span className="text-[#94A3B8] block text-[10px]">Sem {res.semester} {res.unit ? `&bull; ${res.unit}` : ''}</span>
                              </div>
                            )}
                          </td>
                          <td className="py-5 px-6 text-center">
                            {res.is_approved ? (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-bold text-[9px] flex items-center gap-1 w-max mx-auto px-2 py-0.5 rounded-lg">
                                <CheckCircle2 size={10} /> Approved
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none font-bold text-[9px] flex items-center gap-1 w-max mx-auto px-2 py-0.5 rounded-lg">
                                <Clock size={10} /> Pending Review
                              </Badge>
                            )}
                          </td>
                          <td className="py-5 px-6 text-right">
                            <div className="flex justify-end gap-2">
                              <a
                                href={getCorrectFileUrl(res.fileUrl)}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 text-[#94A3B8] hover:text-[#5C59E8] hover:bg-[#5C59E8]/5 rounded-xl transition-colors"
                                title="Download File"
                              >
                                <Download size={15} />
                              </a>
                              <button
                                onClick={() => handleDelete(res.id)}
                                className="p-2 text-[#94A3B8] hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                title="Delete Resource"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
