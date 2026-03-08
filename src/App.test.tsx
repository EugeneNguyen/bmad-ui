import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from './App'
import { api } from '@/lib/api'

vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
  },
}))

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    vi.mocked(api.get).mockImplementation(() => new Promise(() => {}))

    render(<App />)
    expect(screen.getByText('Loading sprint data...')).toBeInTheDocument()
  })

  it('renders KanbanBoard when data loads successfully', async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: [],
    })

    render(<App />)

    await waitFor(
      () => {
        expect(screen.getByText('Ready')).toBeInTheDocument()
        expect(screen.getByText('In Dev')).toBeInTheDocument()
        expect(screen.getByText('Ready For Review')).toBeInTheDocument()
        expect(screen.getByText('Done')).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })
})
