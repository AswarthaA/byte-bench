# Implementation Plan: JSON Minifier / Whitespace Remover

**Branch**: `003-json-minifier` | **Date**: 2026-09-02 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/003-json-minifier/spec.md`

## Summary

Add a dedicated static JSON Minifier page that reuses ByteBench’s browser-local parser, serializes valid values without formatting whitespace, and reports character savings. The pure minifier module will be tested independently, while the page will reuse the established accessible layout, action patterns, privacy note, and error messaging.

## Technical Context

**Language/Version**: HTML5, CSS3, modern JavaScript (ES modules), Node.js 20+ for tests

**Primary Dependencies**: None at runtime; reuse `src/json-formatter.js` and Node built-in `node:test`

**Storage**: None; current page state only

**Testing**: `npm test` using Node’s built-in test runner

**Target Platform**: Modern evergreen browsers on mobile and desktop; any static file host

**Project Type**: Static web application

**Performance Goals**: Minify inputs up to 1 MB within 200 ms on an ordinary current laptop

**Constraints**: No server round trip, no default persistence, no mutation of whitespace inside strings, accessible responsive UI, no account requirement

**Scale/Scope**: One minifier page, one pure minifier module, focused tests, and navigation links from existing JSON tools

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Constitutional requirement | Design response | Status |
|---|---|---|
| Useful immediately | Load example, concise purpose, minify action above the fold | PASS |
| Accurate and transparent | Parse/serialize semantics, valid/invalid state, size metrics, friendly error | PASS |
| Privacy-first | Browser-only processing, no storage, share URL excludes data, visible privacy note | PASS |
| Fast and accessible | No runtime dependencies, responsive layout, semantic controls and live status | PASS |
| Free at the core | No sign-in, payment, or advertising dependency | PASS |
| Tool quality standard | Copy/download/reset/share actions, four+ tests, example, How it works, FAQ | PASS |
| Deterministic build rule | Pure JSON parse and serialization; no AI involved | PASS |

**Gate result**: PASS. No violations or complexity exceptions.

## Project Structure

### Documentation (this feature)

```text
specs/003-json-minifier/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```text
minify.html
src/
├── app.js
├── minify-app.js
├── json-minifier.js
└── styles.css
tests/unit/
└── json-minifier.test.js
```

**Structure Decision**: Add `minify.html`, a dedicated page controller, and a pure minifier module. Existing formatter, comparer, and shared styles remain intact; related-tool cards link to the new page.

## Phase 0: Research Summary

Research is recorded in [research.md](research.md). The key decision is parse-and-serialize rather than character deletion so strings and values remain safe.

## Phase 1: Design Summary

The data model is recorded in [data-model.md](data-model.md), and manual acceptance/privacy scenarios are recorded in [quickstart.md](quickstart.md). No external API contract is required.

## Constitution Check — Post-Design

The design is deterministic, local-only, non-persistent, accessible, and includes the required user actions and help content. **PASS**.

## Complexity Tracking

No constitutional violations. No complexity justification required.
