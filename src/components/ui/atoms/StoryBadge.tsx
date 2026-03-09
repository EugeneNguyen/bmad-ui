type BadgeType = 'new' | 'updated' | 'removed'

export interface StoryBadgeProps {
  type: BadgeType
}

const BADGE_STYLES: Record<BadgeType, string> = {
  new: 'bg-green-100 text-green-800 border-green-200',
  updated: 'bg-blue-100 text-blue-800 border-blue-200',
  removed: 'bg-red-100 text-red-800 border-red-200',
}

const BADGE_LABELS: Record<BadgeType, string> = {
  new: 'New',
  updated: 'Updated',
  removed: 'Removed',
}

export function StoryBadge({ type }: StoryBadgeProps) {
  return (
    <span
      className={`px-2 py-0.5 text-xs font-medium rounded-full border ${BADGE_STYLES[type]}`}
      aria-label={`Story ${BADGE_LABELS[type].toLowerCase()}`}
    >
      {BADGE_LABELS[type]}
    </span>
  )
}
