import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import EpicFilter from './EpicFilter'
import type { Epic } from '@/types/bmad'

describe('EpicFilter', () => {
  const mockEpics: Epic[] = [
    {
      id: 'epic-1',
      title: 'Project Foundation',
      description: 'Foundation epic',
      storyIds: ['1-1', '1-2'],
    },
    {
      id: 'epic-2',
      title: 'Sprint Visualization',
      description: 'Visualization epic',
      storyIds: ['2-1', '2-2'],
    },
    {
      id: 'epic-3',
      title: 'Story Discovery',
      description: 'Discovery epic',
      storyIds: ['3-1'],
    },
  ]

  it('renders dropdown with All Epics selected by default', () => {
    const handleChange = vi.fn()
    render(<EpicFilter epics={mockEpics} selectedEpicId={null} onEpicChange={handleChange} />)

    const select = screen.getByLabelText('Filter by Epic')
    expect(select).toBeInTheDocument()
    expect(select).toHaveValue('all')
  })

  it('displays all epic options sorted by epic number', () => {
    const handleChange = vi.fn()
    render(<EpicFilter epics={mockEpics} selectedEpicId={null} onEpicChange={handleChange} />)

    expect(screen.getByText('All Epics')).toBeInTheDocument()
    expect(screen.getByText('Epic 1: Project Foundation')).toBeInTheDocument()
    expect(screen.getByText('Epic 2: Sprint Visualization')).toBeInTheDocument()
    expect(screen.getByText('Epic 3: Story Discovery')).toBeInTheDocument()
  })

  it('calls onEpicChange when selection changes to an epic', () => {
    const handleChange = vi.fn()
    render(<EpicFilter epics={mockEpics} selectedEpicId={null} onEpicChange={handleChange} />)

    const select = screen.getByLabelText('Filter by Epic')
    fireEvent.change(select, { target: { value: 'epic-2' } })

    expect(handleChange).toHaveBeenCalledWith('epic-2')
  })

  it('calls onEpicChange with null when All Epics is selected', () => {
    const handleChange = vi.fn()
    render(<EpicFilter epics={mockEpics} selectedEpicId="epic-1" onEpicChange={handleChange} />)

    const select = screen.getByLabelText('Filter by Epic')
    fireEvent.change(select, { target: { value: 'all' } })

    expect(handleChange).toHaveBeenCalledWith(null)
  })

  it('has accessible label', () => {
    const handleChange = vi.fn()
    render(<EpicFilter epics={mockEpics} selectedEpicId={null} onEpicChange={handleChange} />)

    const select = screen.getByLabelText('Filter by Epic')
    expect(select).toBeInTheDocument()
  })

  it('supports keyboard navigation', () => {
    const handleChange = vi.fn()
    render(<EpicFilter epics={mockEpics} selectedEpicId={null} onEpicChange={handleChange} />)

    const select = screen.getByLabelText('Filter by Epic')
    select.focus()
    expect(select).toHaveFocus()

    fireEvent.keyDown(select, { key: 'ArrowDown' })
    fireEvent.keyDown(select, { key: 'Enter' })
  })

  it('displays current selection correctly', () => {
    const handleChange = vi.fn()
    render(<EpicFilter epics={mockEpics} selectedEpicId="epic-2" onEpicChange={handleChange} />)

    const select = screen.getByLabelText('Filter by Epic')
    expect(select).toHaveValue('epic-2')
  })

  it('announces selection to screen readers', () => {
    const handleChange = vi.fn()
    render(<EpicFilter epics={mockEpics} selectedEpicId="epic-1" onEpicChange={handleChange} />)

    expect(screen.getByText(/Filtered to Epic 1: Project Foundation/)).toBeInTheDocument()
    expect(screen.getByText(/3 epics available/)).toBeInTheDocument()
  })

  it('announces all epics to screen readers when no filter applied', () => {
    const handleChange = vi.fn()
    render(<EpicFilter epics={mockEpics} selectedEpicId={null} onEpicChange={handleChange} />)

    expect(screen.getByText(/Showing all epics/)).toBeInTheDocument()
    expect(screen.getByText(/3 epics available/)).toBeInTheDocument()
  })

  it('shows search input when epics count > 5', () => {
    const manyEpics: Epic[] = Array.from({ length: 6 }, (_, i) => ({
      id: `epic-${i + 1}`,
      title: `Epic ${i + 1}`,
      description: `Epic ${i + 1} description`,
      storyIds: [],
    }))

    const handleChange = vi.fn()
    render(<EpicFilter epics={manyEpics} selectedEpicId={null} onEpicChange={handleChange} />)

    const searchInput = screen.getByPlaceholderText('Search epics...')
    expect(searchInput).toBeInTheDocument()
    expect(searchInput).toHaveAttribute('list', 'epic-options')
  })

  it('shows select dropdown when epics count <= 5', () => {
    const handleChange = vi.fn()
    render(<EpicFilter epics={mockEpics} selectedEpicId={null} onEpicChange={handleChange} />)

    const select = screen.getByLabelText('Filter by Epic')
    expect(select.tagName).toBe('SELECT')
  })

  it('filters epics by search term in search mode', () => {
    const manyEpics: Epic[] = [
      { id: 'epic-1', title: 'Foundation', description: 'Foundation epic', storyIds: [] },
      { id: 'epic-2', title: 'Sprint View', description: 'Sprint epic', storyIds: [] },
      { id: 'epic-3', title: 'Discovery', description: 'Discovery epic', storyIds: [] },
      { id: 'epic-4', title: 'Navigation', description: 'Navigation epic', storyIds: [] },
      { id: 'epic-5', title: 'Settings', description: 'Settings epic', storyIds: [] },
      { id: 'epic-6', title: 'Testing', description: 'Testing epic', storyIds: [] },
    ]

    const handleChange = vi.fn()
    render(<EpicFilter epics={manyEpics} selectedEpicId={null} onEpicChange={handleChange} />)

    const searchInput = screen.getByPlaceholderText('Search epics...')
    fireEvent.change(searchInput, { target: { value: 'Sprint' } })

    expect(screen.getByDisplayValue('Sprint')).toBeInTheDocument()
  })
})
