---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-03-07'
inputDocuments:
  - prd.md
  - product-brief-bmad-ui-2026-03-06.md
  - prd-validation-report.md
workflowType: 'architecture'
project_name: 'bmad-ui'
user_name: 'Eugene'
date: '2026-03-07'
additionalContext:
  distribution: 'npm package via npx'
  deployment: 'local machine execution'
  frontend: 'React'
  coreFunction: 'read local BMAD files and display results'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (26 total):**

| Category                   | Count | Architectural Impact                                      |
| -------------------------- | ----- | --------------------------------------------------------- |
| Sprint Visualization       | 5     | Core UI — Kanban board with lanes, epic grouping, filters |
| Story Discovery            | 4     | Modal/panel system for story details, acceptance criteria |
| Sprint Navigation          | 3     | Epic navigation, backlog view, change detection           |
| Project Setup & Access     | 5     | CLI entry point, local server, zero-config                |
| Board Presentation         | 3     | Screenshot-ready UI, multi-instance support               |
| Story Management (Phase 2) | 3     | Deferred — CRUD operations for stories                    |
| Test & Release (Phase 3)   | 3     | Deferred — evidence viewing, staging integration          |

**MVP Scope:** 20 FRs | **Post-MVP:** 6 FRs

**Non-Functional Requirements (24 total):**

| Category      | Critical NFRs                                                   |
| ------------- | --------------------------------------------------------------- |
| Performance   | FCP < 1s, TTI < 2s, popup < 200ms, bundle < 5MB, memory < 200MB |
| Accessibility | WCAG 2.1 AA, keyboard nav, screen reader, 4.5:1 contrast        |
| Integration   | Parse YAML/JSON/Markdown, handle 5+ project structures          |
| Reliability   | 99.9% parse success, zero data loss, browser compat             |
| Usability     | Zero-config, 5-min learning curve, actionable errors            |

**Scale & Complexity:**

- Primary domain: Full-stack web application (npm-distributed, local execution)
- Complexity level: Medium
- Estimated architectural components:
  - Frontend: ~15-20 React components
  - Backend: 3-5 Express routes
  - Parsers: 3 format handlers (YAML, JSON, Markdown)

### Technical Constraints & Dependencies

| Constraint                 | Implication                                                             |
| -------------------------- | ----------------------------------------------------------------------- |
| `npx bmad-ui` distribution | Must bundle React build + Express + all parsers in single npm package   |
| Local execution only       | No cloud services, no database, no authentication                       |
| Reads BMAD files from CWD  | Server must detect project root, scan `_bmad-output/` directory         |
| Manual refresh workflow    | No WebSockets, no file watching — user git pulls then refreshes browser |
| React SPA                  | Client-side rendering, Express serves static build                      |
| Zero configuration         | No config files, auto-detect BMAD project structure                     |

**Technology Decisions (from PRD):**

| Component    | Technology                 | Status               |
| ------------ | -------------------------- | -------------------- |
| Frontend     | React                      | Confirmed by user    |
| Backend      | Express.js                 | Pre-selected in PRD  |
| Distribution | npm package                | Confirmed by user    |
| Data Parsing | YAML/JSON/Markdown parsers | Required by NFR12-14 |

### Cross-Cutting Concerns Identified

1. **Error Handling**
   - Malformed BMAD files must fail gracefully (NFR16)
   - User-friendly error messages, not stack traces
   - Affects: Parser layer, API routes, UI error boundaries

2. **Accessibility (WCAG 2.1 AA)**
   - Keyboard navigation throughout
   - ARIA labels on all interactive elements
   - 4.5:1 color contrast minimum
   - Affects: All UI components, design system

3. **PO-Friendly Language Mapping**
   - Status translation: `in-dev` → "Being Built", `ready-for-review` → "Needs Your Attention"
   - Consistent across board, filters, details
   - Affects: Status display components, filter labels

4. **Bundle Size Optimization**
   - Target: < 5MB total package
   - Requires tree-shaking, minimal dependencies
   - Affects: Dependency selection, build configuration

5. **Caching Strategy**
   - Parse once, cache in memory for session
   - Re-parse on manual refresh
   - Affects: API design, state management

## Starter Template Evaluation

### Primary Technology Domain

**Hybrid Architecture**: npm-distributed package bundling React SPA + Express.js server

This is a specialized architecture for CLI tools that serve local web interfaces — similar to `vite`, `webpack-dev-server`, or `create-react-app`.

### Starter Options Evaluated

| Option                    | Assessment                                     | Verdict        |
| ------------------------- | ---------------------------------------------- | -------------- |
| Vite + React + TypeScript | Fast builds, optimized output, excellent DX    | ✅ Selected    |
| Create React App          | Deprecated, slow builds, maintenance ended     | ❌ Avoid       |
| Next.js                   | Overkill — no SSR/routing needed for local app | ❌ Overkill    |
| Custom Webpack setup      | Complex, slow, high maintenance burden         | ❌ Unnecessary |

### Selected Approach: Vite + React + TypeScript + Express + Tailwind

**Rationale:**

- **Vite** provides the fastest development experience and smallest production builds
- **TypeScript (strict)** ensures type safety and better maintainability
- **Express 5** is minimal and well-suited for a local file-serving server
- **Tailwind CSS** enables rapid UI development with minimal bundle impact
- **Custom npm package structure** purpose-built for `npx bmad-ui` distribution

### Initialization Commands

```bash
# Create Vite React TypeScript project
npm create vite@latest bmad-ui -- --template react-ts

cd bmad-ui

# Install Tailwind CSS
npm install -D tailwindcss @tailwindcss/vite

# Install Express and server dependencies
npm install express axios
npm install -D @types/express tsx

# Install BMAD file parsers
npm install js-yaml gray-matter
npm install -D @types/js-yaml

# Install development tools
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D eslint prettier eslint-config-prettier
npm install -D concurrently
```

### Project Structure

```
bmad-ui/
├── src/                        # React frontend
│   ├── components/
│   │   ├── ui/                # Layer 1: Generic UI (Atomic structure)
│   │   │   ├── atoms/         # Smallest units
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Icon.tsx
│   │   │   │   └── Spinner.tsx
│   │   │   └── molecules/     # Combinations of atoms
│   │   │       ├── Modal.tsx
│   │   │       ├── Card.tsx
│   │   │       └── Dropdown.tsx
│   │   ├── features/          # Layer 2: BMAD Domain
│   │   │   ├── board/
│   │   │   │   ├── KanbanBoard.tsx
│   │   │   │   ├── Lane.tsx
│   │   │   │   └── StoryCard.tsx
│   │   │   ├── stories/
│   │   │   │   ├── StoryDetail.tsx
│   │   │   │   └── AcceptanceCriteria.tsx
│   │   │   └── filters/
│   │   │       ├── SprintFilter.tsx
│   │   │       └── EpicFilter.tsx
│   │   └── layout/
│   │       ├── AppLayout.tsx
│   │       └── ErrorBoundary.tsx
│   ├── hooks/
│   │   ├── accessibility/     # ARIA utility hooks
│   │   │   ├── useFocusTrap.ts
│   │   │   ├── useAnnounce.ts
│   │   │   ├── useKeyboardShortcut.ts
│   │   │   └── useFocusReturn.ts
│   │   ├── useStories.ts
│   │   ├── useEpics.ts
│   │   └── useSprintStatus.ts
│   ├── lib/
│   │   ├── api.ts             # Axios instance + interceptors
│   │   └── errors.ts          # BmadError classes
│   ├── context/
│   │   └── BmadDataContext.tsx
│   ├── types/
│   │   └── bmad.ts            # BMAD type definitions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css              # Tailwind imports
├── server/                     # Express backend
│   ├── index.ts               # Server entry + CLI launcher
│   ├── routes/
│   │   ├── stories.ts
│   │   ├── epics.ts
│   │   └── sprint.ts
│   └── lib/
│       ├── bmad-reader.ts     # File system reader
│       ├── parsers/           # Format-specific parsers
│       │   ├── yaml.ts
│       │   ├── json.ts
│       │   └── markdown.ts
│       └── cache.ts           # In-memory cache
├── public/                     # Static assets
├── dist/                       # Production build output
├── package.json
├── vite.config.ts
├── tsconfig.json              # TypeScript (frontend)
├── tsconfig.server.json       # TypeScript (server)
├── tailwind.config.ts
├── eslint.config.js
└── prettier.config.js
```

### Key Package.json Scripts

```json
{
  "name": "bmad-ui",
  "version": "0.1.0",
  "type": "module",
  "bin": {
    "bmad-ui": "./dist/server/index.js"
  },
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:client": "vite",
    "dev:server": "tsx watch server/index.ts",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build",
    "build:server": "tsc -p tsconfig.server.json",
    "preview": "node dist/server/index.js",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "test": "vitest",
    "test:run": "vitest run",
    "typecheck": "tsc --noEmit"
  }
}
```

**Note:** Project initialization using this stack should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):** ✅ All resolved

| Decision         | Choice                              | Rationale                              |
| ---------------- | ----------------------------------- | -------------------------------------- |
| State Management | React hooks only                    | View-only app, no complex state needs  |
| API Client       | Axios                               | Auto-transforms, better error handling |
| Error Handling   | Structured types + Error Boundaries | Predictable patterns for AI agents     |
| File Parsers     | js-yaml + gray-matter + native JSON | Minimal dependencies, proven libraries |

**Important Decisions (Shape Architecture):** ✅ All resolved

| Decision               | Choice                        | Rationale                       |
| ---------------------- | ----------------------------- | ------------------------------- |
| Component Architecture | Atomic + Layered hybrid       | Clear structure for AI agents   |
| Accessibility          | Tailwind + Custom ARIA hooks  | WCAG 2.1 AA, minimal bundle     |
| Caching Strategy       | Server memory + React Context | Session-scoped, zero complexity |

**Deferred Decisions (Post-MVP):**

| Decision                       | Reason for Deferral               |
| ------------------------------ | --------------------------------- |
| Real-time Updates (WebSockets) | Manual refresh sufficient for MVP |
| File Watching                  | Adds complexity, user can refresh |
| Story Editing (CRUD)           | Phase 2 feature                   |
| Test Evidence Integration      | Phase 3 feature                   |

### Data Architecture

**Data Flow:**

```
BMAD Files (YAML/JSON/Markdown)
        ↓
    File Parser (server)
        ↓
    In-Memory Cache
        ↓
    Express API (/api/*)
        ↓
    React Context (client)
        ↓
    Components (props)
```

**Parser Libraries:**

| Format                      | Library           | Version | Bundle Impact |
| --------------------------- | ----------------- | ------- | ------------- |
| YAML                        | js-yaml           | ^4.1.0  | ~50KB         |
| Markdown (YAML frontmatter) | gray-matter       | ^4.0.0  | ~40KB         |
| JSON                        | Native JSON.parse | —       | 0KB           |

**Data Types:**

```typescript
// src/types/bmad.ts
interface Story {
  id: string
  title: string
  description: string
  status: StoryStatus
  epicId: string
  sprintId?: string
  acceptanceCriteria: string[]
}

interface Epic {
  id: string
  title: string
  description: string
  storyIds: string[]
}

interface SprintStatus {
  sprintId: string
  name: string
  stories: Story[]
  lastUpdated: string
}

type StoryStatus = 'ready' | 'in-dev' | 'ready-for-review' | 'done'

// PO-friendly status mapping
const STATUS_LABELS: Record<StoryStatus, string> = {
  ready: 'Ready to Start',
  'in-dev': 'Being Built',
  'ready-for-review': 'Needs Your Attention',
  done: 'Complete',
}
```

**Caching Strategy:**

| Layer               | Scope            | Invalidation                    |
| ------------------- | ---------------- | ------------------------------- |
| Server Memory       | Process lifetime | Server restart / manual restart |
| React Context       | Component tree   | Browser refresh / manual reload |
| None (localStorage) | —                | Deferred — adds complexity      |

### Authentication & Security

**Not Applicable** — Local execution only:

| Aspect          | Decision                        |
| --------------- | ------------------------------- |
| Authentication  | None — runs on localhost        |
| Authorization   | None — single user, local files |
| API Security    | None — no external access       |
| Data Encryption | None — reads local files only   |

**Security Considerations:**

- Tool only reads files within BMAD project directory
- No network requests to external servers
- No data sent outside local machine
- User controls access via file system permissions

### API & Communication Patterns

**API Architecture:** RESTful endpoints served by Express

| Endpoint               | Method | Description                       |
| ---------------------- | ------ | --------------------------------- |
| `GET /api/stories`     | GET    | All stories with optional filters |
| `GET /api/stories/:id` | GET    | Single story details              |
| `GET /api/epics`       | GET    | All epics                         |
| `GET /api/epics/:id`   | GET    | Single epic with stories          |
| `GET /api/sprint`      | GET    | Current sprint status             |
| `POST /api/refresh`    | POST   | Force re-parse of BMAD files      |

**API Client:** Axios with custom instance

```typescript
// src/lib/api.ts
import axios from 'axios'

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
// src/hooks/useStories.ts
export function useStories(filters?: StoryFilters) {
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

### Frontend Architecture

**Component Structure:** Atomic + Layered Hybrid

```
src/components/
├── ui/                          # Layer 1: Generic UI (Atomic)
│   ├── atoms/
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Icon.tsx
│   │   └── Spinner.tsx
│   └── molecules/
│       ├── Modal.tsx
│       ├── Card.tsx
│       └── Dropdown.tsx
├── features/                    # Layer 2: BMAD Domain
│   ├── board/
│   │   ├── KanbanBoard.tsx     # Organism
│   │   ├── Lane.tsx
│   │   └── StoryCard.tsx
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

**State Management:** React hooks only (no external library)

| State Type  | Location       | Pattern                                    |
| ----------- | -------------- | ------------------------------------------ |
| Server Data | React Context  | `BmadDataContext` provides stories/epics   |
| UI State    | Local useState | Selected story, filters, modal open/closed |
| Form State  | Local useState | Filter selections                          |

**Accessibility Implementation:**

| Requirement         | Implementation                                    |
| ------------------- | ------------------------------------------------- |
| Keyboard Navigation | Tab order, arrow keys for board, escape to close  |
| ARIA Labels         | Custom `useAnnounce` hook + manual aria-\*        |
| Focus Management    | Custom `useFocusTrap`, `useFocusReturn` hooks     |
| Color Contrast      | Tailwind config enforces 4.5:1 minimum            |
| Screen Reader       | Semantic HTML + `useAnnounce` for dynamic content |

**Custom ARIA Hooks:**

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

### Infrastructure & Deployment

**Distribution:** npm package via `npx bmad-ui`

| Aspect       | Decision                        |
| ------------ | ------------------------------- |
| Hosting      | None — local execution          |
| CI/CD        | GitHub Actions for npm publish  |
| Environments | None — single local environment |
| Monitoring   | Console logging only            |
| Scaling      | N/A — single user per instance  |

**npm Package Configuration:**

```json
{
  "name": "bmad-ui",
  "version": "0.1.0",
  "type": "module",
  "bin": {
    "bmad-ui": "./dist/server/index.js"
  },
  "files": ["dist/", "package.json", "README.md"],
  "engines": {
    "node": ">=18.0.0"
  }
}
```

**CLI Entry Point:**

```typescript
// server/index.ts
#!/usr/bin/env node

import express from 'express';
import { serveStatic, parseBmadFiles } from './lib';

const app = express();
const PORT = 3000;

// Parse BMAD files from current working directory
const bmadData = parseBmadFiles(process.cwd());

// API routes
app.get('/api/stories', (req, res) => res.json(bmadData.stories));
app.get('/api/epics', (req, res) => res.json(bmadData.epics));
app.get('/api/sprint', (req, res) => res.json(bmadData.sprint));

// Serve React build
app.use(express.static('dist/client'));

app.listen(PORT, () => {
  console.log(`bmad-ui running at http://localhost:${PORT}`);
});
```

### Error Handling

**Error Type Hierarchy:**

```typescript
// src/lib/errors.ts
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
    // Transform Axios error to BmadError
  }
}

export class BmadParseError extends BmadError {
  constructor(file: string, cause: Error) {
    super('PARSE_ERROR', `Failed to parse ${file}`, file, [cause.message])
  }
}

export class BmadFileNotFoundError extends BmadError {
  constructor(path: string) {
    super('FILE_NOT_FOUND', `BMAD artifacts not found at ${path}`, path)
  }
}

export class BmadValidationError extends BmadError {
  constructor(file: string, issues: string[]) {
    super('VALIDATION_ERROR', `Validation failed for ${file}`, file, issues)
  }
}

type ErrorCode = 'PARSE_ERROR' | 'FILE_NOT_FOUND' | 'VALIDATION_ERROR' | 'NETWORK_ERROR'
```

**Error Boundary Pattern:**

```typescript
// src/components/layout/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### Decision Impact Analysis

**Implementation Sequence:**

1. **Project Setup** — Initialize Vite + React + TypeScript + Tailwind
2. **Server Foundation** — Express server with CLI entry point
3. **Parsers** — YAML/JSON/Markdown parsing with error handling
4. **API Routes** — `/api/stories`, `/api/epics`, `/api/sprint`
5. **React Context** — Data provider with fetch hooks
6. **UI Atoms** — Button, Badge, Icon, Spinner
7. **UI Molecules** — Modal, Card, Dropdown
8. **Error Handling** — Error types + ErrorBoundary
9. **Feature Components** — Board, StoryCard, StoryDetail
10. **Accessibility Hooks** — useFocusTrap, useAnnounce, etc.
11. **Polish** — Keyboard navigation, PO-friendly labels

**Cross-Component Dependencies:**

```
Parsers → API Routes → React Context → Feature Components
                                      ↓
Error Types ←─────────────────────── Error Boundary
                                      ↓
Accessibility Hooks ←──────────────── UI Components
```

**Bundle Size Estimate:**

| Category              | Size       |
| --------------------- | ---------- |
| React 19              | ~140KB     |
| ReactDOM              | ~50KB      |
| Axios                 | ~13KB      |
| js-yaml               | ~50KB      |
| gray-matter           | ~40KB      |
| Tailwind CSS (purged) | ~10KB      |
| Application code      | ~100KB     |
| **Total (gzipped)**   | **~400KB** |

✅ Well under 5MB target — significant headroom for growth.

## Implementation Patterns & Consistency Rules

### Critical Conflict Points Identified

8 areas where AI agents could make different choices without explicit patterns.

### Naming Patterns

**File Naming Convention:**

| Type       | Convention                      | Example                            |
| ---------- | ------------------------------- | ---------------------------------- |
| Components | PascalCase                      | `StoryCard.tsx`, `KanbanBoard.tsx` |
| Hooks      | camelCase with `use` prefix     | `useStories.ts`, `useFocusTrap.ts` |
| Utilities  | camelCase                       | `api.ts`, `errors.ts`              |
| Types      | camelCase                       | `bmad.ts`, `errors.ts`             |
| Tests      | Co-located, same name + `.test` | `StoryCard.test.ts`                |

**Code Naming Convention:**

| Type             | Convention           | Example                                        |
| ---------------- | -------------------- | ---------------------------------------------- |
| Components       | PascalCase           | `function KanbanBoard() {}`                    |
| Functions        | camelCase            | `function parseStory() {}`                     |
| Constants        | SCREAMING_SNAKE_CASE | `const STATUS_LABELS = {}`                     |
| Types/Interfaces | PascalCase           | `interface Story {}`, `type StoryStatus = ...` |

### Export Patterns

**Export Style:** Mixed (context-dependent)

| Type       | Export Style | Example                               |
| ---------- | ------------ | ------------------------------------- |
| Components | Default      | `export default function Button() {}` |
| Hooks      | Named        | `export function useStories() {}`     |
| Utilities  | Named        | `export const api = axios.create()`   |
| Types      | Named        | `export interface Story {}`           |
| Constants  | Named        | `export const STATUS_LABELS = {}`     |

**Import Pattern:**

```typescript
// Component imports
import Button from '@/components/ui/atoms/Button'
import KanbanBoard from '@/components/features/board/KanbanBoard'

// Utility imports
import { api } from '@/lib/api'
import { useStories } from '@/hooks/useStories'

// Type imports
import type { Story, StoryStatus } from '@/types/bmad'
```

### API Response Format

**Standard:** HTTP Status Codes + Direct Body

| Status | Meaning      | Response Body                                   |
| ------ | ------------ | ----------------------------------------------- |
| 200    | Success      | Data directly (array or object)                 |
| 201    | Created      | Created resource                                |
| 404    | Not Found    | `{ error: { code, message, file? } }`           |
| 500    | Server Error | `{ error: { code, message, file?, details? } }` |

**Success Example:**

```typescript
// GET /api/stories → 200
[
  { id: "story-1", title: "Setup project", status: "done", ... },
  { id: "story-2", title: "Build board", status: "in-dev", ... }
]
```

**Error Example:**

```typescript
// GET /api/stories → 500
{
  error: {
    code: "PARSE_ERROR",
    message: "Failed to parse sprint.yaml",
    file: "sprint.yaml",
    details: ["Line 15: Invalid YAML syntax"]
  }
}
```

### Import Path Style

**Standard:** Path aliases via TypeScript/Vite config

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/lib/*": ["src/lib/*"],
      "@/types/*": ["src/types/*"]
    }
  }
}
```

**Usage:**

```typescript
// ✅ Preferred - Path aliases
import Button from '@/components/ui/atoms/Button'
import { useStories } from '@/hooks/useStories'
import type { Story } from '@/types/bmad'

// ❌ Avoid - Relative imports
import Button from '../../components/ui/atoms/Button'
```

### Test Location

**Standard:** Co-located with source files

```
src/
├── components/
│   └── ui/
│       └── atoms/
│           ├── Button.tsx
│           └── Button.test.ts      # ✅ Same directory
├── hooks/
│   ├── useStories.ts
│   └── useStories.test.ts          # ✅ Same directory
└── lib/
    ├── api.ts
    └── api.test.ts                  # ✅ Same directory
```

**Benefits:**

- Tests easy to find (same folder)
- Clear relationship between code and tests
- Moving files keeps tests together

### TypeScript Strictness

**Standard:** TypeScript strict mode enabled

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Implications:**

- All variables must be typed (inferred or explicit)
- No `any` without explicit cast
- Array access returns `T | undefined`
- All code paths must return values

### Enforcement Guidelines

**All AI Agents MUST:**

1. Use path aliases (`@/*`) for all imports — no relative paths beyond same directory
2. Follow file naming: PascalCase for components, camelCase for utilities
3. Use named exports for hooks/utilities/types, default exports for components
4. Place tests in same directory as source file with `.test.ts` extension
5. Return HTTP status codes with appropriate response bodies
6. Use strict TypeScript — no `any` without justification

**Pattern Verification:**

- ESLint rules enforce import patterns
- TypeScript strict mode catches violations
- Vitest finds co-located tests automatically
- Code review catches naming inconsistencies

### Pattern Examples

**Good Examples:**

```typescript
// ✅ Component with default export, path alias import
import Badge from '@/components/ui/atoms/Badge';
import type { StoryStatus } from '@/types/bmad';

export default function StoryCard({ story }: StoryCardProps) {
  return (
    <div>
      <Badge status={story.status} />
    </div>
  );
}
```

```typescript
// ✅ Hook with named export, strict typing
import { useState, useEffect } from 'react'
import type { Story } from '@/types/bmad'

export function useStories(): {
  stories: Story[]
  loading: boolean
  error: Error | null
} {
  const [stories, setStories] = useState<Story[]>([])
  // ...
  return { stories, loading, error }
}
```

**Anti-Patterns:**

```typescript
// ❌ Relative import beyond same directory
import Button from '../../components/ui/atoms/Button';

// ❌ Wrong export style for component
export function Button() {}  // Should be default export

// ❌ Wrong export style for hook
export default function useStories() {}  // Should be named export

// ❌ TypeScript any
function parse(data: any) {}  // Should use explicit type

// ❌ Test in separate directory
src/
├── components/Button.tsx
└── tests/Button.test.ts  // Should be co-located
```

## Project Structure & Boundaries

### Requirements to Structure Mapping

| FR            | Description                    | Component Location                                 | Supporting Files                    |
| ------------- | ------------------------------ | -------------------------------------------------- | ----------------------------------- |
| **FR1-FR3**   | Kanban board + lanes + filters | `src/components/features/board/`                   | `useStories.ts`, `useEpics.ts`      |
| **FR4**       | Sprint filter                  | `src/components/features/filters/SprintFilter.tsx` | `useSprintStatus.ts`                |
| **FR5**       | "What's Changed" indicator     | `src/hooks/useStoryChanges.ts`                     | `localStorage` for session tracking |
| **FR6-FR8**   | Story details view             | `src/components/features/stories/StoryDetail.tsx`  | `AcceptanceCriteria.tsx`            |
| **FR10-FR12** | Navigation                     | `src/components/features/filters/`                 | Navigation context in `App.tsx`     |
| **FR13-FR16** | CLI & server                   | `server/index.ts`                                  | `server/routes/*`, `server/lib/*`   |

### Cross-Cutting Concerns Mapping

| Concern          | Location                                                       | Used By                     |
| ---------------- | -------------------------------------------------------------- | --------------------------- |
| Error Handling   | `src/lib/errors.ts`, `src/components/layout/ErrorBoundary.tsx` | All components              |
| Accessibility    | `src/hooks/accessibility/`                                     | All interactive components  |
| API Client       | `src/lib/api.ts`                                               | All data hooks              |
| Type Definitions | `src/types/bmad.ts`                                            | Frontend + Backend          |
| Status Labels    | `src/lib/status-labels.ts`                                     | Board, filters, story cards |

### Complete Project Structure

```
bmad-ui/
├── package.json                      # npm package config with bin entry
├── package-lock.json
├── tsconfig.json                      # Frontend TypeScript (strict)
├── tsconfig.server.json               # Server TypeScript config
├── vite.config.ts                     # Vite build configuration
├── tailwind.config.ts                 # Tailwind CSS configuration
├── eslint.config.js                   # ESLint flat config
├── prettier.config.js                 # Prettier configuration
├── vitest.config.ts                   # Vitest test configuration
├── .gitignore
├── README.md
├── LICENSE
│
├── src/                               # React frontend source
│   ├── components/
│   │   ├── ui/                       # Layer 1: Generic UI components (Atomic)
│   │   │   ├── atoms/                # Smallest reusable units
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.ts
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Badge.test.ts
│   │   │   │   ├── Icon.tsx
│   │   │   │   ├── Icon.test.ts
│   │   │   │   ├── Spinner.tsx
│   │   │   │   └── Spinner.test.ts
│   │   │   └── molecules/            # Combinations of atoms
│   │   │       ├── Modal.tsx
│   │   │       ├── Modal.test.ts
│   │   │       ├── Card.tsx
│   │   │       ├── Card.test.ts
│   │   │       ├── Dropdown.tsx
│   │   │       └── Dropdown.test.ts
│   │   ├── features/                # Layer 2: BMAD domain components
│   │   │   ├── board/               # Kanban board feature
│   │   │   │   ├── KanbanBoard.tsx
│   │   │   │   ├── KanbanBoard.test.ts
│   │   │   │   ├── Lane.tsx
│   │   │   │   ├── Lane.test.ts
│   │   │   │   ├── StoryCard.tsx
│   │   │   │   └── StoryCard.test.ts
│   │   │   ├── stories/             # Story details feature
│   │   │   │   ├── StoryDetail.tsx
│   │   │   │   ├── StoryDetail.test.ts
│   │   │   │   ├── AcceptanceCriteria.tsx
│   │   │   │   └── AcceptanceCriteria.test.ts
│   │   │   └── filters/             # Filtering feature
│   │   │       ├── SprintFilter.tsx
│   │   │       ├── SprintFilter.test.ts
│   │   │       ├── EpicFilter.tsx
│   │   │       └── EpicFilter.test.ts
│   │   └── layout/                 # App layout components
│   │       ├── AppLayout.tsx
│   │       ├── AppLayout.test.ts
│   │       ├── ErrorBoundary.tsx
│   │       └── ErrorBoundary.test.ts
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── accessibility/           # ARIA utility hooks
│   │   │   ├── useFocusTrap.ts
│   │   │   ├── useFocusTrap.test.ts
│   │   │   ├── useAnnounce.ts
│   │   │   ├── useAnnounce.test.ts
│   │   │   ├── useKeyboardShortcut.ts
│   │   │   ├── useKeyboardShortcut.test.ts
│   │   │   ├── useFocusReturn.ts
│   │   │   └── useFocusReturn.test.ts
│   │   ├── useStories.ts            # Data fetching hooks
│   │   ├── useStories.test.ts
│   │   ├── useEpics.ts
│   │   ├── useEpics.test.ts
│   │   ├── useSprintStatus.ts
│   │   ├── useSprintStatus.test.ts
│   │   ├── useStoryChanges.ts       # Change detection
│   │   └── useStoryChanges.test.ts
│   │
│   ├── lib/                         # Utilities and configuration
│   │   ├── api.ts                   # Axios instance + interceptors
│   │   ├── api.test.ts
│   │   ├── errors.ts                # BmadError class hierarchy
│   │   ├── errors.test.ts
│   │   ├── status-labels.ts         # PO-friendly status mapping
│   │   └── status-labels.test.ts
│   │
│   ├── context/                     # React Context providers
│   │   ├── BmadDataContext.tsx      # Stories, epics, sprint data
│   │   └── BmadDataContext.test.tsx
│   │
│   ├── types/                       # TypeScript type definitions
│   │   ├── bmad.ts                  # Story, Epic, Sprint types
│   │   └── errors.ts                # Error type definitions
│   │
│   ├── App.tsx                      # Root component
│   ├── App.test.tsx
│   ├── main.tsx                     # React entry point
│   ├── main.test.tsx
│   └── index.css                    # Tailwind imports + global styles
│
├── server/                          # Express backend
│   ├── index.ts                     # Server entry + CLI launcher
│   ├── routes/                      # API route handlers
│   │   ├── stories.ts
│   │   ├── stories.test.ts
│   │   ├── epics.ts
│   │   ├── epics.test.ts
│   │   ├── sprint.ts
│   │   ├── sprint.test.ts
│   │   ├── refresh.ts               # Force re-parse endpoint
│   │   └── refresh.test.ts
│   └── lib/                         # Server utilities
│       ├── bmad-reader.ts           # File system reader
│       ├── bmad-reader.test.ts
│       ├── cache.ts                 # In-memory cache
│       ├── cache.test.ts
│       └── parsers/                 # Format-specific parsers
│           ├── yaml.ts
│           ├── yaml.test.ts
│           ├── json.ts
│           ├── json.test.ts
│           ├── markdown.ts
│           └── markdown.test.ts
│
├── public/                          # Static assets
│   └── favicon.ico
│
└── dist/                            # Production build output (gitignored)
    ├── client/                      # Vite-built React app
    │   ├── index.html
    │   ├── assets/
    │   └── ...
    └── server/                      # Compiled TypeScript server
        ├── index.js
        ├── routes/
        └── lib/
```

### Architectural Boundaries

**Layer 1: UI Components (`src/components/ui/`)**

- **Responsibility:** Generic, reusable UI primitives
- **Dependencies:** None (only React + Tailwind)
- **Exports:** Default exports for components
- **Testing:** Unit tests with Testing Library

**Layer 2: Feature Components (`src/components/features/`)**

- **Responsibility:** BMAD domain-specific UI
- **Dependencies:** UI components, hooks, types
- **Exports:** Default exports for components
- **Testing:** Unit + integration tests

**Layer 3: Hooks (`src/hooks/`)**

- **Responsibility:** Stateful logic, data fetching, accessibility
- **Dependencies:** lib/api.ts, types
- **Exports:** Named exports for hooks
- **Testing:** Unit tests with mocked API

**Layer 4: Utilities (`src/lib/`)**

- **Responsibility:** Pure functions, API client, error handling
- **Dependencies:** External packages only (axios, etc.)
- **Exports:** Named exports for utilities
- **Testing:** Pure unit tests

**Layer 5: Server (`server/`)**

- **Responsibility:** File parsing, API routes, caching
- **Dependencies:** Node.js APIs, parsers
- **Exports:** Named exports for utilities, server app
- **Testing:** Unit + integration tests with supertest

### Communication Flow

```
User Browser
    ↓
server/index.ts (Express on :3000)
    ↓
server/routes/* (API endpoints)
    ↓
server/lib/bmad-reader.ts → server/lib/parsers/* → Parse BMAD files
    ↓
server/lib/cache.ts (In-memory storage)
    ↓
API Response (JSON)
    ↓
src/lib/api.ts (Axios client)
    ↓
src/hooks/useStories.ts (Data hook)
    ↓
src/context/BmadDataContext.tsx (React Context)
    ↓
src/components/features/board/KanbanBoard.tsx
    ↓
    ├── Lane.tsx
    │   └── StoryCard.tsx
    └── StoryDetail.tsx (Modal)
```

### Configuration Files Purpose

| File                   | Purpose                                  | AI Agent Must Know                        |
| ---------------------- | ---------------------------------------- | ----------------------------------------- |
| `tsconfig.json`        | Frontend TypeScript config (strict mode) | Enables `@/*` path aliases                |
| `tsconfig.server.json` | Server TypeScript config                 | Compiles to `dist/server/`                |
| `vite.config.ts`       | Build tool configuration                 | Defines `@/*` path aliases, build output  |
| `tailwind.config.ts`   | Styling configuration                    | Custom colors, 4.5:1 contrast enforcement |
| `eslint.config.js`     | Code quality rules                       | Flat config format, TypeScript rules      |
| `vitest.config.ts`     | Test configuration                       | Test environment, coverage settings       |
| `package.json`         | npm package metadata                     | `bin` entry for CLI, scripts              |

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**

| Check                            | Status        | Notes                 |
| -------------------------------- | ------------- | --------------------- |
| React 19 + Vite 6 + TypeScript 5 | ✅ Compatible | Standard modern stack |
| Express 5 + Node.js 18+          | ✅ Compatible | LTS alignment         |
| Tailwind 4 + Vite plugin         | ✅ Compatible | Official integration  |
| Axios + TypeScript               | ✅ Compatible | Full type support     |
| js-yaml + gray-matter            | ✅ Compatible | No conflicts          |

**Pattern Consistency:**

| Check                                   | Status        | Notes                                   |
| --------------------------------------- | ------------- | --------------------------------------- |
| Component exports align with structure  | ✅ Consistent | Default for components, named for hooks |
| Path aliases match tsconfig/vite config | ✅ Consistent | `@/*` pattern throughout                |
| Error types align with API format       | ✅ Consistent | HTTP status + structured body           |
| Test location follows co-location       | ✅ Consistent | All `.test.ts` with source              |

**Structure Alignment:**

| Check                                     | Status     | Notes                                |
| ----------------------------------------- | ---------- | ------------------------------------ |
| Layered structure supports atomic pattern | ✅ Aligned | `ui/` + `features/` boundaries clear |
| Server structure mirrors data flow        | ✅ Aligned | `routes/` → `lib/` → `parsers/`      |
| Context pattern supports data hooks       | ✅ Aligned | Single context, multiple hooks       |

### Requirements Coverage Validation ✅

**Functional Requirements → Architecture Mapping:**

| FR      | Description             | Architecture Support                        | Status     |
| ------- | ----------------------- | ------------------------------------------- | ---------- |
| FR1     | Kanban board with lanes | `KanbanBoard.tsx`, `Lane.tsx`               | ✅ Covered |
| FR2     | Epic grouping           | `EpicFilter.tsx`, epicId in Story type      | ✅ Covered |
| FR3     | Sprint filter           | `SprintFilter.tsx`, `useSprintStatus.ts`    | ✅ Covered |
| FR4     | PO-friendly status      | `status-labels.ts`                          | ✅ Covered |
| FR5     | "What's Changed"        | `useStoryChanges.ts`                        | ✅ Covered |
| FR6     | Story details view      | `StoryDetail.tsx`                           | ✅ Covered |
| FR7     | Acceptance criteria     | `AcceptanceCriteria.tsx`                    | ✅ Covered |
| FR8     | Epic from story         | `Epic.id` in Story type                     | ✅ Covered |
| FR10-12 | Navigation              | Filter components, navigation context       | ✅ Covered |
| FR13-17 | CLI + zero-config       | `server/index.ts` CLI entry, Express static | ✅ Covered |

**Non-Functional Requirements → Architecture Support:**

| NFR      | Requirement                    | Architecture Support                                | Status       |
| -------- | ------------------------------ | --------------------------------------------------- | ------------ |
| NFR1-4   | Performance (FCP <1s, TTI <2s) | Vite build, code splitting, ~400KB bundle           | ✅ Addressed |
| NFR5     | Bundle < 5MB                   | Minimal deps, tree-shaking, Tailwind purge          | ✅ Addressed |
| NFR7-11  | WCAG 2.1 AA                    | Accessibility hooks, Tailwind contrast              | ✅ Addressed |
| NFR12-15 | Parser requirements            | yaml/json/markdown parsers in `server/lib/parsers/` | ✅ Addressed |
| NFR16    | Graceful error handling        | `BmadError` hierarchy, `ErrorBoundary`              | ✅ Addressed |

### Implementation Readiness Validation ✅

**Decision Completeness:**

| Check                                | Status      | Notes                                |
| ------------------------------------ | ----------- | ------------------------------------ |
| All technology choices have versions | ✅ Complete | React 19, Vite 6, Express 5, etc.    |
| Implementation patterns documented   | ✅ Complete | Naming, exports, imports, API format |
| Consistency rules defined            | ✅ Complete | 6 mandatory patterns                 |
| Examples provided                    | ✅ Complete | Good/anti-pattern examples           |

**Structure Completeness:**

| Check                         | Status      | Notes                            |
| ----------------------------- | ----------- | -------------------------------- |
| Full directory tree defined   | ✅ Complete | All files/folders specified      |
| Component boundaries clear    | ✅ Complete | 5 layers with responsibilities   |
| Integration points specified  | ✅ Complete | API endpoints, data flow diagram |
| Requirements mapping complete | ✅ Complete | FR → Component mapping table     |

**Pattern Completeness:**

| Conflict Point        | Pattern Defined             | Status       |
| --------------------- | --------------------------- | ------------ |
| File naming           | PascalCase/camelCase rules  | ✅ Addressed |
| Component exports     | Mixed (default/named) rules | ✅ Addressed |
| API response format   | HTTP status + direct body   | ✅ Addressed |
| Import paths          | Path aliases `@/*`          | ✅ Addressed |
| Test location         | Co-located `.test.ts`       | ✅ Addressed |
| TypeScript strictness | Strict mode enabled         | ✅ Addressed |

### Gap Analysis Results

**Critical Gaps:** None found ✅

**Important Gaps:** None found ✅

**Nice-to-Have (Optional Enhancements):**

| Gap                            | Priority | Recommendation                        |
| ------------------------------ | -------- | ------------------------------------- |
| E2E test setup                 | Low      | Post-MVP — Playwright config deferred |
| Storybook for UI components    | Low      | Not needed for single-developer MVP   |
| Husky pre-commit hooks         | Low      | Could add later for quality gates     |
| Detailed component props types | Low      | Will emerge during implementation     |

### Architecture Completeness Checklist

**✅ Requirements Analysis**

- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**

- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**

- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**

- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** ✅ **READY FOR IMPLEMENTATION**

**Confidence Level:** High

**Key Strengths:**

1. Clear layered architecture with explicit boundaries
2. Minimal dependency footprint (well under 5MB target)
3. Comprehensive error handling strategy
4. WCAG 2.1 AA accessibility built in from the start
5. Co-located tests for maintainability
6. Explicit patterns prevent AI agent conflicts

**Areas for Future Enhancement (Post-MVP):**

1. Add Playwright E2E tests when UI stabilizes
2. Consider localStorage for "What's Changed" persistence
3. Add Husky pre-commit hooks for quality gates
4. Consider Storybook if component library grows

### Implementation Handoff

**AI Agent Guidelines:**

- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions

**First Implementation Command:**

```bash
npm create vite@latest bmad-ui -- --template react-ts
```

**Next Workflow Step:**
Run `/bmad-bmm-create-epics-and-stories` to break down implementation into actionable stories.
