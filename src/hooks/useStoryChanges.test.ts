import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useStoryChanges } from './useStoryChanges'
import type { Story } from '@/types/bmad'

const sessionStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
})

describe('useStoryChanges', () => {
  const mockStories: Story[] = [
    {
      id: '1-1-test-story-1',
      status: 'done',
      title: 'Test Story 1',
      description: 'Test description',
      epicId: 'epic-1',
      acceptanceCriteria: [],
    },
    {
      id: '1-2-test-story-2',
      status: 'in-dev',
      title: 'Test Story 2',
      description: 'Test description',
      epicId: 'epic-1',
      acceptanceCriteria: [],
    },
  ]

  beforeEach(() => {
    vi.useFakeTimers()
    sessionStorageMock.clear()
    vi.resetAllMocks()

    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
      writable: true,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Initial State', () => {
    it('returns hasChanges as false initially', () => {
      const { result } = renderHook(() => useStoryChanges(mockStories))
      expect(result.current.hasChanges).toBe(false)
    })

    it('returns lastChecked as null initially', () => {
      const { result } = renderHook(() => useStoryChanges(mockStories))
      expect(result.current.lastChecked).toBeNull()
    })

    it('returns error as null initially', () => {
      const { result } = renderHook(() => useStoryChanges(mockStories))
      expect(result.current.error).toBeNull()
    })

    it('returns checkNow function', () => {
      const { result } = renderHook(() => useStoryChanges(mockStories))
      expect(typeof result.current.checkNow).toBe('function')
    })

    it('returns clearChanges function', () => {
      const { result } = renderHook(() => useStoryChanges(mockStories))
      expect(typeof result.current.clearChanges).toBe('function')
    })

    it('stores initial hash in sessionStorage', () => {
      renderHook(() => useStoryChanges(mockStories))
      expect(sessionStorageMock.setItem).toHaveBeenCalled()
    })
  })

  describe('Change Detection', () => {
    it('detects changes when story data differs', async () => {
      sessionStorageMock.getItem.mockReturnValue('old-hash')

      const { result } = renderHook(() => useStoryChanges(mockStories))

      await act(async () => {
        await result.current.checkNow()
      })

      expect(result.current.hasChanges).toBe(true)
    })

    it('does not detect changes when story data is the same', async () => {
      const { result } = renderHook(() => useStoryChanges(mockStories))

      await act(async () => {
        await result.current.checkNow()
      })

      expect(result.current.hasChanges).toBe(false)
    })
  })

  describe('Clear Changes', () => {
    it('clears changes when clearChanges is called', async () => {
      sessionStorageMock.getItem.mockReturnValue('old-hash')

      const { result } = renderHook(() => useStoryChanges(mockStories))

      await act(async () => {
        await result.current.checkNow()
      })

      expect(result.current.hasChanges).toBe(true)

      act(() => {
        result.current.clearChanges()
      })

      expect(result.current.hasChanges).toBe(false)
    })

    it('updates sessionStorage hash when clearChanges is called', async () => {
      const { result } = renderHook(() => useStoryChanges(mockStories))

      act(() => {
        result.current.clearChanges()
      })

      expect(sessionStorageMock.setItem).toHaveBeenCalled()
    })
  })

  describe('Polling', () => {
    it('sets up polling interval on mount', () => {
      renderHook(() => useStoryChanges(mockStories))
      expect(vi.getTimerCount()).toBeGreaterThan(0)
    })

    it('checks for changes periodically', async () => {
      const { result } = renderHook(() => useStoryChanges(mockStories))

      expect(result.current.lastChecked).toBeNull()

      await act(async () => {
        await vi.advanceTimersByTimeAsync(30000)
      })

      expect(result.current.lastChecked).not.toBeNull()
    })

    it('cleans up interval on unmount', () => {
      const { unmount } = renderHook(() => useStoryChanges(mockStories))

      const timerCountBeforeUnmount = vi.getTimerCount()
      expect(timerCountBeforeUnmount).toBeGreaterThan(0)

      unmount()

      const timerCountAfterUnmount = vi.getTimerCount()
      expect(timerCountAfterUnmount).toBe(0)
    })
  })

  describe('Error Handling', () => {
    it('handles sessionStorage errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { result } = renderHook(() => useStoryChanges(mockStories))

      sessionStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error('Storage error')
      })

      await act(async () => {
        await result.current.checkNow()
      })

      expect(result.current.error).toBe('Failed to check for changes')
      expect(result.current.hasChanges).toBe(false)

      consoleSpy.mockRestore()
    })
  })
})
