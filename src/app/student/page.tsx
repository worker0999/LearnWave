'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuth } from '@/contexts/AuthContext'
import { FloatingStudyTimer } from '@/components/ui/floating-study-timer'
import { 
  BookOpen, 
  Brain, 
  Users, 
  Calendar,
  Award,
  Clock,
  TrendingUp,
  Target,
  Zap,
  Play,
  Download,
  MessageSquare,
  Star,
  ChevronRight
} from 'lucide-react'

interface StudentData {
  name: string
  email: string
  usn: string
  branch: string
  semester: number
  enrolledSubjects: number
  completedQuizzes: number
  averageScore: number
  studyStreak: number
}

interface Announcement {
  id: string
  title: string
  content: string
  type: string
  createdAt: string
}

interface Subject {
  id: string
  name: string
  code: string
  progress: number
  resources: number
  nextClass?: string
}

export default function StudentDashboard() {
  const { user, isAuthenticated } = useAuth()
  const [studentData, setStudentData] = useState<StudentData | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return
    }

    // Simulate data loading using actual user data
    const mockStudentData: StudentData = {
      name: user.name,
      email: user.email,
      usn: user.usn || '1CS21CS001',
      branch: user.branch || 'Computer Science & Engineering',
      semester: user.semester || 5,
      enrolledSubjects: 6,
      completedQuizzes: 12,
      averageScore: 85,
      studyStreak: 7
    }

    const mockAnnouncements: Announcement[] = [
      {
        id: '1',
        title: 'Mid-Term Examination Schedule',
        content: 'Mid-term exams will start from next Monday. Please check the timetable.',
        type: 'EXAM',
        createdAt: '2024-01-20'
      },
      {
        id: '2',
        title: 'New Study Materials Available',
        content: 'Updated notes for Data Structures are now available in the resource hub.',
        type: 'GENERAL',
        createdAt: '2024-01-19'
      }
    ]

    const mockSubjects: Subject[] = [
      {
        id: '1',
        name: 'Data Structures',
        code: 'CS52',
        progress: 75,
        resources: 45,
        nextClass: 'Today, 2:00 PM'
      },
      {
        id: '2',
        name: 'Algorithm Analysis',
        code: 'CS53',
        progress: 60,
        resources: 38,
        nextClass: 'Tomorrow, 10:00 AM'
      },
      {
        id: '3',
        name: 'Database Management',
        code: 'CS54',
        progress: 85,
        resources: 52,
        nextClass: 'Friday, 11:00 AM'
      }
    ]

    setTimeout(() => {
      setStudentData(mockStudentData)
      setAnnouncements(mockAnnouncements)
      setSubjects(mockSubjects)
      setLoading(false)
    }, 1000)
  }, [isAuthenticated, user])

  if (!isAuthenticated || !user) {
    return (
      <DashboardLayout userRole="STUDENT">
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Please log in to access your dashboard</div>
        </div>
      </DashboardLayout>
    )
  }

  if (loading) {
    return (
      <DashboardLayout userRole="STUDENT">
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    )
  }

  if (!studentData) return null

  return (
    <DashboardLayout userRole="STUDENT">
      {/* Floating Study Timer */}
      <FloatingStudyTimer />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {studentData.name}!</h1>
            <p className="text-purple-200">
              {studentData.usn} • {studentData.branch} • Semester {studentData.semester}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Study Streak</CardTitle>
              <Zap className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{studentData.studyStreak} days</div>
              <p className="text-xs text-purple-300">Keep it up!</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{studentData.averageScore}%</div>
              <p className="text-xs text-purple-300">+5% improvement</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Completed Quizzes</CardTitle>
              <Award className="h-4 w-4 text-purple-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{studentData.completedQuizzes}</div>
              <p className="text-xs text-purple-300">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Enrolled Subjects</CardTitle>
              <BookOpen className="h-4 w-4 text-purple-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{studentData.enrolledSubjects}</div>
              <p className="text-xs text-purple-300">Active courses</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-purple-200">
                  Access your most used features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/student/ai-assistant">
                    <Button className="w-full h-20 flex flex-col space-y-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105">
                      <Brain className="w-6 h-6" />
                      <span className="text-xs">AI Assistant</span>
                      <Badge className="text-xs bg-yellow-500 text-white">New</Badge>
                    </Button>
                  </Link>
                  <Link href="/student/resources">
                    <Button className="w-full h-20 flex flex-col space-y-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105">
                      <BookOpen className="w-6 h-6" />
                      <span className="text-xs">Resources</span>
                    </Button>
                  </Link>
                  <Link href="/student/mentors">
                    <Button className="w-full h-20 flex flex-col space-y-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105">
                      <Users className="w-6 h-6" />
                      <span className="text-xs">Find Mentors</span>
                    </Button>
                  </Link>
                  <Link href="/student/forum">
                    <Button className="w-full h-20 flex flex-col space-y-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105">
                      <MessageSquare className="w-6 h-6" />
                      <span className="text-xs">Forum</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* My Subjects */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">My Subjects</CardTitle>
                <CardDescription className="text-purple-200">
                  Track your progress in enrolled subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-white font-semibold">{subject.name}</h3>
                          <Badge variant="outline" className="border-purple-400 text-purple-200">
                            {subject.code}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-purple-200">
                          <span className="flex items-center">
                            <Download className="w-4 h-4 mr-1" />
                            {subject.resources} resources
                          </span>
                          {subject.nextClass && (
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {subject.nextClass}
                            </span>
                          )}
                        </div>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-purple-300 mb-1">
                            <span>Progress</span>
                            <span>{subject.progress}%</span>
                          </div>
                          <Progress value={subject.progress} className="h-2" />
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-purple-300" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Announcements */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Latest Announcements</CardTitle>
                <CardDescription className="text-purple-200">
                  Stay updated with important notices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white font-semibold">{announcement.title}</h3>
                        <Badge 
                          className={
                            announcement.type === 'EXAM' ? 'bg-red-500' :
                            announcement.type === 'VTU_CIRCULAR' ? 'bg-blue-500' : 'bg-purple-500'
                          }
                        >
                          {announcement.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-purple-200 text-sm mb-2">{announcement.content}</p>
                      <p className="text-purple-300 text-xs">
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* AI Study Assistant */}
            <Card className="bg-gradient-to-br from-purple-500 to-pink-500 border-none">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  AI Study Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-100 text-sm mb-4">
                  Get instant help with your studies from our AI assistant
                </p>
                <Link href="/student/ai-assistant">
                  <Button className="w-full bg-white text-purple-600 hover:bg-purple-50 transition-all transform hover:scale-105">
                    <Play className="w-4 h-4 mr-2" />
                    Start Chat
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium text-sm">Data Structures Quiz</span>
                      <Badge className="bg-orange-500">Today</Badge>
                    </div>
                    <p className="text-purple-200 text-xs">2:00 PM - 3:00 PM</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium text-sm">Assignment Deadline</span>
                      <Badge className="bg-red-500">3 days</Badge>
                    </div>
                    <p className="text-purple-200 text-xs">Algorithm Analysis</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Mentors */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Recommended Mentors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">JD</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">Dr. Jane Doe</p>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-400 mr-1" />
                        <span className="text-purple-200 text-xs">4.9 • Data Structures</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">RS</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">Prof. Robert Smith</p>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-400 mr-1" />
                        <span className="text-purple-200 text-xs">4.8 • Algorithms</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Link href="/student/mentors">
                  <Button variant="outline" className="w-full mt-4 border-purple-400 text-purple-200 hover:bg-purple-500 hover:text-white transition-all">
                    View All Mentors
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}