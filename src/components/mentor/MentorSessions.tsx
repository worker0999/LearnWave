'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Loader2, Check, X, Video, ExternalLink, Clock, Calendar as CalendarIcon } from 'lucide-react'

interface Session {
  id: string
  studentName: string
  date: Date
  time: Date
  duration: number
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled'
  topic: string
  meetingLink?: string
}

export function MentorSessions() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/mentor/sessions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions.map((s: any) => ({
          ...s,
          date: new Date(s.date),
          time: new Date(s.time)
        })))
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
      toast({
        title: 'Error',
        description: 'Failed to load sessions.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  const handleStatusUpdate = async (sessionId: string, status: string) => {
    setActionLoading(sessionId)
    try {
      const response = await fetch('/api/mentor/sessions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          sessionId,
          status,
          meetingLink: status === 'confirmed' ? `https://meet.google.com/${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}` : null
        })
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Session ${status.toLowerCase()} successfully.`
        })
        fetchSessions()
      } else {
        throw new Error('Update failed')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update session status.',
        variant: 'destructive'
      })
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: Session['status']) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Confirmed</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none font-bold">Pending Approval</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Rejected</Badge>
      case 'completed':
        return <Badge className="bg-[#B6D9E0]/50 text-[#335765] hover:bg-[#B6D9E0]/50 border-none">Completed</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-none capitalize">{status}</Badge>
    }
  }

  const filteredSessions = sessions.filter(s =>
    selectedDate ? format(s.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') : true
  )

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-black text-[#335765] tracking-tight mb-2">My Schedule</h1>
        <p className="text-[#74A8A4] font-medium">Manage student bookings and approve mentorship requests.</p>
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Calendar Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-white border-[#B6D9E0] shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-[#DBE2DC] border-b border-[#B6D9E0]">
              <CardTitle className="text-[#335765] text-lg font-bold">Select Date</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex justify-center">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-xl"
              />
            </CardContent>
          </Card>

          <div className="bg-[#335765] rounded-3xl p-6 text-white shadow-lg">
            <h4 className="text-sm font-black uppercase tracking-widest opacity-60 mb-4">Quick Stats</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-3xl font-black">{sessions.filter(s => s.status === 'pending').length}</p>
                <p className="text-[10px] font-bold uppercase opacity-60">Pending</p>
              </div>
              <div>
                <p className="text-3xl font-black">{sessions.filter(s => s.status === 'confirmed').length}</p>
                <p className="text-[10px] font-bold uppercase opacity-60">Confirmed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="lg:col-span-8">
          <Card className="bg-white border-[#B6D9E0] shadow-sm rounded-3xl overflow-hidden min-h-[500px]">
            <CardHeader className="flex flex-row items-center justify-between border-b border-[#B6D9E0] bg-[#DBE2DC]/30">
              <CardTitle className="text-[#335765] text-lg font-bold">
                Sessions for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'All Dates'}
              </CardTitle>
              <Badge variant="outline" className="border-[#335765] text-[#335765] font-bold">
                {filteredSessions.length} sessions
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-[#74A8A4]">
                  <Loader2 className="h-10 w-10 animate-spin mb-4" />
                  <p className="font-medium">Fetching your schedule...</p>
                </div>
              ) : filteredSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-[#74A8A4]">
                  <div className="w-20 h-20 bg-[#DBE2DC] rounded-full flex items-center justify-center mb-4">
                    <CalendarIcon className="h-8 w-8 text-[#B6D9E0]" />
                  </div>
                  <p className="font-medium text-lg">No sessions scheduled for this day.</p>
                  <p className="text-sm">Enjoy your time off!</p>
                </div>
              ) : (
                <>
                  {/* Mobile Card Layout */}
                  <div className="md:hidden space-y-4 p-4">
                    {filteredSessions.map((session) => (
                      <div key={session.id} className="bg-[#DBE2DC]/10 border border-[#B6D9E0] rounded-2xl p-4 space-y-3 shadow-sm hover:border-[#335765] transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#B6D9E0] flex items-center justify-center text-[#335765] font-bold text-xs">
                              {session.studentName[0]}
                            </div>
                            <span className="font-bold text-sm text-[#335765]">{session.studentName}</span>
                          </div>
                          {getStatusBadge(session.status)}
                        </div>
                        <div className="text-xs text-[#74A8A4] font-medium space-y-1">
                          <div className="flex items-center gap-2 font-bold text-[#335765]">
                            <Clock size={12} />
                            {format(session.time, 'hh:mm a')}
                          </div>
                          <div className="line-clamp-2 pl-4 text-xs font-semibold text-[#335765]">
                            {session.topic}
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2 border-t border-[#B6D9E0]/50">
                          {session.status === 'pending' ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-8 px-3 rounded-lg text-xs"
                                onClick={() => handleStatusUpdate(session.id, 'rejected')}
                                disabled={actionLoading === session.id}
                              >
                                {actionLoading === session.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <X size={14} />}
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white h-8 px-3 rounded-lg text-xs font-bold"
                                onClick={() => handleStatusUpdate(session.id, 'confirmed')}
                                disabled={actionLoading === session.id}
                              >
                                {actionLoading === session.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check size={14} className="mr-1" />}
                                Approve
                              </Button>
                            </>
                          ) : session.status === 'confirmed' ? (
                            <Button
                              size="sm"
                              className="bg-[#335765] hover:bg-[#7F543D] text-white h-8 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 w-full justify-center shadow-md"
                              onClick={() => session.meetingLink && window.open(session.meetingLink, '_blank')}
                            >
                              <Video size={14} />
                              Join Meeting
                            </Button>
                          ) : (
                            <span className="text-[10px] text-[#B6D9E0] font-bold uppercase italic">No actions</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table Layout */}
                  <div className="hidden md:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-[#B6D9E0] hover:bg-transparent">
                          <TableHead className="text-[#74A8A4] uppercase font-black text-[10px] tracking-widest pl-6">Student</TableHead>
                          <TableHead className="text-[#74A8A4] uppercase font-black text-[10px] tracking-widest">Time & Topic</TableHead>
                          <TableHead className="text-[#74A8A4] uppercase font-black text-[10px] tracking-widest text-center">Status</TableHead>
                          <TableHead className="text-[#74A8A4] uppercase font-black text-[10px] tracking-widest text-right pr-6">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSessions.map((session) => (
                          <TableRow key={session.id} className="border-b border-[#DBE2DC] last:border-0 hover:bg-white transition-colors">
                            <TableCell className="pl-6 py-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#B6D9E0] flex items-center justify-center text-[#335765] font-bold text-sm">
                                  {session.studentName[0]}
                                </div>
                                <span className="font-bold text-[#335765]">{session.studentName}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-[#335765] font-bold text-sm">
                                  <Clock size={14} className="text-[#335765]" />
                                  {format(session.time, 'hh:mm a')}
                                </div>
                                <div className="text-xs text-[#74A8A4] font-medium uppercase tracking-tight line-clamp-1 max-w-[150px]">
                                  {session.topic}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {getStatusBadge(session.status)}
                            </TableCell>
                            <TableCell className="pr-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {session.status === 'pending' ? (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-9 px-3 rounded-xl transition-all"
                                      onClick={() => handleStatusUpdate(session.id, 'rejected')}
                                      disabled={actionLoading === session.id}
                                    >
                                      {actionLoading === session.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X size={16} />}
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white h-9 px-4 rounded-xl shadow-md transition-all font-bold"
                                      onClick={() => handleStatusUpdate(session.id, 'confirmed')}
                                      disabled={actionLoading === session.id}
                                    >
                                      {actionLoading === session.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check size={16} className="mr-2" />}
                                      Approve
                                    </Button>
                                  </>
                                ) : session.status === 'confirmed' ? (
                                  <Button
                                    size="sm"
                                    className="bg-[#335765] hover:bg-[#7F543D] text-white h-9 px-4 rounded-xl shadow-md transition-all font-bold flex items-center gap-2"
                                    onClick={() => session.meetingLink && window.open(session.meetingLink, '_blank')}
                                  >
                                    <Video size={16} />
                                    Join
                                  </Button>
                                ) : (
                                  <span className="text-xs text-[#B6D9E0] font-bold uppercase italic">No actions</span>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
