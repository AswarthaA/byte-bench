# Feature Specification: JSON Compare

**Feature Branch**: `002-json-compare`

**Created**: 2026-09-02

**Status**: Draft

**Input**: User description: "Implement JSON comparisons as the next ByteBench tool."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Compare two JSON documents (Priority: P1)

A developer pastes an original JSON document and an updated JSON document to see whether they are equivalent and what changed.

**Why this priority**: JSON Compare is the second item in ByteBench’s initial build order and provides an immediately useful workflow for API payloads, configuration changes, and test fixtures.

**Independent Test**: Paste two valid JSON documents with one changed value, one added property, and one removed property; compare them and confirm each difference is reported.

**Acceptance Scenarios**:

1. **Given** two valid JSON documents with the same data but different object key order, **When** the user selects Compare, **Then** the result says the documents are identical.
2. **Given** two valid JSON documents with a changed scalar value, **When** the user selects Compare, **Then** the result reports a changed path with the old and new values.
3. **Given** two valid JSON documents with an added or removed property or array item, **When** the user selects Compare, **Then** the result reports the path and classifies it as added or removed.
4. **Given** two valid JSON documents with different root types, **When** the user selects Compare, **Then** the result reports one changed root value with both values visible.

### User Story 2 - Fix invalid input (Priority: P1)

A user submits malformed JSON on either side and receives a clear side-specific error while both original inputs remain editable and unchanged.

**Why this priority**: Accurate comparison requires valid documents, and trustworthy error feedback prevents users from acting on a misleading diff.

**Independent Test**: Put malformed JSON in the left and then right editor, compare each time, and confirm the error names the side and gives a useful location or correction hint.

**Acceptance Scenarios**:

1. **Given** invalid JSON in the left editor, **When** the user selects Compare, **Then** the tool identifies the left document as invalid, shows a line/column when available, and does not produce a difference list.
2. **Given** invalid JSON in the right editor, **When** the user selects Compare, **Then** the tool identifies the right document as invalid, preserves both source texts, and explains how to correct common JSON syntax mistakes.
3. **Given** either editor is empty or whitespace-only, **When** the user selects Compare, **Then** the tool asks for the missing document without treating the empty document as valid JSON.

### User Story 3 - Use and share comparison results (Priority: P2)

A user loads an example, swaps the two documents, copies or downloads a readable change report, resets the comparison, or shares the tool without exposing document content.

**Why this priority**: These actions make the comparison useful in a real workflow while preserving ByteBench’s privacy promise.

**Independent Test**: Compare the example documents, activate swap/copy/download/reset/share, and confirm each action gives visible feedback and never places JSON in the page URL.

**Acceptance Scenarios**:

1. **Given** two documents are loaded, **When** the user selects Swap, **Then** the left and right editor contents exchange places and the prior result is cleared.
2. **Given** differences are visible, **When** the user selects Copy report, **Then** a plain-text summary of the comparison is copied without changing either source editor.
3. **Given** differences are visible, **When** the user selects Download report, **Then** a local text file is offered containing the report and no upload occurs.
4. **Given** either document contains private content, **When** the user selects Share tool, **Then** only the tool URL is shared or copied; neither document is included.

### Edge Cases

- Object key order is ignored for equality, but array order is significant.
- Nested objects and arrays report paths using dot notation for object keys and bracket notation for array indexes.
- Keys containing dots or brackets remain unambiguous through quoted path segments.
- `null`, booleans, numbers, and strings compare by both value and JSON type.
- Empty objects and arrays compare correctly and are not treated as missing.
- Duplicate object keys follow the browser parser’s behavior; the help content explains that later values may replace earlier values.
- Very large inputs are compared locally without truncation, persistence, or network requests.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The tool MUST provide clearly labeled left/original and right/updated JSON editors.
- **FR-002**: The tool MUST parse and compare both documents locally in the browser without sending either document to a server.
- **FR-003**: The tool MUST ignore object property order when determining equality.
- **FR-004**: The tool MUST treat array order, value type, and scalar value as significant.
- **FR-005**: The tool MUST report each difference with a path, classification (added, removed, or changed), and relevant old/new value where applicable.
- **FR-006**: The tool MUST show a clear identical state when no differences exist.
- **FR-007**: The tool MUST show side-specific invalid-input errors, preserve source text, and provide line/column information when available.
- **FR-008**: The tool MUST provide Load example, Swap, Copy report, Download report, Reset, and Share tool actions where supported by the browser.
- **FR-009**: The tool MUST include a visible local-processing privacy note, comparison semantics explanation, example, and FAQ.
- **FR-010**: The tool MUST not persist source documents, reports, or error messages in cookies, local storage, analytics payloads, URLs, or a remote service by default.
- **FR-011**: The tool MUST be usable with keyboard navigation, visible focus states, accessible labels, and a responsive layout.
- **FR-012**: The project MUST include automated tests for identical documents, changed values, additions/removals, invalid input, and nested/array edge cases.

### Key Entities *(include if feature involves data)*

- **JSON Document**: One source text plus its parsed value, identified as Original or Updated for the current page session only.
- **Comparison Result**: Identical or different status, difference count, and the list of path-based difference records.
- **Difference Record**: A path, classification, and optional original/updated values used to explain a single change.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can compare the provided example documents in three or fewer primary actions after page load.
- **SC-002**: For two valid inputs up to 1 MB each, comparison completes within 300 ms on an ordinary current laptop after the user action.
- **SC-003**: 100% of automated comparison tests pass, including identical, changed, added/removed, invalid, and nested/array cases.
- **SC-004**: Every reported difference includes a path and classification, and changed values are visible without opening a developer console.
- **SC-005**: A privacy review finds no default network request containing either JSON document and no source content in the share URL or persisted browser state.

## Assumptions

- The feature is a static page at `compare.html` that reuses the existing ByteBench visual language and local-only approach.
- The browser’s standards-compliant JSON parser is the source of truth for valid JSON syntax.
- Comparison reports are intentionally human-readable in the first release; syntax-highlighted inline patches are deferred.
- Share means sharing the tool, not sharing document content. Document-aware links are out of scope for privacy reasons.
- The home page’s JSON Compare related-tool card will link to this page once implemented.
