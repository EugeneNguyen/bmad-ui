import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import KanbanBoard from './KanbanBoard'
import type { Story, Epic, SprintStatus } from '@/types/bmad'

describe('KanbanBoard', () => {
  const mockStories: Story[] = [
    {
      id: '1-1-test-story',
      title: 'Test Story',
      description: 'Test description',
      status: 'ready',
      epicId: 'epic-1',
      acceptanceCriteria: [],
    },
    {
      id: '1-2-dev-story',
      title: 'Dev Story',
      description: 'Dev description',
      status: 'in-dev',
      epicId: 'epic-1',
      acceptanceCriteria: [],
    },
    {
      id: '1-3-review-story',
      title: 'Review Story',
      description: 'Review description',
      status: 'ready-for-review',
      epicId: 'epic-1',
      acceptanceCriteria: [],
    },
    {
      id: '1-4-done-story',
      title: 'Done Story',
      description: 'Done description',
      status: 'done',
      epicId: 'epic-1',
      acceptanceCriteria: [],
    },
  ]

  const mockEpics: Epic[] = [
    {
      id: 'epic-1',
      title: 'Test Epic',
      description: 'Test epic description',
      storyIds: ['1-1-test-story', '1-2-dev-story', '1-3-review-story', '1-4-done-story'],
    },
  ]

  const mockSprintStatus: SprintStatus = {
    sprintId: 'sprint-1',
    name: 'Sprint 1',
    stories: mockStories,
    lastUpdated: '2026-03-07T00:00:00Z',
  }

  it('renders all four lanes', () => {
    render(<KanbanBoard stories={mockStories} epics={mockEpics} sprintStatus={mockSprintStatus} />)

    expect(screen.getByRole('heading', { name: 'Ready' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'In Dev' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Ready For Review' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Done' })).toBeInTheDocument()
  })

  it('groups stories by status', () => {
    render(<KanbanBoard stories={mockStories} epics={mockEpics} sprintStatus={mockSprintStatus} />)

    expect(screen.getByText('Test Story')).toBeInTheDocument()
    expect(screen.getByText('Dev Story')).toBeInTheDocument()
    expect(screen.getByText('Review Story')).toBeInTheDocument()
    expect(screen.getByText('Done Story')).toBeInTheDocument()
  })

  it('has correct ARIA attributes', () => {
    const { container } = render(
      <KanbanBoard stories={mockStories} epics={mockEpics} sprintStatus={mockSprintStatus} />
    )

    const board = container.querySelector('[role="region"]')
    expect(board).toBeInTheDocument()
    expect(board).toHaveAttribute('aria-label', 'Kanban board')
  })

  it('uses responsive layout classes', () => {
    const { container } = render(
      <KanbanBoard stories={mockStories} epics={mockEpics} sprintStatus={mockSprintStatus} />
    )

    const board = container.querySelector('.grid')
    expect(board).toHaveClass('grid-cols-1')
    expect(board).toHaveClass('md:grid-cols-2')
    expect(board).toHaveClass('lg:grid-cols-4')
  })

  it('handles empty stories array', () => {
    render(<KanbanBoard stories={[]} epics={mockEpics} sprintStatus={mockSprintStatus} />)

    expect(screen.getAllByText('No stories in this lane')).toHaveLength(4)
  })

  it('supports keyboard navigation through lanes', () => {
    const { container } = render(
      <KanbanBoard stories={mockStories} epics={mockEpics} sprintStatus={mockSprintStatus} />
    )

    const lanes = container.querySelectorAll('[role="list"]')
    expect(lanes).toHaveLength(4)

    lanes.forEach((lane) => {
      expect(lane).toHaveAttribute('tabindex', '0')
    })
  })
})
