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
        expect(screen.getByText('Ready to Start')).toBeInTheDocument()
        expect(screen.getByText('Being Built')).toBeInTheDocument()
        expect(screen.getByText('Needs Your Attention')).toBeInTheDocument()
        expect(screen.getByText('Complete')).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })
})
