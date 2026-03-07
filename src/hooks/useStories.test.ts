import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createElement, ReactNode } from 'react'
import { useStories } from './useStories'
import { BmadDataProvider } from '@/context/BmadDataContext'

const mockApiGet = vi.fn()

vi.mock('@/lib/api', () => ({
  api: {
    get: (...args: unknown[]) => mockApiGet(...args),
  },
}))

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(BmadDataProvider, null, children)

describe('useStories', () => {
  beforeEach(() => {
    mockApiGet.mockReset()
    mockApiGet.mockImplementation((url: string) => {
      if (url === '/api/stories') return Promise.resolve({ data: [{ id: '1', title: 'Test Story' }] })
      if (url === '/api/epics') return Promise.resolve({ data: [] })
      if (url === '/api/sprint') return Promise.resolve({ data: null })
      return Promise.reject(new Error('Unknown endpoint'))
    })
  })

  it('should return stories from context', async () => {
    const { result } = renderHook(() => useStories(), { wrapper })
    
    await waitFor(() => {
      expect(result.current.stories).toHaveLength(1)
      expect(result.current.stories[0]?.title).toBe('Test Story')
    })
  })

  it('should return loading boolean', async () => {
    const { result } = renderHook(() => useStories(), { wrapper })
    
    await waitFor(() => {
      expect(typeof result.current.loading).toBe('boolean')
    })
  })

  it('should return error object or null', async () => {
    const { result } = renderHook(() => useStories(), { wrapper })
    
    await waitFor(() => {
      expect(result.current.error).toBeNull()
    })
  })

  it('should return refetch function', async () => {
    const { result } = renderHook(() => useStories(), { wrapper })
    
    await waitFor(() => {
      expect(typeof result.current.refetch).toBe('function')
    })
  })

  it('should refetch data when refetch is called', async () => {
    const { result } = renderHook(() => useStories(), { wrapper })
    
    await waitFor(() => {
      expect(result.current.stories).toHaveLength(1)
    })
    
    const initialCallCount = mockApiGet.mock.calls.length
    
    result.current.refetch()
    
    await waitFor(() => {
      expect(mockApiGet.mock.calls.length).toBeGreaterThan(initialCallCount)
    })
  })
})
