---

description: "Task list for the JSON Formatter & Validator vertical slice"
---

# Tasks: JSON Formatter & Validator

**Input**: Design documents from `/specs/001-json-formatter-validator/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Included because the constitution requires at least three test cases, including invalid input and edge cases.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the minimal static application and offline test entrypoint.

- [x] T001 Create the root static web app entrypoint in index.html with semantic landmark structure
- [x] T002 [P] Add package scripts for the built-in Node test runner in package.json
- [x] T003 [P] Add JavaScript module and test directories at src/ and tests/unit/

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create shared styling and pure JSON behavior used by every user story.

- [x] T004 [P] Define ByteBench visual tokens, responsive layout, focus states, and form/button styles in src/styles.css
- [x] T005 Implement pure parse, format, and error-location helpers in src/json-formatter.js
- [x] T006 [P] Add unit tests for valid formatting, invalid JSON, and edge-case JSON in tests/unit/json-formatter.test.js

**Checkpoint**: Foundation ready - the formatter module and its tests can run independently of the UI.

## Phase 3: User Story 1 - Format valid JSON (Priority: P1) 🎯 MVP

**Goal**: Let a visitor format valid JSON with a selected indentation style.

**Independent Test**: Load the example, click Format JSON, and confirm valid status plus readable output; switch indentation and confirm output changes without semantic changes.

### Implementation for User Story 1

- [x] T007 [US1] Build the input, output, indentation controls, and primary format/validate actions in index.html
- [x] T008 [US1] Wire valid JSON formatting and indentation changes to the UI in src/app.js
- [x] T009 [US1] Add valid-state status text, output labeling, and load-example interaction in src/app.js

**Checkpoint**: User Story 1 is independently functional and demonstrates the first ByteBench tool.

## Phase 4: User Story 2 - Understand invalid JSON (Priority: P1)

**Goal**: Explain malformed JSON without altering or hiding the user’s input.

**Independent Test**: Submit malformed JSON and confirm invalid status, a helpful message with line/column when available, and unchanged input.

### Implementation for User Story 2

- [x] T010 [US2] Add invalid-state rendering, empty-input handling, and correction hints in src/app.js
- [x] T011 [US2] Add accessible status announcements and invalid-output empty state in index.html and src/app.js
- [x] T012 [US2] Add How it works, JSON syntax example, edge-case note, and FAQ copy in index.html

**Checkpoint**: User Stories 1 and 2 both work independently and transparently.

## Phase 5: User Story 3 - Use and trust the result (Priority: P2)

**Goal**: Complete the local workflow with copy, download, reset, share, and privacy affordances.

**Independent Test**: Format valid JSON, activate each action, and confirm success/fallback messaging without network or persistence.

### Implementation for User Story 3

- [x] T013 [US3] Implement clipboard copy and local Blob download actions in src/app.js
- [x] T014 [US3] Implement reset and share-with-safe-fallback actions without including pasted content in src/app.js
- [x] T015 [US3] Add privacy note, action feedback, and no-account messaging in index.html

**Checkpoint**: All specified user stories are independently usable as one coherent tool.

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify the complete feature against the constitution and quickstart.

- [x] T016 [P] Add browser-friendly metadata, descriptive page title, and no-content-tracking comments in index.html
- [x] T017 [P] Verify responsive layout, keyboard flow, focus visibility, and live-region announcements in src/styles.css and src/app.js
- [ ] T018 Run npm test and execute every interactive scenario in specs/001-json-formatter-validator/quickstart.md (automated tests and static serving verified; interactive browser surface unavailable in this session)
- [x] T019 Review the implementation against .specify/memory/constitution.md and mark this task list complete

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup and blocks user stories.
- **User Stories (Phase 3+)**: Depend on Foundational; US1 is the MVP, US2 extends its validation path, and US3 completes the workflow.
- **Polish (Phase 6)**: Depends on all desired user stories.

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Phase 2 only.
- **User Story 2 (P1)**: Depends on the formatter helpers in Phase 2 and the UI shell from US1.
- **User Story 3 (P2)**: Depends on the output and status elements from US1 and US2.

### Parallel Opportunities

- T002, T003, and T004 can proceed in parallel after directory creation.
- T005 and T006 can proceed in parallel after the module/test directories exist, with tests expected to fail before T005 is considered complete.
- T016 and T017 can proceed in parallel after all user stories are implemented.

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational phases.
2. Complete US1 and verify valid formatting.
3. Add US2 for trustworthy invalid-input behavior.
4. Add US3 for the complete local workflow.
5. Run the quickstart and constitutional review.

### Notes

- Every task includes an exact file path and follows the required `- [ ] T### [P?] [Story?]` checklist format.
- Keep all document content in current page memory only; do not add localStorage, cookies, URL payloads, or analytics fields for user content.
