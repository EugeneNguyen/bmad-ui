import { memo } from 'react'
import type { Story, StoryStatus } from '@/types/bmad'
import { STATUS_LABELS } from '@/types/bmad'
import Badge, { type BadgeVariant } from '@/components/ui/atoms/Badge'

export interface StoryCardProps {
  story: Story
  onClick?: (story: Story) => void
}

const statusVariantMap: Record<StoryStatus, BadgeVariant> = {
  ready: 'slate',
  'in-dev': 'amber',
  'ready-for-review': 'violet',
  done: 'green',
}

function parseStoryId(id: string): { epicNum: number; storyNum: number } | null {
  const match = id.match(/^(\d+)-(\d+)-/)
  if (match) {
    return { epicNum: parseInt(match[1], 10), storyNum: parseInt(match[2], 10) }
  }
  return null
}

const StoryCard = memo(function StoryCard({ story, onClick }: StoryCardProps) {
  const parsedId = parseStoryId(story.id)
  const storyIdDisplay = parsedId ? `Story ${parsedId.epicNum}.${parsedId.storyNum}` : null
  const epicDisplay = parsedId ? `Epic ${parsedId.epicNum}` : null
  const statusLabel = STATUS_LABELS[story.status]
  const badgeVariant = statusVariantMap[story.status]

  const handleClick = () => {
    onClick?.(story)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.(story)
    }
  }

  return (
    <div
      role="listitem"
      aria-label={`${story.title} - ${statusLabel}`}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="
        bg-white rounded-lg p-4 shadow-md min-h-[120px]
        hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer
        focus:ring-2 focus:ring-blue-500 focus:outline-none
      "
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          {storyIdDisplay && <span>{storyIdDisplay}</span>}
          {epicDisplay && <span>• {epicDisplay}</span>}
        </div>
        <Badge variant={badgeVariant} className="self-start shrink-0">
          {statusLabel}
        </Badge>
      </div>

      <h3
        className="line-clamp-1 max-w-[280px] text-sm font-semibold text-gray-900"
        title={story.title}
      >
        {story.title}
      </h3>
    </div>
  )
})

StoryCard.displayName = 'StoryCard'

export default StoryCard
