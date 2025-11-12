'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Volume2 } from 'lucide-react'

interface VoiceNavigationProps {
  userRole?: 'STUDENT' | 'MENTOR' | 'ADMIN'
}

const navigationMap: Record<string, Record<string, string>> = {
  STUDENT: {
    'home': '/student',
    'dashboard': '/student',
    'announcements': '/student/announcements',
    'resources': '/student/resources',
    'timetable': '/student/timetable',
    'results': '/student/results',
    'mentors': '/student/mentors',
    'sessions': '/student/sessions',
    'study': '/student/study',
    'ai assistant': '/student/ai-assistant',
    'quiz': '/student/quiz',
    'placement': '/student/placement',
    'forum': '/student/forum'
  },
  MENTOR: {
    'home': '/mentor',
    'dashboard': '/mentor',
    'students': '/mentor/students',
    'messages': '/mentor/messages',
    'resources': '/mentor/resources',
    'sessions': '/mentor/sessions',
    'profile': '/mentor/profile',
    'earnings': '/mentor/earnings'
  },
  ADMIN: {
    'home': '/admin',
    'dashboard': '/admin',
    'users': '/admin/users',
    'resources': '/admin/resources',
    'announcements': '/admin/announcements',
    'mentors': '/admin/mentors',
    'analytics': '/admin/analytics',
    'settings': '/admin/settings'
  }
}

export function VoiceNavigation({ userRole = 'STUDENT' }: VoiceNavigationProps) {
  const router = useRouter()
  const [feedback, setFeedback] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [permissionRequested, setPermissionRequested] = useState(false)
  const [isRequestingPermission, setIsRequestingPermission] = useState(false)

  const requestMicrophonePermission = useCallback(async () => {
    if (isRequestingPermission || permissionRequested) return true
    
    setIsRequestingPermission(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
      setPermissionRequested(true)
      return true
    } catch (error: any) {
      const errorCode = error.name || 'Unknown'
      console.error('Microphone permission error:', errorCode)
      
      const errorMessages: Record<string, string> = {
        'NotAllowedError': 'Microphone access denied. Please enable microphone in browser settings.',
        'NotFoundError': 'No microphone found. Please connect a microphone device.',
        'NotReadableError': 'Microphone is in use by another application. Please close it and try again.',
        'OverconstrainedError': 'No suitable microphone found.',
        'TypeError': 'Microphone access request failed.',
        'SecurityError': 'HTTPS required for microphone access. Ensure you are on a secure connection.'
      }
      
      setFeedback(`🔴 ${errorMessages[errorCode] || 'Microphone access failed'}`)
      setShowFeedback(true)
      setTimeout(() => setShowFeedback(false), 4000)
      return false
    } finally {
      setIsRequestingPermission(false)
    }
  }, [isRequestingPermission, permissionRequested])

  const handleVoiceCommand = useCallback((command: string) => {
    const cleanedCommand = command.toLowerCase().trim()
    const routes = navigationMap[userRole]
    const targetRoute = routes[cleanedCommand]

    if (targetRoute) {
      setFeedback(`🎯 Navigating to ${cleanedCommand}...`)
      setShowFeedback(true)
      setTimeout(() => setShowFeedback(false), 2000)
      
      speak(`Going to ${cleanedCommand}`)
      
      setTimeout(() => {
        router.push(targetRoute)
      }, 500)
    } else {
      const availableOptions = Object.keys(routes).join(', ')
      setFeedback(`❌ Command not recognized. Try: ${availableOptions.substring(0, 50)}...`)
      setShowFeedback(true)
      setTimeout(() => setShowFeedback(false), 3000)
      
      speak(`Command not recognized`)
    }
  }, [userRole, router])

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1
      utterance.pitch = 1
      utterance.volume = 1
      speechSynthesis.speak(utterance)
    }
  }

  const { isListening, transcript, isSpeechSupported, toggleListening } = useSpeechRecognition({
    enabled: true,
    onResult: handleVoiceCommand,
    onError: (error) => {
      setFeedback(`🔴 Error: ${error}`)
      setShowFeedback(true)
      setTimeout(() => setShowFeedback(false), 3000)
    }
  })

  if (!isSpeechSupported) {
    return null
  }

  return (
    <div className="space-y-2">
      {/* Voice Button */}
      <Button
        onClick={async () => {
          if (!permissionRequested && !isRequestingPermission) {
            const hasPermission = await requestMicrophonePermission()
            if (!hasPermission) return
          }
          toggleListening()
        }}
        disabled={isRequestingPermission}
        className={`w-full transition-all ${
          isRequestingPermission ? 'opacity-50 cursor-not-allowed' : ''
        } ${
          isListening
            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
        } text-white`}
      >
        {isRequestingPermission ? (
          <>
            <Mic className="w-4 h-4 mr-2 animate-spin" />
            Requesting Permission...
          </>
        ) : isListening ? (
          <>
            <MicOff className="w-4 h-4 mr-2 animate-pulse" />
            Stop Listening
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 mr-2" />
            Voice Navigation
          </>
        )}
      </Button>

      {/* Transcript Display */}
      {isListening && transcript && (
        <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm text-blue-200">
          <div className="flex items-center space-x-2 mb-1">
            <Volume2 className="w-4 h-4" />
            <span className="font-semibold">Listening...</span>
          </div>
          <p className="italic">{transcript}</p>
        </div>
      )}

      {/* Feedback Display */}
      {showFeedback && (
        <div className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg text-sm text-purple-200 animate-pulse">
          {feedback}
        </div>
      )}

      {/* Available Commands Help */}
      <details className="text-xs text-purple-300 cursor-pointer">
        <summary className="hover:text-purple-200">📋 Available Commands</summary>
        <div className="mt-2 p-2 bg-white/5 rounded text-purple-200 space-y-1 max-h-40 overflow-y-auto">
          {Object.keys(navigationMap[userRole]).map((cmd) => (
            <div key={cmd} className="hover:bg-white/10 p-1 rounded">
              • {cmd}
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}
