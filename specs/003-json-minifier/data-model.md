# Data Model: JSON Minifier / Whitespace Remover

## JSON Document

| Field | Type | Rules |
|---|---|---|
| inputText | string | Editable current-page text; never persisted by default |
| parsedValue | JSON value | Present only after successful parsing |

## Minification Result

| Field | Type | Rules |
|---|---|---|
| status | enum | `idle`, `valid`, or `invalid` |
| minifiedText | string | Compact JSON derived from parsedValue |
| originalLength | integer | Character length of input text |
| minifiedLength | integer | Character length of minifiedText |
| reductionPercent | number | 0–100, based on character counts |
| errorMessage | string | Present only for invalid state |

## Relationships

- One JSON Document produces one Minification Result for the current indentation-free operation.
- A valid result contains compact output and size metrics; an invalid result contains no replacement output.
