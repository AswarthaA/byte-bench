# Quickstart: JSON Formatter & Validator

## Run locally

1. From the repository root, run `npm test` to execute the formatter unit tests.
2. Start a static server such as `python3 -m http.server 4173 -d .`.
3. Open `http://localhost:4173/` in a browser.

## Acceptance scenarios

1. Click **Load example**, then **Format JSON**. Confirm a valid state and readable output.
2. Change indentation from 2 spaces to 4 spaces and then tabs. Confirm the output changes without changing JSON values.
3. Replace the input with `{ "name": "ByteBench" "version": 1 }`, click **Validate JSON**, and confirm an invalid state with a correction hint and preserved input.
4. Format the example, click **Copy**, and confirm a success message. Click **Download** and confirm a `.json` file is created locally.
5. Click **Reset** and confirm input, output, status, and messages clear.
6. Use only the keyboard to focus and activate the primary controls; confirm visible focus and status announcements.
7. Refresh after pasting content; confirm the page does not intentionally restore the pasted content.

## Privacy check

Use browser developer tools Network while formatting text. No request should contain the JSON input or output. The page must not use local storage or cookies for document content.
