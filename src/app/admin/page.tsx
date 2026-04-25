'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import {
    Users,
    IndianRupee,
    Clock,
    RefreshCw,
    TrendingUp,
    Award,
    ChevronRight
} from 'lucide-react'
import Link from 'next/link'

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
        totalRevenue: number
    }
}

interface User {
    id: string
    name: string
    email: string
    role: string
    createdAt: string
    mentorProfile?: {
        approved: boolean
        expertise?: string[]
    }
}

export default function AdminDashboard() {
    const { user } = useAuth()
    const { toast } = useToast()
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
    const [pendingMentors, setPendingMentors] = useState<User[]>([])
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
                setPendingMentors(data.users.filter((u: User) => u.mentorProfile && !u.mentorProfile.approved))
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
        <DashboardLayout userRole="ADMIN">
            <div className="p-8 space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-[#4A3F33]">Welcome, {user?.name || 'Admin'}</h1>
                        <p className="text-[#9B8B7E]">Here's what's happening on LearnWave today.</p>
                    </div>
                    <Button onClick={fetchData} variant="outline" className="border-[#E8DFD3] text-[#6B5844]">
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Users" value={analytics?.overview.totalUsers || 0} icon={<Users />} link="/admin/users" />
                    <StatCard title="Total Revenue" value={`₹${analytics?.sessions.totalRevenue.toLocaleString() || 0}`} icon={<IndianRupee />} link="/admin/analytics" />
                    <StatCard title="Pending Mentors" value={analytics?.overview.pendingMentors || 0} icon={<Clock />} link="/admin/mentors" />
                    <StatCard title="Total Students" value={analytics?.overview.totalStudents || 0} icon={<Award />} link="/admin/users" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Pending Approvals Table */}
                    <Card className="lg:col-span-2 bg-white border-[#E8DFD3]">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-[#4A3F33]">New Mentor Applications</CardTitle>
                                <CardDescription>Awaiting your review and approval</CardDescription>
                            </div>
                            <Link href="/admin/mentors">
                                <Button variant="ghost" className="text-[#6B5844]">View All <ChevronRight size={16} /></Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {pendingMentors.length === 0 ? (
                                <div className="text-center py-8 text-[#9B8B7E]">No pending applications.</div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-[#E8DFD3]">
                                            <TableHead>Mentor</TableHead>
                                            <TableHead>Applied</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pendingMentors.slice(0, 5).map(mentor => (
                                            <TableRow key={mentor.id} className="border-[#E8DFD3]">
                                                <TableCell className="font-medium">{mentor.name}</TableCell>
                                                <TableCell className="text-[#9B8B7E] text-sm">{new Date(mentor.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell className="text-right">
                                                    <Link href="/admin/mentors">
                                                        <Button size="sm" className="bg-[#6B5844] hover:bg-[#4A3F33] text-white">Review</Button>
                                                    </Link>
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
                        <Card className="bg-white border-[#E8DFD3]">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-[#4A3F33]">System Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <StatusItem label="API Status" status="Healthy" color="bg-green-500" />
                                <StatusItem label="Database" status="Operational" color="bg-green-500" />
                                <StatusItem label="Storage" status="92% Free" color="bg-green-500" />
                            </CardContent>
                        </Card>

                        <Link href="/admin/announcements" className="block">
                            <Card className="bg-[#6B5844] border-none text-white hover:bg-[#4A3F33] transition-colors cursor-pointer">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <TrendingUp className="w-5 h-5" />
                                        New Announcement
                                    </CardTitle>
                                    <CardDescription className="text-white/80">Broadcast an update to all platform users.</CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

function StatCard({ title, value, icon, link }: any) {
    return (
        <Link href={link}>
            <Card className="bg-white border-[#E8DFD3] hover:shadow-md transition-all cursor-pointer group">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium text-[#9B8B7E] group-hover:text-[#6B5844] transition-colors">{title}</CardTitle>
                    <div className="p-2 bg-[#F5F0EA] rounded-lg text-[#6B5844]">{icon}</div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-[#4A3F33]">{value}</div>
                </CardContent>
            </Card>
        </Link>
    )
}

function StatusItem({ label, status, color }: any) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-[#6B5844]">{label}</span>
            <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${color}`}></span>
                <span className="text-xs font-medium text-[#9B8B7E]">{status}</span>
            </div>
        </div>
    )
}
