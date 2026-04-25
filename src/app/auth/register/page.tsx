'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Zap, Eye, EyeOff, Loader2, Mail, Lock, User, UserPlus, Users, Sparkles } from 'lucide-react'

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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

  return (
    <div className="min-h-screen flex bg-[#0a0a0f] font-['Outfit'] overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700;900&display=swap');
      `}} />

      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-[45%] relative items-center justify-center p-12 border-r border-white/5">
        {/* Decorative Grid & Glows */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,200,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,200,0.04)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-[#00d4c8]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#f0a050]/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-[#a078ff]/10 rounded-full blur-2xl animate-pulse animation-delay-4000" />

        {/* Main Illustration Container */}
        <div className="relative z-10 max-w-lg w-full">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 mb-16 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-[#00d4c8] rounded-xl flex items-center justify-center">
               <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                 <path d="M10 2L3 7v6l7 5 7-5V7L10 2z" fill="#0a0a0f"/>
                 <path d="M10 7v8M3 7l7 4 7-4" stroke="#0a0a0f" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
               </svg>
            </div>
            <span className="text-3xl font-bold text-[#f4f1eb] tracking-tight font-['Outfit']">
              LearnWave
            </span>
          </Link>

          {/* Heading */}
          <h1 className="font-['Instrument_Serif'] text-6xl text-[#f4f1eb] leading-none tracking-tight mb-6">
            Join the <br/><em className="text-[#f0a050]">future</em> of learning.
          </h1>
          <p className="text-[#f4f1eb]/50 text-lg font-light leading-relaxed max-w-md mb-12">
            Create an account to unlock AI-powered tools, access expert mentors, and elevate your academic journey.
          </p>

          {/* Feature highlights */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-[#f4f1eb]/70 bg-[#13131a] p-4 rounded-2xl border border-white/5 shadow-2xl shadow-black/50">
              <div className="w-12 h-12 rounded-xl bg-[#00d4c8]/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#00d4c8]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#f4f1eb]">Smart Curriculum</h3>
                <p className="text-sm text-[#f4f1eb]/40">Adaptive resources tailored for you</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[#f4f1eb]/70 bg-[#13131a] p-4 rounded-2xl border border-white/5 shadow-2xl shadow-black/50 translate-x-8">
              <div className="w-12 h-12 rounded-xl bg-[#a078ff]/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#a078ff]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#f4f1eb]">Community Driven</h3>
                <p className="text-sm text-[#f4f1eb]/40">Collaborate with peers & alumni</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-[#0a0a0f] overflow-y-auto">
        <div className="w-full max-w-2xl bg-[#13131a] p-8 sm:p-12 rounded-[2rem] border border-white/5 shadow-2xl relative my-auto">
          
          {/* Floating Accent */}
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#f0a050]/20 blur-3xl rounded-full pointer-events-none" />

          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center justify-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-[#00d4c8] rounded-xl flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L3 7v6l7 5 7-5V7L10 2z" fill="#0a0a0f"/>
                  <path d="M10 7v8M3 7l7 4 7-4" stroke="#0a0a0f" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-2xl font-bold text-[#f4f1eb]">
                LearnWave
              </span>
            </Link>
          </div>

          {/* Welcome Text */}
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-semibold text-[#f4f1eb] mb-2 font-['Outfit']">Create Account</h2>
            <p className="text-[#f4f1eb]/50 font-light">
              Get started with your free account today.
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#f4f1eb]/80 font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-[#f0a050]" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="h-14 border-white/10 focus:border-[#00d4c8] focus:ring-1 focus:ring-[#00d4c8] bg-[#0a0a0f] text-[#f4f1eb] placeholder:text-[#f4f1eb]/20 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#f4f1eb]/80 font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#00d4c8]" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hello@learnwave.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="h-14 border-white/10 focus:border-[#00d4c8] focus:ring-1 focus:ring-[#00d4c8] bg-[#0a0a0f] text-[#f4f1eb] placeholder:text-[#f4f1eb]/20 rounded-xl"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-[#f4f1eb]/80 font-medium flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#a078ff]" />
                I am a
              </Label>
              <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                <SelectTrigger className="h-14 bg-[#0a0a0f] border-white/10 text-[#f4f1eb] focus:border-[#00d4c8] focus:ring-1 focus:ring-[#00d4c8] rounded-xl">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-[#13131a] border-white/10 text-[#f4f1eb]">
                  <SelectItem value="STUDENT" className="focus:bg-white/5 focus:text-[#00d4c8]">🎓 Student</SelectItem>
                  <SelectItem value="MENTOR" className="focus:bg-white/5 focus:text-[#f0a050]">👨‍🏫 Mentor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Student Specific Fields */}
            {formData.role === 'STUDENT' && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="space-y-2 mb-5">
                  <Label htmlFor="usn" className="text-[#f4f1eb]/80 font-medium">
                    VTU USN
                  </Label>
                  <Input
                    id="usn"
                    type="text"
                    placeholder="1XX21CS001"
                    value={formData.usn}
                    onChange={(e) => handleChange('usn', e.target.value)}
                    className="h-14 border-white/10 focus:border-[#00d4c8] focus:ring-1 focus:ring-[#00d4c8] bg-[#0a0a0f] text-[#f4f1eb] placeholder:text-[#f4f1eb]/20 rounded-xl"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="branch" className="text-[#f4f1eb]/80 font-medium">
                      Branch
                    </Label>
                    <Select value={formData.branch} onValueChange={(value) => handleChange('branch', value)}>
                      <SelectTrigger className="h-14 bg-[#0a0a0f] border-white/10 text-[#f4f1eb] focus:border-[#00d4c8] focus:ring-1 focus:ring-[#00d4c8] rounded-xl">
                        <SelectValue placeholder="Select your branch" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#13131a] border-white/10 text-[#f4f1eb]">
                        {branches.map((branch) => (
                          <SelectItem key={branch} value={branch} className="focus:bg-white/5 focus:text-[#00d4c8]">
                            {branch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="semester" className="text-[#f4f1eb]/80 font-medium">
                      Semester
                    </Label>
                    <Select value={formData.semester} onValueChange={(value) => handleChange('semester', value)}>
                      <SelectTrigger className="h-14 bg-[#0a0a0f] border-white/10 text-[#f4f1eb] focus:border-[#00d4c8] focus:ring-1 focus:ring-[#00d4c8] rounded-xl">
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#13131a] border-white/10 text-[#f4f1eb]">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                          <SelectItem key={sem} value={sem.toString()} className="focus:bg-white/5 focus:text-[#00d4c8]">
                            Semester {sem}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Mentor Specific Fields */}
            {formData.role === 'MENTOR' && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-[#f4f1eb]/80 font-medium">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself and your teaching experience..."
                    value={formData.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    className="min-h-[100px] border-white/10 focus:border-[#00d4c8] focus:ring-1 focus:ring-[#00d4c8] bg-[#0a0a0f] text-[#f4f1eb] placeholder:text-[#f4f1eb]/20 rounded-xl resize-none p-4"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expertise" className="text-[#f4f1eb]/80 font-medium">
                    Areas of Expertise
                  </Label>
                  <Input
                    id="expertise"
                    type="text"
                    placeholder="e.g., Data Structures, Algorithms, Web Development"
                    value={formData.expertise}
                    onChange={(e) => handleChange('expertise', e.target.value)}
                    className="h-14 border-white/10 focus:border-[#00d4c8] focus:ring-1 focus:ring-[#00d4c8] bg-[#0a0a0f] text-[#f4f1eb] placeholder:text-[#f4f1eb]/20 rounded-xl"
                    required
                  />
                  <p className="text-xs text-[#f4f1eb]/40 pl-1">Separate multiple areas with commas</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-[#f4f1eb]/80 font-medium">
                    Experience
                  </Label>
                  <Input
                    id="experience"
                    type="text"
                    placeholder="e.g., 5 years of industry experience"
                    value={formData.experience}
                    onChange={(e) => handleChange('experience', e.target.value)}
                    className="h-14 border-white/10 focus:border-[#00d4c8] focus:ring-1 focus:ring-[#00d4c8] bg-[#0a0a0f] text-[#f4f1eb] placeholder:text-[#f4f1eb]/20 rounded-xl"
                    required
                  />
                </div>
              </div>
            )}

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#f4f1eb]/80 font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#f4f1eb]/40" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="h-14 pr-12 border-white/10 focus:border-[#00d4c8] focus:ring-1 focus:ring-[#00d4c8] bg-[#0a0a0f] text-[#f4f1eb] placeholder:text-[#f4f1eb]/20 rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#f4f1eb]/30 hover:text-[#00d4c8] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#f4f1eb]/80 font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#f4f1eb]/40" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="h-14 pr-12 border-white/10 focus:border-[#00d4c8] focus:ring-1 focus:ring-[#00d4c8] bg-[#0a0a0f] text-[#f4f1eb] placeholder:text-[#f4f1eb]/20 rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#f4f1eb]/30 hover:text-[#00d4c8] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert className="bg-red-500/10 border-red-500/20 text-red-400 rounded-xl">
                <AlertDescription className="flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-14 bg-[#00d4c8] hover:bg-[#00f0e2] text-[#0a0a0f] font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(0,212,200,0.3)] hover:shadow-[0_0_30px_rgba(0,212,200,0.5)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 mt-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>

            {/* Sign In Link */}
            <div className="text-center pt-4">
              <p className="text-[#f4f1eb]/50">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-[#00d4c8] hover:text-[#00f0e2] font-semibold transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
