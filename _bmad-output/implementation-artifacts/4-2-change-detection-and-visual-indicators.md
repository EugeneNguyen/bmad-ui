# Story 4.2: Change Detection & Visual Indicators

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **product owner,**
I want to see visual indicators when stories have changed since I last viewed the board,
so that I know the displayed information might be outdated and needs refreshing.

## Acceptance Criteria

### AC1: Change Indicator Visibility

**Given** a product owner has the board open
**When** story files in `_bmad-output` are modified externally
**Then** a change indicator appears in the header or toolbar
**And** the indicator shows "Changes Detected" or similar message
**And** the indicator uses a badge, pulse animation, or icon to draw attention
**And** the indicator is clearly visible but not intrusive

### AC2: Change Indicator Tooltip

**Given** a product owner sees the change indicator
**When** they hover over the indicator
**Then** a tooltip displays "Story files have been modified. Click refresh to see latest changes."

### AC3: Change Detection Implementation

**Given** a developer implements change detection
**When** the board loads or refreshes
**Then** the system stores a hash or timestamp of story data
**And** periodically checks (every 30s) or listens for file changes
**And** compares current state to stored state
**And** updates the change indicator based on comparison

### AC4: Story Card Badges

**Given** a product owner views the board after changes are detected
**When** they look at individual story cards
**Then** stories that were added, updated, or removed are highlighted
**And** new stories show a "New" badge
**And** updated stories show an "Updated" badge
**And** removed stories (if previously visible) show a "Removed" indicator

### AC5: Indicator Clear on Refresh

**Given** a product owner refreshes the board
**When** the refresh completes
**Then** the change indicator is cleared
**And** story badges (New, Updated) are removed
**And** the board shows the current state

### AC6: ChangeIndicator Component

**Given** a developer implements the ChangeIndicator component
**When** the component renders
**Then** it exports as default from `src/components/ui/atoms/ChangeIndicator.tsx`
**And** accepts `hasChanges` boolean prop
**And** uses appropriate ARIA attributes for accessibility
**And** has a clear visual design (color, icon, animation)

### AC7: Error Handling for Detection Failures

**Given** change detection fails (e.g., API error)
**When** the system cannot determine if changes exist
**Then** the change indicator shows "Unable to check for changes"
**And** the refresh button remains functional
**And** the board continues to display cached data

## Tasks / Subtasks

- [ ] **Task 1: Create ChangeIndicator Atom Component** (AC: 1, 2, 6)
  - [ ] Create `src/components/ui/atoms/ChangeIndicator.tsx`
  - [ ] Define ChangeIndicatorProps with `hasChanges`, optional `message`, `onRefresh`
  - [ ] Use pulse animation when `hasChanges` is true (Tailwind animate-pulse)
  - [ ] Add icon (warning/refresh) with badge styling
  - [ ] Implement tooltip with "Story files have been modified..." message
  - [ ] Add aria-live="polite" for accessibility announcements
  - [ ] Use named export (atom pattern)
  - [ ] Add JSDoc documentation

- [ ] **Task 2: Create useStoryChanges Hook** (AC: 3, 7)
  - [ ] Create `src/hooks/useStoryChanges.ts`
  - [ ] Store hash of story data in sessionStorage (session-scoped, not persistent)
  - [ ] Implement comparison logic (JSON.stringify + simple hash)
  - [ ] Add 30-second polling interval with useEffect
  - [ ] Return `{ hasChanges, lastChecked, checkNow, error }`
  - [ ] Handle API errors gracefully (return error state, not crash)
  - [ ] Add cleanup on unmount (clear interval)
  - [ ] Export as named function

- [ ] **Task 3: Create StoryBadge Atom Component** (AC: 4)
  - [ ] Create `src/components/ui/atoms/StoryBadge.tsx`
  - [ ] Define StoryBadgeProps with `type: 'new' | 'updated' | 'removed'`
  - [ ] Style badges: "New" → green, "Updated" → blue, "Removed" → red/gray
  - [ ] Use small, non-intrusive positioning (top-right of card)
  - [ ] Add aria-label for screen readers
  - [ ] Use named export (atom pattern)

- [ ] **Task 4: Update StoryCard to Show Badges** (AC: 4)
  - [ ] Modify `src/components/ui/molecules/StoryCard.tsx`
  - [ ] Add optional `changeType` prop to StoryCardProps
  - [ ] Conditionally render StoryBadge when `changeType` is set
  - [ ] Position badge in top-right corner
  - [ ] Ensure badge doesn't interfere with card content

- [ ] **Task 5: Integrate ChangeIndicator in Header** (AC: 1, 5)
  - [ ] Add ChangeIndicator to `src/components/features/board/KanbanBoard.tsx` header
  - [ ] Position alongside EpicFilter
  - [ ] Connect to useStoryChanges hook
  - [ ] Pass `hasChanges` to ChangeIndicator
  - [ ] On refresh click, trigger data refetch and clear changes

- [ ] **Task 6: Implement Change Detection Logic** (AC: 3, 5)
  - [ ] In useStoryChanges, generate hash from current stories array
  - [ ] Compare with stored hash from sessionStorage
  - [ ] On mismatch, set `hasChanges = true`
  - [ ] On manual refresh, update stored hash and set `hasChanges = false`
  - [ ] Implement polling with setInterval (every 30 seconds)

- [ ] **Task 7: Handle Error States** (AC: 7)
  - [ ] In useStoryChanges, wrap API calls in try/catch
  - [ ] On error, set `error` state and leave `hasChanges` as false
  - [ ] ChangeIndicator shows "Unable to check" when error is set
  - [ ] Log errors to console for debugging
  - [ ] Board continues to display cached data

- [ ] **Task 8: Create Tests for ChangeIndicator** (AC: 1, 2, 6)
  - [ ] Create `src/components/ui/atoms/ChangeIndicator.test.tsx`
  - [ ] Test renders without changes (no pulse)
  - [ ] Test renders with changes (pulse animation, visible badge)
  - [ ] Test tooltip appears on hover
  - [ ] Test onRefresh callback is called on click
  - [ ] Test accessibility attributes (aria-live)

- [ ] **Task 9: Create Tests for useStoryChanges** (AC: 3, 5, 7)
  - [ ] Create `src/hooks/useStoryChanges.test.ts`
  - [ ] Test initial state (no changes)
  - [ ] Test detects changes when data differs
  - [ ] Test clears changes on manual refresh
  - [ ] Test polling interval works
  - [ ] Test error handling (API failure)

- [ ] **Task 10: Create Tests for StoryBadge** (AC: 4)
  - [ ] Create `src/components/ui/atoms/StoryBadge.test.tsx`
  - [ ] Test renders "New" badge with correct styling
  - [ ] Test renders "Updated" badge with correct styling
  - [ ] Test renders "Removed" badge with correct styling
  - [ ] Test accessibility (aria-label)

- [ ] **Task 11: Integrate with Story Detail Modal** (AC: 4)
  - [ ] When story detail modal opens for a changed story, show badge in modal header
  - [ ] Badge styling consistent with card badges
  - [ ] Clear badge state after viewing (optional enhancement)

- [ ] **Task 12: Run Quality Checks** (AC: All)
  - [ ] Run `npm run typecheck`
  - [ ] Verify no TypeScript errors
  - [ ] Run `npm run lint`
  - [ ] Fix any lint errors
  - [ ] Run `npm test`
  - [ ] Verify all tests pass
  - [ ] Run `npm run build`
  - [ ] Verify build succeeds

- [x] **Task 13: Manual Browser Testing** (AC: All)
  - [x] Start dev server: `npm run dev`
  - [x] Open board, note initial state (no indicator)
  - [x] Modify a story file in `_bmad-output`
  - [x] Wait up to 30s, verify indicator appears
  - [x] Hover over indicator, verify tooltip
  - [x] Click refresh, verify indicator clears
  - [x] Test story badges appear for changed stories
  - [x] Test with screen reader for accessibility
  - [x] Test keyboard navigation to indicator

## Dev Notes

### 🔥 CRITICAL: Architecture Compliance Requirements

**From Architecture Document - MUST follow exactly:**

1. **TypeScript Strict Mode** - All code must compile with strict mode enabled
   - All variables must be typed (inferred or explicit)
   - No `any` without explicit cast and justification
   - Array access returns `T | undefined` (noUncheckedIndexedAccess)

2. **Named Exports for Atoms** - UI atoms use NAMED exports
   - ✅ `export function ChangeIndicator() {}`
   - ❌ `export default function ChangeIndicator() {}`

3. **Path Aliases** - Use `@/*` aliases for all imports
   - ✅ `import { useStories } from '@/hooks/useStories'`
   - ❌ `import { useStories } from '../../hooks/useStories'`

4. **Component Location** - Follow atomic structure
   - ChangeIndicator: `src/components/ui/atoms/ChangeIndicator.tsx`
   - StoryBadge: `src/components/ui/atoms/StoryBadge.tsx`
   - Tests: Same directory with `.test.tsx` extension

5. **Co-located Tests** - Test files in same directory as source

### Component Implementation Patterns

**ChangeIndicator atom (named export):**

```typescript
// src/components/ui/atoms/ChangeIndicator.tsx
import { useState } from 'react'
import type { ReactNode } from 'react'

interface ChangeIndicatorProps {
  hasChanges: boolean
  onRefresh?: () => void
  error?: string | null
}

/**
 * Visual indicator for story file changes.
 * Shows pulse animation when changes are detected.
 */
export function ChangeIndicator({ hasChanges, onRefresh, error }: ChangeIndicatorProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  if (error) {
    return (
      <div
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-amber-700 bg-amber-50 rounded-lg"
        role="status"
        aria-live="polite"
      >
        <span>Unable to check for changes</span>
      </div>
    )
  }

  if (!hasChanges) {
    return null
  }

  return (
    <div className="relative">
      <button
        onClick={onRefresh}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors animate-pulse"
        aria-label="Changes detected. Click to refresh."
        aria-live="polite"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>Changes Detected</span>
      </button>

      {showTooltip && (
        <div className="absolute top-full mt-2 left-0 z-50 px-3 py-2 text-sm text-white bg-slate-800 rounded-lg shadow-lg whitespace-nowrap">
          Story files have been modified. Click refresh to see latest changes.
          <div className="absolute -top-1 left-4 w-2 h-2 bg-slate-800 transform rotate-45" />
        </div>
      )}
    </div>
  )
}
```

**StoryBadge atom (named export):**

```typescript
// src/components/ui/atoms/StoryBadge.tsx
import type { ReactNode } from 'react'

type BadgeType = 'new' | 'updated' | 'removed'

interface StoryBadgeProps {
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

/**
 * Badge indicator for story change status.
 */
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
```

**useStoryChanges hook:**

```typescript
// src/hooks/useStoryChanges.ts
import { useState, useEffect, useCallback, useRef } from 'react'
import type { Story } from '@/types/bmad'

interface UseStoryChangesReturn {
  hasChanges: boolean
  lastChecked: Date | null
  checkNow: () => Promise<void>
  error: string | null
  clearChanges: () => void
}

const STORAGE_KEY = 'bmad-story-hash'
const POLL_INTERVAL = 30000 // 30 seconds

/**
 * Hook for detecting changes in story data.
 * Uses sessionStorage to store hash of last-seen stories.
 */
export function useStoryChanges(stories: Story[]): UseStoryChangesReturn {
  const [hasChanges, setHasChanges] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const generateHash = useCallback((data: Story[]): string => {
    // Simple hash: stringify and use length + first/last chars
    const str = JSON.stringify(data.map((s) => ({ id: s.id, status: s.status, title: s.title })))
    return `${str.length}-${str.slice(0, 50)}-${str.slice(-50)}`
  }, [])

  const checkForChanges = useCallback(async () => {
    try {
      const currentHash = generateHash(stories)
      const storedHash = sessionStorage.getItem(STORAGE_KEY)

      if (storedHash && storedHash !== currentHash) {
        setHasChanges(true)
      }

      setLastChecked(new Date())
      setError(null)
    } catch (err) {
      setError('Failed to check for changes')
      console.error('Change detection error:', err)
    }
  }, [stories, generateHash])

  const clearChanges = useCallback(() => {
    const currentHash = generateHash(stories)
    sessionStorage.setItem(STORAGE_KEY, currentHash)
    setHasChanges(false)
  }, [stories, generateHash])

  const checkNow = useCallback(async () => {
    await checkForChanges()
  }, [checkForChanges])

  // Store initial hash on mount
  useEffect(() => {
    const currentHash = generateHash(stories)
    const storedHash = sessionStorage.getItem(STORAGE_KEY)

    if (!storedHash) {
      sessionStorage.setItem(STORAGE_KEY, currentHash)
    }
  }, [stories, generateHash])

  // Set up polling
  useEffect(() => {
    intervalRef.current = setInterval(checkForChanges, POLL_INTERVAL)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [checkForChanges])

  return { hasChanges, lastChecked, checkNow, error, clearChanges }
}
```

### Previous Story Intelligence

**From Story 4.1 (Epic Filter):**

📋 **Key Learnings:**

1. **Default exports for features, named for atoms** - Follow the pattern
2. **useMemo for derived data** - Memoize hash generation if needed
3. **Component position in header** - Add alongside EpicFilter
4. **Named exports for atoms** - ChangeIndicator and StoryBadge use named exports

**From Story 3.3 (Story Navigation):**

📋 **Key Learnings:**

1. **useRef for intervals** - Clean up intervals on unmount
2. **Keyboard accessibility** - Ensure indicator is keyboard accessible
3. **ARIA live regions** - Use aria-live for dynamic content

**From Architecture:**

📋 **Key Patterns:**

1. **SessionStorage for session data** - Hash stored per session, not persistent
2. **useStoryChanges hook mentioned** - Already planned in architecture
3. **Change detection FR5** - This story implements FR5 from PRD

### Change Detection Strategy

**Why sessionStorage instead of localStorage:**

- Session-scoped: Changes reset when browser closes
- Prevents stale indicators from previous sessions
- Simpler than localStorage with expiration

**Hash Algorithm Choice:**

- Simple string-based hash (length + chars)
- Fast to compute, sufficient for detecting changes
- No need for crypto hash (not security-sensitive)

**Polling vs File Watching:**

- Polling chosen for MVP (simpler, no dependencies)
- 30-second interval balances responsiveness with performance
- Can upgrade to file watching in post-MVP

### Common Pitfalls to Avoid

1. **Stale Hash on Refresh** - Update stored hash after successful refresh
   - ✅ Call `clearChanges()` after data refetch
   - ❌ Leave old hash, causing permanent "changes detected"

2. **Memory Leak with Interval** - Clean up on unmount
   - ✅ Return cleanup function in useEffect
   - ❌ Leave interval running after component unmounts

3. **Wrong Export Style for Atoms** - Atoms use NAMED exports
   - ✅ `export function ChangeIndicator() {}`
   - ❌ `export default function ChangeIndicator() {}`

4. **Missing Error State** - Handle API failures gracefully
   - ✅ Show "Unable to check" message
   - ❌ Crash or show false "changes detected"

5. **Blocking Board on Error** - Continue showing cached data
   - ✅ Board remains functional on detection failure
   - ❌ Disable entire board when detection fails

6. **Not Clearing on Manual Refresh** - Reset state on user action
   - ✅ Clear changes and update hash on refresh
   - ❌ Keep indicator visible after user refreshes

7. **Inaccessible Pulse Animation** - Don't rely only on visual cue
   - ✅ Add aria-live region for screen readers
   - ❌ Only visual pulse, no accessible alternative

### Project Structure Notes

**Files to Create:**

```
src/components/ui/atoms/
├── ChangeIndicator.tsx      # NEW: Change indicator atom
├── ChangeIndicator.test.tsx # NEW: Change indicator tests
├── StoryBadge.tsx           # NEW: Story badge atom
└── StoryBadge.test.tsx      # NEW: Story badge tests

src/hooks/
├── useStoryChanges.ts       # NEW: Change detection hook
└── useStoryChanges.test.ts  # NEW: Hook tests
```

**Files to Update:**

```
src/components/ui/molecules/
└── StoryCard.tsx            # UPDATE: Add changeType prop, render StoryBadge

src/components/features/board/
└── KanbanBoard.tsx          # UPDATE: Add ChangeIndicator, integrate hook
```

**Alignment with Architecture:**

- ✅ Follows atomic structure (atoms in `src/components/ui/atoms/`)
- ✅ Uses path aliases (`@/*`)
- ✅ Named exports for atoms
- ✅ Co-located tests
- ✅ TypeScript strict mode
- ✅ Accessibility built-in (aria-live, keyboard support)

### Performance Considerations

**Hash Generation Optimization:**

```typescript
// Only hash essential fields, not full story objects
const hashData = stories.map((s) => ({
  id: s.id,
  status: s.status,
  title: s.title,
}))
```

**Polling Interval:**

- 30 seconds is reasonable for file-based changes
- Consider exposing as configurable option if needed
- Could reduce to 15s for faster feedback (trade-off: more checks)

**SessionStorage:**

- Fast read/write (synchronous)
- No network overhead
- Automatically cleared on session end

### Testing Requirements

**Unit Tests (ChangeIndicator):**

- Renders null when hasChanges is false
- Renders with pulse animation when hasChanges is true
- Tooltip appears on hover
- Shows error state when error prop is set
- aria-live attribute present
- onRefresh callback fires on click

**Unit Tests (useStoryChanges):**

- Returns hasChanges: false initially
- Detects changes when story data differs
- Clears changes when clearChanges() called
- Polling interval works correctly
- Handles errors gracefully
- Cleans up interval on unmount

**Unit Tests (StoryBadge):**

- Renders correct label for each type
- Applies correct styling for each type
- Has accessible aria-label

**Integration Tests:**

- ChangeIndicator appears in KanbanBoard header
- StoryBadge renders on StoryCard when changeType set
- Refresh clears indicator and badges

**Test Location:** Co-located with source files (`.test.tsx` extension)

**Test Command:** `npm test`

### Styling Specifications

**From Architecture - Tailwind Classes:**

- ChangeIndicator: `px-3 py-1.5 text-sm rounded-lg` with status colors
- Pulse animation: `animate-pulse` when changes detected
- Tooltip: `absolute`, `z-50`, `bg-slate-800`, `text-white`
- StoryBadge: `px-2 py-0.5 text-xs font-medium rounded-full border`

**Color Scheme:**

- Changes detected: Blue (`bg-blue-50`, `text-blue-700`)
- Error state: Amber (`bg-amber-50`, `text-amber-700`)
- New badge: Green (`bg-green-100`, `text-green-800`)
- Updated badge: Blue (`bg-blue-100`, `text-blue-800`)
- Removed badge: Red (`bg-red-100`, `text-red-800`)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.2 - Lines 688-740]
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Structure - Lines 447-474]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture - Lines 443-507]
- [Source: _bmad-output/planning-artifacts/architecture.md#FR5 Mapping - Lines 1206-1213]
- [Source: _bmad-output/planning-artifacts/architecture.md#useStoryChanges - Lines 1020-1028]
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns - Lines 688-710]
- [Source: _bmad-output/planning-artifacts/architecture.md#Export Patterns - Lines 713-722]
- [Source: _bmad-output/planning-artifacts/architecture.md#TypeScript Strictness - Lines 832-855]
- [Source: _bmad-output/implementation-artifacts/4-1-epic-filter.md#Dev Notes]
- [Source: _bmad-output/implementation-artifacts/3-3-story-navigation.md#Dev Notes]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

_Add debugging notes here during implementation_

### Completion Notes List

_Add completion notes here after implementation_

### File List

_List all files created/modified during implementation_
