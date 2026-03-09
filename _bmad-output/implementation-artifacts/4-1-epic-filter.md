# Story 4.1: Epic Filter

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **product owner,**
I want to filter the Kanban board by epic,
so that I can focus on stories for a specific epic without distraction from other work.

## Acceptance Criteria

### AC1: Epic Filter Dropdown Display

**Given** a product owner views the Kanban board
**When** they look at the header or toolbar
**Then** an "Epic Filter" dropdown is visible
**And** the dropdown shows "All Epics" as the default selection
**And** the dropdown lists all available epics by name

### AC2: Dropdown Content

**Given** a product owner clicks the Epic Filter dropdown
**When** the dropdown opens
**Then** it displays:

- "All Epics" option (default)
- List of all epic names (e.g., "Epic 1: Project Foundation", "Epic 2: Sprint Visualization")
  **And** epics are listed in order
  **And** the dropdown is searchable if > 5 epics

### AC3: Filter Application

**Given** a product owner selects an epic from the dropdown
**When** the selection changes
**Then** the Kanban board updates to show only stories from the selected epic
**And** stories from other epics are hidden
**And** story counts in each lane update to reflect filtered stories
**And** the filter selection is displayed in the dropdown
**And** the URL updates with filter parameter (e.g., `?epic=epic-1`)

### AC4: Clear Filter

**Given** a product owner selects "All Epics" from the dropdown
**When** the selection changes
**Then** all stories are displayed across all epics
**And** the board returns to unfiltered state
**And** the URL filter parameter is removed

### AC5: URL Persistence

**Given** a product owner applies an epic filter
**When** they refresh the page or share the URL
**Then** the epic filter is preserved from URL parameter
**And** the board loads with the correct filter applied

### AC6: Component Implementation

**Given** a developer implements the EpicFilter component
**When** the component renders
**Then** it uses a native `<select>` or accessible custom dropdown
**And** exports as default from `src/components/features/filters/EpicFilter.tsx`
**And** accepts `epics`, `selectedEpicId`, and `onEpicChange` as props
**And** integrates with BmadDataContext for filtering

### AC7: Empty Epic Handling

**Given** a product owner filters by an epic with no stories
**When** the board renders
**Then** all lanes show "No stories in this lane"
**And** the board does not look broken
**And** the filter remains selected

### AC8: Screen Reader Accessibility

**Given** a product owner uses a screen reader
**When** they interact with the Epic Filter dropdown
**Then** the dropdown has an accessible label "Filter by Epic"
**And** screen reader announces the current selection
**And** screen reader announces the number of epics available

## Tasks / Subtasks

- [ ] **Task 1: Create EpicFilter Component** (AC: 1, 6)
  - [ ] Create `src/components/features/filters/EpicFilter.tsx`
  - [ ] Define EpicFilterProps interface with epics, selectedEpicId, onEpicChange
  - [ ] Use native `<select>` element for accessibility
  - [ ] Add "All Epics" as default option
  - [ ] Map epics to options with formatted labels ("Epic 1: Project Foundation")
  - [ ] Sort options by epic number
  - [ ] Export as default
  - [ ] Add JSDoc documentation

- [ ] **Task 2: Integrate with BmadDataContext** (AC: 3, 4, 6)
  - [ ] Add `selectedEpicId` state to BmadDataContext (or use local state in KanbanBoard)
  - [ ] Create `setSelectedEpicId` action in context
  - [ ] Filter stories by epicId when selectedEpicId is set
  - [ ] Pass filtered stories to KanbanBoard and Lane components
  - [ ] Update story counts to reflect filtered stories

- [ ] **Task 3: Add URL Parameter Support** (AC: 3, 4, 5)
  - [ ] Install/use URLSearchParams for query string handling
  - [ ] On epic selection, update URL with `?epic=epic-1` parameter
  - [ ] On "All Epics" selection, remove epic parameter from URL
  - [ ] On component mount, read epic parameter from URL
  - [ ] Apply filter from URL parameter if present
  - [ ] Use browser history replaceState (no new history entries)

- [ ] **Task 4: Update Lane Story Counts** (AC: 3)
  - [ ] Modify Lane component to accept filtered stories count
  - [ ] Update count badge when filter changes
  - [ ] Ensure count accurately reflects visible stories

- [ ] **Task 5: Add Search Functionality (Conditional)** (AC: 2)
  - [ ] Check if epics count > 5
  - [ ] If yes, add searchable dropdown using native datalist or custom implementation
  - [ ] If no, keep simple select dropdown
  - [ ] Test with 6+ epics to verify search works

- [ ] **Task 6: Handle Empty Epic State** (AC: 7)
  - [ ] When filtered epic has no stories, all lanes show "No stories in this lane"
  - [ ] Board layout remains intact (no broken appearance)
  - [ ] Filter dropdown shows selected epic

- [ ] **Task 7: Add Accessibility Features** (AC: 8)
  - [ ] Add aria-label="Filter by Epic" to select element
  - [ ] Add aria-live region for selection announcements
  - [ ] Ensure keyboard navigation works (Tab, Arrow keys, Enter)
  - [ ] Test with screen reader (VoiceOver/NVDA)

- [ ] **Task 8: Create EpicFilter Test** (AC: All)
  - [ ] Create `src/components/features/filters/EpicFilter.test.tsx`
  - [ ] Test dropdown renders with "All Epics" default
  - [ ] Test all epic options are displayed
  - [ ] Test selection change calls onEpicChange callback
  - [ ] Test "All Epics" selection clears filter
  - [ ] Test accessible label is present
  - [ ] Test keyboard navigation

- [ ] **Task 9: Integrate with KanbanBoard** (AC: 3, 4)
  - [ ] Import EpicFilter in KanbanBoard
  - [ ] Position EpicFilter in header area
  - [ ] Pass epics from context
  - [ ] Handle onEpicChange to update filter state
  - [ ] Apply filtering to stories prop passed to lanes

- [ ] **Task 10: Run Quality Checks** (AC: All)
  - [ ] Run `npm run typecheck`
  - [ ] Verify no TypeScript errors
  - [ ] Run `npm run lint`
  - [ ] Fix any lint errors
  - [ ] Run `npm test`
  - [ ] Verify all tests pass
  - [ ] Run `npm run build`
  - [ ] Verify build succeeds

- [ ] **Task 11: Manual Browser Testing** (AC: All)
  - [ ] Start dev server: `npm run dev`
  - [ ] Verify Epic Filter dropdown is visible
  - [ ] Select an epic, verify only that epic's stories show
  - [ ] Verify story counts update correctly
  - [ ] Verify URL updates with epic parameter
  - [ ] Refresh page, verify filter persists
  - [ ] Select "All Epics", verify all stories show
  - [ ] Test with keyboard only (Tab, Arrow keys, Enter)
  - [ ] Test with screen reader

## Dev Notes

### 🔥 CRITICAL: Architecture Compliance Requirements

**From Architecture Document - MUST follow exactly:**

1. **TypeScript Strict Mode** - All code must compile with strict mode enabled
   - All variables must be typed (inferred or explicit)
   - No `any` without explicit cast and justification
   - Array access returns `T | undefined` (noUncheckedIndexedAccess)

2. **Default Exports for Components** - Feature components use default exports
   - ✅ `export default function EpicFilter() {}`
   - ❌ `export function EpicFilter() {}`

3. **Path Aliases** - Use `@/*` aliases for all imports
   - ✅ `import { useEpics } from '@/hooks/useEpics'`
   - ❌ `import { useEpics } from '../../hooks/useEpics'`

4. **Component Location** - Filter components go in `src/components/features/filters/`
   - EpicFilter: `src/components/features/filters/EpicFilter.tsx`
   - Tests: `src/components/features/filters/EpicFilter.test.tsx`

5. **Co-located Tests** - Test files in same directory as source

### Component Implementation Pattern

**EpicFilter component:**

```typescript
// src/components/features/filters/EpicFilter.tsx
import { useMemo } from 'react'
import type { Epic } from '@/types/bmad'

interface EpicFilterProps {
  epics: Epic[]
  selectedEpicId: string | null
  onEpicChange: (epicId: string | null) => void
}

/**
 * Dropdown filter for filtering Kanban board by epic.
 * Integrates with BmadDataContext for story filtering.
 */
export default function EpicFilter({
  epics,
  selectedEpicId,
  onEpicChange,
}: EpicFilterProps) {
  // Sort epics by number
  const sortedEpics = useMemo(() => {
    return [...epics].sort((a, b) => {
      const aNum = parseInt(a.id.match(/^epic-(\d+)/)?.[1] ?? '0')
      const bNum = parseInt(b.id.match(/^epic-(\d+)/)?.[1] ?? '0')
      return aNum - bNum
    })
  }, [epics])

  // Format epic label (e.g., "Epic 1: Project Foundation")
  const formatEpicLabel = (epic: Epic): string => {
    const num = epic.id.match(/^epic-(\d+)/)?.[1] ?? '?'
    return `Epic ${num}: ${epic.title}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    onEpicChange(value === 'all' ? null : value)
  }

  return (
    <div className="relative">
      <label htmlFor="epic-filter" className="sr-only">
        Filter by Epic
      </label>
      <select
        id="epic-filter"
        value={selectedEpicId ?? 'all'}
        onChange={handleChange}
        className="block w-full px-4 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        aria-label="Filter by Epic"
      >
        <option value="all">All Epics</option>
        {sortedEpics.map((epic) => (
          <option key={epic.id} value={epic.id}>
            {formatEpicLabel(epic)}
          </option>
        ))}
      </select>
    </div>
  )
}
```

### URL Parameter Handling

**Add URL sync to KanbanBoard or App component:**

```typescript
// In KanbanBoard.tsx or App.tsx
import { useEffect, useState } from 'react'
import { useEpics } from '@/hooks/useEpics'
import { useStories } from '@/hooks/useStories'
import EpicFilter from '@/components/features/filters/EpicFilter'

export default function KanbanBoard() {
  const { epics } = useEpics()
  const { stories } = useStories()

  // Initialize from URL parameter
  const [selectedEpicId, setSelectedEpicId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('epic')
  })

  // Update URL when filter changes
  useEffect(() => {
    const url = new URL(window.location.href)
    if (selectedEpicId) {
      url.searchParams.set('epic', selectedEpicId)
    } else {
      url.searchParams.delete('epic')
    }
    window.history.replaceState({}, '', url.toString())
  }, [selectedEpicId])

  // Filter stories by epic
  const filteredStories = useMemo(() => {
    if (!selectedEpicId) return stories
    return stories.filter((story) => story.epicId === selectedEpicId)
  }, [stories, selectedEpicId])

  return (
    <div>
      <header className="flex items-center gap-4 p-4 border-b">
        <EpicFilter
          epics={epics}
          selectedEpicId={selectedEpicId}
          onEpicChange={setSelectedEpicId}
        />
      </header>
      {/* Pass filteredStories to lanes */}
    </div>
  )
}
```

### Filtering Logic Integration

**Option 1: Filter in KanbanBoard (Recommended)**

```typescript
// KanbanBoard maintains filter state and passes filtered stories to lanes
const filteredStories = useMemo(() => {
  if (!selectedEpicId) return stories
  return stories.filter(story => story.epicId === selectedEpicId)
}, [stories, selectedEpicId])

// Pass to Lane components
<Lane status="ready" stories={filteredStories.filter(s => s.status === 'ready')} />
```

**Option 2: Filter in BmadDataContext**

```typescript
// Add to BmadDataContext
const [selectedEpicId, setSelectedEpicId] = useState<string | null>(null)

const filteredStories = useMemo(() => {
  if (!selectedEpicId) return stories
  return stories.filter(story => story.epicId === selectedEpicId)
}, [stories, selectedEpicId])

// Context value
<BmadDataContext.Provider value={{
  stories,
  epics,
  filteredStories,
  selectedEpicId,
  setSelectedEpicId,
  ...
}}>
```

**Recommendation:** Use Option 1 for simpler state management at the component level.

### Previous Story Intelligence

**From Story 3.3 (Story Navigation):**

📋 **Key Learnings:**

1. **Named exports for atoms:** UI atoms use named exports
2. **useMemo for derived data:** Memoize filtered/sorted arrays for performance
3. **URL state sync:** Use replaceState to avoid cluttering history
4. **Parent-managed state:** Keep filter state close to where it's used

**From Story 2.3 (Story Distribution by Lane):**

📋 **Key Learnings:**

1. **Filtering by status:** Filter stories by lane status using useMemo
2. **Sorting stories:** Sort by story number for consistent order
3. **Story counts:** Update counts when filtered data changes

**From Story 1.3 (Data Types and State Management):**

📋 **Key Learnings:**

1. **BmadDataContext structure:** Context provides stories, epics, sprintStatus
2. **Custom hooks pattern:** useStories, useEpics for data access
3. **TypeScript interfaces:** Story has epicId for epic association

### Common Pitfalls to Avoid

1. **Filtering in Wrong Place** - Filter at the board level, not individual lanes
   - ✅ KanbanBoard filters and passes filtered stories to lanes
   - ❌ Each lane filters independently (duplicated logic)

2. **Not Updating Story Counts** - Counts must reflect filtered stories
   - ✅ Lane count badge shows filtered count
   - ❌ Count shows total stories, not filtered

3. **Breaking URL on Navigate** - Don't create new history entries
   - ✅ Use replaceState for filter changes
   - ❌ Use pushState (breaks back button)

4. **Missing URL Initialization** - Read URL param on mount
   - ✅ useState initializer reads URLSearchParams
   - ❌ Always starts with "All Epics" ignoring URL

5. **Wrong Export Style** - Feature components use default exports
   - ✅ `export default function EpicFilter() {}`
   - ❌ `export function EpicFilter() {}`

6. **Not Handling Null Epic** - Some stories may have no epicId
   - ✅ Handle stories where epicId is undefined/null
   - ❌ Assume all stories have epicId

7. **Breaking Accessibility** - Native select is more accessible than custom
   - ✅ Use native <select> with proper labels
   - ❌ Custom dropdown without ARIA support

### Project Structure Notes

**Files to Create:**

```
src/components/features/filters/
├── EpicFilter.tsx         # NEW: Epic filter dropdown
└── EpicFilter.test.tsx    # NEW: Epic filter tests
```

**Files to Update:**

```
src/components/features/board/
└── KanbanBoard.tsx        # UPDATE: Add EpicFilter, filter logic, URL sync

src/components/ui/molecules/
└── Lane.tsx               # UPDATE: Accept filtered story count (if needed)
```

**Alignment with Architecture:**

- ✅ Follows component pattern (src/components/features/filters/)
- ✅ Uses path aliases (`@/*`)
- ✅ Default export for feature component
- ✅ Co-located tests
- ✅ TypeScript strict mode
- ✅ Accessibility built-in (native select, ARIA labels)

### Performance Considerations

**Memoize expensive operations:**

```typescript
// Sort epics once when epics array changes
const sortedEpics = useMemo(() => {
  return [...epics].sort((a, b) => {
    const aNum = parseInt(a.id.match(/^epic-(\d+)/)?.[1] ?? '0')
    const bNum = parseInt(b.id.match(/^epic-(\d+)/)?.[1] ?? '0')
    return aNum - bNum
  })
}, [epics])

// Filter stories once when filter or stories change
const filteredStories = useMemo(() => {
  if (!selectedEpicId) return stories
  return stories.filter((story) => story.epicId === selectedEpicId)
}, [stories, selectedEpicId])
```

### Search Implementation (If > 5 Epics)

**Using native datalist for search:**

```typescript
// Only use if epics.length > 5
{epics.length > 5 ? (
  <>
    <input
      list="epic-options"
      value={searchTerm}
      onChange={handleSearch}
      placeholder="Search epics..."
      className="..."
    />
    <datalist id="epic-options">
      {sortedEpics.map((epic) => (
        <option key={epic.id} value={formatEpicLabel(epic)} />
      ))}
    </datalist>
  </>
) : (
  <select>...</select>
)}
```

### Testing Requirements

**Unit Tests (EpicFilter):**

- EpicFilter renders with "All Epics" selected by default
- EpicFilter displays all epic options in order
- EpicFilter calls onEpicChange when selection changes
- EpicFilter passes null for "All Epics" selection
- EpicFilter has accessible label "Filter by Epic"
- EpicFilter formats epic labels correctly ("Epic 1: Title")

**Integration Tests:**

- Selecting epic filters stories in KanbanBoard
- Story counts update when filter changes
- URL parameter updates on filter change
- URL parameter persists on page refresh
- "All Epics" clears filter and URL parameter

**Test Location:** Co-located with source files (`.test.tsx` extension)

**Test Command:** `npm test`

### Styling Specifications

**From Architecture - Tailwind Classes:**

- Select element: `px-4 py-2 text-sm border border-slate-300 rounded-lg bg-white`
- Focus state: `focus:ring-2 focus:ring-blue-500 focus:border-blue-500`
- Container: `relative` for positioning
- Label: `sr-only` for screen reader only

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.1 - Lines 625-686]
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Structure - Lines 447-474]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture - Lines 443-507]
- [Source: _bmad-output/planning-artifacts/architecture.md#API Endpoints - Lines 389-399]
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns - Lines 688-710]
- [Source: _bmad-output/planning-artifacts/architecture.md#Export Patterns - Lines 713-722]
- [Source: _bmad-output/planning-artifacts/architecture.md#TypeScript Strictness - Lines 832-855]
- [Source: _bmad-output/planning-artifacts/architecture.md#Requirements to Structure Mapping - Lines 927-938]
- [Source: _bmad-output/implementation-artifacts/3-3-story-navigation.md#Dev Notes]
- [Source: _bmad-output/implementation-artifacts/2-3-story-distribution-by-lane.md#Dev Notes]
- [Source: _bmad-output/implementation-artifacts/1-3-data-types-and-state-management.md#Dev Notes]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

_Add debugging notes here during implementation_

### Completion Notes List

_Add completion notes here after implementation_

### File List

_List all files created/modified during implementation_
