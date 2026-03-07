/**
 * Temporary type definitions for server-side BMAD data
 * These will be replaced by shared types in src/types/bmad.ts in Story 1.3
 */

export type StoryStatus = 'ready' | 'in-dev' | 'ready-for-review' | 'done'

export interface Story {
  id: string
  title: string
  description: string
  status: StoryStatus
  epicId: string
  sprintId?: string
  acceptanceCriteria: string[]
}

export interface Epic {
  id: string
  title: string
  description: string
  storyIds: string[]
}

export interface SprintStatus {
  sprintId: string
  name: string
  project?: string
  stories: Story[]
  lastUpdated: string
  developmentStatus?: Record<string, string>
}

export interface ParsedMarkdown {
  frontmatter: Record<string, unknown>
  body: string
}
