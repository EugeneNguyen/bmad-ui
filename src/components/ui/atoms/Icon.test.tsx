import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Icon from './Icon'

describe('Icon', () => {
  describe('Rendering', () => {
    it('renders x icon', () => {
      const { container } = render(<Icon name="x" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('renders refresh icon', () => {
      const { container } = render(<Icon name="refresh" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('returns null for unknown icon', () => {
      const { container } = render(<Icon name={'unknown' as 'x'} />)
      const svg = container.querySelector('svg')
      expect(svg).not.toBeInTheDocument()
    })
  })

  describe('SVG attributes', () => {
    it('has correct viewBox', () => {
      const { container } = render(<Icon name="x" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
    })

    it('has aria-hidden for accessibility', () => {
      const { container } = render(<Icon name="x" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('Custom className', () => {
    it('applies custom className', () => {
      const { container } = render(<Icon name="x" className="w-6 h-6" />)
      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('w-6', 'h-6')
    })
  })
})
