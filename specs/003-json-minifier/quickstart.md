# Quickstart: JSON Minifier / Whitespace Remover

## Run locally

1. Run `npm test` from the repository root.
2. Start `python3 -m http.server 4173 -d .`.
3. Open `http://localhost:4173/minify.html`.

## Acceptance scenarios

1. Click **Load example**, then **Minify JSON**. Confirm compact output and size metrics.
2. Put spaces and line breaks inside a JSON string, minify, and confirm the string content is unchanged.
3. Use an empty object, an array, and `null`; confirm each minifies successfully.
4. Use malformed JSON and click **Validate JSON**. Confirm an invalid state, hint, and preserved input.
5. Click **Copy**, **Download**, **Reset**, and **Share tool**. Confirm visible feedback and no JSON in the URL.

## Privacy check

Use browser developer tools Network while minifying. No request should contain the input or output. Refreshing should not restore pasted content.
