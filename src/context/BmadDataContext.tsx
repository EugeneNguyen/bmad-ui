import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import type { Story, Epic, SprintStatus } from '@/types/bmad'
import { api } from '@/lib/api'
import type { BmadError } from '@/lib/errors'

interface BmadDataContextValue {
  stories: Story[]
  epics: Epic[]
  sprintStatus: SprintStatus | null
  loading: boolean
  error: BmadError | null
  refetch: () => void
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

  return (
    <BmadDataContext.Provider
      value={{
        stories,
        epics,
        sprintStatus,
        loading,
        error,
        refetch: fetchData,
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
