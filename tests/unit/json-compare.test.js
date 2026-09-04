import test from "node:test";
import assert from "node:assert/strict";
import { compareJson, formatComparisonReport } from "../../src/json-compare.js";

test("treats object key order as semantically identical", () => {
  const result = compareJson('{"name":"ByteBench","version":1}', '{"version":1,"name":"ByteBench"}');

  assert.equal(result.status, "identical");
  assert.deepEqual(result.counts, { added: 0, removed: 0, changed: 0, total: 0 });
});

test("reports changed, added, and removed values by path", () => {
  const result = compareJson(
    '{"name":"ByteBench","legacy":true,"version":1}',
    '{"name":"ByteBench Pro","version":2,"newTool":"compare"}',
  );

  assert.equal(result.status, "different");
  assert.deepEqual(result.counts, { added: 1, removed: 1, changed: 2, total: 4 });
  assert.deepEqual(result.differences.map(({ type, path }) => ({ type, path })), [
    { type: "removed", path: "$.legacy" },
    { type: "changed", path: "$.name" },
    { type: "added", path: "$.newTool" },
    { type: "changed", path: "$.version" },
  ]);
});

test("keeps array order significant and finds nested changes", () => {
  const result = compareJson(
    '{"items":[{"id":1,"active":true},"keep"]}',
    '{"items":[{"id":2,"active":true},"keep","new"]}',
  );

  assert.deepEqual(result.differences.map(({ type, path }) => ({ type, path })), [
    { type: "changed", path: "$.items[0].id" },
    { type: "added", path: "$.items[2]" },
  ]);
  assert.match(formatComparisonReport(result), /\[CHANGED\] \$\.items\[0\]\.id/);
});

test("returns a side-specific invalid result with a source location", () => {
  const result = compareJson('{"ok": true}', '{"ok": true "missingComma": false}');

  assert.equal(result.status, "invalid");
  assert.equal(result.original.status, "valid");
  assert.equal(result.updated.status, "invalid");
  assert.equal(result.differences.length, 0);
  assert.equal(result.updated.line, 1);
  assert.ok(result.updated.column > 1);
});

test("reports root type changes and quoted special-character keys", () => {
  const rootChange = compareJson("[]", "{}");
  const specialKey = compareJson('{"a.b":1}', '{"a.b":2}');

  assert.deepEqual(rootChange.differences.map(({ type, path }) => ({ type, path })), [{ type: "changed", path: "$" }]);
  assert.equal(specialKey.differences[0].path, '$["a.b"]');
});
