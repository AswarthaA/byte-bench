# Data Model: JSON Formatter & Validator

## JSON Document

Represents the text a visitor is currently working with.

| Field | Type | Rules |
|---|---|---|
| inputText | string | May be empty; never sent or persisted by default |
| parsedValue | JSON value | Exists only after successful validation |

## Formatting Preference

Represents the current output style.

| Field | Type | Allowed values |
|---|---|---|
| indentation | enum | `2`, `4`, `tab` |

## Validation Result

Represents the current user-visible operation outcome.

| Field | Type | Rules |
|---|---|---|
| status | enum | `idle`, `valid`, `invalid` |
| formattedText | string | Present for valid JSON; generated from parsedValue |
| errorMessage | string | Present for invalid JSON; plain-language and non-destructive |
| line | integer/null | 1-based when a parser position can be derived |
| column | integer/null | 1-based when a parser position can be derived |

## Relationships

- A JSON Document has one active Formatting Preference and one Validation Result for the current page session.
- A valid Validation Result contains formattedText derived from the JSON Document and Formatting Preference.
- An invalid Validation Result contains errorMessage and optional location data but no replacement input.
