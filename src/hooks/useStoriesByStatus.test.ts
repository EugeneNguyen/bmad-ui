import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useStoriesByStatus } from './useStoriesByStatus'
import type { Story } from '@/types/bmad'

describe('useStoriesByStatus', () => {
  const mockStories: Story[] = [
    {
      id: '1-1-project-initialization',
      title: 'Project Initialization',
      description: 'Initialize project',
      status: 'done',
      epicId: 'epic-1',
      acceptanceCriteria: ['AC1'],
    },
    {
      id: '1-2-server-setup',
      title: 'Server Setup',
      description: 'Setup server',
      status: 'ready',
      epicId: 'epic-1',
      acceptanceCriteria: ['AC1'],
    },
    {
      id: '2-1-kanban-board',
      title: 'Kanban Board',
      description: 'Build board',
      status: 'in-dev',
      epicId: 'epic-2',
      acceptanceCriteria: ['AC1'],
    },
    {
      id: '2-2-story-cards',
      title: 'Story Cards',
      description: 'Display cards',
      status: 'ready-for-review',
      epicId: 'epic-2',
      acceptanceCriteria: ['AC1'],
    },
    {
      id: '1-3-data-types',
      title: 'Data Types',
      description: 'Define types',
      status: 'done',
      epicId: 'epic-1',
      acceptanceCriteria: ['AC1'],
    },
    {
      id: '3-1-story-modal',
      title: 'Story Modal',
      description: 'Build modal',
      status: 'ready',
      epicId: 'epic-3',
      acceptanceCriteria: ['AC1'],
    },
  ]

  it('should group stories by status correctly', () => {
    const { result } = renderHook(() => useStoriesByStatus(mockStories))

    expect(result.current.ready).toHaveLength(2)
    expect(result.current['in-dev']).toHaveLength(1)
    expect(result.current['ready-for-review']).toHaveLength(1)
    expect(result.current.done).toHaveLength(2)
  })

  it('should return empty arrays for empty stories', () => {
    const { result } = renderHook(() => useStoriesByStatus([]))

    expect(result.current.ready).toHaveLength(0)
    expect(result.current['in-dev']).toHaveLength(0)
    expect(result.current['ready-for-review']).toHaveLength(0)
    expect(result.current.done).toHaveLength(0)
  })

  it('should sort stories by epic number first, then story number', () => {
    const { result } = renderHook(() => useStoriesByStatus(mockStories))

    expect(result.current.ready[0]?.id).toBe('1-2-server-setup')
    expect(result.current.ready[1]?.id).toBe('3-1-story-modal')
    expect(result.current.done[0]?.id).toBe('1-1-project-initialization')
    expect(result.current.done[1]?.id).toBe('1-3-data-types')
  })

  it('should handle invalid status by falling back to ready', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const storiesWithInvalidStatus: Story[] = [
      {
        id: '1-1-test',
        title: 'Test',
        description: 'Test',
        status: 'invalid-status' as Story['status'],
        epicId: 'epic-1',
        acceptanceCriteria: ['AC1'],
      },
    ]

    const { result } = renderHook(() => useStoriesByStatus(storiesWithInvalidStatus))

    expect(result.current.ready).toHaveLength(1)
    expect(result.current.ready[0]?.id).toBe('1-1-test')
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[useStoriesByStatus] Invalid status "invalid-status" for story 1-1-test, falling back to "ready"'
    )

    consoleWarnSpy.mockRestore()
  })

  it('should ensure no story appears in multiple lanes', () => {
    const { result } = renderHook(() => useStoriesByStatus(mockStories))

    const allIds = [
      ...result.current.ready.map((s) => s.id),
      ...result.current['in-dev'].map((s) => s.id),
      ...result.current['ready-for-review'].map((s) => s.id),
      ...result.current.done.map((s) => s.id),
    ]

    const uniqueIds = new Set(allIds)

    expect(allIds.length).toBe(uniqueIds.size)
    expect(allIds.length).toBe(mockStories.length)
  })

  it('should memoize result (same reference for same input)', () => {
    const { result, rerender } = renderHook(() => useStoriesByStatus(mockStories))

    const firstResult = result.current

    rerender()

    const secondResult = result.current

    expect(firstResult).toBe(secondResult)
  })

  it('should return new result when stories change', () => {
    const { result, rerender } = renderHook(({ stories }) => useStoriesByStatus(stories), {
      initialProps: { stories: mockStories },
    })

    const firstResult = result.current

    const newStories = [...mockStories]
    rerender({ stories: newStories })

    const secondResult = result.current

    expect(firstResult).not.toBe(secondResult)
  })

  it('should handle malformed story IDs gracefully', () => {
    const storiesWithBadIds: Story[] = [
      {
        id: 'malformed-id',
        title: 'Bad ID',
        description: 'Test',
        status: 'ready',
        epicId: 'epic-1',
        acceptanceCriteria: ['AC1'],
      },
      {
        id: 'no-numbers',
        title: 'No Numbers',
        description: 'Test',
        status: 'ready',
        epicId: 'epic-1',
        acceptanceCriteria: ['AC1'],
      },
    ]

    const { result } = renderHook(() => useStoriesByStatus(storiesWithBadIds))

    expect(result.current.ready).toHaveLength(2)
  })
})
