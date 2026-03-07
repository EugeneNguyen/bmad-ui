# Story 3.3: Story Navigation

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **product owner,**
I want to navigate to the next or previous story in the same lane without closing the modal,
so that I can review multiple stories efficiently.

## Acceptance Criteria

### AC1: Navigation Buttons Display

**Given** a product owner has a story detail modal open
**When** they look at the modal footer
**Then** two navigation buttons are visible:
- "Previous" button (left arrow icon)
- "Next" button (right arrow icon)
**And** button labels include story IDs (e.g., "Previous: Story 2.1")
**And** buttons are positioned at bottom of modal

### AC2: Previous Button Disabled State

**Given** a product owner views the first story in a lane
**When** they look at the navigation buttons
**Then** the "Previous" button is disabled
**And** the button has a visual disabled state
**And** clicking it does nothing

### AC3: Next Button Disabled State

**Given** a product owner views the last story in a lane
**When** they look at the navigation buttons
**Then** the "Next" button is disabled
**And** the button has a visual disabled state
**And** clicking it does nothing

### AC4: Next Button Functionality

**Given** a product owner clicks the "Next" button
**When** the button is enabled
**Then** the modal content updates to show the next story in the same lane
**And** the transition is smooth (fade or slide animation)
**And** focus remains in the modal
**And** the URL updates (if deep linking is implemented)
**And** the previous/next button states update

### AC5: Previous Button Functionality

**Given** a product owner clicks the "Previous" button
**When** the button is enabled
**Then** the modal content updates to show the previous story in the same lane
**And** the transition is smooth
**And** focus remains in the modal

### AC6: Left Arrow Keyboard Navigation

**Given** a product owner uses keyboard navigation
**When** the modal is open and they press the Left Arrow key
**Then** the previous story is shown (same as clicking Previous button)
**And** if already at first story, nothing happens

### AC7: Right Arrow Keyboard Navigation

**Given** a product owner uses keyboard navigation
**When** the modal is open and they press the Right Arrow key
**Then** the next story is shown (same as clicking Next button)
**And** if already at last story, nothing happens

### AC8: Navigation Logic Implementation

**Given** a developer implements navigation logic
**When** the StoryDetailModal component renders
**Then** it maintains an ordered list of stories in the current lane
**And** tracks current story index
**And** navigation updates index and fetches new story data
**And** navigation is efficient (uses cached data if available)

### AC9: Loading States During Navigation

**Given** a product owner navigates between stories
**When** a new story loads
**Then** a loading indicator shows briefly (< 300ms)
**And** if loading fails, an error message displays
**And** navigation buttons remain functional for retry

## Tasks / Subtasks

- [ ] **Task 1: Extend StoryDetailModal Props** (AC: 1, 8)
  - [ ] Add `laneStories: Story[]` prop to StoryDetailModalProps
  - [ ] Add `currentStoryIndex: number` prop
  - [ ] Update component signature with new props
  - [ ] Update JSDoc documentation

- [ ] **Task 2: Build Navigation Button Component** (AC: 1, 2, 3)
  - [ ] Create NavigationButton component in `src/components/ui/atoms/NavigationButton.tsx`
  - [ ] Implement button with icon (ChevronLeft/ChevronRight)
  - [ ] Add disabled state styling (opacity, cursor)
  - [ ] Include story ID in button label
  - [ ] Export as named export
  - [ ] Add JSDoc documentation

- [ ] **Task 3: Create Modal Footer with Navigation** (AC: 1)
  - [ ] Add footer section to StoryDetailModal
  - [ ] Position footer at bottom with sticky styling
  - [ ] Add flexbox layout for Previous/Next buttons
  - [ ] Style footer with border-t and padding

- [ ] **Task 4: Implement Navigation Logic** (AC: 2, 3, 4, 5, 8)
  - [ ] Calculate currentIndex from laneStories array
  - [ ] Determine hasPrevious and hasNext booleans
  - [ ] Create handlePrevious callback function
  - [ ] Create handleNext callback function
  - [ ] Update button disabled states based on position
  - [ ] Ensure navigation stays within array bounds

- [ ] **Task 5: Add Keyboard Shortcuts for Navigation** (AC: 6, 7)
  - [ ] Add useKeyboardShortcut for Left Arrow key
  - [ ] Add useKeyboardShortcut for Right Arrow key
  - [ ] Ensure shortcuts only work when modal is open
  - [ ] Prevent default browser behavior for arrow keys
  - [ ] Handle edge cases (first/last story)

- [ ] **Task 6: Implement Story Data Fetching on Navigate** (AC: 4, 5, 8)
  - [ ] Update useEffect to fetch story when storyId changes
  - [ ] Add loading state during story transition
  - [ ] Show loading indicator in content area
  - [ ] Handle error state with retry option
  - [ ] Use cached data if available (optimization)

- [ ] **Task 7: Add Smooth Transition Animation** (AC: 4, 5)
  - [ ] Add fade-out/fade-in transition class
  - [ ] Use CSS transitions (opacity, transform)
  - [ ] Duration: 200-300ms
  - [ ] Ensure transition doesn't block accessibility

- [ ] **Task 8: Update StoryCard Integration** (AC: 8)
  - [ ] Pass laneStories array to StoryDetailModal
  - [ ] Calculate currentStoryIndex when opening modal
  - [ ] Filter stories by lane status
  - [ ] Sort stories by story number

- [ ] **Task 9: Create NavigationButton Test** (AC: 1, 2, 3)
  - [ ] Create `src/components/ui/atoms/NavigationButton.test.tsx`
  - [ ] Test button renders with correct label
  - [ ] Test disabled state styling
  - [ ] Test onClick handler
  - [ ] Test icon rendering

- [ ] **Task 10: Update StoryDetailModal Test** (AC: All)
  - [ ] Update existing test file
  - [ ] Test Previous button disabled at first story
  - [ ] Test Next button disabled at last story
  - [ ] Test Previous button navigates to previous story
  - [ ] Test Next button navigates to next story
  - [ ] Test Left Arrow keyboard shortcut
  - [ ] Test Right Arrow keyboard shortcut
  - [ ] Test loading state during navigation
  - [ ] Test error handling during navigation

- [ ] **Task 11: Run Quality Checks** (AC: All)
  - [ ] Run `npm run typecheck`
  - [ ] Verify no TypeScript errors
  - [ ] Run `npm run lint`
  - [ ] Fix any lint errors
  - [ ] Run `npm test`
  - [ ] Verify all tests pass
  - [ ] Run `npm run build`
  - [ ] Verify build succeeds

- [ ] **Task 12: Manual Browser Testing** (AC: All)
  - [ ] Start dev server: `npm run dev`
  - [ ] Open story at first position in lane
  - [ ] Verify Previous button is disabled
  - [ ] Click Next button, verify story changes
  - [ ] Verify smooth transition
  - [ ] Test Right Arrow keyboard shortcut
  - [ ] Navigate to last story in lane
  - [ ] Verify Next button is disabled
  - [ ] Test Left Arrow keyboard shortcut
  - [ ] Verify focus remains in modal
  - [ ] Test navigation with screen reader

## Dev Notes

### 🔥 CRITICAL: Architecture Compliance Requirements

**From Architecture Document - MUST follow exactly:**

1. **TypeScript Strict Mode** - All code must compile with strict mode enabled
   - All variables must be typed (inferred or explicit)
   - No `any` without explicit cast and justification
   - Array access returns `T | undefined` (noUncheckedIndexedAccess)

2. **Default Exports for Components** - Feature components use default exports
   - ✅ `export default function StoryDetailModal() {}`
   - ❌ `export function StoryDetailModal() {}`

3. **Named Exports for Atoms** - UI atoms use named exports
   - ✅ `export function NavigationButton() {}`
   - ❌ `export default function NavigationButton() {}`

4. **Path Aliases** - Use `@/*` aliases for all imports
   - ✅ `import { useKeyboardShortcut } from '@/hooks/accessibility/useKeyboardShortcut'`
   - ❌ `import { useKeyboardShortcut } from '../../../hooks/accessibility/useKeyboardShortcut'`

5. **Component Location** - Atoms go in `src/components/ui/atoms/`
   - NavigationButton: `src/components/ui/atoms/NavigationButton.tsx`
   - Tests: `src/components/ui/atoms/NavigationButton.test.tsx`

6. **Co-located Tests** - Test files in same directory as source

### Component Implementation Pattern

**NavigationButton component (atom):**

```typescript
// src/components/ui/atoms/NavigationButton.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface NavigationButtonProps {
  direction: 'previous' | 'next'
  storyId?: string
  disabled: boolean
  onClick: () => void
}

/**
 * Navigation button for story modal with disabled state.
 * Displays arrow icon and optional story ID label.
 */
export function NavigationButton({
  direction,
  storyId,
  disabled,
  onClick,
}: NavigationButtonProps) {
  const Icon = direction === 'previous' ? ChevronLeft : ChevronRight
  const label = direction === 'previous' ? 'Previous' : 'Next'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg transition-all
        ${disabled
          ? 'opacity-50 cursor-not-allowed text-slate-400'
          : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
        }
      `}
      aria-label={`${label}${storyId ? `: Story ${storyId}` : ''}`}
    >
      {direction === 'previous' && <Icon className="w-4 h-4" />}
      <span className="text-sm font-medium">
        {label}{storyId ? `: ${storyId}` : ''}
      </span>
      {direction === 'next' && <Icon className="w-4 h-4" />}
    </button>
  )
}
```

**Updated StoryDetailModal with navigation:**

```typescript
// src/components/features/stories/StoryDetailModal.tsx
import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import type { Story } from '@/types/bmad'
import { STATUS_LABELS } from '@/lib/status-labels'
import { useFocusTrap } from '@/hooks/accessibility/useFocusTrap'
import { useFocusReturn } from '@/hooks/accessibility/useFocusReturn'
import { useKeyboardShortcut } from '@/hooks/accessibility/useKeyboardShortcut'
import Spinner from '@/components/ui/atoms/Spinner'
import Badge from '@/components/ui/atoms/Badge'
import Icon from '@/components/ui/atoms/Icon'
import { NavigationButton } from '@/components/ui/atoms/NavigationButton'
import { AcceptanceCriteria } from '@/components/ui/molecules/AcceptanceCriteria'
import { api } from '@/lib/api'

interface StoryDetailModalProps {
  storyId: string | null
  isOpen: boolean
  onClose: () => void
  triggerRef?: React.RefObject<HTMLButtonElement>
  laneStories: Story[]
  currentStoryIndex: number
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
  const [error, setError] = useState<Error | null>(null)
  const [currentIndex, setCurrentIndex] = useState(currentStoryIndex)
  const modalRef = useRef<HTMLDivElement>(null)
  const titleId = `story-title-${storyId}`

  // Navigation state
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < laneStories.length - 1
  const previousStory = hasPrevious ? laneStories[currentIndex - 1] : null
  const nextStory = hasNext ? laneStories[currentIndex + 1] : null

  // Focus trap and return
  useFocusTrap(modalRef, isOpen)
  useFocusReturn(triggerRef, !isOpen)

  // Escape key handler
  useKeyboardShortcut('Escape', onClose, { enabled: isOpen })

  // Fetch story data
  useEffect(() => {
    if (!isOpen || !storyId) {
      setStory(null)
      return
    }

    setLoading(true)
    setError(null)

    api
      .get(`/api/stories/${storyId}`)
      .then((res) => setStory(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [isOpen, storyId])

  // Navigation handlers
  const handlePrevious = useCallback(() => {
    if (!hasPrevious) return
    const newIndex = currentIndex - 1
    setCurrentIndex(newIndex)
    // Parent component should update storyId prop
  }, [hasPrevious, currentIndex])

  const handleNext = useCallback(() => {
    if (!hasNext) return
    const newIndex = currentIndex + 1
    setCurrentIndex(newIndex)
    // Parent component should update storyId prop
  }, [hasNext, currentIndex])

  // Keyboard shortcuts for navigation
  useKeyboardShortcut('ArrowLeft', handlePrevious, { enabled: isOpen && hasPrevious })
  useKeyboardShortcut('ArrowRight', handleNext, { enabled: isOpen && hasNext })

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose()
      }
    },
    [onClose]
  )

  // Parse story ID for display (e.g., "3-1-story-detail-modal" → "3.1")
  const displayStoryId = useMemo(() => {
    if (!story) return ''
    const match = story.id.match(/^(\d+)-(\d+)/)
    return match ? `${match[1]}.${match[2]}` : story.id
  }, [story])

  // Parse epic ID for display (e.g., "epic-3" → "3")
  const displayEpicId = useMemo(() => {
    if (!story) return ''
    const match = story.epicId.match(/^epic-(\d+)/)
    return match ? match[1] : story.epicId
  }, [story])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-xl flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            {story && (
              <Badge status={story.status}>
                {STATUS_LABELS[story.status]}
              </Badge>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close story details"
          >
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 flex-1 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Failed to load story</p>
              <button
                onClick={() => {
                  setLoading(true)
                  setError(null)
                }}
                className="text-blue-600 hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {story && (
            <div className="transition-opacity duration-200">
              {/* Title and ID */}
              <h2 id={titleId} className="text-2xl font-bold mb-2">
                {story.title}
              </h2>
              <p className="text-slate-500 text-sm mb-4">
                Story {displayStoryId} · Epic {displayEpicId}
              </p>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-slate-700 whitespace-pre-wrap">
                  {story.description}
                </p>
              </div>

              {/* Acceptance Criteria */}
              <div>
                <h3 className="font-semibold mb-2">Acceptance Criteria</h3>
                <AcceptanceCriteria criteria={story.acceptanceCriteria ?? []} />
              </div>
            </div>
          )}
        </div>

        {/* Footer with Navigation */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex items-center justify-between">
          <NavigationButton
            direction="previous"
            storyId={previousStory ? parseStoryIdForLabel(previousStory.id) : undefined}
            disabled={!hasPrevious}
            onClick={handlePrevious}
          />
          <NavigationButton
            direction="next"
            storyId={nextStory ? parseStoryIdForLabel(nextStory.id) : undefined}
            disabled={!hasNext}
            onClick={handleNext}
          />
        </div>
      </div>
    </div>,
    document.body
  )
}

// Utility to parse story ID for button label
function parseStoryIdForLabel(id: string): string {
  const match = id.match(/^(\d+)-(\d+)/)
  return match ? `${match[1]}.${match[2]}` : id
}
```

### Navigation State Management Strategy

**Option 1: Parent-Managed State (Recommended)**

The parent component (StoryCard or KanbanBoard) manages the current story ID:

```typescript
// In StoryCard.tsx
const [currentStoryId, setCurrentStoryId] = useState(story.id)

<StoryDetailModal
  storyId={currentStoryId}
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  triggerRef={cardRef}
  laneStories={laneStories}
  currentStoryIndex={currentIndex}
  onNavigate={setCurrentStoryId}
/>
```

**Option 2: Internal State with Callback**

Modal maintains internal state and notifies parent of changes:

```typescript
// In StoryDetailModal
const handlePrevious = useCallback(() => {
  if (!hasPrevious) return
  const newStory = laneStories[currentIndex - 1]
  onNavigate(newStory.id) // Callback to parent
}, [hasPrevious, currentIndex, laneStories, onNavigate])
```

**Recommendation:** Use Option 1 for simpler state flow. Parent passes laneStories and manages storyId.

### Integration with StoryCard

**Update StoryCard to provide navigation context:**

```typescript
// In StoryCard.tsx
import { useMemo } from 'react'
import type { Story } from '@/types/bmad'

export default function StoryCard({ story, epic }: StoryCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentStoryId, setCurrentStoryId] = useState(story.id)
  const cardRef = useRef<HTMLButtonElement>(null)

  // Get stories in the same lane (from context or props)
  const { stories } = useBmadData()
  const laneStories = useMemo(() => {
    return stories
      .filter((s) => s.status === story.status)
      .sort((a, b) => {
        const aNum = parseFloat(a.id.match(/^(\d+-\d+)/)?.[1] ?? '0')
        const bNum = parseFloat(b.id.match(/^(\d+-\d+)/)?.[1] ?? '0')
        return aNum - bNum
      })
  }, [stories, story.status])

  const currentIndex = useMemo(() => {
    return laneStories.findIndex((s) => s.id === currentStoryId)
  }, [laneStories, currentStoryId])

  return (
    <>
      <button
        ref={cardRef}
        onClick={() => {
          setCurrentStoryId(story.id)
          setIsModalOpen(true)
        }}
        className="w-full text-left p-3 bg-white rounded-lg border hover:shadow-md transition-shadow"
        aria-label={`View details for ${story.title}`}
      >
        {/* Card content */}
      </button>

      <StoryDetailModal
        storyId={currentStoryId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        triggerRef={cardRef}
        laneStories={laneStories}
        currentStoryIndex={currentIndex}
      />
    </>
  )
}
```

### Keyboard Shortcut Implementation

**Add multiple keyboard shortcuts using existing hook:**

```typescript
// In StoryDetailModal.tsx
useKeyboardShortcut('Escape', onClose, { enabled: isOpen })
useKeyboardShortcut('ArrowLeft', handlePrevious, { enabled: isOpen && hasPrevious })
useKeyboardShortcut('ArrowRight', handleNext, { enabled: isOpen && hasNext })
```

**Note:** Arrow keys should only work when modal is open and navigation is possible.

### Previous Story Intelligence

**From Story 3.2 (Acceptance Criteria Display):**

✅ **Completed Components:**
- `src/components/ui/molecules/AcceptanceCriteria.tsx` - BDD criteria formatter

📋 **Key Learnings:**
1. **Named exports for molecules:** AcceptanceCriteria uses named export
2. **useMemo for parsing:** Memoize parsed data for performance
3. **Handle empty states:** Show message for missing criteria
4. **Scrollable containers:** Use max-h-64 with overflow-y-auto
5. **Text selection:** Allow user-select for copy/paste

**From Story 3.1 (Story Detail Modal):**

✅ **Completed Components:**
- `src/components/features/stories/StoryDetailModal.tsx` - Modal component
- `src/hooks/accessibility/useFocusTrap.ts` - Focus trap hook
- `src/hooks/accessibility/useFocusReturn.ts` - Focus return hook
- `src/hooks/accessibility/useKeyboardShortcut.ts` - Keyboard handler

📋 **Key Learnings:**
1. **Focus management critical:** useFocusTrap + useFocusReturn required
2. **Portal rendering:** Use createPortal for modal at document root
3. **ARIA attributes:** role="dialog", aria-modal="true", aria-labelledby
4. **Loading states:** Show Spinner during data fetch
5. **Error handling:** Display error with retry option
6. **Close handlers:** Escape key, backdrop click, close button

**From Story 2.3 (Story Distribution by Lane):**

📋 **Key Learnings:**
1. **Filtering by status:** Filter stories by lane status
2. **Sorting stories:** Sort by story number for consistent order
3. **useMemo for derived data:** Memoize filtered/sorted arrays

### Common Pitfalls to Avoid

1. **Not Updating Story ID on Navigate** - Must change storyId prop
   - ✅ Parent updates storyId when navigation occurs
   - ❌ Navigation changes index but storyId stays same

2. **Breaking Focus Management** - Navigation should not break focus trap
   - ✅ Focus remains in modal during navigation
   - ❌ Focus escapes modal when changing stories

3. **Missing Loading State** - Show indicator during transition
   - ✅ Display Spinner while fetching new story
   - ❌ Blank content or stale content during fetch

4. **Not Handling Edge Cases** - First/last story navigation
   - ✅ Disable Previous/Next buttons at boundaries
   - ❌ Errors when trying to navigate past array bounds

5. **Keyboard Conflicts** - Arrow keys should not conflict with Tab
   - ✅ Arrow keys only for navigation, Tab for focus trap
   - ❌ Arrow keys interfere with Tab focus order

6. **Wrong Export Style** - Atoms use named exports
   - ✅ `export function NavigationButton() {}`
   - ❌ `export default function NavigationButton() {}`

7. **Missing Story ID in Labels** - Buttons should show target story
   - ✅ "Previous: Story 2.1" label format
   - ❌ Just "Previous" without context

### Performance Optimization

**Use cached data when available:**

```typescript
// In StoryDetailModal fetch logic
const fetchStory = useCallback(async (id: string) => {
  // Check if story is already in laneStories array
  const cachedStory = laneStories.find(s => s.id === id)
  if (cachedStory && cachedStory.acceptanceCriteria) {
    // Use cached data if fully populated
    setStory(cachedStory)
    setLoading(false)
    return
  }

  // Otherwise fetch from API
  setLoading(true)
  try {
    const res = await api.get(`/api/stories/${id}`)
    setStory(res.data)
  } catch (err) {
    setError(err as Error)
  } finally {
    setLoading(false)
  }
}, [laneStories])
```

**Memoize navigation calculations:**

```typescript
const hasPrevious = useMemo(() => currentIndex > 0, [currentIndex])
const hasNext = useMemo(() => currentIndex < laneStories.length - 1, [currentIndex, laneStories.length])
const previousStory = useMemo(() => hasPrevious ? laneStories[currentIndex - 1] : null, [hasPrevious, currentIndex, laneStories])
const nextStory = useMemo(() => hasNext ? laneStories[currentIndex + 1] : null, [hasNext, currentIndex, laneStories])
```

### Styling Specifications

**From UX Design Specification:**

- **Button states:** 
  - Enabled: text-slate-700, hover:bg-slate-100
  - Disabled: opacity-50, cursor-not-allowed, text-slate-400
- **Icon size:** w-4 h-4 (small icons)
- **Transition duration:** 200ms (smooth but quick)
- **Footer styling:** bg-white, border-t, px-6, py-4
- **Button spacing:** justify-between for left/right positioning

### Testing Requirements

**Unit Tests (NavigationButton):**
- NavigationButton renders with correct direction
- NavigationButton displays story ID in label
- NavigationButton has disabled styling when disabled={true}
- NavigationButton onClick is called when clicked
- NavigationButton onClick is not called when disabled

**Unit Tests (StoryDetailModal - Navigation):**
- Previous button is disabled at first story in lane
- Next button is disabled at last story in lane
- Previous button is enabled when not at first story
- Next button is enabled when not at last story
- Clicking Previous button calls navigation handler
- Clicking Next button calls navigation handler
- Left Arrow key triggers previous navigation
- Right Arrow key triggers next navigation
- Arrow keys do nothing at first/last story
- Loading indicator shows during navigation
- Error message displays if navigation fetch fails
- Focus remains in modal after navigation

**Integration Tests:**
- StoryCard passes laneStories to modal
- StoryCard calculates correct currentStoryIndex
- Navigation changes displayed story
- Navigation updates story ID prop
- Full navigation flow works (open → navigate → close)

**Test Location:** Co-located with source files (`.test.tsx` extension)

**Test Command:** `npm test`

### Project Structure Notes

**Files to Create:**
```
src/components/ui/atoms/
├── NavigationButton.tsx         # NEW: Navigation button atom
└── NavigationButton.test.tsx    # NEW: Navigation button tests
```

**Files to Update:**
```
src/components/features/stories/
└── StoryDetailModal.tsx         # UPDATE: Add navigation footer

src/components/ui/molecules/
└── StoryCard.tsx                # UPDATE: Pass laneStories and index
```

**Alignment with Architecture:**
- ✅ Follows component pattern (src/components/ui/atoms/)
- ✅ Uses path aliases (`@/*`)
- ✅ Named exports for atom components
- ✅ Default export for feature component
- ✅ Co-located tests
- ✅ TypeScript strict mode
- ✅ Accessibility built-in (keyboard shortcuts, ARIA)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.3 - Lines 529-594]
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Structure - Lines 447-474]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture - Lines 443-507]
- [Source: _bmad-output/planning-artifacts/architecture.md#Accessibility Implementation - Lines 485-506]
- [Source: _bmad-output/planning-artifacts/architecture.md#Custom ARIA Hooks - Lines 496-506]
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns - Lines 688-710]
- [Source: _bmad-output/planning-artifacts/architecture.md#Export Patterns - Lines 713-722]
- [Source: _bmad-output/planning-artifacts/architecture.md#TypeScript Strictness - Lines 832-855]
- [Source: _bmad-output/planning-artifacts/prd.md#Accessibility Requirements - Lines 564-575]
- [Source: _bmad-output/implementation-artifacts/3-2-acceptance-criteria-display.md#Dev Notes]
- [Source: _bmad-output/implementation-artifacts/3-1-story-detail-modal.md#Dev Notes]
- [Source: _bmad-output/implementation-artifacts/2-3-story-distribution-by-lane.md#Dev Notes]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

_ _Add debugging notes here during implementation_

### Completion Notes List

_ _Add completion notes here after implementation_

### File List

_ _List all files created/modified during implementation_
