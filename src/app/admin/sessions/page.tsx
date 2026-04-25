'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { Loader2, Video, Search, ExternalLink, Calendar, User, UserCheck, Settings as SettingsIcon } from 'lucide-react'

interface Session {
    id: string
    studentName: string
    mentorName: string
    topic: string
    scheduledAt: string
    status: string
    meetingLink: string | null
    price: number
}

export default function AdminSessionsPage() {
    const [sessions, setSessions] = useState<Session[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [updatingId, setUpdatingId] = useState<string | null>(null)
    const [newLinks, setNewLinks] = useState<{ [key: string]: string }>({})
    const { toast } = useToast()

    const fetchSessions = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('/api/admin/sessions', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setSessions(data.sessions)
            }
        } catch (error) {
            console.error('Error fetching sessions:', error)
            toast({
                title: "Error",
                description: "Failed to load sessions",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSessions()
    }, [])

    const handleUpdateLink = async (sessionId: string) => {
        const link = newLinks[sessionId]
        if (!link) return

        setUpdatingId(sessionId)
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('/api/admin/sessions', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ sessionId, meetingLink: link })
            })

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Meeting link updated successfully"
                })
                fetchSessions()
                setNewLinks(prev => {
                    const next = { ...prev }
                    delete next[sessionId]
                    return next
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update link",
                variant: "destructive"
            })
        } finally {
            setUpdatingId(null)
        }
    }

    const filteredSessions = sessions.filter(s =>
        s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.mentorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.topic.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getStatusBadge = (status: string) => {
        const s = status.toLowerCase()
        switch (s) {
            case 'confirmed': return <Badge className="bg-green-100 text-green-700 border-none">Confirmed</Badge>
            case 'pending': return <Badge className="bg-yellow-100 text-yellow-700 border-none">Pending</Badge>
            case 'cancelled': return <Badge className="bg-red-100 text-red-700 border-none">Cancelled</Badge>
            case 'completed': return <Badge className="bg-blue-100 text-blue-700 border-none">Completed</Badge>
            default: return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <DashboardLayout userRole="ADMIN">
            <div className="p-8 space-y-8 max-w-7xl mx-auto">
                <div>
                    <h1 className="text-4xl font-black text-[#4A3F33] tracking-tight mb-2">Platform Sessions</h1>
                    <p className="text-[#9B8B7E] font-medium">Monitor and manage all mentorship meetings across the platform.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9B8B7E]" />
                        <Input
                            placeholder="Search by student, mentor or topic..."
                            className="pl-10 bg-white border-[#E8DFD3] rounded-2xl h-12 focus-visible:ring-[#6B5844]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Card className="bg-white border-[#E8DFD3] shadow-sm rounded-3xl overflow-hidden border-2">
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-24 text-[#9B8B7E]">
                                <Loader2 className="h-10 w-10 animate-spin mb-4" />
                                <p className="font-medium">Loading session data...</p>
                            </div>
                        ) : filteredSessions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-[#9B8B7E]">
                                <Calendar className="h-12 w-12 mb-4 opacity-20" />
                                <p className="font-medium">No sessions found.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-[#F8F3EE]/50">
                                        <TableRow className="border-b border-[#E8DFD3]">
                                            <TableHead className="text-[#4A3F33] font-bold py-4 pl-6">Pairing</TableHead>
                                            <TableHead className="text-[#4A3F33] font-bold">Session Details</TableHead>
                                            <TableHead className="text-[#4A3F33] font-bold">Status</TableHead>
                                            <TableHead className="text-[#4A3F33] font-bold pr-6">Meeting Link Management</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredSessions.map((session) => (
                                            <TableRow key={session.id} className="border-b border-[#F5F0EA] last:border-0 hover:bg-[#FDFBF9]">
                                                <TableCell className="pl-6 py-6 font-medium">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-3 w-3 text-[#6B5844]" />
                                                            <span className="text-xs text-[#9B8B7E] uppercase font-bold tracking-wider">Student:</span>
                                                        </div>
                                                        <p className="text-[#4A3F33] font-bold mb-2">{session.studentName}</p>
                                                        <div className="flex items-center gap-2">
                                                            <UserCheck className="h-3 w-3 text-[#6B5844]" />
                                                            <span className="text-xs text-[#9B8B7E] uppercase font-bold tracking-wider">Mentor:</span>
                                                        </div>
                                                        <p className="text-[#4A3F33] font-bold">{session.mentorName}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <p className="font-bold text-[#4A3F33]">{session.topic}</p>
                                                        <p className="text-sm text-[#9B8B7E]">
                                                            {format(new Date(session.scheduledAt), 'PPP')} @ {format(new Date(session.scheduledAt), 'p')}
                                                        </p>
                                                        <p className="text-xs font-bold text-[#6B5844]">₹{Number(session.price).toFixed(2)}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(session.status)}
                                                </TableCell>
                                                <TableCell className="pr-6">
                                                    <div className="flex flex-col gap-3">
                                                        {session.meetingLink ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex-1 bg-[#F5F0EA] px-3 py-2 rounded-xl text-xs font-medium text-[#6B5844] truncate border border-[#E8DFD3]">
                                                                    {session.meetingLink}
                                                                </div>
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="h-8 w-8 hover:bg-[#E8DFD3]"
                                                                    onClick={() => window.open(session.meetingLink!, '_blank')}
                                                                >
                                                                    <ExternalLink size={14} className="text-[#6B5844]" />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs italic text-[#9B8B7E]">No link active</span>
                                                        )}

                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                placeholder="Paste Google Meet link..."
                                                                className="text-xs h-9 bg-[#FDFBF9] border-[#E8DFD3] rounded-xl"
                                                                value={newLinks[session.id] || ''}
                                                                onChange={(e) => setNewLinks(prev => ({ ...prev, [session.id]: e.target.value }))}
                                                            />
                                                            <Button
                                                                size="sm"
                                                                className="bg-[#6B5844] hover:bg-[#4A3F33] text-white h-9 rounded-xl whitespace-nowrap font-bold"
                                                                disabled={!newLinks[session.id] || updatingId === session.id}
                                                                onClick={() => handleUpdateLink(session.id)}
                                                            >
                                                                {updatingId === session.id ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Video size={14} className="mr-2" />}
                                                                {session.meetingLink ? 'Update' : 'Allocate'}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
