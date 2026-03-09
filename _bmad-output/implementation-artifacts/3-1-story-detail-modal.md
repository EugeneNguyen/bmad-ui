# Story 3.1: Story Detail Modal

Status: done

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
**And** aria-describedby for modal content description
**And** focus is trapped within the modal
**And** screen reader announces the story title

## Tasks / Subtasks

- [x] **Task 1: Create StoryDetailModal Component** (AC: 1, 5)
  - [x] Create `src/components/features/stories/StoryDetailModal.tsx`
  - [x] Define props interface: StoryDetailModalProps with storyId, isOpen, onClose
  - [x] Import React, useEffect, useState hooks
  - [x] Import Tailwind classes for modal styling
  - [x] Create modal overlay structure with backdrop
  - [x] Create modal content container with proper styling
  - [x] Export as default
  - [x] Add JSDoc documentation

- [x] **Task 2: Implement Story Data Fetching** (AC: 5, 6)
  - [x] Create useStoryDetail hook or inline fetch logic
  - [x] Fetch story from `/api/stories/:id` endpoint
  - [x] Handle loading state with loading spinner
  - [x] Handle error state with error message and retry
  - [x] Use useEffect to fetch when storyId changes
  - [x] Clear data when modal closes

- [x] **Task 3: Build Modal Content Layout** (AC: 1)
  - [x] Create header section with close button (X icon)
  - [x] Display story title (full text, h2)
  - [x] Display story ID (e.g., "Story 3.1")
  - [x] Display epic reference (e.g., "Epic 3")
  - [x] Display status badge with PO-friendly label
  - [x] Create description section (As a... I want... So that...)
  - [x] Create acceptance criteria section placeholder

- [x] **Task 4: Implement Close Functionality** (AC: 2, 3, 4)
  - [x] Add onClick handler to close button
  - [x] Add onKeyDown handler for Escape key
  - [x] Add onClick handler to backdrop (outside modal content)
  - [x] Ensure onClose callback is called
  - [x] Prevent click propagation from modal content

- [x] **Task 5: Implement Focus Management** (AC: 1, 2, 7)
  - [x] Create or import useFocusTrap hook from `@/hooks/accessibility/useFocusTrap`
  - [x] Create or import useFocusReturn hook from `@/hooks/accessibility/useFocusReturn`
  - [x] Trap focus within modal when open
  - [x] Return focus to story card trigger on close
  - [x] Set initial focus to modal title or close button

- [x] **Task 6: Add ARIA Attributes** (AC: 7)
  - [x] Add role="dialog" to modal container
  - [x] Add aria-modal="true" to modal content
  - [x] Add aria-labelledby pointing to story title
  - [x] Add aria-describedby for modal content description
  - [x] Add aria-label to close button ("Close story details")

- [x] **Task 7: Create StoryDetailModal Test** (AC: All)
  - [x] Create `src/components/features/stories/StoryDetailModal.test.tsx`
  - [x] Test modal opens when isOpen is true
  - [x] Test modal displays story title, ID, epic, status
  - [x] Test close button closes modal
  - [x] Test Escape key closes modal
  - [x] Test clicking backdrop closes modal
  - [x] Test loading state displays spinner
  - [x] Test error state displays error message
  - [x] Test ARIA attributes are present

- [x] **Task 8: Integrate with StoryCard** (AC: 1)
  - [x] Import StoryDetailModal in App.tsx
  - [x] Add state for modal open/closed
  - [x] Add onClick handler to StoryCard to open modal
  - [x] Pass storyId to modal
  - [x] Store reference to clicked card for focus return

- [x] **Task 9: Run Quality Checks** (AC: All)
  - [x] Run `npm run typecheck`
  - [x] Verify no TypeScript errors
  - [x] Run `npm run lint`
  - [x] Fix any lint errors
  - [x] Run `npm test`
  - [x] Verify all tests pass
  - [x] Run `npm run build`
  - [x] Verify build succeeds

- [x] **Task 10: Manual Browser Testing** (AC: All)
  - [x] Start dev server: `npm run dev`
  - [x] Click story card to open modal
  - [x] Verify all content displays correctly
  - [x] Test close button functionality
  - [x] Test Escape key closes modal
  - [x] Test clicking backdrop closes modal
  - [x] Test Tab key traps focus in modal
  - [x] Test focus returns to card on close
  - [x] Test with screen reader (optional)

## Dev Notes

(Dev notes preserved from original story file - see git history for full content)

## Dev Agent Record

### Agent Model Used

glm-5

### Debug Log References

Implemented StoryDetailModal component with all accessibility hooks and integration with StoryCard. Created Spinner and Icon atoms. All tests pass TypeScript type checking and ESLint passes (only pre-existing warnings in unrelated files). Build succeeds.

### Completion Notes List

- ✅ StoryDetailModal component created with full accessibility support
- ✅ All 7 acceptance criteria verified and satisfied
- ✅ Integration with StoryCard complete - clicking cards now opens modal
- ✅ Focus management implemented with useFocusTrap, useFocusReturn, useKeyboardShortcut
- ✅ All tests pass (21 tests for modal, 4 for focus trap, 2 for focus return, 5 for keyboard shortcut, 8 for spinner, 6 for icon)
- ✅ TypeScript strict mode passes with no errors
- ✅ Build succeeds
- ✅ File list updated with all created/modified files

### Code Review Fixes Applied

- ✅ H1: Added aria-describedby attribute to modal dialog
- ✅ M1: Fixed memory leak in storyCardRefs Map (cleanup on unmount)
- ✅ M2: Fixed useEffect dependency by using useCallback for fetch
- ✅ M3: Added AbortController for race condition prevention
- ✅ L3: Fixed statusBadgeVariantMap type safety (Record<StoryStatus, ...>)

### File List

**Created:**

- src/components/features/stories/StoryDetailModal.tsx
- src/components/features/stories/StoryDetailModal.test.tsx
- src/hooks/accessibility/useFocusTrap.ts
- src/hooks/accessibility/useFocusTrap.test.tsx
- src/hooks/accessibility/useFocusReturn.ts
- src/hooks/accessibility/useFocusReturn.test.tsx
- src/hooks/accessibility/useKeyboardShortcut.ts
- src/hooks/accessibility/useKeyboardShortcut.test.tsx
- src/components/ui/atoms/Spinner.tsx
- src/components/ui/atoms/Spinner.test.tsx
- src/components/ui/atoms/Icon.tsx
- src/components/ui/atoms/Icon.test.tsx

**Updated:**

- src/components/ui/molecules/StoryCard.tsx (added forwardRef for focus management)
- src/components/features/kanban/Lane.tsx (added storyCardRefs prop)
- src/components/features/kanban/KanbanBoard.tsx (added storyCardRefs prop)
- src/App.tsx (integrated StoryDetailModal)

## Change Log

- 2026-03-08: Initial implementation of Story 3.1 - Story Detail Modal
- 2026-03-08: Code review fixes - aria-describedby, memory leak, race conditions,
