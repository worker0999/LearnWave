'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { PDFPreview } from '@/components/ui/pdf-preview'
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates'
import { useRealtimeResources } from '@/hooks/useRealtimeResources'
import { 
  BookOpen, 
  Download, 
  Search, 
  Filter,
  FileText,
  Video,
  Link,
  Star,
  Eye,
  Calendar,
  User,
  Tag,
  FolderOpen,
  Grid,
  List,
  ArrowUpDown,
  Brain,
  Clock,
  TrendingUp,
  RefreshCw,
  Zap
} from 'lucide-react'

interface Resource {
  id: string
  title: string
  description: string
  type: 'pdf' | 'video' | 'link' | 'notes'
  subject: string
  semester: number
  unit?: string
  author: string
  uploadDate: string
  downloads: number
  rating: number
  size?: string
  duration?: string
  url?: string
  fileUrl?: string
  tags: string[]
  featured?: boolean
  fileName?: string
}

interface Subject {
  id: string
  name: string
  code: string
  semester: number
  units: string[]
  resourceCount: number
}

const semesters = [1, 2, 3, 4, 5, 6, 7, 8]

// Utility function to format dates safely (avoiding locale-based formatting)
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    // Return ISO format date (YYYY-MM-DD) to avoid locale mismatches
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${day}/${month}/${year}`
  } catch {
    return 'N/A'
  }
}

// Custom hook to track client-side rendering
function useIsClient() {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  return isClient
}

const mockSubjects: Subject[] = [
  { id: '1', name: 'Data Structures', code: 'CS52', semester: 5, units: ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'], resourceCount: 45 },
  { id: '2', name: 'Algorithm Analysis', code: 'CS53', semester: 5, units: ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'], resourceCount: 38 },
  { id: '3', name: 'Database Management', code: 'CS54', semester: 5, units: ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'], resourceCount: 52 },
  { id: '4', name: 'Web Technology', code: 'CS55', semester: 5, units: ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'], resourceCount: 41 }
]

const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Binary Search Trees - Complete Notes',
    description: 'Comprehensive notes covering all aspects of Binary Search Trees including operations, complexity analysis, and implementations.',
    type: 'pdf',
    subject: 'Data Structures',
    semester: 5,
    unit: 'Unit 3',
    author: 'Prof. Smith',
    uploadDate: '2024-01-15',
    downloads: 234,
    rating: 4.8,
    size: '2.5 MB',
    fileName: 'Binary_Search_Trees_Notes.pdf',
    tags: ['trees', 'algorithms', 'important'],
    featured: true
  },
  {
    id: '2',
    title: 'QuickSort Algorithm Video Tutorial',
    description: 'Step-by-step video explanation of QuickSort algorithm with visualizations and code examples.',
    type: 'video',
    subject: 'Data Structures',
    semester: 5,
    unit: 'Unit 2',
    author: 'Dr. Johnson',
    uploadDate: '2024-01-12',
    downloads: 189,
    rating: 4.6,
    duration: '15:30',
    fileName: 'QuickSort_Tutorial.mp4',
    tags: ['sorting', 'algorithms', 'video'],
    featured: true
  },
  {
    id: '3',
    title: 'Previous Year Question Papers - 2023',
    description: 'Collection of all previous year question papers for Data Structures with solutions.',
    type: 'pdf',
    subject: 'Data Structures',
    semester: 5,
    author: 'VTU',
    uploadDate: '2024-01-10',
    downloads: 567,
    rating: 4.9,
    size: '5.2 MB',
    fileName: 'VTU_DS_QP_2023.pdf',
    tags: ['question-papers', 'exam', 'important']
  },
  {
    id: '4',
    title: 'Database Normalization Cheat Sheet',
    description: 'Quick reference guide for database normalization forms with examples.',
    type: 'pdf',
    subject: 'Database Management',
    semester: 5,
    unit: 'Unit 2',
    author: 'Prof. Davis',
    uploadDate: '2024-01-08',
    downloads: 145,
    rating: 4.7,
    size: '1.2 MB',
    fileName: 'DB_Normalization_CheatSheet.pdf',
    tags: ['database', 'normalization', 'cheat-sheet']
  }
]

export default function ResourceHub() {
  const [filteredResources, setFilteredResources] = useState<Resource[]>([])
  const [allResources, setAllResources] = useState<Resource[]>(mockResources)
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSemester, setSelectedSemester] = useState<string>('5')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedUnit, setSelectedUnit] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('latest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [previewResource, setPreviewResource] = useState<Resource | null>(null)
  const [showNewResourceNotification, setShowNewResourceNotification] = useState(false)
  const [newResourceTitle, setNewResourceTitle] = useState('')
  const [downloading, setDownloading] = useState<string | null>(null)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [apiLoaded, setApiLoaded] = useState(false)

  // Memoized callbacks to prevent hook dependency issues
  const onResourceAdded = useCallback((resource: any) => {
    console.log('🎉 New resource added:', resource.title)
    setNewResourceTitle(resource.title)
    setShowNewResourceNotification(true)
    
    // Add to resources list
    const newResource: Resource = {
      id: resource.id,
      title: resource.title,
      description: resource.description,
      type: resource.type,
      subject: resource.subject,
      semester: resource.semester,
      unit: resource.unit,
      author: resource.uploadedBy,
      uploadDate: resource.created_at ? new Date(resource.created_at).toISOString().split('T')[0] : '2024-01-01',
      downloads: 0,
      rating: 0,
      size: resource.fileSize ? `${(resource.fileSize / 1024 / 1024).toFixed(2)} MB` : undefined,
      fileName: resource.fileName,
      tags: [],
      featured: false
    }
    
    setAllResources(prev => [newResource, ...prev])
    
    // Hide notification after 5 seconds
    setTimeout(() => setShowNewResourceNotification(false), 5000)
  }, [])

  const onResourceDeleted = useCallback((resourceId: string) => {
    console.log('🗑️ Resource deleted:', resourceId)
    setAllResources(prev => prev.filter(r => r.id !== resourceId))
  }, [])

  // Real-time updates for resources using WebSocket
  const { isConnected } = useRealtimeResources({
    enabled: true,
    onResourceAdded,
    onResourceDeleted
  })

  // Fallback: Real-time polling updates for resources
  const { data: resources, loading, refresh } = useRealtimeUpdates<Resource[]>({
    endpoint: '/api/student/resources',
    interval: 15000, // 15 seconds
    dependencies: [searchTerm, selectedSubject, selectedType, selectedSemester]
  })

  useEffect(() => {
    // Merge WebSocket and polling data with mock data as fallback
    if (resources && resources.length > 0) {
      setAllResources(resources)
      setApiLoaded(true)
    } else if (!loading && !apiLoaded) {
      // If API returns empty and not loading, use mock data
      setAllResources(mockResources)
      setApiLoaded(true)
    }
  }, [resources, loading, apiLoaded])

  useEffect(() => {
    // Subjects are already initialized with mockSubjects
    // This ensures UI is ready immediately
  }, [])

  const filterResources = useCallback(() => {
    if (!allResources) return
    
    let filtered = allResources.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesSemester = selectedSemester === 'all' || resource.semester === parseInt(selectedSemester)
      const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject
      const matchesType = selectedType === 'all' || resource.type === selectedType
      const matchesUnit = selectedUnit === 'all' || resource.unit === selectedUnit

      return matchesSearch && matchesSemester && matchesSubject && matchesType && matchesUnit
    })

    // Sort resources
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        case 'popular':
          return b.downloads - a.downloads
        case 'rating':
          return b.rating - a.rating
        case 'name':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    setFilteredResources(filtered)
  }, [allResources, searchTerm, selectedSemester, selectedSubject, selectedType, selectedUnit, sortBy])

  useEffect(() => {
    filterResources()
  }, [filterResources])

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-400" />
      case 'video':
        return <Video className="w-5 h-5 text-blue-400" />
      case 'link':
        return <Link className="w-5 h-5 text-green-400" />
      default:
        return <BookOpen className="w-5 h-5 text-cyan-400" />
    }
  }

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'video':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'link':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      default:
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    }
  }

  const handleDownload = async (resource: Resource) => {
    try {
      console.log('🔄 Starting download for:', resource.fileName || resource.title)
      setDownloading(resource.id)
      setDownloadError(null)
      
      // Get auth token
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('❌ No auth token found')
        setDownloadError('Authentication required. Please log in again.')
        setDownloading(null)
        return
      }

      // Create download URL
      const downloadUrl = `/api/uploads?id=${resource.id}`
      
      // Fetch with auth headers
      const response = await fetch(downloadUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      console.log('📡 Response status:', response.status)
      console.log('📋 Content-Type:', response.headers.get('content-type'))
      
      if (!response.ok) {
        const errorData = await response.text()
        console.error('❌ Download failed:', errorData)
        setDownloadError(`Download failed: ${response.statusText}`)
        setDownloading(null)
        return
      }
      
      // Get the blob
      const blob = await response.blob()
      console.log('📦 Blob size:', blob.size, 'type:', blob.type)
      
      if (blob.size === 0) {
        setDownloadError('File is empty. Please try again or contact support.')
        setDownloading(null)
        return
      }
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = resource.fileName || resource.title || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up the URL
      window.URL.revokeObjectURL(url)
      
      console.log('✅ Download completed for:', resource.fileName)
      setDownloading(null)
      
      // Update download count locally
      setFilteredResources(prev => prev.map(r => 
        r.id === resource.id ? { ...r, downloads: r.downloads + 1 } : r
      ))
      setAllResources(prev => prev.map(r => 
        r.id === resource.id ? { ...r, downloads: r.downloads + 1 } : r
      ))
    } catch (error) {
      console.error('❌ Download error:', error)
      setDownloadError(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`)
      setDownloading(null)
    }
  }

  const handlePreview = (resource: Resource) => {
    if (resource.type === 'pdf') {
      console.log('👁️ Opening PDF preview for:', resource.fileName || resource.title)
      setPreviewResource(resource)
    } else {
      // For non-PDF files, open in new tab
      console.log('🔗 Opening file in new tab:', resource.fileName || resource.title)
      const token = localStorage.getItem('token')
      if (token) {
        window.open(`/api/uploads?id=${resource.id}&preview=true`, '_blank')
      }
    }
  }

  const closePreview = () => {
    setPreviewResource(null)
  }

  const currentSubject = subjects.find(s => s.name === selectedSubject) || subjects[0]

  if (loading) {
    return (
      <DashboardLayout userRole="STUDENT">
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-6 h-6 text-cyan-300 animate-spin" />
            <div className="text-white text-xl">Loading resources...</div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="STUDENT">
      <div className="p-6">
        {/* Real-time Connection Status */}
        {isConnected && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center space-x-2">
            <Zap className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-sm">Connected to real-time updates</span>
          </div>
        )}

        {/* New Resource Notification */}
        {showNewResourceNotification && (
          <div className="mb-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center space-x-3 animate-pulse">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
            <span className="text-blue-300 text-sm">
              ✨ New resource uploaded: <strong>{newResourceTitle}</strong>
            </span>
          </div>
        )}

        {/* Download Error Notification */}
        {downloadError && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-between">
            <span className="text-red-300 text-sm">
              ⚠️ {downloadError}
            </span>
            <button 
              onClick={() => setDownloadError(null)}
              className="text-red-300 hover:text-red-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Resource Hub</h1>
            <p className="text-cyan-200">
              Access comprehensive study materials organized by semester and subject
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={refresh}
              className="text-white hover:bg-white/20"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="text-white hover:bg-white/20"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-300 w-4 h-4" />
                  <Input
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-cyan-300 focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Semester Filter */}
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  {semesters.map(sem => (
                    <SelectItem key={sem} value={sem.toString()}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Subject Filter */}
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects
                    .filter(s => selectedSemester === 'all' || s.semester === parseInt(selectedSemester))
                    .map(subject => (
                      <SelectItem key={subject.id} value={subject.name}>
                        {subject.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                  <SelectItem value="notes">Notes</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 text-cyan-200 mt-4">
              <Filter className="w-4 h-4" />
              <span className="text-sm">
                {filteredResources.length} of {resources?.length || 0} resources
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Featured Resources */}
        {filteredResources.some(r => r.featured) && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Star className="w-6 h-6 text-yellow-400 mr-2" />
              Featured Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.filter(r => r.featured).map((resource) => (
                <Card key={resource.id} className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-md border-white/20 hover:bg-white/30 transition-all transform hover:scale-105">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getResourceIcon(resource.type)}
                        <Badge className={getResourceTypeColor(resource.type)}>
                          {resource.type.toUpperCase()}
                        </Badge>
                      </div>
                      <Badge className="bg-yellow-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-lg">{resource.title}</CardTitle>
                    <CardDescription className="text-cyan-200">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-cyan-300 mb-4">
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {resource.author}
                      </span>
                      <span className="flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        {resource.downloads}
                      </span>
                      <span className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400" />
                        {resource.rating}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-cyan-300 mb-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(resource.uploadDate)}
                      </span>
                      {resource.size && (
                        <span>{resource.size}</span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleDownload(resource)}
                        disabled={downloading === resource.id}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {downloading === resource.id ? 'Downloading...' : 'Download'}
                      </Button>
                      {resource.type === 'pdf' && (
                        <Button
                          variant="outline"
                          onClick={() => handlePreview(resource)}
                          disabled={downloading === resource.id}
                          className="border-cyan-400 text-cyan-200 hover:bg-cyan-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Resources */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">All Resources</h2>
          
          {filteredResources.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-cyan-300/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Resources Found</h3>
                <p className="text-cyan-200 mb-6">
                  No resources match your current filters. Try adjusting your search criteria or check back later for new materials.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedSemester('all')
                    setSelectedSubject('all')
                    setSelectedType('all')
                    setSelectedUnit('all')
                  }}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.filter(r => !r.featured).map((resource) => (
                <Card key={resource.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      {getResourceIcon(resource.type)}
                      <Badge className={getResourceTypeColor(resource.type)}>
                        {resource.type.toUpperCase()}
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-lg">{resource.title}</CardTitle>
                    <CardDescription className="text-cyan-200">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-cyan-300 mb-4">
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {resource.author}
                      </span>
                      <span className="flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        {resource.downloads}
                      </span>
                      <span className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400" />
                        {resource.rating}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-cyan-300 mb-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(resource.uploadDate)}
                      </span>
                      {resource.size && (
                        <span>{resource.size}</span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleDownload(resource)}
                        disabled={downloading === resource.id}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {downloading === resource.id ? 'Downloading...' : 'Download'}
                      </Button>
                      {resource.type === 'pdf' && (
                        <Button
                          variant="outline"
                          onClick={() => handlePreview(resource)}
                          disabled={downloading === resource.id}
                          className="border-cyan-400 text-cyan-200 hover:bg-cyan-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResources.filter(r => !r.featured).map((resource) => (
                <Card key={resource.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getResourceIcon(resource.type)}
                          <Badge className={getResourceTypeColor(resource.type)}>
                            {resource.type.toUpperCase()}
                          </Badge>
                          <h3 className="text-lg font-semibold text-white">{resource.title}</h3>
                        </div>
                        <p className="text-cyan-200 mb-3">{resource.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-cyan-300">
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {resource.author}
                          </span>
                          <span className="flex items-center">
                            <Download className="w-4 h-4 mr-1" />
                            {resource.downloads} downloads
                          </span>
                          <span className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-400" />
                            {resource.rating}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(resource.uploadDate)}
                          </span>
                          {resource.size && (
                            <span>{resource.size}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-6">
                        <Button
                          onClick={() => handleDownload(resource)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        {resource.type === 'pdf' && (
                          <Button
                            variant="outline"
                            onClick={() => handlePreview(resource)}
                            className="border-cyan-400 text-cyan-200 hover:bg-cyan-500 hover:text-white"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* PDF Preview Modal */}
      {previewResource && (
        <PDFPreview
          url={`/api/uploads?id=${previewResource.id}&preview=true`}
          fileName={previewResource.fileName || previewResource.title}
          onClose={closePreview}
          onDownload={() => handleDownload(previewResource)}
        />
      )}
    </DashboardLayout>
  )
}
