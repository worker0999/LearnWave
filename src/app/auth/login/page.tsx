'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Zap, Eye, EyeOff, Loader2, Mail, Lock, User, BookOpen, GraduationCap, Users } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'STUDENT'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        login(data.token, data.user)

        switch (data.user.role) {
          case 'ADMIN':
            router.push('/admin')
            break
          case 'MENTOR':
            router.push('/mentor')
            break
          case 'STUDENT':
          default:
            router.push('/student')
            break
        }
      } else {
        setError(data.error || 'Login failed')
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
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 border-r border-white/5">
        {/* Decorative Grid & Glows */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,200,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,200,0.04)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-[#00d4c8]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#f0a050]/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-[#a078ff]/10 rounded-full blur-2xl animate-pulse animation-delay-4000" />

        {/* Main Illustration Container */}
        <div className="relative z-10 max-w-lg w-full">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 mb-16 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="LearnWave Logo" className="w-12 h-12 object-contain rounded-xl" />
            <span className="text-3xl font-bold text-[#f4f1eb] tracking-tight font-['Outfit']">
              LearnWave
            </span>
          </Link>

          {/* Heading */}
          <h1 className="font-['Instrument_Serif'] text-6xl text-[#f4f1eb] leading-none tracking-tight mb-6">
            Welcome back to the <br/><em className="text-[#00d4c8]">wave.</em>
          </h1>
          <p className="text-[#f4f1eb]/50 text-lg font-light leading-relaxed max-w-md mb-12">
            Sign in to access your AI tutoring, personalized study plans, and live collaboration sessions.
          </p>

          {/* Feature highlights */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-[#f4f1eb]/70 bg-[#13131a] p-4 rounded-2xl border border-white/5 shadow-2xl shadow-black/50">
              <div className="w-12 h-12 rounded-xl bg-[#00d4c8]/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#00d4c8]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#f4f1eb]">AI Study Assistant</h3>
                <p className="text-sm text-[#f4f1eb]/40">Your personalized learning companion</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[#f4f1eb]/70 bg-[#13131a] p-4 rounded-2xl border border-white/5 shadow-2xl shadow-black/50 translate-x-8">
              <div className="w-12 h-12 rounded-xl bg-[#f0a050]/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#f0a050]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#f4f1eb]">Expert Mentors</h3>
                <p className="text-sm text-[#f4f1eb]/40">Connect with top-tier educators</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#0a0a0f]">
        <div className="w-full max-w-md bg-[#13131a] p-8 sm:p-12 rounded-[2rem] border border-white/5 shadow-2xl relative">
          
          {/* Floating Accent */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#00d4c8]/20 blur-3xl rounded-full pointer-events-none" />

          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center justify-center space-x-3 mb-2">
              <img src="/logo.png" alt="LearnWave Logo" className="w-10 h-10 object-contain rounded-xl" />
              <span className="text-2xl font-bold text-[#f4f1eb]">
                LearnWave
              </span>
            </Link>
          </div>

          {/* Welcome Text */}
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-semibold text-[#f4f1eb] mb-2 font-['Outfit']">Sign In</h2>
            <p className="text-[#f4f1eb]/50 font-light">
              Enter your credentials to continue your journey.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-[#f4f1eb]/80 font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-[#00d4c8]" />
                Login As
              </Label>
              <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                <SelectTrigger className="h-14 bg-[#0a0a0f] border-white/10 text-[#f4f1eb] focus:border-[#00d4c8] focus:ring-1 focus:ring-[#00d4c8] rounded-xl">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-[#13131a] border-white/10 text-[#f4f1eb]">
                  <SelectItem value="STUDENT" className="focus:bg-white/5 focus:text-[#00d4c8]">🎓 Student</SelectItem>
                  <SelectItem value="MENTOR" className="focus:bg-white/5 focus:text-[#f0a050]">👨‍🏫 Mentor</SelectItem>
                  <SelectItem value="ADMIN" className="focus:bg-white/5 focus:text-[#a078ff]">👑 Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#f4f1eb]/80 font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#f4f1eb]/30" />
                <Input
                  id="email"
                  type="email"
                  placeholder="hello@learnwave.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="h-14 pl-12 border-white/10 focus:border-[#00d4c8] focus:ring-1 focus:ring-[#00d4c8] bg-[#0a0a0f] text-[#f4f1eb] placeholder:text-[#f4f1eb]/20 rounded-xl"
                  required
                />
                {formData.email && formData.email.includes('@') && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#00d4c8] rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-[#0a0a0f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#f4f1eb]/80 font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#f4f1eb]/30" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="h-14 pl-12 pr-12 border-white/10 focus:border-[#00d4c8] focus:ring-1 focus:ring-[#00d4c8] bg-[#0a0a0f] text-[#f4f1eb] placeholder:text-[#f4f1eb]/20 rounded-xl"
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 border rounded flex items-center justify-center transition-all ${rememberMe ? 'bg-[#00d4c8] border-[#00d4c8]' : 'border-white/20 bg-[#0a0a0f]'
                    }`}>
                    {rememberMe && (
                      <svg className="w-3 h-3 text-[#0a0a0f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-[#f4f1eb]/60 group-hover:text-[#f4f1eb]">Remember Me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-[#00d4c8] hover:text-[#00f0e2] transition-colors">
                Forget Password?
              </Link>
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

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-14 bg-[#00d4c8] hover:bg-[#00f0e2] text-[#0a0a0f] font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(0,212,200,0.3)] hover:shadow-[0_0_30px_rgba(0,212,200,0.5)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Login Now'
              )}
            </Button>

            {/* Create Account Link */}
            <div className="text-center pt-4">
              <p className="text-[#f4f1eb]/50">
                Don't have an account?{' '}
                <Link href="/auth/register" className="text-[#f0a050] hover:text-[#fcae60] font-semibold transition-colors">
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
