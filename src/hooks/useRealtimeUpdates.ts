import { useEffect, useState, useCallback } from 'react'

interface UseRealtimeUpdatesOptions {
  endpoint: string
  interval?: number
  enabled?: boolean
  dependencies?: any[]
}

export function useRealtimeUpdates<T>({
  endpoint,
  interval = 30000, // 30 seconds default
  enabled = true,
  dependencies = []
}: UseRealtimeUpdatesOptions) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setData(result.data || result.resources || result.announcements || result.mentors)
        setLastUpdated(new Date())
      } else {
        throw new Error(result.error || 'Failed to fetch data')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Real-time update error:', err)
    } finally {
      setLoading(false)
    }
  }, [endpoint, enabled])

  useEffect(() => {
    if (!enabled) return

    // Initial fetch
    fetchData()

    // Set up interval for polling
    const intervalId = setInterval(fetchData, interval)

    return () => clearInterval(intervalId)
  }, [endpoint, enabled, interval])

  const manualRefresh = useCallback(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh: manualRefresh
  }
}
