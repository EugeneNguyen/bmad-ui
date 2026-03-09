import { useState, useEffect, useCallback, memo } from 'react'
import Icon from '@/components/ui/atoms/Icon'

export interface ChangeCounts {
  added: number
  updated: number
  removed: number
}

export interface ChangeSummaryProps {
  /** Change counts for added, updated, and removed stories */
  changes: ChangeCounts
  /** Callback when the summary is dismissed */
  onDismiss: () => void
  /** Optional callback when a story ID is clicked */
  onViewStory?: (storyId: string) => void
  /** Optional list of story IDs that were added */
  addedIds?: string[]
  /** Optional list of story IDs that were updated */
  updatedIds?: string[]
  /** Optional list of story IDs that were removed */
  removedIds?: string[]
  /** Auto-dismiss timeout in milliseconds (default: 5000) */
  autoDismissMs?: number
}

function ChangeSummaryComponent({
  changes,
  onDismiss,
  onViewStory,
  addedIds = [],
  updatedIds = [],
  removedIds = [],
  autoDismissMs = 5000,
}: ChangeSummaryProps) {
  const [showDetails, setShowDetails] = useState(false)

  const handleDismiss = useCallback(() => {
    onDismiss()
  }, [onDismiss])

  useEffect(() => {
    const timer = setTimeout(handleDismiss, autoDismissMs)
    return () => clearTimeout(timer)
  }, [autoDismissMs, handleDismiss])

  const hasChanges = changes.added > 0 || changes.updated > 0 || changes.removed > 0

  if (!hasChanges) {
    return null
  }

  const handleStoryClick = (storyId: string) => {
    if (onViewStory) {
      onViewStory(storyId)
    }
  }

  const renderStoryList = (ids: string[], label: string, colorClass: string) => {
    if (ids.length === 0) return null
    return (
      <div className="mt-2">
        <span className={`text-xs font-medium ${colorClass}`}>{label}:</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {ids.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => handleStoryClick(id)}
              disabled={!onViewStory}
              className={`
                px-2 py-0.5 text-xs rounded bg-slate-100 hover:bg-slate-200
                ${onViewStory ? 'cursor-pointer underline' : 'cursor-default'}
                focus:ring-2 focus:ring-blue-500 focus:outline-none
              `}
            >
              {id}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="
        fixed bottom-4 right-4 z-50
        bg-white border border-slate-200 rounded-lg shadow-lg
        p-4 max-w-md
        animate-slide-in
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Sprint Updated</h3>
          <div className="flex flex-wrap gap-3 text-sm">
            {changes.added > 0 && (
              <span className="text-green-700">
                {changes.added} new{changes.added !== 1 ? 's' : ''} added
              </span>
            )}
            {changes.updated > 0 && (
              <span className="text-amber-700">{changes.updated} updated</span>
            )}
            {changes.removed > 0 && <span className="text-red-700">{changes.removed} removed</span>}
          </div>

          {(addedIds.length > 0 || updatedIds.length > 0 || removedIds.length > 0) && (
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {showDetails ? 'Hide Details' : 'View Details'}
            </button>
          )}

          {showDetails && (
            <div className="mt-3 pt-3 border-t border-slate-200">
              {renderStoryList(addedIds, 'Added', 'text-green-700')}
              {renderStoryList(updatedIds, 'Updated', 'text-amber-700')}
              {renderStoryList(removedIds, 'Removed', 'text-red-700')}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          aria-label="Dismiss notification"
        >
          <Icon name="x" className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

ChangeSummaryComponent.displayName = 'ChangeSummary'

const ChangeSummary = memo(ChangeSummaryComponent)

export default ChangeSummary
