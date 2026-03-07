# Story 3.1: Story Detail Modal

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **product owner,**
I want to click a story card and see its full details in a modal,
so that I can read the complete story without navigating away from the board.

## Acceptance Criteria

### AC1: Modal Display and Content

**Given** a product owner views the Kanban board
**When** they click a story card
**Then** a modal overlay opens displaying the story details
**And** the board remains visible in the background (dimmed)
**And** focus moves to the modal
**And** the modal contains:
- Story title (full text)
- Story ID
- Epic reference
- Current status with PO-friendly label
- Story description (As a... I want... So that...)
- Acceptance Criteria section
- Close button (X icon)

### AC2: Close Button Functionality

**Given** a product owner has a story detail modal open
**When** they click the close button
**Then** the modal closes
**And** focus returns to the story card that was clicked
**And** the board is fully visible again

### AC3: Escape Key to Close

**Given** a product owner has a story detail modal open
**When** they press the Escape key
**Then** the modal closes
**And** focus returns to the story card
**And** keyboard navigation resumes from that card

### AC4: Click Outside to Close

**Given** a product owner clicks outside the modal content area
**When** they click the dimmed background
**Then** the modal closes
**And** focus returns to the board

### AC5: Component Implementation

**Given** a developer implements the StoryDetailModal component
**When** the component renders
**Then** it uses Tailwind CSS for styling
**And** follows atomic design pattern (organism component)
**And** exports as default from `src/components/features/stories/StoryDetailModal.tsx`
**And** accepts `storyId`, `isOpen`, and `onClose` as props
**And** fetches story data from `/api/stories/:id` when opened

### AC6: Loading and Error States

**Given** a product owner opens a story detail modal
**When** the modal content loads
**Then** a loading spinner displays while data is fetched
**And** loading completes in < 500ms
**And** if loading fails, an error message displays with retry option

### AC7: Accessibility Requirements

**Given** a product owner uses a screen reader
**When** the story detail modal opens
**Then** the modal has role="dialog"
**And** aria-modal="true"
**And** aria-labelledby points to story title
**And** focus is trapped within the modal
**And** screen reader announces the story title

## Tasks / Subtasks

- [ ] **Task 1: Create StoryDetailModal Component** (AC: 1, 5)
  - [ ] Create `src/components/features/stories/StoryDetailModal.tsx`
  - [ ] Define props interface: StoryDetailModalProps with storyId, isOpen, onClose
  - [ ] Import React, useEffect, useState hooks
  - [ ] Import Tailwind classes for modal styling
  - [ ] Create modal overlay structure with backdrop
  - [ ] Create modal content container with proper styling
  - [ ] Export as default
  - [ ] Add JSDoc documentation

- [ ] **Task 2: Implement Story Data Fetching** (AC: 5, 6)
  - [ ] Create useStoryDetail hook or inline fetch logic
  - [ ] Fetch story from `/api/stories/:id` endpoint
  - [ ] Handle loading state with loading spinner
  - [ ] Handle error state with error message and retry
  - [ ] Use useEffect to fetch when storyId changes
  - [ ] Clear data when modal closes

- [ ] **Task 3: Build Modal Content Layout** (AC: 1)
  - [ ] Create header section with close button (X icon)
  - [ ] Display story title (full text, h2)
  - [ ] Display story ID (e.g., "Story 3.1")
  - [ ] Display epic reference (e.g., "Epic 3")
  - [ ] Display status badge with PO-friendly label
  - [ ] Create description section (As a... I want... So that...)
  - [ ] Create acceptance criteria section placeholder

- [ ] **Task 4: Implement Close Functionality** (AC: 2, 3, 4)
  - [ ] Add onClick handler to close button
  - [ ] Add onKeyDown handler for Escape key
  - [ ] Add onClick handler to backdrop (outside modal content)
  - [ ] Ensure onClose callback is called
  - [ ] Prevent click propagation from modal content

- [ ] **Task 5: Implement Focus Management** (AC: 1, 2, 7)
  - [ ] Create or import useFocusTrap hook from `@/hooks/accessibility/useFocusTrap`
  - [ ] Create or import useFocusReturn hook from `@/hooks/accessibility/useFocusReturn`
  - [ ] Trap focus within modal when open
  - [ ] Return focus to story card trigger on close
  - [ ] Set initial focus to modal title or close button

- [ ] **Task 6: Add ARIA Attributes** (AC: 7)
  - [ ] Add role="dialog" to modal container
  - [ ] Add aria-modal="true" to modal content
  - [ ] Add aria-labelledby pointing to story title
  - [ ] Add aria-describedby for modal content description
  - [ ] Add aria-label to close button ("Close story details")

- [ ] **Task 7: Create StoryDetailModal Test** (AC: All)
  - [ ] Create `src/components/features/stories/StoryDetailModal.test.tsx`
  - [ ] Test modal opens when isOpen is true
  - [ ] Test modal displays story title, ID, epic, status
  - [ ] Test close button closes modal
  - [ ] Test Escape key closes modal
  - [ ] Test clicking backdrop closes modal
  - [ ] Test loading state displays spinner
  - [ ] Test error state displays error message
  - [ ] Test ARIA attributes are present

- [ ] **Task 8: Integrate with StoryCard** (AC: 1)
  - [ ] Import StoryDetailModal in StoryCard component
  - [ ] Add state for modal open/closed
  - [ ] Add onClick handler to StoryCard to open modal
  - [ ] Pass storyId to modal
  - [ ] Store reference to clicked card for focus return

- [ ] **Task 9: Run Quality Checks** (AC: All)
  - [ ] Run `npm run typecheck`
  - [ ] Verify no TypeScript errors
  - [ ] Run `npm run lint`
  - [ ] Fix any lint errors
  - [ ] Run `npm test`
  - [ ] Verify all tests pass
  - [ ] Run `npm run build`
  - [ ] Verify build succeeds

- [ ] **Task 10: Manual Browser Testing** (AC: All)
  - [ ] Start dev server: `npm run dev`
  - [ ] Click story card to open modal
  - [ ] Verify all content displays correctly
  - [ ] Test close button functionality
  - [ ] Test Escape key closes modal
  - [ ] Test clicking backdrop closes modal
  - [ ] Test Tab key traps focus in modal
  - [ ] Test focus returns to card on close
  - [ ] Test with screen reader (optional)

## Dev Notes

### 🔥 CRITICAL: Architecture Compliance Requirements

**From Architecture Document - MUST follow exactly:**

1. **TypeScript Strict Mode** - All code must compile with strict mode enabled
   - All variables must be typed (inferred or explicit)
   - No `any` without explicit cast and justification
   - Array access returns `T | undefined` (noUncheckedIndexedAccess)

2. **Default Exports for Components** - All components use default exports
   - ✅ `export default function StoryDetailModal() {}`
   - ❌ `export function StoryDetailModal() {}`

3. **Path Aliases** - Use `@/*` aliases for all imports (no relative paths beyond same directory)
   - ✅ `import { useFocusTrap } from '@/hooks/accessibility/useFocusTrap'`
   - ❌ `import { useFocusTrap } from '../../../hooks/accessibility/useFocusTrap'`

4. **Component Location** - Feature components go in `src/components/features/`
   - This component: `src/components/features/stories/StoryDetailModal.tsx`
   - Tests: `src/components/features/stories/StoryDetailModal.test.tsx`

5. **Co-located Tests** - Test files in same directory as source
   - `src/components/features/stories/StoryDetailModal.test.tsx`

### Component Implementation Pattern

**Production-proven modal structure:**

```typescript
// src/components/features/stories/StoryDetailModal.tsx
import { useEffect, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import type { Story } from '@/types/bmad'
import { STATUS_LABELS } from '@/lib/status-labels'
import { useFocusTrap } from '@/hooks/accessibility/useFocusTrap'
import { useFocusReturn } from '@/hooks/accessibility/useFocusReturn'
import { useKeyboardShortcut } from '@/hooks/accessibility/useKeyboardShortcut'
import Spinner from '@/components/ui/atoms/Spinner'
import Badge from '@/components/ui/atoms/Badge'
import Icon from '@/components/ui/atoms/Icon'
import { api } from '@/lib/api'

interface StoryDetailModalProps {
  storyId: string | null
  isOpen: boolean
  onClose: () => void
  triggerRef?: React.RefObject<HTMLButtonElement>
}

export default function StoryDetailModal({
  storyId,
  isOpen,
  onClose,
  triggerRef,
}: StoryDetailModalProps) {
  const [story, setStory] = useState<Story | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const titleId = `story-title-${storyId}`

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

  // Handle backdrop click
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
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
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
        <div className="px-6 py-4">
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
                  // Retry by triggering useEffect
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
            <>
              {/* Title and ID */}
              <h2 id={titleId} className="text-2xl font-bold mb-2">
                {story.title}
              </h2>
              <p className="text-slate-500 text-sm mb-4">
                Story {parseStoryId(story.id)} · Epic {parseEpicId(story.epicId)}
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
                <div className="text-slate-700">
                  {/* Will be implemented in Story 3.2 */}
                  {story.acceptanceCriteria?.length ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {story.acceptanceCriteria.map((criteria, i) => (
                        <li key={i}>{criteria}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-400 italic">
                      No acceptance criteria defined
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

// Utility to parse story ID for display
function parseStoryId(id: string): string {
  const match = id.match(/^(\d+)-(\d+)/)
  if (!match) return id
  return `${match[1]}.${match[2]}`
}

// Utility to parse epic ID for display
function parseEpicId(epicId: string): string {
  const match = epicId.match(/^epic-(\d+)/)
  if (!match) return epicId
  return match[1]
}
```

### Accessibility Hooks Required

**Create these hooks if they don't exist:**

```typescript
// src/hooks/accessibility/useFocusTrap.ts
import { useEffect, RefObject } from 'react'

export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  isActive: boolean
): void {
  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    firstElement?.focus()

    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [containerRef, isActive])
}
```

```typescript
// src/hooks/accessibility/useFocusReturn.ts
import { useEffect, RefObject } from 'react'

export function useFocusReturn(
  triggerRef: RefObject<HTMLButtonElement | null>,
  shouldReturn: boolean
): void {
  useEffect(() => {
    if (shouldReturn && triggerRef.current) {
      triggerRef.current.focus()
    }
  }, [shouldReturn, triggerRef])
}
```

```typescript
// src/hooks/accessibility/useKeyboardShortcut.ts
import { useEffect, useCallback } from 'react'

interface KeyboardOptions {
  enabled?: boolean
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
}

export function useKeyboardShortcut(
  key: string,
  handler: () => void,
  options: KeyboardOptions = {}
): void {
  const { enabled = true, ctrl, shift, alt } = options

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.key === key &&
        (!ctrl || e.ctrlKey) &&
        (!shift || e.shiftKey) &&
        (!alt || e.altKey)
      ) {
        e.preventDefault()
        handler()
      }
    },
    [key, handler, ctrl, shift, alt]
  )

  useEffect(() => {
    if (!enabled) return

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [enabled, handleKeyDown])
}
```

### Integration with StoryCard

**Update StoryCard to trigger the modal:**

```typescript
// In StoryCard.tsx
import { useRef, useState } from 'react'
import StoryDetailModal from './StoryDetailModal'

export default function StoryCard({ story, epic }: StoryCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const cardRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <button
        ref={cardRef}
        onClick={() => setIsModalOpen(true)}
        className="w-full text-left p-3 bg-white rounded-lg border hover:shadow-md transition-shadow"
        aria-label={`View details for ${story.title}`}
      >
        {/* Card content */}
      </button>

      <StoryDetailModal
        storyId={story.id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        triggerRef={cardRef}
      />
    </>
  )
}
```

### API Endpoint Expected Response

**From Story 1.2 - API endpoint:**

```typescript
// GET /api/stories/:id
// Response:
{
  id: "3-1-story-detail-modal",
  title: "Story Detail Modal",
  description: "As a product owner, I want to click a story card...",
  status: "ready",
  epicId: "epic-3",
  sprintId: "sprint-1",
  acceptanceCriteria: [
    "Given a product owner views the Kanban board...",
    // ...
  ]
}
```

### Previous Story Intelligence

**From Story 2.3 (Story Distribution by Lane):**

✅ **Completed Components:**
- `src/hooks/useStoriesByStatus.ts` - Story grouping hook
- `src/components/features/kanban/KanbanBoard.tsx` - Updated with hook
- `src/components/features/kanban/Lane.tsx` - Empty state handling

📋 **Key Learnings:**
1. **useMemo for performance:** All derived data should be memoized
2. **Named exports for hooks:** Always use named exports
3. **Fallback handling:** Invalid data should not crash the app
4. **Console warnings:** Log issues for debugging without breaking UX
5. **TypeScript strictness:** Handle undefined with nullish coalescing

**From Story 2.2 (Story Card Display):**

✅ **Completed Components:**
- `src/components/ui/molecules/StoryCard.tsx` - Story card component
- `src/components/ui/atoms/Badge.tsx` - Status badge component

📋 **Key Learnings:**
1. **React.memo:** Used for StoryCard performance optimization
2. **STATUS_LABELS:** Import from `@/lib/status-labels` for PO-friendly labels
3. **Story ID display:** Use "Story X.Y" format

**From Story 2.1 (Kanban Board Layout):**

📋 **Key Learnings:**
1. **ARIA attributes:** Always include role and aria-labels
2. **Tailwind responsive:** Use responsive classes (lg:, md:)
3. **Component composition:** Build complex UI from atoms/molecules

### Common Pitfalls to Avoid

1. **Missing Focus Management** - Modals MUST trap and return focus
   - ✅ useFocusTrap + useFocusReturn hooks
   - ❌ Just opening modal without focus handling

2. **Missing Portal** - Modal must render at document root
   - ✅ `createPortal(content, document.body)`
   - ❌ Rendering inline in component

3. **Close on Content Click** - Must prevent propagation
   - ✅ `onClick={handleBackdropClick}` on backdrop only
   - ❌ Modal closes when clicking inside content

4. **Missing ARIA Attributes** - Required for accessibility
   - ✅ role="dialog", aria-modal="true", aria-labelledby
   - ❌ Just visual styling without ARIA

5. **Wrong Export Style** - Components use default exports
   - ✅ `export default function StoryDetailModal() {}`
   - ❌ `export function StoryDetailModal() {}`

6. **Missing Loading State** - Always show loading indicator
   - ✅ Display Spinner while fetching
   - ❌ Blank modal while waiting for data

7. **Ignoring Error State** - Handle fetch failures gracefully
   - ✅ Show error message with retry option
   - ❌ Leave modal blank or crash on error

### Project Structure Notes

**Files to Create:**
```
src/components/features/stories/
├── StoryDetailModal.tsx         # NEW: Modal component
└── StoryDetailModal.test.tsx    # NEW: Modal tests

src/hooks/accessibility/
├── useFocusTrap.ts              # NEW (if not exists): Focus trap hook
├── useFocusTrap.test.ts         # NEW (if not exists)
├── useFocusReturn.ts            # NEW (if not exists): Focus return hook
├── useFocusReturn.test.ts       # NEW (if not exists)
├── useKeyboardShortcut.ts       # NEW (if not exists): Keyboard handler
└── useKeyboardShortcut.test.ts  # NEW (if not exists)
```

**Files to Update:**
```
src/components/ui/molecules/
└── StoryCard.tsx                # UPDATE: Add modal trigger
```

**Alignment with Architecture:**
- ✅ Follows component pattern (src/components/features/)
- ✅ Uses path aliases (`@/*`)
- ✅ Default exports for components
- ✅ Co-located tests
- ✅ TypeScript strict mode
- ✅ Accessibility built-in

### Testing Requirements

**Unit Tests:**
- StoryDetailModal renders when isOpen is true
- StoryDetailModal does not render when isOpen is false
- StoryDetailModal displays loading spinner during fetch
- StoryDetailModal displays story content after fetch
- StoryDetailModal displays error message on fetch failure
- Close button calls onClose callback
- Escape key calls onClose callback
- Clicking backdrop calls onClose callback
- Clicking inside modal does not call onClose
- ARIA attributes are present (role, aria-modal, aria-labelledby)
- Focus trap is active when modal is open

**Integration Tests:**
- Clicking StoryCard opens modal
- Modal displays correct story data
- Closing modal returns focus to StoryCard
- Keyboard navigation works within modal

**Test Location:** Co-located with source files (`.test.tsx` extension)

**Test Command:** `npm test`

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.1 - Lines 412-474]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture - Lines 443-507]
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Structure - Lines 447-474]
- [Source: _bmad-output/planning-artifacts/architecture.md#Accessibility Implementation - Lines 485-506]
- [Source: _bmad-output/planning-artifacts/architecture.md#Custom ARIA Hooks - Lines 496-506]
- [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication - Lines 387-421]
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns - Lines 688-710]
- [Source: _bmad-output/planning-artifacts/architecture.md#Export Patterns - Lines 713-722]
- [Source: _bmad-output/planning-artifacts/architecture.md#TypeScript Strictness - Lines 832-855]
- [Source: _bmad-output/planning-artifacts/prd.md#Accessibility Requirements - Lines 564-575]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Design Principles]
- [Source: _bmad-output/implementation-artifacts/2-3-story-distribution-by-lane.md#Dev Notes]
- [Source: _bmad-output/implementation-artifacts/2-2-story-card-display.md#Dev Notes]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

_ _Add debugging notes here during implementation_

### Completion Notes List

_ _Add completion notes here after implementation_

### File List

_ _List all files created/modified during implementation_
