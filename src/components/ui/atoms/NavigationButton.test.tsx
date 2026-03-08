import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NavigationButton } from './NavigationButton'

describe('NavigationButton', () => {
  describe('rendering', () => {
    it('renders with previous direction and icon', () => {
      render(<NavigationButton direction="previous" disabled={false} onClick={() => {}} />)

      const button = screen.getByRole('button', { name: /previous/i })
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Previous')
    })

    it('renders with next direction and icon', () => {
      render(<NavigationButton direction="next" disabled={false} onClick={() => {}} />)

      const button = screen.getByRole('button', { name: /next/i })
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Next')
    })

    it('displays story ID in button label', () => {
      render(
        <NavigationButton direction="next" storyId="2.1" disabled={false} onClick={() => {}} />
      )

      const button = screen.getByRole('button', { name: /next: story 2\.1/i })
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Next: 2.1')
    })

    it('displays story ID in previous button label', () => {
      render(
        <NavigationButton direction="previous" storyId="3.2" disabled={false} onClick={() => {}} />
      )

      const button = screen.getByRole('button', { name: /previous: story 3\.2/i })
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Previous: 3.2')
    })
  })

  describe('disabled state', () => {
    it('has disabled attribute when disabled prop is true', () => {
      render(<NavigationButton direction="previous" disabled={true} onClick={() => {}} />)

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('has disabled styling when disabled', () => {
      render(<NavigationButton direction="next" disabled={true} onClick={() => {}} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('opacity-50')
      expect(button).toHaveClass('cursor-not-allowed')
    })

    it('does not have disabled styling when enabled', () => {
      render(<NavigationButton direction="next" disabled={false} onClick={() => {}} />)

      const button = screen.getByRole('button')
      expect(button).not.toHaveClass('opacity-50')
      expect(button).not.toHaveClass('cursor-not-allowed')
      expect(button).toBeEnabled()
    })
  })

  describe('interaction', () => {
    it('calls onClick handler when clicked and not disabled', () => {
      const handleClick = vi.fn()
      render(<NavigationButton direction="next" disabled={false} onClick={handleClick} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when disabled', () => {
      const handleClick = vi.fn()
      render(<NavigationButton direction="previous" disabled={true} onClick={handleClick} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    it('has correct aria-label without story ID', () => {
      render(<NavigationButton direction="next" disabled={false} onClick={() => {}} />)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Next')
    })

    it('has correct aria-label with story ID', () => {
      render(
        <NavigationButton direction="previous" storyId="2.1" disabled={false} onClick={() => {}} />
      )

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Previous: Story 2.1')
    })
  })
})
