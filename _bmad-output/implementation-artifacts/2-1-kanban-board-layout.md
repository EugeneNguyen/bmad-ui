# Story 2.1: Kanban Board Layout

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **product owner,**
I want to see a Kanban board with clearly labeled lanes,
so that I can understand the workflow and where stories are in the development process.

## Acceptance Criteria

### AC1: Kanban Board Display

**Given** a product owner opens bmad-ui in their browser
**When** the sprint board loads
**Then** a Kanban board is displayed with four horizontal lanes
**And** each lane has a clear label at the top:
- "Ready to Start" (status: ready)
- "Being Built" (status: in-dev)
- "Needs Your Attention" (status: ready-for-review)
- "Complete" (status: done)
**And** lanes are arranged left-to-right in workflow order
**And** the board fills the viewport width
**And** the layout is responsive and works on mobile devices

### AC2: Desktop Layout

**Given** a product owner views the Kanban board on desktop
**When** the screen width is >= 1024px
**Then** all four lanes are visible side-by-side
**And** horizontal scrolling is not required
**And** lane widths are proportional to content
**And** the board uses available space efficiently

### AC3: Component Implementation

**Given** a developer implements the KanbanBoard component
**When** the component renders
**Then** it uses Tailwind CSS for styling
**And** follows atomic design pattern (feature component)
**And** exports as default from `src/components/features/kanban/KanbanBoard.tsx`
**And** accepts `stories`, `epics`, and `sprintStatus` as props
**And** renders Lane components for each status

### AC4: Lane Component

**Given** a developer creates the Lane component
**When** the component renders
**Then** it displays lane title with PO-friendly label (via STATUS_LABELS)
**And** shows story count badge
**And** renders StoryCard children (future Story 2.2)
**And** exports as default from `src/components/features/kanban/Lane.tsx`
**And** accepts `status`, `title`, `stories` as props
**And** handles empty state ("No stories in this lane")

### AC5: Keyboard Navigation

**Given** a product owner uses keyboard navigation
**When** they press Tab to navigate the board
**Then** focus moves through lanes in order
**And** each lane is focusable
**And** ARIA labels describe lane purpose
**And** the focus order follows visual order (left-to-right)
**And** screen readers announce lane names and card counts

### AC6: Responsive Design

**Given** a product owner views the board on mobile (< 768px)
**When** the board renders
**Then** lanes stack vertically
**And** each lane is full-width
**And** vertical scrolling is natural
**And** lane headers remain visible during scroll

**Given** a product owner views the board on tablet (768px - 1023px)
**When** the board renders
**Then** 2 lanes are visible side-by-side
**And** horizontal scrolling enabled for remaining lanes

**Given** a product owner views the board on desktop (>= 1024px)
**When** the board renders
**Then** all 4 lanes visible without scrolling
**And** board fills viewport width
**And** lane widths proportional to content

### AC7: Performance

**Given** a product owner views a board with many stories
**When** 100+ stories are displayed
**Then** all lanes render in < 1 second
**And** scrolling is smooth (60fps)
**And** no layout thrashing occurs
**And** memory usage remains low

### AC8: Accessibility

**Given** a product owner uses a screen reader
**When** the Kanban board loads
**Then** the board has role="region"
**And** aria-label describes the board purpose
**And** each lane has role="list"
**And** aria-labelledby points to lane title
**And** lane labels use PO-friendly language
**And** card counts are announced to screen readers

## Tasks / Subtasks

- [ ] **Task 1: Define Kanban Types and Constants** (AC: 1, 4)
  - [ ] Create `src/types/kanban.ts`
  - [ ] Define `KanbanLane` interface with status, title, storyIds
  - [ ] Define `LANE_STATUSES` constant mapping status to lane configuration
  - [ ] Define `LANE_ORDER` constant for lane display order
  - [ ] Export all as named exports
  - [ ] Add JSDoc comments

- [ ] **Task 2: Create Lane Component** (AC: 4)
  - [ ] Create `src/components/features/kanban/Lane.tsx`
  - [ ] Define props interface: status, title, stories, onStoryClick
  - [ ] Use STATUS_LABELS for PO-friendly status display
  - [ ] Implement story count badge
  - [ ] Add empty state message: "No stories in this lane"
  - [ ] Make lane focusable with tabIndex={0}
  - [ ] Add ARIA attributes: role="list", aria-labelledby
  - [ ] Style with Tailwind: min-height, rounded corners, padding
  - [ ] Export as default
  - [ ] Create `src/components/features/kanban/Lane.test.tsx`

- [ ] **Task 3: Create KanbanBoard Component** (AC: 1, 3)
  - [ ] Create `src/components/features/kanban/KanbanBoard.tsx`
  - [ ] Define props interface: stories, epics, sprintStatus
  - [ ] Import Lane component
  - [ ] Group stories by status using useMemo for performance
  - [ ] Render four Lane components in LANE_ORDER
  - [ ] Implement responsive grid layout with Tailwind
  - [ ] Add ARIA attributes: role="region", aria-label="Kanban board"
  - [ ] Export as default
  - [ ] Create `src/components/features/kanban/KanbanBoard.test.tsx`

- [ ] **Task 4: Implement Responsive Grid Layout** (AC: 6)
  - [ ] Use Tailwind responsive utilities
  - [ ] Mobile (< 768px): flex-col (vertical stack)
  - [ ] Tablet (768px - 1023px): grid-cols-2
  - [ ] Desktop (>= 1024px): grid-cols-4
  - [ ] Ensure lanes fill available width evenly
  - [ ] Add gap between lanes (gap-4, md:gap-6, lg:gap-8)
  - [ ] Add padding to board container (p-4, md:p-6)

- [ ] **Task 5: Implement Keyboard Navigation** (AC: 5)
  - [ ] Make each Lane focusable with tabIndex={0}
  - [ ] Add ref for each lane to track focus
  - [ ] Ensure Tab moves focus left-to-right through lanes
  - [ ] Add aria-labelledby pointing to lane title
  - [ ] Add aria-describedby pointing to card count
  - [ ] Test keyboard navigation flow

- [ ] **Task 6: Add Empty State Handling** (AC: 4)
  - [ ] Create empty state component or inline message
  - [ ] Style with Tailwind: text-slate-500, text-center, py-4
  - [ ] Display when stories array is empty
  - [ ] Message: "No stories in this lane"
  - [ ] Maintain lane height even when empty

- [ ] **Task 7: Create Story Filtering Hook** (AC: 1, 3)
  - [ ] Create `src/hooks/useFilteredStories.ts`
  - [ ] Accept stories array and status filter
  - [ ] Filter stories by status
  - [ ] Sort filtered stories by story number
  - [ ] Return filtered stories, count
  - [ ] Add TypeScript return type annotation
  - [ ] Export as named export
  - [ ] Create `src/hooks/useFilteredStories.test.ts`

- [ ] **Task 8: Update App.tsx** (AC: 1)
  - [ ] Import KanbanBoard component
  - [ ] Import useBmadData hook from context
  - [ ] Replace placeholder content with KanbanBoard
  - [ ] Pass stories, epics, sprintStatus as props
  - [ ] Handle loading state
  - [ ] Handle error state

- [ ] **Task 9: Write Component Tests** (AC: All)
  - [ ] Test Lane renders with correct title
  - [ ] Test Lane shows story count
  - [ ] Test Lane displays empty state
  - [ ] Test KanbanBoard renders all four lanes
  - [ ] Test KanbanBoard groups stories by status
  - [ ] Test responsive layout classes
  - [ ] Test keyboard navigation (tab order)
  - [ ] Test ARIA attributes

- [ ] **Task 10: Verify Responsive Design** (AC: 6)
  - [ ] Test on mobile viewport (375px)
  - [ ] Test on tablet viewport (768px)
  - [ ] Test on desktop viewport (1024px)
  - [ ] Verify lane stacking behavior
  - [ ] Verify horizontal scrolling on tablet
  - [ ] Verify all lanes visible on desktop

- [ ] **Task 11: Run Type Check and Build** (AC: All)
  - [ ] Run `npm run typecheck`
  - [ ] Verify no TypeScript errors
  - [ ] Run `npm run build`
  - [ ] Verify build succeeds

- [ ] **Task 12: Manual Browser Testing** (AC: 1, 2, 5, 6)
  - [ ] Start dev server: `npm run dev`
  - [ ] Open browser to http://localhost:3000
  - [ ] Verify all four lanes render
  - [ ] Verify lane labels use PO-friendly language
  - [ ] Test keyboard navigation with Tab
  - [ ] Test responsive resize (mobile/tablet/desktop)
  - [ ] Verify empty state displays correctly

## Dev Notes

### 🔥 CRITICAL: Architecture Compliance Requirements

**From Architecture Document - MUST follow exactly:**

1. **TypeScript Strict Mode** - All code must compile with strict mode enabled
   - All variables must be typed (inferred or explicit)
   - No `any` without explicit cast and justification
   - Array access returns `T | undefined` (noUncheckedIndexedAccess)

2. **Named Exports for Utilities** - All utilities, types, and constants use named exports (NOT default)
   - ✅ `export interface KanbanLane {}`
   - ✅ `export function useFilteredStories() {}`
   - ✅ `export const LANE_STATUSES = {}`
   - ❌ `export default function useFilteredStories() {}`

3. **Path Aliases** - Use `@/*` aliases for all imports (no relative paths beyond same directory)
   - ✅ `import { Story } from '@/types/bmad'`
   - ❌ `import { Story } from '../types/bmad'`

4. **Atomic Design Pattern** - Components organized by complexity
   - **UI Layer**: Generic, reusable UI primitives (atoms, molecules)
   - **Feature Layer**: BMAD domain-specific UI (KanbanBoard, Lane, StoryCard)
   - **Layout Layer**: Page layouts and error boundaries
   - Feature components depend on UI components, hooks, and types

5. **Co-located Tests** - Test files in same directory as source
   - `src/components/features/kanban/KanbanBoard.test.tsx`
   - `src/hooks/useFilteredStories.test.ts`

### Technical Stack Details

**Frontend Technologies:**
- React 19 with hooks
- TypeScript 5+ with strict mode
- Tailwind CSS 4 for styling
- Vite 6 for build tooling

**Component Organization (from Architecture):**
```
src/components/
├── ui/                          # Layer 1: Generic UI (Atomic)
│   ├── atoms/                   # Smallest units
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Icon.tsx
│   │   └── Spinner.tsx
│   └── molecules/               # Combinations of atoms
│       ├── Modal.tsx
│       ├── Card.tsx
│       └── Dropdown.tsx
├── features/                    # Layer 2: BMAD Domain
│   ├── kanban/                  # Kanban board feature (THIS STORY)
│   │   ├── KanbanBoard.tsx      # Main board component
│   │   ├── Lane.tsx             # Individual lane
│   │   └── StoryCard.tsx         # Card component (Story 2.2)
│   ├── stories/
│   │   ├── StoryDetail.tsx
│   │   └── AcceptanceCriteria.tsx
│   └── filters/
│       ├── SprintFilter.tsx
│       └── EpicFilter.tsx
└── layout/
    ├── AppLayout.tsx
    └── ErrorBoundary.tsx
```

**Kanban Components for Story 2.1:**
- `src/components/features/kanban/KanbanBoard.tsx` - Main board
- `src/components/features/kanban/Lane.tsx` - Individual lane
- `src/components/features/kanban/StoryCard.tsx` - Story card (placeholder for Story 2.2)

**Note:** StoryCard component will be a simple placeholder for this story, Detailed implementation is in Story 2.2

### Tailwind CSS Responsive Patterns

**Responsive Breakpoints (from Research):**
```tsx
// Mobile-first approach
<div className="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-4 
  gap-4 
  md:gap-6 
  lg:gap-8
  p-4 
  md:p-6
">
  {/* Four Kanban lanes */}
</div>
```

**Production Pattern - Lane Layout:**
```tsx
// Individual lane - flex for card stacking
<div className="
  flex 
  flex-col 
  gap-3 
  min-h-[280px]
  max-h-[calc(100vh-4rem)]
  overflow-y-auto
  bg-slate-50 
  rounded-lg
  p-4
">
  {/* Cards */}
</div>
```

**Horizontal Scrolling for Mobile (Alternative):**
```tsx
// Container with horizontal scroll
<div className="
  flex 
  overflow-x-auto 
  gap-4 
  p-4
  
  // Snap to lanes in scroll
  snap-x 
  snap-mandatory
">
  {/* Lanes snap to start when scrolling */}
  <div className="snap-start">
    <Lane />
  </div>
</div>

/* CSS helper */
@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

### Accessibility Requirements (WCAG 2.1 AA)

**From Architecture Document (Lines 610-676):**

**Mandatory Requirements:**
| Requirement | Implementation |
|-------------|----------------|
| Keyboard Navigation | Tab order, arrow keys for board navigation |
| ARIA Labels | Custom `useAnnounce` hook + manual aria-* attributes |
| Focus Management | Custom `useFocusTrap`, `useFocusReturn` hooks |
| Color Contrast | Tailwind config enforces 4.5:1 minimum |
| Screen Reader | Semantic HTML + `useAnnounce` for dynamic content |

**Custom ARIA Hooks (from Architecture):**
```typescript
// src/hooks/accessibility/
export function useFocusTrap(ref: RefObject<HTMLElement>): void
export function useAnnounce(message: string, priority?: 'polite' | 'assertive'): void
export function useKeyboardShortcut(
  key: string,
  handler: () => void,
  options?: KeyboardOptions
): void
export function useFocusReturn(trigger: boolean): void
```

**Hook File Paths:**
- `src/hooks/accessibility/useFocusTrap.ts`
- `src/hooks/accessibility/useAnnounce.ts`
- `src/hooks/accessibility/useKeyboardShortcut.ts`
- `src/hooks/accessibility/useFocusReturn.ts`

**For Story 2.1, these hooks are OPTIONAL. Full implementation can be deferred to Story 2.3 (Story Navigation). However, basic ARIA attributes are mandatory:**
- Each lane needs: `role="list"`, `aria-labelledby`, `aria-describedby`
- Board needs: `role="region"`, `aria-label`

**Production Pattern - ARIA Implementation:**
```tsx
function Lane({ status, title, stories }) {
  const laneId = `lane-${status}`
  const titleId = `lane-title-${status}`
  const descId = `lane-desc-${status}`
  
  return (
    <div
      role="list"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="..."
      tabIndex={0}
    >
      <h2 id={titleId} className="font-semibold">
        {STATUS_LABELS[status]}
      </h2>
      <p id={descId} className="sr-only">
        {stories.length} stories in this lane
      </p>
      {/* Story cards */}
    </div>
  )
}
```

### Performance Requirements

**From Architecture Document (NFR1-4):**
| Metric | Target |
|--------|--------|
| First Contentful Paint (FCP) | < 1s |
| Time to Interactive (TTI) | < 2s |
| Bundle Size | < 5MB |
| Memory Usage | < 200MB |
| Render 100+ stories | < 1s |

**Performance Patterns:**
1. **Use React.memo for card components** (Story 2.2)
2. **Use useMemo for story filtering/grouping** - Prevent re-calc on every render
3. **Use useCallback for event handlers** - Stable references for child components
4. **Avoid inline object creation** - Don't create new objects in render
5. **Keep lane heights bounded** - Prevent layout thrashing

**Production Pattern - Memoized Filtering:**
```tsx
function KanbanBoard({ stories, epics, sprintStatus }) {
  // Memoize story grouping to prevent recalculation
  const lanes = useMemo(() => {
    const ready = stories.filter(s => s.status === 'ready')
    const inDev = stories.filter(s => s.status === 'in-dev')
    const review = stories.filter(s => s.status === 'ready-for-review')
    const done = stories.filter(s => s.status === 'done')
    
    return { ready, inDev, review, done }
  }, [stories])
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <Lane status="ready" stories={lanes.ready} />
      <Lane status="in-dev" stories={lanes.inDev} />
      <Lane status="ready-for-review" stories={lanes.review} />
      <Lane status="done" stories={lanes.done} />
    </div>
  )
}
```

### Previous Story Intelligence

**From Story 1.1 (Project Initialization):**

✅ **Completed Foundation:**
- Vite + React + TypeScript project initialized with strict mode
- All dependencies installed (express, js-yaml, gray-matter, axios)
- Directory structure created (src/hooks/, src/context/, src/types/, src/lib/)
- Tailwind CSS configured
- ESLint + Prettier configured
- Vitest test framework configured
- TypeScript strict mode enabled

📋 **Learnings:**
- Use ESLint flat config (eslint.config.js)
- Use Prettier config (prettier.config.js)
- Path aliases (`@/*`) work in client code
- Build output: `dist/client/` for frontend
- Co-located tests pattern established

**From Story 1.2 (Server and API Routes):**

✅ **Server Foundation Completed:**
- Express server running on port 3000
- API routes implemented: `/api/stories`, `/api/epics`, `/api/sprint`
- File parsers working: yaml.ts, json.ts, markdown.ts
- Cache manager implemented in server/lib/cache.ts
- BMAD reader working in server/lib/bmad-reader.ts

📋 **Learnings:**
- Server uses relative imports (no path aliases)
- Client uses path aliases (`@/*`)
- Types defined in `src/types/bmad.ts` will be used (from Story 1.3)
- API response format: data directly on success, `{ error: {...} }` on failure

**From Story 1.3 (Data Types and State Management):**

✅ **Context Foundation Completed:**
- BmadDataContext provides: stories, epics, sprintStatus, loading, error, refetch
- Types defined in `src/types/bmad.ts`: Story, Epic, SprintStatus
- STATUS_LABELS constant defined in `src/lib/status-labels.ts`
- API client with error handling in `src/lib/api.ts`
- Custom hooks: useStories, useEpics, useSprintStatus

📋 **Learnings:**
- **CRITICAL: Always use STATUS_LABELS for display, never raw status values**
- Use `@/*` path aliases for all client imports
- Named exports for all utilities/hooks
- Context fetches all data once with Promise.all
- BmadError class for structured error handling

⚠️ **Integration Points:**
- Story 2.1 will use `useBmadData()` hook to get stories/epics
- Story 2.1 will use `STATUS_LABELS` constant for PO-friendly labels
- Story 2.1 will use types from `@/types/bmad`
- API endpoints already available: `/api/stories`, `/api/epics`

### Git Intelligence

**Recent Commits:**
- Latest: "Finish PRD" - PRD document completion
- Before: "Init repository with BMAD documentation and configuration files"

**Recent Work Patterns:**
- Planning phase completed (PRD, architecture, epics, UX design)
- Epic 1 implementation in progress
- Story 1.1, 1.2, 1.3 implemented (project foundation)

**Files Modified Recently:**
- `_bmad-output/planning-artifacts/prd.md` (latest commit)
- Project structure initialized in earlier commit
- Story files created in `_bmad-output/implementation-artifacts/`

**Implementation Insights:**
- Following BMAD workflow: Planning → Implementation
- Stories created in order: 1.1 (project), 1.2 (server), 1.3 (types/state)
- Clear separation between planning artifacts and implementation artifacts
- Epic 1 (Project Foundation) nearly complete
- Epic 2 (Sprint Visualization) beginning with Story 2.1

### Web Research - Latest Technical Specifics

**React 19 Best Practices:**
- useMemo for expensive calculations (story filtering/grouping)
- useCallback for stable handler references
- React.memo for component memoization (future StoryCard optimization)

**Tailwind CSS v4 Features:**
- Grid responsive utilities: grid-cols-1, md:grid-cols-2, lg:grid-cols-4
- Container queries (new in v4) - optional for lane width control
- Focus utilities: focus:ring-2, focus:ring-blue-500

**Performance Optimization (from Research):**
- **Virtual Scrolling**: React Virtuoso for 100+ cards per lane (future optimization)
- **Memoization**: React.memo for card components (Story 2.2)
- **Snapshot Pattern**: Capture state at drag start to prevent re-renders (Story 2.3 or later)
- **Stable Keys**: Use card.id as key, not index

**WCAG 2.2 Requirements (2025):**
- **Touch Targets**: 24×24px minimum for interactive elements
- **Drag Alternatives**: Keyboard alternatives for drag-and-drop (future Stories)
- **Focus Visible**: Clear focus indicators on all interactive elements

### Common Pitfalls to Avoid

1. **Wrong Export Style** - Use default exports for components, named exports for utilities
   - ✅ `export default function KanbanBoard() {}` (components)
   - ✅ `export function useFilteredStories() {}` (utilities)
   - ❌ `export default function useFilteredStories() {}` (wrong for utility)

2. **Missing STATUS_LABELS** - Never use raw status values in UI
   - ❌ `status === 'in-dev'` in display
   - ✅ `STATUS_LABELS[status]` for display

3. **Path Alias Violations** - Must use `@/*` in client code
   - ✅ `import { Story } from '@/types/bmad'`
   - ❌ `import { Story } from '../types/bmad'`

4. **Inline Object Creation** - Don't create objects in render
   - ❌ `<Lane stories={stories.filter(s => s.status === 'ready')} />` (creates new array every render)
   - ✅ Use useMemo to group stories once

5. **Missing ARIA Attributes** - All lanes need ARIA
   - ❌ `<div className="lane">` (no ARIA)
   - ✅ `<div role="list" aria-labelledby="...">` (with ARIA)

6. **Forgetting Responsive Classes** - Mobile-first approach
   - ❌ Only `grid-cols-4` (breaks on mobile)
   - ✅ `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`

7. **Missing Tests** - Every file needs co-located test
   - Don't skip tests for component files
   - Test responsive behavior
   - Test ARIA attributes

8. **Wrong Memo Usage** - Don't memoize everything
   - Memoize only if re-renders are expensive
   - Story filtering is expensive → use useMemo
   - Simple components may not need memoization

9. **Ignoring Empty States** - Lanes must handle empty gracefully
   - Display "No stories in this lane" when empty
   - Maintain lane height when empty

10. **Performance Issues** - Don't render all stories at once
    - For 100+ stories, consider virtual scrolling (future)
    - For now, keep implementation simple but memoize filtering

### Project Structure Notes

**Files to Create:**
```
src/
├── components/
│   └── features/
│       └── kanban/               # NEW: Kanban feature directory
│           ├── KanbanBoard.tsx    # Main board component
│           ├── KanbanBoard.test.tsx
│           ├── Lane.tsx             # Individual lane
│           ├── Lane.test.tsx
│           └── StoryCard.tsx        # Placeholder for Story 2.2
├── hooks/
│   └── useFilteredStories.ts     # NEW: Story filtering utility
│   └── useFilteredStories.test.ts
└── types/
    └── kanban.ts                # NEW: Kanban-specific types (if needed)
```

**Files to Update:**
```
src/App.tsx  # Add KanbanBoard component
```

**Alignment with Architecture:**
- ✅ Follows atomic design pattern (features/kanban/)
- ✅ Uses path aliases (`@/*`)
- ✅ Named exports for utilities, default for components
- ✅ Co-located tests
- ✅ Tailwind CSS for styling
- ✅ TypeScript strict mode

### Testing Requirements

**Unit Tests:**
- Lane component renders with correct title
- Lane displays PO-friendly labels via STATUS_LABELS
- Lane shows story count badge
- Lane displays empty state
- KanbanBoard renders all four lanes
- KanbanBoard groups stories by status
- KanbanBoard uses responsive layout classes
- useFilteredStories hook filters correctly

**Accessibility Tests:**
- Tab order follows visual order (left-to-right)
- ARIA attributes present on lanes
- Screen reader announcements work

**Responsive Tests:**
- Mobile layout (vertical stack)
- Tablet layout (2 columns)
- Desktop layout (4 columns)

**Test Location:** Co-located with source files (`.test.tsx` extension)

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture - Lines 444-506]
- [Source: _bmad-output/planning-artifacts/architecture.md#Accessibility - Lines 610-676]
- [Source: _bmad-output/planning-artifacts/architecture.md#Performance Requirements - Lines 162-180]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.1 - Lines 222-273]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Design Principles]
- [Source: _bmad-output/implementation-artifacts/1-3-data-types-and-state-management.md#Dev Notes]
- [Source: _bmad-output/implementation-artifacts/1-2-server-and-api-routes.md#API Endpoints]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
