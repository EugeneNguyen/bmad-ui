import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRefresh } from './useRefresh'
import { api } from '@/lib/api'
import type { BmadError } from '@/lib/errors'

vi.mock('@/lib/api', () => ({
  api: {
    post: vi.fn(),
  },
}))

describe('useRefresh', () => {
  const mockRefreshResponse = {
    stories: [
      {
        id: '1-1-test',
        title: 'Test Story',
        description: 'A test',
        status: 'ready' as const,
        epicId: 'epic-1',
        acceptanceCriteria: [],
      },
    ],
    epics: [
      {
        id: 'epic-1',
        title: 'Test Epic',
        description: 'A test epic',
        storyIds: ['1-1-test'],
      },
    ],
    sprint: {
      sprintId: 'sprint-1',
      name: 'Sprint 1',
      stories: [],
      lastUpdated: '2024-01-01T00:00:00.000Z',
    },
    changes: { added: 1, updated: 0, removed: 0 },
    changeIds: { addedIds: ['1-1-test'], updatedIds: [], removedIds: [] },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Initial state', () => {
    it('returns initial loading state as false', () => {
      const { result } = renderHook(() => useRefresh())
      expect(result.current.isLoading).toBe(false)
    })

    it('returns initial error state as null', () => {
      const { result } = renderHook(() => useRefresh())
      expect(result.current.error).toBeNull()
    })

    it('returns initial lastRefreshed as null', () => {
      const { result } = renderHook(() => useRefresh())
      expect(result.current.lastRefreshed).toBeNull()
    })

    it('returns refresh function', () => {
      const { result } = renderHook(() => useRefresh())
      expect(typeof result.current.refresh).toBe('function')
    })
  })

  describe('Refresh function', () => {
    it('sets isLoading to true while refreshing', async () => {
      vi.mocked(api.post).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ data: mockRefreshResponse } as any), 100)
          )
      )

      const { result } = renderHook(() => useRefresh())

      act(() => {
        result.current.refresh()
      })

      expect(result.current.isLoading).toBe(true)
    })

    it('calls POST /api/refresh', async () => {
      vi.mocked(api.post).mockResolvedValue({ data: mockRefreshResponse } as any)

      const { result } = renderHook(() => useRefresh())

      await act(async () => {
        await result.current.refresh()
      })

      expect(api.post).toHaveBeenCalledWith('/refresh')
    })

    it('returns refresh result with changes', async () => {
      vi.mocked(api.post).mockResolvedValue({ data: mockRefreshResponse } as any)

      const { result } = renderHook(() => useRefresh())

      let refreshResult: any
      await act(async () => {
        refreshResult = await result.current.refresh()
      })

      expect(refreshResult).toEqual({
        stories: mockRefreshResponse.stories,
        epics: mockRefreshResponse.epics,
        sprint: mockRefreshResponse.sprint,
        changes: mockRefreshResponse.changes,
        changeIds: mockRefreshResponse.changeIds,
      })
    })

    it('sets lastRefreshed after successful refresh', async () => {
      vi.mocked(api.post).mockResolvedValue({ data: mockRefreshResponse } as any)

      const { result } = renderHook(() => useRefresh())

      await act(async () => {
        await result.current.refresh()
      })

      expect(result.current.lastRefreshed).not.toBeNull()
      expect(result.current.lastRefreshed instanceof Date).toBe(true)
    })

    it('sets isLoading to false after refresh completes', async () => {
      vi.mocked(api.post).mockResolvedValue({ data: mockRefreshResponse } as any)

      const { result } = renderHook(() => useRefresh())

      await act(async () => {
        await result.current.refresh()
      })

      expect(result.current.isLoading).toBe(false)
    })

    it('clears error after successful refresh', async () => {
      const bmadError = new Error('Network error') as BmadError
      bmadError.code = 'NETWORK_ERROR'
      vi.mocked(api.post)
        .mockRejectedValueOnce(bmadError)
        .mockResolvedValueOnce({ data: mockRefreshResponse } as any)

      const { result } = renderHook(() => useRefresh())

      await act(async () => {
        await result.current.refresh()
      })

      expect(result.current.error).not.toBeNull()

      await act(async () => {
        await result.current.refresh()
      })

      expect(result.current.error).toBeNull()
    })
  })

  describe('Error handling', () => {
    it('sets error when refresh fails', async () => {
      const bmadError = new Error('Network error') as BmadError
      bmadError.code = 'NETWORK_ERROR'
      vi.mocked(api.post).mockRejectedValue(bmadError)

      const { result } = renderHook(() => useRefresh())

      await act(async () => {
        await result.current.refresh()
      })

      expect(result.current.error).not.toBeNull()
      expect(result.current.error?.message).toBe('Network error')
    })

    it('returns null when refresh fails', async () => {
      const bmadError = new Error('Network error') as BmadError
      vi.mocked(api.post).mockRejectedValue(bmadError)

      const { result } = renderHook(() => useRefresh())

      let refreshResult: any
      await act(async () => {
        refreshResult = await result.current.refresh()
      })

      expect(refreshResult).toBeNull()
    })

    it('sets isLoading to false after error', async () => {
      const bmadError = new Error('Network error') as BmadError
      vi.mocked(api.post).mockRejectedValue(bmadError)

      const { result } = renderHook(() => useRefresh())

      await act(async () => {
        await result.current.refresh()
      })

      expect(result.current.isLoading).toBe(false)
    })

    it('does not update lastRefreshed on error', async () => {
      const bmadError = new Error('Network error') as BmadError
      vi.mocked(api.post).mockRejectedValue(bmadError)

      const { result } = renderHook(() => useRefresh())

      await act(async () => {
        await result.current.refresh()
      })

      expect(result.current.lastRefreshed).toBeNull()
    })
  })

  describe('Change detection', () => {
    it('returns correct change counts from API', async () => {
      const response = {
        ...mockRefreshResponse,
        changes: { added: 2, updated: 3, removed: 1 },
      }
      vi.mocked(api.post).mockResolvedValue({ data: response } as any)

      const { result } = renderHook(() => useRefresh())

      let refreshResult: any
      await act(async () => {
        refreshResult = await result.current.refresh()
      })

      expect(refreshResult.changes).toEqual({ added: 2, updated: 3, removed: 1 })
    })

    it('returns change IDs from API', async () => {
      const response = {
        ...mockRefreshResponse,
        changeIds: {
          addedIds: ['1-1-new', '1-2-new'],
          updatedIds: ['2-1-updated'],
          removedIds: ['3-1-removed'],
        },
      }
      vi.mocked(api.post).mockResolvedValue({ data: response } as any)

      const { result } = renderHook(() => useRefresh())

      let refreshResult: any
      await act(async () => {
        refreshResult = await result.current.refresh()
      })

      expect(refreshResult.changeIds.addedIds).toEqual(['1-1-new', '1-2-new'])
      expect(refreshResult.changeIds.updatedIds).toEqual(['2-1-updated'])
      expect(refreshResult.changeIds.removedIds).toEqual(['3-1-removed'])
    })
  })
})
