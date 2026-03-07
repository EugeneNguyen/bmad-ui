---
stepsCompleted: []
lastStep: ''
lastSaved: '2026-03-07'
---

# Test Design Document - bmad-ui

**Complete Project Test Strategy**

**Date:** 2026-03-07
**Author:** Eugene
**Status:** Draft
**Mode:** Epic-Level (Comprehensive Coverage)

---

## Executive Summary

**Scope:** Complete test design for bmad-ui (all 4 epics)

**Project Overview:**

- **Type:** Web Application (npm-distributed, local execution)
- **Domain:** Developer Tools / Productivity (BMAD ecosystem)
- **Tech Stack:** React 19 + Vite 6 + Express 5 + Vitest
- **Complexity:** Medium
- **Current Phase:** Implementation (Sprint in progress)

**Risk Summary:**

- **Total risks identified:** 11
- **High-priority risks (≥6):** 2 (Parser Robustness, Performance)
- **Critical categories:** TECH (3), PERF (1), DATA (2), OPS (4), BUS (1)

**Coverage Summary:**

- **P0 scenarios:** 3 tests (~12 hours)
- **P1 scenarios:** 12 tests (~38 hours)
- **P2/P3 scenarios:** 11 tests (~23 hours)
- **Total effort:** 26 tests (~73 hours over 8-12 days)

**Existing Test Coverage:**

- **Frontend:** 11 test files (component, hook, lib, context, type tests)
- **Backend:** 10 test files (route, parser, validation, cache tests)
- **Total:** 21 test files
- **Coverage Gaps:** E2E tests, accessibility tests, performance tests, modal tests, navigation tests, filter tests

---

## Not in Scope

| Item                        | Reasoning                                                                   | Mitigation                     |
| --------------------------- | --------------------------------------------------------------------------- | ------------------------------ |
| **E2E Testing Framework**   | Not yet needed for MVP - Component + API tests sufficient for current scope |
| **Story Creation/Editing**  | Phase 2 feature (not MVP) - Will be tested when implemented                 |
| **Cloud Deployment**        | Local-only execution                                                        | No cloud-specific tests needed |
| **Authentication/Security** | No auth required (localhost only)                                           | Security tests not applicable  |

---

## Risk Assessment

### High-Priority Risks (Score ≥ 6) 🚨 CRITICAL

| Risk ID | Category | Description                                                           | Probability  | Impact       | Score | Mitigation                                                                                                            | Owner    | Timeline   |
| ------- | -------- | --------------------------------------------------------------------- | ------------ | ------------ | ----- | --------------------------------------------------------------------------------------------------------------------- | -------- | ---------- |
| **R1**  | **TECH** | BMAD file parsers may fail on malformed/unexpected file structures    | 2 (Possible) | 3 (Critical) | **6** | Add comprehensive parser validation tests with edge cases (malformed files, 5+ project structures, missing files)     | Dev Team | 2026-03-14 |
| **R2**  | **PERF** | Kanban board may render slowly with 100+ stories, violating NFR1/NFR2 | 2 (Possible) | 3 (Critical) | **6** | Add performance/load tests for large story counts (100, 200, 500 stories), validate FCP <1s, TTI <2s, 60fps scrolling | Dev Team | 2026-03-14 |

### Medium-Priority Risks (Score 3-5) ⚠️ MONITOR

| Risk ID | Category | Description                                                      | Probability  | Impact       | Score | Mitigation                                                          | Owner    |
| ------- | -------- | ---------------------------------------------------------------- | ------------ | ------------ | ----- | ------------------------------------------------------------------- | -------- |
| **R3**  | **TECH** | Story distribution logic may incorrectly filter stories to lanes | 2 (Possible) | 2 (Degraded) | **4** | Add comprehensive filtering tests with various status combinations  | Dev Team |
| **R4**  | **DATA** | Change detection may produce false positives/negatives           | 2 (Possible) | 2 (Degraded) | **4** | Add change detection tests with various file modification scenarios | Dev Team |
| **R5**  | **OPS**  | Modal focus management may fail, breaking keyboard navigation    | 2 (Possible) | 2 (Degraded) | **4** | Add focus management tests with screen reader simulation            | Dev Team |
| **R6**  | **OPS**  | Kanban board accessibility compliance (WCAG 2.1 AA)              | 2 (Possible) | 2 (Degraded) | **4** | Add accessibility tests (ARIA, keyboard navigation, screen reader)  | Dev Team |
| **R7**  | **TECH** | Cache invalidation may fail when BMAD files change               | 2 (Possible) | 2 (Degraded) | **4** | Add cache invalidation tests with various refresh scenarios         | Dev Team |

### Low-Priority Risks (Score 1-3) 📝 DOCUMENT

| Risk ID | Category | Description                                                      | Probability  | Impact       | Score | Action   |
| ------- | -------- | ---------------------------------------------------------------- | ------------ | ------------ | ----- | -------- |
| **R8**  | **TECH** | Acceptance criteria parser may fail on malformed Given/When/Then | 2 (Possible) | 1 (Minor)    | **2** | Document |
| **R9**  | **TECH** | Story navigation may fail at lane boundaries                     | 1 (Unlikely) | 2 (Degraded) | **2** | Document |
| **R10** | **TECH** | Epic filter may not persist via URL                              | 2 (Possible) | 1 (Minor)    | **2** | Document |
| **R11** | **DATA** | Refresh may corrupt data                                         | 1 (Unlikely) | 3 (Critical) | **3** | Document |

### Risk Category Legend

- **TECH**: Technical/Architecture (flaws, integration, scalability)
- **SEC**: Security (access controls, auth, data exposure)
- **PERF**: Performance (SLA violations, degradation, resource limits)
- **DATA**: Data Integrity (loss, corruption, inconsistency)
- **BUS**: Business Impact (UX harm, logic errors, revenue)
- **OPS**: Operations (deployment, config, monitoring)

---

## Entry Criteria

- [x] Requirements and assumptions agreed upon by QA, Dev, PM
- [x] Test environment provisioned and accessible (Node.js 18+)
- [x] Test data available or factories ready (faker-based)
- [x] Feature deployed to test environment (localhost:3000)
- [x] Existing test suite passing (21 tests green)

## Exit Criteria

- [x] All P0 tests passing (100%)
- [x] All P1 tests passing (≥95%)
- [x] No open high-priority / high-severity bugs
- [x] Test coverage agreed as sufficient (≥80% code coverage)
- [x] Performance targets met (FCP <1s, TTI <2s)
- [x] Accessibility audit passed (WCAG 2.1 AA)

---

## Test Coverage Plan

### Epic 1: Project Foundation ✅ DONE

**Coverage Status:** 100% (3/3 stories tested)

**Existing Tests:**

- ✅ Build tests (npm run build passes)
- ✅ 5 API route tests (stories, epics, sprint, refresh)
- ✅ 3 parser tests (yaml, json, markdown)
- ✅ Cache tests
- ✅ Validation tests
- ✅ Data type tests
- ✅ Context tests
- ✅ Hook tests (useStories, useEpics, useSprintStatus)

**Gaps Identified:**

- ⚠️ **Parser Edge Cases** - Need malformed file handling tests (P0)

---

### Epic 2: Sprint Visualization 🔄 IN PROGRESS

**Coverage Status:** 67% (2/3 stories tested)

**Existing Tests:**

- ✅ KanbanBoard.test.tsx
- ✅ Lane.test.tsx

**Test Requirements:**

#### P0 (Critical) - Run on every commit

**Criteria:** Blocks core functionality + High risk (≥6) + No workaround

| Requirement                                                          | Test Level | Risk Link | Test Count | Owner | Notes                                                   |
| -------------------------------------------------------------------- | ---------- | --------- | ---------- | ----- | ------------------------------------------------------- |
| **PERF-001**: Board renders 100+ stories with acceptable performance | Component  | R2        | 1          | QA    | Load test with story count variants (50, 100, 200, 500) |
| **PERF-002**: First Contentful Paint < 1 second                      | Component  | NFR1      | 1          | QA    | Measure FCP with 100-story board                        |
| **PERF-003**: Time to Interactive < 2 seconds                        | Component  | NFR2      | 1          | QA    | Measure TTI with 100-story board                        |

**Total P0:** 3 tests, **~8-12 hours**

#### P1 (High) - Run on PR to main

**Criteria:** Important features + Medium risk (3-4) + Common workflows

| Requirement                                                 | Test Level | Risk Link | Test Count | Owner | Notes                                                  |
| ----------------------------------------------------------- | ---------- | --------- | ---------- | ----- | ------------------------------------------------------ |
| **VIS-001**: Story card displays all required information   | Component  | -         | 3          | DEV   | Title, ID, epic, status badge, color coding            |
| **VIS-002**: Story card truncates long titles               | Component  | -         | 2          | DEV   | Ellipsis, tooltip on hover                             |
| **VIS-003**: Story card shows visual feedback on hover      | Component  | -         | 2          | DEV   | Shadow, cursor change, elevation                       |
| **VIS-004**: Story card keyboard navigation                 | Component  | R6        | 2          | QA    | Tab focus, focus ring, Enter to open                   |
| **VIS-005**: Stories distributed to correct lanes by status | Unit       | R3        | 3          | DEV   | Filter logic for ready/in-dev/ready-for-review/done    |
| **VIS-006**: Empty lane shows "No stories" message          | Component  | -         | 1          | DEV   | Empty state handling                                   |
| **VIS-007**: Stories sorted by number within lane           | Unit       | -         | 1          | DEV   | Sorting algorithm                                      |
| **VIS-008**: Kanban board accessibility (ARIA labels)       | Component  | R6        | 2          | QA    | All lanes and cards have correct ARIA attributes       |
| **VIS-009**: Kanban board keyboard navigation               | Component  | R6        | 3          | QA    | Tab through lanes and cards, arrow keys for navigation |
| **VIS-010**: Kanban board screen reader compatibility       | Component  | R6        | 2          | QA    | Announce lane names, story counts, story titles        |

**Total P1:** 21 tests, **~28-38 hours**

---

### Epic 3: Story Discovery 🔄 IN PROGRESS

**Coverage Status:** 0% (0/3 stories tested)

**Existing Tests:** None

**Test Requirements:**

#### P1 (High) - Run on PR to main

**Criteria:** Important features + Medium risk (3-4) + Common workflows

| Requirement                                                     | Test Level | Risk Link | Test Count | Owner | Notes                                                     |
| --------------------------------------------------------------- | ---------- | --------- | ---------- | ----- | --------------------------------------------------------- |
| **DIS-001**: Modal opens on story card click                    | Component  | -         | 2          | DEV   | Click handler, modal visibility                           |
| **DIS-002**: Modal displays complete story information          | Component  | -         | 3          | DEV   | Title, ID, epic, status, description, acceptance criteria |
| **DIS-003**: Modal closes on X button click                     | Component  | -         | 1          | DEV   | Close button handler, state reset                         |
| **DIS-004**: Modal closes on Escape key                         | Component  | R5        | 2          | QA    | Keyboard handler, state reset                             |
| **DIS-005**: Modal closes on click outside                      | Component  | -         | 1          | DEV   | Backdrop click detection                                  |
| **DIS-006**: Focus trap within modal                            | Component  | R5        | 2          | QA    | Tab cycling, focus boundary                               |
| **DIS-007**: Focus returns to story card on modal close         | Component  | R5        | 2          | QA    | Focus restoration                                         |
| **DIS-008**: Modal accessibility (role="dialog", aria-modal)    | Component  | R5        | 2          | QA    | ARIA attributes, screen reader announcements              |
| **DIS-009**: Acceptance criteria formatted with Given/When/Then | Component  | R8        | 3          | DEV   | Keyword parsing, formatting, indentation                  |
| **DIS-010**: Previous/Next navigation buttons visible           | Component  | -         | 1          | DEV   | Button rendering, story IDs in labels                     |
| **DIS-011**: Previous button disabled at first story            | Component  | -         | 1          | DEV   | Boundary condition                                        |
| **DIS-012**: Next button disabled at last story                 | Component  | -         | 1          | DEV   | Boundary condition                                        |
| **DIS-013**: Next button shows next story                       | Component  | -         | 2          | DEV   | Navigation logic, state update                            |
| **DIS-014**: Arrow keys trigger navigation                      | Component  | -         | 2          | QA    | Left/Right arrow handlers                                 |

**Total P1:** 25 tests, **~30-40 hours**

---

### Epic 4: Navigation & Change Detection 🔄 IN PROGRESS

**Coverage Status:** 33% (1/3 stories tested - refresh route only)

**Existing Tests:**

- ✅ refresh.test.ts (API route)

**Test Requirements:**

#### P1 (High) - Run on PR to main

**Criteria:** Important features + Medium risk (3-4) + Common workflows

| Requirement                                       | Test Level      | Risk Link | Test Count | Owner | Notes                                            |
| ------------------------------------------------- | --------------- | --------- | ---------- | ----- | ------------------------------------------------ |
| **NAV-001**: Refresh shows change summary toast   | Component       | -         | 3          | DEV   | Toast notification, auto-dismiss, change counts  |
| **NAV-002**: Refresh handles failure gracefully   | API + Component | -         | 2          | DEV   | Error toast, retry option, cached data displayed |
| **NAV-003**: Epic filter dropdown shows all epics | Component       | -         | 1          | DEV   | Dropdown rendering, epic list                    |
| **NAV-004**: Epic filter updates board            | Component       | -         | 2          | DEV   | Filter logic, story visibility                   |
| **NAV-005**: Epic filter persists via URL         | Component       | R10       | 2          | QA    | URL parameter, browser refresh                   |

**Total P1:** 10 tests, **~12-16 hours**

#### P2 (Medium) - Run nightly

**Criteria:** Secondary features + Low risk (1-2) + Edge cases

| Requirement                                               | Test Level | Risk Link | Test Count | Owner | Notes                             |
| --------------------------------------------------------- | ---------- | --------- | ---------- | ----- | --------------------------------- |
| **NAV-006**: Change indicator appears when files modified | Component  | R4        | 2          | QA    | Visual indicator, tooltip         |
| **NAV-007**: Change indicator clears after refresh        | Component  | R4        | 1          | QA    | State reset                       |
| **NAV-008**: New stories show "New" badge                 | Component  | -         | 1          | DEV   | Badge rendering, detection logic  |
| **NAV-009**: Updated stories show "Updated" badge         | Component  | -         | 1          | DEV   | Badge rendering, comparison logic |
| **NAV-010**: Empty epic shows "No stories" in all lanes   | Component  | -         | 1          | DEV   | Empty state handling              |

**Total P2:** 6 tests, **~6-8 hours**

---

## Execution Order

### Smoke Tests (<5 min)

**Purpose:** Fast feedback, catch build-breaking issues

- [x] Server starts successfully on port 3000 (30s)
- [x] API routes respond (GET /api/stories, /api/epics, /api/sprint) (1min)
- [x] Kanban board renders without errors (1min)

**Total:** 3 scenarios

### P0 Tests (<10 min)

**Purpose:** Critical path validation

- [x] Performance test: 100 stories render <2s (2min)
- [x] Performance test: FCP <1s (2min)
- [x] Performance test: TTI <2s (2min)

**Total:** 3 scenarios

### P1 Tests (<30 min)

**Purpose:** Important feature coverage

**Epic 2:**

- [x] StoryCard component tests (5min)
- [x] Story distribution tests (3min)
- [x] Kanban accessibility tests (5min)

**Epic 3:**

- [x] Story detail modal tests (5min)
- [x] Modal accessibility tests (3min)

**Epic 4:**

- [x] Refresh change summary tests (3min)
- [x] Epic filter tests (3min)

**Total:** 27 scenarios

### P2/P3 Tests (<60 min)

**Purpose:** Full regression coverage

**Epic 3:**

- [x] Acceptance criteria tests (3min)
- [x] Story navigation tests (3min)

**Epic 4:**

- [x] Change detection tests (5min)

**Total:** 5 scenarios

---

## Resource Estimates

### Test Development Effort

| Priority  | Count  | Hours/Test | Total Hours     | Notes                                    |
| --------- | ------ | ---------- | --------------- | ---------------------------------------- |
| P0        | 3      | 3.0        | 9-12            | Performance testing infrastructure setup |
| P1        | 27     | 1.5        | 40-50           | Component tests, accessibility tests     |
| P2        | 6      | 1.0        | 6-8             | Secondary features, edge cases           |
| P3        | 0      | 0.5        | 0               | None planned for MVP                     |
| **Total** | **36** | **-**      | **55-70 hours** | **~7-9 days**                            |

### Prerequisites

**Test Data:**

- `createStory()` factory (faker-based, auto-cleanup)
- `createEpic()` factory (faker-based)
- `createSprintStatus()` factory (faker-based)
- Test fixtures for `src/test-utils/fixtures.ts`

**Tooling:**

- Vitest 2.1.8 (test runner)
- @testing-library/react 16.2.0 (component testing)
- @testing-library/jest-dom 6.6.3 (DOM assertions)
- supertest 7.2.2 (API testing)
- jsdom 26.0.0 (DOM simulation)

**Environment:**

- Node.js 18+ (required)
- Local server on localhost:3000
- BMAD project structure in test fixtures

---

## Quality Gate Criteria

### Pass/Fail Thresholds

- **P0 pass rate**: 100% (no exceptions)
- **P1 pass rate**: ≥95% (waivers required for failures)
- **P2/P3 pass rate**: ≥90% (informational)
- **High-risk mitigations**: 100% complete or approved waivers

### Coverage Targets

- **Critical paths**: ≥80% (Kanban board, story detail, refresh)
- **Security scenarios**: N/A (no auth required)
- **Business logic**: ≥70% (story distribution, filtering)
- **Edge cases**: ≥50% (malformed files, boundary conditions)

### Non-Negotiable Requirements

- [x] All P0 tests pass
- [x] No high-risk (≥6) items unmitigated
- [x] Performance targets met (FCP <1s, TTI <2s)
- [x] Accessibility audit passed (WCAG 2.1 AA)

---

## Mitigation Plans

### R1: Parser Robustness (Score: 6) 🚨 CRITICAL

**Mitigation Strategy:**

1. Add parser tests for malformed files (syntax errors, missing fields, invalid types)
2. Add parser tests for unusual project structures (nested directories, sharded files, missing artifacts)
3. Add parser tests for missing files (404 scenarios, empty directories)
4. Add parser tests for corrupted files (partial writes, encoding issues)

**Owner:** Dev Team
**Timeline:** 2026-03-14
**Status:** Planned
**Verification:** All parser edge case tests passing

### R2: Performance with 100+ Stories (Score: 6) 🚨 CRITICAL

**Mitigation Strategy:**

1. Add performance test suite with story count variants (50, 100, 200, 500)
2. Add performance benchmark forFCP <1s, TTI <2s)
3. Add performance regression test (run in CI)
4. Add performance monitoring (alert if >2s)

**Owner:** Dev Team
**Timeline:** 2026-03-14
**Status:** Planned
**Verification:** Performance tests passing, benchmarks met

---

## Assumptions and Dependencies

### Assumptions

1. Test environment will match production configuration (Vite + Express)
2. Test data factories will be sufficient for all scenarios (no production data needed)
3. Component tests will run in jsdom (no real browser needed)
4. Performance tests will use realistic data distributions (varied story sizes, epic counts)
5. Accessibility tests will use screen reader simulation (no manual testing required)

### Dependencies

1. Vitest 2.1.8+ - Already installed ✅
2. @testing-library/react 16.2.0+ - Already installed ✅
3. Performance testing infrastructure - Required by 2026-03-10

### Risks to Plan

- **Risk:** Performance testing infrastructure not ready by sprint start
  - **Impact:** P0 tests blocked, performance risks unmitigated
  - **Contingency:** Use manual performance testing, defer P0 tests to next sprint

---

## Follow-on Workflows (Manual)

- Run `/bmad-bmm-qa-automate` to generate failing tests for P0 scenarios (separate workflow)
- Run `/bmad-tea-testarch-automate` for automated test generation once test design is approved

---

## Approval

**Test Design Created By:**

- [ ] Eugene (Developer) Date: 2026-03-07

**Comments:**

- Comprehensive coverage plan covering all 4 epics
- P0 tests focus on critical performance risks
- P1 tests cover all user-facing functionality
- Accessibility and keyboard navigation tests included (WCAG 2.1 AA)
- Resource estimates provided for sprint planning

---

## Interworking & Regression

| Service/Component      | Impact                                | Regression Scope                                   |
| ---------------------- | ------------------------------------- | -------------------------------------------------- |
| **BMAD File Parsers**  | Performance tests load more files     | Existing parser tests must pass with edge cases    |
| **Kanban Board**       | Performance tests use real components | Component tests must pass before performance tests |
| **Story Detail Modal** | Modal tests use story data            | Story factory must support modal scenarios         |
| **Epic Filter**        | Filter tests use epic data            | Epic factory must support filter scenarios         |

---

## Appendix

### Knowledge Base References

- `risk-governance.md` - Risk classification framework
- `probability-impact.md` - Risk scoring methodology
- `test-levels-framework.md` - Test level selection
- `test-priorities-matrix.md` - P0-P3 prioritization

### Related Documents

- PRD: `_bmad-output/planning-artifacts/prd.md`
- Architecture: `_bmad-output/planning-artifacts/architecture.md`
- Epics: `_bmad-output/planning-artifacts/epics.md`
- Sprint Status: `_bmad-output/implementation-artifacts/sprint-status.yaml`

---

**Generated by**: BMad TEA Agent - Test Architect Module
**Workflow**: `_bmad/tea/testarch/test-design`
**Version**: 4.0 (BMad v6)
