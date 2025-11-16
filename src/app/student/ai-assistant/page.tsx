'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Brain, 
  FileText, 
  MessageSquare, 
  HelpCircle, 
  BookOpen, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Send,
  Download,
  RefreshCw,
  Sparkles,
  GraduationCap,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Copy
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface GeneratedContent {
  type: 'summary' | 'explanation' | 'assignment' | 'quiz'
  content: string
  metadata?: any
}

export default function AIAssistant() {
  const { user, isAuthenticated } = useAuth()
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // Could add a toast here
    } catch (e) {
      console.error('Copy failed', e)
    }
  }
  const [activeTab, setActiveTab] = useState('chat')
  const [loading, setLoading] = useState(false)
  const [voiceMode, setVoiceMode] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)
  
  // Quiz Generator state
  const [quizTopic, setQuizTopic] = useState('')
  const [quizDifficulty, setQuizDifficulty] = useState('medium')
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  
  // Note Summarizer state
  const [noteText, setNoteText] = useState('')
  const [summary, setSummary] = useState('')
  const [summaryLength, setSummaryLength] = useState('medium')
  
  // Problem Explainer state
  const [problemText, setProblemText] = useState('')
  const [explanation, setExplanation] = useState('')
  const [explanationType, setExplanationType] = useState('detailed')
  
  // Assignment Helper state
  const [assignmentTopic, setAssignmentTopic] = useState('')
  const [assignmentType, setAssignmentType] = useState('essay')
  const [assignmentHelp, setAssignmentHelp] = useState('')
  
  // Speech recognition
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return
    }

    // Initialize speech recognition if available
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setCurrentMessage(transcript)
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const toggleVoiceMode = () => {
    setVoiceMode(!voiceMode)
    if (!voiceMode) {
      // Request microphone permission
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          console.log('Microphone access granted')
        })
        .catch(() => {
          console.log('Microphone access denied')
          setVoiceMode(false)
        })
    }
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false)
      recognitionRef.current.stop()
    }
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const sendMessage = async () => {
    if (!currentMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: currentMessage,
          context: 'academic_help'
        })
      })

      const data = await response.json()

      if (response.ok) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        }

        setMessages(prev => [...prev, assistantMessage])

        // Auto-speak if voice mode is enabled
        if (voiceMode) {
          speakText(data.response)
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateQuiz = async () => {
    if (!quizTopic.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          topic: quizTopic,
          difficulty: quizDifficulty,
          questionCount: 5
        })
      })

      const data = await response.json()

      if (response.ok) {
        setQuizQuestions(data.questions)
        setCurrentQuizIndex(0)
        setSelectedAnswers([])
        setShowResults(false)
        setQuizScore(0)
      }
    } catch (error) {
      console.error('Error generating quiz:', error)
    } finally {
      setLoading(false)
    }
  }

  const summarizeNotes = async () => {
    if (!noteText.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          text: noteText,
          length: summaryLength
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSummary(data.summary)
      }
    } catch (error) {
      console.error('Error summarizing notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const explainProblem = async () => {
    if (!problemText.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          problem: problemText,
          type: explanationType
        })
      })

      const data = await response.json()

      if (response.ok) {
        setExplanation(data.explanation)
      }
    } catch (error) {
      console.error('Error explaining problem:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateAssignmentHelp = async () => {
    if (!assignmentTopic.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/ai/assignment-help', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          topic: assignmentTopic,
          type: assignmentType
        })
      })

      const data = await response.json()

      if (response.ok) {
        setAssignmentHelp(data.help)
      }
    } catch (error) {
      console.error('Error generating assignment help:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuizIndex] = answerIndex
    setSelectedAnswers(newAnswers)

    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1)
    } else {
      // Calculate score
      let score = 0
      newAnswers.forEach((answer, index) => {
        if (answer === quizQuestions[index].correctAnswer) {
          score++
        }
      })
      setQuizScore(score)
      setShowResults(true)
    }
  }

  if (!isAuthenticated || !user) {
    return (
      <DashboardLayout userRole="STUDENT">
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Please log in to access the AI Assistant</div>
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
            <h1 className="text-4xl font-bold text-white mb-2">AI Academic Assistant</h1>
            <p className="text-purple-200">Your intelligent learning companion for academic success</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={toggleVoiceMode}
              variant={voiceMode ? "default" : "outline"}
              className={voiceMode ? "bg-green-500 hover:bg-green-600" : "border-purple-400 text-purple-200"}
            >
              {voiceMode ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
              Voice Mode {voiceMode ? 'ON' : 'OFF'}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/10 border-white/20">
            <TabsTrigger value="chat" className="text-white data-[state=active]:bg-purple-500">
              <MessageSquare className="w-4 h-4 mr-2" />
              Doubt Solver
            </TabsTrigger>
            <TabsTrigger value="quiz" className="text-white data-[state=active]:bg-purple-500">
              <Brain className="w-4 h-4 mr-2" />
              Quiz Generator
            </TabsTrigger>
            <TabsTrigger value="summarize" className="text-white data-[state=active]:bg-purple-500">
              <FileText className="w-4 h-4 mr-2" />
              Summarize Notes
            </TabsTrigger>
            <TabsTrigger value="explain" className="text-white data-[state=active]:bg-purple-500">
              <Lightbulb className="w-4 h-4 mr-2" />
              Explain Problems
            </TabsTrigger>
            <TabsTrigger value="assignment" className="text-white data-[state=active]:bg-purple-500">
              <GraduationCap className="w-4 h-4 mr-2" />
              Assignment Helper
            </TabsTrigger>
          </TabsList>

          {/* Doubt Solver Chatbot */}
          <TabsContent value="chat">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  AI Doubt Solver
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Ask any academic question and get instant help from our AI tutor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Chat Messages */}
                  <div className="h-96 overflow-y-auto space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
                    {messages.length === 0 && (
                      <div className="text-center text-purple-200 py-8">
                        <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Start a conversation with your AI tutor!</p>
                        <p className="text-sm mt-2">Ask questions about any subject, get explanations, or seek homework help.</p>
                      </div>
                    )}
                    
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-lg p-3 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-purple-500 text-white'
                              : 'bg-white/10 text-purple-200 border border-white/20'
                          }`}
                        >
                          {message.role === 'assistant' ? (
                            <div className="space-y-2">
                              <div className="prose prose-invert text-sm max-w-none">
                                <ReactMarkdown
                                  components={{
                                    code({node, inline, className, children, ...props}: any){
                                      if (inline) {
                                        return <code className="bg-white/10 px-1 rounded">{children}</code>
                                      }
                                      return (
                                        <pre className="bg-zinc-900 text-white p-3 rounded overflow-auto text-sm"><code {...props}>{children}</code></pre>
                                      )
                                    }
                                  }}
                                >
                                  {message.content}
                                </ReactMarkdown>
                              </div>

                              <div className="flex items-center justify-between">
                                <p className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</p>
                                <Button size="sm" variant="outline" onClick={() => copyToClipboard(message.content)}>
                                  <Copy className="w-4 h-4 mr-2" /> Copy
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {loading && (
                      <div className="flex justify-start">
                        <div className="bg-white/10 text-purple-200 border border-white/20 p-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span className="text-sm">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={chatEndRef} />
                  </div>

                  {/* Voice Controls */}
                  {voiceMode && (
                    <div className="flex items-center justify-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10">
                      <Button
                        onClick={isListening ? stopListening : startListening}
                        variant={isListening ? "destructive" : "default"}
                        size="sm"
                      >
                        {isListening ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                        {isListening ? 'Stop Recording' : 'Start Recording'}
                      </Button>
                      
                      {isSpeaking && (
                        <Button onClick={stopSpeaking} variant="outline" size="sm">
                          <Pause className="w-4 h-4 mr-2" />
                          Stop Speaking
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Message Input */}
                  <div className="flex space-x-2">
                    <Input
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder="Ask your academic question..."
                      className="flex-1 bg-white/10 border-white/20 text-white placeholder-purple-300"
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      disabled={loading}
                    />
                    <Button onClick={sendMessage} disabled={loading || !currentMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quiz Generator */}
          <TabsContent value="quiz">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  AI Quiz Generator
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Generate custom quizzes based on any topic or subject
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Quiz Generation */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="quiz-topic" className="text-purple-200">Topic/Subject</Label>
                      <Input
                        id="quiz-topic"
                        value={quizTopic}
                        onChange={(e) => setQuizTopic(e.target.value)}
                        placeholder="e.g., Data Structures, Calculus, World History"
                        className="bg-white/10 border-white/20 text-white placeholder-purple-300"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="quiz-difficulty" className="text-purple-200">Difficulty Level</Label>
                      <Select value={quizDifficulty} onValueChange={setQuizDifficulty}>
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

                    <Button 
                      onClick={generateQuiz} 
                      disabled={loading || !quizTopic.trim()}
                      className="w-full"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Generating Quiz...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Quiz
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Quiz Display */}
                  {quizQuestions.length > 0 && !showResults && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold">
                          Question {currentQuizIndex + 1} of {quizQuestions.length}
                        </h3>
                        <Badge variant="outline" className="border-purple-400 text-purple-200">
                          {quizDifficulty}
                        </Badge>
                      </div>
                      
                      <Progress value={((currentQuizIndex + 1) / quizQuestions.length) * 100} className="h-2" />
                      
                      <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-6">
                          <h4 className="text-white font-medium mb-4">
                            {quizQuestions[currentQuizIndex].question}
                          </h4>
                          
                          <div className="space-y-2">
                            {quizQuestions[currentQuizIndex].options.map((option, index) => (
                              <Button
                                key={index}
                                onClick={() => handleQuizAnswer(index)}
                                variant="outline"
                                className={`w-full justify-start text-left h-auto p-3 ${
                                  selectedAnswers[currentQuizIndex] === index
                                    ? 'bg-purple-500 border-purple-500 text-white'
                                    : 'border-white/20 text-purple-200 hover:bg-white/10'
                                }`}
                              >
                                {String.fromCharCode(65 + index)}. {option}
                              </Button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Quiz Results */}
                  {showResults && (
                    <div className="space-y-4">
                      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 border-none">
                        <CardContent className="p-6 text-center">
                          <h3 className="text-white text-2xl font-bold mb-2">Quiz Complete!</h3>
                          <p className="text-white text-lg">
                            Your Score: {quizScore} out of {quizQuestions.length}
                          </p>
                          <p className="text-white/80">
                            {Math.round((quizScore / quizQuestions.length) * 100)}% Correct
                          </p>
                        </CardContent>
                      </Card>

                      <div className="space-y-3">
                        {quizQuestions.map((question, index) => (
                          <Card key={index} className="bg-white/5 border-white/10">
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  selectedAnswers[index] === question.correctAnswer
                                    ? 'bg-green-500'
                                    : 'bg-red-500'
                                }`}>
                                  {selectedAnswers[index] === question.correctAnswer ? (
                                    <CheckCircle className="w-4 h-4 text-white" />
                                  ) : (
                                    <AlertCircle className="w-4 h-4 text-white" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-white font-medium mb-2">{question.question}</p>
                                  <p className="text-purple-200 text-sm">
                                    <strong>Correct Answer:</strong> {question.options[question.correctAnswer]}
                                  </p>
                                  <p className="text-purple-300 text-sm mt-1">{question.explanation}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <Button onClick={() => setQuizQuestions([])} className="w-full">
                        Generate New Quiz
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Note Summarizer */}
          <TabsContent value="summarize">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  AI Note Summarizer
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Convert lengthy notes into concise, easy-to-understand summaries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="note-text" className="text-purple-200">Paste your notes here</Label>
                      <Textarea
                        id="note-text"
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Paste your lecture notes, textbook content, or any study material..."
                        className="min-h-32 bg-white/10 border-white/20 text-white placeholder-purple-300"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="summary-length" className="text-purple-200">Summary Length</Label>
                      <Select value={summaryLength} onValueChange={setSummaryLength}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Brief (2-3 sentences)</SelectItem>
                          <SelectItem value="medium">Medium (1 paragraph)</SelectItem>
                          <SelectItem value="long">Detailed (2-3 paragraphs)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={summarizeNotes} 
                      disabled={loading || !noteText.trim()}
                      className="w-full"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Summarizing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Summary
                        </>
                      )}
                    </Button>
                  </div>

                  {summary && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold">Generated Summary</h3>
                        <Button
                          onClick={() => {
                            navigator.clipboard.writeText(summary)
                            // You could add a toast notification here
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                      
                      <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-6">
                          <p className="text-purple-200 leading-relaxed">{summary}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Problem Explainer */}
          <TabsContent value="explain">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  AI Problem Explainer
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Get detailed explanations for complex problems, formulas, and concepts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="problem-text" className="text-purple-200">Problem or Concept</Label>
                      <Textarea
                        id="problem-text"
                        value={problemText}
                        onChange={(e) => setProblemText(e.target.value)}
                        placeholder="Enter a problem, formula, or concept you want explained..."
                        className="min-h-24 bg-white/10 border-white/20 text-white placeholder-purple-300"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="explanation-type" className="text-purple-200">Explanation Type</Label>
                      <Select value={explanationType} onValueChange={setExplanationType}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="simple">Simple Explanation</SelectItem>
                          <SelectItem value="detailed">Detailed Explanation</SelectItem>
                          <SelectItem value="step-by-step">Step-by-Step Solution</SelectItem>
                          <SelectItem value="examples">With Examples</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={explainProblem} 
                      disabled={loading || !problemText.trim()}
                      className="w-full"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Explaining...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Get Explanation
                        </>
                      )}
                    </Button>
                  </div>

                  {explanation && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold">Explanation</h3>
                        <Button
                          onClick={() => {
                            navigator.clipboard.writeText(explanation)
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                      
                      <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-6">
                          <div className="text-purple-200 leading-relaxed whitespace-pre-wrap">
                            {explanation}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignment Helper */}
          <TabsContent value="assignment">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  AI Assignment Helper
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Get AI-generated suggestions, outlines, and guidance for your assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="assignment-topic" className="text-purple-200">Assignment Topic</Label>
                      <Input
                        id="assignment-topic"
                        value={assignmentTopic}
                        onChange={(e) => setAssignmentTopic(e.target.value)}
                        placeholder="e.g., Climate Change Impact, Shakespeare's Hamlet, Quantum Physics"
                        className="bg-white/10 border-white/20 text-white placeholder-purple-300"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="assignment-type" className="text-purple-200">Assignment Type</Label>
                      <Select value={assignmentType} onValueChange={setAssignmentType}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="essay">Essay</SelectItem>
                          <SelectItem value="research">Research Paper</SelectItem>
                          <SelectItem value="presentation">Presentation</SelectItem>
                          <SelectItem value="report">Report</SelectItem>
                          <SelectItem value="case-study">Case Study</SelectItem>
                          <SelectItem value="proposal">Project Proposal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={generateAssignmentHelp} 
                      disabled={loading || !assignmentTopic.trim()}
                      className="w-full"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Generating Help...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Get Assignment Help
                        </>
                      )}
                    </Button>
                  </div>

                  {assignmentHelp && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold">AI-Generated Assistance</h3>
                        <Button
                          onClick={() => {
                            navigator.clipboard.writeText(assignmentHelp)
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                      
                      <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-6">
                          <div className="text-purple-200 leading-relaxed whitespace-pre-wrap">
                            {assignmentHelp}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Alert className="bg-blue-500/20 border-blue-500/50">
                        <AlertCircle className="h-4 w-4 text-blue-400" />
                        <AlertDescription className="text-blue-200">
                          Use this as a starting point and reference. Make sure to add your own analysis and properly cite any sources.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}