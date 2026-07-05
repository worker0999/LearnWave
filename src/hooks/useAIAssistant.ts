import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

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

export function useAIAssistant() {
  const { user, isAuthenticated, token } = useAuth()
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
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
          'Authorization': `Bearer ${token}`
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
          'Authorization': `Bearer ${token}`
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
          'Authorization': `Bearer ${token}`
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
          'Authorization': `Bearer ${token}`
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
          'Authorization': `Bearer ${token}`
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

  

  return {
    activeTab,
    setActiveTab,
    loading,
    setLoading,
    voiceMode,
    setVoiceMode,
    isListening,
    setIsListening,
    isSpeaking,
    setIsSpeaking,
    messages,
    setMessages,
    currentMessage,
    setCurrentMessage,
    chatEndRef,
    quizTopic,
    setQuizTopic,
    quizDifficulty,
    setQuizDifficulty,
    quizQuestions,
    setQuizQuestions,
    currentQuizIndex,
    setCurrentQuizIndex,
    selectedAnswers,
    setSelectedAnswers,
    showResults,
    setShowResults,
    quizScore,
    setQuizScore,
    noteText,
    setNoteText,
    summary,
    setSummary,
    summaryLength,
    setSummaryLength,
    problemText,
    setProblemText,
    explanation,
    setExplanation,
    explanationType,
    setExplanationType,
    assignmentTopic,
    setAssignmentTopic,
    assignmentType,
    setAssignmentType,
    assignmentHelp,
    setAssignmentHelp,
    toggleVoiceMode,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
    sendMessage,
    generateQuiz,
    summarizeNotes,
    explainProblem,
    generateAssignmentHelp,
    handleQuizAnswer,
    copyToClipboard
  }
}
