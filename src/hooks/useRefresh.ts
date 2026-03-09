import { useState, useCallback, useRef } from 'react'
import { api } from '@/lib/api'
import type { BmadError } from '@/lib/errors'
import type { Story, Epic, SprintStatus } from '@/types/bmad'

export interface ChangeCounts {
  added: number
  updated: number
  removed: number
}

export interface ChangeIds {
  addedIds: string[]
  updatedIds: string[]
  removedIds: string[]
}

export interface RefreshResult {
  stories: Story[]
  epics: Epic[]
  sprint: SprintStatus
  changes: ChangeCounts
  changeIds: ChangeIds
}

export interface UseRefreshReturn {
  refresh: () => Promise<RefreshResult | null>
  isLoading: boolean
  error: BmadError | null
  lastRefreshed: Date | null
}

interface RefreshResponse {
  stories: Story[]
  epics: Epic[]
  sprint: SprintStatus
  changes: ChangeCounts
  changeIds: ChangeIds
  timestamp: string
}

export function useRefresh(): UseRefreshReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<BmadError | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)
  const previousHashRef = useRef<string | null>(null)

  const generateHash = (stories: Story[]): string => {
    const str = JSON.stringify(stories.map((s) => ({ id: s.id, status: s.status, title: s.title })))
    return `${str.length}-${str.slice(0, 50)}-${str.slice(-50)}`
  }

  const refresh = useCallback(async (): Promise<RefreshResult | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.post<RefreshResponse>('/refresh')
      const data = response.data

      const currentHash = generateHash(data.stories)
      previousHashRef.current = currentHash

      setLastRefreshed(new Date())

      return {
        stories: data.stories,
        epics: data.epics,
        sprint: data.sprint,
        changes: data.changes,
        changeIds: data.changeIds,
      }
    } catch (err) {
      setError(err as BmadError)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    refresh,
    isLoading,
    error,
    lastRefreshed,
  }
}
