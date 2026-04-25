'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  LogOut,
  Camera,
  Save,
  ArrowLeft,
  FileText,
  Palette,
  Bell,
  Globe,
  Shield,
  Briefcase
} from 'lucide-react'

interface AdminProfile {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  bio?: string
  location?: string
  organization?: string
  theme: 'light' | 'dark' | 'auto'
  notifications: {
    email: boolean
    push: boolean
    systemAlerts: boolean
    userReports: boolean
    analyticsUpdates: boolean
  }
}

export default function AdminProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'preferences'>('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const [profile, setProfile] = useState<AdminProfile>({
    id: user?.id || '',
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    avatar: (user as any)?.avatar || '',
    bio: '',
    location: '',
    organization: '',
    theme: 'dark',
    notifications: {
      email: true,
      push: true,
      systemAlerts: true,
      userReports: true,
      analyticsUpdates: true
    }
  })

  const [editForm, setEditForm] = useState(profile)

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem(`admin-profile-${user?.id}`)
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile)
      setProfile(parsed)
      setEditForm(parsed)
    }
  }, [user?.id])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setEditForm({
          ...editForm,
          avatar: base64String
        })
      }
      reader.readAsDataURL(file)
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
      [name]: value
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

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      // Save to localStorage
      localStorage.setItem(`admin-profile-${user?.id}`, JSON.stringify(editForm))
      
      // In a real app, you would send this to the backend
      setProfile(editForm)
      setIsEditing(false)
      setSuccessMessage('Profile updated successfully!')
      
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Failed to save profile:', error)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-indigo-300 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Profile</h1>
              <p className="text-cyan-300">Manage your admin account</p>
            </div>
          </div>
        </div>

        {successMessage && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300">
            ✓ {successMessage}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 sticky top-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full px-4 py-3 rounded-lg flex items-center space-x-3 transition-all text-left ${
                    activeTab === 'profile'
                      ? 'bg-indigo-500/30 text-white border border-indigo-500/50'
                      : 'text-cyan-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full px-4 py-3 rounded-lg flex items-center space-x-3 transition-all text-left ${
                    activeTab === 'settings'
                      ? 'bg-indigo-500/30 text-white border border-indigo-500/50'
                      : 'text-cyan-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`w-full px-4 py-3 rounded-lg flex items-center space-x-3 transition-all text-left ${
                    activeTab === 'preferences'
                      ? 'bg-indigo-500/30 text-white border border-indigo-500/50'
                      : 'text-cyan-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Palette className="w-5 h-5" />
                  <span>Preferences</span>
                </button>
              </nav>

              <hr className="my-4 border-white/10" />

              <Button
                onClick={handleLogout}
                className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Admin Profile</CardTitle>
                      <CardDescription className="text-cyan-300">
                        Update your administrator information
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant={isEditing ? 'destructive' : 'default'}
                      className={isEditing ? 'bg-red-500/20 text-red-300 border-red-500/50' : ''}
                    >
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative group">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center cursor-pointer overflow-hidden border-4 border-indigo-500/30 group-hover:border-indigo-500/60 transition-all">
                        {editForm.avatar ? (
                          <img src={editForm.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-10 h-10 text-white" />
                        )}
                      </div>
                      {isEditing && (
                        <button
                          onClick={handleAvatarClick}
                          title="Change avatar"
                          className="absolute bottom-0 right-0 bg-indigo-500 hover:bg-indigo-600 rounded-full p-2 transition-colors"
                        >
                          <Camera className="w-5 h-5 text-white" />
                        </button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-white">{profile.name}</h3>
                      <p className="text-cyan-300 text-sm">{profile.email}</p>
                      <Badge className="mt-2 bg-red-500/30 text-red-300">Administrator</Badge>
                    </div>
                  </div>

                  <hr className="border-white/10" />

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white font-medium mb-2 flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Full Name</span>
                      </label>
                      <Input
                        name="name"
                        value={isEditing ? editForm.name : profile.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={isEditing ? 'bg-white/10 border-indigo-500/30 text-white' : 'bg-white/5 border-white/10 text-gray-400'}
                      />
                    </div>

                    <div>
                      <label className="text-white font-medium mb-2 flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>Email</span>
                      </label>
                      <Input
                        name="email"
                        value={isEditing ? editForm.email : profile.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        type="email"
                        className={isEditing ? 'bg-white/10 border-indigo-500/30 text-white' : 'bg-white/5 border-white/10 text-gray-400'}
                      />
                    </div>

                    <div>
                      <label className="text-white font-medium mb-2 flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>Phone</span>
                      </label>
                      <Input
                        name="phone"
                        value={isEditing ? editForm.phone : profile.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Add your phone number"
                        className={isEditing ? 'bg-white/10 border-indigo-500/30 text-white' : 'bg-white/5 border-white/10 text-gray-400'}
                      />
                    </div>

                    <div>
                      <label className="text-white font-medium mb-2 flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>Location</span>
                      </label>
                      <Input
                        name="location"
                        value={isEditing ? editForm.location : profile.location}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="City, Country"
                        className={isEditing ? 'bg-white/10 border-indigo-500/30 text-white' : 'bg-white/5 border-white/10 text-gray-400'}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-white font-medium mb-2 flex items-center space-x-2">
                        <Briefcase className="w-4 h-4" />
                        <span>Organization</span>
                      </label>
                      <Input
                        name="organization"
                        value={isEditing ? editForm.organization : profile.organization}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Your organization or institution"
                        className={isEditing ? 'bg-white/10 border-indigo-500/30 text-white' : 'bg-white/5 border-white/10 text-gray-400'}
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="text-white font-medium mb-2 flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Bio</span>
                    </label>
                    <Textarea
                      name="bio"
                      value={isEditing ? editForm.bio : profile.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself..."
                      className={`${isEditing ? 'bg-white/10 border-indigo-500/30 text-white' : 'bg-white/5 border-white/10 text-gray-400'} min-h-24`}
                    />
                  </div>

                  {isEditing && (
                    <div className="flex space-x-3 pt-4">
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditing(false)
                          setEditForm(profile)
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Security Settings</CardTitle>
                  <CardDescription className="text-cyan-300">
                    Manage your admin account security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Password Section */}
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                      <Lock className="w-5 h-5" />
                      <span>Password & Security</span>
                    </h3>
                    <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
                      Change Password
                    </Button>
                    <p className="text-cyan-300 text-sm mt-3">
                      Last changed 30 days ago
                    </p>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span>Two-Factor Authentication</span>
                    </h3>
                    <p className="text-cyan-300 text-sm mb-3">
                      Add an extra layer of security to your admin account
                    </p>
                    <Badge className="bg-red-500/30 text-red-300 mb-3">Not Enabled</Badge>
                    <Button variant="outline" className="text-cyan-300 border-cyan-500/30">
                      Enable 2FA
                    </Button>
                  </div>

                  {/* Admin Permissions */}
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h3 className="text-white font-semibold mb-3">Admin Permissions</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10">
                        <span className="text-white">User Management</span>
                        <Badge className="bg-green-500/30 text-green-300">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10">
                        <span className="text-white">Analytics</span>
                        <Badge className="bg-green-500/30 text-green-300">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10">
                        <span className="text-white">Resource Management</span>
                        <Badge className="bg-green-500/30 text-green-300">Enabled</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Active Sessions */}
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h3 className="text-white font-semibold mb-3">Active Sessions</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10">
                        <div>
                          <p className="text-white font-medium">Current Device</p>
                          <p className="text-cyan-300 text-sm">Windows • Chrome</p>
                        </div>
                        <Badge className="bg-green-500/30 text-green-300">Active</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Preferences</CardTitle>
                      <CardDescription className="text-cyan-300">
                        Customize your admin experience
                      </CardDescription>
                    </div>
                    {activeTab === 'preferences' && (
                      <Button
                        onClick={() => setIsEditing(!isEditing)}
                        variant={isEditing ? 'destructive' : 'default'}
                        className={isEditing ? 'bg-red-500/20 text-red-300 border-red-500/50' : ''}
                      >
                        {isEditing ? 'Cancel' : 'Edit'}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Theme Preference */}
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <label className="text-white font-semibold mb-3 flex items-center space-x-2">
                      <Palette className="w-5 h-5" />
                      <span>Theme</span>
                    </label>
                    {isEditing ? (
                      <Select value={editForm.theme} onValueChange={(value) => handleSelectChange('theme', value)}>
                        <SelectTrigger className="bg-white/10 border-indigo-500/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/20">
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="auto">Auto (System)</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-cyan-300">
                        {profile.theme === 'auto' ? 'Auto (System)' : profile.theme.charAt(0).toUpperCase() + profile.theme.slice(1)}
                      </p>
                    )}
                  </div>

                  {/* Notifications */}
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                      <Bell className="w-5 h-5" />
                      <span>Admin Notifications</span>
                    </h3>
                    <div className="space-y-3">
                      {[
                        { key: 'email', label: 'Email Notifications', description: 'Receive admin updates via email' },
                        { key: 'push', label: 'Push Notifications', description: 'Browser push notifications' },
                        { key: 'systemAlerts', label: 'System Alerts', description: 'Critical system alerts' },
                        { key: 'userReports', label: 'User Reports', description: 'User issue reports' },
                        { key: 'analyticsUpdates', label: 'Analytics Updates', description: 'Daily analytics summary' }
                      ].map(({ key, label, description }) => (
                        <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10">
                          <div>
                            <p className="text-white font-medium">{label}</p>
                            <p className="text-cyan-300 text-sm">{description}</p>
                          </div>
                          <div className="relative inline-block w-12 h-6 cursor-pointer" onClick={() => isEditing && handleNotificationChange(key as any)}>
                            <input
                              type="checkbox"
                              checked={isEditing ? editForm.notifications[key as any] : profile.notifications[key as any]}
                              disabled={!isEditing}
                              onChange={() => {}}
                              className="sr-only"
                            />
                            <div className={`block w-full h-full rounded-full transition ${
                              (isEditing ? editForm.notifications[key as any] : profile.notifications[key as any])
                                ? 'bg-indigo-500'
                                : 'bg-gray-600'
                            }`}></div>
                            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                              (isEditing ? editForm.notifications[key as any] : profile.notifications[key as any])
                                ? 'translate-x-6'
                                : 'translate-x-0'
                            }`}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex space-x-3 pt-4">
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Preferences'}
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditing(false)
                          setEditForm(profile)
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
