# Story 2.2: Story Card Display

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **product owner,**
I want to see story cards with key information at a glance,
so that I can quickly understand what each story is about without opening it.

## Acceptance Criteria

### AC1: Story Card Content

**Given** a product owner views a lane with stories
**When** story cards are displayed
**Then** each card shows:
- Story title (truncated if > 60 characters with ellipsis)
- Story ID (e.g., "Story 2.1")
- Epic reference (e.g., "Epic 2")
- Status badge with PO-friendly label
- Color-coded status indicator
**And** cards are arranged vertically within the lane
**And** cards have consistent height and spacing
**And** cards are visually distinct from each other

### AC2: Hover Effects

**Given** a product owner hovers over a story card
**When** the mouse enters the card
**Then** the card displays a subtle shadow or elevation change
**And** the cursor changes to pointer
**And** a tooltip shows full title if truncated

### AC3: Status Badge Display

**Given** a product owner views a story card
**When** they see the status badge
**Then** the badge displays PO-friendly text from STATUS_LABELS
**And** badge color matches status:
- "Ready to Start" → gray/blue (bg-slate-100, bg-blue-100)
- "Being Built" → yellow/orange (bg-amber-100, bg-orange-100)
- "Needs Your Attention" → purple/blue (bg-violet-100, bg-indigo-100)
- "Complete" → green (bg-green-100)
**And** badge is positioned at top-right of card

### AC4: Component Implementation

**Given** a developer implements the StoryCard component
**When** the component renders
**Then** it uses Tailwind CSS for styling
**And** follows atomic design pattern (molecule component)
**And** exports as default from `src/components/ui/molecules/StoryCard.tsx`
**And** accepts `story` and optional `epic` as props
**And** is clickable (for future Story 3.1 - detail modal)

### AC5: Performance

**Given** a product owner views the board with many stories
**When** 100+ stories are displayed
**Then** all cards render in < 1 second
**And** scrolling is smooth (60fps)
**And** no layout thrashing occurs

### AC6: Accessibility

**Given** a product owner uses keyboard navigation
**When** they Tab through story cards
**Then** each card is focusable
**And** focus order follows visual order
**And** focused card has visible focus ring (focus:ring-2)
**And** pressing Enter on focused card triggers detail view (future Story 3.1)

## Tasks / Subtasks

- [ ] **Task 1: Create Badge Atom Component** (AC: 3, 4)
  - [ ] Create `src/components/ui/atoms/Badge.tsx`
  - [ ] Define BadgeProps interface: children, variant (colors)
  - [ ] Implement color variants: slate, amber, violet, green
  - [ ] Style with Tailwind CSS: px-2.5 py-0.5 rounded-full text-xs font-medium
  - [ ] Export as default
  - [ ] Create `src/components/ui/atoms/Badge.test.tsx`
  - [ ] Test all color variants render correctly

- [ ] **Task 2: Create StoryCard Component** (AC: 1, 2, 4, 5, 6)
  - [ ] Create `src/components/ui/molecules/StoryCard.tsx`
  - [ ] Define StoryCardProps interface: story, epic?, onClick?
  - [ ] Import Story type from `@/types/bmad`
  - [ ] Import STATUS_LABELS from `@/lib/status-labels`
  - [ ] Import Badge component from `@/components/ui/atoms/Badge`
  - [ ] Implement title truncation: line-clamp-1 + truncate (single line, 60 char limit)
  - [ ] Display story ID in format "Story X.Y"
  - [ ] Display epic reference in format "Epic X"
  - [ ] Map status to Badge variant and PO-friendly label using STATUS_LABELS
  - [ ] Implement hover effects: hover:shadow-xl hover:scale-[1.02] transition-all duration-300
  - [ ] Add tooltip for truncated titles using native title attribute
  - [ ] Make card focusable with tabIndex={0}
  - [ ] Add ARIA attributes: role="listitem", aria-label with story title and status
  - [ ] Add visible focus ring using Tailwind focus:ring-2 focus:ring-blue-500
  - [ ] Style with Tailwind: bg-white rounded-lg p-4 shadow-md min-h-[120px]
  - [ ] Export as default
  - [ ] Wrap with React.memo for performance optimization
  - [ ] Add displayName: 'StoryCard'
  - [ ] Create `src/components/ui/molecules/StoryCard.test.tsx`

- [ ] **Task 3: Update Lane Component** (AC: 1, 4)
  - [ ] Import StoryCard component into Lane.tsx
  - [ ] Pass story and epic data to StoryCard as props
  - [ ] Add onClick handler placeholder for future story detail integration
  - [ ] Ensure proper key prop (story.id) for React list rendering
  - [ ] Render StoryCard components within lane

- [ ] **Task 4: Create StoryCard Tests** (AC: All)
  - [ ] Test title truncation (short and long titles > 60 chars)
  - [ ] Test story ID display ("Story X.Y" format)
  - [ ] Test epic reference display ("Epic X" format)
  - [ ] Test status badge with correct label and color for each status
  - [ ] Test hover effects (shadow-xl, scale, cursor)
  - [ ] Test accessibility attributes (role, aria-label)
  - [ ] Test focus behavior (tabIndex, focus ring)
  - [ ] Test React.memo optimization (no unnecessary re-renders)

- [ ] **Task 5: Manual Browser Testing** (AC: 1, 2, 5, 6)
  - [ ] Start dev server: `npm run dev`
  - [ ] Open browser to http://localhost:3000
  - [ ] Verify story cards render with all required information
  - [ ] Test hover effects (shadow change, scale, cursor)
  - [ ] Test keyboard navigation with Tab
  - [ ] Test focus ring visibility
  - [ ] Test with 100+ stories (if available)
  - [ ] Verify smooth scrolling performance

- [ ] **Task 6: Run Type Check and Build** (AC: All)
  - [ ] Run `npm run typecheck`
  - [ ] Verify no TypeScript errors
  - [ ] Run `npm run build`
  - [ ] Verify build succeeds
  - [ ] Run `npm test`
  - [ ] Verify all tests pass

## Dev Notes

### Architecture Compliance Requirements

**CRITICAL: Follow architecture patterns exactly**

**Component Location:**
- StoryCard MUST be in `src/components/ui/molecules/StoryCard.tsx`
- This is Layer 1 (Generic UI), NOT Layer 2 (Features)
- Different from Story 2.1 components which are in `src/components/features/kanban/`

**TypeScript Strict Mode:**
- All variables must be typed (inferred or explicit)
- No `any` types without justification
- Use proper Story and Epic types from `@/types/bmad`
- TypeScript strict mode is enabled (checked via `tsc --noEmit`)

**Import Patterns:**
- MUST use path aliases `@/*` for all imports
- ✅ `import { Story } from '@/types/bmad'`
- ✅ `import Badge from '@/components/ui/atoms/Badge'`
- ❌ `import { Story } from '../types/bmad'` (relative imports)

**Export Patterns:**
- Components: Default export (`export default function StoryCard() {}`)
- Utilities: Named export (`export const STATUS_LABELS = {}`)
- Types: Named export (`export interface Story {}`)

**Tailwind CSS:**
- Use Tailwind utility classes for all styling
- No custom CSS files unless absolutely necessary
- Follow responsive patterns from Story 2.1

**Testing:**
- Co-located tests (`.test.tsx` extension in same directory)
- Use Vitest + Testing Library
- Test all acceptance criteria
- Tests should be fast and reliable

### STATUS_LABELS Integration

**StoryCard MUST use STATUS_LABELS constant for PO-friendly status display:**

```typescript
// From @/lib/status-labels.ts (will be created in Story 1.3 or 2.1)
export const STATUS_LABELS: Record<StoryStatus, string> = {
  ready: 'Ready to Start',
  'in-dev': 'Being Built',
  'ready-for-review': 'Needs Your Attention',
  done: 'Complete',
}
```

**Usage in StoryCard:**
```typescript
const statusLabel = STATUS_LABELS[story.status]
```

**If STATUS_LABELS doesn't exist:** Create it in `src/lib/status-labels.ts` as referenced in architecture.md.

### Status Badge Colors (Research-Based)

**Production-proven color mappings from research:**

| Story Status | Badge Color | Tailwind Classes | PO-Friendly Label |
|-------------|-------------|-------------------|-------------------|
| `ready` | slate/blue | `bg-slate-500 text-white` OR `bg-slate-100 text-slate-700` | Ready to Start |
| `in-dev` | amber/orange | `bg-amber-500 text-white` OR `bg-amber-100 text-amber-700` | Being Built |
| `ready-for-review` | violet/purple | `bg-violet-600 text-white` OR `bg-violet-100 text-violet-700` | Needs Your Attention |
| `done` | green | `bg-emerald-500 text-white` OR `bg-green-100 text-green-700` | Complete |

**Badge base styling:**
```tsx
<span className="px-2.5 py-0.5 rounded-full text-xs font-medium">
  {statusLabel}
</span>
```

**For lighter appearance:** Use `bg-{color}-100 text-{color}-700` (soft background)
**For bolder appearance:** Use `bg-{color}-500 text-white` (solid background)

### Tailwind Hover Effects (Research-Based)

**Production pattern from research:**

```tsx
<div className="
  bg-white 
  rounded-lg 
  p-4 
  shadow-md
  hover:shadow-xl 
  hover:scale-[1.02]
  transition-all 
  duration-300 
  cursor-pointer
">
  {/* Card content */}
</div>
```

**Key classes:**
- `shadow-md` → `hover:shadow-xl` (elevation change)
- `hover:scale-[1.02]` (subtle lift effect)
- `transition-all duration-300` (smooth animation)
- `cursor-pointer` (pointer cursor on hover)

**Alternative: Specific property transition (better performance)**
```tsx
className="transition-shadow duration-300 hover:shadow-xl"
```

### Title Truncation (Research-Based)

**Tailwind 4 has line-clamp built-in (no plugin needed):**

**Single-line truncation with ellipsis:**
```tsx
<h3 className="line-clamp-1 text-sm font-semibold text-gray-900">
  {story.title}
</h3>
```

**With max-width and overflow:**
```tsx
<h3 className="
  truncate 
  max-w-xs 
  text-sm 
  font-semibold 
  text-gray-900
">
  {story.title}
</h3>
```

**Native tooltip for truncated text:**
```tsx
<h3 
  className="line-clamp-1"
  title={story.title} // Shows full title on hover
>
  {story.title}
</h3>
```

### Performance Optimization (Research-Based)

**React.memo pattern from production code:**

```typescript
import { memo } from 'react'

const StoryCard = memo(function StoryCard({ story, epic, onClick }: StoryCardProps) {
  return (
    <div className="...">
      {/* Card content */}
    </div>
  )
})

StoryCard.displayName = 'StoryCard'

export default StoryCard
```

**Benefits:**
- Prevents unnecessary re-renders
- Optimizes rendering of 100+ cards
- Memo comparison only compares props by reference

**When to use:**
- ✅ For components in large lists (100+ items)
- ✅ For components with stable props (story object reference)
- ❌ For simple components with cheap re-renders

### Accessibility Requirements

**Keyboard Navigation:**
- Make card focusable: `tabIndex={0}`
- Focus order follows visual order (left-to-right, top-to-bottom)
- Visible focus ring: `focus:ring-2 focus:ring-blue-500`
- Enter key triggers detail view (future Story 3.1)

**ARIA Attributes:**
```tsx
<div
  role="listitem"
  aria-label={`${story.title} - ${STATUS_LABELS[story.status]}`}
  tabIndex={0}
>
  {/* Card content */}
</div>
```

**Focus Management:**
- Focus should be visible when card is focused
- Focus ring should have sufficient contrast (WCAG 2.1 AA: 4.5:1)
- Use Tailwind's built-in focus utilities

**Screen Reader Support:**
- Semantic HTML (role="listitem")
- aria-label announces story title and status
- Optional aria-describedby for additional context

### Previous Story Intelligence (Story 2.1)

**From Story 2.1 Dev Notes:**

✅ **Story 2.1 Status:** `ready-for-dev` (not yet implemented)

📋 **Key Learnings:**
1. **Component Location:** Story 2.1 creates components in `src/components/features/kanban/` (Layer 2). StoryCard should be in `src/components/ui/molecules/` (Layer 1).
2. **STATUS_LABELS:** Critical for consistent PO-friendly language across the app
3. **Memoization:** Use useMemo for story filtering in KanbanBoard
4. **Path Aliases:** Always use `@/*` for imports
5. **TypeScript Strictness:** No `any` types, explicit typing for all props
6. **Tailwind Classes:** Use utility classes, avoid custom CSS
7. **Co-located Tests:** Tests in same directory as source files
8. **Default Exports:** Components use default export

⚠️ **Integration Points:**
- StoryCard will be imported into Lane.tsx
- StoryCard uses STATUS_LABELS from Story 1.3/2.1
- StoryCard uses Story type from `@/types/bmad`
- StoryCard follows Tailwind patterns from Story 2.1

### Implementation Patterns to Follow

**Atomic Design Pattern:**
- **Atoms:** Smallest reusable units (Badge, Button, Icon)
- **Molecules:** Combinations of atoms (StoryCard = title + ID + badge)
- **Organisms:** Complex feature components (KanbanBoard, Lane)
- **Features:** Domain-specific components

**StoryCard fits in Molecule layer** because:
- ✅ Combines atoms (Badge for status)
- ✅ Reusable, generic component
- ✅ No BMAD-specific business logic
- ✅ Can be reused across different features

**Export Pattern:**
- Components: Default export (`export default function StoryCard() {}`)
- Utilities: Named export (`export const STATUS_LABELS = {}`)
- Types: Named export (`export interface Story {}`)

### Project Structure Notes

**Files to Create:**
```
src/components/ui/
├── atoms/
│   ├── Badge.tsx                # NEW: Status badge component
│   └── Badge.test.tsx           # NEW: Badge tests
└── molecules/
    ├── StoryCard.tsx            # NEW: Story card component
    └── StoryCard.test.tsx       # NEW: StoryCard tests
```

**Files to Update:**
```
src/components/features/kanban/
└── Lane.tsx                     # UPDATE: Import and use StoryCard
```

**Import Paths:**
- Use `@/` path aliases for all imports
- `@/types/bmad` for Story and Epic types
- `@/lib/status-labels` for STATUS_LABELS
- `@/components/ui/atoms/Badge` for Badge component

**Alignment with Architecture:**
- ✅ Follows atomic design pattern (ui/molecules/)
- ✅ Uses path aliases (`@/*`)
- ✅ Named exports for utilities, default for components
- ✅ Co-located tests
- ✅ Tailwind CSS for styling
- ✅ TypeScript strict mode

### Testing Requirements

**Unit Tests:**
- Badge renders with correct color variants
- StoryCard title truncation (short and long titles)
- StoryCard displays story ID in "Story X.Y" format
- StoryCard displays epic reference in "Epic X" format
- StoryCard shows correct status badge with label and color
- StoryCard hover effects (shadow, scale, cursor)
- StoryCard accessibility attributes (role, aria-label)
- StoryCard focus behavior (tabIndex, focus ring)
- StoryCard React.memo optimization (no unnecessary re-renders)

**Test Location:** Co-located with source files (`.test.tsx` extension)

**Test Command:** `npm test`

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.2 - Lines 275-332]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture - Lines 444-506]
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Structure - Lines 166-233]
- [Source: _bmad-output/planning-artifacts/architecture.md#Export Patterns - Lines 713-722]
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns - Lines 688-710]
- [Source: _bmad-output/planning-artifacts/architecture.md#Test Location - Lines 806-830]
- [Source: _bmad-output/planning-artifacts/architecture.md#TypeScript Strictness - Lines 832-855]
- [Source: _bmad-output/planning-artifacts/architecture.md#Performance Requirements - Lines 162-180]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Design Principles]
- [Source: _bmad-output/implementation-artifacts/2-1-kanban-board-layout.md#Dev Notes]
- [Source: Production Tailwind patterns research - hover effects, line-clamp, badges, React.memo]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

_ _Add debugging notes here during implementation_

### Completion Notes List

_ _Add completion notes here after implementation_

### File List

_ _List all files created/modified during implementation_
