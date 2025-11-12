import { useEffect, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

interface RealtimeResource {
  id: string
  title: string
  description: string
  type: 'pdf' | 'video' | 'link' | 'notes'
  subject: string
  semester: number
  unit?: string
  uploadedBy: string
  fileUrl?: string
  fileName?: string
  fileSize?: number
  created_at?: string
}

interface UseRealtimeResourcesOptions {
  enabled?: boolean
  onResourceAdded?: (resource: RealtimeResource) => void
  onResourceDeleted?: (resourceId: string) => void
}

export function useRealtimeResources({
  enabled = true,
  onResourceAdded,
  onResourceDeleted
}: UseRealtimeResourcesOptions = {}) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  // Set up event listeners when callbacks change
  useEffect(() => {
    if (!socket || !isConnected) return

    const handleResourceAdded = (data: any) => {
      console.log('📥 New resource received:', data.resource.title)
      onResourceAdded?.(data.resource)
    }

    const handleResourceDeleted = (data: any) => {
      console.log('🗑️ Resource deleted:', data.resourceId)
      onResourceDeleted?.(data.resourceId)
    }

    socket.on('resource-uploaded', handleResourceAdded)
    socket.on('resource-deleted', handleResourceDeleted)

    return () => {
      socket.off('resource-uploaded', handleResourceAdded)
      socket.off('resource-deleted', handleResourceDeleted)
    }
  }, [socket, isConnected, onResourceAdded, onResourceDeleted])

  useEffect(() => {
    if (!enabled) return

    // Connect to socket server
    const socketInstance = io(window.location.origin, {
      path: '/api/socketio',
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    })

    socketInstance.on('connect', () => {
      console.log('✓ Connected to real-time server')
      setIsConnected(true)
      // Join resources room
      socketInstance.emit('join-resources')
    })

    socketInstance.on('disconnect', () => {
      console.log('✗ Disconnected from real-time server')
      setIsConnected(false)
    })

    // Listen for connection errors
    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [enabled])

  return {
    socket,
    isConnected
  }
}
