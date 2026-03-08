import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Spinner from './Spinner'

describe('Spinner', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Spinner />)
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('has aria-label for accessibility', () => {
      render(<Spinner />)
      expect(screen.getByLabelText('Loading')).toBeInTheDocument()
    })
  })

  describe('Size variants', () => {
    it('applies small size classes', () => {
      const { container } = render(<Spinner size="sm" />)
      const spinner = container.querySelector('.w-4')
      expect(spinner).toBeInTheDocument()
    })

    it('applies medium size classes (default)', () => {
      const { container } = render(<Spinner size="md" />)
      const spinner = container.querySelector('.w-6')
      expect(spinner).toBeInTheDocument()
    })

    it('applies large size classes', () => {
      const { container } = render(<Spinner size="lg" />)
      const spinner = container.querySelector('.w-8')
      expect(spinner).toBeInTheDocument()
    })

    it('defaults to medium size when not specified', () => {
      const { container } = render(<Spinner />)
      const spinner = container.querySelector('.w-6')
      expect(spinner).toBeInTheDocument()
    })
  })

  describe('Custom className', () => {
    it('applies custom className', () => {
      const { container } = render(<Spinner className="text-blue-500" />)
      const spinner = container.querySelector('.text-blue-500')
      expect(spinner).toBeInTheDocument()
    })
  })

  describe('Animation', () => {
    it('has animate-spin class', () => {
      const { container } = render(<Spinner />)
      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })
  })
})
