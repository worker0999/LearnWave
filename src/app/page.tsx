'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Users, Brain, Award, Clock, Star, ArrowRight, CheckCircle, Zap, Target, Lightbulb } from 'lucide-react'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Learning",
      description: "Get personalized study assistance with our advanced AI tutor",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Mentorship",
      description: "Connect with VTU faculty and industry experts for guidance",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Comprehensive Resources",
      description: "Access notes, papers, and study materials all in one place",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Placement Preparation",
      description: "Ace your interviews with AI-powered preparation tools",
      gradient: "from-orange-500 to-red-500"
    }
  ]

  const stats = [
    { label: "Active Students", value: "10,000+", icon: <Users className="w-5 h-5" /> },
    { label: "Expert Mentors", value: "500+", icon: <Award className="w-5 h-5" /> },
    { label: "Study Resources", value: "50,000+", icon: <BookOpen className="w-5 h-5" /> },
    { label: "Success Rate", value: "95%", icon: <Target className="w-5 h-5" /> }
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 lg:px-12">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            LearnWave
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/auth/login">
            <Button variant="ghost" className="text-white hover:text-purple-300 transition-colors">
              Login
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 lg:px-12 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none px-4 py-2">
            🚀 Empowering VTU Students Through AI
          </Badge>
          
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent animate-pulse">
            LearnWave
          </h1>
          
          <p className="text-xl lg:text-2xl text-purple-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Your AI-powered academic support platform designed exclusively for VTU students. 
            Centralize learning, connect with mentors, and accelerate your success.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth/register">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-4 transition-all transform hover:scale-105 hover:shadow-2xl">
                Start Learning Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="border-purple-400 text-purple-200 hover:bg-purple-500 hover:text-white text-lg px-8 py-4 transition-all">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
                <div className="flex items-center justify-center mb-2 text-purple-300">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-purple-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 lg:px-12 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Why Choose LearnWave?
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all transform hover:scale-105 hover:shadow-2xl ${activeFeature === index ? 'ring-2 ring-purple-400' : ''}`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <CardHeader>
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-4 transform transition-transform hover:rotate-12`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-2xl text-white">{feature.title}</CardTitle>
                  <CardDescription className="text-purple-200 text-lg">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-purple-200">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Advanced AI technology</span>
                    </div>
                    <div className="flex items-center space-x-2 text-purple-200">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>24/7 availability</span>
                    </div>
                    <div className="flex items-center space-x-2 text-purple-200">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Personalized experience</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 lg:px-12 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 border-none">
            <CardHeader className="pb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Learning?
              </h2>
              <p className="text-xl text-purple-100">
                Join thousands of VTU students already excelling with LearnWave
              </p>
            </CardHeader>
            <CardContent>
              <Link href="/auth/register">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50 text-lg px-8 py-4 transition-all transform hover:scale-105">
                  Get Started Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/20 px-6 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 lg:mb-0">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">LearnWave</span>
          </div>
          <p className="text-purple-200">
            © 2024 LearnWave. Empowering VTU students with AI-driven learning.
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}