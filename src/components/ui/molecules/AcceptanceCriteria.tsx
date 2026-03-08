import { useMemo, memo } from 'react'

/**
 * Props for the AcceptanceCriteria component
 */
export interface AcceptanceCriteriaProps {
  /** Array of acceptance criteria strings in Given/When/Then format */
  criteria: string[]
}

/**
 * Represents a single parsed criterion line with keyword and text
 */
interface ParsedLine {
  /** The BDD keyword (Given, When, Then, And) or null for plain text */
  keyword: 'Given' | 'When' | 'Then' | 'And' | null
  /** The text content after the keyword */
  text: string
}

/**
 * Represents a fully parsed criterion with its lines
 */
interface ParsedCriterion {
  /** Unique identifier for the criterion */
  id: number
  /** Array of parsed lines that make up this criterion */
  lines: ParsedLine[]
}

/**
 * Parses BDD-style acceptance criteria and formats for display.
 * Handles Given/When/Then/And keywords with proper styling.
 *
 * @param props - Component props
 * @param props.criteria - Array of acceptance criteria strings
 * @returns JSX element displaying formatted acceptance criteria
 *
 * @example
 * ```tsx
 * <AcceptanceCriteria
 *   criteria={[
 *     "Given a user views a story\nWhen they see acceptance criteria\nThen they are formatted nicely"
 *   ]}
 * />
 * ```
 */
export function AcceptanceCriteria({ criteria }: AcceptanceCriteriaProps) {
  const parsedCriteria = useMemo(
    () => (criteria && criteria.length > 0 ? parseAllCriteria(criteria) : []),
    [criteria]
  )

  if (!criteria || criteria.length === 0) {
    return (
      <p className="text-slate-400 italic" data-testid="empty-criteria-message">
        No acceptance criteria defined
      </p>
    )
  }

  return (
    <div className="max-h-64 overflow-y-auto pr-2" data-testid="criteria-container">
      <ol className="list-decimal pl-5 space-y-4">
        {parsedCriteria.map((criterion) => (
          <li key={criterion.id} className="text-slate-700">
            {criterion.lines.map((line, idx) => (
              <CriterionLine
                key={`${criterion.id}-${idx}`}
                keyword={line.keyword}
                text={line.text}
                isNested={line.keyword === 'And'}
              />
            ))}
          </li>
        ))}
      </ol>
    </div>
  )
}

interface CriterionLineProps {
  keyword: ParsedLine['keyword']
  text: string
  isNested: boolean
}

const CriterionLine = memo(function CriterionLine({ keyword, text, isNested }: CriterionLineProps) {
  return (
    <div className={isNested ? 'ml-4' : ''}>
      {keyword && <span className="font-semibold text-slate-900">{keyword} </span>}
      <span>{text}</span>
    </div>
  )
})

/**
 * Parse all criteria strings into structured format.
 *
 * @param criteria - Array of raw criteria strings
 * @returns Array of parsed criteria with unique IDs
 */
function parseAllCriteria(criteria: string[]): ParsedCriterion[] {
  return criteria.map((criterion, index) => ({
    id: index,
    lines: parseCriterionLines(criterion),
  }))
}

/**
 * Parse a single criterion string into keyword/text pairs.
 * Handles Given/When/Then/And keywords case-insensitively.
 * Also handles markdown-style bold keywords (**Given**).
 *
 * @param criterion - Raw criterion string
 * @returns Array of parsed lines with keywords and text
 */
function parseCriterionLines(criterion: string): ParsedLine[] {
  const lines: ParsedLine[] = []
  // Match keywords with optional markdown bold markers and case-insensitive
  const keywordPattern = /^(?:\*\*)?(Given|When|Then|And)(?:\*\*)?\s+/i

  // Split by newlines and process each line
  const rawLines = criterion.split('\n').filter((line) => line.trim())

  for (const rawLine of rawLines) {
    const match = rawLine.match(keywordPattern)
    if (match) {
      // Normalize keyword to proper case (Given, When, Then, And)
      const keyword = (match[1].charAt(0).toUpperCase() +
        match[1].slice(1).toLowerCase()) as ParsedLine['keyword']
      const text = rawLine.slice(match[0].length).trim()
      lines.push({ keyword, text })
    } else {
      // No keyword found, treat as continuation text
      lines.push({ keyword: null, text: rawLine.trim() })
    }
  }

  // If no lines were parsed, treat the whole criterion as plain text
  if (lines.length === 0 && criterion.trim()) {
    lines.push({ keyword: null, text: criterion.trim() })
  }

  return lines
}
