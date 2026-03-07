import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { ReactNode } from 'react'
import { BmadDataProvider, useBmadData } from './BmadDataContext'

const mockApiGet = vi.fn()

vi.mock('@/lib/api', () => ({
  api: {
    get: (...args: unknown[]) => mockApiGet(...args),
  },
}))

function TestConsumer({ children }: { children: (data: ReturnType<typeof useBmadData>) => ReactNode }) {
  const data = useBmadData()
  return <>{children(data)}</>
}

describe('BmadDataContext', () => {
  beforeEach(() => {
    mockApiGet.mockReset()
    mockApiGet.mockImplementation((url: string) => {
      if (url === '/api/stories') return Promise.resolve({ data: [] })
      if (url === '/api/epics') return Promise.resolve({ data: [] })
      if (url === '/api/sprint') return Promise.resolve({ data: null })
      return Promise.reject(new Error('Unknown endpoint'))
    })
  })

  it('should provide stories array', async () => {
    render(
      <BmadDataProvider>
        <TestConsumer>{(data) => <div data-testid="stories">{JSON.stringify(data.stories)}</div>}</TestConsumer>
      </BmadDataProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('stories').textContent).toBe('[]')
    })
  })

  it('should provide epics array', async () => {
    render(
      <BmadDataProvider>
        <TestConsumer>{(data) => <div data-testid="epics">{JSON.stringify(data.epics)}</div>}</TestConsumer>
      </BmadDataProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('epics').textContent).toBe('[]')
    })
  })

  it('should provide sprintStatus object', async () => {
    render(
      <BmadDataProvider>
        <TestConsumer>{(data) => <div data-testid="sprintStatus">{String(data.sprintStatus)}</div>}</TestConsumer>
      </BmadDataProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('sprintStatus').textContent).toBe('null')
    })
  })

  it('should provide loading state', async () => {
    render(
      <BmadDataProvider>
        <TestConsumer>{(data) => <div data-testid="loading">{String(data.loading)}</div>}</TestConsumer>
      </BmadDataProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })
  })

  it('should provide error state', async () => {
    render(
      <BmadDataProvider>
        <TestConsumer>{(data) => <div data-testid="error">{String(data.error)}</div>}</TestConsumer>
      </BmadDataProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toBe('null')
    })
  })

  it('should provide refetch function', async () => {
    render(
      <BmadDataProvider>
        <TestConsumer>{(data) => <div data-testid="refetch">{typeof data.refetch}</div>}</TestConsumer>
      </BmadDataProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('refetch').textContent).toBe('function')
    })
  })

  it('should throw error when useBmadData is used outside provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<TestConsumer>{() => <div />}</TestConsumer>)
    }).toThrow('useBmadData must be used within BmadDataProvider')

    consoleError.mockRestore()
  })

  it('should set error when API fails', async () => {
    mockApiGet.mockRejectedValue(new Error('Network error'))

    render(
      <BmadDataProvider>
        <TestConsumer>{(data) => <div data-testid="error">{String(data.error)}</div>}</TestConsumer>
      </BmadDataProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).not.toBe('null')
    })
  })

  it('should refetch data when refetch is called', async () => {
    let refetchFn: (() => void) | null = null

    render(
      <BmadDataProvider>
        <TestConsumer>
          {(data) => {
            refetchFn = data.refetch
            return <div data-testid="loading">{String(data.loading)}</div>
          }}
        </TestConsumer>
      </BmadDataProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })

    const initialCallCount = mockApiGet.mock.calls.length

    expect(refetchFn).not.toBeNull()
    refetchFn!()

    await waitFor(() => {
      expect(mockApiGet.mock.calls.length).toBeGreaterThan(initialCallCount)
    })
  })
})
