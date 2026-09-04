# Data Model: JSON Compare

## JSON Document

| Field | Type | Rules |
|---|---|---|
| role | enum | `original` or `updated` |
| inputText | string | Editable current-page text; never persisted by default |
| parsedValue | JSON value | Present only after successful parsing |

## Comparison Result

| Field | Type | Rules |
|---|---|---|
| status | enum | `idle`, `identical`, `different`, `invalid` |
| differences | Difference Record[] | Empty when identical or invalid |
| counts | object | `added`, `removed`, `changed`, `total` |

## Difference Record

| Field | Type | Rules |
|---|---|---|
| path | string | `$` for root; dot/bracket notation for descendants |
| type | enum | `added`, `removed`, or `changed` |
| originalValue | JSON value/undefined | Present for removed and changed records |
| updatedValue | JSON value/undefined | Present for added and changed records |

## Relationships

- A comparison result is created from exactly one Original JSON Document and one Updated JSON Document.
- A result is `invalid` if either document cannot be parsed; differences are not shown in that state.
- A result is `identical` when both parsed values are recursively equivalent under the comparison semantics.
