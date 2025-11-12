'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates'
import { 
  Users, 
  Search, 
  Filter,
  Star,
  Calendar as CalendarIcon,
  Clock,
  Video,
  MessageSquare,
  Award,
  BookOpen,
  DollarSign,
  MapPin,
  Mail,
  Phone,
  CheckCircle,
  User,
  TrendingUp,
  Zap,
  RefreshCw
} from 'lucide-react'

interface Mentor {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  title: string
  expertise: string[]
  experience: number
  rating: number
  reviews: number
  hourlyRate: number
  availability: string[]
  bio: string
  education: string
  location: string
  languages: string[]
  responseTime: string
  completedSessions: number
  isOnline: boolean
  subjects: string[]
}

interface BookingSlot {
  id: string
  mentorId: string
  date: Date
  time: string
  duration: number
  isAvailable: boolean
}

interface StudentSession {
  id: string
  mentorId: string
  studentId: string
  date: string
  time: string
  duration: number
  notes?: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  amount: number
  paymentStatus: string
  meetingLink?: string
  createdAt: string
  mentor: {
    user: {
      id: string
      name: string
      email: string
      avatar?: string
    }
  }
}

const mockMentors: Mentor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@vtu.edu',
    phone: '+91 98765 43210',
    avatar: '/avatars/sarah.jpg',
    title: 'Professor of Computer Science',
    expertise: ['Data Structures', 'Algorithms', 'Machine Learning'],
    experience: 15,
    rating: 4.9,
    reviews: 127,
    hourlyRate: 1500,
    availability: ['Monday', 'Wednesday', 'Friday'],
    bio: 'Passionate educator with 15+ years of experience in teaching computer science concepts. Specialized in making complex topics easy to understand.',
    education: 'PhD in Computer Science, IISc Bangalore',
    location: 'Bangalore, India',
    languages: ['English', 'Hindi', 'Kannada'],
    responseTime: '< 2 hours',
    completedSessions: 450,
    isOnline: true,
    subjects: ['Data Structures', 'Algorithm Analysis', 'Machine Learning']
  },
  {
    id: '2',
    name: 'Prof. Michael Chen',
    email: 'michael.chen@techcorp.com',
    phone: '+91 87654 32109',
    avatar: '/avatars/michael.jpg',
    title: 'Senior Software Engineer at Google',
    expertise: ['Web Development', 'System Design', 'Cloud Computing'],
    experience: 12,
    rating: 4.8,
    reviews: 89,
    hourlyRate: 2000,
    availability: ['Tuesday', 'Thursday', 'Saturday'],
    bio: 'Industry professional with hands-on experience in building scalable systems. Love to share practical knowledge with students.',
    education: 'MS in Computer Science, Stanford University',
    location: 'San Francisco, USA',
    languages: ['English', 'Mandarin'],
    responseTime: '< 4 hours',
    completedSessions: 320,
    isOnline: false,
    subjects: ['Web Technology', 'Cloud Computing', 'System Design']
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@university.edu',
    phone: '+91 76543 21098',
    avatar: '/avatars/emily.jpg',
    title: 'Research Scientist & Academic Consultant',
    expertise: ['Database Systems', 'Data Science', 'Research Methodology'],
    experience: 10,
    rating: 4.7,
    reviews: 156,
    hourlyRate: 1200,
    availability: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    bio: 'Research-focused academic helping students bridge theory and practice. Expert in database design and data analysis.',
    education: 'PhD in Database Systems, MIT',
    location: 'Boston, USA',
    languages: ['English', 'Spanish'],
    responseTime: '< 1 hour',
    completedSessions: 280,
    isOnline: true,
    subjects: ['Database Management', 'Data Science', 'Research Methodology']
  }
]

const subjects = [
  'Data Structures',
  'Algorithm Analysis',
  'Database Management',
  'Web Technology',
  'Machine Learning',
  'Cloud Computing',
  'System Design',
  'Computer Networks'
]

export default function MentorConnect() {
  const { user, isAuthenticated } = useAuth()
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([])
  const [sessions, setSessions] = useState<StudentSession[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedExpertise, setSelectedExpertise] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('rating')
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [sessionNotes, setSessionNotes] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)

  // Real-time updates for mentors
  const { data: mentors, loading, refresh } = useRealtimeUpdates<Mentor[]>({
    endpoint: '/api/mentors',
    interval: 25000, // 25 seconds
    enabled: isAuthenticated && !!user
  })

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchSessions()
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    filterMentors()
  }, [mentors, searchTerm, selectedSubject, selectedExpertise, sortBy])

  const fetchSessions = async () => {
    try {
      const response = await fetch(`/api/sessions?studentId=${user?.id}`)
      const data = await response.json()
      
      if (data.success) {
        setSessions(data.sessions)
      } else {
        console.error('Failed to fetch sessions:', data.error)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
    }
  }

  const cancelSession = async (sessionId: string) => {
    if (!user) return

    try {
      const response = await fetch('/api/sessions/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          studentId: user.id
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert('Session cancelled successfully')
        fetchSessions() // Refresh sessions
      } else {
        alert(`Failed to cancel session: ${data.error}`)
      }
    } catch (error) {
      console.error('Cancel session error:', error)
      alert('Failed to cancel session. Please try again.')
    }
  }

  const filterMentors = () => {
    if (!mentors) return
    
    let filtered = mentors.filter(mentor => {
      const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           mentor.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesSubject = selectedSubject === 'all' || mentor.subjects.includes(selectedSubject)
      const matchesExpertise = selectedExpertise === 'all' || mentor.expertise.includes(selectedExpertise)

      return matchesSearch && matchesSubject && matchesExpertise
    })

    // Sort mentors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'experience':
          return b.experience - a.experience
        case 'price-low':
          return a.hourlyRate - b.hourlyRate
        case 'price-high':
          return b.hourlyRate - a.hourlyRate
        case 'reviews':
          return b.reviews - a.reviews
        default:
          return 0
      }
    })

    setFilteredMentors(filtered)
  }

  const handleBookSession = async () => {
    if (!selectedMentor || !selectedDate || !selectedTime || !user) return

    setBookingLoading(true)
    
    try {
      const bookingData = {
        mentorId: selectedMentor.id,
        studentId: user.id,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        duration: 60,
        notes: sessionNotes,
        amount: selectedMentor.hourlyRate
      }

      const response = await fetch('/api/mentors/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      const data = await response.json()

      if (data.success) {
        alert(`Session booked successfully! Meeting link: ${data.booking.meetingLink}`)
        
        // Refresh sessions after successful booking
        fetchSessions()
        
        // Reset form
        setBookingDialogOpen(false)
        setSelectedDate(undefined)
        setSelectedTime('')
        setSessionNotes('')
        setSelectedMentor(null)
      } else {
        alert(`Booking failed: ${data.error}`)
      }
    } catch (error) {
      console.error('Booking failed:', error)
      alert('Failed to book session. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
  ]

  if (!isAuthenticated || !user) {
    return (
      <DashboardLayout userRole="STUDENT">
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Please log in to book mentor sessions</div>
        </div>
      </DashboardLayout>
    )
  }

  if (loading) {
    return (
      <DashboardLayout userRole="STUDENT">
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading mentors...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="STUDENT">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Mentor Connect</h1>
            <p className="text-purple-200">
              Connect with experienced mentors for personalized guidance
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={refresh} variant="outline" className="border-purple-400 text-purple-200">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Badge className="bg-green-500 text-white">
              <Users className="w-3 h-3 mr-1" />
              {mentors?.length || 0} Mentors Available
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-4 h-4" />
                  <Input
                    placeholder="Search mentors by name, expertise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-purple-300 focus:border-purple-400"
                  />
                </div>
              </div>

              {/* Subject Filter */}
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Expertise Filter */}
              <Select value={selectedExpertise} onValueChange={setSelectedExpertise}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Expertise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Expertise</SelectItem>
                  <SelectItem value="Data Structures">Data Structures</SelectItem>
                  <SelectItem value="Algorithms">Algorithms</SelectItem>
                  <SelectItem value="Web Development">Web Development</SelectItem>
                  <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                  <SelectItem value="Database Systems">Database Systems</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="experience">Most Experience</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Mentors Grid */}
        <div id="mentors-grid" className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <Card key={mentor.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={mentor.avatar} />
                      <AvatarFallback>
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-white">{mentor.name}</CardTitle>
                      <p className="text-purple-200 text-sm">{mentor.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {mentor.isOnline && (
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    )}
                    <Badge className={mentor.isOnline ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                      {mentor.isOnline ? 'Online' : 'Offline'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Bio */}
                  <p className="text-purple-200 text-sm line-clamp-2">{mentor.bio}</p>
                  
                  {/* Expertise */}
                  <div className="flex flex-wrap gap-1">
                    {mentor.expertise.slice(0, 3).map((exp, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-purple-500/20 text-purple-200">
                        {exp}
                      </Badge>
                    ))}
                    {mentor.expertise.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-200">
                        +{mentor.expertise.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-white">{mentor.rating}</span>
                      <span className="text-purple-300">({mentor.reviews})</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4 text-purple-300" />
                      <span className="text-white">{mentor.experience} years</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-white">₹{mentor.hourlyRate}/hr</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span className="text-white">{mentor.completedSessions} sessions</span>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="text-sm">
                    <div className="flex items-center space-x-1 text-purple-300 mb-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Available: {mentor.availability.join(', ')}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-purple-300">
                      <Clock className="w-4 h-4" />
                      <span>Response: {mentor.responseTime}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Dialog open={bookingDialogOpen && selectedMentor?.id === mentor.id} onOpenChange={setBookingDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setSelectedMentor(mentor)}
                          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          Book Session
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-white/20 text-white max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Book a Session with {selectedMentor?.name}</DialogTitle>
                          <DialogDescription className="text-purple-200">
                            Select your preferred date and time for the mentoring session
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Calendar */}
                          <div>
                            <label className="text-sm font-medium mb-2 block">Select Date</label>
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              className="bg-slate-800 border-white/20 rounded-md"
                              disabled={(date) => {
                                const today = new Date()
                                const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
                                return date < today || !selectedMentor?.availability.includes(dayName)
                              }}
                            />
                          </div>

                          {/* Time Slots and Notes */}
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">Select Time</label>
                              <div className="grid grid-cols-3 gap-2">
                                {timeSlots.map((time) => (
                                  <Button
                                    key={time}
                                    variant={selectedTime === time ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedTime(time)}
                                    disabled={!selectedDate}
                                    className={selectedTime === time ? "bg-purple-500" : "border-white/20 text-white hover:bg-white/10"}
                                  >
                                    {time}
                                  </Button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-medium mb-2 block">Session Notes (Optional)</label>
                              <Textarea
                                placeholder="What would you like to discuss in this session?"
                                value={sessionNotes}
                                onChange={(e) => setSessionNotes(e.target.value)}
                                className="bg-slate-800 border-white/20 text-white placeholder-purple-300"
                                rows={3}
                              />
                            </div>

                            <div className="bg-purple-500/20 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm">Session Duration:</span>
                                <span className="text-sm font-medium">60 minutes</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Total Cost:</span>
                                <span className="text-lg font-bold">₹{selectedMentor?.hourlyRate}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setBookingDialogOpen(false)}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleBookSession}
                            disabled={!selectedDate || !selectedTime || bookingLoading}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          >
                            {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="outline" size="sm" className="border-purple-400 text-purple-200 hover:bg-purple-500 hover:text-white">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Chat
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-purple-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No mentors found</h3>
              <p className="text-purple-200">
                Try adjusting your filters or search terms to find available mentors.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Booked Mentor Sessions */}
        {sessions.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20 mt-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Booked Mentor Sessions
                </div>
                <Badge className="bg-purple-500 text-white">
                  {sessions.length} {sessions.length === 1 ? 'Session' : 'Sessions'}
                </Badge>
              </CardTitle>
              <CardDescription className="text-purple-200">
                Manage and track your upcoming mentorship sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={session.mentor.user.avatar} />
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">
                            {session.mentor.user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-white font-semibold">{session.mentor.user.name}</h4>
                            <Badge 
                              variant="outline" 
                              className={
                                session.status === 'CONFIRMED' ? 'border-green-400 text-green-400' :
                                session.status === 'PENDING' ? 'border-yellow-400 text-yellow-400' :
                                session.status === 'COMPLETED' ? 'border-blue-400 text-blue-400' :
                                'border-red-400 text-red-400'
                              }
                            >
                              {session.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-purple-200 mb-2">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(session.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {session.time}
                            </span>
                            <span className="flex items-center">
                              <Zap className="w-4 h-4 mr-1" />
                              {session.duration} minutes
                            </span>
                          </div>
                          {session.notes && (
                            <div className="bg-purple-500/10 rounded p-2 mb-2">
                              <p className="text-purple-300 text-sm">
                                <span className="font-medium">Notes:</span> {session.notes}
                              </p>
                            </div>
                          )}
                          <div className="flex items-center space-x-4 text-xs text-purple-300">
                            <span>Session ID: {session.id.slice(0, 8)}...</span>
                            <span>Booked on: {new Date(session.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-3 ml-4">
                        <div className="text-right">
                          <p className="text-purple-300 text-xs">Amount</p>
                          <p className="text-white font-bold text-lg">₹{session.amount}</p>
                        </div>
                        {session.meetingLink && (
                          <div className="flex flex-col space-y-2">
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                              onClick={() => window.open(session.meetingLink, '_blank')}
                            >
                              <Video className="w-3 h-3 mr-1" />
                              Join Session
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-purple-400 text-purple-200 hover:bg-purple-500 hover:text-white text-xs"
                              onClick={() => navigator.clipboard.writeText(session.meetingLink!)}
                            >
                              Copy Link
                            </Button>
                          </div>
                        )}
                        {session.status === 'PENDING' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-400 text-red-400 hover:bg-red-500 hover:text-white text-xs"
                            onClick={() => {
                              if (confirm('Are you sure you want to cancel this session?')) {
                                cancelSession(session.id)
                              }
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Summary Stats */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-purple-300 text-sm">Total Spent</p>
                    <p className="text-white font-bold text-lg">
                      ₹{sessions.reduce((total, session) => total + session.amount, 0)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-purple-300 text-sm">Completed Sessions</p>
                    <p className="text-white font-bold text-lg">
                      {sessions.filter(s => s.status === 'COMPLETED').length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-purple-300 text-sm">Upcoming Sessions</p>
                    <p className="text-white font-bold text-lg">
                      {sessions.filter(s => s.status === 'PENDING' || s.status === 'CONFIRMED').length}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State for Sessions */}
        {sessions.length === 0 && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20 mt-8">
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-purple-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Booked Sessions Yet</h3>
              <p className="text-purple-200 mb-6">
                You haven't booked any mentor sessions yet. Browse available mentors and book your first session!
              </p>
              <Button 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                onClick={() => {
                  // Scroll to mentors section
                  document.getElementById('mentors-grid')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <Users className="w-4 h-4 mr-2" />
                Browse Mentors
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}