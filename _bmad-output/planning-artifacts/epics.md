## Epic 1: Project Foundation

**Goal:** Establish the technical foundation that enables all subsequent features — project setup, server, parsers, and core data infrastructure.

**User value:** Users can launch bmad-ui via `npx bmad-ui` in any BMAD project directory and access a working local server at `http://localhost:3000` in their browser. Zero-configuration: works with any BMAD project structure without manual setup.

**FRs covered:** FR13, FR14, FR15, FR16, FR17

**nfrs addressed:** NFR1, NFR2, NFR3, nfr4, nfr5, nfr6, nfr12, NFR13, Nfr14, NFR15, nfr16, nfr17
**Implementation Notes:**

- Uses Vite + React + TypeScript starter template (`npm create vite@latest bmad-ui -- --template react-ts`)
- Installs Tailwind CSS via `npm install -D tailwindcss @tailwindcss/vite`
- Uses js-yaml for YAML parsing and gray-matter for Markdown with YAML frontmatter
- Uses native JSON.parse for JSON files
- Uses Express for local server (production build serves React SPA)
- Uses in-memory cache to avoid repeated file system reads
- Performance targets: FCP < 1s, TTI < 2s, refresh < 1s, bundle size < 5MB
- Zero-config: Auto-detect BMAD project structure,- Works with any BMAD project out of the box

### Story 1.1: Project Initialization

As a **developer,**
I want to initialize a Vite + React + TypeScript project with all required dependencies and configuration files.

**Acceptance Criteria:**

**Given** a developer runs `npx create vite@latest bmad-ui -- --template react-ts`
**When** the command executes successfully
**Then** a Vite + React + TypeScript project is created
**And** all dependencies are installed with correct versions - `npm install -D tailwindcss @tailwindcss/vite` - `npm install js-yaml gray-matter` - `npm install axios` - `npm install express` - `npm install -D concurrently tsx vitest @testing-library/react @testing-library/jest-dom`
**And** `package.json` is updated with: - `"type": "module"` - `"bin": { "bmad-ui": "./dist/server/index.js" }
          - Scripts for `dev`, `build`, `preview`, `lint`, `format`, `test`, `typecheck`are added
        **And** the following directories are created:
          -`src/`with React components
          -`src/components/ui/atoms/`          -`src/components/ui/molecules/`          -`src/components/features/`          -`src/components/layout/`          -`src/hooks/`          -`src/hooks/accessibility/`          -`src/lib/`          -`src/context/`          -`src/types/`          -`server/`with Express server
          -`server/routes/`          -`server/lib/`          -`server/lib/parsers/`        **And** a working local server starts at Express on port 3000
        **And** opening`http://localhost:3000`in the browser displays "bmad-ui running successfully"
        **And** the message`bmad-ui running at http://localhost:3000` appears in terminal

**Given** a developer runs `npx bmad-ui`
**When** the command executes successfully
**Then** a working local server starts
**And** the server is accessible at `http://localhost:3000`
**And** a placeholder page displays indicating bmad-ui is ready to use

**Given** a developer runs `npx bmad-ui` from project root directory
**When** the command is not
**Then** the local server detects the BMAD project structure
**And** `dist/client/index.html` and `dist/server/index.js` are executed
**And** a console message confirms bmad-ui is ready
**And** the server starts successfully on port 3000

**Given** a user runs `npx bmad-ui` in a project with existing BMAD files
**When** the server starts
**Then** the server detects the BMAD project structure
**And** a welcome message displays with project name and port number
**And** a message displays indicating how to open the board in browser
**And** the user sees the "Please wait..." message with instructions for opening the board

**Given** a user runs `npx bmad-ui`
**When** the browser opens
**Then** the React app renders without errors
**And** a loading message displays (optional)
**And** the FCP is < 1 second

**Given** a user runs `npx bmad-ui`
**When** the page finishes loading
**Then** the board is visible
**And** an empty state message shows "No stories found"

**Given** a user opens the browser to `http://localhost:3000`
**When** the page loads
**Then** the FCP is < 1 second
**And** Time to Interactive (TTI) < 2 seconds

**Given** a developer runs `npm run build`
**When** the build completes
**Then** the bundle size is < 5MB
**And** all files are in `dist/` folder

**Given** a developer runs `npm pack`
**When** the package is created
**Then** the package size is < 5MB
**And** the package can be installed via `npm install -g ./bmad-ui-0.1.0.tgz`

**Given** a developer runs `npm run typecheck`
**When** the command completes
**Then** TypeScript compiles without errors
**And** strict mode is enabled

**Given** a developer runs `npm run lint`
**When** the command completes
**Then** ESLint passes without errors
**And** code follows configured patterns

**Given** a developer runs `npm run format`
**When** the command completes
**Then** Prettier formats all files
**And** code style is consistent

---

### Story 1.2: Server and API Routes

As a **developer,**
I want to build the Express server with API routes forBMAD file parsers
and that I can serve the React app to the parsed data.

**Acceptance Criteria:**

**Given** a developer has the set up a basic Express server in `server/index.ts`
**When** the server is run
**Then** it server listens on port 3000
**And** logs "bmad-ui running at http://localhost:3000" to console

        **And** server serves the `dist/client` directory as static files

**Given** a developer has implemented BMAD file parsers in `server/lib/parsers/`
**When** the server code runs
**Then** the following parsers are available and functional: - `yaml.ts` for parsing YAML files - `json.ts` for parsing JSON files - `markdown.ts` for parsing Markdown files
**And** each parser exports functions: - `parseYaml(content: string): object` - `parseJson(content: string): object` - `parseMarkdown(content: string): object`

**Given** a developer has implemented `bmad-reader.ts` in `server/lib/`
**When** the file reading code runs
**Then** BMAD files are read from `_bmad-output` directory
**And** file discovery handles multiple formats - Looks for `.yaml`, `.json`, `.md` files - Looks in sharded directories - Returns structured error for missing files

        **And** all file content is cached in memory
        **And** cache invalidation is supported via `POST /api/refresh`

**Given** a developer has implemented cache invalidation in `server/lib/cache.ts`
**When** a file change is detected
**Then** cache is cleared and files are re-parsed
**And** `POST /api/refresh` endpoint clears cache
**And** cache invalidation can be triggered manually

        **Given** a developer has implemented API routes in `server/routes/`
        **When** `npm run dev:server` runs
        **Then** the following endpoints are accessible:
          - `GET /api/stories` - returns all stories
          - `GET /api/stories/:id` - returns single story
          - `GET /api/epics` - returns all epics
          - `GET /api/epics/:id` - returns single epic
          - `GET /api/sprint` - returns sprint status
          - `POST /api/refresh` - clears cache and re-parses
        **And** each route returns properly formatted JSON
        **And** error handling returns structured error objects

**Given** a developer runs `npm run build:server`
**When** the build completes
**Then** `dist/server/index.js` is created
**And** TypeScript compiles without errors

**Given** a developer runs `npm run build:client`
**When** the build completes
**Then** `dist/client/` contains index.html and assets, and **And** build completes without errors

---

### Story 1.3: Data Types and State Management

As a **developer,**
I want to define TypeScript types for BMAD data structures and create a React Context provider for data management

**Acceptance Criteria:**

**Given** a developer creates `src/types/bmad.ts`
**When** the file is created
**Then** the following types are defined: - `Story` interface with id, title, description, status, epicId, sprintId, acceptanceCriteria - `Epic` interface with id, title, description, storyIds - `SprintStatus` interface with sprintId, name, stories, lastUpdated - `StoryStatus` type with status values
**And** `STATUS_LABELS` constant maps status to PO-friendly labels

**Given** a developer creates `src/context/BmadDataContext.tsx`
**When** the file is created
**Then** the context provides: - `stories` array - `epics` array - `sprintStatus` object - `loading` state - `error` state - `refetch` function
**And** context integrates with API client

**Given** a developer creates `src/hooks/useStories.ts`
**When** the file is created
**Then** the hook returns: - `stories` array - `loading` boolean - `error` object | null - `refetch` function
**And** the hook`fetches`/api/stories` endpoint

**Given** a developer creates `src/hooks/useEpics.ts`
**When** the file is created
**Then** the hook returns: - `epics` array - `loading` boolean - `error` object | null - `refetch` function
**And** the hook`fetches`/api/epics` endpoint

**Given** a developer creates `src/hooks/useSprintStatus.ts`
**When** the file is created
**Then** the hook returns: - `sprintStatus` object - `loading` boolean - `error` object | null - `refetch` function
**And** hook fetches `/api/sprint` endpoint

---

**Epic 1 Summary:** 3 stories created covering project foundation
**FRs covered:** FR13, FR14, FR15, FR16, FR17
**Status:** ✅ Complete

---

## Epic 2: Sprint Visualization

**Goal:** Display sprint status as an interactive Kanban board with clear visual hierarchy and PO-friendly language.

**User value:** Product owners can instantly see sprint progress, understand which stories are being worked on, and identify bottlenecks without reading technical jargon. The board uses familiar terminology like "Ready to Start", "Being Built", "Needs Your Attention", and "Complete".

**FRs covered:** FR1, FR2, FR3, FR4

**NFRs addressed:** NFR7, NFR8, NFR9, NFR10, NFR11

**Implementation Notes:**

- Kanban board layout with horizontal lanes
- Four lanes: Ready, In Development, Ready for Review, Done
- PO-friendly status labels via `STATUS_LABELS` mapping
- Responsive design (mobile-first)
- Accessible keyboard navigation
- Visual hierarchy with story cards
- Color-coded status indicators
- Performance: < 1s render for 100+ stories

### Story 2.1: Kanban Board Layout

As a **product owner,**
I want to see a Kanban board with clearly labeled lanes
So that I can understand the workflow and where stories are in the development process.

**Acceptance Criteria:**

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

---

### Story 6.1: Story Detail Modal

**Given** a product owner views the Kanban board on desktop
**When** the screen width is >= 1024px
**Then** all four lanes are visible side-by-side
**And** horizontal scrolling is not required
**And** lane widths are proportional to content

**Given** a developer implements the KanbanBoard component
**When** the component renders
**Then** it uses Tailwind CSS for styling
**And** follows atomic design pattern (molecule component)
**And** exports as default from `src/components/features/KanbanBoard.tsx`
**And** accepts `stories`, `epics`, and `sprintStatus` as props

**Given** a developer creates the Lane component
**When** the component renders
**Then** it displays lane title with PO-friendly label
**And** shows story count badge
**And** renders StoryCard children
**And** exports as default from `src/components/ui/molecules/Lane.tsx`

**Given** a product owner uses keyboard navigation
**When** they press Tab to navigate the board
**Then** focus moves through lanes in order
**And** each lane is focusable
**And** ARIA labels describe lane purpose

---

### Story 2.2: Story Card Display

As a **product owner,**
I want to see story cards with key information at a glance
So that I can quickly understand what each story is about without opening it.

**Acceptance Criteria:**

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

**Given** a product owner hovers over a story card
**When** the mouse enters the card
**Then** the card displays a subtle shadow or elevation change
**And** the cursor changes to pointer
**And** a tooltip shows full title if truncated

**Given** a product owner views a story card
**When** they see the status badge
**Then** the badge displays PO-friendly text from STATUS_LABELS
**And** badge color matches status:

- "Ready to Start" → gray/blue
- "Being Built" → yellow/orange
- "Needs Your Attention" → purple/blue
- "Complete" → green
  **And** badge is positioned at top-right of card

**Given** a developer implements the StoryCard component
**When** the component renders
**Then** it uses Tailwind CSS for styling
**And** follows atomic design pattern (molecule component)
**And** exports as default from `src/components/ui/molecules/StoryCard.tsx`
**And** accepts `story` and `epic` as props
**And** is clickable (for future Story 2.3)

**Given** a product owner views the board with many stories
**When** 100+ stories are displayed
**Then** all cards render in < 1 second
**And** scrolling is smooth (60fps)
**And** no layout thrashing occurs

**Given** a product owner uses keyboard navigation
**When** they Tab through story cards
**Then** each card is focusable
**And** focus order follows visual order
**And** focused card has visible focus ring
**And** pressing Enter on focused card triggers detail view (future Story 2.3)

---

### Story 2.3: Story Distribution by Lane

As a **product owner,**
I want stories automatically organized into the correct lanes based on their status
So that I can see the current state of work without manual sorting.

**Acceptance Criteria:**

**Given** a product owner views the Kanban board
**When** stories are loaded from the API
**Then** each story is placed in the lane matching its status
**And** the "Ready to Start" lane contains all stories with status="ready"
**And** the "Being Built" lane contains all stories with status="in-dev"
**And** the "Needs Your Attention" lane contains all stories with status="ready-for-review"
**And** the "Complete" lane contains all stories with status="done"
**And** no story appears in multiple lanes

**Given** a product owner views a lane
**When** the lane has no stories
**Then** an empty state message displays "No stories in this lane"
**And** the lane height is maintained
**And** the empty state is styled consistently

**Given** a product owner views a lane with stories
**When** stories are displayed
**Then** stories are sorted by story number within the lane
**And** stories from different epics are intermixed based on status
**And** story count badge shows accurate count

**Given** a developer implements lane filtering logic
**When** the KanbanBoard component renders
**Then** stories are filtered by status using `STATUS_LABELS` mapping
**And** filtering is performed in the BmadDataContext or custom hook
**And** filtered stories are passed to each Lane component
**And** filtering is efficient (O(n) complexity)

**Given** a product owner refreshes the board
**When** new story data is loaded
**Then** stories are re-distributed to correct lanes
**And** previous story positions are cleared
**And** the board reflects current state from `_bmad-output`

**Given** a story has an invalid status
**When** the board renders
**Then** the story is placed in a fallback lane (e.g., "Ready to Start")
**And** an error is logged to console
**And** the board does not crash

---

**Epic 2 Summary:** 3 stories created covering sprint visualization
**FRs covered:** FR1, FR2, FR3, FR4
**Status:** ✅ Complete

---

## Epic 3: Story Discovery

**Goal:** Enable product owners to explore story details, view acceptance criteria, and navigate between stories without losing context.

**User value:** Product owners can dive deep into any story to understand requirements, review acceptance criteria in readable format, and quickly move between related stories - all without technical knowledge of file locations or BMAD structure.

**FRs covered:** FR6, FR7, FR8

**NFRs addressed:** NFR7, NFR8, NFR9, NFR10, NFR11

**Implementation Notes:**

- Modal/overlay for story detail view
- Given/When/Then formatted acceptance criteria display
- Previous/Next navigation within lane
- Keyboard shortcuts (Escape to close, Arrow keys to navigate)
- Story detail fetched from `/api/stories/:id` endpoint
- Deep linking support (optional - shareable story URLs)
- Accessible focus management in modal

### Story 3.1: Story Detail Modal

As a **product owner,**
I want to click a story card and see its full details in a modal
So that I can read the complete story without navigating away from the board.

**Acceptance Criteria:**

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

**Given** a product owner has a story detail modal open
**When** they click the close button
**Then** the modal closes
**And** focus returns to the story card that was clicked
**And** the board is fully visible again

**Given** a product owner has a story detail modal open
**When** they press the Escape key
**Then** the modal closes
**And** focus returns to the story card
**And** keyboard navigation resumes from that card

**Given** a product owner clicks outside the modal content area
**When** they click the dimmed background
**Then** the modal closes
**And** focus returns to the board

**Given** a developer implements the StoryDetailModal component
**When** the component renders
**Then** it uses Tailwind CSS for styling
**And** follows atomic design pattern (organism component)
**And** exports as default from `src/components/features/StoryDetailModal.tsx`
**And** accepts `storyId`, `isOpen`, and `onClose` as props
**And** fetches story data from `/api/stories/:id` when opened

**Given** a product owner opens a story detail modal
**When** the modal content loads
**Then** a loading spinner displays while data is fetched
**And** loading completes in < 500ms
**And** if loading fails, an error message displays with retry option

**Given** a product owner uses a screen reader
**When** the story detail modal opens
**Then** the modal has role="dialog"
**And** aria-modal="true"
**And** aria-labelledby points to story title
**And** focus is trapped within the modal
**And** screen reader announces the story title

---

### Story 3.2: Acceptance Criteria Display

As a **product owner,**
I want to see acceptance criteria formatted in a readable Given/When/Then structure
So that I can easily understand the testable requirements for each story.

**Acceptance Criteria:**

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

**Given** a product owner views acceptance criteria
**When** a criterion has multiple "And" clauses
**Then** each "And" is displayed on a new line
**And** indentation clearly shows hierarchy
**And** the structure is easy to read

**Given** a story has no acceptance criteria
**When** the story detail modal opens
**Then** a message displays "No acceptance criteria defined"
**And** the acceptance criteria section is still visible

**Given** a developer implements the AcceptanceCriteria component
**When** the component renders
**Then** it parses the acceptance criteria string
**And** formats Given/When/Then structure
**And** exports as named export from `src/components/ui/molecules/AcceptanceCriteria.tsx`
**And** accepts `criteria` string array as prop
**And** handles edge cases (empty criteria, malformed text)

**Given** a product owner views a long list of acceptance criteria
**When** the criteria exceed modal height
**Then** the criteria section becomes scrollable
**And** the modal header and footer remain fixed
**And** scroll position is independent of board scroll

**Given** a product owner copies acceptance criteria text
**When** they select and copy criteria text
**Then** the text is copied with proper formatting
**And** line breaks are preserved
**And** they can paste into external documents

---

### Story 3.3: Story Navigation

As a **product owner,**
I want to navigate to the next or previous story in the same lane without closing the modal
So that I can review multiple stories efficiently.

**Acceptance Criteria:**

**Given** a product owner has a story detail modal open
**When** they look at the modal footer
**Then** two navigation buttons are visible:

- "Previous" button (left arrow icon)
- "Next" button (right arrow icon)
  **And** button labels include story IDs (e.g., "Previous: Story 2.1")
  **And** buttons are positioned at bottom of modal

**Given** a product owner views the first story in a lane
**When** they look at the navigation buttons
**Then** the "Previous" button is disabled
**And** the button has a visual disabled state
**And** clicking it does nothing

**Given** a product owner views the last story in a lane
**When** they look at the navigation buttons
**Then** the "Next" button is disabled
**And** the button has a visual disabled state
**And** clicking it does nothing

**Given** a product owner clicks the "Next" button
**When** the button is enabled
**Then** the modal content updates to show the next story in the same lane
**And** the transition is smooth (fade or slide animation)
**And** focus remains in the modal
**And** the URL updates (if deep linking is implemented)
**And** the previous/next button states update

**Given** a product owner clicks the "Previous" button
**When** the button is enabled
**Then** the modal content updates to show the previous story in the same lane
**And** the transition is smooth
**And** focus remains in the modal

**Given** a product owner uses keyboard navigation
**When** the modal is open and they press the Left Arrow key
**Then** the previous story is shown (same as clicking Previous button)
**And** if already at first story, nothing happens

**Given** a product owner uses keyboard navigation
**When** the modal is open and they press the Right Arrow key
**Then** the next story is shown (same as clicking Next button)
**And** if already at last story, nothing happens

**Given** a developer implements navigation logic
**When** the StoryDetailModal component renders
**Then** it maintains an ordered list of stories in the current lane
**And** tracks current story index
**And** navigation updates index and fetches new story data
**And** navigation is efficient (uses cached data if available)

**Given** a product owner navigates between stories
**When** a new story loads
**Then** a loading indicator shows briefly (< 300ms)
**And** if loading fails, an error message displays
**And** navigation buttons remain functional for retry

---

**Epic 3 Summary:** 3 stories created covering story discovery
**FRs covered:** FR6, FR7, FR8
**Status:** ✅ Complete

---

---

## Epic 4: Navigation & Change Detection

**Goal:** Enable product owners to filter the board by epic, detect when stories have changed, and refresh the board to see latest updates from the BMAD project files.

**User value:** Product owners can focus on specific epic work, know when the board is out-of-sync with files, and refresh to see the latest story changes without leaving the interface.

**FRs covered:** FR5, FR10, FR11, FR12

**NFRs addressed:** NFR5, NFR6, NFR9, NFR11

**Implementation Notes:**

- Epic filter dropdown in header
- Change indicator (badge/pulse) when stories have been modified
- Manual refresh button
- Change summary showing what changed (new, updated, removed stories)
- Uses file modification timestamps or hash comparison
- Refresh triggers `/api/refresh` endpoint
- Performance: refresh completes in < 1s

### Story 4.1: Epic Filter

As a **product owner,**
I want to filter the Kanban board by epic
So that I can focus on stories for a specific epic without distraction from other work.

**Acceptance Criteria:**

**Given** a product owner views the Kanban board
**When** they look at the header or toolbar
**Then** an "Epic Filter" dropdown is visible
**And** the dropdown shows "All Epics" as the default selection
**And** the dropdown lists all available epics by name

**Given** a product owner clicks the Epic Filter dropdown
**When** the dropdown opens
**Then** it displays:

- "All Epics" option (default)
- List of all epic names (e.g., "Epic 1: Project Foundation", "Epic 2: Sprint Visualization")
  **And** epics are listed in order
  **And** the dropdown is searchable if > 5 epics

**Given** a product owner selects an epic from the dropdown
**When** the selection changes
**Then** the Kanban board updates to show only stories from the selected epic
**And** stories from other epics are hidden
**And** story counts in each lane update to reflect filtered stories
**And** the filter selection is displayed in the dropdown
**And** the URL updates with filter parameter (e.g., `?epic=epic-1`)

**Given** a product owner selects "All Epics" from the dropdown
**When** the selection changes
**Then** all stories are displayed across all epics
**And** the board returns to unfiltered state
**And** the URL filter parameter is removed

**Given** a product owner applies an epic filter
**When** they refresh the page or share the URL
**Then** the epic filter is preserved from URL parameter
**And** the board loads with the correct filter applied

**Given** a developer implements the EpicFilter component
**When** the component renders
**Then** it uses a native `<select>` or accessible custom dropdown
**And** exports as default from `src/components/ui/molecules/EpicFilter.tsx`
**And** accepts `epics`, `selectedEpicId`, and `onEpicChange` as props
**And** integrates with BmadDataContext for filtering

**Given** a product owner filters by an epic with no stories
**When** the board renders
**Then** all lanes show "No stories in this lane"
**And** the board does not look broken
**And** the filter remains selected

**Given** a product owner uses a screen reader
**When** they interact with the Epic Filter dropdown
**Then** the dropdown has an accessible label "Filter by Epic"
**And** screen reader announces the current selection
**And** screen reader announces the number of epics available

---

### Story 4.2: Change Detection & Visual Indicators

As a **product owner,**
I want to see visual indicators when stories have changed since I last viewed the board
So that I know the displayed information might be outdated and needs refreshing.

**Acceptance Criteria:**

**Given** a product owner has the board open
**When** story files in `_bmad-output` are modified externally
**Then** a change indicator appears in the header or toolbar
**And** the indicator shows "Changes Detected" or similar message
**And** the indicator uses a badge, pulse animation, or icon to draw attention
**And** the indicator is clearly visible but not intrusive

**Given** a product owner sees the change indicator
**When** they hover over the indicator
**Then** a tooltip displays "Story files have been modified. Click refresh to see latest changes."

**Given** a developer implements change detection
**When** the board loads or refreshes
**Then** the system stores a hash or timestamp of story data
**And** periodically checks (every 30s) or listens for file changes
**And** compares current state to stored state
**And** updates the change indicator based on comparison

**Given** a product owner views the board after changes are detected
**When** they look at individual story cards
**Then** stories that were added, updated, or removed are highlighted
**And** new stories show a "New" badge
**And** updated stories show an "Updated" badge
**And** removed stories (if previously visible) show a "Removed" indicator

**Given** a product owner refreshes the board
**When** the refresh completes
**Then** the change indicator is cleared
**And** story badges (New, Updated) are removed
**And** the board shows the current state

**Given** a developer implements the ChangeIndicator component
**When** the component renders
**Then** it exports as default from `src/components/ui/atoms/ChangeIndicator.tsx`
**And** accepts `hasChanges` boolean prop
**And** uses appropriate ARIA attributes for accessibility
**And** has a clear visual design (color, icon, animation)

**Given** change detection fails (e.g., API error)
**When** the system cannot determine if changes exist
**Then** the change indicator shows "Unable to check for changes"
**And** the refresh button remains functional
**And** the board continues to display cached data

---

### Story 4.3: Manual Refresh & Change Summary

As a **product owner,**
I want to manually refresh the board and see a summary of what changed
So that I can understand the impact of recent updates to the sprint.

**Acceptance Criteria:**

**Given** a product owner views the Kanban board
**When** they look at the header or toolbar
**Then** a "Refresh" button is visible
**And** the button shows an icon (e.g., refresh arrow) and/or text "Refresh"
**And** the button is accessible via keyboard (Tab + Enter)

**Given** a product owner clicks the Refresh button
**When** the refresh action starts
**Then** a loading spinner appears on the button
**And** the button is disabled during refresh
**And** the board content shows a loading state
**And** the refresh completes in < 1s

**Given** a refresh completes successfully
**When** changes were detected
**Then** a change summary modal or toast notification displays:

- "X new stories added"
- "Y stories updated"
- "Z stories removed"
  **And** the summary is dismissible
  **And** the summary auto-dismisses after 5 seconds
  **And** the board displays the updated data

**Given** a refresh completes successfully
**When** no changes were detected
**Then** a toast notification displays "No changes detected"
**And** the notification auto-dismisses after 3 seconds
**And** the board remains in current state

**Given** a refresh fails
**When** an error occurs (network, API, parsing)
**Then** an error message displays "Failed to refresh: [error details]"
**And** the error is logged to console
**And** the board continues to display cached data
**And** a retry option is available

**Given** a developer implements the refresh logic
**When** the Refresh button is clicked
**Then** the system calls `POST /api/refresh` endpoint
**And** the endpoint clears cache and re-parses BMAD files
**And** the endpoint returns updated data and change summary
**And** the UI updates with new data

**Given** a product owner uses keyboard shortcuts
**When** they press `Cmd/Ctrl + R` or `F5`
**Then** the board refreshes (same as clicking Refresh button)
**And** the browser page reload is prevented (if possible)
**And** the change summary displays if changes detected

**Given** a developer implements the ChangeSummary component
**When** the component renders
**Then** it exports as default from `src/components/ui/molecules/ChangeSummary.tsx`
**And** accepts `changes` object with counts (added, updated, removed)
**And** displays changes in a readable format
**And** is accessible (ARIA live region for screen readers)

**Given** a product owner views the change summary
**When** they want to see more details
**Then** an optional "View Details" link expands the summary
**And** shows list of story IDs that were added, updated, or removed
**And** each story ID is clickable and opens the story detail modal

---

**Epic 4 Summary:** 3 stories created covering navigation and change detection
**FRs covered:** FR5, FR10, FR11, FR12
**Status:** ✅ Complete

---

## Epic Stories Summary

**Total MVP Epics:** 4
**Total MVP Stories:** 12

### Epic Breakdown:

- **Epic 1: Project Foundation** - 3 stories (FR13-17)
- **Epic 2: Sprint Visualization** - 3 stories (FR1-4)
- **Epic 3: Story Discovery** - 3 stories (FR6-8)
- **Epic 4: Navigation & Change Detection** - 3 stories (FR5, FR10-12)

### FR Coverage (MVP):

- ✅ FR1: Kanban board display
- ✅ FR2: Story distribution by lane
- ✅ FR3: PO-friendly status labels
- ✅ FR4: Lane-to-lane progression
- ✅ FR5: Epic filter
- ✅ FR6: Story detail view
- ✅ FR7: Acceptance criteria display
- ✅ FR8: Story navigation
- ✅ FR10: Change detection
- ✅ FR11: Manual refresh
- ✅ FR12: Change summary
- ✅ FR13: Project initialization
- ✅ FR14: API routes
- ✅ FR15: Data types
- ✅ FR16: Performance targets
- ✅ FR17: Zero-configuration

**Note:** FR9 (Story creation), FR18 (PO story creation), FR19 (Sprint planning integration), and FR20-26 (Phase 2/3 features) are not covered in MVP and will be implemented in Post-MVP epics.

---

**All MVP epics and stories have been created successfully.**

Do you have any questions about the epic structure, story breakdown, or acceptance criteria before proceeding to final validation?

**Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue
