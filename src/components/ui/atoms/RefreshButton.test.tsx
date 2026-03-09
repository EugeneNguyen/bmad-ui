import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RefreshButton from './RefreshButton'

describe('RefreshButton', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<RefreshButton isLoading={false} onClick={() => {}} />)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('displays "Refresh" text', () => {
      render(<RefreshButton isLoading={false} onClick={() => {}} />)
      expect(screen.getByText('Refresh')).toBeInTheDocument()
    })

    it('has accessible label when not loading', () => {
      render(<RefreshButton isLoading={false} onClick={() => {}} />)
      expect(screen.getByLabelText('Refresh data')).toBeInTheDocument()
    })

    it('has accessible label when loading', () => {
      render(<RefreshButton isLoading={true} onClick={() => {}} />)
      expect(screen.getByLabelText('Refreshing data')).toBeInTheDocument()
    })
  })

  describe('Loading state', () => {
    it('shows spinner when loading', () => {
      render(<RefreshButton isLoading={true} onClick={() => {}} />)
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('does not show spinner when not loading', () => {
      render(<RefreshButton isLoading={false} onClick={() => {}} />)
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    it('disables button when loading', () => {
      render(<RefreshButton isLoading={true} onClick={() => {}} />)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('sets aria-busy when loading', () => {
      render(<RefreshButton isLoading={true} onClick={() => {}} />)
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
    })

    it('sets aria-busy to false when not loading', () => {
      render(<RefreshButton isLoading={false} onClick={() => {}} />)
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'false')
    })
  })

  describe('Disabled state', () => {
    it('disables button when disabled prop is true', () => {
      render(<RefreshButton isLoading={false} onClick={() => {}} disabled={true} />)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('does not disable button when disabled prop is false', () => {
      render(<RefreshButton isLoading={false} onClick={() => {}} disabled={false} />)
      expect(screen.getByRole('button')).not.toBeDisabled()
    })
  })

  describe('Click handling', () => {
    it('calls onClick when clicked', () => {
      const handleClick = vi.fn()
      render(<RefreshButton isLoading={false} onClick={handleClick} />)
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when disabled', () => {
      const handleClick = vi.fn()
      render(<RefreshButton isLoading={false} onClick={handleClick} disabled={true} />)
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('does not call onClick when loading', () => {
      const handleClick = vi.fn()
      render(<RefreshButton isLoading={true} onClick={handleClick} />)
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Keyboard accessibility', () => {
    it('triggers onClick on Enter key', () => {
      const handleClick = vi.fn()
      render(<RefreshButton isLoading={false} onClick={handleClick} />)
      fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' })
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('triggers onClick on Space key', () => {
      const handleClick = vi.fn()
      render(<RefreshButton isLoading={false} onClick={handleClick} />)
      fireEvent.keyDown(screen.getByRole('button'), { key: ' ' })
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not trigger onClick on other keys', () => {
      const handleClick = vi.fn()
      render(<RefreshButton isLoading={false} onClick={handleClick} />)
      fireEvent.keyDown(screen.getByRole('button'), { key: 'Tab' })
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('does not trigger onClick on Enter when disabled', () => {
      const handleClick = vi.fn()
      render(<RefreshButton isLoading={false} onClick={handleClick} disabled={true} />)
      fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' })
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Custom className', () => {
    it('applies custom className', () => {
      render(<RefreshButton isLoading={false} onClick={() => {}} className="custom-class" />)
      expect(screen.getByRole('button')).toHaveClass('custom-class')
    })
  })
})
