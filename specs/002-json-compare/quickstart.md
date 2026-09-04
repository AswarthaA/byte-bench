# Quickstart: JSON Compare

## Run locally

1. Run `npm test` from the repository root.
2. Start a static server with `python3 -m http.server 4173 -d .`.
3. Open `http://localhost:4173/compare.html`.

## Acceptance scenarios

1. Click **Load example**, then **Compare JSON**. Confirm a summary showing added, removed, and changed records.
2. Change the object key order in one editor and compare again. Confirm the result is identical.
3. Change a scalar value. Confirm a changed path and both values appear in the difference list.
4. Add a property and remove an array item. Confirm added and removed counts and paths.
5. Put malformed JSON in either editor. Confirm a side-specific error and preserved source text.
6. Click **Swap**, **Copy report**, **Download report**, and **Reset**. Confirm visible feedback for each action.
7. Use **Share tool** and confirm only the page URL is copied/shared; no JSON appears in the URL.

## Privacy check

Use browser developer tools Network while comparing. No request should contain either JSON input or the report. Refreshing the page should not restore either pasted document.
