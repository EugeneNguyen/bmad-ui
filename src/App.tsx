import { BmadDataProvider, useBmadData } from '@/context/BmadDataContext'
import KanbanBoard from '@/components/features/kanban/KanbanBoard'

function KanbanBoardContent() {
  const { stories, epics, sprintStatus, loading, error } = useBmadData()

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading sprint data...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error Loading Data</h1>
          <p className="mt-2 text-gray-600">{error.message}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <KanbanBoard stories={stories} epics={epics} sprintStatus={sprintStatus} />
    </main>
  )
}

export default function App() {
  return (
    <BmadDataProvider>
      <KanbanBoardContent />
    </BmadDataProvider>
  )
}
