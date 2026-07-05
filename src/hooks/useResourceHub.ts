'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates'
import { useRealtimeResources } from '@/hooks/useRealtimeResources'

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

const mockSubjects: Subject[] = [
  { id: '1', name: 'Data Structures', code: 'CS52', semester: 5, units: ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'], resourceCount: 45 },
  { id: '2', name: 'Algorithm Analysis', code: 'CS53', semester: 5, units: ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'], resourceCount: 38 },
  { id: '3', name: 'Database Management', code: 'CS54', semester: 5, units: ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'], resourceCount: 52 },
  { id: '4', name: 'Web Technology', code: 'CS55', semester: 5, units: ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'], resourceCount: 41 }
]

export function useResourceHub() {
  const { token } = useAuth()

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

  const onResourceAdded = useCallback((resource: any) => {
    setNewResourceTitle(resource.title)
    setShowNewResourceNotification(true)
    
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
    setTimeout(() => setShowNewResourceNotification(false), 5000)
  }, [])

  const onResourceDeleted = useCallback((resourceId: string) => {
    setAllResources(prev => prev.filter(r => r.id !== resourceId))
  }, [])

  const { isConnected } = useRealtimeResources({
    enabled: true,
    onResourceAdded,
    onResourceDeleted
  })

  const { data: resources, loading, refresh } = useRealtimeUpdates<Resource[]>({
    endpoint: '/api/student/resources',
    interval: 15000,
    dependencies: [searchTerm, selectedSubject, selectedType, selectedSemester]
  })

  useEffect(() => {
    if (resources && resources.length > 0) {
      setAllResources(resources)
      setApiLoaded(true)
    } else if (!loading && !apiLoaded) {
      setAllResources(mockResources)
      setApiLoaded(true)
    }
  }, [resources, loading, apiLoaded])

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

  const handleDownload = async (resource: Resource) => {
    try {
      setDownloading(resource.id)
      setDownloadError(null)
      
      if (!token) {
        setDownloadError('Authentication required. Please log in again.')
        setDownloading(null)
        return
      }

      const downloadUrl = `/api/uploads?id=${resource.id}`
      
      const response = await fetch(downloadUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        setDownloadError(`Download failed: ${response.statusText}`)
        setDownloading(null)
        return
      }
      
      const blob = await response.blob()
      
      if (blob.size === 0) {
        setDownloadError('File is empty. Please try again or contact support.')
        setDownloading(null)
        return
      }
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = resource.fileName || resource.title || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      setDownloading(null)
      
      setFilteredResources(prev => prev.map(r => 
        r.id === resource.id ? { ...r, downloads: r.downloads + 1 } : r
      ))
      setAllResources(prev => prev.map(r => 
        r.id === resource.id ? { ...r, downloads: r.downloads + 1 } : r
      ))
    } catch (error) {
      setDownloadError(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`)
      setDownloading(null)
    }
  }

  const handlePreview = (resource: Resource) => {
    if (resource.type === 'pdf') {
      setPreviewResource(resource)
    } else {
      if (token) {
        window.open(`/api/uploads?id=${resource.id}&preview=true`, '_blank')
      }
    }
  }

  const closePreview = () => {
    setPreviewResource(null)
  }

  return {
    filteredResources,
    setFilteredResources,
    allResources,
    setAllResources,
    subjects,
    setSubjects,
    searchTerm,
    setSearchTerm,
    selectedSemester,
    setSelectedSemester,
    selectedSubject,
    setSelectedSubject,
    selectedType,
    setSelectedType,
    selectedUnit,
    setSelectedUnit,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    previewResource,
    setPreviewResource,
    showNewResourceNotification,
    setShowNewResourceNotification,
    newResourceTitle,
    setNewResourceTitle,
    downloading,
    setDownloading,
    downloadError,
    setDownloadError,
    apiLoaded,
    setApiLoaded,
    loading,
    refresh,
    isConnected,
    handleDownload,
    handlePreview,
    closePreview
  }
}
