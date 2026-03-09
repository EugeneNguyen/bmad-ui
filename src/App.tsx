import { useRef, useState, useMemo, useEffect, useCallback } from 'react'
import { BmadDataProvider, useBmadData } from '@/context/BmadDataContext'
import KanbanBoard from '@/components/features/kanban/KanbanBoard'
import StoryDetailModal from '@/components/features/stories/StoryDetailModal'
import EpicFilter from '@/components/features/filters/EpicFilter'
import RefreshButton from '@/components/ui/atoms/RefreshButton'
import ChangeSummary, { type ChangeCounts } from '@/components/ui/molecules/ChangeSummary'
import type { Story } from '@/types/bmad'

const NO_CHANGES_TOAST_DURATION_MS = 3000

function KanbanBoardContent({
  onStoryClick,
  storyCardRefs,
}: {
  onStoryClick: (story: Story) => void
  storyCardRefs: React.MutableRefObject<Map<string, HTMLButtonElement | null>>
}) {
  const { stories, epics, sprintStatus, loading, error, refresh } = useBmadData()
  const [selectedEpicId, setSelectedEpicId] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showChangeSummary, setShowChangeSummary] = useState(false)
  const [changeCounts, setChangeCounts] = useState<ChangeCounts>({
    added: 0,
    updated: 0,
    removed: 0,
  })
  const [changeIds, setChangeIds] = useState<{
    addedIds: string[]
    updatedIds: string[]
    removedIds: string[]
  }>({
    addedIds: [],
    updatedIds: [],
    removedIds: [],
  })
  const [showNoChangesToast, setShowNoChangesToast] = useState(false)

  const filteredStories = useMemo(() => {
    if (!selectedEpicId) return stories
    return stories.filter((story) => story.epicId === selectedEpicId)
  }, [stories, selectedEpicId])

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    const result = await refresh()
    setIsRefreshing(false)

    if (result?.changes) {
      const hasChanges =
        result.changes.added > 0 || result.changes.updated > 0 || result.changes.removed > 0
      if (hasChanges) {
        setChangeCounts(result.changes)
        setChangeIds(result.changeIds)
        setShowChangeSummary(true)
        setShowNoChangesToast(false)
      } else {
        setShowNoChangesToast(true)
        setShowChangeSummary(false)
        setTimeout(() => setShowNoChangesToast(false), NO_CHANGES_TOAST_DURATION_MS)
      }
    }
  }, [refresh])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMacOrWindowsRefreshShortcut = (e.metaKey || e.ctrlKey) && e.key === 'r'
      const isF5Refresh = e.key === 'F5'

      if (isMacOrWindowsRefreshShortcut || isF5Refresh) {
        e.preventDefault()
        if (!isRefreshing) {
          handleRefresh()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleRefresh, isRefreshing])

  const handleViewStoryFromChangeSummary = useCallback(
    (storyId: string) => {
      const story = stories.find((s) => s.id === storyId)
      if (story) {
        onStoryClick(story)
        setShowChangeSummary(false)
      }
    },
    [stories, onStoryClick]
  )

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
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-slate-900">Sprint Board</h1>
          <div className="flex items-center gap-3">
            <EpicFilter
              epics={epics}
              selectedEpicId={selectedEpicId}
              onEpicChange={setSelectedEpicId}
            />
            <RefreshButton isLoading={isRefreshing} onClick={handleRefresh} />
          </div>
        </div>
      </header>

      <main>
        <KanbanBoard
          stories={filteredStories}
          epics={epics}
          sprintStatus={sprintStatus}
          onStoryClick={onStoryClick}
          storyCardRefs={storyCardRefs}
        />
      </main>

      {showChangeSummary && (
        <ChangeSummary
          changes={changeCounts}
          addedIds={changeIds.addedIds}
          updatedIds={changeIds.updatedIds}
          removedIds={changeIds.removedIds}
          onDismiss={() => setShowChangeSummary(false)}
          onViewStory={handleViewStoryFromChangeSummary}
        />
      )}

      {showNoChangesToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 bg-white border border-slate-200 rounded-lg shadow-lg p-4"
        >
          <p className="text-sm text-slate-700">No changes detected</p>
        </div>
      )}
    </div>
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
