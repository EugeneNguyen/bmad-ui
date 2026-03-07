import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Badge from './Badge'

describe('Badge', () => {
  it('renders children correctly', () => {
    render(<Badge variant="slate">Test Badge</Badge>)
    expect(screen.getByText('Test Badge')).toBeInTheDocument()
  })

  it('applies slate variant styles', () => {
    const { container } = render(<Badge variant="slate">Slate</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge).toHaveClass('bg-slate-100')
    expect(badge).toHaveClass('text-slate-700')
  })

  it('applies amber variant styles', () => {
    const { container } = render(<Badge variant="amber">Amber</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge).toHaveClass('bg-amber-100')
    expect(badge).toHaveClass('text-amber-700')
  })

  it('applies violet variant styles', () => {
    const { container } = render(<Badge variant="violet">Violet</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge).toHaveClass('bg-violet-100')
    expect(badge).toHaveClass('text-violet-700')
  })

  it('applies green variant styles', () => {
    const { container } = render(<Badge variant="green">Green</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge).toHaveClass('bg-green-100')
    expect(badge).toHaveClass('text-green-700')
  })

  it('has base styling classes', () => {
    const { container } = render(<Badge variant="slate">Badge</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge).toHaveClass('px-2.5')
    expect(badge).toHaveClass('py-0.5')
    expect(badge).toHaveClass('rounded-full')
    expect(badge).toHaveClass('text-xs')
    expect(badge).toHaveClass('font-medium')
  })

  it('applies custom className', () => {
    const { container } = render(
      <Badge variant="slate" className="custom-class">
        Badge
      </Badge>
    )
    const badge = container.firstChild as HTMLElement
    expect(badge).toHaveClass('custom-class')
  })
})
