import { useEffect, useState, useCallback, useRef } from 'react'

interface UseSpeechRecognitionOptions {
  enabled?: boolean
  onResult?: (transcript: string) => void
  onError?: (error: string) => void
  language?: string
}

export function useSpeechRecognition({
  enabled = false,
  onResult,
  onError,
  language = 'en-US'
}: UseSpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSpeechSupported, setIsSpeechSupported] = useState(false)
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null)
  const [microphonePermission, setMicrophonePermission] = useState<'granted' | 'denied' | 'prompt'>('prompt')
  const [audioDeviceAvailable, setAudioDeviceAvailable] = useState(true)
  // Refs for retrying transient network errors from SpeechRecognition
  const retryRef = useRef(0)
  const retryTimeoutRef = useRef<number | null>(null)
  const MAX_NETWORK_RETRIES = 3

  // Check microphone permission on mount
  useEffect(() => {
    const checkMicrophonePermission = async () => {
      if ('permissions' in navigator) {
        try {
          const result = await navigator.permissions.query({ name: 'microphone' as PermissionName })
          setMicrophonePermission(result.state as any)
        } catch (error) {
          console.warn('Could not check microphone permission:', error)
        }
      }
    }

    checkMicrophonePermission()
  }, [])

  // Check for audio input devices
  useEffect(() => {
    const checkAudioDevices = async () => {
      try {
        if ('enumerateDevices' in navigator.mediaDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices()
          const audioInputDevices = devices.filter((device) => device.kind === 'audioinput')
          setAudioDeviceAvailable(audioInputDevices.length > 0)
          
          if (audioInputDevices.length === 0) {
            console.warn('No audio input devices found')
          }
        }
      } catch (error) {
        console.warn('Could not enumerate audio devices:', error)
      }
    }

    checkAudioDevices()
  }, [])

  // Initialize speech recognition once
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      return
    }

    if (!audioDeviceAvailable) {
      return
    }

    setIsSpeechSupported(true)
    const recognition = new SpeechRecognition()
    
    recognition.continuous = false
    recognition.interimResults = true
    recognition.language = language
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      setTranscript('')
      // Reset retry counter and clear any pending retry timeout when recognition starts
      retryRef.current = 0
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = null
      }
    }

    recognition.onresult = (event: any) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript

        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }

      const fullTranscript = (finalTranscript || interimTranscript).trim()
      setTranscript(fullTranscript)

      if (finalTranscript && onResult) {
        onResult(finalTranscript)
      }

      // Successful result -> reset retry counter and clear any pending retry
      retryRef.current = 0
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = null
      }
    }

    recognition.onerror = (event: any) => {
      let errorMessage = event.error || 'Speech recognition error'

      const errorMap: Record<string, string> = {
        'no-speech': 'No speech detected. Try speaking clearly into the microphone.',
        'audio-capture': 'No microphone found. Check your device settings or connect a microphone.',
        'network': 'Network error. The speech service may be unreachable. Check your connection.',
        'not-allowed': 'Microphone access denied. Allow microphone permission for this site in your browser.',
        'service-not-allowed': 'Speech recognition service unavailable in your region or blocked by browser settings.',
        'bad-grammar': 'Unable to parse speech. Try rephrasing your command.',
  'aborted': 'Speech recognition was aborted. Try starting it again.'
      }

      // Compose a friendly, actionable message
      const friendly = errorMap[event.error] || errorMessage

      if (onError) {
        onError(friendly)
      }

      // Log with appropriate severity
      if (event.error === 'network') {
        console.warn('Speech recognition network error:', event.error, '-', friendly)
      } else {
        console.error('Speech recognition error:', event.error, '-', friendly)
      }

      // If the browser reports a network error, first check if we're actually offline.
      // If offline, surface a clear error and don't attempt retries until online.
      if (event.error === 'network') {
        if (typeof navigator !== 'undefined' && 'onLine' in navigator && !navigator.onLine) {
          const offlineMsg = 'No internet connection. Please reconnect to use voice navigation.'
          if (onError) onError(offlineMsg)
          console.warn('Speech recognition aborted due to offline state')

          // Do not schedule retries while offline; wait for the 'online' event.
          return
        }

        // Otherwise, proceed with transient retry logic.
        // Use a ref to avoid triggering re-renders.
        // Clear any previous timeout
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current)
          retryTimeoutRef.current = null
        }

        if (retryRef.current < MAX_NETWORK_RETRIES) {
          const backoff = 1000 * Math.pow(2, retryRef.current) // 1s, 2s, 4s
          retryRef.current += 1

          try {
            // schedule a restart attempt
            retryTimeoutRef.current = window.setTimeout(() => {
              try {
                // Attempt to restart the recognition instance if still present
                recognition.start()
                console.info('Retrying speech recognition (attempt', retryRef.current, ')')
              } catch (startErr) {
                console.warn('Retry start failed:', startErr)
              }
            }, backoff)
          } catch (scheduleErr) {
            console.warn('Could not schedule recognition retry:', scheduleErr)
          }
        } else {
          console.warn('Max speech recognition network retries reached')
        }
      }
    }

    // If the browser goes online after being offline, attempt to restart recognition.
    const handleOnline = () => {
      try {
        if (recognition && typeof navigator !== 'undefined' && navigator.onLine) {
          // Only attempt restart if recognition is not already listening
          try {
            recognition.start()
            retryRef.current = 0
            if (retryTimeoutRef.current) {
              clearTimeout(retryTimeoutRef.current)
              retryTimeoutRef.current = null
            }
            console.info('Browser is online — restarted speech recognition')
          } catch (startErr) {
            console.warn('Failed to restart recognition on online event:', startErr)
          }
        }
      } catch (e) {
        console.warn('Online handler error:', e)
      }
    }

    window.addEventListener('online', handleOnline)

    recognition.onend = () => {
      setIsListening(false)
    }

    // Handler when speech was detected but no grammar matched
    if ('onnomatch' in recognition) {
      try {
        recognition.onnomatch = () => {
          const msg = 'No recognizable command detected. Try saying a command from the help list.'
          if (onError) onError(msg)
          console.info('Speech recognition: nomatch')
        }
      } catch (e) {
        // ignore if not supported
      }
    }

    setRecognitionInstance(recognition)

    // Cleanup: abort recognition when unmounting
    return () => {
      // Remove online listener
      try {
        window.removeEventListener('online', handleOnline)
      } catch (e) {
        // ignore
      }

      // Clear any scheduled retry timeout
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = null
      }
      try {
        recognition.abort()
      } catch (e) {
        console.warn('Error aborting recognition:', e)
      }
    }
  }, [audioDeviceAvailable, language])

  const startListening = useCallback(() => {
    if (recognitionInstance && !isListening) {
      recognitionInstance.start()
    }
  }, [recognitionInstance, isListening])

  const stopListening = useCallback(() => {
    if (recognitionInstance && isListening) {
      recognitionInstance.stop()
    }
  }, [recognitionInstance, isListening])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  return {
    isListening,
    transcript,
    isSpeechSupported,
    startListening,
    stopListening,
    toggleListening
  }
}
