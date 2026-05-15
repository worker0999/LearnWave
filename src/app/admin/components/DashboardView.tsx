import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAuth } from '@/contexts/AuthContext'
import {
  Users,
  IndianRupee,
  Clock,
  RefreshCw,
  TrendingUp,
  Award,
  ChevronRight
} from 'lucide-react'

export function DashboardView({ setView }: { setView: (view: string) => void }) {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<any>(null)
  const [pendingMentors, setPendingMentors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const headers = { 'Authorization': `Bearer ${token}` }

      const analRes = await fetch('/api/admin/analytics', { headers })
      if (analRes.ok) {
        const data = await analRes.json()
        setAnalytics(data.analytics)
      }

      const usersRes = await fetch('/api/admin/users?role=MENTOR&limit=100', { headers })
      if (usersRes.ok) {
        const data = await usersRes.json()
        setPendingMentors(data.users.filter((u: any) => u.mentorProfile && !u.mentorProfile.approved))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchData()
  }, [user])

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#42413b] dark:text-[#f4f4f0] tracking-tight">Welcome, {user?.name || 'Admin'}</h1>
          <p className="text-[#a9a29e] mt-1 text-lg">Here's what's happening on LearnWave today.</p>
        </div>
        <Button 
          onClick={fetchData} 
          variant="outline" 
          className="border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0] bg-transparent hover:bg-[#f4f4f0] dark:hover:bg-[#1c1b19]"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={analytics?.overview.totalUsers || 0} 
          icon={<Users className="w-5 h-5 text-[#a9a29e] group-hover:text-[#42413b] dark:group-hover:text-[#f4f4f0] transition-colors" />} 
          onClick={() => setView('users')} 
        />
        <StatCard 
          title="Total Revenue" 
          value={`₹${analytics?.sessions.totalRevenue.toLocaleString() || 0}`} 
          icon={<IndianRupee className="w-5 h-5 text-[#a9a29e] group-hover:text-[#42413b] dark:group-hover:text-[#f4f4f0] transition-colors" />} 
          onClick={() => {}} 
        />
        <StatCard 
          title="Pending Mentors" 
          value={analytics?.overview.pendingMentors || 0} 
          icon={<Clock className="w-5 h-5 text-[#a9a29e] group-hover:text-[#42413b] dark:group-hover:text-[#f4f4f0] transition-colors" />} 
          onClick={() => setView('mentors')} 
        />
        <StatCard 
          title="Total Students" 
          value={analytics?.overview.totalStudents || 0} 
          icon={<Award className="w-5 h-5 text-[#a9a29e] group-hover:text-[#42413b] dark:group-hover:text-[#f4f4f0] transition-colors" />} 
          onClick={() => setView('users')} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Approvals Table */}
        <Card className="lg:col-span-2 bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-[#dfd3c3] dark:border-[#42413b] pb-4 bg-gray-50/50 dark:bg-black/10">
            <div>
              <CardTitle className="text-[#42413b] dark:text-[#f4f4f0]">New Mentor Applications</CardTitle>
              <CardDescription className="text-[#a9a29e]">Awaiting your review and approval</CardDescription>
            </div>
            <Button variant="ghost" className="text-[#a9a29e] hover:text-[#42413b] dark:hover:text-[#f4f4f0]" onClick={() => setView('mentors')}>
              View All <ChevronRight size={16} className="ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {pendingMentors.length === 0 ? (
              <div className="text-center py-12 text-[#a9a29e]">No pending applications.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-[#dfd3c3] dark:border-[#42413b] hover:bg-transparent">
                    <TableHead className="text-[#a9a29e] font-medium">Mentor</TableHead>
                    <TableHead className="text-[#a9a29e] font-medium">Applied</TableHead>
                    <TableHead className="text-right text-[#a9a29e] font-medium">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingMentors.slice(0, 5).map(mentor => (
                    <TableRow key={mentor.id} className="border-[#dfd3c3] dark:border-[#42413b] hover:bg-[#f4f4f0]/50 dark:hover:bg-[#1c1b19]/50 transition-colors">
                      <TableCell className="font-medium text-[#42413b] dark:text-[#f4f4f0]">{mentor.name}</TableCell>
                      <TableCell className="text-[#a9a29e] text-sm">{new Date(mentor.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          onClick={() => setView('mentors')}
                          className="bg-[#c8ced8] hover:bg-[#b5bcc7] text-[#42413b] shadow-sm transform hover:-translate-y-0.5 transition-all active:translate-y-0 dark:bg-[#c8ced8]/90 dark:hover:bg-[#c8ced8]"
                        >
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats Section */}
        <div className="space-y-6">
          <Card className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] shadow-sm rounded-2xl">
            <CardHeader className="pb-3 border-b border-[#dfd3c3]/50 dark:border-[#42413b]/50">
              <CardTitle className="text-sm font-semibold text-[#42413b] dark:text-[#f4f4f0] uppercase tracking-wider">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <StatusItem label="API Status" status="Healthy" color="bg-emerald-500" />
              <StatusItem label="Database" status="Operational" color="bg-emerald-500" />
              <StatusItem label="Storage" status="92% Free" color="bg-emerald-500" />
            </CardContent>
          </Card>

          <div 
            onClick={() => {}} 
            className="block cursor-pointer group"
          >
            <Card className="bg-[#c8ced8] dark:bg-[#42413b] border-none shadow-sm rounded-2xl overflow-hidden relative transition-transform hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2 text-lg text-[#42413b] dark:text-[#f4f4f0]">
                  <TrendingUp className="w-5 h-5" />
                  New Announcement
                </CardTitle>
                <CardDescription className="text-[#42413b]/80 dark:text-[#a9a29e]">
                  Broadcast an update to all platform users.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, onClick }: any) {
  return (
    <div onClick={onClick} className="w-full">
      <Card className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] shadow-sm hover:shadow-md transition-all cursor-pointer group rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-[#a9a29e]">{title}</CardTitle>
          <div className="p-2.5 bg-[#f4f4f0] dark:bg-[#1c1b19] rounded-xl group-hover:bg-[#c8ced8]/20 transition-colors">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-[#42413b] dark:text-[#f4f4f0]">{value}</div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatusItem({ label, status, color }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-[#42413b] dark:text-[#f4f4f0]">{label}</span>
      <div className="flex items-center gap-2 px-2.5 py-1 bg-[#f4f4f0] dark:bg-[#1c1b19] rounded-full">
        <span className={`w-2 h-2 rounded-full ${color}`}></span>
        <span className="text-xs font-semibold text-[#a9a29e]">{status}</span>
      </div>
    </div>
  )
}
