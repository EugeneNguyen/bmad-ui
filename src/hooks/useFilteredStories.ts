import { useMemo } from 'react'
import type { Story, StoryStatus } from '@/types/bmad'

export interface UseFilteredStoriesResult {
  stories: Story[]
  count: number
}

export function useFilteredStories(
  stories: Story[],
  status: StoryStatus
): UseFilteredStoriesResult {
  const filteredStories = useMemo(() => {
    const filtered = stories.filter((story) => story.status === status)

    const sorted = [...filtered].sort((a, b) => {
      const aNum = parseInt(a.id.split('-')[1] || '0', 10)
      const bNum = parseInt(b.id.split('-')[1] || '0', 10)
      return aNum - bNum
    })

    return sorted
  }, [stories, status])

  return {
    stories: filteredStories,
    count: filteredStories.length,
  }
}
