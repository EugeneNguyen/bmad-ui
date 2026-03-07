import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createElement, ReactNode } from 'react'
import { useSprintStatus } from './useSprintStatus'
import { BmadDataProvider } from '@/context/BmadDataContext'

const mockApiGet = vi.fn()

vi.mock('@/lib/api', () => ({
  api: {
    get: (...args: unknown[]) => mockApiGet(...args),
  },
}))

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(BmadDataProvider, null, children)

describe('useSprintStatus', () => {
  beforeEach(() => {
    mockApiGet.mockReset()
    mockApiGet.mockImplementation((url: string) => {
      if (url === '/api/stories') return Promise.resolve({ data: [] })
      if (url === '/api/epics') return Promise.resolve({ data: [] })
      if (url === '/api/sprint') return Promise.resolve({ data: { sprintId: 'sprint-1', name: 'Sprint 1' } })
      return Promise.reject(new Error('Unknown endpoint'))
    })
  })

  it('should return sprintStatus from context', async () => {
    const { result } = renderHook(() => useSprintStatus(), { wrapper })
    
    await waitFor(() => {
      expect(result.current.sprintStatus).not.toBeNull()
      expect(result.current.sprintStatus?.name).toBe('Sprint 1')
    })
  })

  it('should return loading boolean', async () => {
    const { result } = renderHook(() => useSprintStatus(), { wrapper })
    
    await waitFor(() => {
      expect(typeof result.current.loading).toBe('boolean')
    })
  })

  it('should return error object or null', async () => {
    const { result } = renderHook(() => useSprintStatus(), { wrapper })
    
    await waitFor(() => {
      expect(result.current.error).toBeNull()
    })
  })

  it('should return refetch function', async () => {
    const { result } = renderHook(() => useSprintStatus(), { wrapper })
    
    await waitFor(() => {
      expect(typeof result.current.refetch).toBe('function')
    })
  })

  it('should refetch data when refetch is called', async () => {
    const { result } = renderHook(() => useSprintStatus(), { wrapper })
    
    await waitFor(() => {
      expect(result.current.sprintStatus).not.toBeNull()
    })
    
    const initialCallCount = mockApiGet.mock.calls.length
    
    result.current.refetch()
    
    await waitFor(() => {
      expect(mockApiGet.mock.calls.length).toBeGreaterThan(initialCallCount)
    })
  })
})
