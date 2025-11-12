'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Search } from 'lucide-react'

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
  const [students, setStudents] = useState<Student[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // TODO: Fetch actual students from API
    setStudents([
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        totalSessions: 5,
        lastSession: '2023-11-01',
        status: 'active'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        totalSessions: 3,
        lastSession: '2023-10-28',
        status: 'inactive'
      }
    ])
  }, [])

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout userRole="MENTOR">
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-white">Students</h1>
            <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg border border-white/20">
              <Search className="w-5 h-5 text-gray-300" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-white border-none focus-visible:ring-0"
              />
            </div>
          </div>

          {/* Students Table */}
          <Card className="backdrop-blur-md bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Your Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/20 bg-white/5">
                      <th className="py-3 px-4 text-left text-purple-200">Name</th>
                      <th className="py-3 px-4 text-left text-purple-200">Email</th>
                      <th className="py-3 px-4 text-left text-purple-200">Total Sessions</th>
                      <th className="py-3 px-4 text-left text-purple-200">Last Session</th>
                      <th className="py-3 px-4 text-left text-purple-200">Status</th>
                      <th className="py-3 px-4 text-left text-purple-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 text-white">{student.name}</td>
                        <td className="py-3 px-4 text-purple-200">{student.email}</td>
                        <td className="py-3 px-4 text-purple-200">{student.totalSessions}</td>
                        <td className="py-3 px-4 text-purple-200">{student.lastSession}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              student.status === 'active'
                                ? 'bg-green-500/20 text-green-300'
                                : 'bg-gray-500/20 text-gray-300'
                            }`}
                          >
                            {student.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600"
                              onClick={() => router.push('/mentor/messages')}
                            >
                              Message
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-purple-400 text-purple-200"
                            >
                              View
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredStudents.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-purple-200">
                          No students found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
