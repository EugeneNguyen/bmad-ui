# Story 1.3: Data Types and State Management

Status: done

## Story

As a **developer,**
I want to define TypeScript types for BMAD data structures and create a React Context provider for data management
so that the application has type-safe data handling and centralized state management across all components.

## Acceptance Criteria

### AC1: TypeScript Type Definitions

**Given** a developer creates `src/types/bmad.ts`
**When** the file is created
**Then** the following types are defined:
- `Story` interface with id, title, description, status, epicId, sprintId, acceptanceCriteria
- `Epic` interface with id, title, description, storyIds
- `SprintStatus` interface with sprintId, name, stories, lastUpdated
- `StoryStatus` type with status values
**And** `STATUS_LABELS` constant maps status to PO-friendly labels

### AC2: React Context Provider

**Given** a developer creates `src/context/BmadDataContext.tsx`
**When** the file is created
**Then** the context provides:
- `stories` array
- `epics` array
- `sprintStatus` object
- `loading` state
- `error` state
- `refetch` function
**And** context integrates with API client

### AC3: Stories Hook

**Given** a developer creates `src/hooks/useStories.ts`
**When** the file is created
**Then** the hook returns:
- `stories` array
- `loading` boolean
- `error` object | null
- `refetch` function
**And** the hook fetches `/api/stories` endpoint

### AC4: Epics Hook

**Given** a developer creates `src/hooks/useEpics.ts`
**When** the file is created
**Then** the hook returns:
- `epics` array
- `loading` boolean
- `error` object | null
- `refetch` function
**And** the hook fetches `/api/epics` endpoint

### AC5: Sprint Status Hook

**Given** a developer creates `src/hooks/useSprintStatus.ts`
**When** the file is created
**Then** the hook returns:
- `sprintStatus` object
- `loading` boolean
- `error` object | null
- `refetch` function
**And** the hook fetches `/api/sprint` endpoint

## Tasks / Subtasks

- [x] **Task 1: Define BMAD TypeScript Types** (AC: 1)
  - [x] Create `src/types/bmad.ts`
  - [x] Define `StoryStatus` type: `'ready' | 'in-dev' | 'ready-for-review' | 'done'`
  - [x] Define `Story` interface with all required fields
  - [x] Define `Epic` interface with all required fields
  - [x] Define `SprintStatus` interface with all required fields
  - [x] Define `STATUS_LABELS` constant mapping to PO-friendly labels
  - [x] Export all types and constants as named exports
  - [x] Add JSDoc comments for each type

- [x] **Task 2: Create API Client Instance** (AC: 2)
  - [x] Create `src/lib/api.ts`
  - [x] Import axios and create instance with baseURL `/api`
  - [x] Set timeout to 5000ms
  - [x] Add response interceptor for structured error handling
  - [x] Transform Axios errors to BmadError instances
  - [x] Export api instance as named export

- [x] **Task 3: Define Error Types** (AC: 2)
  - [x] Create `src/lib/errors.ts`
  - [x] Define `ErrorCode` type union
  - [x] Define `BmadError` class extending Error
  - [x] Implement static `fromAxios` method for error transformation
  - [x] Export all error classes as named exports

- [x] **Task 4: Implement BmadDataContext Provider** (AC: 2)
  - [x] Create `src/context/BmadDataContext.tsx`
  - [x] Define context interface with all required properties
  - [x] Create context with React.createContext
  - [x] Implement BmadDataProvider component
  - [x] Fetch stories, epics, and sprintStatus on mount
  - [x] Provide loading, error, and refetch states
  - [x] Export context, provider, and custom hook

- [x] **Task 5: Implement useStories Hook** (AC: 3)
  - [x] Create `src/hooks/useStories.ts`
  - [x] Use BmadDataContext to access stories
  - [x] Return stories, loading, error, and refetch
  - [x] Add TypeScript return type annotation
  - [x] Export as named export

- [x] **Task 6: Implement useEpics Hook** (AC: 4)
  - [x] Create `src/hooks/useEpics.ts`
  - [x] Use BmadDataContext to access epics
  - [x] Return epics, loading, error, and refetch
  - [x] Add TypeScript return type annotation
  - [x] Export as named export

- [x] **Task 7: Implement useSprintStatus Hook** (AC: 5)
  - [x] Create `src/hooks/useSprintStatus.ts`
  - [x] Use BmadDataContext to access sprintStatus
  - [x] Return sprintStatus, loading, error, and refetch
  - [x] Add TypeScript return type annotation
  - [x] Export as named export

- [x] **Task 8: Create Status Labels Utility** (AC: 1)
  - [x] STATUS_LABELS already defined in `src/types/bmad.ts` (skipped separate file)

- [x] **Task 9: Update App.tsx** (AC: 2)
  - [x] Import BmadDataProvider
  - [x] Wrap main app content with provider
  - [x] Ensure provider is at top level

- [x] **Task 10: Write Unit Tests** (AC: All)
  - [x] Create `src/types/bmad.test.ts` - test type exports
  - [x] Create `src/lib/api.test.ts` - test axios instance
  - [x] Create `src/lib/errors.test.ts` - test error transformation
  - [x] Create `src/context/BmadDataContext.test.tsx` - test provider
  - [x] Test STATUS_LABELS constant usage

- [x] **Task 11: Verify TypeScript Compilation** (AC: All)
  - [x] Run `npm run typecheck` - ensure no errors
  - [x] Verify strict mode compliance
  - [x] Check all types are properly exported

- [x] **Task 12: Test Integration with Existing Code** (AC: 2)
  - [x] Verify context integrates with existing components
  - [x] Test API client with mock server responses
  - [x] Verify error handling works correctly

## Dev Notes

### 🔥 CRITICAL: Architecture Compliance Requirements

**From Architecture Document - MUST follow exactly:**

1. **TypeScript Strict Mode** - All code must compile with strict mode enabled
   - All variables must be typed (inferred or explicit)
   - No `any` without explicit cast and justification
   - Array access returns `T | undefined` (noUncheckedIndexedAccess)

2. **Named Exports** - All utilities, types, and constants use named exports (NOT default)
   - ✅ `export interface Story {}`
   - ✅ `export function useStories() {}`
   - ✅ `export const STATUS_LABELS = {}`
   - ❌ `export default function useStories() {}`

3. **Path Aliases** - Use `@/*` aliases for all imports (no relative paths beyond same directory)
   - ✅ `import { Story } from '@/types/bmad'`
   - ❌ `import { Story } from '../types/bmad'`

4. **Type Definitions** - Match architecture spec exactly (lines 324-359)
   - Use exact field names and types from architecture
   - Don't add or remove fields without justification

5. **Error Handling** - Use BmadError hierarchy (lines 569-606)
   - All API errors must be transformed to BmadError
   - Use specific error codes: PARSE_ERROR, FILE_NOT_FOUND, etc.

6. **Co-located Tests** - Test files in same directory as source
   - `src/types/bmad.test.ts`
   - `src/hooks/useStories.test.ts`

### Technical Stack Details

**Frontend Technologies:**
- React 19 with hooks
- TypeScript 5+ with strict mode
- Axios for HTTP client
- Vite for build tooling

**Type System:**
```typescript
// Exact types from architecture.md (lines 324-359)
export type StoryStatus = 'ready' | 'in-dev' | 'ready-for-review' | 'done'

export interface Story {
  id: string
  title: string
  description: string
  status: StoryStatus
  epicId: string
  sprintId?: string
  acceptanceCriteria: string[]
}

export interface Epic {
  id: string
  title: string
  description: string
  storyIds: string[]
}

export interface SprintStatus {
  sprintId: string
  name: string
  stories: Story[]
  lastUpdated: string
}

export const STATUS_LABELS: Record<StoryStatus, string> = {
  ready: 'Ready to Start',
  'in-dev': 'Being Built',
  'ready-for-review': 'Needs Your Attention',
  done: 'Complete',
}
```

**API Client Pattern:**
```typescript
// src/lib/api.ts (from architecture lines 401-420)
import axios from 'axios'
import { BmadError } from '@/lib/errors'

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

// Response interceptor for structured errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Transform to BmadError
    return Promise.reject(BmadError.fromAxios(error))
  }
)

export default api
```

**Custom Hooks Pattern:**
```typescript
// src/hooks/useStories.ts (from architecture lines 425-442)
import { useState, useEffect } from 'react'
import type { Story } from '@/types/bmad'
import { api } from '@/lib/api'
import { BmadError } from '@/lib/errors'

export function useStories(filters?: StoryFilters): {
  stories: Story[]
  loading: boolean
  error: BmadError | null
  refetch: () => void
} {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<BmadError | null>(null)

  useEffect(() => {
    api
      .get('/api/stories', { params: filters })
      .then((res) => setStories(res.data))
      .catch((err) => setError(BmadError.fromAxios(err)))
      .finally(() => setLoading(false))
  }, [filters])

  return { stories, loading, error, refetch: () => setLoading(true) }
}
```

**Context Provider Pattern:**
```typescript
// src/context/BmadDataContext.tsx (from architecture lines 478-483)
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Story, Epic, SprintStatus } from '@/types/bmad'
import { api } from '@/lib/api'

interface BmadDataContextValue {
  stories: Story[]
  epics: Epic[]
  sprintStatus: SprintStatus | null
  loading: boolean
  error: Error | null
  refetch: () => void
}

const BmadDataContext = createContext<BmadDataContextValue | null>(null)

export function BmadDataProvider({ children }: { children: ReactNode }) {
  const [stories, setStories] = useState<Story[]>([])
  const [epics, setEpics] = useState<Epic[]>([])
  const [sprintStatus, setSprintStatus] = useState<SprintStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [storiesRes, epicsRes, sprintRes] = await Promise.all([
        api.get('/api/stories'),
        api.get('/api/epics'),
        api.get('/api/sprint'),
      ])
      setStories(storiesRes.data)
      setEpics(epicsRes.data)
      setSprintStatus(sprintRes.data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <BmadDataContext.Provider
      value={{
        stories,
        epics,
        sprintStatus,
        loading,
        error,
        refetch: fetchData,
      }}
    >
      {children}
    </BmadDataContext.Provider>
  )
}

export function useBmadData() {
  const context = useContext(BmadDataContext)
  if (!context) {
    throw new Error('useBmadData must be used within BmadDataProvider')
  }
  return context
}
```

### Error Handling Implementation

**BmadError Class:**
```typescript
// src/lib/errors.ts
import { AxiosError } from 'axios'

export type ErrorCode = 'PARSE_ERROR' | 'FILE_NOT_FOUND' | 'VALIDATION_ERROR' | 'NETWORK_ERROR'

export class BmadError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public file?: string,
    public details?: string[]
  ) {
    super(message)
    this.name = 'BmadError'
  }

  static fromAxios(error: AxiosError): BmadError {
    if (error.response) {
      // Server responded with error
      const data = error.response.data as { error?: { code: ErrorCode; message: string; file?: string; details?: string[] } }
      if (data.error) {
        return new BmadError(
          data.error.code,
          data.error.message,
          data.error.file,
          data.error.details
        )
      }
    }
    // Network error or other
    return new BmadError('NETWORK_ERROR', error.message)
  }
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

⚠️ **Common Pitfalls to Avoid:**
- Don't use relative imports - use `@/*` path aliases
- Don't use default exports for utilities - use named exports
- Don't forget TypeScript strict mode - all variables must be typed
- Don't forget `.test.ts` files for every source file
- Don't forget JSDoc comments for exported types

**From Story 1.2 (Server and API Routes):**

✅ **Server Foundation Completed:**
- Express server running on port 3000
- API routes implemented: `/api/stories`, `/api/epics`, `/api/sprint`
- File parsers working: yaml.ts, json.ts, markdown.ts
- Cache manager implemented in server/lib/cache.ts
- BMAD reader working in server/lib/bmad-reader.ts
- Error classes defined in server/lib/errors.ts (server-side)

📋 **Learnings:**
- Server uses relative imports (no path aliases)
- Client uses path aliases (`@/*`)
- Types defined in `src/types/bmad.ts` will be shared (this story)
- Server has temporary types in `server/lib/types.ts` that should be replaced
- API response format: data directly on success, `{ error: {...} }` on failure

⚠️ **Integration Points:**
- This story defines types that server needs (server currently has temp types)
- Context will consume the API routes from Story 1.2
- Error handling must match server's BmadError structure

### Git Intelligence

**Recent Commits:**
- Latest: "Finish PRD" - PRD document completion
- Before: "Init repository with BMAD documentation and configuration files"

**Recent Work Patterns:**
- Planning phase completed (PRD, architecture, epics)
- Ready to begin implementation phase
- Story 1.1 (project init) and Story 1.2 (server/API) in progress

**Files Modified Recently:**
- `_bmad-output/planning-artifacts/prd.md` (latest commit)
- Project structure initialized in earlier commit

**Implementation Insights:**
- Following BMAD workflow: Planning → Implementation
- Stories created in order: 1.1 (project), 1.2 (server), 1.3 (types/state - this story)
- Clear separation between planning artifacts and implementation artifacts

### Web Research - Latest Technical Specifics

**React 19 Hooks:**
- useContext with createContext pattern remains stable
- useEffect cleanup functions important for unmounting
- useState with TypeScript generics for type safety

**TypeScript 5+ Best Practices:**
- `noUncheckedIndexedAccess` prevents array access bugs
- `satisfies` operator for type checking (alternative to `as`)
- Strict mode catches more potential errors
- Named exports preferred for better tree-shaking

**Axios Latest Version:**
- Axios 1.x stable, timeout handling improved
- Interceptors pattern unchanged
- TypeScript types included in package

### UX Design Considerations

**From UX Design Specification:**

1. **Information Hierarchy** - Data structure must support clear visual hierarchy
   - Story → Epic relationship must be clear in types
   - Status values must map to PO-friendly labels (STATUS_LABELS)

2. **PO-Friendly Language** - Critical design principle
   - STATUS_LABELS constant enables translation: `in-dev` → "Being Built"
   - All status displays should use STATUS_LABELS, never raw status values

3. **Performance** - Fast load times essential
   - Context should fetch all data once on mount
   - Avoid unnecessary re-fetches
   - Cache in memory via React state

4. **Error Handling** - Graceful degradation
   - BmadError class provides user-friendly error messages
   - Error state in context enables error boundaries
   - Loading states prevent flash of empty content

5. **Accessibility** - WCAG 2.1 AA compliance
   - Status labels must be readable (not color-only)
   - Error messages must be accessible
   - Loading states must be announced

### Common Pitfalls to Avoid

1. **Wrong Export Style** - Use named exports, not default
   - ✅ `export interface Story {}`
   - ❌ `export default interface Story {}`

2. **Missing Type Exports** - All types must be exported
   - Don't forget to export StoryStatus, ErrorCode, etc.

3. **Path Alias Violations** - Must use `@/*` in client code
   - ✅ `import { Story } from '@/types/bmad'`
   - ❌ `import { Story } from '../types/bmad'`

4. **Missing Error Transformation** - Axios errors must become BmadError
   - Always use BmadError.fromAxios() in interceptor

5. **Missing Null Checks** - Strict mode requires undefined handling
   - sprintStatus can be null initially
   - error can be null
   - Check array access with undefined

6. **Forgetting STATUS_LABELS** - Never use raw status strings in UI
   - Always map through STATUS_LABELS constant
   - This enables PO-friendly language throughout app

7. **Missing Tests** - Every file needs co-located test
   - Don't skip tests for type files
   - Test error transformation logic
   - Test context provider logic

8. **Wrong Context Pattern** - Don't create context without null check
   - Always check useContext result for null
   - Throw descriptive error if used outside provider

9. **Missing JSDoc** - All exported types should have documentation
   - Add JSDoc comments for IntelliSense support
   - Document parameters and return types

10. **Forgetting Refetch** - Context must provide refetch capability
    - Manual refresh requires refetch function
    - Refetch should clear error and set loading

### Project Structure Requirements

**Files to Create:**
```
src/
├── types/
│   ├── bmad.ts           # BMAD type definitions (Story, Epic, etc.)
│   └── bmad.test.ts      # Type export tests
├── lib/
│   ├── api.ts            # Axios instance with interceptors
│   ├── api.test.ts       # API client tests
│   ├── errors.ts         # BmadError class hierarchy
│   ├── errors.test.ts    # Error transformation tests
│   ├── status-labels.ts  # STATUS_LABELS constant
│   └── status-labels.test.ts  # Status labels tests
├── context/
│   ├── BmadDataContext.tsx      # React Context provider
│   └── BmadDataContext.test.tsx # Context tests
└── hooks/
    ├── useStories.ts            # Stories data hook
    ├── useStories.test.ts       # Hook tests
    ├── useEpics.ts              # Epics data hook
    ├── useEpics.test.ts         # Hook tests
    ├── useSprintStatus.ts       # Sprint status hook
    └── useSprintStatus.test.ts  # Hook tests
```

**File to Update:**
```
src/App.tsx  # Wrap with BmadDataProvider
```

### Testing Requirements

**Unit Tests:**
- Type definitions export correctly
- API client creates axios instance properly
- Error transformation handles all error types
- STATUS_LABELS maps all status values
- Context provides all required values
- Hooks return correct data structure
- Null checks work correctly

**Integration Tests:**
- Context fetches from API on mount
- Refetch triggers new API call
- Error handling works with real errors
- Loading states work correctly

**Test Location:** Co-located with source files (`.test.ts` extension)

### Performance Considerations

**Context Optimization:**
- Fetch all data once on mount (not per hook)
- Use Promise.all for parallel requests
- Avoid unnecessary re-renders with proper memoization
- Cache in React state (no external cache needed)

**Loading States:**
- Single loading state for all data
- Show loading immediately on mount
- Clear loading after all requests complete
- Refetch should set loading true then false

**Error Handling:**
- Single error state for context
- Clear error on refetch
- Don't block entire UI on single data failure
- Log errors to console for debugging

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Data Architecture - Lines 296-368]
- [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns - Lines 389-442]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture - Lines 444-506]
- [Source: _bmad-output/planning-artifacts/architecture.md#Error Handling - Lines 566-642]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns - Lines 686-926]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.3 - Lines 161-193]
- [Source: _bmad-output/planning-artifacts/prd.md#PO-Friendly Language - Multiple references]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Design Principles]
- [Source: _bmad-output/implementation-artifacts/1-2-server-and-api-routes.md#Dev Notes]

## Dev Agent Record

### Agent Model Used

zai-coding-plan/glm-5

### Debug Log References

None - implementation completed without blocking issues.

### Completion Notes List

- Successfully implemented all TypeScript types in `src/types/bmad.ts`
- Created API client with axios instance and error interceptor in `src/lib/api.ts`
- Implemented BmadError class with `fromAxios` static method in `src/lib/errors.ts`
- Created BmadDataContext provider with parallel data fetching in `src/context/BmadDataContext.tsx`
- Implemented three hooks: useStories, useEpics, useSprintStatus in `src/hooks/`
- Wrapped App.tsx with BmadDataProvider
- All 73 tests pass (including existing server tests)
- TypeScript compilation successful with strict mode
- Added vitest path alias configuration for `@/*` imports

### File List

**New Files:**
- `src/types/bmad.ts` - TypeScript type definitions with JSDoc (Story, Epic, SprintStatus, StoryStatus, STATUS_LABELS)
- `src/types/bmad.test.ts` - Type definition tests
- `src/lib/api.ts` - Axios instance with interceptors
- `src/lib/api.test.ts` - API client tests
- `src/lib/errors.ts` - BmadError class with fromAxios transformation
- `src/lib/errors.test.ts` - Error transformation tests
- `src/context/BmadDataContext.tsx` - React Context provider for BMAD data (exports: BmadDataContext, BmadDataProvider, useBmadData)
- `src/context/BmadDataContext.test.tsx` - Context provider tests with error/refetch coverage
- `src/hooks/useStories.ts` - Hook to access stories from context (with explicit return type)
- `src/hooks/useStories.test.ts` - Hook tests
- `src/hooks/useEpics.ts` - Hook to access epics from context (with explicit return type)
- `src/hooks/useEpics.test.ts` - Hook tests
- `src/hooks/useSprintStatus.ts` - Hook to access sprintStatus from context (with explicit return type)
- `src/hooks/useSprintStatus.test.ts` - Hook tests

**Modified Files:**
- `src/App.tsx` - Wrapped with BmadDataProvider
- `vitest.config.ts` - Added path alias configuration for `@/*`

### Change Log

- 2026-03-07: Implemented Story 1.3 - Data Types and State Management
- 2026-03-07: Code review fixes applied - added missing hook tests, JSDoc comments, exported context, explicit return types, error/refetch tests

## Senior Developer Review (AI)

**Review Date:** 2026-03-07
**Reviewer:** Code Review Workflow
**Outcome:** Approved with Fixes

### Action Items

- [x] **[HIGH]** Create missing hook test files (src/hooks/*.test.ts)
- [x] **[HIGH]** Add JSDoc comments to types (src/types/bmad.ts)
- [x] **[HIGH]** Export BmadDataContext from context module
- [x] **[HIGH]** Add explicit return types to hooks (useStories, useEpics, useSprintStatus)
- [x] **[MEDIUM]** Add error handling test to context (BmadDataContext.test.tsx)
- [x] **[MEDIUM]** Add refetch functionality test to context (BmadDataContext.test.tsx)

### Review Summary

All acceptance criteria met. Issues found during adversarial review have been fixed. Story approved for completion.
