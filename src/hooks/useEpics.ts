import { useBmadData } from '@/context/BmadDataContext'
import type { Epic } from '@/types/bmad'
import type { BmadError } from '@/lib/errors'

export interface UseEpicsReturn {
  epics: Epic[]
  loading: boolean
  error: BmadError | null
  refetch: () => void
}

export function useEpics(): UseEpicsReturn {
  const { epics, loading, error, refetch } = useBmadData()
  return { epics, loading, error, refetch }
}
