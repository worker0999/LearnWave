'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuth } from '@/contexts/AuthContext'
import {
  Users,
  Calendar,
  DollarSign,
  Star,
  Clock,
  TrendingUp,
  Video,
  MessageSquare,
  Award,
  Play,
  Plus,
  RefreshCw,
  ArrowUpRight
} from 'lucide-react'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'

export default function MentorDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/mentor/dashboard', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response.ok) {
          const result = await response.json()
          setData(result)
        }
      } catch (error) {
        console.error('Error fetching dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <DashboardLayout userRole="MENTOR">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <RefreshCw className="w-10 h-10 text-[#6B5844] animate-spin mb-4" />
          <p className="text-[#4A3F33] text-xl font-black tracking-tight">Syncing your desk...</p>
        </div>
      </DashboardLayout>
    )
  }

  const mentor = data?.mentorData
  const recentSessions = data?.recentSessions || []

  return (
    <DashboardLayout userRole="MENTOR">
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-[#4A3F33] tracking-tighter">
              Welcome, {mentor?.name?.split(' ')[0] || 'Mentor'}!
            </h1>
            <p className="text-[#9B8B7E] font-medium font-inter mt-1">Here's what's happening with your students today.</p>
          </div>
          <Button
            className="bg-[#6B5844] hover:bg-[#4A3F33] text-white rounded-2xl px-6 h-12 font-bold shadow-lg shadow-brown-200 transition-all active:scale-95"
            onClick={() => router.push('/mentor/sessions')}
          >
            <Calendar className="mr-2 h-5 w-5" /> View Full Schedule
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Earnings', value: `$${mentor?.totalEarnings || 0}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Students', value: mentor?.totalStudents || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Avg Rating', value: mentor?.rating || '4.5', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: 'Total Sessions', value: mentor?.totalSessions || 0, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' }
          ].map((stat, i) => (
            <Card key={i} className="bg-white border-[#E8DFD3] rounded-[32px] hover:shadow-xl transition-all duration-300 group overflow-hidden border-none shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-colors`}>
                    <stat.icon size={24} />
                  </div>
                  <ArrowUpRight className="text-[#D4C4B0] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-6">
                  <p className="text-3xl font-black text-[#4A3F33] tracking-tight">{stat.value}</p>
                  <p className="text-xs font-black uppercase tracking-widest text-[#9B8B7E] mt-1">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Sessions Feed */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-white border-[#E8DFD3] rounded-[40px] shadow-sm overflow-hidden border-none">
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-black text-[#4A3F33]">Recent Activity</CardTitle>
                  <Button variant="link" className="text-[#6B5844] font-bold" onClick={() => router.push('/mentor/sessions')}>View All</Button>
                </div>
                <CardDescription className="text-[#9B8B7E] font-medium">Your latest student interactions and bookings.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <div className="space-y-4">
                  {recentSessions.length === 0 ? (
                    <div className="text-center py-12 bg-[#F8F3EE]/50 rounded-3xl border-2 border-dashed border-[#E8DFD3]">
                      <Users className="mx-auto h-12 w-12 text-[#D4C4B0] mb-4" />
                      <p className="text-[#4A3F33] font-bold">No sessions yet</p>
                      <p className="text-[#9B8B7E] text-sm">New bookings will appear here.</p>
                    </div>
                  ) : (
                    recentSessions.map((session: any) => (
                      <div key={session.id} className="group p-6 bg-white rounded-3xl border border-[#F5F0EA] hover:border-[#6B5844] hover:shadow-md transition-all flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-[#E8DFD3] flex items-center justify-center text-[#6B5844] font-black text-xl">
                            {session.studentName[0]}
                          </div>
                          <div>
                            <h3 className="text-[#4A3F33] font-bold text-lg">{session.studentName}</h3>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="flex items-center text-xs text-[#9B8B7E] font-bold">
                                <Clock size={12} className="mr-1" /> {format(new Date(session.scheduledAt), 'MMM d, h:mm a')}
                              </span>
                              <Badge variant="outline" className="text-[10px] uppercase font-black tracking-tighter border-[#E8DFD3] text-[#6B5844]">
                                {session.title}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={`${session.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                              session.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                            } border-none font-bold rounded-lg px-3`}>
                            {session.status}
                          </Badge>
                          <Button size="icon" className="rounded-xl bg-[#F5F0EA] text-[#6B5844] hover:bg-[#6B5844] hover:text-white transition-colors">
                            <Video size={18} />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Profile & Actions */}
          <div className="space-y-8">
            <Card className="bg-[#6B5844] text-white rounded-[40px] shadow-xl border-none overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-2 grid grid-cols-2 gap-4">
                <button
                  onClick={() => router.push('/mentor/sessions')}
                  className="flex flex-col items-center justify-center p-6 bg-white/10 rounded-3xl hover:bg-white/20 transition-all border border-white/10 active:scale-95"
                >
                  <Plus size={24} className="mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Schedule</span>
                </button>
                <button
                  onClick={() => router.push('/mentor/students')}
                  className="flex flex-col items-center justify-center p-6 bg-white/10 rounded-3xl hover:bg-white/20 transition-all border border-white/10 active:scale-95"
                >
                  <Users size={24} className="mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Students</span>
                </button>
                <button
                  onClick={() => router.push('/mentor/messages')}
                  className="flex flex-col items-center justify-center p-6 bg-white/10 rounded-3xl hover:bg-white/20 transition-all border border-white/10 active:scale-95"
                >
                  <MessageSquare size={24} className="mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Chat</span>
                </button>
                <button
                  onClick={() => router.push('/mentor/profile')}
                  className="flex flex-col items-center justify-center p-6 bg-white/10 rounded-3xl hover:bg-white/20 transition-all border border-white/10 active:scale-95"
                >
                  <Award size={24} className="mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Profile</span>
                </button>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E8DFD3] rounded-[40px] shadow-sm border-none">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black text-[#4A3F33]">Performance</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-2 space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-[#9B8B7E] mb-2">
                    <span>Student Retention</span>
                    <span className="text-[#6B5844]">88%</span>
                  </div>
                  <Progress value={88} className="h-2 bg-[#F5F0EA]" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-[#9B8B7E] mb-2">
                    <span>Session Completion</span>
                    <span className="text-[#6B5844]">96%</span>
                  </div>
                  <Progress value={96} className="h-2 bg-[#F5F0EA]" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
