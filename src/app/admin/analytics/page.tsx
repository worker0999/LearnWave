'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuth } from '@/contexts/AuthContext'
import {
  BarChart3,
  Users as UsersIcon,
  UserCheck,
  IndianRupee,
  TrendingUp,
  Activity,
  Award,
  BookOpen
} from 'lucide-react'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts'

interface AnalyticsData {
  overview: {
    totalUsers: number
    totalStudents: number
    totalMentors: number
    pendingMentors: number
    approvedMentors: number
  }
  sessions: {
    totalSessions: number
    completedSessions: number
    totalRevenue: number
  }
  growth: { month: string, count: number }[]
  popularTopics: { topic: string, count: number }[]
  topMentors: {
    id: string
    name: string
    rating: number
    sessions: number
    avatar?: string
  }[]
}

const COLORS = ['#6B5844', '#9B8B7E', '#D4C4B0', '#E8DFD3', '#F5F0EA']

export default function AdminAnalyticsPage() {
  const { user } = useAuth()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('/api/admin/analytics', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const result = await res.json()
          setData(result.analytics)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) return (
    <DashboardLayout userRole="ADMIN">
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-[#6B5844] animate-pulse">Loading analytics...</div>
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout userRole="ADMIN">
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-[#4A3F33]">Platform Analytics</h1>
          <p className="text-[#9B8B7E]">Track platform growth, revenue, and engagement</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Platform Users"
            value={data?.overview.totalUsers || 0}
            icon={<UsersIcon />}
            subtitle={`${data?.overview.totalStudents} Students, ${data?.overview.totalMentors} Mentors`}
          />
          <MetricCard
            title="Total Revenue"
            value={`₹${data?.sessions.totalRevenue.toLocaleString() || 0}`}
            icon={<IndianRupee />}
            subtitle="From completed sessions"
          />
          <MetricCard
            title="Total Bookings"
            value={data?.sessions.totalSessions || 0}
            icon={<Activity />}
            subtitle={`${data?.sessions.completedSessions} completed sessions`}
          />
          <MetricCard
            title="Approved Mentors"
            value={data?.overview.approvedMentors || 0}
            icon={<UserCheck />}
            subtitle={`${data?.overview.pendingMentors} awaiting review`}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white border-[#E8DFD3]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#4A3F33] text-lg">
                <TrendingUp className="w-5 h-5 text-[#6B5844]" />
                User Registration Growth
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.growth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F0EA" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9B8B7E', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9B8B7E', fontSize: 12 }} />
                  <Tooltip
                    cursor={{ fill: '#FDFBF9' }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E8DFD3', boxShadow: 'none' }}
                  />
                  <Bar dataKey="count" fill="#6B5844" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E8DFD3]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#4A3F33] text-lg">
                <BookOpen className="w-5 h-5 text-[#6B5844]" />
                Popular Mentorship Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.popularTopics}
                    dataKey="count"
                    nameKey="topic"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ topic }) => topic}
                  >
                    {data?.popularTopics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8DFD3' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Mentors Table */}
        <Card className="bg-white border-[#E8DFD3]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#4A3F33] text-lg">
              <Award className="w-5 h-5 text-[#6B5844]" />
              Top Performing Mentors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#F5F0EA] text-[#9B8B7E] text-sm">
                    <th className="pb-4 font-medium">Mentor</th>
                    <th className="pb-4 font-medium">Rating</th>
                    <th className="pb-4 font-medium text-right">Total Sessions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F0EA]">
                  {data?.topMentors.map((mentor) => (
                    <tr key={mentor.id} className="group hover:bg-[#FDFBF9] transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#F5F0EA] flex items-center justify-center font-bold text-[#6B5844]">
                            {mentor.name[0]}
                          </div>
                          <span className="font-medium text-[#4A3F33]">{mentor.name}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-1 text-[#6B5844]">
                          <Award size={14} fill="currentColor" />
                          <span className="font-bold">{mentor.rating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <span className="text-[#4A3F33] font-semibold">{mentor.sessions}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

function MetricCard({ title, value, icon, subtitle, trend }: any) {
  return (
    <Card className="bg-white border-[#E8DFD3] hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-[#9B8B7E]">{title}</CardTitle>
        <div className="p-2 bg-[#F5F0EA] rounded-lg text-[#6B5844]">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-[#4A3F33]">{value}</div>
        <p className="text-xs text-[#9B8B7E] mt-1">{subtitle}</p>
        {trend && (
          <div className="mt-4 text-xs font-medium text-green-600 flex items-center gap-1">
            <TrendingUp size={12} /> {trend}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

