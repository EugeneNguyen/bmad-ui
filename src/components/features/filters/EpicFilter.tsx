import { useMemo, useState } from 'react'
import type { Epic } from '@/types/bmad'

/**
 * Props for the EpicFilter component
 */
export interface EpicFilterProps {
  /** Array of all available epics */
  epics: Epic[]
  /** Currently selected epic ID, or null for "All Epics" */
  selectedEpicId: string | null
  /** Callback when epic selection changes */
  onEpicChange: (epicId: string | null) => void
}

const SEARCH_THRESHOLD = 5

/**
 * Dropdown filter component for filtering the Kanban board by epic.
 *
 * Displays a native select element with:
 * - "All Epics" as the default option
 * - All epics sorted by epic number
 * - Proper accessibility labels for screen readers
 * - Search functionality when >5 epics available
 *
 * @example
 * ```tsx
 * <EpicFilter
 *   epics={epics}
 *   selectedEpicId={selectedEpicId}
 *   onEpicChange={setSelectedEpicId}
 * />
 * ```
 */
export default function EpicFilter({ epics, selectedEpicId, onEpicChange }: EpicFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const sortedEpics = useMemo(() => {
    const safeEpics = epics ?? []
    return [...safeEpics].sort((a, b) => {
      const aNum = parseInt(a.id?.match(/^epic-(\d+)/)?.[1] ?? '0')
      const bNum = parseInt(b.id?.match(/^epic-(\d+)/)?.[1] ?? '0')
      return aNum - bNum
    })
  }, [epics])

  const filteredEpics = useMemo(() => {
    if (!searchTerm) return sortedEpics
    const term = searchTerm.toLowerCase()
    return sortedEpics.filter((epic) => epic.title.toLowerCase().includes(term))
  }, [sortedEpics, searchTerm])

  const formatEpicLabel = (epic: Epic): string => {
    const num = epic.id?.match(/^epic-(\d+)/)?.[1] ?? '?'
    return `Epic ${num}: ${epic.title}`
  }

  const selectedEpic = selectedEpicId ? sortedEpics.find((e) => e.id === selectedEpicId) : null

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    onEpicChange(value === 'all' ? null : value)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSearchSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const epic = sortedEpics.find((ep) => formatEpicLabel(ep) === value)
    if (epic) {
      onEpicChange(epic.id)
      setSearchTerm('')
    }
  }

  const useSearch = sortedEpics.length > SEARCH_THRESHOLD

  if (useSearch) {
    return (
      <div className="relative">
        <label htmlFor="epic-filter-search" className="sr-only">
          Filter by Epic
        </label>
        <input
          id="epic-filter-search"
          type="text"
          list="epic-options"
          value={selectedEpic ? formatEpicLabel(selectedEpic) : searchTerm}
          onChange={handleSearchChange}
          onBlur={handleSearchSelect}
          placeholder={selectedEpic ? formatEpicLabel(selectedEpic) : 'Search epics...'}
          className="block w-full px-4 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Filter by Epic"
        />
        <datalist id="epic-options">
          <option value="All Epics" />
          {filteredEpics.map((epic) => (
            <option key={epic.id} value={formatEpicLabel(epic)} />
          ))}
        </datalist>
        <div aria-live="polite" className="sr-only">
          {selectedEpic
            ? `Filtered to ${formatEpicLabel(selectedEpic)}, ${sortedEpics.length} epics available`
            : `Showing all epics, ${sortedEpics.length} epics available`}
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <label htmlFor="epic-filter" className="sr-only">
        Filter by Epic
      </label>
      <select
        id="epic-filter"
        value={selectedEpicId ?? 'all'}
        onChange={handleChange}
        className="block w-full px-4 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        aria-label="Filter by Epic"
      >
        <option value="all">All Epics</option>
        {sortedEpics.map((epic) => (
          <option key={epic.id} value={epic.id}>
            {formatEpicLabel(epic)}
          </option>
        ))}
      </select>
      <div aria-live="polite" className="sr-only">
        {selectedEpic
          ? `Filtered to ${formatEpicLabel(selectedEpic)}, ${sortedEpics.length} epics available`
          : `Showing all epics, ${sortedEpics.length} epics available`}
      </div>
    </div>
  )
}
