'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  bio?: string
  location?: string
  branch?: string
  semester?: number
  usn?: string
  skills?: string[]
  theme: 'light' | 'dark' | 'auto'
  notifications: {
    email: boolean
    push: boolean
    announcements: boolean
    forums: boolean
    mentorUpdates: boolean
  }
}

export function useStudentProfile() {
  const { user, logout, token, updateUser } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'preferences'>('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || '',
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatarUrl || '',
    bio: '',
    location: '',
    branch: user?.branch || '',
    semester: user?.semester || 1,
    usn: user?.usn || '',
    skills: [],
    theme: 'dark',
    notifications: {
      email: true,
      push: true,
      announcements: true,
      forums: true,
      mentorUpdates: true
    }
  })

  const [editForm, setEditForm] = useState(profile)
  const [newSkill, setNewSkill] = useState('')

  useEffect(() => {
    if (user) {
      const initialProfileState: UserProfile = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        avatar: user.avatarUrl || '',
        bio: '',
        location: '',
        branch: user.branch || '',
        semester: user.semester || 1,
        usn: user.usn || '',
        skills: [],
        theme: 'dark',
        notifications: {
          email: true,
          push: true,
          announcements: true,
          forums: true,
          mentorUpdates: true
        }
      }

      const savedProfile = localStorage.getItem(`user-profile-${user.id}`)
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile)
          const merged = {
            ...parsed,
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || parsed.phone || '',
            avatar: user.avatarUrl || parsed.avatar || '',
            branch: user.branch || parsed.branch || '',
            semester: user.semester || parsed.semester || 1,
            usn: user.usn || parsed.usn || ''
          }
          setProfile(merged)
          setEditForm(merged)
        } catch (e) {
          setProfile(initialProfileState)
          setEditForm(initialProfileState)
        }
      } else {
        setProfile(initialProfileState)
        setEditForm(initialProfileState)
      }
    }
  }, [user])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds 2MB limit.')
      return
    }

    const data = new FormData()
    data.append('file', file)

    try {
      setIsSaving(true)
      const response = await fetch('/api/student/profile/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      })

      if (response.ok) {
        const resData = await response.json()
        setEditForm(prev => ({
          ...prev,
          avatar: resData.avatarUrl
        }))
        setProfile(prev => ({
          ...prev,
          avatar: resData.avatarUrl
        }))
        updateUser({ avatarUrl: resData.avatarUrl })
        setSuccessMessage('Profile picture updated successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        const err = await response.json()
        alert(err.error || 'Failed to upload avatar')
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error)
      alert('An error occurred during upload.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditForm({
      ...editForm,
      [name]: value
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setEditForm({
      ...editForm,
      [name]: name === 'semester' ? parseInt(value) : value
    })
  }

  const handleNotificationChange = (key: keyof typeof profile.notifications) => {
    setEditForm({
      ...editForm,
      notifications: {
        ...editForm.notifications,
        [key]: !editForm.notifications[key]
      }
    })
  }

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setEditForm({
        ...editForm,
        skills: [...(editForm.skills || []), newSkill.trim()]
      })
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (index: number) => {
    setEditForm({
      ...editForm,
      skills: (editForm.skills || []).filter((_, i) => i !== index)
    })
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/student/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone
        })
      })

      if (response.ok) {
        const resData = await response.json()
        localStorage.setItem(`user-profile-${user?.id}`, JSON.stringify(editForm))
        
        updateUser({
          name: resData.user.name,
          email: resData.user.email,
          phone: resData.user.phone
        })

        setProfile(editForm)
        setIsEditing(false)
        setSuccessMessage('Profile updated successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        const err = await response.json()
        alert(err.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Failed to save profile:', error)
      alert('An error occurred while saving profile.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/auth/login')
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  return {
    isEditing,
    setIsEditing,
    activeTab,
    setActiveTab,
    isSaving,
    setIsSaving,
    successMessage,
    setSuccessMessage,
    profile,
    setProfile,
    editForm,
    setEditForm,
    newSkill,
    setNewSkill,
    fileInputRef,
    handleAvatarClick,
    handleAvatarChange,
    handleInputChange,
    handleSelectChange,
    handleNotificationChange,
    handleAddSkill,
    handleRemoveSkill,
    handleSaveProfile,
    handleLogout
  }
}
