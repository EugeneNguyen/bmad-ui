import { describe, it, expect } from 'vitest'
import type { Story, Epic, SprintStatus, StoryStatus } from './bmad'
import { STATUS_LABELS } from './bmad'

describe('BMAD Types', () => {
  describe('StoryStatus type', () => {
    it('should accept valid status values', () => {
      const statuses: StoryStatus[] = ['ready', 'in-dev', 'ready-for-review', 'done']
      expect(statuses).toHaveLength(4)
    })
  })

  describe('Story interface', () => {
    it('should have required properties', () => {
      const story: Story = {
        id: '1',
        title: 'Test Story',
        description: 'Test description',
        status: 'ready',
        epicId: 'epic-1',
        sprintId: 'sprint-1',
        acceptanceCriteria: ['AC1', 'AC2'],
      }
      expect(story.id).toBe('1')
      expect(story.title).toBe('Test Story')
    })

    it('should allow optional sprintId', () => {
      const story: Story = {
        id: '1',
        title: 'Test Story',
        description: 'Test description',
        status: 'ready',
        epicId: 'epic-1',
        acceptanceCriteria: [],
      }
      expect(story.sprintId).toBeUndefined()
    })
  })

  describe('Epic interface', () => {
    it('should have required properties', () => {
      const epic: Epic = {
        id: 'epic-1',
        title: 'Test Epic',
        description: 'Test description',
        storyIds: ['1', '2'],
      }
      expect(epic.id).toBe('epic-1')
      expect(epic.storyIds).toHaveLength(2)
    })
  })

  describe('SprintStatus interface', () => {
    it('should have required properties', () => {
      const sprintStatus: SprintStatus = {
        sprintId: 'sprint-1',
        name: 'Sprint 1',
        stories: [],
        lastUpdated: '2024-01-01',
      }
      expect(sprintStatus.sprintId).toBe('sprint-1')
    })
  })

  describe('STATUS_LABELS constant', () => {
    it('should map all status values to PO-friendly labels', () => {
      expect(STATUS_LABELS.ready).toBe('Ready to Start')
      expect(STATUS_LABELS['in-dev']).toBe('Being Built')
      expect(STATUS_LABELS['ready-for-review']).toBe('Needs Your Attention')
      expect(STATUS_LABELS.done).toBe('Complete')
    })

    it('should have exactly 4 status labels', () => {
      const keys = Object.keys(STATUS_LABELS)
      expect(keys).toHaveLength(4)
    })
  })
})
