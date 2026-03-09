import Icon from './Icon'
import Spinner from './Spinner'

export interface RefreshButtonProps {
  /** Whether the refresh action is in progress */
  isLoading: boolean
  /** Callback fired when the button is clicked */
  onClick: () => void
  /** Whether the button is disabled (in addition to loading state) */
  disabled?: boolean
  /** Optional additional CSS classes */
  className?: string
}

/**
 * Refresh button atom component for triggering manual data refresh.
 *
 * Displays a refresh icon with "Refresh" text. Shows a loading spinner
 * and disables the button during refresh operations.
 *
 * @example
 * ```tsx
 * <RefreshButton
 *   isLoading={isRefreshing}
 *   onClick={handleRefresh}
 * />
 * ```
 */
export default function RefreshButton({
  isLoading,
  onClick,
  disabled = false,
  className = '',
}: RefreshButtonProps) {
  const isDisabled = isLoading || disabled

  const handleClick = () => {
    if (!isDisabled) {
      onClick()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={isDisabled}
      aria-busy={isLoading}
      aria-label={isLoading ? 'Refreshing data' : 'Refresh data'}
      className={`
        inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
        bg-white border border-slate-300 rounded-lg shadow-sm
        hover:bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white
        transition-colors duration-150
        ${className}
      `}
    >
      {isLoading ? (
        <Spinner size="sm" className="text-slate-600" />
      ) : (
        <Icon name="refresh" className="w-4 h-4 text-slate-600" />
      )}
      <span>Refresh</span>
    </button>
  )
}
