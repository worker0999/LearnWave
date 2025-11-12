'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Zap, Eye, EyeOff, Loader2, Upload, User } from 'lucide-react'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
    usn: '',
    branch: '',
    semester: '',
    bio: '',
    expertise: '',
    experience: '',
    resume: null as File | null
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const branches = [
    'Computer Science & Engineering',
    'Information Science & Engineering',
    'Electronics & Communication Engineering',
    'Electrical & Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const submitData = new FormData()
      
      // Basic fields
      submitData.append('name', formData.name)
      submitData.append('email', formData.email)
      submitData.append('password', formData.password)
      submitData.append('role', formData.role)

      // Student specific fields
      if (formData.role === 'STUDENT') {
        submitData.append('usn', formData.usn)
        submitData.append('branch', formData.branch)
        submitData.append('semester', formData.semester)
      }

      // Mentor specific fields
      if (formData.role === 'MENTOR') {
        submitData.append('bio', formData.bio)
        submitData.append('expertise', formData.expertise)
        submitData.append('experience', formData.experience)
        if (formData.resume) {
          submitData.append('resume', formData.resume)
        }
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          ...(formData.role === 'STUDENT' && {
            usn: formData.usn,
            branch: formData.branch,
            semester: parseInt(formData.semester)
          }),
          ...(formData.role === 'MENTOR' && {
            bio: formData.bio,
            expertise: formData.expertise.split(',').map(e => e.trim()),
            experience: formData.experience
          })
        }),
      })

      const data = await response.json()

      if (response.ok) {
        if (formData.role === 'MENTOR') {
          router.push('/auth/mentor-success')
        } else {
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          router.push('/student')
        }
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (file: File) => {
    setFormData(prev => ({ ...prev, resume: file }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 py-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join LearnWave</h1>
          <p className="text-purple-200">Create your account and start learning</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white text-center">Create Account</CardTitle>
            <CardDescription className="text-purple-200 text-center">
              Fill in your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-purple-200">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-purple-300 focus:border-purple-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-purple-200">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-purple-300 focus:border-purple-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-purple-200">I am a</Label>
                <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="MENTOR">Mentor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Student Specific Fields */}
              {formData.role === 'STUDENT' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="usn" className="text-purple-200">VTU USN</Label>
                    <Input
                      id="usn"
                      type="text"
                      placeholder="Enter your VTU USN"
                      value={formData.usn}
                      onChange={(e) => handleChange('usn', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-purple-300 focus:border-purple-400"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="branch" className="text-purple-200">Branch</Label>
                      <Select value={formData.branch} onValueChange={(value) => handleChange('branch', value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select your branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.map((branch) => (
                            <SelectItem key={branch} value={branch}>
                              {branch}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="semester" className="text-purple-200">Semester</Label>
                      <Select value={formData.semester} onValueChange={(value) => handleChange('semester', value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                            <SelectItem key={sem} value={sem.toString()}>
                              Semester {sem}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              {/* Mentor Specific Fields */}
              {formData.role === 'MENTOR' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-purple-200">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself"
                      value={formData.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-purple-300 focus:border-purple-400"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expertise" className="text-purple-200">Areas of Expertise</Label>
                    <Input
                      id="expertise"
                      type="text"
                      placeholder="e.g., Data Structures, Algorithms, Web Development"
                      value={formData.expertise}
                      onChange={(e) => handleChange('expertise', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-purple-300 focus:border-purple-400"
                      required
                    />
                    <p className="text-xs text-purple-300">Separate multiple areas with commas</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-purple-200">Experience</Label>
                    <Input
                      id="experience"
                      type="text"
                      placeholder="e.g., 5 years of industry experience"
                      value={formData.experience}
                      onChange={(e) => handleChange('experience', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-purple-300 focus:border-purple-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resume" className="text-purple-200">Resume (Optional)</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                        className="bg-white/10 border-white/20 text-white file:text-purple-200 file:bg-white/10 file:border-white/20"
                      />
                      {formData.resume && (
                        <span className="text-purple-200 text-sm">{formData.resume.name}</span>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-purple-200">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-purple-300 focus:border-purple-400 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-purple-200">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-purple-300 focus:border-purple-400 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <Alert className="bg-red-500/20 border-red-500/50 text-red-200">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all transform hover:scale-105"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-purple-200">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}