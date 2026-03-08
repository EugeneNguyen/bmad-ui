# Story 2.3: Story Distribution by Lane

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **product owner,**
I want stories automatically organized into the correct lanes based on their status,
so that I can see the current state of work without manual sorting.

## Acceptance Criteria

### AC1: Story Distribution by Status

**Given** a product owner views the Kanban board
**When** stories are loaded from the API
**Then** each story is placed in the lane matching its status
**And** the "Ready to Start" lane contains all stories with status="ready"
**And** the "Being Built" lane contains all stories with status="in-dev"
**And** the "Needs Your Attention" lane contains all stories with status="ready-for-review"
**And** the "Complete" lane contains all stories with status="done"
**And** no story appears in multiple lanes

### AC2: Empty State Handling

**Given** a product owner views a lane
**When** the lane has no stories
**Then** an empty state message displays "No stories in this lane"
**And** the lane height is maintained
**And** the empty state is styled consistently with other lanes

### AC3: Story Sorting

**Given** a product owner views a lane with stories
**When** stories are displayed
**Then** stories are sorted by story number within the lane
**And** stories from different epics are intermixed based on status
**And** story count badge shows accurate count

### AC4: Lane Filtering Logic

**Given** a developer implements lane filtering logic
**When** the KanbanBoard component renders
**Then** stories are filtered by status using `STATUS_LABELS` mapping
**And** filtering is performed in the BmadDataContext or custom hook
**And** filtered stories are passed to each Lane component
**And** filtering is efficient (O(n) complexity)

### AC5: Refresh Behavior

**Given** a product owner refreshes the board
**When** new story data is loaded
**Then** stories are re-distributed to correct lanes
**And** previous story positions are cleared
**And** the board reflects current state from `_bmad-output`

### AC6: Invalid Status Handling

**Given** a story has an invalid status
**When** the board renders
**Then** the story is placed in a fallback lane (e.g., "Ready to Start")
**And** an error is logged to console
**And** the board does not crash

## Tasks / Subtasks

- [x] **Task 1: Create useStoriesByStatus Hook** (AC: 1, 3, 4)
  - [x] Create `src/hooks/useStoriesByStatus.ts`
  - [x] Define return type: `Record<StoryStatus, Story[]>`
  - [x] Import Story and StoryStatus types from `@/types/bmad`
  - [x] Accept stories array as parameter
  - [x] Group stories by status using useMemo
  - [x] Sort stories by story number within each group
  - [x] Handle edge cases (empty stories, missing status)
  - [x] Export as named export
  - [x] Add JSDoc documentation
  - [x] Create `src/hooks/useStoriesByStatus.test.ts`

- [x] **Task 2: Implement Story Sorting** (AC: 3)
  - [x] Create sort function to parse story IDs (e.g., "1-2-user-auth" → epic=1, story=2)
  - [x] Sort by epic number first, then story number
  - [x] Handle malformed story IDs gracefully
  - [x] Add unit tests for sorting logic

- [x] **Task 3: Integrate Hook into KanbanBoard** (AC: 1, 4, 5)
  - [x] Import useStoriesByStatus hook into KanbanBoard.tsx
  - [x] Replace any existing story filtering with hook output
  - [x] Pass filtered stories to each Lane component
  - [x] Ensure re-filtering happens when stories change

- [x] **Task 4: Update Lane Component** (AC: 2)
  - [x] Verify empty state displays "No stories in this lane"
  - [x] Ensure lane height is maintained when empty (min-h-[200px])
  - [x] Update story count badge to use filtered count

- [x] **Task 5: Implement Fallback for Invalid Status** (AC: 6)
  - [x] Add validation for story status values
  - [x] Map invalid statuses to 'ready' fallback
  - [x] Log warning to console with story ID and invalid status
  - [x] Add unit test for invalid status handling

- [x] **Task 6: Update BmadDataContext** (AC: 4, 5)
  - [x] Verify context provides stories array from API
  - [x] Ensure refetch function clears and reloads stories
  - [x] Stories should come from `/api/stories` endpoint

- [x] **Task 7: Write Hook Tests** (AC: All)
  - [x] Test stories are grouped correctly by status
  - [x] Test empty stories returns empty groups
  - [x] Test sorting by story number
  - [x] Test invalid status falls back to 'ready'
  - [x] Test no story appears in multiple lanes
  - [x] Test memoization (no recalc with same input)

- [x] **Task 8: Manual Browser Testing** (AC: 1, 2, 3, 5)
  - [x] Start dev server: `npm run dev`
  - [x] Verify stories appear in correct lanes based on status
  - [x] Verify empty state displays for lanes with no stories
  - [x] Verify story count matches actual count in lane
  - [x] Verify sorting by story number
  - [x] Test refresh by adding/modifying story files and refreshing

- [x] **Task 9: Run Type Check and Build** (AC: All)
  - [x] Run `npm run typecheck`
  - [x] Verify no TypeScript errors
  - [x] Run `npm run build`
  - [x] Verify build succeeds
  - [x] Run `npm test`
  - [x] Verify all tests pass

## Dev Notes

### 🔥 CRITICAL: Architecture Compliance Requirements

**From Architecture Document - MUST follow exactly:**

1. **TypeScript Strict Mode** - All code must compile with strict mode enabled
   - All variables must be typed (inferred or explicit)
   - No `any` without explicit cast and justification
   - Array access returns `T | undefined` (noUncheckedIndexedAccess)

2. **Named Exports for Hooks** - All hooks use named exports (NOT default)
   - ✅ `export function useStoriesByStatus() {}`
   - ❌ `export default function useStoriesByStatus() {}`

3. **Path Aliases** - Use `@/*` aliases for all imports (no relative paths beyond same directory)
   - ✅ `import { Story } from '@/types/bmad'`
   - ❌ `import { Story } from '../types/bmad'`

4. **Hook Location** - Hooks go in `src/hooks/` directory
   - This hook: `src/hooks/useStoriesByStatus.ts`
   - Tests: `src/hooks/useStoriesByStatus.test.ts`

5. **Co-located Tests** - Test files in same directory as source
   - `src/hooks/useStoriesByStatus.test.ts`

### Hook Implementation Pattern

**Production-proven hook structure:**

```typescript
// src/hooks/useStoriesByStatus.ts
import { useMemo } from 'react'
import type { Story, StoryStatus } from '@/types/bmad'

export type StoriesByStatus = Record<StoryStatus, Story[]>

/**
 * Groups stories by their status and sorts within each group.
 * Invalid statuses fall back to 'ready' lane.
 *
 * @param stories - Array of stories to group
 * @returns Stories grouped by status, sorted by story number
 */
export function useStoriesByStatus(stories: Story[]): StoriesByStatus {
  return useMemo(() => {
    const grouped: StoriesByStatus = {
      ready: [],
      'in-dev': [],
      'ready-for-review': [],
      done: [],
    }

    stories.forEach((story) => {
      // Validate status, fallback to 'ready' for invalid values
      const status = isValidStatus(story.status) ? story.status : 'ready'

      if (!isValidStatus(story.status)) {
        console.warn(
          `[useStoriesByStatus] Invalid status "${story.status}" for story ${story.id}, falling back to "ready"`
        )
      }

      grouped[status].push(story)
    })

    // Sort each group by story number
    Object.keys(grouped).forEach((status) => {
      grouped[status as StoryStatus].sort(sortByStoryNumber)
    })

    return grouped
  }, [stories])
}

/**
 * Validates if a status is a valid StoryStatus
 */
function isValidStatus(status: string): status is StoryStatus {
  return ['ready', 'in-dev', 'ready-for-review', 'done'].includes(status)
}

/**
 * Sorts stories by their story number (parsed from ID like "1-2-user-auth")
 */
function sortByStoryNumber(a: Story, b: Story): number {
  const aNum = parseStoryNumber(a.id)
  const bNum = parseStoryNumber(b.id)

  // Sort by epic number first, then story number
  if (aNum.epic !== bNum.epic) {
    return aNum.epic - bNum.epic
  }
  return aNum.story - bNum.story
}

/**
 * Parses story ID to extract epic and story numbers
 * @example "1-2-user-auth" → { epic: 1, story: 2 }
 */
function parseStoryNumber(id: string): { epic: number; story: number } {
  const match = id.match(/^(\d+)-(\d+)/)
  if (!match) {
    return { epic: 999, story: 999 } // Fallback for malformed IDs
  }
  return {
    epic: parseInt(match[1] ?? '999', 10),
    story: parseInt(match[2] ?? '999', 10),
  }
}
```

### Integration with KanbanBoard

**Update KanbanBoard.tsx to use the hook:**

```typescript
// src/components/features/kanban/KanbanBoard.tsx
import { useStoriesByStatus } from '@/hooks/useStoriesByStatus'
import { useBmadData } from '@/context/BmadDataContext'
import Lane from './Lane'

export default function KanbanBoard() {
  const { stories, epics, loading, error } = useBmadData()
  const storiesByStatus = useStoriesByStatus(stories)

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4"
      role="region"
      aria-label="Kanban board"
    >
      <Lane
        status="ready"
        title="Ready to Start"
        stories={storiesByStatus.ready}
        epics={epics}
      />
      <Lane
        status="in-dev"
        title="Being Built"
        stories={storiesByStatus['in-dev']}
        epics={epics}
      />
      <Lane
        status="ready-for-review"
        title="Needs Your Attention"
        stories={storiesByStatus['ready-for-review']}
        epics={epics}
      />
      <Lane
        status="done"
        title="Complete"
        stories={storiesByStatus.done}
        epics={epics}
      />
    </div>
  )
}
```

### Lane Empty State

**Lane component should handle empty state:**

```typescript
// In Lane.tsx
function Lane({ status, title, stories, epics }) {
  return (
    <div
      className="flex flex-col gap-3 min-h-[200px] bg-slate-50 rounded-lg p-4"
      role="list"
      aria-labelledby={`lane-title-${status}`}
    >
      <div className="flex items-center justify-between">
        <h2 id={`lane-title-${status}`} className="font-semibold">
          {title}
        </h2>
        <span className="text-sm text-slate-500">
          {stories.length}
        </span>
      </div>

      {stories.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          No stories in this lane
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} epic={findEpic(epics, story.epicId)} />
          ))}
        </div>
      )}
    </div>
  )
}
```

### Performance Optimization

**Key performance patterns:**

1. **useMemo for grouping** - Prevents recalculation on every render
2. **Stable hook dependencies** - Only recalculate when stories array changes
3. **Efficient sorting** - Single sort pass per group, O(n log n) per group
4. **No inline object creation** - Return stable object structure

**Memoization verification:**

```typescript
// Test that memoization works
const result1 = useStoriesByStatus(stories)
const result2 = useStoriesByStatus(stories)
// result1 === result2 (same reference if stories hasn't changed)
```

### Type Definitions

**From Story 1.3 - Types to use:**

```typescript
// src/types/bmad.ts
export interface Story {
  id: string // e.g., "1-2-user-auth"
  title: string
  description: string
  status: StoryStatus
  epicId: string // e.g., "epic-1"
  sprintId?: string
  acceptanceCriteria: string[]
}

export type StoryStatus = 'ready' | 'in-dev' | 'ready-for-review' | 'done'

// src/lib/status-labels.ts
export const STATUS_LABELS: Record<StoryStatus, string> = {
  ready: 'Ready to Start',
  'in-dev': 'Being Built',
  'ready-for-review': 'Needs Your Attention',
  done: 'Complete',
}
```

### Previous Story Intelligence

**From Story 2.1 (Kanban Board Layout):**

✅ **Completed Components:**

- `src/components/features/kanban/KanbanBoard.tsx` - Main board component
- `src/components/features/kanban/Lane.tsx` - Individual lane component

📋 **Key Learnings:**

1. **STATUS_LABELS:** Critical for consistent PO-friendly language
2. **Path Aliases:** Always use `@/*` for imports
3. **TypeScript Strictness:** No `any` types, explicit typing for all props
4. **Tailwind Classes:** Use utility classes, avoid custom CSS
5. **Co-located Tests:** Tests in same directory as source files
6. **ARIA Attributes:** Each lane needs role="list", aria-labelledby

⚠️ **Integration Points:**

- Use useBmadData() hook to get stories/epics from context
- Lane component accepts stories array as prop
- Story cards rendered within Lane using StoryCard component

**From Story 2.2 (Story Card Display):**

✅ **Completed Components:**

- `src/components/ui/molecules/StoryCard.tsx` - Story card component
- `src/components/ui/atoms/Badge.tsx` - Status badge component

📋 **Key Learnings:**

1. **React.memo:** Used for StoryCard performance optimization
2. **Story ID Format:** "Story X.Y" display format (e.g., "Story 2.1")
3. **Epic Reference:** "Epic X" display format
4. **Status Badge:** Color-coded by status using Badge atom

### Common Pitfalls to Avoid

1. **Missing useMemo** - Grouping must be memoized
   - ❌ `stories.filter(...)` directly in render
   - ✅ `useMemo(() => stories.filter(...), [stories])`

2. **Wrong Export Style** - Hooks use named exports
   - ✅ `export function useStoriesByStatus() {}`
   - ❌ `export default function useStoriesByStatus() {}`

3. **Unstable Object References** - Return stable structure
   - ❌ Create new object every render
   - ✅ useMemo returns same reference if deps unchanged

4. **Missing Error Handling** - Invalid status should not crash
   - ✅ Fallback to 'ready' with console warning
   - ❌ Throw error or crash board

5. **Missing Story Sorting** - Stories must be sorted within lanes
   - ✅ Sort by story number (epic, then story)
   - ❌ Random or insertion order

6. **Ignoring Empty State** - Lanes must handle empty gracefully
   - ✅ Display "No stories in this lane"
   - ✅ Maintain lane height with min-h-[200px]
   - ❌ Collapse or disappear when empty

7. **Wrong Test Location** - Tests must be co-located
   - ✅ `src/hooks/useStoriesByStatus.test.ts`
   - ❌ `src/tests/useStoriesByStatus.test.ts`

### Project Structure Notes

**Files to Create:**

```
src/hooks/
├── useStoriesByStatus.ts      # NEW: Story grouping hook
└── useStoriesByStatus.test.ts # NEW: Hook tests
```

**Files to Update:**

```
src/components/features/kanban/
└── KanbanBoard.tsx            # UPDATE: Use useStoriesByStatus hook

src/components/features/kanban/
└── Lane.tsx                   # UPDATE: Ensure empty state handling
```

**Alignment with Architecture:**

- ✅ Follows hook pattern (src/hooks/)
- ✅ Uses path aliases (`@/*`)
- ✅ Named exports for hooks
- ✅ Co-located tests
- ✅ TypeScript strict mode
- ✅ Performance optimized with useMemo

### Testing Requirements

**Unit Tests:**

- useStoriesByStatus groups stories correctly by status
- useStoriesByStatus returns empty arrays for missing statuses
- useStoriesByStatus sorts stories by story number
- useStoriesByStatus handles invalid status (fallback to 'ready')
- useStoriesByStatus logs warning for invalid status
- useStoriesByStatus handles empty stories array
- useStoriesByStatus memoizes result (same reference for same input)
- sortByStoryNumber parses story IDs correctly
- sortByStoryNumber handles malformed IDs

**Integration Tests (KanbanBoard):**

- Stories appear in correct lanes based on status
- No story appears in multiple lanes
- Story count matches actual count in lane
- Empty state displays for empty lanes
- Refresh redistributes stories correctly

**Test Location:** Co-located with source files (`.test.ts` extension)

**Test Command:** `npm test`

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.3 - Lines 336-383]
- [Source: _bmad-output/planning-artifacts/architecture.md#Custom Hooks Pattern - Lines 420-442]
- [Source: _bmad-output/planning-artifacts/architecture.md#State Management - Lines 476-483]
- [Source: _bmad-output/planning-artifacts/architecture.md#Performance Requirements - Lines 162-180]
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns - Lines 688-710]
- [Source: _bmad-output/planning-artifacts/architecture.md#Export Patterns - Lines 713-722]
- [Source: _bmad-output/planning-artifacts/architecture.md#TypeScript Strictness - Lines 832-855]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Design Principles]
- [Source: _bmad-output/implementation-artifacts/2-1-kanban-board-layout.md#Dev Notes]
- [Source: _bmad-output/implementation-artifacts/2-2-story-card-display.md#Dev Notes]

## Dev Agent Record

### Agent Model Used

zai-coding-plan/glm-5 (Sisyphus orchestration)

### Debug Log References

N/A - Implementation proceeded smoothly without significant debugging issues.

### Completion Notes List

**Implementation Summary:**

- Created `useStoriesByStatus` custom hook to group and sort stories by status
- Hook implements memoization for optimal performance (O(n) grouping + O(n log n) sorting per group)
- Invalid story statuses gracefully fall back to 'ready' with console warning
- Stories sorted by epic number first, then story number within each lane
- Integrated hook into KanbanBoard component, replacing inline useMemo logic
- Lane component already had proper empty state handling

**Key Technical Decisions:**

1. Used named export for hook (following architecture guidelines)
2. Implemented status validation with type guard (`isValidStatus`)
3. Created helper functions `parseStoryNumber` and `sortByStoryNumber` for clean, testable sorting logic
4. Malformed story IDs default to { epic: 999, story: 999 } to sort at end

**Test Coverage:**

- 8 comprehensive unit tests covering all acceptance criteria
- Tests verify grouping, sorting, empty state, invalid status, duplicate prevention, and memoization
- All new tests pass ✅
- No regressions in existing KanbanBoard or Lane tests ✅

**Browser Testing Verified:**

- Stories correctly distributed to lanes based on status ✅
- Empty lanes display "No stories in this lane" ✅
- Stories sorted correctly within lanes (1.1, 1.2, 1.3, 2.1, etc.) ✅
- Story count badges accurate ✅
- No console warnings for valid data ✅

### File List

**Created:**

- src/hooks/useStoriesByStatus.ts
- src/hooks/useStoriesByStatus.test.ts

**Modified:**

- src/components/features/kanban/KanbanBoard.tsx (replaced inline useMemo with hook)

**Verified (No changes needed):**

- src/components/features/kanban/Lane.tsx (already has empty state)
- src/context/BmadDataContext.tsx (already provides stories from API)

### Change Log

- **2026-03-08**: Implemented Story 2.3 - Story Distribution by Lane
  - Created useStoriesByStatus hook for story grouping and sorting
  - Integrated hook into KanbanBoard component
  - Added comprehensive test coverage (8 tests)
  - Verified all acceptance criteria through automated tests and manual browser testing
- **2026-03-08**: Code Review - Fixed HTTP caching issue
  - Added Cache-Control headers to disable browser caching (304 responses)
  - Single-user app benefits from always-fresh data

## Senior Developer Review (AI)

### Review Date: 2026-03-08

### Review Outcome: Changes Requested (Fixed)

### Action Items

- [x] [AI-Review][MEDIUM] Disable HTTP caching for API responses - server was returning 304 responses causing stale data
  - **Fixed**: Added Cache-Control headers in `server/index.ts` to disable all caching

### Summary

**Implementation Quality:** Good - Clean hook implementation with proper memoization and test coverage.

**Issues Found:** 2 issues (1 MEDIUM, 1 LOW)

- MEDIUM: HTTP 304 caching causing stale data - FIXED
- LOW: In-memory cache without TTL - acknowledged but acceptable for single-user app

**Recommendation:** Story ready for completion after cache fix applied.
