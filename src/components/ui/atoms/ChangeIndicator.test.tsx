import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChangeIndicator } from './ChangeIndicator'

describe('ChangeIndicator', () => {
  describe('Rendering', () => {
    it('returns null when hasChanges is false and no error', () => {
      const { container } = render(<ChangeIndicator hasChanges={false} />)
      expect(container.firstChild).toBeNull()
    })

    it('renders with pulse animation when hasChanges is true', () => {
      const { container } = render(<ChangeIndicator hasChanges={true} />)
      const button = container.querySelector('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('animate-pulse')
    })

    it('displays "Changes Detected" text when hasChanges is true', () => {
      render(<ChangeIndicator hasChanges={true} />)
      expect(screen.getByText('Changes Detected')).toBeInTheDocument()
    })

    it('renders refresh icon', () => {
      const { container } = render(<ChangeIndicator hasChanges={true} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Error State', () => {
    it('renders error state when error prop is set', () => {
      render(<ChangeIndicator hasChanges={false} error="API Error" />)
      expect(screen.getByText('Unable to check for changes')).toBeInTheDocument()
    })

    it('error state has amber styling', () => {
      const { container } = render(<ChangeIndicator hasChanges={false} error="API Error" />)
      const errorDiv = container.firstChild as HTMLElement
      expect(errorDiv).toHaveClass('text-amber-700')
      expect(errorDiv).toHaveClass('bg-amber-50')
    })

    it('error state has role="status"', () => {
      const { container } = render(<ChangeIndicator hasChanges={false} error="API Error" />)
      const errorDiv = container.firstChild as HTMLElement
      expect(errorDiv).toHaveAttribute('role', 'status')
    })

    it('error state has aria-live="polite"', () => {
      const { container } = render(<ChangeIndicator hasChanges={false} error="API Error" />)
      const errorDiv = container.firstChild as HTMLElement
      expect(errorDiv).toHaveAttribute('aria-live', 'polite')
    })

    it('error takes precedence over hasChanges', () => {
      render(<ChangeIndicator hasChanges={true} error="API Error" />)
      expect(screen.getByText('Unable to check for changes')).toBeInTheDocument()
      expect(screen.queryByText('Changes Detected')).not.toBeInTheDocument()
    })
  })

  describe('Tooltip', () => {
    it('shows tooltip on mouse enter', () => {
      const { container } = render(<ChangeIndicator hasChanges={true} />)
      const button = container.querySelector('button')

      fireEvent.mouseEnter(button!)

      expect(
        screen.getByText('Story files have been modified. Click refresh to see latest changes.')
      ).toBeInTheDocument()
    })

    it('hides tooltip on mouse leave', () => {
      const { container } = render(<ChangeIndicator hasChanges={true} />)
      const button = container.querySelector('button')

      fireEvent.mouseEnter(button!)
      expect(
        screen.getByText('Story files have been modified. Click refresh to see latest changes.')
      ).toBeInTheDocument()

      fireEvent.mouseLeave(button!)
      expect(
        screen.queryByText('Story files have been modified. Click refresh to see latest changes.')
      ).not.toBeInTheDocument()
    })

    it('tooltip has correct styling', () => {
      const { container } = render(<ChangeIndicator hasChanges={true} />)
      const button = container.querySelector('button')

      fireEvent.mouseEnter(button!)

      const tooltipText = screen.getByText(
        'Story files have been modified. Click refresh to see latest changes.'
      )
      const tooltip = tooltipText.closest('div')
      expect(tooltip).toHaveClass('bg-slate-800')
      expect(tooltip).toHaveClass('text-white')
      expect(tooltip).toHaveClass('rounded-lg')
    })
  })

  describe('Click Handler', () => {
    it('calls onRefresh callback when clicked', () => {
      const onRefresh = vi.fn()
      const { container } = render(<ChangeIndicator hasChanges={true} onRefresh={onRefresh} />)
      const button = container.querySelector('button')

      fireEvent.click(button!)

      expect(onRefresh).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('has aria-label for screen readers', () => {
      const { container } = render(<ChangeIndicator hasChanges={true} />)
      const button = container.querySelector('button')
      expect(button).toHaveAttribute('aria-label', 'Changes detected. Click to refresh.')
    })

    it('has aria-live="polite" for accessibility announcements', () => {
      const { container } = render(<ChangeIndicator hasChanges={true} />)
      const button = container.querySelector('button')
      expect(button).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('Styling', () => {
    it('has blue color scheme when changes detected', () => {
      const { container } = render(<ChangeIndicator hasChanges={true} />)
      const button = container.querySelector('button')
      expect(button).toHaveClass('text-blue-700')
      expect(button).toHaveClass('bg-blue-50')
    })

    it('has hover styles', () => {
      const { container } = render(<ChangeIndicator hasChanges={true} />)
      const button = container.querySelector('button')
      expect(button).toHaveClass('hover:bg-blue-100')
    })

    it('has transition effects', () => {
      const { container } = render(<ChangeIndicator hasChanges={true} />)
      const button = container.querySelector('button')
      expect(button).toHaveClass('transition-colors')
    })
  })
})
