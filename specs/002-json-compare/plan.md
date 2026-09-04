# Implementation Plan: JSON Compare

**Branch**: `002-json-compare` | **Date**: 2026-09-02 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-json-compare/spec.md`

## Summary

Add a second ByteBench static page for semantic JSON comparison. The pure comparison module will parse both documents locally, recursively compare objects, arrays, and scalar values, and return path-based difference records with summary counts. The page will reuse the existing dark ByteBench visual system and local browser actions while preserving source text and providing side-specific validation feedback.

## Technical Context

**Language/Version**: HTML5, CSS3, modern JavaScript (ES modules), Node.js 20+ for tests

**Primary Dependencies**: None at runtime; reuse `src/json-formatter.js` parsing and Node built-in `node:test`

**Storage**: None; current page state only

**Testing**: `npm test` using Node’s built-in test runner

**Target Platform**: Modern evergreen browsers on mobile and desktop; any static file host

**Project Type**: Static web application

**Performance Goals**: Compare two inputs up to 1 MB each within 300 ms on an ordinary current laptop

**Constraints**: No server round trip for user data, no default persistence, object key order ignored, array order significant, accessible responsive UI, no account requirement

**Scale/Scope**: One comparison page, one pure comparison module, and focused unit coverage; syntax-highlighted patches and document-aware share links are out of scope

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Constitutional requirement | Design response | Status |
|---|---|---|
| Useful immediately | Load-example action, clear two-pane input, compare action above the fold | PASS |
| Accurate and transparent | Parsed semantic comparison, explicit path/classification/value report, side-specific errors | PASS |
| Privacy-first | Browser-only compare, no storage, share URL excludes data, visible privacy note | PASS |
| Fast and accessible | No runtime dependencies, responsive layout, semantic labels, focus states, live status | PASS |
| Free at the core | No sign-in, payment, or advertising dependency | PASS |
| Tool quality standard | Copy/download/reset/share actions, five+ tests, example, How it works, FAQ | PASS |
| Deterministic build rule | Comparison uses deterministic browser code; no AI involved | PASS |

**Gate result**: PASS. No violations or complexity exceptions.

## Project Structure

### Documentation (this feature)

```text
specs/002-json-compare/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```text
compare.html
src/
├── app.js
├── compare-app.js
├── json-compare.js
└── styles.css
tests/unit/
└── json-compare.test.js
```

**Structure Decision**: Add a dedicated `compare.html` entrypoint and dedicated page controller while keeping pure comparison logic in `src/json-compare.js`. Existing `index.html`, formatter behavior, and shared styling remain intact; the home page JSON Compare card becomes the navigation entrypoint.

## Phase 0: Research Summary

Research is recorded in [research.md](research.md). All design unknowns are resolved: semantic recursive comparison, readable paths, flat difference records, local static delivery, and offline tests.

## Phase 1: Design Summary

The data model is recorded in [data-model.md](data-model.md). The UI workflow and acceptance checks are recorded in [quickstart.md](quickstart.md); there is no external API contract.

## Constitution Check — Post-Design

The design keeps all source documents in current page memory, avoids URL payloads and network requests, provides required tool actions and help content, and uses deterministic comparison logic. **PASS**.

## Complexity Tracking

No constitutional violations. No complexity justification required.
