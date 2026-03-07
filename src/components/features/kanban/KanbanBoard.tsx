import { useMemo } from 'react'
import type { Story, Epic, SprintStatus } from '@/types/bmad'
import { STATUS_LABELS } from '@/types/bmad'
import { LANE_ORDER } from '@/types/kanban'
import Lane from './Lane'

export interface KanbanBoardProps {
  stories: Story[]
  epics: Epic[]
  sprintStatus: SprintStatus | null
  onStoryClick?: (story: Story) => void
}

export default function KanbanBoard({
  stories,
  epics: _epics,
  sprintStatus: _sprintStatus,
  onStoryClick,
}: KanbanBoardProps) {
  const lanes = useMemo(() => {
    const grouped: Record<string, Story[]> = {
      ready: [],
      'in-dev': [],
      'ready-for-review': [],
      done: [],
    }

    stories.forEach((story) => {
      if (grouped[story.status]) {
        grouped[story.status]!.push(story)
      }
    })

    return grouped
  }, [stories])

  return (
    <div
      role="region"
      aria-label="Kanban board"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 p-4 md:p-6"
    >
      {LANE_ORDER.map((status) => {
        const laneStories = lanes[status]

        if (!laneStories) {
          return null
        }

        return (
          <Lane
            key={status}
            status={status}
            title={STATUS_LABELS[status]}
            stories={laneStories}
            onStoryClick={onStoryClick}
          />
        )
      })}
    </div>
  )
}
