import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AcceptanceCriteria } from './AcceptanceCriteria'

describe('AcceptanceCriteria', () => {
  const criteriaWithKeywords = [
    '**Given** a product owner views a story detail modal\n**When** the acceptance criteria section is displayed\n**Then** each criterion is formatted properly',
  ]

  const multipleAndClauses = [
    '**Given** a product owner views acceptance criteria\n**When** a criterion has multiple And clauses\n**Then** each And is displayed on a new line\n**And** indentation clearly shows hierarchy\n**And** the structure is easy to read',
  ]

  const multipleCriteria = [
    '**Given** a precondition\n**When** some action\n**Then** outcome',
    '**Given** another precondition\n**When** another action\n**Then** another outcome',
  ]

  const generateLongCriteria = () => {
    const criteria: string[] = []
    for (let i = 0; i < 20; i++) {
      criteria.push(
        `**Given** precondition ${i}\n**When** action ${i}\n**Then** outcome ${i}\n**And** additional condition ${i}`
      )
    }
    return criteria
  }

  describe('Given/When/Then formatting (AC1)', () => {
    it('renders Given keyword as bold', () => {
      render(<AcceptanceCriteria criteria={criteriaWithKeywords} />)
      const givenElements = screen.getAllByText('Given')
      expect(givenElements.length).toBeGreaterThan(0)
      givenElements.forEach((el) => {
        expect(el).toHaveClass('font-semibold')
        expect(el).toHaveClass('text-slate-900')
      })
    })

    it('renders When keyword as bold', () => {
      render(<AcceptanceCriteria criteria={criteriaWithKeywords} />)
      const whenElements = screen.getAllByText('When')
      expect(whenElements.length).toBeGreaterThan(0)
      whenElements.forEach((el) => {
        expect(el).toHaveClass('font-semibold')
        expect(el).toHaveClass('text-slate-900')
      })
    })

    it('renders Then keyword as bold', () => {
      render(<AcceptanceCriteria criteria={criteriaWithKeywords} />)
      const thenElements = screen.getAllByText('Then')
      expect(thenElements.length).toBeGreaterThan(0)
      thenElements.forEach((el) => {
        expect(el).toHaveClass('font-semibold')
        expect(el).toHaveClass('text-slate-900')
      })
    })

    it('numbers criteria with ordered list', () => {
      const { container } = render(<AcceptanceCriteria criteria={multipleCriteria} />)
      const listItems = container.querySelectorAll('ol > li')
      expect(listItems).toHaveLength(2)
      listItems.forEach((li) => {
        expect(li).toHaveClass('text-slate-700')
      })
    })

    it('applies spacing between criteria', () => {
      const { container } = render(<AcceptanceCriteria criteria={multipleCriteria} />)
      const list = container.querySelector('ol')
      expect(list).toHaveClass('space-y-4')
    })
  })

  describe('Multiple "And" clauses (AC2)', () => {
    it('renders multiple And clauses', () => {
      render(<AcceptanceCriteria criteria={multipleAndClauses} />)
      const andElements = screen.getAllByText('And')
      expect(andElements.length).toBe(2)
    })

    it('indents And clauses', () => {
      render(<AcceptanceCriteria criteria={multipleAndClauses} />)
      const andElements = screen.getAllByText('And')
      andElements.forEach((el) => {
        const parent = el.parentElement
        expect(parent).toHaveClass('ml-4')
      })
    })

    it('renders And keywords as bold', () => {
      render(<AcceptanceCriteria criteria={multipleAndClauses} />)
      const andElements = screen.getAllByText('And')
      andElements.forEach((el) => {
        expect(el).toHaveClass('font-semibold')
      })
    })
  })

  describe('Empty criteria handling (AC3)', () => {
    it('displays message for empty array', () => {
      render(<AcceptanceCriteria criteria={[]} />)
      expect(screen.getByTestId('empty-criteria-message')).toBeInTheDocument()
      expect(screen.getByTestId('empty-criteria-message')).toHaveTextContent(
        'No acceptance criteria defined'
      )
    })

    it('displays message for null criteria', () => {
      render(<AcceptanceCriteria criteria={null as unknown as string[]} />)
      expect(screen.getByTestId('empty-criteria-message')).toBeInTheDocument()
    })

    it('displays message for undefined criteria', () => {
      render(<AcceptanceCriteria criteria={undefined as unknown as string[]} />)
      expect(screen.getByTestId('empty-criteria-message')).toBeInTheDocument()
    })

    it('styles empty message with italics and muted color', () => {
      render(<AcceptanceCriteria criteria={[]} />)
      const message = screen.getByTestId('empty-criteria-message')
      expect(message).toHaveClass('italic')
      expect(message).toHaveClass('text-slate-400')
    })
  })

  describe('Scrollable container (AC5)', () => {
    it('has scrollable container with max-height', () => {
      const { container } = render(<AcceptanceCriteria criteria={generateLongCriteria()} />)
      const scrollContainer = container.querySelector('[data-testid="criteria-container"]')
      expect(scrollContainer).toHaveClass('max-h-64')
      expect(scrollContainer).toHaveClass('overflow-y-auto')
    })

    it('has padding for scrollbar space', () => {
      const { container } = render(<AcceptanceCriteria criteria={generateLongCriteria()} />)
      const scrollContainer = container.querySelector('[data-testid="criteria-container"]')
      expect(scrollContainer).toHaveClass('pr-2')
    })
  })

  describe('Copyable text (AC6)', () => {
    it('renders text content for selection', () => {
      const { container } = render(<AcceptanceCriteria criteria={criteriaWithKeywords} />)
      const textElements = container.querySelectorAll('span')
      expect(textElements.length).toBeGreaterThan(0)
    })

    it('preserves line breaks in structure', () => {
      const { container } = render(<AcceptanceCriteria criteria={criteriaWithKeywords} />)
      const lines = container.querySelectorAll('div')
      expect(lines.length).toBeGreaterThan(0)
    })

    it('text content contains all criteria text', () => {
      const { container } = render(<AcceptanceCriteria criteria={criteriaWithKeywords} />)
      const criteriaContainer = container.querySelector('[data-testid="criteria-container"]')
      expect(criteriaContainer).not.toBeNull()
      const textContent = criteriaContainer?.textContent ?? ''
      expect(textContent).toContain('Given')
      expect(textContent).toContain('When')
      expect(textContent).toContain('Then')
      expect(textContent).toContain('a product owner views a story detail modal')
    })

    it('all text is selectable (no user-select: none)', () => {
      const { container } = render(<AcceptanceCriteria criteria={criteriaWithKeywords} />)
      const spans = container.querySelectorAll('span')
      spans.forEach((span) => {
        const style = window.getComputedStyle(span)
        expect(style.userSelect).not.toBe('none')
      })
    })
  })

  describe('Mixed markdown and plain keywords', () => {
    it('handles mixed markdown and plain keywords', () => {
      const mixedCriteria = ['**Given** a precondition\nWhen an action\n**Then** outcome']
      render(<AcceptanceCriteria criteria={mixedCriteria} />)
      expect(screen.getByText('Given')).toBeInTheDocument()
      expect(screen.getByText('When')).toBeInTheDocument()
      expect(screen.getByText('Then')).toBeInTheDocument()
    })
  })

  describe('Plain text without keywords', () => {
    it('renders plain text criteria without keywords', () => {
      const plainCriteria = ['This is just plain text without BDD keywords']
      render(<AcceptanceCriteria criteria={plainCriteria} />)
      expect(screen.getByText(/This is just plain text/)).toBeInTheDocument()
    })
  })

  describe('Case-insensitive keyword parsing', () => {
    it('handles lowercase keywords', () => {
      const lowercaseCriteria = ['given a precondition\nwhen an action\nthen an outcome']
      render(<AcceptanceCriteria criteria={lowercaseCriteria} />)
      expect(screen.getByText('Given')).toBeInTheDocument()
      expect(screen.getByText('When')).toBeInTheDocument()
      expect(screen.getByText('Then')).toBeInTheDocument()
    })
  })
})
