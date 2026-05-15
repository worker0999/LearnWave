'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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

interface MentorDashboardProps {
  onNavigate: (page: string) => void
}

export function MentorDashboard({ onNavigate }: MentorDashboardProps) {
  const { user } = useAuth()
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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-10 h-10 text-[#335765] animate-spin mb-4" />
        <p className="text-[#335765] text-xl font-black tracking-tight">Syncing your desk...</p>
      </div>
    )
  }

  const mentor = data?.mentorData
  const recentSessions = data?.recentSessions || []

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#335765] tracking-tighter">
            Welcome, {mentor?.name?.split(' ')[0] || 'Mentor'}!
          </h1>
          <p className="text-[#74A8A4] font-medium font-inter mt-1">Here's what's happening with your students today.</p>
        </div>
        <Button
          className="bg-[#335765] hover:bg-[#7F543D] text-white rounded-2xl px-6 h-12 font-bold shadow-lg transition-all active:scale-95"
          onClick={() => onNavigate('sessions')}
        >
          <Calendar className="mr-2 h-5 w-5" /> View Full Schedule
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Earnings', value: `$${mentor?.totalEarnings || 0}`, icon: DollarSign, color: 'text-[#335765]', bg: 'bg-[#B6D9E0]/30' },
          { label: 'Students', value: mentor?.totalStudents || 0, icon: Users, color: 'text-[#335765]', bg: 'bg-[#B6D9E0]/30' },
          { label: 'Avg Rating', value: mentor?.rating || '4.5', icon: Star, color: 'text-[#335765]', bg: 'bg-[#B6D9E0]/30' },
          { label: 'Total Sessions', value: mentor?.totalSessions || 0, icon: TrendingUp, color: 'text-[#335765]', bg: 'bg-[#B6D9E0]/30' }
        ].map((stat, i) => (
          <Card key={i} className="bg-white border-[#DBE2DC] rounded-[32px] hover:shadow-xl transition-all duration-300 group overflow-hidden shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-colors`}>
                  <stat.icon size={24} />
                </div>
                <ArrowUpRight className="text-[#B6D9E0] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="mt-6">
                <p className="text-3xl font-black text-[#335765] tracking-tight">{stat.value}</p>
                <p className="text-xs font-black uppercase tracking-widest text-[#74A8A4] mt-1">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Sessions Feed */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-white border-[#DBE2DC] rounded-[40px] shadow-sm overflow-hidden border">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-black text-[#335765]">Recent Activity</CardTitle>
                <Button variant="link" className="text-[#335765] font-bold" onClick={() => onNavigate('sessions')}>View All</Button>
              </div>
              <CardDescription className="text-[#74A8A4] font-medium">Your latest student interactions and bookings.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4">
              <div className="space-y-4">
                {recentSessions.length === 0 ? (
                  <div className="text-center py-12 bg-[#DBE2DC]/50 rounded-3xl border-2 border-dashed border-[#B6D9E0]">
                    <Users className="mx-auto h-12 w-12 text-[#74A8A4] mb-4" />
                    <p className="text-[#335765] font-bold">No sessions yet</p>
                    <p className="text-[#74A8A4] text-sm">New bookings will appear here.</p>
                  </div>
                ) : (
                  recentSessions.map((session: any) => (
                    <div key={session.id} className="group p-6 bg-white rounded-3xl border border-[#DBE2DC] hover:border-[#335765] hover:shadow-md transition-all flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#DBE2DC] flex items-center justify-center text-[#335765] font-black text-xl">
                          {session.studentName[0]}
                        </div>
                        <div>
                          <h3 className="text-[#335765] font-bold text-lg">{session.studentName}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center text-xs text-[#74A8A4] font-bold">
                              <Clock size={12} className="mr-1" /> {format(new Date(session.scheduledAt), 'MMM d, h:mm a')}
                            </span>
                            <Badge variant="outline" className="text-[10px] uppercase font-black tracking-tighter border-[#DBE2DC] text-[#335765]">
                              {session.title}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`${session.status === 'CONFIRMED' ? 'bg-[#B6D9E0]/50 text-[#335765]' :
                            session.status === 'PENDING' ? 'bg-[#74A8A4]/30 text-[#335765]' : 'bg-red-100 text-red-700'
                          } border-none font-bold rounded-lg px-3`}>
                          {session.status}
                        </Badge>
                        <Button size="icon" className="rounded-xl bg-[#DBE2DC] text-[#335765] hover:bg-[#335765] hover:text-white transition-colors">
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
          <Card className="bg-[#335765] text-white rounded-[40px] shadow-xl border-none overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-black text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-2 grid grid-cols-2 gap-4">
              <button
                onClick={() => onNavigate('sessions')}
                className="flex flex-col items-center justify-center p-6 bg-white/10 rounded-3xl hover:bg-white/20 transition-all border border-white/10 active:scale-95"
              >
                <Plus size={24} className="mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest">Schedule</span>
              </button>
              <button
                onClick={() => onNavigate('students')}
                className="flex flex-col items-center justify-center p-6 bg-white/10 rounded-3xl hover:bg-white/20 transition-all border border-white/10 active:scale-95"
              >
                <Users size={24} className="mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest">Students</span>
              </button>
              <button
                onClick={() => onNavigate('messages')}
                className="flex flex-col items-center justify-center p-6 bg-white/10 rounded-3xl hover:bg-white/20 transition-all border border-white/10 active:scale-95"
              >
                <MessageSquare size={24} className="mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest">Chat</span>
              </button>
              <button
                onClick={() => onNavigate('profile')}
                className="flex flex-col items-center justify-center p-6 bg-white/10 rounded-3xl hover:bg-white/20 transition-all border border-white/10 active:scale-95"
              >
                <Award size={24} className="mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest">Profile</span>
              </button>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#DBE2DC] rounded-[40px] shadow-sm border">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-black text-[#335765]">Performance</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-2 space-y-6">
              <div>
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-[#74A8A4] mb-2">
                  <span>Student Retention</span>
                  <span className="text-[#335765]">88%</span>
                </div>
                <Progress value={88} className="h-2 bg-[#DBE2DC]" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-[#74A8A4] mb-2">
                  <span>Session Completion</span>
                  <span className="text-[#335765]">96%</span>
                </div>
                <Progress value={96} className="h-2 bg-[#DBE2DC]" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
