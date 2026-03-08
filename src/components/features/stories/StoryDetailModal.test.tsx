import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import StoryDetailModal from './StoryDetailModal'
import type { Story } from '@/types/bmad'

vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
  },
}))

import { api } from '@/lib/api'

const mockStorySummary: Story = {
  id: '3-1-story-detail-modal',
  title: 'Story Detail Modal',
  description: 'As a product owner, I want to click a story card...',
  status: 'ready',
  epicId: 'epic-3',
  acceptanceCriteria: [],
}

const mockStoryFull: Story = {
  id: '3-1-story-detail-modal',
  title: 'Story Detail Modal',
  description: 'As a product owner, I want to click a story card...',
  status: 'ready',
  epicId: 'epic-3',
  acceptanceCriteria: [
    'Given a product owner views the Kanban board',
    'When they click a story card',
  ],
}

const defaultProps = {
  laneStories: [mockStorySummary],
  currentStoryIndex: 0,
}

describe('StoryDetailModal', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(api.get).mockReset()
  })

  describe('Rendering', () => {
    it('does not render when isOpen is false', () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockStoryFull })
      render(
        <StoryDetailModal
          storyId="3-1-story-detail-modal"
          isOpen={false}
          onClose={mockOnClose}
          {...defaultProps}
        />
      )

      expect(screen.queryByTestId('story-detail-modal')).not.toBeInTheDocument()
    })

    it('renders when isOpen is true', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockStoryFull })
      render(
        <StoryDetailModal
          storyId="3-1-story-detail-modal"
          isOpen={true}
          onClose={mockOnClose}
          {...defaultProps}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('story-detail-modal')).toBeInTheDocument()
      })
    })
  })

  describe('Loading state', () => {
    it('displays loading spinner while fetching', async () => {
      vi.mocked(api.get).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: mockStoryFull }), 100))
      )

      render(
        <StoryDetailModal
          storyId="3-1-story-detail-modal"
          isOpen={true}
          onClose={mockOnClose}
          {...defaultProps}
        />
      )

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument()
      })
    })
  })

  describe('Story content display', () => {
    it('displays story title', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockStoryFull })
      render(
        <StoryDetailModal
          storyId="3-1-story-detail-modal"
          isOpen={true}
          onClose={mockOnClose}
          {...defaultProps}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Story Detail Modal')).toBeInTheDocument()
      })
    })

    it('displays story ID in correct format', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockStoryFull })
      render(
        <StoryDetailModal
          storyId="3-1-story-detail-modal"
          isOpen={true}
          onClose={mockOnClose}
          {...defaultProps}
        />
      )

      await waitFor(() => {
        expect(screen.getByText(/Story 3\.1/)).toBeInTheDocument()
      })
    })

    it('displays epic reference', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockStoryFull })
      render(
        <StoryDetailModal
          storyId="3-1-story-detail-modal"
          isOpen={true}
          onClose={mockOnClose}
          {...defaultProps}
        />
      )

      await waitFor(() => {
        expect(screen.getByText(/Epic 3/)).toBeInTheDocument()
      })
    })

    it('displays story description', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockStoryFull })
      render(
        <StoryDetailModal
          storyId="3-1-story-detail-modal"
          isOpen={true}
          onClose={mockOnClose}
          {...defaultProps}
        />
      )

      await waitFor(() => {
        expect(screen.getByText(mockStoryFull.description)).toBeInTheDocument()
      })
    })

    it('displays acceptance criteria', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockStoryFull })
      render(
        <StoryDetailModal
          storyId="3-1-story-detail-modal"
          isOpen={true}
          onClose={mockOnClose}
          {...defaultProps}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Given')).toBeInTheDocument()
        expect(screen.getByText(/a product owner views the Kanban board/)).toBeInTheDocument()
      })
    })

    it('displays status badge with PO-friendly label', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockStoryFull })
      render(
        <StoryDetailModal
          storyId="3-1-story-detail-modal"
          isOpen={true}
          onClose={mockOnClose}
          {...defaultProps}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Ready')).toBeInTheDocument()
      })
    })

    it('displays placeholder when no acceptance criteria', async () => {
      const storyWithoutCriteria = { ...mockStoryFull, acceptanceCriteria: [] }
      vi.mocked(api.get).mockResolvedValue({ data: storyWithoutCriteria })
      render(
        <StoryDetailModal
          storyId="3-1-story-detail-modal"
          isOpen={true}
          onClose={mockOnClose}
          {...defaultProps}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('No acceptance criteria defined')).toBeInTheDocument()
      })
    })
  })

  describe('Close functionality', () => {
    it('calls onClose when close button is clicked', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockStoryFull })
      render(
        <StoryDetailModal
          storyId="3-1-story-detail-modal"
          isOpen={true}
          onClose={mockOnClose}
          {...defaultProps}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('close-button')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('close-button'))
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when Escape key is pressed', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockStoryFull })
      render(
        <StoryDetailModal
          storyId="3-1-story-detail-modal"
          isOpen={true}
          onClose={mockOnClose}
          {...defaultProps}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('story-detail-modal')).toBeInTheDocument()
      })

      fireEvent.keyDown(document, { key: 'Escape' })
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when backdrop is clicked', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockStoryFull })
      render(
        <StoryDetailModal
          storyId="3-1-story-detail-modal"
          isOpen={true}
          onClose={mockOnClose}
          {...defaultProps}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('modal-backdrop')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('modal-backdrop'))
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('does not call onClose when modal content is clicked', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockStoryFull })
      render(
        <StoryDetailModal
          storyId="3-1-story-detail-modal"
          isOpen={true}
          onClose={mockOnClose}
          {...defaultProps}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('story-detail-modal')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('story-detail-modal'))
      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  describe('Error state', () => {
    it('displays error message on fetch failure', async () => {
      vi.mocked(api.get).mockRejectedValue(new Error('Network error'))

      render(
        <StoryDetailModal
          storyId="3-1-story-detail-modal"
          isOpen={true}
          onClose={mockOnClose}
          {...defaultProps}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })
    })

    it('displays retry button on error', async () => {
      vi.mocked(api.get).mockRejectedValue(new Error('Network error'))

      render(
        <StoryDetailModal
          storyId="3-1-story-detail-modal"
          isOpen={true}
          onClose={mockOnClose}
          {...defaultProps}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Try again')).toBeInTheDocument()
      })
    })

    it('retries fetch when retry button is clicked', async () => {
      vi.mocked(api.get)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ data: mockStoryFull })

      render(
        <StoryDetailModal
          storyId="3-1-story-detail-modal"
          isOpen={true}
          onClose={mockOnClose}
          {...defaultProps}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Try again')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Try again'))

      await waitFor(() => {
        expect(api.get).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('Accessibility', () => {
    it('has role="dialog"', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockStoryFull })
      render(
        <StoryDetailModal
          storyId="3-1-story-detail-modal"
          isOpen={true}
          onClose={mockOnClose}
          {...defaultProps}
        />
      )

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })
    })

    it('has aria-modal="true"', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockStoryFull })
      render(
        <StoryDetailModal
          storyId="3-1-story-detail-modal"
          isOpen={true}
          onClose={mockOnClose}
          {...defaultProps}
        />
      )

      await waitFor(() => {
        const modal = screen.getByRole('dialog')
        expect(modal).toHaveAttribute('aria-modal', 'true')
      })
    })

    it('has aria-labelledby pointing to title', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockStoryFull })
      render(
        <StoryDetailModal
          storyId="3-1-story-detail-modal"
          isOpen={true}
          onClose={mockOnClose}
          {...defaultProps}
        />
      )

      await waitFor(() => {
        const modal = screen.getByRole('dialog')
        expect(modal).toHaveAttribute('aria-labelledby')
      })
    })

    it('has aria-describedby pointing to description', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockStoryFull })
      render(
        <StoryDetailModal
          storyId="3-1-story-detail-modal"
          isOpen={true}
          onClose={mockOnClose}
          {...defaultProps}
        />
      )

      await waitFor(() => {
        const modal = screen.getByRole('dialog')
        expect(modal).toHaveAttribute('aria-describedby')
      })
    })
  })
})
