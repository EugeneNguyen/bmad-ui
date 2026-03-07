import type { Story, StoryStatus } from './bmad'

/**
 * Represents a single lane in the Kanban board
 */
export interface KanbanLane {
  /** The status value for this lane */
  status: StoryStatus
  /** PO-friendly display title for this lane */
  title: string
  /** Stories currently in this lane */
  stories: Story[]
}

/**
 * Configuration for each Kanban lane
 * Maps status values to lane display properties
 */
export const LANE_STATUSES: Record<StoryStatus, { title: string }> = {
  ready: { title: 'Ready to Start' },
  'in-dev': { title: 'Being Built' },
  'ready-for-review': { title: 'Needs Your Attention' },
  done: { title: 'Complete' },
}

/**
 * Display order of lanes from left to right
 * Follows workflow progression: ready → in-dev → review → done
 */
export const LANE_ORDER: StoryStatus[] = [
  'ready',
  'in-dev',
  'ready-for-review',
  'done',
]
