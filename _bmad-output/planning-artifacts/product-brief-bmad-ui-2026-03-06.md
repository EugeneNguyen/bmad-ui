---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments: []
date: 2026-03-06
author: Eugene
---

# Product Brief: bmad-ui

_A visual web interface that democratizes BMAD for product owners and stakeholders_

## Executive Summary

BMAD is a powerful methodology for AI-driven software development, but it is currently accessible only through technical interfaces like CLI or developer-focused platforms. This excludes non-technical stakeholders from meaningful participation in the development process.

bmad-ui bridges this gap by providing a visual web interface that democratizes BMAD access for product owners and business stakeholders. Starting with a view-only Kanban board that provides real-time visibility into sprint progress, bmad-ui enables non-technical users to finally participate in the development workflow without learning command-line interfaces or relying on technical translations.

**Core Vision:** Dominate the BMAD ecosystem by building the essential visual interface that product owners use to collaborate with BMAD development teams.

---

## Core Vision

### Problem Statement

BMAD is powerful but locked behind technical interfaces (CLI, opencode), creating a barrier for non-technical stakeholders to participate meaningfully in the development process.

**Current Pain Points:**

- **No Visibility:** Non-technical team members cannot view BMAD outputs, story progress, or sprint status without technical assistance
- **Decision Delays:** Stakeholders are disconnected from real-time project information, slowing decision-making
- **Exclusion from Process:** Product owners cannot actively participate in the development workflow
- **Time-Consuming Workarounds:** Manual exports, status meetings, or relying on technical team members to translate progress

### Problem Impact

The technical interface barrier creates systemic issues:

- **Communication Gaps:** Technical and non-technical team members operate in silos with different views of project reality
- **Slower Iterations:** Decisions delayed waiting for status updates and translations between contexts
- **Reduced Ownership:** Product owners feel disempowered and disconnected from their product's development
- **Sync Issues:** Manual processes lead to outdated or incorrect status reporting

### Why Existing Solutions Fall Short

Generic project management tools (Jira, Trello, Linear) serve all users, regardless of technical sophistication. They:

- **Require manual data entry** - No native BMAD integration
- **Blur PM/PO distinction** - Don't optimize for product ownership specifically
- **Add overhead** - Another tool to maintain, sync, and configure
- **Miss BMAD context** - Can't show AI agent contributions, BMAD-specific story states, or sprint rhythm

### Proposed Solution

**MVP Phase: View-Only Kanban Board**

- Simple, intuitive Kanban interface showing BMAD stories and sprint status
- Real-time visibility into story progress (ready, in-dev, ready-for-review, done)
- Zero technical knowledge required - if you can use a browser, you can see your project
- Direct integration with BMAD artifacts (reads YAML/JSON files)
- Access via GitHub repo (pull, run `npx bmad-ui`, view in browser)
- Updates via git pull (manual refresh)

**Long-term Vision: Full Product Owner Platform**

- Enable product owners to create, edit, and manage stories directly through the UI
- Full project management capabilities integrated with BMAD workflows
- AI-assisted features supporting product owners in their decision-making
- Eventually enable product owners to work independently with AI support

### Key Differentiators

**1. Purpose-Built for BMAD Integration**

- Native understanding of BMAD story structure, epics, and sprint planning
- Direct integration with BMAD artifacts (no manual data entry)
- Designed specifically for BMAD workflows, not retrofitted generic PM tool
- Zero-configuration: works with any BMAD project structure
- No external dependencies or services required

**2. Product Owner First**

- Focused primarily on product owners and business stakeholders, not developers
- Removes technical barriers while preserving BMAD's power
- Designed for the person who owns the "what" and "why" of the product
- Visual-first design that non-technical users can understand immediately

**3. Democratizes BMAD Access**

- Makes BMAD's powerful AI-driven development methodology accessible to non-technical users
- Bridges the gap between technical execution and business oversight
- Enables true collaboration across technical and non-technical team members
- Uses existing GitHub workflow that teams already have

**4. Strategic Focus**

- **Dominate BMAD ecosystem** - not expand to other AI development tools
- **First-mover advantage** in creating non-technical interface for BMAD
- **Grassroots adoption** through developers sharing with their product owners
- **Speed to market** - establish presence before BMAD team builds their own UI
- **Simpler distribution** - no cloud hosting, direct repo access

**5. Distribution Innovation**

- **npm package** - Install via `npx bmad-ui` for zero friction
- **Local-first architecture** - Parse BMAD files from cloned repo
- **Viral share loop** - Developer shares → Product Owner engages → Team adopts
- **No infrastructure** - Just Node.js + npm, no backend services required

---

## Technical Architecture

### MVP Approach: Local-First with GitHub Sync

- **Phase 1 (Weeks 1-2):** Local viewer for developers
  - Parse BMAD files (YAML/JSON/Markdown)
  - Generate Kanban board in browser
  - Test with 5 developers to validate file parsing
- **Phase 2 (Weeks 3-4):** GitHub-synced workflow for product owners
  - Sarah pulls repo, runs `npx bmad-ui`
  - Validates visibility solves her problem
  - Refine based on PO feedback

### Technology Stack

- **Package Format:** Node.js + React bundled as single npm package
- **Distribution:** `npx bmad-ui` for instant access
- **Data Parsing:** Universal parser supporting YAML, JSON, Markdown
- **Architecture:** Local Express server serving React app
- **Update Mechanism:** Git pull + manual browser refresh

---

## Success Metrics

### User Success Metrics

**Sarah's Success (Primary User)**

- **Discovery Moment:** Runs `npx bmad-ui` and instantly sees sprint status she didn't know before
- **Behavioral Signals:**
  - Returns to the board daily or multiple times per week
  - References board in standups without asking developers for status
  - Shares board with other stakeholders (executives, other teams)
- **Success Outcome:** Answers stakeholder questions confidently without pinging developers

**Alex's Success (Secondary User)**

- **Discovery Moment:** Runs `npx bmad-ui` and sees his sprint visualized instantly
- **Behavioral Signals:**
  - Shares repo with Sarah instead of typing status summaries
  - Reports reduced interruption frequency from status requests
  - Mentions bmad-ui to other developers in BMAD community
- **Success Outcome:** Sarah stops asking "what's the status?" — hours reclaimed per week

### Business Objectives

**Primary Metric: GitHub Stars (Community Adoption)**

bmad-ui's success is measured by visibility and adoption within the BMAD developer ecosystem:

| Timeframe     | Target        | What It Signals                                                  |
| ------------- | ------------- | ---------------------------------------------------------------- |
| **3 months**  | 20,000 stars  | Rapid grassroots adoption, product-market fit validation         |
| **12 months** | 100,000 stars | De facto standard for BMAD visual interface, ecosystem dominance |

**Why GitHub Stars?**

- Open-source distribution model — stars = discoverability and trust
- Proxy for developer advocacy and word-of-mouth growth
- Directly tied to viral loop: developers discover → star → share → POs engage
- First-mover advantage measured by community visibility

### Key Performance Indicators

**MVP Launch (Weeks 1-4)**

| KPI                | Target                   | Measurement                                            |
| ------------------ | ------------------------ | ------------------------------------------------------ |
| npm downloads      | 1,000+ in first month    | `npx bmad-ui` executions tracked via npm               |
| GitHub stars       | 500+ in first month      | Community interest and validation                      |
| Developer feedback | 5+ successful test cases | Developers report parsing works on their BMAD projects |

**Growth Phase (Months 2-6)**

| KPI                 | Target                                        | Measurement                            |
| ------------------- | --------------------------------------------- | -------------------------------------- |
| GitHub stars growth | 5,000+ stars/month                            | GitHub repository metrics              |
| Active usage        | 100+ projects using bmad-ui                   | Community reports, GitHub discussions  |
| Team adoption       | 10+ teams report bmad-ui in standard workflow | Community feedback, GitHub discussions |

**Market Position (Months 6-12)**

| KPI                        | Target                                  | Message                                      | Measurement |
| -------------------------- | --------------------------------------- | -------------------------------------------- | ----------- |
| BMAD community penetration | 50%+ of BMAD users know bmad-ui         | Community surveys, Discord polls             |
| Developer advocacy         | 100+ community mentions/recommendations | GitHub discussions, Discord, Twitter         |
| Feature requests           | 50+ unique feature requests             | GitHub issues as signal of engaged user base |

### Leading Indicators (Predictive Metrics)

- **Week 1 npm downloads** → Predicts 3-month adoption curve
- **First 10 GitHub stars** → Early community validation
- **First 5 successful project tests** → Parsing robustness confirmed
- **First repeat user** → Product stickiness validated

---

## Market Position

**For** product owners and business stakeholders working with BMAD development teams  
**who** need visibility and engagement with AI-driven development workflows  
**bmad-ui** is the visual project management interface  
**that** provides real-time access to BMAD stories, sprints, and progress without technical barriers  
**unlike** generic project management tools retrofitted for development  
**our product** is purpose-built for BMAD workflows, giving product owners their power back

---

## Go-to-Market Strategy

### Phase 1: Grassroots Developer Adoption

- Engage in BMAD community (GitHub discussions, Discord)
- Provide instant value: developers see their sprint data beautifully visualized
- Encourage sharing: "Share with your product owner" feature

### Phase 2: Viral Growth

- Product owners experience the "aha moment" when seeing their project
- POs share with other teams: "You should try this"
- Community momentum builds awareness

### Phase 3: De Facto Standard

- bmad-ui becomes the essential accessory for BMAD teams
- New BMAD users discover it methodology through bmad-ui
- Market presence established before competitors notice

---

## Target Users

### Primary Users

#### Phase 1: Dave — The BMAD Developer (Distribution Channel)

Dave is a senior developer on Sarah's team. He lives in the terminal and uses BMAD daily. He's the one who installs bmad-ui first.

**Motivation:** Wants Sarah to have better information so the team makes faster, more informed decisions.

**Current Pain Points:**

- Spends 2-3 hours/week translating BMAD status into reports, screenshots, and Slack messages for Sarah
- Constantly interrupted for status updates — breaks his flow
- Manually translates YAML/JSON into human-readable updates for stakeholders

**Selfish Value:** Beautiful visualization of his own sprint data — uses it as his personal dashboard.

**Share Trigger:** "Sarah keeps asking for updates. If I give her this board, she can check it herself and I can focus on coding."

**What bmad-ui MVP Delivers:**

- Runs `npx bmad-ui` in his project folder
- Instantly sees current sprint AND full backlog visualized
- Uses it as his own sprint dashboard during development
- Tells Sarah: "Pull the repo and run this command"
- Gets back to coding. Sarah gets visibility. Both win.

**Success Moment:** Sarah stops pinging him for status. Sprint planning becomes faster because she comes prepared.

#### Phase 2: Sarah Chen — Startup Product Owner (Core Value Target)

Sarah is a product owner at a startup with 3+ years PO experience. Non-technical, domain expert. Her team (2+ developers) uses BMAD daily, mix of remote and colocated. She attends daily standups.

**The Trust Problem:** Sarah currently uses Jira but _doesn't trust the status_ — developers forget to update it, data is stale. She opens a tool she doesn't believe in.

**bmad-ui's Superpower: TRUST.** Because it reads directly from BMAD files, the data is always accurate. No manual updates, no stale tickets. Sarah opens bmad-ui and thinks: _"This is the truth."_

**Current Pain Points:**

- **The Trust Gap:** Uses Jira but doesn't trust the status — data is stale and unreliable
- **The Status Dance:** Pings developers 3-4 times per week, waits for meetings to get real information
- **Decision Delays:** Can't make timely decisions because she lacks current, trustworthy information
- **Emotional Impact:** Frustrated, anxious, disconnected from her own product

**Daily Routine (Current):**

1. Morning: Opens Jira, sees stale data, doesn't trust it
2. Pings Dave on Slack: "Hey, what's the status on the payment story?"
3. Waits 30-60 minutes for response
4. Gets partial answer, asks follow-up questions
5. Attends standup to finally get the real picture
6. Makes decisions based on information that's already hours old

**Daily Routine (With bmad-ui):**

1. Morning: Opens bmad-ui with coffee — sees LIVE status from BMAD files
2. Trusts what she sees because it's the single source of truth
3. Sees "What's Changed" — 2 stories moved to "Being Built"
4. Clicks into a story to review acceptance criteria
5. Comes to standup PREPARED with specific questions
6. Makes decisions in real-time based on accurate information

**PO-Friendly Language Mapping:**

| BMAD Term        | bmad-ui Display      |
| ---------------- | -------------------- |
| ready            | Ready to Start       |
| in-dev           | Being Built          |
| ready-for-review | Needs Your Attention |
| done             | Complete             |
| blocked          | Blocked              |

**What bmad-ui MVP Delivers:**

- Pulls the GitHub repo and runs `npx bmad-ui`
- Opens browser, sees clean Kanban board with PO-friendly language
- Stories grouped by epic, filterable by sprint — sees both current sprint AND full backlog
- Clicks any story to see title, description, status, acceptance criteria
- "What's Changed" indicator shows what moved since last visit
- Knows exactly where things stand without pinging developers

**Success Vision:**

- _"I finally trust what I see"_ — Data comes directly from BMAD files, always accurate
- _"I check it 3-4 times a day and it's always fresh"_
- _"I stopped pinging Dave for status updates"_
- _"I come to sprint planning prepared and confident"_

**"Aha! Moment":** Sarah opens the board, sees a story moved to "Being Built" that she wasn't aware of. She thinks: _"This is real. This is happening RIGHT NOW. And I didn't have to ask anyone."_

**Future Vision (Post-MVP):**

- Create and edit stories directly on the board
- See test evidence (screenshots, outputs, pass/fail) attached to stories
- Test features herself through an integrated preview
- Trigger release decisions with full context at her fingertips

### Secondary Users

**1. Technical Lead / Engineering Manager**

- Reduced translation overhead between technical and business language
- Clear visual communication for stakeholders
- Less time explaining status, more time building

**2. Startup Founders / Executives**

- Direct access to sprint progress without technical intermediary
- Ability to ask informed questions based on real data
- Better investor communication with tangible progress

### User Journey

**Dave's Journey (Phase 1 — Developer First)**

| Phase              | Experience                                                                   |
| ------------------ | ---------------------------------------------------------------------------- |
| **Discovery**      | Hears about bmad-ui in BMAD community (Discord, GitHub, colleague)           |
| **Onboarding**     | Runs `npx bmad-ui` — instantly sees sprint + backlog visualized, zero config |
| **Core Usage**     | Uses as personal sprint dashboard; keeps it open while working               |
| **Share Trigger**  | "Sarah keeps asking for updates — let me give her this board"                |
| **Success Moment** | Sarah stops asking for status — hours reclaimed for coding                   |
| **Long-term**      | bmad-ui becomes standard BMAD workflow; tells other developers               |

**Sarah's Journey (Phase 2 — Product Owner Access)**

| Phase              | Experience                                                                     |
| ------------------ | ------------------------------------------------------------------------------ |
| **Discovery**      | Dave says: "Pull the repo and run `npx bmad-ui`"                               |
| **Onboarding**     | Runs `npx bmad-ui` — sees clean Kanban with PO-friendly language, zero config  |
| **Core Usage**     | Checks board 3-4x daily; references in standups; uses "What's Changed" feature |
| **Success Moment** | Answers stakeholder questions confidently without pinging developers           |
| **Long-term**      | Board becomes single source of truth; shares with executives                   |

**The Viral Loop:**

Dave discovers → Uses as personal dashboard → Shares with Sarah → Sarah trusts the data → Sarah stops pinging Dave → Dave tells other developers → They share with their POs → Growth spreads through BMAD community.

**Key Design Principle:**

> Design for Sarah from Day 1, even though only Dave sees it in Phase 1. The UI must be non-technical-friendly from the start.

---

## MVP Scope

### Core Features

| Feature              | Description                                                                                   | User Value                                                          |
| -------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **BMAD File Parser** | Reads YAML/JSON/Markdown from local BMAD artifacts                                            | Zero config — works with any BMAD project structure                 |
| **Kanban Board UI**  | Clean, intuitive board showing stories by status lane (ready, in-dev, ready-for-review, done) | Sarah instantly sees sprint status without asking developers        |
| **Story Details**    | Click any story to see title, description, status, acceptance criteria                        | Full context on each story without opening source files             |
| **Epic Grouping**    | Stories visually grouped by epic                                                              | Sarah understands how stories relate to larger features/initiatives |
| **Sprint Filter**    | Filter board to show specific sprint                                                          | Focus on current iteration without noise from other sprints         |
| **Local Server**     | `npx bmad-ui` launches Express server serving React app                                       | Simplest possible architecture, faster delivery                     |
| **Manual Refresh**   | Pull repo updates via git, refresh browser to see changes                                     | Sufficient for MVP; reduces complexity                              |

### Out of Scope for MVP

| Feature                             | Why Deferred                                                | Future Phase               |
| ----------------------------------- | ----------------------------------------------------------- | -------------------------- |
| **Cloud sharing / shareable links** | Adds backend complexity; GitHub workflow is simpler for MVP | Phase 3-4 (if needed)      |
| **Real-time updates / WebSockets**  | Manual refresh via git pull is sufficient for MVP           | Phase 3-4 (if needed)      |
| **Authentication**                  | Trust GitHub repo access control                            | Phase 4+ (if needed)       |
| **Story Creation/Editing**          | Sarah views only — creation happens in BMAD workflow        | Phase 2-3 (PO empowerment) |
| **Test Evidence Viewing**           | Requires BMAD test integration                              | Phase 3-4 (PO empowerment) |
| **Self-Testing Features**           | Requires staging environment integration                    | Phase 4+ (PO empowerment)  |
| **Release Decision Triggers**       | Requires workflow integration                               | Phase 4+ (PO empowerment)  |

### MVP Success Criteria

**Validated when:**

- Sarah can run `npx bmad-ui` and see her sprint board within 30 seconds
- All stories from BMAD artifacts appear correctly on the board
- Epic grouping and sprint filtering work as expected
- Story details (title, description, status, acceptance criteria) are accessible
- Manual refresh workflow (git pull → browser refresh) works reliably
- 5 developers successfully test with their real BMAD projects

### Future Vision

**Phase 2: PO Empowerment (Months 2-3)**

- Story creation and editing directly in the UI
- Modify acceptance criteria through visual editor
- Re-prioritize stories via drag-and-drop

**Phase 3: Test & Release Integration (Months 4-6)**

- View test evidence (screenshots, logs, pass/fail) attached to stories
- Self-test features through integrated staging preview
- Trigger release decisions with full context

**Phase 4: AI-Assisted PO Platform (Months 6-12)**

- AI-assisted story writing and refinement
- Independent PO workflow with AI support
- De facto standard for BMAD visual interface
- 100k GitHub stars — ecosystem dominance achieved

---

<!-- Content will be appended sequentially through collaborative workflow steps -->
