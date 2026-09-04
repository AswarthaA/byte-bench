# Research: JSON Compare

## Decision: Compare parsed JSON values recursively

**Rationale**: Developers generally care about data changes rather than formatting noise. Parsing before comparison makes object property order irrelevant while preserving array order and JSON types.

**Alternatives considered**: Comparing source strings was rejected because whitespace and object key order would create false differences. A text diff was deferred because it obscures semantic changes in nested data.

## Decision: Use dot paths for object keys and bracket paths for array indexes

**Rationale**: Paths such as `user.name` and `items[2]` are familiar, compact, and actionable. Keys with punctuation are quoted so paths stay unambiguous.

**Alternatives considered**: JSON Pointer was deferred for the first user-facing report because `/user/name` is less approachable for the target audience. It can be added as an export format later.

## Decision: Represent each leaf or container change as one difference record

**Rationale**: A flat report is easy to scan, copy, test, and extend. Added/removed branches are represented at the first missing path rather than producing noisy child records.

**Alternatives considered**: A tree-only result was rejected for the MVP because a flat list gives users a fast summary and works well on small screens.

## Decision: Reuse the existing local-only static app approach

**Rationale**: Comparison is deterministic browser work and must not transmit pasted content. A separate `compare.html` page keeps the first tool focused while sharing the existing design tokens and formatter parsing behavior.

**Alternatives considered**: A backend comparison service was rejected because it adds privacy risk without improving deterministic comparison.

## Decision: Test the comparison engine with Node’s built-in test runner

**Rationale**: Recursive comparison is pure JavaScript and can be verified offline with no runtime dependencies.

**Alternatives considered**: Browser automation was deferred because this repository currently has no controllable browser test surface or installed automation dependency.
