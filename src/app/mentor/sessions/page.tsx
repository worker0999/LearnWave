'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

interface Session {
  id: string
  studentName: string
  date: string
  time: string
  duration: number
  status: 'scheduled' | 'completed' | 'cancelled'
  topic?: string
}

export default function MentorSessions() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    // TODO: Fetch actual sessions from API
    setSessions([
      {
        id: '1',
        studentName: 'John Doe',
        date: '2023-11-09',
        time: '10:00 AM',
        duration: 60,
        status: 'scheduled',
        topic: 'Data Structures'
      },
      {
        id: '2',
        studentName: 'Jane Smith',
        date: '2023-11-09',
        time: '2:00 PM',
        duration: 45,
        status: 'completed',
        topic: 'Algorithms'
      }
    ])
  }, [])

  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500'
      case 'completed':
        return 'bg-green-500'
      case 'cancelled':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const handleJoin = (session: Session) => {
    if (session.status !== 'scheduled') {
      toast({
        title: 'Cannot join',
        description: 'Only scheduled sessions can be joined.',
      })
      return
    }

    toast({
      title: 'Joining session',
      description: `Joining ${session.studentName}'s session...`,
    })
  }

  return (
    <DashboardLayout userRole="MENTOR">
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Sessions</h1>
          <p className="text-purple-200">Manage and join your scheduled sessions</p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Calendar */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border border-white/20 bg-white/5 text-white"
              />
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-white/20 bg-white/5">
                      <TableHead className="text-purple-200">Student</TableHead>
                      <TableHead className="text-purple-200">Date & Time</TableHead>
                      <TableHead className="text-purple-200">Duration</TableHead>
                      <TableHead className="text-purple-200">Status</TableHead>
                      <TableHead className="text-purple-200">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions.map((session) => (
                      <TableRow
                        key={session.id}
                        className="border-b border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <TableCell className="text-white font-medium">
                          {session.studentName}
                        </TableCell>
                        <TableCell className="text-purple-200">
                          {session.date} <br />
                          {session.time}
                        </TableCell>
                        <TableCell className="text-purple-200">
                          {session.duration} mins
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(session.status)} text-white`}>
                            {session.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            className={`${
                              session.status === 'scheduled'
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-gray-500/40 cursor-not-allowed'
                            }`}
                            onClick={() => handleJoin(session)}
                            disabled={session.status !== 'scheduled'}
                          >
                            Join
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {sessions.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-purple-200 py-6"
                        >
                          No sessions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
