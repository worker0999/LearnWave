'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { 
  TrendingUp, 
  Target, 
  BookOpen, 
  Code,
  Award,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  Play,
  Download,
  ExternalLink,
  Star,
  BarChart3,
  Lightbulb,
  Briefcase,
  FileText,
  Video,
  MessageSquare,
  Zap
} from 'lucide-react'

interface Resource {
  id: string
  title: string
  description: string
  type: 'article' | 'video' | 'course' | 'practice' | 'tool'
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration?: string
  link?: string
  rating: number
  completed: boolean
  tags: string[]
}

interface Company {
  id: string
  name: string
  logo: string
  industry: string
  roles: string[]
  packageRange: string
  requirements: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  applicationDeadline?: string
}

interface PracticeProblem {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  solved: boolean
  accuracy: number
  submissions: number
}

const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Data Structures & Algorithms for Interviews',
    description: 'Comprehensive guide covering all essential DSA concepts frequently asked in interviews',
    type: 'course',
    category: 'DSA',
    difficulty: 'intermediate',
    duration: '8 weeks',
    rating: 4.8,
    completed: false,
    tags: ['algorithms', 'data-structures', 'interview']
  },
  {
    id: '2',
    title: 'System Design Fundamentals',
    description: 'Learn how to design scalable systems and architecture patterns',
    type: 'video',
    category: 'System Design',
    difficulty: 'advanced',
    duration: '6 hours',
    rating: 4.7,
    completed: true,
    tags: ['system-design', 'architecture', 'scalability']
  },
  {
    id: '3',
    title: 'Resume Builder Pro',
    description: 'AI-powered tool to create professional resumes optimized for ATS',
    type: 'tool',
    category: 'Resume Building',
    difficulty: 'beginner',
    rating: 4.6,
    completed: false,
    tags: ['resume', 'ats', 'career']
  }
]

const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Google',
    logo: '/companies/google.png',
    industry: 'Technology',
    roles: ['Software Engineer', 'Product Manager'],
    packageRange: '20-50 LPA',
    requirements: ['Strong DSA', 'System Design', 'Problem Solving'],
    difficulty: 'hard'
  },
  {
    id: '2',
    name: 'Microsoft',
    logo: '/companies/microsoft.png',
    industry: 'Technology',
    roles: ['Software Development Engineer'],
    packageRange: '15-40 LPA',
    requirements: ['Coding Skills', 'Cloud Knowledge', 'Team Collaboration'],
    difficulty: 'hard'
  },
  {
    id: '3',
    name: 'Amazon',
    logo: '/companies/amazon.png',
    industry: 'E-commerce/Cloud',
    roles: ['SDE', 'Cloud Engineer'],
    packageRange: '12-35 LPA',
    requirements: ['DSA', 'Distributed Systems', 'Customer Obsession'],
    difficulty: 'medium'
  }
]

const mockProblems: PracticeProblem[] = [
  {
    id: '1',
    title: 'Two Sum',
    difficulty: 'easy',
    category: 'Arrays',
    solved: true,
    accuracy: 85,
    submissions: 3
  },
  {
    id: '2',
    title: 'Merge Sort',
    difficulty: 'medium',
    category: 'Sorting',
    solved: true,
    accuracy: 92,
    submissions: 2
  },
  {
    id: '3',
    title: 'LRU Cache',
    difficulty: 'hard',
    category: 'Data Structures',
    solved: false,
    accuracy: 0,
    submissions: 0
  }
]

export default function PlacementPortal() {
  const [resources, setResources] = useState<Resource[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [problems, setProblems] = useState<PracticeProblem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [mockInterviewDialogOpen, setMockInterviewDialogOpen] = useState(false)

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setResources(mockResources)
      setCompanies(mockCompanies)
      setProblems(mockProblems)
      setLoading(false)
    }, 1000)
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    const colors: { [key: string]: string } = {
      easy: 'bg-green-500/20 text-green-300 border-green-500/30',
      intermediate: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      advanced: 'bg-red-500/20 text-red-300 border-red-500/30',
      hard: 'bg-red-500/20 text-red-300 border-red-500/30'
    }
    return colors[difficulty] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />
      case 'course':
        return <BookOpen className="w-4 h-4" />
      case 'tool':
        return <Zap className="w-4 h-4" />
      case 'practice':
        return <Code className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getProgressStats = () => {
    const total = resources.length
    const completed = resources.filter(r => r.completed).length
    const totalProblems = problems.length
    const solvedProblems = problems.filter(p => p.solved).length
    
    return {
      resourcesCompleted: completed,
      resourcesTotal: total,
      problemsSolved: solvedProblems,
      problemsTotal: totalProblems,
      overallProgress: Math.round(((completed + solvedProblems) / (total + totalProblems)) * 100)
    }
  }

  const stats = getProgressStats()

  if (loading) {
    return (
      <DashboardLayout userRole="STUDENT">
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading placement portal...</div>
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
            <h1 className="text-4xl font-bold text-white mb-2">Placement Preparation</h1>
            <p className="text-purple-200">
              Comprehensive resources to help you ace your placements
            </p>
          </div>
          <Dialog open={mockInterviewDialogOpen} onOpenChange={setMockInterviewDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <MessageSquare className="w-4 h-4 mr-2" />
                Mock Interview
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-white/20 text-white">
              <DialogHeader>
                <DialogTitle>AI Mock Interview</DialogTitle>
                <DialogDescription className="text-purple-200">
                  Practice your interview skills with our AI interviewer
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Interview Type</label>
                  <Select>
                    <SelectTrigger className="bg-slate-800 border-white/20 text-white">
                      <SelectValue placeholder="Choose interview type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Interview</SelectItem>
                      <SelectItem value="hr">HR Interview</SelectItem>
                      <SelectItem value="system-design">System Design</SelectItem>
                      <SelectItem value="behavioral">Behavioral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Company Type</label>
                  <Select>
                    <SelectTrigger className="bg-slate-800 border-white/20 text-white">
                      <SelectValue placeholder="Choose company type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="startup">Startup</SelectItem>
                      <SelectItem value="mid-size">Mid-size Company</SelectItem>
                      <SelectItem value="maang">MAANG</SelectItem>
                      <SelectItem value="product">Product-based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Difficulty Level</label>
                  <Select>
                    <SelectTrigger className="bg-slate-800 border-white/20 text-white">
                      <SelectValue placeholder="Choose difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => setMockInterviewDialogOpen(false)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Start Interview
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Overall Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.overallProgress}%</div>
              <Progress value={stats.overallProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Resources Completed</CardTitle>
              <BookOpen className="h-4 w-4 text-purple-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.resourcesCompleted}/{stats.resourcesTotal}
              </div>
              <p className="text-xs text-purple-300">
                {Math.round((stats.resourcesCompleted / stats.resourcesTotal) * 100)}% done
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Problems Solved</CardTitle>
              <Code className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.problemsSolved}/{stats.problemsTotal}
              </div>
              <p className="text-xs text-purple-300">
                Keep practicing daily!
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Interview Ready</CardTitle>
              <Award className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">Soon</div>
              <p className="text-xs text-purple-300">
                {Math.max(0, 100 - stats.overallProgress)}% to go
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="resources" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="resources" className="text-white">Learning Resources</TabsTrigger>
            <TabsTrigger value="practice" className="text-white">Practice Problems</TabsTrigger>
            <TabsTrigger value="companies" className="text-white">Company Insights</TabsTrigger>
            <TabsTrigger value="resume" className="text-white">Resume Builder</TabsTrigger>
          </TabsList>

          <TabsContent value="resources" className="space-y-6">
            {/* Filters */}
            <div className="flex items-center space-x-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="DSA">DSA</SelectItem>
                  <SelectItem value="System Design">System Design</SelectItem>
                  <SelectItem value="Resume Building">Resume Building</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white w-48">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <Card key={resource.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getResourceIcon(resource.type)}
                        <Badge className={getDifficultyColor(resource.difficulty)}>
                          {resource.difficulty}
                        </Badge>
                      </div>
                      {resource.completed && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                    <CardTitle className="text-white">{resource.title}</CardTitle>
                    <CardDescription className="text-purple-200">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-purple-300">Duration: {resource.duration}</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-white">{resource.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {resource.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-purple-500/20 text-purple-200">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Button 
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        onClick={() => window.open(resource.link, '_blank')}
                      >
                        {resource.completed ? 'Review' : 'Start Learning'}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="practice" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Coding Practice</CardTitle>
                <CardDescription className="text-purple-200">
                  Solve problems to improve your coding skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {problems.map((problem) => (
                    <div key={problem.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 ${problem.solved ? 'bg-green-500' : 'bg-gray-500'} rounded-lg flex items-center justify-center`}>
                          {problem.solved ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <Code className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{problem.title}</h4>
                          <div className="flex items-center space-x-3 text-sm text-purple-300">
                            <Badge className={getDifficultyColor(problem.difficulty)}>
                              {problem.difficulty}
                            </Badge>
                            <span>{problem.category}</span>
                            {problem.solved && (
                              <span>Accuracy: {problem.accuracy}%</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="border-purple-400 text-purple-200 hover:bg-purple-500 hover:text-white">
                        {problem.solved ? 'Practice Again' : 'Solve'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => (
                <Card key={company.id} className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white">{company.name}</CardTitle>
                        <p className="text-purple-200 text-sm">{company.industry}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-white font-medium mb-1">Roles</h4>
                        <div className="flex flex-wrap gap-1">
                          {company.roles.map((role, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-purple-500/20 text-purple-200">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-medium mb-1">Package Range</h4>
                        <p className="text-green-400 font-semibold">{company.packageRange}</p>
                      </div>

                      <div>
                        <h4 className="text-white font-medium mb-1">Key Requirements</h4>
                        <ul className="text-purple-200 text-sm space-y-1">
                          {company.requirements.map((req, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge className={getDifficultyColor(company.difficulty)}>
                          {company.difficulty} to crack
                        </Badge>
                        <Button variant="outline" size="sm" className="border-purple-400 text-purple-200 hover:bg-purple-500 hover:text-white">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resume" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-8 text-center">
                <FileText className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">AI Resume Builder</h3>
                <p className="text-purple-200 mb-6">
                  Create a professional resume optimized for Applicant Tracking Systems
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Zap className="w-4 h-4 mr-2" />
                  Build Resume
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Resume Templates</CardTitle>
                  <CardDescription className="text-purple-200">
                    Professional templates designed for tech roles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Modern Professional', 'Clean Minimal', 'Creative Designer', 'Technical Engineer'].map((template, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-white">{template}</span>
                        <Button variant="outline" size="sm" className="border-purple-400 text-purple-200 hover:bg-purple-500 hover:text-white">
                          Use Template
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Resume Tips</CardTitle>
                  <CardDescription className="text-purple-200">
                    Expert advice to make your resume stand out
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      'Use action verbs to describe achievements',
                      'Quantify your impact with numbers',
                      'Tailor resume for each job application',
                      'Keep it to one page for freshers',
                      'Include relevant projects and internships'
                    ].map((tip, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span className="text-purple-200 text-sm">{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}