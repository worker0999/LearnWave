'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { 
  TrendingUp, 
  Award, 
  BookOpen, 
  Target,
  Download,
  Eye,
  Calendar,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Star,
  Clock,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react'

interface SemesterResult {
  semester: number
  sgpa: number
  cgpa: number
  subjects: SubjectResult[]
  resultDate: string
  status: 'PASS' | 'FAIL' | 'ATKT'
}

interface SubjectResult {
  code: string
  name: string
  credits: number
  internalMarks: number
  externalMarks: number
  totalMarks: number
  grade: string
  gradePoints: number
  result: 'PASS' | 'FAIL'
}

interface PerformanceAnalytics {
  overallCGPA: number
  totalCredits: number
  clearedCredits: number
  semesterTrend: number[]
  subjectPerformance: {
    excellent: number
    good: number
    average: number
    poor: number
  }
  classRank?: number
  classStrength?: number
}

const mockResults: SemesterResult[] = [
  {
    semester: 5,
    sgpa: 8.7,
    cgpa: 8.5,
    subjects: [
      {
        code: 'CS52',
        name: 'Data Structures',
        credits: 4,
        internalMarks: 38,
        externalMarks: 82,
        totalMarks: 120,
        grade: 'S',
        gradePoints: 10,
        result: 'PASS'
      },
      {
        code: 'CS53',
        name: 'Algorithm Analysis',
        credits: 4,
        internalMarks: 35,
        externalMarks: 78,
        totalMarks: 120,
        grade: 'A',
        gradePoints: 9,
        result: 'PASS'
      },
      {
        code: 'CS54',
        name: 'Database Management',
        credits: 4,
        internalMarks: 40,
        externalMarks: 85,
        totalMarks: 120,
        grade: 'S',
        gradePoints: 10,
        result: 'PASS'
      },
      {
        code: 'CS55',
        name: 'Web Technology',
        credits: 3,
        internalMarks: 32,
        externalMarks: 73,
        totalMarks: 100,
        grade: 'B',
        gradePoints: 8,
        result: 'PASS'
      },
      {
        code: 'CS56',
        name: 'Software Engineering',
        credits: 3,
        internalMarks: 36,
        externalMarks: 80,
        totalMarks: 100,
        grade: 'A',
        gradePoints: 9,
        result: 'PASS'
      },
      {
        code: 'CSL57',
        name: 'Data Structures Lab',
        credits: 2,
        internalMarks: 45,
        externalMarks: 0,
        totalMarks: 50,
        grade: 'S',
        gradePoints: 10,
        result: 'PASS'
      }
    ],
    resultDate: '2024-01-15',
    status: 'PASS'
  },
  {
    semester: 4,
    sgpa: 8.3,
    cgpa: 8.4,
    subjects: [
      {
        code: 'CS41',
        name: 'Mathematics IV',
        credits: 4,
        internalMarks: 34,
        externalMarks: 76,
        totalMarks: 120,
        grade: 'A',
        gradePoints: 9,
        result: 'PASS'
      },
      {
        code: 'CS42',
        name: 'Computer Organization',
        credits: 4,
        internalMarks: 37,
        externalMarks: 79,
        totalMarks: 120,
        grade: 'A',
        gradePoints: 9,
        result: 'PASS'
      }
    ],
    resultDate: '2023-06-20',
    status: 'PASS'
  }
]

const mockAnalytics: PerformanceAnalytics = {
  overallCGPA: 8.5,
  totalCredits: 78,
  clearedCredits: 78,
  semesterTrend: [7.8, 8.1, 8.3, 8.4, 8.5],
  subjectPerformance: {
    excellent: 12,
    good: 18,
    average: 8,
    poor: 2
  },
  classRank: 15,
  classStrength: 120
}

export default function ResultsPortal() {
  const [results, setResults] = useState<SemesterResult[]>([])
  const [analytics, setAnalytics] = useState<PerformanceAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null)
  const [usn, setUsn] = useState('1CS21CS001')
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    setLoading(true)
    try {
      // Simulate API call to VTU results
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setResults(mockResults)
      setAnalytics(mockAnalytics)
      setSelectedSemester(mockResults[0]?.semester || null)
    } catch (error) {
      console.error('Failed to load results:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshResults = async () => {
    setRefreshing(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      // In real implementation, this would fetch fresh data from VTU API
    } catch (error) {
      console.error('Failed to refresh results:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const getGradeColor = (grade: string) => {
    const colors: { [key: string]: string } = {
      'S': 'bg-green-500 text-white',
      'A': 'bg-blue-500 text-white',
      'B': 'bg-cyan-500 text-white',
      'C': 'bg-yellow-500 text-white',
      'D': 'bg-orange-500 text-white',
      'E': 'bg-red-500 text-white',
      'F': 'bg-red-600 text-white'
    }
    return colors[grade] || 'bg-gray-500 text-white'
  }

  const getResultColor = (result: string) => {
    return result === 'PASS' ? 'text-green-400' : 'text-red-400'
  }

  const getPerformanceColor = (cgpa: number) => {
    if (cgpa >= 9) return 'text-green-400'
    if (cgpa >= 8) return 'text-blue-400'
    if (cgpa >= 7) return 'text-cyan-400'
    if (cgpa >= 6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const currentSemesterResult = results.find(r => r.semester === selectedSemester)

  if (loading) {
    return (
      <DashboardLayout userRole="STUDENT">
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading results...</div>
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
            <h1 className="text-4xl font-bold text-white mb-2">Results Portal</h1>
            <p className="text-cyan-200">
              View your academic performance and track your progress
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter USN"
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-cyan-300 w-32"
              />
              <Button
                onClick={refreshResults}
                disabled={refreshing}
                variant="outline"
                className="border-cyan-400 text-cyan-200 hover:bg-cyan-500 hover:text-white"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-cyan-200">Current CGPA</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getPerformanceColor(analytics.overallCGPA)}`}>
                  {analytics.overallCGPA.toFixed(2)}
                </div>
                <p className="text-xs text-cyan-300">
                  {analytics.semesterTrend.length > 1 && (
                    <>+{(analytics.overallCGPA - analytics.semesterTrend[analytics.semesterTrend.length - 2]).toFixed(2)} from last semester</>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-cyan-200">Credits Cleared</CardTitle>
                <Award className="h-4 w-4 text-cyan-300" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {analytics.clearedCredits}/{analytics.totalCredits}
                </div>
                <p className="text-xs text-cyan-300">
                  {Math.round((analytics.clearedCredits / analytics.totalCredits) * 100)}% completed
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-cyan-200">Class Rank</CardTitle>
                <Star className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {analytics.classRank}/{analytics.classStrength}
                </div>
                <p className="text-xs text-cyan-300">
                  Top {Math.round((analytics.classRank! / analytics.classStrength!) * 100)}%
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-cyan-200">Performance</CardTitle>
                <BarChart3 className="h-4 w-4 text-cyan-300" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">Excellent</div>
                <p className="text-xs text-cyan-300">
                  {analytics.subjectPerformance.excellent} subjects with S grade
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="results" className="space-y-6">
          <TabsList className="bg-black/30 border-white/20">
            <TabsTrigger value="results" className="text-red">Semester Results</TabsTrigger>
            <TabsTrigger value="analytics" className="text-red">Performance Analytics</TabsTrigger>
            <TabsTrigger value="trends" className="text-red">Progress Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-6">
            {/* Semester Selector */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-white font-medium">Select Semester:</span>
                    <div className="flex space-x-2">
                      {results.map((result) => (
                        <Button
                          key={result.semester}
                          variant={selectedSemester === result.semester ? "default" : "outline"}
                          onClick={() => setSelectedSemester(result.semester)}
                          className={selectedSemester === result.semester ? "bg-cyan-500" : "border-cyan-400 text-cyan-200 hover:bg-cyan-500 hover:text-white"}
                        >
                          Sem {result.semester}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" className="border-cyan-400 text-cyan-200 hover:bg-cyan-500 hover:text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Current Semester Results */}
            {currentSemesterResult && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* SGPA Card */}
                <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-md border-white/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-white mb-2">
                      {currentSemesterResult.sgpa.toFixed(2)}
                    </div>
                    <div className="text-cyan-200 mb-4">SGPA</div>
                    <div className="flex items-center justify-center space-x-2">
                      <Badge className={currentSemesterResult.status === 'PASS' ? 'bg-green-500' : 'bg-red-500'}>
                        {currentSemesterResult.status}
                      </Badge>
                      <span className="text-cyan-300 text-sm">
                        {new Date(currentSemesterResult.resultDate).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Subject Results */}
                <div className="lg:col-span-2">
                  <Card className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Subject Results</CardTitle>
                      <CardDescription className="text-cyan-200">
                        Detailed performance in each subject
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {currentSemesterResult.subjects.map((subject) => (
                          <div key={subject.code} className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="text-white font-medium">{subject.name}</h4>
                                <p className="text-cyan-300 text-sm">{subject.code} • {subject.credits} credits</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getGradeColor(subject.grade)}>
                                  {subject.grade}
                                </Badge>
                                <span className={`text-sm ${getResultColor(subject.result)}`}>
                                  {subject.result}
                                </span>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-cyan-300">Internal:</span>
                                <span className="text-white ml-1">{subject.internalMarks}</span>
                              </div>
                              <div>
                                <span className="text-cyan-300">External:</span>
                                <span className="text-white ml-1">{subject.externalMarks}</span>
                              </div>
                              <div>
                                <span className="text-cyan-300">Total:</span>
                                <span className="text-white ml-1">{subject.totalMarks}</span>
                              </div>
                              <div>
                                <span className="text-cyan-300">Points:</span>
                                <span className="text-white ml-1">{subject.gradePoints}</span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <Progress 
                                value={(subject.totalMarks / (subject.credits * 25)) * 100} 
                                className="h-2"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {analytics && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Subject Performance Distribution */}
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Subject Performance</CardTitle>
                    <CardDescription className="text-cyan-200">
                      Distribution of grades across all subjects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-green-400">Excellent (S Grade)</span>
                        <span className="text-white">{analytics.subjectPerformance.excellent} subjects</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-400">Good (A Grade)</span>
                        <span className="text-white">{analytics.subjectPerformance.good} subjects</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-cyan-400">Average (B, C Grade)</span>
                        <span className="text-white">{analytics.subjectPerformance.average} subjects</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-red-400">Needs Improvement (D, E, F)</span>
                        <span className="text-white">{analytics.subjectPerformance.poor} subjects</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* CGPA Trend */}
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">CGPA Trend</CardTitle>
                    <CardDescription className="text-cyan-200">
                      Your academic performance over semesters
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.semesterTrend.map((cgpa, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-cyan-200">Semester {index + 1}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-white/20 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                                style={{ width: `${(cgpa / 10) * 100}%` }}
                              />
                            </div>
                            <span className={`font-medium ${getPerformanceColor(cgpa)}`}>
                              {cgpa.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Progress Analysis</CardTitle>
                <CardDescription className="text-cyan-200">
                  Track your academic journey and identify areas for improvement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Activity className="w-16 h-16 text-cyan-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Detailed Analytics Coming Soon</h3>
                  <p className="text-cyan-200">
                    Advanced performance analytics and prediction models will be available here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
