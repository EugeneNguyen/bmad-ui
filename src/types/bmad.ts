/**
 * Represents the lifecycle status of a story in the BMAD workflow
 */
export type StoryStatus = 'ready' | 'in-dev' | 'ready-for-review' | 'done'

/**
 * Represents a user story in the BMAD system
 */
export interface Story {
  /** Unique identifier for the story */
  id: string
  /** Short descriptive title */
  title: string
  /** Detailed description of the story */
  description: string
  /** Current status in the workflow */
  status: StoryStatus
  /** ID of the parent epic */
  epicId: string
  /** Optional sprint assignment */
  sprintId?: string
  /** List of acceptance criteria */
  acceptanceCriteria: string[]
}

/**
 * Represents an epic containing multiple stories
 */
export interface Epic {
  /** Unique identifier for the epic */
  id: string
  /** Short descriptive title */
  title: string
  /** Detailed description of the epic */
  description: string
  /** IDs of stories belonging to this epic */
  storyIds: string[]
}

/**
 * Represents the current sprint status and its stories
 */
export interface SprintStatus {
  /** Unique identifier for the sprint */
  sprintId: string
  /** Human-readable sprint name */
  name: string
  /** Stories in this sprint */
  stories: Story[]
  /** ISO timestamp of last update */
  lastUpdated: string
}

/**
 * Maps StoryStatus values to PO-friendly display labels
 * Use this for all UI displays instead of raw status values
 */
export const STATUS_LABELS: Record<StoryStatus, string> = {
  ready: 'Ready to Start',
  'in-dev': 'Being Built',
  'ready-for-review': 'Needs Your Attention',
  done: 'Complete',
}
