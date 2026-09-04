# Research: JSON Formatter & Validator

## Decision: Use a dependency-free static browser application

**Rationale**: The first tool is deterministic, should be immediately usable without an account, and should process pasted data locally. A static application minimizes load time, operational complexity, and privacy risk while remaining easy to host.

**Alternatives considered**: A server-rendered or API-backed implementation was rejected because it would add a network path for user data without improving formatting or validation.

## Decision: Use the browser’s standards-compliant JSON parser and serializer

**Rationale**: `JSON.parse` and `JSON.stringify` provide the correct JSON grammar and preserve parsed values while formatting. They reject comments and trailing commas, which matches JSON rather than JavaScript object-literal syntax.

**Alternatives considered**: A custom parser was rejected because it would increase defect risk and provide no user value for this deterministic feature. A third-party parser was rejected to keep the first tool dependency-free.

## Decision: Derive a user-facing error location from parser feedback

**Rationale**: Browser error messages differ, so the implementation will extract a character position when the message exposes one and otherwise provide a clear generic correction hint. The original input remains untouched.

**Alternatives considered**: A full syntax-highlighting parser was deferred because it would expand the MVP and is not required for a useful validation result.

## Decision: Use built-in browser capabilities for actions

**Rationale**: Clipboard, Blob downloads, and Web Share are available without a backend. Each capability gets a fallback message so the output remains usable when permissions or browser support are limited.

**Alternatives considered**: Uploading content to a service or embedding a sharing payload in the URL was rejected because both could expose pasted content and conflict with the privacy promise.

## Decision: Test the pure formatter module with Node’s built-in test runner

**Rationale**: The core behavior is pure JavaScript and can be covered without installing packages. This keeps setup fast and makes the required valid, invalid, and edge-case checks reproducible offline.

**Alternatives considered**: A browser automation framework was deferred to a later feature once the project has a package manager and broader UI coverage needs.
