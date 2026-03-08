import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import StoryCard from './StoryCard'
import type { Story } from '@/types/bmad'

describe('StoryCard', () => {
  const mockStory: Story = {
    id: '2-2-story-card-display',
    title: 'Story Card Display',
    description: 'Test description',
    status: 'ready',
    epicId: 'epic-2',
    acceptanceCriteria: [],
  }

  describe('Story ID display', () => {
    it('displays story ID in "Story X.Y" format', () => {
      render(<StoryCard story={mockStory} />)
      expect(screen.getByText('Story 2.2')).toBeInTheDocument()
    })

    it('extracts story number from story id correctly', () => {
      const story: Story = { ...mockStory, id: '3-1-story-detail-modal' }
      render(<StoryCard story={story} />)
      expect(screen.getByText('Story 3.1')).toBeInTheDocument()
    })
  })

  describe('Epic reference display', () => {
    it('displays epic reference derived from story id', () => {
      render(<StoryCard story={mockStory} />)
      expect(screen.getByText(/Epic 2/)).toBeInTheDocument()
    })

    it('extracts epic number from story id correctly', () => {
      const story: Story = { ...mockStory, id: '3-1-story-detail-modal' }
      render(<StoryCard story={story} />)
      expect(screen.getByText(/Epic 3/)).toBeInTheDocument()
    })
  })

  describe('Title handling', () => {
    it('renders short title without truncation', () => {
      render(<StoryCard story={mockStory} />)
      expect(screen.getByText('Story Card Display')).toBeInTheDocument()
    })

    it('renders long title with line-clamp-1 class', () => {
      const longTitle =
        'This is a very long story title that exceeds sixty characters and should be truncated'
      const story: Story = { ...mockStory, title: longTitle }
      const { container } = render(<StoryCard story={story} />)
      const titleElement = container.querySelector('.line-clamp-1')
      expect(titleElement).toBeInTheDocument()
    })

    it('shows full title in tooltip via title attribute', () => {
      const longTitle =
        'This is a very long story title that exceeds sixty characters and should be truncated'
      const story: Story = { ...mockStory, title: longTitle }
      const { container } = render(<StoryCard story={story} />)
      const titleElement = container.querySelector('[title]')
      expect(titleElement).toHaveAttribute('title', longTitle)
    })
  })

  describe('Status badge', () => {
    it('displays "Ready" for ready status', () => {
      render(<StoryCard story={{ ...mockStory, status: 'ready' }} />)
      expect(screen.getByText('Ready')).toBeInTheDocument()
    })

    it('displays "In Dev" for in-dev status', () => {
      render(<StoryCard story={{ ...mockStory, status: 'in-dev' }} />)
      expect(screen.getByText('In Dev')).toBeInTheDocument()
    })

    it('displays "Ready For Review" for ready-for-review status', () => {
      render(<StoryCard story={{ ...mockStory, status: 'ready-for-review' }} />)
      expect(screen.getByText('Ready For Review')).toBeInTheDocument()
    })

    it('displays "Done" for done status', () => {
      render(<StoryCard story={{ ...mockStory, status: 'done' }} />)
      expect(screen.getByText('Done')).toBeInTheDocument()
    })

    it('uses slate variant for ready status', () => {
      const { container } = render(<StoryCard story={{ ...mockStory, status: 'ready' }} />)
      const badge = container.querySelector('.bg-slate-100')
      expect(badge).toBeInTheDocument()
    })

    it('uses amber variant for in-dev status', () => {
      const { container } = render(<StoryCard story={{ ...mockStory, status: 'in-dev' }} />)
      const badge = container.querySelector('.bg-amber-100')
      expect(badge).toBeInTheDocument()
    })

    it('uses violet variant for ready-for-review status', () => {
      const { container } = render(
        <StoryCard story={{ ...mockStory, status: 'ready-for-review' }} />
      )
      const badge = container.querySelector('.bg-violet-100')
      expect(badge).toBeInTheDocument()
    })

    it('uses green variant for done status', () => {
      const { container } = render(<StoryCard story={{ ...mockStory, status: 'done' }} />)
      const badge = container.querySelector('.bg-green-100')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('Hover effects', () => {
    it('has hover:shadow-xl class for shadow effect', () => {
      const { container } = render(<StoryCard story={mockStory} />)
      const card = container.querySelector('.hover\\:shadow-xl')
      expect(card).toBeInTheDocument()
    })

    it('has hover:scale class for lift effect', () => {
      const { container } = render(<StoryCard story={mockStory} />)
      const card = container.querySelector('[class*="hover:scale"]')
      expect(card).toBeInTheDocument()
    })

    it('has transition-all class for smooth animation', () => {
      const { container } = render(<StoryCard story={mockStory} />)
      const card = container.querySelector('.transition-all')
      expect(card).toBeInTheDocument()
    })

    it('has cursor-pointer class', () => {
      const { container } = render(<StoryCard story={mockStory} />)
      const card = container.querySelector('.cursor-pointer')
      expect(card).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has role="listitem"', () => {
      const { container } = render(<StoryCard story={mockStory} />)
      const card = container.querySelector('[role="listitem"]')
      expect(card).toBeInTheDocument()
    })

    it('has aria-label with story title and status', () => {
      render(<StoryCard story={mockStory} />)
      expect(screen.getByLabelText(/Story Card Display/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Ready/)).toBeInTheDocument()
    })

    it('is focusable as a button element', () => {
      const { container } = render(<StoryCard story={mockStory} />)
      const button = container.querySelector('button[type="button"]')
      expect(button).toBeInTheDocument()
      expect(button).not.toHaveAttribute('tabindex')
    })

    it('has visible focus ring class', () => {
      const { container } = render(<StoryCard story={mockStory} />)
      const card = container.querySelector('.focus\\:ring-2')
      expect(card).toBeInTheDocument()
    })
  })

  describe('Click handling', () => {
    it('calls onClick when clicked', () => {
      const handleClick = vi.fn()
      render(<StoryCard story={mockStory} onClick={handleClick} />)
      fireEvent.click(screen.getByRole('listitem'))
      expect(handleClick).toHaveBeenCalledWith(mockStory)
    })

    it('calls onClick when Enter key is pressed', () => {
      const handleClick = vi.fn()
      render(<StoryCard story={mockStory} onClick={handleClick} />)
      fireEvent.keyDown(screen.getByRole('listitem'), { key: 'Enter' })
      expect(handleClick).toHaveBeenCalledWith(mockStory)
    })

    it('calls onClick when Space key is pressed', () => {
      const handleClick = vi.fn()
      render(<StoryCard story={mockStory} onClick={handleClick} />)
      fireEvent.keyDown(screen.getByRole('listitem'), { key: ' ' })
      expect(handleClick).toHaveBeenCalledWith(mockStory)
    })
  })

  describe('Performance optimization', () => {
    it('is wrapped with React.memo (displayName check)', () => {
      expect(StoryCard.displayName).toBe('StoryCard')
    })
  })
})
