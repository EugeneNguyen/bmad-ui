import { useMemo } from 'react'
import type { Story, StoryStatus } from '@/types/bmad'

export type StoriesByStatus = Record<StoryStatus, Story[]>

export function useStoriesByStatus(stories: Story[]): StoriesByStatus {
  return useMemo(() => {
    const grouped: StoriesByStatus = {
      ready: [],
      'in-dev': [],
      'ready-for-review': [],
      done: [],
    }

    stories.forEach((story) => {
      const status = isValidStatus(story.status) ? story.status : 'ready'

      if (!isValidStatus(story.status)) {
        console.warn(
          `[useStoriesByStatus] Invalid status "${story.status}" for story ${story.id}, falling back to "ready"`
        )
      }

      grouped[status].push(story)
    })

    Object.keys(grouped).forEach((status) => {
      grouped[status as StoryStatus].sort(sortByStoryNumber)
    })

    return grouped
  }, [stories])
}

function isValidStatus(status: string): status is StoryStatus {
  return ['ready', 'in-dev', 'ready-for-review', 'done'].includes(status)
}

function sortByStoryNumber(a: Story, b: Story): number {
  const aNum = parseStoryNumber(a.id)
  const bNum = parseStoryNumber(b.id)

  if (aNum.epic !== bNum.epic) {
    return aNum.epic - bNum.epic
  }
  return aNum.story - bNum.story
}

function parseStoryNumber(id: string): { epic: number; story: number } {
  const match = id.match(/^(\d+)-(\d+)/)
  if (!match) {
    return { epic: 999, story: 999 }
  }
  return {
    epic: parseInt(match[1] ?? '999', 10),
    story: parseInt(match[2] ?? '999', 10),
  }
}
