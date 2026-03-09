import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StoryBadge } from './StoryBadge'

describe('StoryBadge', () => {
  describe('Rendering', () => {
    it('renders "New" badge when type is "new"', () => {
      render(<StoryBadge type="new" />)
      expect(screen.getByText('New')).toBeInTheDocument()
    })

    it('renders "Updated" badge when type is "updated"', () => {
      render(<StoryBadge type="updated" />)
      expect(screen.getByText('Updated')).toBeInTheDocument()
    })

    it('renders "Removed" badge when type is "removed"', () => {
      render(<StoryBadge type="removed" />)
      expect(screen.getByText('Removed')).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('applies green styling for "new" badge', () => {
      const { container } = render(<StoryBadge type="new" />)
      const badge = container.firstChild as HTMLElement
      expect(badge).toHaveClass('bg-green-100')
      expect(badge).toHaveClass('text-green-800')
      expect(badge).toHaveClass('border-green-200')
    })

    it('applies blue styling for "updated" badge', () => {
      const { container } = render(<StoryBadge type="updated" />)
      const badge = container.firstChild as HTMLElement
      expect(badge).toHaveClass('bg-blue-100')
      expect(badge).toHaveClass('text-blue-800')
      expect(badge).toHaveClass('border-blue-200')
    })

    it('applies red styling for "removed" badge', () => {
      const { container } = render(<StoryBadge type="removed" />)
      const badge = container.firstChild as HTMLElement
      expect(badge).toHaveClass('bg-red-100')
      expect(badge).toHaveClass('text-red-800')
      expect(badge).toHaveClass('border-red-200')
    })

    it('has base styling classes', () => {
      const { container } = render(<StoryBadge type="new" />)
      const badge = container.firstChild as HTMLElement
      expect(badge).toHaveClass('px-2')
      expect(badge).toHaveClass('py-0.5')
      expect(badge).toHaveClass('text-xs')
      expect(badge).toHaveClass('font-medium')
      expect(badge).toHaveClass('rounded-full')
      expect(badge).toHaveClass('border')
    })
  })

  describe('Accessibility', () => {
    it('has aria-label for "new" badge', () => {
      const { container } = render(<StoryBadge type="new" />)
      const badge = container.firstChild as HTMLElement
      expect(badge).toHaveAttribute('aria-label', 'Story new')
    })

    it('has aria-label for "updated" badge', () => {
      const { container } = render(<StoryBadge type="updated" />)
      const badge = container.firstChild as HTMLElement
      expect(badge).toHaveAttribute('aria-label', 'Story updated')
    })

    it('has aria-label for "removed" badge', () => {
      const { container } = render(<StoryBadge type="removed" />)
      const badge = container.firstChild as HTMLElement
      expect(badge).toHaveAttribute('aria-label', 'Story removed')
    })
  })
})
