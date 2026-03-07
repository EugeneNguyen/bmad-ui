import { useBmadData } from '@/context/BmadDataContext'
import type { Story } from '@/types/bmad'
import type { BmadError } from '@/lib/errors'

export interface UseStoriesReturn {
  stories: Story[]
  loading: boolean
  error: BmadError | null
  refetch: () => void
}

export function useStories(): UseStoriesReturn {
  const { stories, loading, error, refetch } = useBmadData()
  return { stories, loading, error, refetch }
}
