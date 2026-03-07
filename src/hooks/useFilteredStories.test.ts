import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useFilteredStories } from './useFilteredStories'
import type { Story } from '@/types/bmad'

describe('useFilteredStories', () => {
  const mockStories: Story[] = [
    {
      id: '1-1-story-one',
      title: 'Story One',
      description: 'Description one',
      status: 'ready',
      epicId: 'epic-1',
      acceptanceCriteria: [],
    },
    {
      id: '1-3-story-three',
      title: 'Story Three',
      description: 'Description three',
      status: 'ready',
      epicId: 'epic-1',
      acceptanceCriteria: [],
    },
    {
      id: '1-2-story-two',
      title: 'Story Two',
      description: 'Description two',
      status: 'in-dev',
      epicId: 'epic-1',
      acceptanceCriteria: [],
    },
  ]

  it('filters stories by status', () => {
    const { result } = renderHook(() => useFilteredStories(mockStories, 'ready'))

    expect(result.current.stories).toHaveLength(2)
    expect(result.current.stories.every((s) => s.status === 'ready')).toBe(true)
  })

  it('sorts stories by story number', () => {
    const { result } = renderHook(() => useFilteredStories(mockStories, 'ready'))

    expect(result.current.stories[0]?.id).toBe('1-1-story-one')
    expect(result.current.stories[1]?.id).toBe('1-3-story-three')
  })

  it('returns correct count', () => {
    const { result } = renderHook(() => useFilteredStories(mockStories, 'ready'))

    expect(result.current.count).toBe(2)
  })

  it('returns empty array when no stories match', () => {
    const { result } = renderHook(() => useFilteredStories(mockStories, 'done'))

    expect(result.current.stories).toHaveLength(0)
    expect(result.current.count).toBe(0)
  })
})
