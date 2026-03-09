import { useState } from 'react'

export interface ChangeIndicatorProps {
  hasChanges: boolean
  onRefresh?: () => void
  error?: string | null
}

/**
 * Visual indicator for story file changes.
 * Shows pulse animation when changes are detected.
 *
 * @param props - Component props
 * @returns The change indicator component or null if no changes and no error
 *
 * @example
 * ```tsx
 * <ChangeIndicator
 *   hasChanges={true}
 *   onRefresh={() => refetchData()}
 * />
 * ```
 */
export function ChangeIndicator({ hasChanges, onRefresh, error }: ChangeIndicatorProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  if (error) {
    return (
      <div
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-amber-700 bg-amber-50 rounded-lg"
        role="status"
        aria-live="polite"
      >
        <span>Unable to check for changes</span>
      </div>
    )
  }

  if (!hasChanges) {
    return null
  }

  return (
    <div className="relative">
      <button
        onClick={onRefresh}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors animate-pulse"
        aria-label="Changes detected. Click to refresh."
        aria-live="polite"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span>Changes Detected</span>
      </button>

      {showTooltip && (
        <div className="absolute top-full mt-2 left-0 z-50 px-3 py-2 text-sm text-white bg-slate-800 rounded-lg shadow-lg whitespace-nowrap">
          Story files have been modified. Click refresh to see latest changes.
          <div className="absolute -top-1 left-4 w-2 h-2 bg-slate-800 transform rotate-45" />
        </div>
      )}
    </div>
  )
}
