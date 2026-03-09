import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import type { Story, Epic, SprintStatus } from '@/types/bmad'
import { api } from '@/lib/api'
import type { BmadError } from '@/lib/errors'

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
  sprintStatus: SprintStatus | null
  changes: ChangeCounts
  changeIds: ChangeIds
}

interface BmadDataContextValue {
  stories: Story[]
  epics: Epic[]
  sprintStatus: SprintStatus | null
  loading: boolean
  error: BmadError | null
  refetch: () => void
  refresh: () => Promise<RefreshResult | null>
}

const BmadDataContext = createContext<BmadDataContextValue | null>(null)

export { BmadDataContext }
export function BmadDataProvider({ children }: { children: ReactNode }) {
  const [stories, setStories] = useState<Story[]>([])
  const [epics, setEpics] = useState<Epic[]>([])
  const [sprintStatus, setSprintStatus] = useState<SprintStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<BmadError | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [storiesRes, epicsRes, sprintRes] = await Promise.all([
        api.get<Story[]>('/stories'),
        api.get<Epic[]>('/epics'),
        api.get<SprintStatus>('/sprint'),
      ])
      setStories(storiesRes.data)
      setEpics(epicsRes.data)
      setSprintStatus(sprintRes.data)
    } catch (err) {
      setError(err as BmadError)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refresh = useCallback(async (): Promise<RefreshResult | null> => {
    try {
      const res = await api.post<{
        stories: Story[]
        epics: Epic[]
        sprint: SprintStatus
        changes: ChangeCounts
        changeIds: ChangeIds
      }>('/refresh')

      const data = res.data
      setStories(data.stories)
      setEpics(data.epics)
      setSprintStatus(data.sprint)

      return {
        stories: data.stories,
        epics: data.epics,
        sprintStatus: data.sprint,
        changes: data.changes,
        changeIds: data.changeIds,
      }
    } catch (err) {
      setError(err as BmadError)
      return null
    }
  }, [])

  return (
    <BmadDataContext.Provider
      value={{
        stories,
        epics,
        sprintStatus,
        loading,
        error,
        refetch: fetchData,
        refresh,
      }}
    >
      {children}
    </BmadDataContext.Provider>
  )
}

export function useBmadData() {
  const context = useContext(BmadDataContext)
  if (!context) {
    throw new Error('useBmadData must be used within BmadDataProvider')
  }
  return context
}
