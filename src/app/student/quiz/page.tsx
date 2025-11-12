'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { 
  Brain, 
  Target, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  Play,
  BookOpen,
  Award,
  TrendingUp,
  Zap,
  Lightbulb,
  Flag,
  BarChart3
} from 'lucide-react'

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  subject: string
  topic: string
}

interface QuizResult {
  score: number
  totalQuestions: number
  correctAnswers: number
  timeTaken: number
  difficulty: string
  subject: string
  topic: string
}

const subjects = [
  'Data Structures',
  'Algorithm Analysis',
  'Database Management',
  'Web Technology',
  'Computer Networks',
  'Operating Systems'
]

const topics = {
  'Data Structures': ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees', 'Graphs', 'Hashing'],
  'Algorithm Analysis': ['Sorting', 'Searching', 'Dynamic Programming', 'Greedy Algorithms', 'Divide and Conquer'],
  'Database Management': ['Normalization', 'SQL', 'Transactions', 'Indexes', 'NoSQL'],
  'Web Technology': ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Databases'],
  'Computer Networks': ['OSI Model', 'TCP/IP', 'Routing', 'Security', 'Protocols'],
  'Operating Systems': ['Processes', 'Memory Management', 'File Systems', 'Scheduling', 'Synchronization']
}

export default function QuizGenerator() {
  const [mode, setMode] = useState<'setup' | 'quiz' | 'results'>('setup')
  const [quizConfig, setQuizConfig] = useState({
    subject: '',
    topic: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    questionCount: 5,
    timeLimit: 10, // minutes
    provider: 'zai' as string
  })
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({})
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [availableProviders, setAvailableProviders] = useState<string[]>(['zai'])

  useEffect(() => {
    // Fetch available AI providers
    const fetchProviders = async () => {
      try {
        const response = await fetch('/api/ai/providers')
        if (response.ok) {
          const data = await response.json()
          setAvailableProviders(data.providers)
          setQuizConfig(prev => ({ ...prev, provider: data.currentProvider }))
        }
      } catch (error) {
        console.error('Failed to fetch providers:', error)
      }
    }

    fetchProviders()

    let timer: NodeJS.Timeout
    if (mode === 'quiz' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0 && mode === 'quiz') {
      handleSubmitQuiz()
    }
    return () => clearTimeout(timer)
  }, [timeLeft, mode])

  const generateQuiz = async () => {
    setIsGenerating(true)
    
    try {
      // Call AI API to generate questions
      const response = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizConfig)
      })

      if (!response.ok) {
        throw new Error('Failed to generate quiz')
      }

      const data = await response.json()
      setQuestions(data.questions)
      setMode('quiz')
      setTimeLeft(quizConfig.timeLimit * 60) // Convert to seconds
      setStartTime(new Date())
    } catch (error) {
      console.error('Error generating quiz:', error)
      // Fallback to mock questions
      const mockQuestions: Question[] = [
        {
          id: '1',
          question: 'What is the time complexity of binary search in the worst case?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
          correctAnswer: 1,
          explanation: 'Binary search has O(log n) time complexity in the worst case as it divides the search space in half with each iteration.',
          difficulty: quizConfig.difficulty,
          subject: quizConfig.subject,
          topic: quizConfig.topic
        },
        {
          id: '2',
          question: 'Which data structure uses LIFO (Last In First Out) principle?',
          options: ['Queue', 'Stack', 'Array', 'Linked List'],
          correctAnswer: 1,
          explanation: 'Stack follows the LIFO principle where the last element inserted is the first one to be removed.',
          difficulty: quizConfig.difficulty,
          subject: quizConfig.subject,
          topic: quizConfig.topic
        }
      ]
      setQuestions(mockQuestions)
      setMode('quiz')
      setTimeLeft(quizConfig.timeLimit * 60)
      setStartTime(new Date())
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmitQuiz()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitQuiz = () => {
    const correctAnswers = Object.entries(selectedAnswers).filter(
      ([questionId, answerIndex]) => {
        const question = questions.find(q => q.id === questionId)
        return question && question.correctAnswer === answerIndex
      }
    ).length

    const timeTaken = startTime ? Math.floor((new Date().getTime() - startTime.getTime()) / 1000) : 0

    const result: QuizResult = {
      score: Math.round((correctAnswers / questions.length) * 100),
      totalQuestions: questions.length,
      correctAnswers,
      timeTaken,
      difficulty: quizConfig.difficulty,
      subject: quizConfig.subject,
      topic: quizConfig.topic
    }

    setQuizResult(result)
    setMode('results')
  }

  const resetQuiz = () => {
    setMode('setup')
    setQuestions([])
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowResults(false)
    setTimeLeft(0)
    setQuizResult(null)
    setStartTime(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'hard': return 'bg-red-500/20 text-red-300 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  if (mode === 'setup') {
    return (
      <DashboardLayout userRole="STUDENT">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">AI Quiz Generator</h1>
            <p className="text-purple-200">
              Create personalized quizzes with AI-powered questions
            </p>
          </div>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Quiz Configuration
              </CardTitle>
              <CardDescription className="text-purple-200">
                Customize your quiz settings for the best learning experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-white mb-2 block">Subject</Label>
                  <Select value={quizConfig.subject} onValueChange={(value) => setQuizConfig(prev => ({ ...prev, subject: value, topic: '' }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white mb-2 block">Topic</Label>
                  <Select 
                    value={quizConfig.topic} 
                    onValueChange={(value) => setQuizConfig(prev => ({ ...prev, topic: value }))}
                    disabled={!quizConfig.subject}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {quizConfig.subject && topics[quizConfig.subject as keyof typeof topics]?.map(topic => (
                        <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white mb-2 block">Difficulty Level</Label>
                  <Select value={quizConfig.difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setQuizConfig(prev => ({ ...prev, difficulty: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white mb-2 block">AI Provider</Label>
                  <Select value={quizConfig.provider} onValueChange={(value) => setQuizConfig(prev => ({ ...prev, provider: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProviders.map((provider) => (
                        <SelectItem key={provider} value={provider}>
                          {provider === 'gemini' ? 'Google Gemini' : 'ZAI'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white mb-2 block">Number of Questions</Label>
                  <Select value={quizConfig.questionCount.toString()} onValueChange={(value) => setQuizConfig(prev => ({ ...prev, questionCount: parseInt(value) }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Questions</SelectItem>
                      <SelectItem value="5">5 Questions</SelectItem>
                      <SelectItem value="10">10 Questions</SelectItem>
                      <SelectItem value="15">15 Questions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white mb-2 block">Time Limit (minutes)</Label>
                  <Select value={quizConfig.timeLimit.toString()} onValueChange={(value) => setQuizConfig(prev => ({ ...prev, timeLimit: parseInt(value) }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="20">20 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={generateQuiz}
                  disabled={!quizConfig.subject || !quizConfig.topic || isGenerating}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-3"
                >
                  {isGenerating ? (
                    <>
                      <Brain className="w-5 h-5 mr-2 animate-pulse" />
                      Generating Quiz...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Generate Quiz
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Quiz Activity */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 mt-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Recent Quiz Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Data Structures - Trees</h4>
                    <p className="text-purple-200 text-sm">Completed 2 days ago</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-500 text-white">85%</Badge>
                    <span className="text-purple-300 text-sm">5/5 correct</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Algorithm Analysis - Sorting</h4>
                    <p className="text-purple-200 text-sm">Completed 5 days ago</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-yellow-500 text-white">70%</Badge>
                    <span className="text-purple-300 text-sm">7/10 correct</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (mode === 'quiz') {
    const question = questions[currentQuestion]
    const progress = ((currentQuestion + 1) / questions.length) * 100

    return (
      <DashboardLayout userRole="STUDENT">
        <div className="p-6 max-w-4xl mx-auto">
          {/* Quiz Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-white">
                {quizConfig.subject} - {quizConfig.topic}
              </h1>
              <div className="flex items-center space-x-4">
                <Badge className={getDifficultyColor(quizConfig.difficulty)}>
                  {quizConfig.difficulty.toUpperCase()}
                </Badge>
                <div className="flex items-center text-white">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-purple-200 text-sm mt-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>

          {/* Question Card */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-xl">
                {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedAnswers[question.id]?.toString()}
                onValueChange={(value) => handleAnswerSelect(question.id, parseInt(value))}
              >
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-white/5 transition-colors">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="text-white cursor-pointer flex-1">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="border-purple-400 text-purple-200 hover:bg-purple-500 hover:text-white"
            >
              Previous
            </Button>
            <Button
              onClick={handleNextQuestion}
              disabled={!selectedAnswers[question.id]}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (mode === 'results' && quizResult) {
    return (
      <DashboardLayout userRole="STUDENT">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Quiz Completed!</h1>
            <p className="text-purple-200">
              Great job! Here's how you performed
            </p>
          </div>

          {/* Score Card */}
          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border-white/20 mb-6">
            <CardContent className="p-8 text-center">
              <div className="text-6xl font-bold text-white mb-2">{quizResult.score}%</div>
              <div className="text-xl text-purple-200 mb-4">
                {quizResult.correctAnswers} out of {quizResult.totalQuestions} correct
              </div>
              <div className="flex justify-center space-x-8 text-purple-300">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatTime(quizResult.timeTaken)}
                </div>
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-1" />
                  {quizResult.difficulty}
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {quizResult.subject}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Review */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Question Review</CardTitle>
              <CardDescription className="text-purple-200">
                Review your answers and learn from explanations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questions.map((question, index) => {
                  const userAnswer = selectedAnswers[question.id]
                  const isCorrect = userAnswer === question.correctAnswer
                  
                  return (
                    <div key={question.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-medium">Q{index + 1}: {question.question}</h4>
                        <div className="flex items-center">
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="text-purple-200">
                          Your answer: <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                            {userAnswer !== undefined ? question.options[userAnswer] : 'Not answered'}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div className="text-purple-200">
                            Correct answer: <span className="text-green-400">
                              {question.options[question.correctAnswer]}
                            </span>
                          </div>
                        )}
                        <div className="text-purple-300 italic">
                          <Lightbulb className="w-4 h-4 inline mr-1" />
                          {question.explanation}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={resetQuiz}
              variant="outline"
              className="border-purple-400 text-purple-200 hover:bg-purple-500 hover:text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New Quiz
            </Button>
            <Button
              onClick={() => {
                // Generate similar quiz
                generateQuiz()
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Brain className="w-4 h-4 mr-2" />
              Generate Similar Quiz
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return null
}