import { useRef, useState, useMemo } from 'react'
import { BmadDataProvider, useBmadData } from '@/context/BmadDataContext'
import KanbanBoard from '@/components/features/kanban/KanbanBoard'
import StoryDetailModal from '@/components/features/stories/StoryDetailModal'
import type { Story } from '@/types/bmad'

function KanbanBoardContent({
  onStoryClick,
  storyCardRefs,
}: {
  onStoryClick: (story: Story) => void
  storyCardRefs: React.MutableRefObject<Map<string, HTMLButtonElement | null>>
}) {
  const { stories, epics, sprintStatus, loading, error } = useBmadData()

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"
            role="status"
            aria-label="Loading sprint data"
          ></div>
          <p className="mt-4 text-gray-600">Loading sprint data...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Unable to Load Sprint Data</h1>
          <p className="mt-2 text-gray-600">Failed to load sprint data. Please try again.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <KanbanBoard
        stories={stories}
        epics={epics}
        sprintStatus={sprintStatus}
        onStoryClick={onStoryClick}
        storyCardRefs={storyCardRefs}
      />
    </main>
  )
}

function ModalManager({
  selectedStoryId,
  selectedStoryStatus,
  isOpen,
  onClose,
  triggerRef,
}: {
  selectedStoryId: string | null
  selectedStoryStatus: string | null
  isOpen: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}) {
  const { stories } = useBmadData()

  const laneStories = useMemo(() => {
    if (!selectedStoryStatus) return []
    return stories
      .filter((s) => s.status === selectedStoryStatus)
      .sort((a, b) => {
        const aMatch = a.id.match(/^(\d+)-(\d+)/)
        const bMatch = b.id.match(/^(\d+)-(\d+)/)
        if (!aMatch || !bMatch) return 0
        const aNum = parseFloat(`${aMatch[1]}.${aMatch[2]}`)
        const bNum = parseFloat(`${bMatch[1]}.${bMatch[2]}`)
        return aNum - bNum
      })
  }, [stories, selectedStoryStatus])

  const currentStoryIndex = useMemo(() => {
    if (!selectedStoryId) return 0
    return laneStories.findIndex((s) => s.id === selectedStoryId)
  }, [selectedStoryId, laneStories])

  return (
    <StoryDetailModal
      storyId={selectedStoryId}
      isOpen={isOpen}
      onClose={onClose}
      triggerRef={triggerRef}
      laneStories={laneStories}
      currentStoryIndex={currentStoryIndex}
    />
  )
}

export default function App() {
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null)
  const [selectedStoryStatus, setSelectedStoryStatus] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const storyCardRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map())
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const handleStoryClick = (story: Story) => {
    const cardRef = storyCardRefs.current.get(story.id)
    if (cardRef) {
      triggerRef.current = cardRef
    }
    setSelectedStoryId(story.id)
    setSelectedStoryStatus(story.status)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <BmadDataProvider>
      <KanbanBoardContent onStoryClick={handleStoryClick} storyCardRefs={storyCardRefs} />
      <ModalManager
        selectedStoryId={selectedStoryId}
        selectedStoryStatus={selectedStoryStatus}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        triggerRef={triggerRef}
      />
    </BmadDataProvider>
  )
}
