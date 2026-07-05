'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import {
  Users,
  Calendar,
  DollarSign,
  Star,
  Clock,
  TrendingUp,
  MessageSquare,
  Award,
  Plus,
  RefreshCw,
  ArrowUpRight,
  ChevronRight,
  BookOpen
} from 'lucide-react'
import { format } from 'date-fns'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

interface MentorDashboardProps {
  onNavigate: (page: string) => void
}

export function MentorDashboard({ onNavigate }: MentorDashboardProps) {
  const { user, token } = useAuth()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [heatmapData, setHeatmapData] = useState<any[]>([])

  useEffect(() => {
    // Generate static mockup heatmap data
    const cols: { level: number }[][] = []
    for (let col = 0; col < 26; col++) {
      const days: { level: number }[] = []
      for (let d = 0; d < 7; d++) {
        let level = 0
        const rand = Math.random()
        if (rand > 0.85) level = 4
        else if (rand > 0.65) level = 3
        else if (rand > 0.45) level = 2
        else if (rand > 0.2) level = 1
        days.push({ level })
      }
      cols.push(days)
    }
    setHeatmapData(cols)
  }, [])

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

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-10 h-10 text-[#5C59E8] animate-spin mb-4" />
        <p className="text-[#335765] text-xl font-bold tracking-tight">Syncing your analytical board...</p>
      </div>
    )
  }

  const mentor = data?.mentorData
  const recentSessions = data?.recentSessions || []

  // Mock engagement chart data
  const engagementData = [
    { name: 'Mon', value: 4 },
    { name: 'Tue', value: 6 },
    { name: 'Wed', value: 8 },
    { name: 'Thu', value: 5 },
    { name: 'Fri', value: 9 },
    { name: 'Sat', value: 2 },
    { name: 'Sun', value: 3 }
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 md:px-8 py-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1E1B4B] tracking-tight">
            Your Analytical Board
          </h1>
          <p className="text-[#8E93B0] font-medium mt-1">
            Track student progress, session bookings, and learning resources.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-[#DDE3EA] hover:bg-white/80 text-[#1E1B4B] font-bold rounded-xl px-5"
            onClick={fetchDashboardData}
          >
            <RefreshCw className="mr-2 h-4 w-4 text-[#8E93B0]" /> Sync Data
          </Button>
          <Button
            className="bg-[#5C59E8] hover:bg-[#4E4BC6] text-white rounded-xl px-5 font-bold shadow-lg transition-all active:scale-95"
            onClick={() => onNavigate('sessions')}
          >
            <Calendar className="mr-2 h-4 w-4" /> Schedule Session
          </Button>
        </div>
      </div>

      {/* Main Smart User Distribution Gradient Banner */}
      <div className="bg-gradient-to-br from-[#111026] via-[#0D0B1F] to-[#050410] border border-white/5 rounded-[32px] p-8 md:p-10 shadow-2xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#5C59E8]/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
        
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white/90">Smart User Distribution</h2>
            <p className="text-xs text-[#8E93B0] mt-1 max-w-xl">
              Real-time synchronization of your mentorship impact, overall user reach, and aggregated performance indicators.
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 pt-4 border-t border-white/5">
            {[
              { label: 'Total Earnings', value: `$${mentor?.totalEarnings || 0}`, icon: DollarSign },
              { label: 'Total Students', value: mentor?.totalStudents || 0, icon: Users },
              { label: 'Avg Rating', value: mentor?.rating || '4.5', icon: Star },
              { label: 'Total Sessions', value: mentor?.totalSessions || 0, icon: TrendingUp },
              { label: 'Active Hours', value: (mentor?.totalSessions || 0) * 1.5, icon: Clock }
            ].map((stat, i) => (
              <div key={i} className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-between text-[#8E93B0]">
                  <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                  <stat.icon size={14} className="text-[#5C59E8]" />
                </div>
                <div className="text-2xl font-black text-white tracking-tight">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts / Heatmap Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Heatmap Activity Container */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-[#DDE3EA] rounded-[24px] shadow-sm overflow-hidden p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <CardTitle className="text-lg font-black text-[#1E1B4B]">Contributors Activity</CardTitle>
                <CardDescription className="text-xs text-[#8E93B0]">Active contributions in mentoring sessions & chat interactions</CardDescription>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-[#8E93B0]">
                <Badge variant="outline" className="border-[#DDE3EA] bg-slate-50 text-[#1E1B4B] font-bold">Messages</Badge>
                <Badge variant="outline" className="border-[#DDE3EA] text-[#8E93B0]">Meetings</Badge>
              </div>
            </div>

            {/* Heatmap Grid */}
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#8E93B0] px-6">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((m, i) => (
                  <span key={i}>{m}</span>
                ))}
              </div>
              <div className="flex gap-1.5 justify-between overflow-x-auto pb-2">
                {/* Heatmap Grid of Squares */}
                {heatmapData.map((col, cIdx) => (
                  <div key={cIdx} className="flex flex-col gap-1.5 flex-shrink-0">
                    {col.map((day: any, dIdx: number) => {
                      let color = 'bg-[#F4F6F8]'
                      if (day.level === 1) color = 'bg-[#5C59E8]/20'
                      else if (day.level === 2) color = 'bg-[#5C59E8]/40'
                      else if (day.level === 3) color = 'bg-[#5C59E8]/70'
                      else if (day.level === 4) color = 'bg-[#5C59E8]'
                      return (
                        <div
                          key={dIdx}
                          className={`w-3.5 h-3.5 rounded-[3px] transition-all hover:scale-125 ${color}`}
                          title={`Activity Level: ${day.level}`}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-end gap-1.5 text-xs text-[#8E93B0] font-bold pt-2 border-t border-[#F4F6F8]">
                <span>Less</span>
                <div className="w-3 h-3 rounded-[2px] bg-[#F4F6F8]" />
                <div className="w-3 h-3 rounded-[2px] bg-[#5C59E8]/20" />
                <div className="w-3 h-3 rounded-[2px] bg-[#5C59E8]/40" />
                <div className="w-3 h-3 rounded-[2px] bg-[#5C59E8]/70" />
                <div className="w-3 h-3 rounded-[2px] bg-[#5C59E8]" />
                <span>More</span>
              </div>
            </div>
          </Card>
        </div>

        {/* User Engagements Recharts Card */}
        <div>
          <Card className="bg-white border-[#DDE3EA] rounded-[24px] shadow-sm overflow-hidden p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <CardTitle className="text-lg font-black text-[#1E1B4B]">User Engagements</CardTitle>
                  <CardDescription className="text-xs text-[#8E93B0]">Daily booking distribution</CardDescription>
                </div>
                <Badge variant="outline" className="border-[#DDE3EA] text-[#5C59E8] font-bold uppercase text-[9px] tracking-widest bg-[#5C59E8]/5">Mentees</Badge>
              </div>

              {/* Bar Chart */}
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F4F6F8" vertical={false} />
                    <XAxis dataKey="name" stroke="#8E93B0" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <YAxis hide />
                    <Tooltip
                      cursor={{ fill: 'rgba(92, 89, 232, 0.05)', radius: 6 }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    />
                    <Bar dataKey="value" fill="#5C59E8" radius={[6, 6, 0, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex justify-between text-xs pt-4 border-t border-[#F4F6F8] font-black text-[#1E1B4B]">
              <div className="flex flex-col">
                <span className="text-[#8E93B0] font-bold uppercase text-[9px]">Returning</span>
                <span>94%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[#8E93B0] font-bold uppercase text-[9px]">Seat Duration</span>
                <span>76%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* User Insight / Roster Table */}
      <Card className="bg-white border-[#DDE3EA] rounded-[28px] shadow-sm overflow-hidden">
        <CardHeader className="p-8 border-b border-[#F4F6F8] flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-xl font-black text-[#1E1B4B]">User Insight</CardTitle>
            <CardDescription className="text-xs text-[#8E93B0]">Consolidated analysis of students assigned or currently booking sessions</CardDescription>
          </div>
          <Button
            variant="ghost"
            className="text-[#5C59E8] font-bold flex items-center gap-1 hover:bg-[#5C59E8]/5 rounded-xl h-10 px-4"
            onClick={() => onNavigate('students')}
          >
            Manage Students <ChevronRight size={16} />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-[#F4F6F8] text-left">
                  <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-[#8E93B0]">Name</th>
                  <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-[#8E93B0]">Role / Contact</th>
                  <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-[#8E93B0] text-center">Status</th>
                  <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-[#8E93B0] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-[#8E93B0] font-semibold text-sm">
                      No student insights compiled yet. New bookings will initialize data records.
                    </td>
                  </tr>
                ) : (
                  recentSessions.map((session: any) => (
                    <tr key={session.id} className="border-b border-[#F4F6F8] last:border-0 hover:bg-slate-50/50 transition-colors group">
                      <td className="py-5 px-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#5C59E8]/10 text-[#5C59E8] flex items-center justify-center font-black text-sm border border-[#5C59E8]/5">
                            {session.studentName[0]}
                          </div>
                          <div>
                            <p className="font-bold text-[#1E1B4B] text-sm">{session.studentName}</p>
                            <p className="text-[10px] text-[#8E93B0] font-medium">Student account</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-8">
                        <p className="text-sm font-bold text-[#1E1B4B]">Scheduled Session</p>
                        <p className="text-[10px] text-[#8E93B0] font-medium">{format(new Date(session.scheduledAt), 'MMM d, h:mm a')}</p>
                      </td>
                      <td className="py-5 px-8 text-center">
                        <Badge className={`${session.status === 'CONFIRMED' ? 'bg-[#5C59E8]/10 text-[#5C59E8]' :
                            session.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-50 text-red-600'
                          } border-none font-bold rounded-lg px-2.5 py-1 text-[10px]`}>
                          {session.status}
                        </Badge>
                      </td>
                      <td className="py-5 px-8 text-right">
                        <Button
                          size="sm"
                          className="bg-[#F4F6F8] hover:bg-[#5C59E8] hover:text-white text-[#1E1B4B] rounded-xl px-4 font-bold h-9 transition-all"
                          onClick={() => onNavigate('messages')}
                        >
                          <MessageSquare size={14} className="mr-1.5" /> Message
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
