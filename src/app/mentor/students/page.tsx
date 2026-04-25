'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Search, Mail, User, Calendar, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'

interface Student {
  id: string
  name: string
  email: string
  totalSessions: number
  lastSession: string
  status: 'active' | 'inactive'
}

export default function MentorStudents() {
  const router = useRouter()
  const { toast } = useToast()
  const { token } = useAuth()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/mentor/students', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setStudents(data.students || [])
        } else {
          toast({
            title: 'Error',
            description: 'Failed to fetch student data.',
            variant: 'destructive'
          })
        }
      } catch (error) {
        console.error('Error fetching students:', error)
        toast({
          title: 'Error',
          description: 'Network error occurred.',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [toast])

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout userRole="MENTOR">
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#4A3F33] tracking-tight">My Students</h1>
            <p className="text-[#9B8B7E] font-medium mt-1">Manage and connect with students who have booked your sessions.</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9B8B7E]" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-white border-[#E8DFD3] rounded-2xl shadow-sm focus:ring-[#6B5844] focus:border-[#6B5844]"
            />
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-[#6B5844] text-white border-none rounded-[32px] shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Total Students</p>
                  <p className="text-3xl font-black">{students.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E8DFD3] rounded-[32px] shadow-sm">
            <CardContent className="p-8 text-[#4A3F33]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#F5F0EA] rounded-2xl">
                  <Calendar className="h-6 w-6 text-[#6B5844]" />
                </div>
                <div>
                  <p className="text-[#9B8B7E] text-xs font-bold uppercase tracking-widest">Active Bookings</p>
                  <p className="text-3xl font-black">
                    {students.reduce((acc, curr) => acc + curr.totalSessions, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students Table */}
        <Card className="bg-white border-[#E8DFD3] rounded-[32px] shadow-sm overflow-hidden min-h-[400px]">
          <CardHeader className="border-b border-[#F5F0EA] bg-[#F8F3EE]/30 p-8">
            <CardTitle className="text-xl font-bold text-[#4A3F33]">Student Roster</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-[#9B8B7E]">
                <Loader2 className="h-10 w-10 animate-spin mb-4" />
                <p className="font-bold">Syncing your student base...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-[#9B8B7E]">
                <div className="w-20 h-20 bg-[#F5F0EA] rounded-full flex items-center justify-center mb-4">
                  <User className="h-8 w-8 text-[#D4C4B0]" />
                </div>
                <p className="font-bold text-lg">No students found.</p>
                <p className="text-sm">They haven't discovered your great teaching yet!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F8F3EE]/50 text-left border-b border-[#F5F0EA]">
                      <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-[#9B8B7E]">Student</th>
                      <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-[#9B8B7E]">Total Sessions</th>
                      <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-[#9B8B7E]">Last Booking</th>
                      <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-[#9B8B7E]">Status</th>
                      <th className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-[#9B8B7E] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="border-b border-[#F5F0EA] last:border-0 hover:bg-[#FDFBF9] transition-colors group">
                        <td className="py-6 px-8">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#E8DFD3] flex items-center justify-center text-[#6B5844] font-black text-lg border-2 border-white shadow-sm">
                              {student.name[0]}
                            </div>
                            <div>
                              <p className="font-bold text-[#4A3F33] text-base">{student.name}</p>
                              <p className="text-[#9B8B7E] text-xs font-medium">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 px-8">
                          <div className="flex items-center gap-2 font-black text-[#4A3F33]">
                            <span className="w-8 h-8 rounded-lg bg-[#F5F0EA] flex items-center justify-center text-xs">
                              {student.totalSessions}
                            </span>
                          </div>
                        </td>
                        <td className="py-6 px-8">
                          <p className="text-sm font-bold text-[#6B5844]">
                            {format(new Date(student.lastSession), 'MMM d, yyyy')}
                          </p>
                          <p className="text-[10px] text-[#9B8B7E] font-bold uppercase">Scheduled</p>
                        </td>
                        <td className="py-6 px-8">
                          <span className="inline-flex items-center px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-green-100 text-green-700">
                            Active Student
                          </span>
                        </td>
                        <td className="py-6 px-8 text-right">
                          <div className="flex items-center justify-end gap-2 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            <Button
                              size="sm"
                              className="bg-[#6B5844] hover:bg-[#4A3F33] text-white rounded-xl px-4 font-bold flex items-center gap-2 h-10 shadow-md"
                              onClick={async () => {
                                try {
                                  // Initialize room first
                                  await fetch('/api/messages/init', {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      'Authorization': `Bearer ${token}`
                                    },
                                    body: JSON.stringify({ targetUserId: student.id })
                                  })
                                  localStorage.setItem('initialChatUserId', student.id)
                                  router.push('/mentor/messages')
                                } catch (error) {
                                  toast({ title: 'Error', description: 'Failed to start chat.', variant: 'destructive' })
                                }
                              }}
                            >
                              <Mail size={14} />
                              Message Student
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
