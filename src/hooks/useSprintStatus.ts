import { useBmadData } from '@/context/BmadDataContext'
import type { SprintStatus } from '@/types/bmad'
import type { BmadError } from '@/lib/errors'

export interface UseSprintStatusReturn {
  sprintStatus: SprintStatus | null
  loading: boolean
  error: BmadError | null
  refetch: () => void
}

export function useSprintStatus(): UseSprintStatusReturn {
  const { sprintStatus, loading, error, refetch } = useBmadData()
  return { sprintStatus, loading, error, refetch }
}
