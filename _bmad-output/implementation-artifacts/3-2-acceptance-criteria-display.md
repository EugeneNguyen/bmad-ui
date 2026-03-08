# Story 3.2: Acceptance Criteria Display

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **product owner,**
I want to see acceptance criteria formatted in a readable Given/When/Then structure,
so that I can easily understand the testable requirements for each story.

## Acceptance Criteria

### AC1: Given/When/Then Formatting

**Given** a product owner views a story detail modal
**When** the acceptance criteria section is displayed
**Then** each criterion is formatted with:

- **Given** (precondition) in regular text
- **When** (action) in regular text
- **Then** (expected outcome) in regular text
- **And** (additional criteria) in regular text, indented
  **And** each criterion is separated by spacing
  **And** keywords (Given, When, Then, And) are bold or highlighted
  **And** criteria are numbered or bulleted for reference

### AC2: Multiple "And" Clauses

**Given** a product owner views acceptance criteria
**When** a criterion has multiple "And" clauses
**Then** each "And" is displayed on a new line
**And** indentation clearly shows hierarchy
**And** the structure is easy to read

### AC3: Empty Criteria Handling

**Given** a story has no acceptance criteria
**When** the story detail modal opens
**Then** a message displays "No acceptance criteria defined"
**And** the acceptance criteria section is still visible

### AC4: Component Implementation

**Given** a developer implements the AcceptanceCriteria component
**When** the component renders
**Then** it parses the acceptance criteria string
**And** formats Given/When/Then structure
**And** exports as named export from `src/components/ui/molecules/AcceptanceCriteria.tsx`
**And** accepts `criteria` string array as prop
**And** handles edge cases (empty criteria, malformed text)

### AC5: Scrollable Long Lists

**Given** a product owner views a long list of acceptance criteria
**When** the criteria exceed modal height
**Then** the criteria section becomes scrollable
**And** the modal header and footer remain fixed
**And** scroll position is independent of board scroll

### AC6: Copyable Text

**Given** a product owner copies acceptance criteria text
**When** they select and copy criteria text
**Then** the text is copied with proper formatting
**And** line breaks are preserved
**And** they can paste into external documents

## Tasks / Subtasks

- [x] **Task 1: Create AcceptanceCriteria Component** (AC: 1, 4)
  - [x] Create `src/components/ui/molecules/AcceptanceCriteria.tsx`
  - [x] Define props interface: AcceptanceCriteriaProps with criteria: string[]
  - [x] Create named export function
  - [x] Add JSDoc documentation
- [x] **Task 2: Implement BDD Parser** (AC: 1, 2)
  - [x] Create parseCriteria utility function
  - [x] Parse Given/When/Then/And keywords from text
  - [x] Handle case-insensitive keyword matching
  - [x] Preserve original text formatting
  - [x] Return structured data for rendering
- [x] **Task 3: Build Criteria Item Rendering** (AC: 1, 2)
  - [x] Render each criterion as a list item
  - [x] Bold/highlight Given/When/Then/And keywords
  - [x] Apply proper indentation for "And" clauses
  - [x] Add spacing between criteria
  - [x] Number or bullet each criterion
- [x] **Task 4: Handle Empty State** (AC: 3)
  - [x] Check if criteria array is empty or undefined
  - [x] Display "No acceptance criteria defined" message
  - [x] Style message with italics and muted color
- [x] **Task 5: Implement Scrollable Container** (AC: 5)
  - [x] Add max-height constraint to criteria container
  - [x] Apply overflow-y-auto for scrolling
  - [x] Ensure header/footer remain fixed
  - [x] Style scrollbar for consistency
- [x] **Task 6: Create AcceptanceCriteria Test** (AC: All)
  - [x] Create `src/components/ui/molecules/AcceptanceCriteria.test.tsx`
  - [x] Test Given/When/Then formatting
  - [x] Test multiple "And" clause rendering
  - [x] Test empty criteria handling
  - [x] Test scrolling for long lists
  - [x] Test text selection/copy functionality
- [x] **Task 7: Integrate with StoryDetailModal** (AC: All)
  - [x] Import AcceptanceCriteria in StoryDetailModal
  - [x] Replace placeholder list with AcceptanceCriteria component
  - [x] Pass story.acceptanceCriteria to component
  - [x] Verify styling consistency
- [x] **Task 8: Run Quality Checks** (AC: All)
  - [x] Run `npm run typecheck`
  - [x] Run `npm run lint`
  - [x] Run `npm test`
  - [x] Run `npm run build`
- [x] **Task 9: Manual Browser Testing** (AC: All)
  - [x] Open story with acceptance criteria
  - [x] Verify Given/When/Then formatting
  - [x] Verify "And" clause indentation
  - [x] Test scrolling with long criteria list
  - [x] Test copy/paste functionality
  - [x] Test empty criteria story

## Dev Notes

### Architecture Compliance Requirements

**From Architecture Document - MUST follow exactly:**

1. **TypeScript Strict Mode** - All code must compile with strict mode enabled
   - All variables must be typed (inferred or explicit)
   - No `any` without explicit cast and justification
   - Array access returns `T | undefined` (noUncheckedIndexedAccess)
2. **Named Exports for Molecules** - Molecules use named exports
   - `export function AcceptanceCriteria() {}`
3. **Path Aliases** - Use `@/*` aliases for all imports
   - `import type { Story } from '@/types/bmad'`
4. **Component Location** - UI molecules go in `src/components/ui/molecules/`
   - This component: `src/components/ui/molecules/AcceptanceCriteria.tsx`
   - Tests: `src/components/ui/molecules/AcceptanceCriteria.test.tsx`
5. **Co-located Tests** - Test files in same directory as source

### Component Implementation Pattern

Production-ready AcceptanceCriteria component implementation provided in Dev Notes.

### BDD Keyword Parsing Strategy

The criteria format from epics/stories uses Given/When/Then/And pattern with markdown bold markers.

### Integration with StoryDetailModal

Update StoryDetailModal to use AcceptanceCriteria component.

### Previous Story Intelligence

**From Story 3.1 (Story Detail Modal):**
Completed Components:

- `src/components/features/stories/StoryDetailModal.tsx` - Modal component
- `src/hooks/accessibility/useFocusTrap.ts` - Focus trap hook
- `src/hooks/accessibility/useFocusReturn.ts` - Focus return hook
- `src/hooks/accessibility/useKeyboardShortcut.ts` - Keyboard handler
  Key Learnings:

1. Named exports for molecules
2. Tailwind CSS for all styling
3. TypeScript strict mode
4. useMemo for parsing memoization
5. Accessibility with proper semantic HTML
   **From Story 2.2 (Story Card Display):**
   Key Learnings:
6. STATUS_LABELS from `@/lib/status-labels`
7. React.memo for performance optimization

### Common Pitfalls to Avoid

1. Wrong Export Style - Molecules use named exports
2. Not Handling Empty Criteria - Always check for empty/undefined
3. Breaking Text Selection - Don't prevent text selection
4. Fixed Height Without Scroll - Long lists must scroll
5. Missing Memoization - Parse complex data with useMemo
6. Hardcoded Keyword Styling - Parse keywords dynamically

### Styling Specifications

- Bold for keywords (Given, When, Then, And)
- slate-700 for content, slate-900 for keywords
- ml-4 for "And" clauses
- space-y-4 between criteria items
- italic text, slate-400 for empty state
- max-h-64 with scroll

### Testing Requirements

Unit tests for:

- AcceptanceCriteria renders criteria array
- Empty/undefined criteria handling
- Given/When/Then keywords are bold
- "And" clauses are indented
- Long criteria lists are scrollable
- Text is selectable for copying

### Project Structure Notes

**Files to Create:**

```
src/components/ui/molecules/
├── AcceptanceCriteria.tsx         # NEW
└── AcceptanceCriteria.test.tsx    # NEW
```

**Files to Update:**

```
src/components/features/stories/
└── StoryDetailModal.tsx           # UPDATE
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.2]
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Structure]
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#Export Patterns]
- [Source: _bmad-output/planning-artifacts/prd.md#Accessibility Requirements]
- [Source: _bmad-output/implementation-artifacts/3-1-story-detail-modal.md#Dev Notes]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4 (claude-3-5-sonnet)

### Debug Log References

None.

### Completion Notes List

1. Implemented AcceptanceCriteria component with BDD-style Given/When/Then formatting
2. Created parseCriterionLines utility to parse markdown bold keywords
3. Integrated component into StoryDetailModal replacing placeholder list
4. All 21 unit tests pass for AcceptanceCriteria component
5. TypeScript type checking passes with no errors
6. Production build succeeds
7. Manual browser testing confirms Given/When/Then formatting works correctly
8. Code review fixes applied: memoized CriterionLine, stable React keys, improved types, enhanced copy tests

### Change Log

- 2025-03-08: Initial implementation completed all 9 tasks
- 2025-03-08: Code review fixes - memoization, stable keys, type safety, enhanced tests

### File List

- src/components/ui/molecules/AcceptanceCriteria.tsx (NEW)
- src/components/ui/molecules/AcceptanceCriteria.test.tsx (NEW)
- src/components/features/stories/StoryDetailModal.tsx (MODIFIED)
- src/components/features/stories/StoryDetailModal.test.tsx (MODIFIED)

## Senior Developer Review (AI)

**Review Date:** 2025-03-08
**Review Outcome:** Approved with fixes applied
**Reviewer Model:** Claude Sonnet 4

### Issues Found

| #   | Severity | Description                                         | Status                         |
| --- | -------- | --------------------------------------------------- | ------------------------------ |
| 1   | HIGH     | AC6: No test verified actual copy behavior          | ✅ Fixed                       |
| 2   | HIGH     | AC5 task claim "header/footer" but no footer exists | 📝 Clarified - refers to modal |
| 3   | MEDIUM   | Unstable React keys using array index               | ✅ Fixed                       |
| 4   | MEDIUM   | Type inconsistency on CriterionLine keyword prop    | ✅ Fixed                       |
| 5   | MEDIUM   | No memoization of CriterionLine component           | ✅ Fixed                       |
| 6   | MEDIUM   | Missing test for mixed markdown/plain keywords      | ✅ Fixed                       |

### Action Items

- [x] [AI-Review][HIGH] Add tests for copy behavior - text selection and content verification
- [x] [AI-Review][MEDIUM] Use stable React keys `${criterion.id}-${idx}` instead of just `idx`
- [x] [AI-Review][MEDIUM] Fix CriterionLine prop type to use ParsedLine['keyword']
- [x] [AI-Review][MEDIUM] Memoize CriterionLine component with React.memo
- [x] [AI-Review][MEDIUM] Add test for mixed markdown and plain keywords
