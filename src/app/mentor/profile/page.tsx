'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { toast } from '@/hooks/use-toast'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { PlusCircle, Star, Clock, Users } from 'lucide-react'

interface MentorProfile {
  id: string
  name: string
  email: string
  avatar?: string
  bio: string
  specialization: string
  experience: number
  hourlyRate: number
  skills: string[]
  timezone: string
  availability: Record<string, boolean>
  preferences: {
    notifications: boolean
    emailUpdates: boolean
    publicProfile: boolean
  }
  socials: {
    linkedin?: string
    github?: string
    twitter?: string
  }
}

export default function MentorProfile() {
  const [profile, setProfile] = useState<MentorProfile | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [newSkill, setNewSkill] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true)
        await new Promise((r) => setTimeout(r, 800)) // simulate API
        setProfile({
          id: '1',
          name: 'John Mentor',
          email: 'john.mentor@example.com',
          avatar: undefined,
          bio: 'Experienced web development mentor passionate about helping others grow.',
          specialization: 'Full-Stack Development',
          experience: 5,
          hourlyRate: 50,
          skills: ['React', 'Next.js', 'Node.js', 'TypeScript'],
          timezone: 'UTC-5',
          availability: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: false,
            sunday: false,
          },
          preferences: {
            notifications: true,
            emailUpdates: true,
            publicProfile: true,
          },
          socials: {
            linkedin: 'https://linkedin.com/in/johnmentor',
            github: 'https://github.com/johnmentor',
          },
        })
      } catch {
        toast({
          title: 'Error loading profile',
          description: 'Please refresh and try again.',
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploadingPhoto(true)
    try {
      await new Promise((r) => setTimeout(r, 500))
      const url = URL.createObjectURL(file)
      setProfile((p) => p && { ...p, avatar: url })
      toast({ title: 'Photo updated', description: 'Your new photo has been set.' })
    } finally {
      setIsUploadingPhoto(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await new Promise((r) => setTimeout(r, 700))
      toast({ title: 'Profile saved', description: 'Your updates have been saved successfully.' })
    } finally {
      setIsSaving(false)
    }
  }

  const profileCompletion = (() => {
    if (!profile) return 0
    let filled = 0
    const total = 8
    if (profile.name) filled++
    if (profile.bio) filled++
    if (profile.specialization) filled++
    if (profile.skills.length) filled++
    if (profile.avatar) filled++
    if (profile.hourlyRate > 0) filled++
    if (profile.timezone) filled++
    if (Object.values(profile.availability).some(Boolean)) filled++
    return Math.round((filled / total) * 100)
  })()

  if (isLoading || !profile)
    return (
      <DashboardLayout userRole="MENTOR">
        <div className="p-6 space-y-4">
          <div className="animate-pulse h-6 w-48 bg-white/10 rounded" />
          <div className="animate-pulse h-60 bg-white/10 rounded" />
        </div>
      </DashboardLayout>
    )

  return (
    <DashboardLayout userRole="MENTOR">
      <div className="p-6 space-y-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-purple-300">Manage your public mentor profile and preferences</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-purple-200 mb-1">Profile completion</p>
            <Progress value={profileCompletion} className="w-40" />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-purple-300 text-sm">Average Rating</p>
                <h2 className="text-2xl font-semibold">4.8 / 5</h2>
              </div>
              <Star className="text-yellow-400" />
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-purple-300 text-sm">Total Students</p>
                <h2 className="text-2xl font-semibold">128</h2>
              </div>
              <Users className="text-blue-400" />
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-purple-300 text-sm">Avg. Response Time</p>
                <h2 className="text-2xl font-semibold">2 hrs</h2>
              </div>
              <Clock className="text-green-400" />
            </CardContent>
          </Card>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Basic Info */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24">
                  {profile.avatar ? (
                    <AvatarImage src={profile.avatar} />
                  ) : (
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <Label className="block mb-1">Upload Photo</Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    disabled={isUploadingPhoto}
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="bg-transparent text-white"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="bg-transparent text-white"
                  />
                </div>
              </div>

              <div>
                <Label>Bio</Label>
                <Textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="bg-transparent text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Specialization</Label>
                  <Input
                    value={profile.specialization}
                    onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                    className="bg-transparent text-white"
                  />
                </div>
                <div>
                  <Label>Experience (years)</Label>
                  <Input
                    type="number"
                    value={profile.experience}
                    onChange={(e) => setProfile({ ...profile, experience: Number(e.target.value) })}
                    className="bg-transparent text-white"
                  />
                </div>
              </div>

              <div>
                <Label>Hourly Rate ($)</Label>
                <Input
                  type="number"
                  value={profile.hourlyRate}
                  onChange={(e) => setProfile({ ...profile, hourlyRate: Number(e.target.value) })}
                  className="bg-transparent text-white"
                />
              </div>

              {/* Skills */}
              <div>
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-purple-600/20 text-purple-200 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  <div className="flex items-center space-x-1">
                    <Input
                      placeholder="Add skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="w-28 h-7 text-xs bg-transparent text-white"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (!newSkill.trim()) return
                        setProfile({
                          ...profile,
                          skills: [...profile.skills, newSkill.trim()],
                        })
                        setNewSkill('')
                      }}
                    >
                      <PlusCircle size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability & Preferences */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Availability & Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(profile.availability).map(([day, value]) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) =>
                        setProfile({
                          ...profile,
                          availability: { ...profile.availability, [day]: checked },
                        })
                      }
                    />
                    <Label>{day[0].toUpperCase() + day.slice(1)}</Label>
                  </div>
                ))}
              </div>

              <div>
                <Label>Timezone</Label>
                <Input
                  value={profile.timezone}
                  onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                  className="bg-transparent text-white"
                />
              </div>

              <div className="space-y-2">
                {(['notifications', 'emailUpdates', 'publicProfile'] as const).map((pref) => (
                  <div key={pref} className="flex items-center space-x-2">
                    <Switch
                      checked={profile.preferences[pref]}
                      onCheckedChange={(checked) =>
                        setProfile({
                          ...profile,
                          preferences: { ...profile.preferences, [pref]: checked },
                        })
                      }
                    />
                    <Label className="capitalize">{pref.replace(/([A-Z])/g, ' $1')}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(['linkedin', 'github', 'twitter'] as const).map((social) => (
                <div key={social}>
                  <Label className="capitalize">{social}</Label>
                  <Input
                    placeholder={`Enter ${social} URL`}
                    value={profile.socials[social] ?? ''}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        socials: { ...profile.socials, [social]: e.target.value },
                      })
                    }
                    className="bg-transparent text-white"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => window.location.reload()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
