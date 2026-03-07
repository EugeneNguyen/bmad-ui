import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import StoryCard from './StoryCard'
import type { Story } from '@/types/bmad'

describe('StoryCard', () => {
  const mockStory: Story = {
    id: '1-1-test-story',
    title: 'Test Story',
    description: 'Test description for the story',
    status: 'ready',
    epicId: 'epic-1',
    acceptanceCriteria: [],
  }

  it('renders story title', () => {
    render(<StoryCard story={mockStory} />)
    expect(screen.getByText('Test Story')).toBeInTheDocument()
  })

  it('renders story description', () => {
    render(<StoryCard story={mockStory} />)
    expect(screen.getByText('Test description for the story')).toBeInTheDocument()
  })

  it('has correct ARIA attributes', () => {
    const { container } = render(<StoryCard story={mockStory} />)
    const card = container.querySelector('[role="listitem"]')
    expect(card).toBeInTheDocument()
    expect(card).toHaveAttribute('aria-label', 'Test Story')
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<StoryCard story={mockStory} onClick={handleClick} />)

    screen.getByText('Test Story').click()
    expect(handleClick).toHaveBeenCalledWith(mockStory)
  })

  it('supports keyboard navigation', () => {
    const handleClick = vi.fn()
    const { container } = render(<StoryCard story={mockStory} onClick={handleClick} />)

    const card = container.querySelector('[tabindex="0"]')
    expect(card).toBeInTheDocument()
  })
})
