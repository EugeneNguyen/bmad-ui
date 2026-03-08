import { forwardRef } from 'react'
import type { Story, Epic, SprintStatus } from '@/types/bmad'
import { STATUS_LABELS } from '@/types/bmad'
import { LANE_ORDER } from '@/types/kanban'
import Lane from './Lane'
import { useStoriesByStatus } from '@/hooks/useStoriesByStatus'

export interface KanbanBoardProps {
  stories: Story[]
  epics: Epic[]
  sprintStatus: SprintStatus | null
  onStoryClick?: (story: Story) => void
  storyCardRefs?: React.MutableRefObject<Map<string, HTMLButtonElement | null>>
}

const KanbanBoard = forwardRef<HTMLDivElement, KanbanBoardProps>(function KanbanBoard(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { stories, epics: _epics, sprintStatus: _sprintStatus, onStoryClick, storyCardRefs },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _ref
) {
  const lanes = useStoriesByStatus(stories)

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
            storyCardRefs={storyCardRefs}
          />
        )
      })}
    </div>
  )
})

KanbanBoard.displayName = 'KanbanBoard'

export default KanbanBoard
