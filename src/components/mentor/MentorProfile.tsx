'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { Star, Clock, Users, Save, Loader2, PlusCircle, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

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
}

export function MentorProfile() {
  const { token } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<MentorProfile | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [newSkill, setNewSkill] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/mentor/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          setProfile(data.profile)
        }
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load profile.', variant: 'destructive' })
      } finally {
        setIsLoading(false)
      }
    }
    if (token) fetchProfile()
  }, [token, toast])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setIsSaving(true)
    try {
      const response = await fetch('/api/mentor/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      })
      if (response.ok) {
        toast({ title: 'Success', description: 'Professional profile updated.' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save changes.', variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  const addSkill = () => {
    if (!newSkill.trim() || !profile) return
    if (profile.skills.includes(newSkill.trim())) return
    setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] })
    setNewSkill('')
  }

  const removeSkill = (skillToRemove: string) => {
    if (!profile) return
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skillToRemove) })
  }

  if (isLoading || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-[#335765]" />
        <p className="mt-4 text-[#74A8A4] font-bold">Fetching your profile...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#335765] tracking-tight">Professional Profile</h1>
          <p className="text-[#74A8A4] font-medium mt-1">This information is visible to students looking for mentors.</p>
        </div>
        <div className="bg-[#335765] rounded-2xl px-6 py-3 text-white shadow-lg">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#B6D9E0]">Hourly Rate</p>
          <p className="text-2xl font-black">${profile.hourlyRate}<span className="text-sm text-[#74A8A4]">/hr</span></p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Summary & Avatar */}
          <div className="space-y-8">
            <Card className="bg-white border-[#B6D9E0] rounded-[32px] overflow-hidden shadow-sm">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <div className="relative group">
                  <Avatar className="h-32 w-32 border-4 border-[#DBE2DC] shadow-xl">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback className="bg-[#B6D9E0] text-[#335765] text-3xl font-black">
                      {profile.name[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <h2 className="mt-6 text-xl font-black text-[#335765]">{profile.name}</h2>
                <p className="text-[#74A8A4] text-sm font-bold uppercase tracking-widest mt-1">{profile.specialization || 'Mentor'}</p>

                <div className="w-full mt-8 pt-8 border-t border-[#B6D9E0]/50 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-xl font-black text-[#335765]">4.8</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#74A8A4]">Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black text-[#74A8A4]">128</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#74A8A4]">Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#335765] border-none rounded-[32px] text-white p-8 shadow-xl">
              <h3 className="text-[#B6D9E0] font-black uppercase text-xs tracking-[0.2em] mb-6">Profile Completion</h3>
              <div className="space-y-4">
                <Progress value={85} className="h-2 bg-[#203640] [&>div]:bg-[#74A8A4]" />
                <p className="text-xs font-bold text-[#DBE2DC]">85% Complete — Add social links to reach 100%.</p>
              </div>
            </Card>
          </div>

          {/* Middle/Right Column: Form Details */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-white border-[#B6D9E0] rounded-[40px] shadow-sm">
              <CardHeader className="p-8 pb-4 border-b border-[#B6D9E0]/50 bg-[#DBE2DC]/30">
                <CardTitle className="text-2xl font-black text-[#335765]">Professional Information</CardTitle>
                <CardDescription className="font-medium text-[#74A8A4]">Define your expertise and background.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[#74A8A4] font-black uppercase text-[10px] tracking-widest pl-1">Primary Specialization</Label>
                      <Input
                        value={profile.specialization}
                        onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                        className="h-12 border-[#B6D9E0] bg-[#DBE2DC]/20 rounded-xl focus:ring-[#335765] focus:border-[#335765] text-[#335765]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#74A8A4] font-black uppercase text-[10px] tracking-widest pl-1">Hourly Rate ($)</Label>
                      <Input
                        type="number"
                        value={profile.hourlyRate}
                        onChange={(e) => setProfile({ ...profile, hourlyRate: Number(e.target.value) })}
                        className="h-12 border-[#B6D9E0] bg-[#DBE2DC]/20 rounded-xl focus:ring-[#335765] focus:border-[#335765] text-[#335765]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#74A8A4] font-black uppercase text-[10px] tracking-widest pl-1">Bio / About Me</Label>
                    <Textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="min-h-[150px] border-[#B6D9E0] bg-[#DBE2DC]/20 rounded-2xl p-4 focus:ring-[#335765] focus:border-[#335765] text-[#335765]"
                      placeholder="Introduce yourself to potential students..."
                    />
                  </div>

                  <div className="space-y-4 pt-4">
                    <Label className="text-[#74A8A4] font-black uppercase text-[10px] tracking-widest pl-1">Skills & Expertise</Label>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <div key={skill} className="flex items-center gap-2 bg-[#B6D9E0]/40 text-[#335765] border border-[#B6D9E0] px-4 py-2 rounded-xl font-bold text-sm">
                          {skill}
                          <button type="button" onClick={() => removeSkill(skill)} className="hover:text-[#7F543D] transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 max-w-md">
                      <Input
                        placeholder="Add a skill..."
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        className="h-12 border-[#B6D9E0] bg-[#DBE2DC]/20 rounded-xl focus:ring-[#335765] focus:border-[#335765] text-[#335765]"
                      />
                      <Button
                        type="button"
                        onClick={addSkill}
                        className="bg-[#335765] hover:bg-[#7F543D] text-white rounded-xl h-12 w-12"
                      >
                        <PlusCircle size={20} />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-[#B6D9E0]/50 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-[#7F543D] hover:bg-[#335765] text-white rounded-xl px-10 h-14 font-black shadow-lg transition-all"
                  >
                    {isSaving ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="mr-2 h-5 w-5" />}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#DBE2DC]/50 border-2 border-dashed border-[#B6D9E0] rounded-[32px] p-8 text-center">
              <Clock className="mx-auto h-8 w-8 text-[#74A8A4] mb-4" />
              <h4 className="text-[#335765] font-black">Looking for Availability Settings?</h4>
              <p className="text-[#74A8A4] text-sm mt-1 font-medium">Calendar and availability management is coming soon to your workspace.</p>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
