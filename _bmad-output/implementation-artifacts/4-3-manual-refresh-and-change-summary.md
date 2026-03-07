# Story 4.3: Manual Refresh & Change Summary

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **product owner,**
I want to manually refresh the board and see a summary of what changed
so that I can understand the impact of recent updates to the sprint.

## Acceptance Criteria

### AC1: Refresh Button Visibility

**Given** a product owner views the Kanban board
**When** they look at the header or toolbar
**Then** a "Refresh" button is visible
**And** the button shows an icon (e.g., refresh arrow) and/or text "Refresh"
**And** the button is accessible via keyboard (Tab + Enter)

### AC2: Refresh Action Feedback

**Given** a product owner clicks the Refresh button
**When** the refresh action starts
**Then** a loading spinner appears on the button
**And** the button is disabled during refresh
**And** the board content shows a loading state
**And** the refresh completes in < 1s

### AC3: Change Summary Display (Changes Detected)

**Given** a refresh completes successfully
**When** changes were detected
**Then** a change summary modal or toast notification displays:

- "X new stories added"
- "Y stories updated"
- "Z stories removed"
  **And** the summary is dismissible
  **And** the summary auto-dismisses after 5 seconds
  **And** the board displays the updated data

### AC4: No Changes Toast

**Given** a refresh completes successfully
**When** no changes were detected
**Then** a toast notification displays "No changes detected"
**And** the notification auto-dismisses after 3 seconds
**And** the board remains in current state

### AC5: Error Handling

**Given** a refresh fails
**When** an error occurs (network, API, parsing)
**Then** an error message displays "Failed to refresh: [error details]"
**And** the error is logged to console
**And** the board continues to display cached data
**And** a retry option is available

### AC6: API Endpoint Implementation

**Given** a developer implements the refresh logic
**When** the Refresh button is clicked
**Then** the system calls `POST /api/refresh` endpoint
**And** the endpoint clears cache and re-parses BMAD files
**And** the endpoint returns updated data and change summary
**And** the UI updates with new data

### AC7: Keyboard Shortcut Refresh

**Given** a product owner uses keyboard shortcuts
**When** they press `Cmd/Ctrl + R` or `F5`
**Then** the board refreshes (same as clicking Refresh button)
**And** the browser page reload is prevented (if possible)
**And** the change summary displays if changes detected

### AC8: ChangeSummary Component

**Given** a developer implements the ChangeSummary component
**When** the component renders
**Then** it exports as default from `src/components/ui/molecules/ChangeSummary.tsx`
**And** accepts `changes` object with counts (added, updated, removed)
**And** displays changes in a readable format
**And** is accessible (ARIA live region for screen readers)

### AC9: Detailed Change View (Optional)

**Given** a product owner views the change summary
**When** they want to see more details
**Then** an optional "View Details" link expands the summary
**And** shows list of story IDs that were added, updated, or removed
**And** each story ID is clickable and opens the story detail modal

## Tasks / Subtasks

- [ ] **Task 1: Create RefreshButton Atom Component** (AC: 1, 2)
  - [ ] Create `src/components/ui/atoms/RefreshButton.tsx`
  - [ ] Define RefreshButtonProps with `isLoading`, `onClick`, optional `disabled`
  - [ ] Use Spinner atom component (from Story 1.1/1.3)
  - [ ] Add refresh icon (SVG or icon library)
  - [ ] Show "Refresh" text alongside icon
  - [ ] Disable button when `isLoading` or `disabled`
  - [ ] Ensure keyboard accessibility (focus ring, Enter to trigger)
  - [ ] Add aria-busy when loading
  - [ ] Use named export (atom pattern)
  - [ ] Add JSDoc documentation

  - [ ] Create `src/components/ui/atoms/RefreshButton.test.tsx`

- [ ] **Task 2: Create ChangeSummary Molecule Component** (AC: 8, 9)
  - [ ] Create `src/components/ui/molecules/ChangeSummary.tsx`
  - [ ] Define ChangeSummaryProps with `changes`, `onDismiss`, optional `onViewDetails`
  - [ ] Create Toast/Notification UI using Tailwind
  - [ ] Display added, updated, removed counts
  - [ ] Add dismiss (X) button
  - [ ] Implement auto-dismiss timer (5 seconds default)
  - [ ] Add aria-live="polite" for screen reader announcements
  - [ ] Optional: Add "View Details" expandable section with story ID list
  - [ ] Make story IDs clickable (trigger story detail modal)
  - [ ] Use default export (molecule pattern)
  - [ ] Add JSDoc documentation
  - [ ] Create `src/components/ui/molecules/ChangeSummary.test.tsx`

- [ ] **Task 3: Add POST /api/refresh Endpoint** (AC: 6)
  - [ ] Create `server/routes/refresh.ts`
  - [ ] Implement `POST /api/refresh` route handler
  - [ ] Clear server cache (call cache.clear())
  - [ ] Re-read BMAD files (call parseBmadFiles())
  - [ ] Calculate change summary (compare old vs new data)
  - [ ] Return `{ stories, epics, sprint, changes: { added, updated, removed } }`
  - [ ] Handle errors gracefully (try/catch, 500 on error)
  - [ ] Add route to Express app in `server/index.ts`
  - [ ] Create `server/routes/refresh.test.ts`

- [ ] **Task 4: Create useRefresh Hook** (AC: 2, 3, 6)
  - [ ] Create `src/hooks/useRefresh.ts`
  - [ ] Manage loading state (`isLoading`, `setIsLoading`)
  - [ ] Manage error state (`error`, `setError`)
  - [ ] Store previous data hash for comparison
  - [ ] Implement refresh function that:
    - Sets loading state
    - Calls `POST /api/refresh`
    - Compares results to calculate changes
    - Updates previous data hash
    - Returns change summary
    - Catches and handles errors
  - [ ] Return `{ refresh, isLoading, error, lastRefreshed }`
  - [ ] Export as named function
  - [ ] Add JSDoc documentation
  - [ ] Create `src/hooks/useRefresh.test.tsx`

- [ ] **Task 5: Integrate Refresh in KanbanBoard** (AC: 1, 2, 3, 4, 5, 7)
  - [ ] Import RefreshButton and useRefresh hook in `src/components/features/board/KanbanBoard.tsx`
  - [ ] Add RefreshButton to header/toolbar area
  - [ ] Connect to useRefresh hook
  - [ ] Pass isLoading to RefreshButton
  - [ ] Pass refresh function to onClick
  - [ ] On refresh success:
    - If changes exist, show ChangeSummary toast
    - Clear change indicator (Story 4.2)
    - Update board with new data
  - [ ] On refresh error:
    - Show error toast/message
    - Keep change indicator visible (retry option)

  - [ ] Add aria-live region for refresh announcements
  - [ ] Test keyboard shortcuts work (see AC7)

  - [ ] Create/update integration tests

- [ ] **Task 6: Implement Keyboard Shortcuts** (AC: 7)
  - [ ] Add keyboard event listener in KanbanBoard
  - [ ] Listen for `Cmd/Ctrl + R` (Windows/Linux) or `F5` (macOS)
  - [ ] Prevent default browser refresh behavior
  - [ ] Call refresh function on shortcut press
  - [ ] Add appropriate aria-key hint for keyboard shortcut
  - [ ] Add integration tests for keyboard shortcuts

- [ ] **Task 7: Update BmadDataContext** (AC: 6)
  - [ ] Add `refresh` method to `src/context/BmadDataContext.tsx`
  - [ ] This method calls the API and updates context state
  - [ ] Expose refresh function through context
  - [ ] Update integration tests for context

- [ ] **Task 8: Integration Tests**
  - [ ] Test RefreshButton renders and calls refresh correctly
  - [ ] Test ChangeSummary displays and dismisses correctly
  - [ ] Test useRefresh hook returns correct states
  - [ ] Test POST /api/refresh endpoint clears cache and returns changes
  - [ ] Test end-to-end refresh flow in KanbanBoard

  - [ ] Test keyboard shortcuts trigger refresh
  - [ ] Test error handling throughout the flow
  - [ ] Test accessibility (aria attributes, keyboard nav)

  - [ ] Create `src/components/features/board/KanbanBoard.test.tsx`

## Dev Notes

### Architecture Compliance

- **Component Pattern:** Atomic structure - RefreshButton as atom, ChangeSummary as molecule
- **Export Style:** Atoms use named export, molecules use default export
- **File Structure:** Follow established paths (`src/components/ui/atoms/`, `src/components/ui/molecules/`)
- **Import Paths:** Use path aliases (`@/*`)
- **State Management:** React hooks (useRefresh) for refresh logic

- **Testing:** Co-located tests with Vitest + Testing Library

- **TypeScript:** Strict mode, types defined for all props

- **API Client:** Use axios instance from `src/lib/api.ts`

### Technical Requirements

- **Refresh Endpoint (`POST /api/refresh`):**
  - Clears server-side cache
  - Re-parses BMAD files
  - Returns change summary (added, updated, removed counts)
  - Returns updated stories/epics/sprint data
  - Error handling for file read/parse failures

- **Change Detection Logic:**
  - Hash comparison for detecting changes
  - Track added/updated/removed story IDs
  - Previous state stored in hook (useRefresh)
  - Handle edge cases (first load, empty data)

- **Toast/Notification System:**
  - Auto-dismiss after 5 seconds (configurable)
  - Accessible via aria-live region
  - Optional "View Details" expansion for detailed view
  - Story IDs clickable to trigger story detail modal
- **Keyboard Shortcuts:**
  - Cmd/Ctrl + R or F5 triggers refresh
  - Prevent default browser refresh behavior
  - Cross-platform (Windows/Mac)

- **Performance:**
  - Refresh API response time < 1s
  - Toast animation smooth (no jank)
  - Board update seamless (no full re-render)
- **Accessibility:**
  - RefreshButton: keyboard accessible, aria-busy when loading
  - ChangeSummary: aria-live region for screen readers, focus management
  - Keyboard shortcuts: preventDefault on refresh shortcut
- **Error Handling:**
  - API errors: show error message, allow retry
  - Network errors: show cached data, allow retry
  - Parse errors: show specific error message
  - Loading states: loading spinner, disabled state, error state
- **State Management:**
  - useRefresh hook manages: loading, error, lastRefreshed, change summary
  - BmadDataContext provides refresh function to context consumers
  - Change indicator state managed by useStoryChanges hook (Story 4.2)
- **Dependencies:**
  - RefreshButton depends on Spinner atom (created in Story 1.1)
  - ChangeSummary depends on story detail modal (from Story 3.1)
  - KanbanBoard depends on: RefreshButton, ChangeSummary, useRefresh hook, BmadDataContext, useStoryChanges hook, EpicFilter }

- **Cache Implementation:**
  - Server-side: In-memory cache in `server/lib/cache.ts`
  - Client-side: Session-scoped state in hooks (not persisted across sessions)
- **Previous Story Integration:**
  - Integrates with ChangeIndicator from Story 4.2
  - Clears change indicator and refresh
  - Updates story badges on refresh
- **Git Analysis:**
  - Recent commits show Story 4.1 and 4.2 in progress
  - Patterns: atoms in `src/components/ui/atoms/`, molecules in `src/components/ui/molecules/`, hooks in `src/hooks/`, server routes in `server/routes/`
  - Components use path aliases, Tailwind CSS, TypeScript strict mode
  - Tests are co-located

- **Code Patterns:**
  - Named exports for atoms, default exports for molecules/components
  - Props interfaces with TypeScript types
  - Error handling with try/catch, proper error states
  - ARIA attributes for accessibility
  - Loading states with disabled UI and spinner
- **Library Dependencies:**
  - React 19
    useState, useEffect for hooks
  - Axios for API calls
  - Tailwind CSS for styling
  - Vitest + Testing Library for testing
  - Express for server routing
  - js-yaml, gray-matter for file parsing (server-side)
- **Bundle Size Impact:**
  - RefreshButton: ~1KB (atom component)
  - ChangeSummary: ~2KB (molecule component)
  - useRefresh hook: ~1KB
  - Total well under 5MB target

- **Performance Targets:**
  - Refresh API response < 1s
  - Toast render/animate < 100ms
  - Board re-render < 500ms (optimistic)
  - Keyboard shortcut response < 50ms
- **Risk Mitigation:**
  - Refresh while loading: prevent duplicate refreshes
  - Handle API errors gracefully (show cached data)
  - Clear change indicator on error (no false positives)
  - Auto-dismiss toast to not summary display persists indefinitely
  - Keyboard shortcut should not override browser navigation shortcuts (cmd/ctrl+L, etc.)
  - Toast should not block board interaction
  - Ensure board updates before toast dismissal
- **Edge Cases:**
  - First load (no previous data)
  - Empty data (no stories)
  - Network error during refresh
  - Parse error during refresh
  - Rapid consecutive refreshes
  - Refresh with change indicator visible (test integration)
  - Refresh with modal open (toast interaction)
  - Keyboard shortcut with modal open (toast interaction)
  - Detailed view with story IDs (test clicking)
- **Code Reuse:**
  - Reuses Spinner atom from Story 1.1
  - Reuses story detail modal from Story 3.1
  - Reuses ChangeIndicator from Story 4.2 (integration)
  - Server routes follow pattern from Stories 1.2/2.3
  - Path aliases configured in tsconfig.json and vite.config.ts
  - Export patterns consistent with architecture

### Project Structure Notes

- **Atomic Design:** RefreshButton atom, ChangeSummary molecule
- **File Locations:**
  - `src/components/ui/atoms/RefreshButton.tsx` (atom)
  - `src/components/ui/molecules/ChangeSummary.tsx` (molecule)
  - `src/hooks/useRefresh.ts` (hook)
  - `server/routes/refresh.ts` (API route)
- **Integration Points:**
  - KanbanBoard header: RefreshButton + ChangeIndicator
  - BmadDataContext: Provides refresh method
  - ChangeSummary: Optional integration with story detail modal
- **Alignment:** Follows architecture exactly - no deviations from established patterns

### Source Tree Components to Touch

- **Frontend:**
  - `src/components/ui/atoms/RefreshButton.tsx` (new)
  - `src/components/ui/molecules/ChangeSummary.tsx` (new)
  - `src/hooks/useRefresh.ts` (new)
  - `src/components/features/board/KanbanBoard.tsx` (update - add refresh UI)
  - `src/context/BmadDataContext.tsx` (update - add refresh method)
- **Backend:**
  - `server/routes/refresh.ts` (new)
  - `server/index.ts` (update - add refresh route)
- **Tests:**
  - `src/components/ui/atoms/RefreshButton.test.tsx` (new)
  - `src/components/ui/molecules/ChangeSummary.test.tsx` (new)
  - `src/hooks/useRefresh.test.tsx` (new)
  - `server/routes/refresh.test.ts` (new)
  - `src/components/features/board/KanbanBoard.test.tsx` (update - integration tests)

### Testing Standards Summary

- **Unit Tests:** Required for all new components (RefreshButton, ChangeSummary, useRefresh hook)
- **Integration Tests:** Required for KanbanBoard update, API route tests
- **Coverage Target:** > 80% for new code
- **Test Location:** Co-located with source files (`.test.tsx`)
- **Accessibility Testing:** Test ARIA attributes, keyboard navigation
- **Error Scenarios:** Test API errors, network failures, parse errors
- **Performance Testing:** Test refresh response time, toast animation timing
- **Test Frameworks:** Vitest + Testing Library
- **Mocking Strategy:** Mock API calls in hook tests, mock components in integration tests

### References

- Story 4.3 Requirements: [Source: _bmad-output/planning-artifacts/epics.md#Story 4.3 - Lines 743-813]
- Architecture Document: [Source: _bmad-output/planning-artifacts/architecture.md#Component Structure - Lines 447-474]
- Architecture Document: [Source: _bmad-output/planning-artifacts/architecture.md#API Endpoints - Lines 389-399]
- Architecture Document: [Source: _bmad-output/planning-artifacts/architecture.md#Caching Strategy - Lines 361-367]
- Architecture Document: [Source: _bmad-output/planning-artifacts/architecture.md#Error Handling - Lines 567-606]
- Architecture Document: [Source: _bmad-output/planning-artifacts/architecture.md#Testing Standards - Lines 534-539]
- Story 1.1 (Project Initialization): [Source: _bmad-output/implementation-artifacts/1-1-project-initialization.md] - Spinner atom
- Story 3.1 (Story Detail Modal): [Source: _bmad-output/implementation-artifacts/3-1-story-detail-modal.md] - Modal component
- Story 4.1 (Epic Filter): [Source: _bmad-output/implementation-artifacts/4-1-epic-filter.md] - Filter implementation
- Story 4.2 (Change Detection): [Source: _bmad-output/implementation-artifacts/4-2-change-detection-and-visual-indicators.md] - Change indicator integration
- PRD Document: [Source: _bmad-output/planning-artifacts/prd.md#FR10, FR11, FR12 - Lines 519-523]
- PRD Document: [Source: _bmad-output/planning-artifacts/prd.md#NFR4, NFR5, NFR6 - Lines 555-561]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

_Add debugging notes here during implementation._

### Completion Notes List

_Add completion notes here after implementation._

### File List

_List all files created/modified during implementation._
