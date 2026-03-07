# Story 3.2: Acceptance Criteria Display

Status: ready-for-dev

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

- [ ] **Task 1: Create AcceptanceCriteria Component** (AC: 1, 4)
  - [ ] Create `src/components/ui/molecules/AcceptanceCriteria.tsx`
  - [ ] Define props interface: AcceptanceCriteriaProps with criteria: string[]
  - [ ] Create named export function
  - [ ] Add JSDoc documentation

- [ ] **Task 2: Implement BDD Parser** (AC: 1, 2)
  - [ ] Create parseCriteria utility function
  - [ ] Parse Given/When/Then/And keywords from text
  - [ ] Handle case-insensitive keyword matching
  - [ ] Preserve original text formatting
  - [ ] Return structured data for rendering

- [ ] **Task 3: Build Criteria Item Rendering** (AC: 1, 2)
  - [ ] Render each criterion as a list item
  - [ ] Bold/highlight Given/When/Then/And keywords
  - [ ] Apply proper indentation for "And" clauses
  - [ ] Add spacing between criteria
  - [ ] Number or bullet each criterion

- [ ] **Task 4: Handle Empty State** (AC: 3)
  - [ ] Check if criteria array is empty or undefined
  - [ ] Display "No acceptance criteria defined" message
  - [ ] Style message with italics and muted color

- [ ] **Task 5: Implement Scrollable Container** (AC: 5)
  - [ ] Add max-height constraint to criteria container
  - [ ] Apply overflow-y-auto for scrolling
  - [ ] Ensure header/footer remain fixed
  - [ ] Style scrollbar for consistency

- [ ] **Task 6: Create AcceptanceCriteria Test** (AC: All)
  - [ ] Create `src/components/ui/molecules/AcceptanceCriteria.test.tsx`
  - [ ] Test Given/When/Then formatting
  - [ ] Test multiple "And" clause rendering
  - [ ] Test empty criteria handling
  - [ ] Test scrolling for long lists
  - [ ] Test text selection/copy functionality

- [ ] **Task 7: Integrate with StoryDetailModal** (AC: All)
  - [ ] Import AcceptanceCriteria in StoryDetailModal
  - [ ] Replace placeholder list with AcceptanceCriteria component
  - [ ] Pass story.acceptanceCriteria to component
  - [ ] Verify styling consistency

- [ ] **Task 8: Run Quality Checks** (AC: All)
  - [ ] Run `npm run typecheck`
  - [ ] Run `npm run lint`
  - [ ] Run `npm test`
  - [ ] Run `npm run build`

- [ ] **Task 9: Manual Browser Testing** (AC: All)
  - [ ] Open story with acceptance criteria
  - [ ] Verify Given/When/Then formatting
  - [ ] Verify "And" clause indentation
  - [ ] Test scrolling with long criteria list
  - [ ] Test copy/paste functionality
  - [ ] Test empty criteria story

## Dev Notes

### 🔥 CRITICAL: Architecture Compliance Requirements

**From Architecture Document - MUST follow exactly:**

1. **TypeScript Strict Mode** - All code must compile with strict mode enabled
   - All variables must be typed (inferred or explicit)
   - No `any` without explicit cast and justification
   - Array access returns `T | undefined` (noUncheckedIndexedAccess)

2. **Named Exports for Molecules** - Molecules use named exports
   - ✅ `export function AcceptanceCriteria() {}`
   - ❌ `export default function AcceptanceCriteria() {}`

3. **Path Aliases** - Use `@/*` aliases for all imports
   - ✅ `import type { Story } from '@/types/bmad'`
   - ❌ `import type { Story } from '../../../types/bmad'`

4. **Component Location** - UI molecules go in `src/components/ui/molecules/`
   - This component: `src/components/ui/molecules/AcceptanceCriteria.tsx`
   - Tests: `src/components/ui/molecules/AcceptanceCriteria.test.tsx`

5. **Co-located Tests** - Test files in same directory as source

### Component Implementation Pattern

**Production-ready AcceptanceCriteria component:**

```typescript
// src/components/ui/molecules/AcceptanceCriteria.tsx
import { useMemo } from 'react'

interface AcceptanceCriteriaProps {
  criteria: string[]
}

interface ParsedCriterion {
  id: number
  lines: Array<{
    keyword: 'Given' | 'When' | 'Then' | 'And' | null
    text: string
  }>
}

/**
 * Parses BDD-style acceptance criteria and formats for display.
 * Handles Given/When/Then/And keywords with proper styling.
 */
export function AcceptanceCriteria({ criteria }: AcceptanceCriteriaProps) {
  const parsedCriteria = useMemo(() => parseAllCriteria(criteria), [criteria])

  if (!criteria || criteria.length === 0) {
    return (
      <p className="text-slate-400 italic">No acceptance criteria defined</p>
    )
  }

  return (
    <div className="max-h-64 overflow-y-auto pr-2">
      <ol className="list-decimal pl-5 space-y-4">
        {parsedCriteria.map((criterion) => (
          <li key={criterion.id} className="text-slate-700">
            {criterion.lines.map((line, idx) => (
              <CriterionLine
                key={idx}
                keyword={line.keyword}
                text={line.text}
                isNested={line.keyword === 'And'}
              />
            ))}
          </li>
        ))}
      </ol>
    </div>
  )
}

/** Individual criterion line with keyword highlighting */
function CriterionLine({
  keyword,
  text,
  isNested,
}: {
  keyword: string | null
  text: string
  isNested: boolean
}) {
  return (
    <div className={isNested ? 'ml-4' : ''}>
      {keyword && (
        <span className="font-semibold text-slate-900">{keyword} </span>
      )}
      <span>{text}</span>
    </div>
  )
}

/** Parse all criteria strings into structured format */
function parseAllCriteria(criteria: string[]): ParsedCriterion[] {
  return criteria.map((criterion, index) => ({
    id: index,
    lines: parseCriterionLines(criterion),
  }))
}

/** Parse a single criterion into keyword/text pairs */
function parseCriterionLines(criterion: string): ParsedCriterion['lines'] {
  const lines: ParsedCriterion['lines'] = []
  const keywordPattern = /^(Given|When|Then|And)\s+/i

  // Split by newlines and process each line
  const rawLines = criterion.split('\n').filter((line) => line.trim())

  for (const rawLine of rawLines) {
    const match = rawLine.match(keywordPattern)
    if (match) {
      const keyword = match[1] as ParsedCriterion['lines'][0]['keyword']
      const text = rawLine.slice(match[0].length).trim()
      lines.push({ keyword, text })
    } else {
      // No keyword found, treat as continuation text
      lines.push({ keyword: null, text: rawLine.trim() })
    }
  }

  // If no lines were parsed, treat the whole criterion as plain text
  if (lines.length === 0 && criterion.trim()) {
    lines.push({ keyword: null, text: criterion.trim() })
  }

  return lines
}
```

### BDD Keyword Parsing Strategy

**The criteria format from epics/stories uses this pattern:**

```
**Given** some precondition
**When** some action occurs
**Then** expected outcome
**And** additional condition
```

**Parsing approach:**
1. Split criteria by double newlines (separates criteria)
2. For each criterion, identify keyword lines (Given/When/Then/And)
3. Extract text after keyword for rendering
4. Apply indentation for "And" clauses to show hierarchy

**Edge cases to handle:**
- Empty criteria array → show placeholder message
- Criteria without keywords → render as plain text
- Multiple "And" clauses → proper indentation
- Very long single lines → text wrapping

### Integration with StoryDetailModal

**Update StoryDetailModal to use AcceptanceCriteria:**

```typescript
// In StoryDetailModal.tsx, replace the acceptance criteria section:

import { AcceptanceCriteria } from '@/components/ui/molecules/AcceptanceCriteria'

// Inside the modal content:
{story && (
  <>
    {/* ... existing content ... */}

    {/* Acceptance Criteria */}
    <div>
      <h3 className="font-semibold mb-2">Acceptance Criteria</h3>
      <AcceptanceCriteria criteria={story.acceptanceCriteria ?? []} />
    </div>
  </>
)}
```

### Previous Story Intelligence

**From Story 3.1 (Story Detail Modal):**

✅ **Completed Components:**
- `src/components/features/stories/StoryDetailModal.tsx` - Modal component
- `src/hooks/accessibility/useFocusTrap.ts` - Focus trap hook
- `src/hooks/accessibility/useFocusReturn.ts` - Focus return hook
- `src/hooks/accessibility/useKeyboardShortcut.ts` - Keyboard handler

📋 **Key Learnings:**
1. **Named exports for molecules:** This component uses named export
2. **Tailwind CSS:** All styling via Tailwind classes
3. **TypeScript strict:** Handle undefined with nullish coalescing
4. **useMemo for parsing:** Memoize parsed data for performance
5. **Accessibility:** Proper semantic HTML structure

**From Story 2.2 (Story Card Display):**

📋 **Key Learnings:**
1. **STATUS_LABELS:** Import from `@/lib/status-labels` for PO-friendly labels
2. **React.memo:** Use for performance optimization when appropriate

### Common Pitfalls to Avoid

1. **Wrong Export Style** - Molecules use named exports
   - ✅ `export function AcceptanceCriteria() {}`
   - ❌ `export default function AcceptanceCriteria() {}`

2. **Not Handling Empty Criteria** - Always check for empty/undefined
   - ✅ `if (!criteria || criteria.length === 0)`
   - ❌ Assuming criteria always has items

3. **Breaking Text Selection** - Don't prevent text selection
   - ✅ Allow user-select: text (default)
   - ❌ `user-select: none` on criteria text

4. **Fixed Height Without Scroll** - Long lists must scroll
   - ✅ `max-h-64 overflow-y-auto`
   - ❌ Fixed height without overflow handling

5. **Missing Memoization** - Parse complex data with useMemo
   - ✅ `useMemo(() => parseAllCriteria(criteria), [criteria])`
   - ❌ Parsing on every render

6. **Hardcoded Keyword Styling** - Parse keywords dynamically
   - ✅ Match keywords case-insensitively
   - ❌ Assume exact capitalization

### Styling Specifications

**From UX Design Specification:**

- **Font weight:** Bold for keywords (Given, When, Then, And)
- **Text color:** slate-700 for content, slate-900 for keywords
- **Indentation:** ml-4 for "And" clauses
- **Spacing:** space-y-4 between criteria items
- **Empty state:** italic text, slate-400 color
- **Max height:** 16rem (max-h-64) with scroll

### Testing Requirements

**Unit Tests:**
- AcceptanceCriteria renders criteria array
- AcceptanceCriteria shows "No acceptance criteria defined" for empty array
- AcceptanceCriteria shows "No acceptance criteria defined" for undefined
- Given/When/Then keywords are bold
- "And" clauses are indented
- Long criteria lists are scrollable
- Text is selectable for copying

**Test Location:** Co-located with source file (`.test.tsx` extension)

**Test Command:** `npm test`

### Project Structure Notes

**Files to Create:**
```
src/components/ui/molecules/
├── AcceptanceCriteria.tsx         # NEW: Criteria display component
└── AcceptanceCriteria.test.tsx    # NEW: Criteria tests
```

**Files to Update:**
```
src/components/features/stories/
└── StoryDetailModal.tsx           # UPDATE: Use AcceptanceCriteria component
```

**Alignment with Architecture:**
- ✅ Follows component pattern (src/components/ui/molecules/)
- ✅ Uses path aliases (`@/*`)
- ✅ Named exports for molecule components
- ✅ Co-located tests
- ✅ TypeScript strict mode

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.2 - Lines 476-526]
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Structure - Lines 447-474]
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns - Lines 688-710]
- [Source: _bmad-output/planning-artifacts/architecture.md#Export Patterns - Lines 713-722]
- [Source: _bmad-output/planning-artifacts/prd.md#Accessibility Requirements - Lines 564-575]
- [Source: _bmad-output/implementation-artifacts/3-1-story-detail-modal.md#Dev Notes]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

_ _Add debugging notes here during implementation_

### Completion Notes List

_ _Add completion notes here after implementation_

### File List

_ _List all files created/modified during implementation_
