import type { Story, StoryStatus } from '@/types/bmad'
import StoryCard from '@/components/ui/molecules/StoryCard'

export interface LaneProps {
  status: StoryStatus
  title: string
  stories: Story[]
  onStoryClick?: (story: Story) => void
  storyCardRefs?: React.MutableRefObject<Map<string, HTMLButtonElement | null>>
}

function Lane({ status, title, stories, onStoryClick, storyCardRefs }: LaneProps) {
  const titleId = `lane-title-${status}`
  const descId = `lane-desc-${status}`

  return (
    <div
      role="list"
      aria-labelledby={titleId}
      aria-describedby={descId}
      tabIndex={0}
      className="flex flex-col gap-3 min-h-[280px] max-h-[calc(100vh-4rem)] overflow-y-auto bg-slate-50 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
      <div className="flex items-center justify-between">
        <h2 id={titleId} className="font-semibold text-slate-900">
          {title}
        </h2>
        <span className="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
          {stories.length}
        </span>
      </div>

      <p id={descId} className="sr-only">
        {stories.length} {stories.length === 1 ? 'story' : 'stories'} in this lane
      </p>

      {stories.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-center py-4">
          No stories in this lane
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              ref={(node) => {
                if (storyCardRefs?.current) {
                  if (node) {
                    storyCardRefs.current.set(story.id, node)
                  } else {
                    storyCardRefs.current.delete(story.id)
                  }
                }
              }}
              story={story}
              onClick={onStoryClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}

Lane.displayName = 'Lane'

export default Lane
