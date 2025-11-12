'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Play, Pause, RotateCcw, GripVertical, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import styles from './floating-study-timer.module.css'

interface TimerPosition {
  x: number
  y: number
}

const STORAGE_KEY = 'floating-timer-state'
const POSITION_KEY = 'floating-timer-position'

export function FloatingStudyTimer() {
  const [minutes, setMinutes] = useState(25) // Pomodoro default
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [position, setPosition] = useState<TimerPosition>({ x: 20, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isMinimized, setIsMinimized] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const timerContainerRef = useRef<HTMLDivElement>(null)
  const lastClickRef = useRef<number>(0)

  // Load saved position and timer state from localStorage
  useEffect(() => {
    try {
      const savedPosition = localStorage.getItem(POSITION_KEY)
      if (savedPosition) {
        setPosition(JSON.parse(savedPosition))
      }

      const savedState = localStorage.getItem(STORAGE_KEY)
      if (savedState) {
        const { minutes: m, seconds: s } = JSON.parse(savedState)
        setMinutes(m)
        setSeconds(s)
      }
    } catch (error) {
      console.warn('Could not load timer state from localStorage:', error)
    }
  }, [])

  // Save position to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(POSITION_KEY, JSON.stringify(position))
    } catch (error) {
      console.warn('Could not save timer position:', error)
    }
  }, [position])

  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ minutes, seconds }))
    } catch (error) {
      console.warn('Could not save timer state:', error)
    }
  }, [minutes, seconds])

  // Load and save minimized state
  useEffect(() => {
    const savedMinimized = localStorage.getItem(`${STORAGE_KEY}_minimized`)
    if (savedMinimized === 'true') {
      setIsMinimized(true)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_minimized`, isMinimized.toString())
  }, [isMinimized])

  // Timer interval logic
  useEffect(() => {
    if (!isRunning) return

    timerRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev > 0) {
          return prev - 1
        } else if (minutes > 0) {
          setMinutes((m) => m - 1)
          return 59
        } else {
          // Timer finished
          setIsRunning(false)
          playTimerSound()
          return 0
        }
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRunning, minutes])

  const playTimerSound = () => {
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Time is up!')
        utterance.rate = 1
        speechSynthesis.speak(utterance)
      }
    } catch (error) {
      console.warn('Could not play timer sound:', error)
    }
  }

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!timerContainerRef.current) return
      
      // Only allow dragging from the grip area or title
      const target = e.target as HTMLElement
      if (!target.closest('[data-draggable]')) return

      setIsDragging(true)
      const rect = timerContainerRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    },
    []
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !timerContainerRef.current) return

      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y

      // Constrain to window bounds
      const maxX = window.innerWidth - timerContainerRef.current.offsetWidth
      const maxY = window.innerHeight - timerContainerRef.current.offsetHeight

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      })
    },
    [isDragging, dragOffset]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setMinutes(25)
    setSeconds(0)
  }

  const handleDoubleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    // Only toggle minimize on the header area (grip or title)
    if (target.closest('[data-draggable]')) {
      e.preventDefault()
      setIsMinimized(!isMinimized)
    }
  }, [isMinimized])

  const incrementMinutes = () => {
    if (!isRunning && minutes < 120) {
      setMinutes(minutes + 1)
    }
  }

  const decrementMinutes = () => {
    if (!isRunning && minutes > 1) {
      setMinutes(minutes - 1)
    }
  }

  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const totalSeconds = minutes * 60 + seconds
  const totalInitialSeconds = 25 * 60 // Pomodoro default
  const progress = ((totalInitialSeconds - totalSeconds) / totalInitialSeconds) * 100

  return (
    <div
      ref={timerContainerRef}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      className={styles.timerContainer}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      data-dragging={isDragging}
    >
      {/* Minimized View */}
      {isMinimized ? (
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-2xl border border-indigo-400/30 backdrop-blur-sm p-3 w-32">
          <div data-draggable className="text-center cursor-grab active:cursor-grabbing">
            <div className="text-2xl font-bold text-white font-mono mb-2">{formattedTime}</div>
            <Button
              onClick={() => setIsMinimized(false)}
              size="sm"
              variant="ghost"
              className="w-full h-6 text-xs text-indigo-200 hover:text-white hover:bg-indigo-600/50"
            >
              Expand
            </Button>
          </div>
        </div>
      ) : (
        /* Expanded View */
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-2xl border border-indigo-400/30 backdrop-blur-sm p-4 w-64">
          {/* Header - Draggable Area */}
          <div data-draggable className="flex items-center justify-between mb-4 cursor-grab active:cursor-grabbing">
            <div className="flex items-center space-x-2">
              <GripVertical className="w-4 h-4 text-indigo-200" />
              <h3 className="text-sm font-semibold text-white">Study Timer</h3>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4 h-1 bg-indigo-900/50 rounded-full overflow-hidden">
            <div
              className={styles.progressBar}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          {/* Timer Display */}
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-white font-mono mb-2">{formattedTime}</div>
            <div className="text-xs text-indigo-200">
              {isRunning ? '⏱️ Running' : '⏸️ Paused'}
            </div>
          </div>

          {/* Time Adjustment Controls (when paused) */}
          {!isRunning && (
            <div className="flex items-center justify-center space-x-3 mb-4 bg-indigo-700/30 rounded-lg p-2">
              <Button
                onClick={decrementMinutes}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-indigo-200 hover:text-white hover:bg-indigo-600/50"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-sm text-indigo-200 min-w-12 text-center">{minutes} min</span>
              <Button
                onClick={incrementMinutes}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-indigo-200 hover:text-white hover:bg-indigo-600/50"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex space-x-2">
            <Button
              onClick={toggleTimer}
              className={`flex-1 h-10 font-semibold transition-all ${
                isRunning
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              } text-white`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </>
              )}
            </Button>
            <Button
              onClick={resetTimer}
              className="flex-1 h-10 font-semibold bg-gray-600 hover:bg-gray-700 text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Tips */}
          <div className="mt-3 text-xs text-indigo-300 text-center">
            💡 Drag to move • Double-click to minimize
          </div>
        </div>
      )}
    </div>
  )
}
