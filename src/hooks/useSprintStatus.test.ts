import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useSprintStatus } from './useSprintStatus'
import * as api from '@/lib/api'

vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
  },
}))

describe('useSprintStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return sprintStatus from API', async () => {
    vi.mocked(api.api.get).mockResolvedValue({ 
      data: {
        sprintId: 'sprint-1',
        name: 'Current Sprint',
        project: 'bmad-ui',
        stories: [],
        lastUpdated: '2026-03-07T00:00:00.000Z'
      } 
    })

    const { result } = renderHook(() => useSprintStatus())

    await waitFor(() => {
      expect(result.current.sprintStatus).toBeDefined()
      expect(result.current.sprintStatus?.name).toBe('Current Sprint')
    })
  })

  it('should return loading boolean', async () => {
    vi.mocked(api.api.get).mockResolvedValue({ data: null })

    const { result } = renderHook(() => useSprintStatus())

    expect(result.current.loading).toBe(true)
  })

  it('should return refetch function', async () => {
    vi.mocked(api.api.get).mockResolvedValue({ data: null })

    const { result } = renderHook(() => useSprintStatus())

    await waitFor(() => {
      expect(typeof result.current.refetch).toBe('function')
    })
  })

  it('should refetch data when refetch is called', async () => {
    vi.mocked(api.api.get).mockResolvedValue({ 
      data: {
        sprintId: 'sprint-1',
        name: 'Current Sprint',
        project: 'bmad-ui',
        stories: [],
        lastUpdated: '2026-03-07T00:00:00.000Z'
      } 
    })

    const { result } = renderHook(() => useSprintStatus())

    await waitFor(() => {
      expect(result.current.sprintStatus).toBeDefined()
    })

    const initialCallCount = vi.mocked(api.api.get).mock.calls.length

    result.current.refetch()

    await waitFor(() => {
      expect(vi.mocked(api.api.get).mock.calls.length).toBeGreaterThan(initialCallCount)
    })
  })
})
