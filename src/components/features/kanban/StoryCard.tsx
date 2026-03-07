import type { Story } from '@/types/bmad'

export interface StoryCardProps {
  story: Story
  onClick?: (story: Story) => void
}

export default function StoryCard({ story, onClick }: StoryCardProps) {
  return (
    <div
      role="listitem"
      aria-label={`${story.title}`}
      className="p-4 bg-white rounded border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors"
      onClick={() => onClick?.(story)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.(story)
        }
      }}
      tabIndex={0}
    >
      <h3 className="font-medium text-slate-900 mb-2">{story.title}</h3>
      <p className="text-sm text-slate-600 line-clamp-2">{story.description}</p>
    </div>
  )
}
