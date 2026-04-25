'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User,
  Bell,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react'

interface TimetableEntry {
  id: string
  subject: string
  subjectCode: string
  faculty: string
  room: string
  startTime: string
  endTime: string
  day: string
  type: 'LECTURE' | 'LAB' | 'TUTORIAL' | 'SEMINAR'
  department: string
  semester: number
}

interface TimetableDay {
  day: string
  date: string
  entries: TimetableEntry[]
}

export default function TimetablePage() {
  const { user, isAuthenticated } = useAuth()
  const [timetable, setTimetable] = useState<TimetableDay[]>([])
  const [loading, setLoading] = useState(true)
  const [currentWeek, setCurrentWeek] = useState(0)
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedSemester, setSelectedSemester] = useState('')

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return
    }

    // Set default values from user data
    setSelectedDepartment(user.branch || 'Computer Science & Engineering')
    setSelectedSemester(user.semester?.toString() || '5')

    fetchTimetable()
  }, [isAuthenticated, user, selectedDepartment, selectedSemester])

  const fetchTimetable = async () => {
    setLoading(true)
    try {
      // Mock data for now - in real app, this would fetch from API
      const mockTimetable: TimetableDay[] = [
        {
          day: 'Monday',
          date: '2024-01-22',
          entries: [
            {
              id: '1',
              subject: 'Data Structures',
              subjectCode: 'CS52',
              faculty: 'Dr. Ramesh Kumar',
              room: 'Room 301',
              startTime: '09:00',
              endTime: '10:30',
              day: 'Monday',
              type: 'LECTURE',
              department: 'Computer Science & Engineering',
              semester: 5
            },
            {
              id: '2',
              subject: 'Data Structures Lab',
              subjectCode: 'CS52L',
              faculty: 'Prof. Sunita Reddy',
              room: 'Lab 201',
              startTime: '11:00',
              endTime: '13:00',
              day: 'Monday',
              type: 'LAB',
              department: 'Computer Science & Engineering',
              semester: 5
            },
            {
              id: '3',
              subject: 'Algorithm Analysis',
              subjectCode: 'CS53',
              faculty: 'Dr. Priya Sharma',
              room: 'Room 302',
              startTime: '14:00',
              endTime: '15:30',
              day: 'Monday',
              type: 'LECTURE',
              department: 'Computer Science & Engineering',
              semester: 5
            }
          ]
        },
        {
          day: 'Tuesday',
          date: '2024-01-23',
          entries: [
            {
              id: '4',
              subject: 'Database Management',
              subjectCode: 'CS54',
              faculty: 'Dr. Anand Patel',
              room: 'Room 303',
              startTime: '09:00',
              endTime: '10:30',
              day: 'Tuesday',
              type: 'LECTURE',
              department: 'Computer Science & Engineering',
              semester: 5
            },
            {
              id: '5',
              subject: 'Algorithm Analysis',
              subjectCode: 'CS53',
              faculty: 'Dr. Priya Sharma',
              room: 'Room 302',
              startTime: '11:00',
              endTime: '12:30',
              day: 'Tuesday',
              type: 'TUTORIAL',
              department: 'Computer Science & Engineering',
              semester: 5
            },
            {
              id: '6',
              subject: 'Web Technologies',
              subjectCode: 'CS55',
              faculty: 'Prof. Kiran Joshi',
              room: 'Room 304',
              startTime: '14:00',
              endTime: '15:30',
              day: 'Tuesday',
              type: 'LECTURE',
              department: 'Computer Science & Engineering',
              semester: 5
            }
          ]
        },
        {
          day: 'Wednesday',
          date: '2024-01-24',
          entries: [
            {
              id: '7',
              subject: 'Data Structures',
              subjectCode: 'CS52',
              faculty: 'Dr. Ramesh Kumar',
              room: 'Room 301',
              startTime: '09:00',
              endTime: '10:30',
              day: 'Wednesday',
              type: 'LECTURE',
              department: 'Computer Science & Engineering',
              semester: 5
            },
            {
              id: '8',
              subject: 'Database Management Lab',
              subjectCode: 'CS54L',
              faculty: 'Prof. Mahesh Kumar',
              room: 'Lab 202',
              startTime: '11:00',
              endTime: '13:00',
              day: 'Wednesday',
              type: 'LAB',
              department: 'Computer Science & Engineering',
              semester: 5
            },
            {
              id: '9',
              subject: 'Software Engineering',
              subjectCode: 'CS56',
              faculty: 'Dr. Lakshmi Narayan',
              room: 'Room 305',
              startTime: '14:00',
              endTime: '15:30',
              day: 'Wednesday',
              type: 'LECTURE',
              department: 'Computer Science & Engineering',
              semester: 5
            }
          ]
        },
        {
          day: 'Thursday',
          date: '2024-01-25',
          entries: [
            {
              id: '10',
              subject: 'Algorithm Analysis',
              subjectCode: 'CS53',
              faculty: 'Dr. Priya Sharma',
              room: 'Room 302',
              startTime: '09:00',
              endTime: '10:30',
              day: 'Thursday',
              type: 'LECTURE',
              department: 'Computer Science & Engineering',
              semester: 5
            },
            {
              id: '11',
              subject: 'Web Technologies Lab',
              subjectCode: 'CS55L',
              faculty: 'Prof. Kiran Joshi',
              room: 'Lab 203',
              startTime: '11:00',
              endTime: '13:00',
              day: 'Thursday',
              type: 'LAB',
              department: 'Computer Science & Engineering',
              semester: 5
            },
            {
              id: '12',
              subject: 'Database Management',
              subjectCode: 'CS54',
              faculty: 'Dr. Anand Patel',
              room: 'Room 303',
              startTime: '14:00',
              endTime: '15:30',
              day: 'Thursday',
              type: 'LECTURE',
              department: 'Computer Science & Engineering',
              semester: 5
            }
          ]
        },
        {
          day: 'Friday',
          date: '2024-01-26',
          entries: [
            {
              id: '13',
              subject: 'Software Engineering',
              subjectCode: 'CS56',
              faculty: 'Dr. Lakshmi Narayan',
              room: 'Room 305',
              startTime: '09:00',
              endTime: '10:30',
              day: 'Friday',
              type: 'LECTURE',
              department: 'Computer Science & Engineering',
              semester: 5
            },
            {
              id: '14',
              subject: 'Data Structures',
              subjectCode: 'CS52',
              faculty: 'Dr. Ramesh Kumar',
              room: 'Room 301',
              startTime: '11:00',
              endTime: '12:30',
              day: 'Friday',
              type: 'TUTORIAL',
              department: 'Computer Science & Engineering',
              semester: 5
            },
            {
              id: '15',
              subject: 'Professional Ethics',
              subjectCode: 'HS57',
              faculty: 'Prof. Anita Desai',
              room: 'Room 306',
              startTime: '14:00',
              endTime: '15:30',
              day: 'Friday',
              type: 'LECTURE',
              department: 'Computer Science & Engineering',
              semester: 5
            }
          ]
        }
      ]

      setTimetable(mockTimetable)
    } catch (error) {
      console.error('Error fetching timetable:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'LECTURE':
        return 'bg-blue-500'
      case 'LAB':
        return 'bg-green-500'
      case 'TUTORIAL':
        return 'bg-yellow-500'
      case 'SEMINAR':
        return 'bg-cyan-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'LECTURE':
        return <User className="w-4 h-4" />
      case 'LAB':
        return <MapPin className="w-4 h-4" />
      case 'TUTORIAL':
        return <AlertCircle className="w-4 h-4" />
      case 'SEMINAR':
        return <Bell className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getCurrentWeekDates = () => {
    const today = new Date()
    const currentDay = today.getDay()
    const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1) // Adjust for Monday start
    const monday = new Date(today.setDate(diff))
  const weekDates: string[] = []

    for (let i = 0; i < 5; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i + (currentWeek * 7))
      weekDates.push(date.toISOString().split('T')[0])
    }

    return weekDates
  }

  const syncWithGoogleCalendar = () => {
    // In a real app, this would integrate with Google Calendar API
    alert('Google Calendar sync would be implemented here with OAuth integration')
  }

  const downloadTimetable = () => {
    // In a real app, this would generate and download a PDF/Excel file
    alert('Timetable download would be implemented here')
  }

  const setReminder = (entry: TimetableEntry) => {
    // In a real app, this would set up notifications
    alert(`Reminder set for ${entry.subject} at ${formatTime(entry.startTime)}`)
  }

  if (!isAuthenticated || !user) {
    return (
      <DashboardLayout userRole="STUDENT">
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Please log in to view your timetable</div>
        </div>
      </DashboardLayout>
    )
  }

  const weekDates = getCurrentWeekDates()

  return (
    <DashboardLayout userRole="STUDENT">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Class Timetable</h1>
            <p className="text-cyan-200">
              {selectedDepartment} • Semester {selectedSemester}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={syncWithGoogleCalendar} variant="outline" className="border-cyan-400 text-cyan-200">
              <Calendar className="w-4 h-4 mr-2" />
              Sync with Google
            </Button>
            <Button onClick={downloadTimetable} variant="outline" className="border-cyan-400 text-cyan-200">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={fetchTimetable} variant="outline" className="border-cyan-400 text-cyan-200">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-cyan-200 text-sm mb-2 block">Department</label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science & Engineering">Computer Science & Engineering</SelectItem>
                    <SelectItem value="Information Science & Engineering">Information Science & Engineering</SelectItem>
                    <SelectItem value="Electronics & Communication">Electronics & Communication</SelectItem>
                    <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-cyan-200 text-sm mb-2 block">Semester</label>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Semester 1</SelectItem>
                    <SelectItem value="2">Semester 2</SelectItem>
                    <SelectItem value="3">Semester 3</SelectItem>
                    <SelectItem value="4">Semester 4</SelectItem>
                    <SelectItem value="5">Semester 5</SelectItem>
                    <SelectItem value="6">Semester 6</SelectItem>
                    <SelectItem value="7">Semester 7</SelectItem>
                    <SelectItem value="8">Semester 8</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <div className="flex items-center space-x-2 text-cyan-200">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Week of {new Date(weekDates[0]).toLocaleDateString()} - {new Date(weekDates[4]).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => setCurrentWeek(currentWeek - 1)}
            variant="outline"
            className="border-cyan-400 text-cyan-200"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous Week
          </Button>
          
          <h2 className="text-white text-xl font-semibold">
            {currentWeek === 0 ? 'Current Week' : `Week ${currentWeek > 0 ? '+' : ''}${currentWeek}`}
          </h2>

          <Button
            onClick={() => setCurrentWeek(currentWeek + 1)}
            variant="outline"
            className="border-cyan-400 text-cyan-200"
          >
            Next Week
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Timetable Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-cyan-300 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {timetable.map((day, dayIndex) => (
              <Card key={day.day} className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-center">
                    {day.day}
                  </CardTitle>
                  <CardDescription className="text-cyan-200 text-center">
                    {new Date(weekDates[dayIndex]).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {day.entries.length === 0 ? (
                    <div className="text-center text-cyan-300 py-8">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No classes</p>
                    </div>
                  ) : (
                    day.entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={`${getTypeColor(entry.type)} text-white text-xs`}>
                            {entry.type}
                          </Badge>
                          <Button
                            onClick={() => setReminder(entry)}
                            variant="ghost"
                            size="sm"
                            className="text-cyan-300 hover:text-white p-1 h-auto"
                          >
                            <Bell className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <h4 className="text-white font-medium text-sm mb-1">
                          {entry.subject}
                        </h4>
                        <p className="text-cyan-300 text-xs mb-1">
                          {entry.subjectCode}
                        </p>
                        
                        <div className="space-y-1">
                          <div className="flex items-center text-cyan-200 text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                          </div>
                          <div className="flex items-center text-cyan-200 text-xs">
                            <User className="w-3 h-3 mr-1" />
                            {entry.faculty}
                          </div>
                          <div className="flex items-center text-cyan-200 text-xs">
                            <MapPin className="w-3 h-3 mr-1" />
                            {entry.room}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Upcoming Classes */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mt-6">
          <CardHeader>
            <CardTitle className="text-white">Today's Schedule</CardTitle>
            <CardDescription className="text-cyan-200">
              Your classes for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            {timetable[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]?.entries.length > 0 ? (
              <div className="space-y-3">
                {timetable[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]?.entries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(entry.type)}`}>
                        {getTypeIcon(entry.type)}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{entry.subject}</h4>
                        <p className="text-cyan-300 text-sm">
                          {formatTime(entry.startTime)} - {formatTime(entry.endTime)} • {entry.room}
                        </p>
                      </div>
                    </div>
                    <Button onClick={() => setReminder(entry)} variant="outline" size="sm">
                      <Bell className="w-4 h-4 mr-2" />
                      Set Reminder
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-cyan-200 py-8">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No classes scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
