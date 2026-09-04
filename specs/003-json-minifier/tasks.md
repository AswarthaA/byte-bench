---

description: "Task list for the JSON Minifier vertical slice"
---

# Tasks: JSON Minifier / Whitespace Remover

**Input**: Design documents from `/specs/003-json-minifier/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Included because the constitution requires valid, invalid, and edge-case test coverage.

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Create minify.html with semantic page structure and shared stylesheet reference
- [x] T002 [P] Add src/json-minifier.js and tests/unit/json-minifier.test.js
- [x] T003 [P] Link JSON Minifier from index.html and compare.html

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T004 Implement local parse-and-serialize minification and size metrics in src/json-minifier.js
- [x] T005 Add tests for valid JSON, invalid JSON, whitespace-in-string preservation, primitives, and empty containers in tests/unit/json-minifier.test.js

**Checkpoint**: Foundation ready - pure minification is tested independently of the page.

## Phase 3: User Story 1 - Minify valid JSON (Priority: P1) 🎯 MVP

**Goal**: Turn readable JSON into compact valid JSON with obvious output and metrics.

**Independent Test**: Load the example and confirm one-line output, identical parsed value, and size savings.

- [x] T006 [US1] Build the input/output panels, size metrics, and primary actions in minify.html
- [x] T007 [US1] Wire minification, validation, example loading, and counters in src/minify-app.js
- [x] T008 [US1] Render valid output and reduction summary in src/minify-app.js

**Checkpoint**: User Story 1 is independently functional.

## Phase 4: User Story 2 - See and fix validation errors (Priority: P1)

**Goal**: Explain malformed or empty input without replacing the source.

**Independent Test**: Submit malformed and empty inputs and verify error state, hints, and preserved text.

- [x] T009 [US2] Add invalid-state rendering, empty-input handling, and parser location hints in src/minify-app.js
- [x] T010 [US2] Add accessible labels, live status, How it works, edge-case note, and FAQ in minify.html

**Checkpoint**: User Stories 1 and 2 are transparent and independently testable.

## Phase 5: User Story 3 - Use the compact result (Priority: P2)

**Goal**: Provide local result actions, size feedback, and privacy-safe sharing.

**Independent Test**: Minify the example, copy/download/reset/share, and verify visible feedback with no URL payload.

- [x] T011 [US3] Implement Copy, local Download, Reset, and Share tool in src/minify-app.js
- [x] T012 [US3] Add privacy note, action feedback, and related-tool navigation in minify.html

**Checkpoint**: All specified minifier stories are complete.

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T013 [P] Add minifier-specific responsive layout, focus states, and compact output wrapping in src/styles.css
- [x] T014 [P] Add metadata and descriptive title for the minifier page in minify.html
- [x] T015 Run npm test, syntax checks, static serving, and every scenario in specs/003-json-minifier/quickstart.md
- [x] T016 Review implementation against .specify/memory/constitution.md and mark this task list complete

## Dependencies & Execution Order

- Setup has no dependencies.
- Foundational depends on Setup and blocks all stories.
- US1 depends on Foundational; US2 depends on the shared page/editor; US3 depends on the result controls.
- Polish depends on all user stories.

## Parallel Opportunities

- T002 and T003 can run in parallel after the page directory exists.
- T004 and T005 can run in parallel after their files exist, with tests expected to fail before implementation is complete.
- T013 and T014 can run in parallel after the stories are implemented.

## Implementation Strategy

1. Build and test the pure minifier.
2. Deliver the valid-input MVP.
3. Add transparent invalid-input handling.
4. Add local actions, privacy messaging, help content, and navigation.
5. Run all checks and the quickstart.
