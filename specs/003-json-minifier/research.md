# Research: JSON Minifier / Whitespace Remover

## Decision: Parse and serialize JSON instead of deleting characters

**Rationale**: Parsing followed by compact serialization removes only insignificant JSON whitespace and guarantees that the result remains valid. It also preserves whitespace inside quoted strings.

**Alternatives considered**: Regular-expression whitespace removal was rejected because it corrupts string values and cannot safely distinguish syntax from content.

## Decision: Reuse the existing parser and local browser actions

**Rationale**: The formatter already provides standards-compliant parsing and user-friendly error information. Reusing it keeps validation behavior consistent across ByteBench tools and avoids runtime dependencies.

**Alternatives considered**: A server-side minifier was rejected because this deterministic operation does not need a network path and would conflict with the privacy promise.

## Decision: Show size reduction using JavaScript string length

**Rationale**: Character counts are immediate, understandable, and consistent with the existing formatter’s input counter. They provide useful relative feedback without pretending to measure transport bytes or compression.

**Alternatives considered**: UTF-8 byte counts were deferred because they add complexity and are less familiar for the first release.
