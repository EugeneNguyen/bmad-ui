import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { ReactNode } from 'react'
import { useEpics } from './useEpics'
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

describe('useEpics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return epics from API', async () => {
    vi.mocked(api.api.get).mockResolvedValue({ data: [{ id: 'epic-1', title: 'Test Epic' }] })

    const { result } = renderHook(() => useEpics(), { wrapper })

    await waitFor(() => {
      expect(result.current.epics).toHaveLength(1)
      expect(result.current.epics[0]?.title).toBe('Test Epic')
    })
  })

  it('should return loading boolean', async () => {
    vi.mocked(api.api.get).mockResolvedValue({ data: [] })

    const { result } = renderHook(() => useEpics(), { wrapper })

    expect(result.current.loading).toBe(true)
  })

  it('should return refetch function', async () => {
    vi.mocked(api.api.get).mockResolvedValue({ data: [] })

    const { result } = renderHook(() => useEpics(), { wrapper })

    await waitFor(() => {
      expect(typeof result.current.refetch).toBe('function')
    })
  })

  it('should refetch data when refetch is called', async () => {
    vi.mocked(api.api.get).mockResolvedValue({ data: [{ id: 'epic-1', title: 'Test Epic' }] })

    const { result } = renderHook(() => useEpics(), { wrapper })

    await waitFor(() => {
      expect(result.current.epics).toHaveLength(1)
    })

    const initialCallCount = vi.mocked(api.api.get).mock.calls.length

    result.current.refetch()

    await waitFor(() => {
      expect(vi.mocked(api.api.get).mock.calls.length).toBeGreaterThan(initialCallCount)
    })
  })
})
