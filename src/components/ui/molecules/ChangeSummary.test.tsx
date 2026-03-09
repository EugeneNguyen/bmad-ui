import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ChangeSummary, { type ChangeCounts, type ChangeSummaryProps } from './ChangeSummary'

describe('ChangeSummary', () => {
  const defaultChanges: ChangeCounts = {
    added: 2,
    updated: 1,
    removed: 0,
  }

  const defaultProps: ChangeSummaryProps = {
    changes: defaultChanges,
    onDismiss: vi.fn(),
  }

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders without crashing when there are changes', () => {
      render(<ChangeSummary {...defaultProps} />)
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('does not render when no changes', () => {
      render(<ChangeSummary {...defaultProps} changes={{ added: 0, updated: 0, removed: 0 }} />)
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    it('displays change counts correctly', () => {
      render(<ChangeSummary {...defaultProps} />)
      expect(screen.getByText(/2 new/)).toBeInTheDocument()
      expect(screen.getByText('1 updated')).toBeInTheDocument()
    })

    it('displays singular form for single added story', () => {
      render(<ChangeSummary {...defaultProps} changes={{ added: 1, updated: 0, removed: 0 }} />)
      expect(screen.getByText('1 new added')).toBeInTheDocument()
    })

    it('displays removed count when present', () => {
      render(<ChangeSummary {...defaultProps} changes={{ added: 0, updated: 0, removed: 3 }} />)
      expect(screen.getByText('3 removed')).toBeInTheDocument()
    })

    it('displays title "Sprint Updated"', () => {
      render(<ChangeSummary {...defaultProps} />)
      expect(screen.getByText('Sprint Updated')).toBeInTheDocument()
    })
  })

  describe('Dismissal', () => {
    it('renders dismiss button', () => {
      render(<ChangeSummary {...defaultProps} />)
      expect(screen.getByLabelText('Dismiss notification')).toBeInTheDocument()
    })

    it('calls onDismiss when dismiss button is clicked', () => {
      const onDismiss = vi.fn()
      render(<ChangeSummary {...defaultProps} onDismiss={onDismiss} />)
      fireEvent.click(screen.getByLabelText('Dismiss notification'))
      expect(onDismiss).toHaveBeenCalledTimes(1)
    })

    it('auto-dismisses after default timeout (5 seconds)', async () => {
      const onDismiss = vi.fn()
      render(<ChangeSummary {...defaultProps} onDismiss={onDismiss} />)

      vi.advanceTimersByTime(5000)

      expect(onDismiss).toHaveBeenCalledTimes(1)
    })

    it('auto-dismisses after custom timeout', async () => {
      const onDismiss = vi.fn()
      render(<ChangeSummary {...defaultProps} onDismiss={onDismiss} autoDismissMs={3000} />)

      vi.advanceTimersByTime(3000)

      expect(onDismiss).toHaveBeenCalledTimes(1)
    })

    it('does not auto-dismiss before timeout', async () => {
      const onDismiss = vi.fn()
      render(<ChangeSummary {...defaultProps} onDismiss={onDismiss} />)

      vi.advanceTimersByTime(4000)

      expect(onDismiss).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('has aria-live="polite" for screen reader announcements', () => {
      render(<ChangeSummary {...defaultProps} />)
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('View Details', () => {
    it('does not show View Details link when no story IDs provided', () => {
      render(<ChangeSummary {...defaultProps} />)
      expect(screen.queryByText('View Details')).not.toBeInTheDocument()
    })

    it('shows View Details link when story IDs are provided', () => {
      render(<ChangeSummary {...defaultProps} addedIds={['1-1-test']} />)
      expect(screen.getByText('View Details')).toBeInTheDocument()
    })

    it('expands details when View Details is clicked', () => {
      render(<ChangeSummary {...defaultProps} addedIds={['1-1-test']} />)
      fireEvent.click(screen.getByText('View Details'))
      expect(screen.getByText('Hide Details')).toBeInTheDocument()
    })

    it('collapses details when Hide Details is clicked', () => {
      render(<ChangeSummary {...defaultProps} addedIds={['1-1-test']} />)
      fireEvent.click(screen.getByText('View Details'))
      fireEvent.click(screen.getByText('Hide Details'))
      expect(screen.getByText('View Details')).toBeInTheDocument()
    })

    it('displays story IDs in details view', () => {
      render(
        <ChangeSummary
          {...defaultProps}
          addedIds={['1-1-test', '1-2-another']}
          updatedIds={['2-1-updated']}
          removedIds={['3-1-removed']}
        />
      )
      fireEvent.click(screen.getByText('View Details'))

      expect(screen.getByText('1-1-test')).toBeInTheDocument()
      expect(screen.getByText('1-2-another')).toBeInTheDocument()
      expect(screen.getByText('2-1-updated')).toBeInTheDocument()
      expect(screen.getByText('3-1-removed')).toBeInTheDocument()
    })
  })

  describe('Story Click Handling', () => {
    it('calls onViewStory when story ID is clicked', () => {
      const onViewStory = vi.fn()
      render(<ChangeSummary {...defaultProps} addedIds={['1-1-test']} onViewStory={onViewStory} />)
      fireEvent.click(screen.getByText('View Details'))
      fireEvent.click(screen.getByText('1-1-test'))

      expect(onViewStory).toHaveBeenCalledWith('1-1-test')
    })

    it('does not call onViewStory when not provided', () => {
      render(<ChangeSummary {...defaultProps} addedIds={['1-1-test']} />)
      fireEvent.click(screen.getByText('View Details'))
      fireEvent.click(screen.getByText('1-1-test'))
    })

    it('disables story ID button when onViewStory not provided', () => {
      render(<ChangeSummary {...defaultProps} addedIds={['1-1-test']} />)
      fireEvent.click(screen.getByText('View Details'))
      expect(screen.getByText('1-1-test')).toBeDisabled()
    })
  })
})
