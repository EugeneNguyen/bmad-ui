import { useState, useEffect, useCallback, useRef } from 'react'
import type { Story } from '@/types/bmad'

export interface UseStoryChangesReturn {
  hasChanges: boolean
  lastChecked: Date | null
  checkNow: () => Promise<void>
  clearChanges: () => void
  error: string | null
}

const STORAGE_KEY = 'bmad-story-hash'
const POLL_INTERVAL = 30000

export function useStoryChanges(stories: Story[]): UseStoryChangesReturn {
  const [hasChanges, setHasChanges] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const generateHash = useCallback((data: Story[]): string => {
    const str = JSON.stringify(data.map((s) => ({ id: s.id, status: s.status, title: s.title })))
    return `${str.length}-${str.slice(0, 50)}-${str.slice(-50)}`
  }, [])

  const checkForChanges = useCallback(async () => {
    try {
      const currentHash = generateHash(stories)
      const storedHash = sessionStorage.getItem(STORAGE_KEY)

      if (storedHash && storedHash !== currentHash) {
        setHasChanges(true)
      } else {
        setHasChanges(false)
      }

      setLastChecked(new Date())
      setError(null)
    } catch (err) {
      setError('Failed to check for changes')
      setHasChanges(false)
      console.error('Change detection error:', err)
    }
  }, [stories, generateHash])

  const clearChanges = useCallback(() => {
    const currentHash = generateHash(stories)
    sessionStorage.setItem(STORAGE_KEY, currentHash)
    setHasChanges(false)
  }, [stories, generateHash])

  const checkNow = useCallback(async () => {
    await checkForChanges()
  }, [checkForChanges])

  useEffect(() => {
    try {
      const currentHash = generateHash(stories)
      const storedHash = sessionStorage.getItem(STORAGE_KEY)

      if (!storedHash) {
        sessionStorage.setItem(STORAGE_KEY, currentHash)
      }
    } catch (err) {
      setError('Failed to initialize change detection')
      console.error('Change detection initialization error:', err)
    }
  }, [stories, generateHash])

  useEffect(() => {
    intervalRef.current = setInterval(checkForChanges, POLL_INTERVAL)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [checkForChanges])

  return { hasChanges, lastChecked, checkNow, clearChanges, error }
}
