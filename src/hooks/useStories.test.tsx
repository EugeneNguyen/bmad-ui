import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { ReactNode } from 'react'
import { useStories } from './useStories'
import { BmadDataProvider } from '@/context/BmadDataContext'
import * as api from '@/lib/api'

vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
  },
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <BmadDataProvider>{children}</BmadDataProvider>
)

describe('useStories', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return stories from API', async () => {
    vi.mocked(api.api.get).mockResolvedValue({ data: [{ id: '1', title: 'Test Story' }] })

    const { result } = renderHook(() => useStories(), { wrapper })

    await waitFor(() => {
      expect(result.current.stories).toHaveLength(1)
      expect(result.current.stories[0]?.title).toBe('Test Story')
    })
  })

  it('should return loading boolean', async () => {
    vi.mocked(api.api.get).mockImplementation(() => new Promise(() => {}))

    const { result } = renderHook(() => useStories(), { wrapper })

    expect(result.current.loading).toBe(true)
  })

  it('should return error on failure', async () => {
    vi.mocked(api.api.get).mockRejectedValue(new Error('Failed to fetch'))

    const { result } = renderHook(() => useStories(), { wrapper })

    await waitFor(() => {
      expect(result.current.error).toBeInstanceOf(Error)
      expect(result.current.error?.message).toBe('Failed to fetch')
    })
  })

  it('should return refetch function', async () => {
    vi.mocked(api.api.get).mockResolvedValue({ data: [] })

    const { result } = renderHook(() => useStories(), { wrapper })

    await waitFor(() => {
      expect(typeof result.current.refetch).toBe('function')
    })
  })

  it('should refetch data when refetch is called', async () => {
    vi.mocked(api.api.get).mockResolvedValue({ data: [{ id: '1', title: 'Test Story' }] })

    const { result } = renderHook(() => useStories(), { wrapper })

    await waitFor(() => {
      expect(result.current.stories).toHaveLength(1)
    })

    const initialCallCount = vi.mocked(api.api.get).mock.calls.length

    result.current.refetch()

    await waitFor(() => {
      expect(vi.mocked(api.api.get).mock.calls.length).toBeGreaterThan(initialCallCount)
    })
  })
})
