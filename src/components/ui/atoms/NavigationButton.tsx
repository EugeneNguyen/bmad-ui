import Icon from './Icon'

interface NavigationButtonProps {
  direction: 'previous' | 'next'
  storyId?: string
  disabled: boolean
  onClick: () => void
}

/**
 * Navigation button for story modal with disabled state.
 * Displays arrow icon and optional story ID label.
 */
export function NavigationButton({ direction, storyId, disabled, onClick }: NavigationButtonProps) {
  const iconName = direction === 'previous' ? 'chevron-left' : 'chevron-right'
  const label = direction === 'previous' ? 'Previous' : 'Next'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500
        ${
          disabled
            ? 'opacity-50 cursor-not-allowed text-slate-400'
            : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
        }
      `}
      aria-label={`${label}${storyId ? `: Story ${storyId}` : ''}`}
    >
      {direction === 'previous' && <Icon name={iconName} className="w-4 h-4" />}
      <span className="text-sm font-medium">
        {label}
        {storyId ? `: ${storyId}` : ''}
      </span>
      {direction === 'next' && <Icon name={iconName} className="w-4 h-4" />}
    </button>
  )
}
