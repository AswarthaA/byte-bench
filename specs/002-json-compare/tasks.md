---

description: "Task list for the JSON Compare vertical slice"
---

# Tasks: JSON Compare

**Input**: Design documents from `/specs/002-json-compare/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Included because the constitution requires multiple test cases, including invalid and edge cases.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the comparison page entrypoint and test target.

- [x] T001 Create the compare.html page shell with semantic landmarks and shared stylesheet reference
- [x] T002 [P] Add the pure comparison module and unit test file at src/json-compare.js and tests/unit/json-compare.test.js
- [x] T003 [P] Add a JSON Compare navigation link from the formatter page in index.html

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish tested recursive comparison semantics before UI work.

- [x] T004 Implement local parsing, semantic equality, path formatting, and difference classification in src/json-compare.js
- [x] T005 Add tests for identical key-order variants, changed values, additions/removals, invalid input, and nested arrays in tests/unit/json-compare.test.js

**Checkpoint**: Foundation ready - comparison results are deterministic and independently tested.

## Phase 3: User Story 1 - Compare two JSON documents (Priority: P1) 🎯 MVP

**Goal**: Show a clear semantic comparison with counts and path-based differences.

**Independent Test**: Load the example, compare, and verify a changed, added, and removed result with visible paths and values.

### Implementation for User Story 1

- [x] T006 [US1] Build the original/updated editors, compare controls, summary panel, and differences list in compare.html
- [x] T007 [US1] Render identical, different, and difference-record states in src/compare-app.js
- [x] T008 [US1] Wire compare action, example loading, and input counters to src/compare-app.js

**Checkpoint**: User Story 1 is independently functional and demonstrates the second ByteBench tool.

## Phase 4: User Story 2 - Fix invalid input (Priority: P1)

**Goal**: Provide side-specific, non-destructive JSON validation feedback.

**Independent Test**: Submit invalid JSON on either side and verify the side, location, hint, and preserved source text.

### Implementation for User Story 2

- [x] T009 [US2] Add side-specific parse error rendering and empty-input handling in src/compare-app.js
- [x] T010 [US2] Add accessible live status, invalid states, and editor labels in compare.html and src/compare-app.js
- [x] T011 [US2] Add comparison semantics, How it works, example, edge-case note, and FAQ content in compare.html

**Checkpoint**: User Stories 1 and 2 are independently understandable and safe to use.

## Phase 5: User Story 3 - Use and share comparison results (Priority: P2)

**Goal**: Complete the local comparison workflow with utility actions and privacy-safe sharing.

**Independent Test**: Compare the example, swap inputs, copy/download the report, reset, and share the tool URL without including JSON.

### Implementation for User Story 3

- [x] T012 [US3] Implement swap, reset, copy-report, and local download-report actions in src/compare-app.js
- [x] T013 [US3] Implement share-tool with URL-only native share and clipboard fallback in src/compare-app.js
- [x] T014 [US3] Add privacy note, action feedback, and related-tool navigation in compare.html

**Checkpoint**: All specified comparison stories are usable as one coherent tool.

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Align the new page with ByteBench quality and verify the feature.

- [x] T015 [P] Add compare-page responsive layout, focus states, output wrapping, and mobile editor sizing in src/styles.css
- [x] T016 [P] Add page metadata and descriptive title for JSON Compare in compare.html
- [x] T017 Run npm test, node syntax checks, and every scenario in specs/002-json-compare/quickstart.md
- [x] T018 Review the implementation against .specify/memory/constitution.md and mark this task list complete

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup and blocks user stories.
- **User Stories (Phase 3+)**: Depend on Foundational; US1 is the MVP, US2 adds trust, and US3 completes the workflow.
- **Polish (Phase 6)**: Depends on all user stories.

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Phase 2 only.
- **User Story 2 (P1)**: Depends on the editor shell from US1 and shared parser behavior.
- **User Story 3 (P2)**: Depends on the result and status elements from US1 and US2.

### Parallel Opportunities

- T002 and T003 can proceed in parallel after the page directory exists.
- T004 and T005 can proceed in parallel after their files exist, with tests expected to fail before T004 is complete.
- T015 and T016 can proceed in parallel after the stories are implemented.

## Implementation Strategy

1. Complete Setup and Foundational phases.
2. Complete US1 and verify semantic diff output.
3. Add US2 for safe invalid-input handling.
4. Add US3 for the full local workflow.
5. Run the quickstart and constitutional review.
