import { useEffect, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import type { Story, StoryStatus } from '@/types/bmad'
import { STATUS_LABELS } from '@/types/bmad'
import { useFocusTrap } from '@/hooks/accessibility/useFocusTrap'
import { useFocusReturn } from '@/hooks/accessibility/useFocusReturn'
import { useKeyboardShortcut } from '@/hooks/accessibility/useKeyboardShortcut'
import Spinner from '@/components/ui/atoms/Spinner'
import Badge from '@/components/ui/atoms/Badge'
import Icon from '@/components/ui/atoms/Icon'
import { NavigationButton } from '@/components/ui/atoms/NavigationButton'
import { AcceptanceCriteria } from '@/components/ui/molecules/AcceptanceCriteria'
import { api } from '@/lib/api'
import type { BmadError } from '@/lib/errors'

export interface StoryDetailModalProps {
  storyId: string | null
  isOpen: boolean
  onClose: () => void
  triggerRef?: React.RefObject<HTMLButtonElement | HTMLElement | null>
  laneStories: Story[]
  currentStoryIndex: number
}

const statusBadgeVariantMap: Record<StoryStatus, 'slate' | 'amber' | 'violet' | 'green'> = {
  ready: 'slate',
  'in-dev': 'amber',
  'ready-for-review': 'violet',
  done: 'green',
}

function parseStoryId(id: string): string {
  const match = id.match(/^(\d+)-(\d+)/)
  if (!match) return id
  return `${match[1]}.${match[2]}`
}

function parseEpicId(epicId: string): string {
  const match = epicId.match(/^epic-(\d+)/)
  if (!match) return epicId
  return match[1]
}

export default function StoryDetailModal({
  storyId,
  isOpen,
  onClose,
  triggerRef,
  laneStories,
  currentStoryIndex,
}: StoryDetailModalProps) {
  const [story, setStory] = useState<Story | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<BmadError | null>(null)
  const [currentIndex, setCurrentIndex] = useState(currentStoryIndex)
  const modalRef = useRef<HTMLDivElement>(null)

  const titleId = storyId ? `story-title-${storyId}` : 'story-title'
  const descId = storyId ? `story-desc-${storyId}` : 'story-desc'

  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < laneStories.length - 1

  const previousStory = hasPrevious ? laneStories[currentIndex - 1] : null
  const nextStory = hasNext ? laneStories[currentIndex + 1] : null

  const handlePrevious = useCallback(() => {
    if (!hasPrevious) return
    setCurrentIndex(currentIndex - 1)
  }, [hasPrevious, currentIndex])

  const handleNext = useCallback(() => {
    if (!hasNext) return
    setCurrentIndex(currentIndex + 1)
  }, [hasNext, currentIndex])

  useFocusTrap(modalRef, isOpen)
  useFocusReturn(triggerRef, !isOpen)
  useKeyboardShortcut('Escape', onClose, { enabled: isOpen })
  useKeyboardShortcut('ArrowLeft', handlePrevious, { enabled: isOpen && hasPrevious })
  useKeyboardShortcut('ArrowRight', handleNext, { enabled: isOpen && hasNext })

  const fetchStory = useCallback(
    async (id: string, signal: AbortSignal) => {
      const cachedStory = laneStories.find((s) => s.id === id)

      if (
        cachedStory &&
        cachedStory.acceptanceCriteria &&
        cachedStory.acceptanceCriteria.length > 0
      ) {
        setStory(cachedStory)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const res = await api.get<Story>(`/stories/${id}`, { signal })
        if (!signal.aborted) {
          setStory(res.data)
        }
      } catch (err) {
        if (!signal.aborted) {
          setError(err as BmadError)
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false)
        }
      }
    },
    [laneStories]
  )

  useEffect(() => {
    if (!isOpen || currentIndex < 0 || currentIndex >= laneStories.length) {
      setStory(null)
      setError(null)
      return
    }

    const currentStory = laneStories[currentIndex]
    if (!currentStory) {
      setStory(null)
      setError(null)
      return
    }

    const controller = new AbortController()
    fetchStory(currentStory.id, controller.signal)

    return () => {
      controller.abort()
    }
  }, [isOpen, currentIndex, laneStories, fetchStory])

  const handleRetry = useCallback(() => {
    if (currentIndex < 0 || currentIndex >= laneStories.length) return
    const currentStory = laneStories[currentIndex]
    if (!currentStory) return

    const controller = new AbortController()
    fetchStory(currentStory.id, controller.signal)
  }, [currentIndex, laneStories, fetchStory])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose()
      }
    },
    [onClose]
  )

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
      role="presentation"
      data-testid="modal-backdrop"
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        data-testid="story-detail-modal"
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {story && (
              <Badge variant={statusBadgeVariantMap[story.status]}>
                {STATUS_LABELS[story.status]}
              </Badge>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-label="Close story details"
            data-testid="close-button"
          >
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        <div id={descId} className="px-6 py-4">
          {loading && (
            <div className="flex items-center justify-center py-12" data-testid="loading-spinner">
              <Spinner size="lg" />
            </div>
          )}

          {error && (
            <div className="text-center py-12" data-testid="error-message">
              <p className="text-red-600 mb-4">Failed to load story</p>
              <button
                onClick={handleRetry}
                className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
              >
                Try again
              </button>
            </div>
          )}

          {story && (
            <div key={story.id} className="animate-fade-in">
              <h2 id={titleId} className="text-2xl font-bold mb-2">
                {story.title}
              </h2>
              <p className="text-slate-500 text-sm mb-4">
                Story {parseStoryId(story.id)} · Epic {parseEpicId(story.epicId)}
              </p>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-slate-700 whitespace-pre-wrap">{story.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Acceptance Criteria</h3>
                <AcceptanceCriteria criteria={story.acceptanceCriteria ?? []} />
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex items-center justify-between">
          <NavigationButton
            direction="previous"
            storyId={previousStory ? parseStoryId(previousStory.id) : undefined}
            disabled={!hasPrevious}
            onClick={handlePrevious}
          />
          <NavigationButton
            direction="next"
            storyId={nextStory ? parseStoryId(nextStory.id) : undefined}
            disabled={!hasNext}
            onClick={handleNext}
          />
        </div>
      </div>
    </div>,
    document.body
  )
}
