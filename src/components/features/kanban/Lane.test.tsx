import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Lane from './Lane'
import type { Story } from '@/types/bmad'

describe('Lane', () => {
  const mockStory: Story = {
    id: '1-1-test-story',
    title: 'Test Story',
    description: 'Test description',
    status: 'ready',
    epicId: 'epic-1',
    acceptanceCriteria: [],
  }

  const mockStories: Story[] = [
    mockStory,
    {
      id: '1-2-another-story',
      title: 'Another Story',
      description: 'Another description',
      status: 'ready',
      epicId: 'epic-1',
      acceptanceCriteria: [],
    },
  ]

  it('renders with correct title', () => {
    render(<Lane status="ready" title="Ready to Start" stories={[]} />)
    expect(screen.getByText('Ready to Start')).toBeInTheDocument()
  })

  it('shows story count badge', () => {
    render(<Lane status="ready" title="Ready to Start" stories={mockStories} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('displays empty state when no stories', () => {
    render(<Lane status="ready" title="Ready to Start" stories={[]} />)
    expect(screen.getByText('No stories in this lane')).toBeInTheDocument()
  })

  it('displays all stories', () => {
    render(<Lane status="ready" title="Ready to Start" stories={mockStories} />)
    expect(screen.getByText('Test Story')).toBeInTheDocument()
    expect(screen.getByText('Another Story')).toBeInTheDocument()
  })

  it('has correct ARIA attributes', () => {
    const { container } = render(<Lane status="ready" title="Ready to Start" stories={mockStories} />)
    
    const lane = container.querySelector('[role="list"]')
    expect(lane).toBeInTheDocument()
    expect(lane).toHaveAttribute('aria-labelledby', 'lane-title-ready')
    expect(lane).toHaveAttribute('aria-describedby', 'lane-desc-ready')
  })

  it('announces story count to screen readers', () => {
    render(<Lane status="ready" title="Ready to Start" stories={mockStories} />)
    expect(screen.getByText('2 stories in this lane')).toBeInTheDocument()
  })

  it('calls onStoryClick when story is clicked', () => {
    const handleClick = vi.fn()
    render(<Lane status="ready" title="Ready to Start" stories={mockStories} onStoryClick={handleClick} />)
    
    screen.getByText('Test Story').click()
    expect(handleClick).toHaveBeenCalledWith(mockStory)
  })

  it('has focusable lane container', () => {
    const { container } = render(<Lane status="ready" title="Ready to Start" stories={[]} />)
    const lane = container.querySelector('[tabindex="0"]')
    expect(lane).toBeInTheDocument()
  })
})
