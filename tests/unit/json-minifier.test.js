import test from "node:test";
import assert from "node:assert/strict";
import { minifyJson } from "../../src/json-minifier.js";

test("minifies formatted JSON without changing its value", () => {
  const input = `{
  "name": "ByteBench",
  "tools": ["format", "compare"]
}`;
  const result = minifyJson(input);

  assert.equal(result.status, "valid");
  assert.equal(result.minifiedText, '{"name":"ByteBench","tools":["format","compare"]}');
  assert.deepEqual(JSON.parse(result.minifiedText), JSON.parse(input));
  assert.equal(result.reductionPercent, 17);
});

test("preserves whitespace inside strings", () => {
  const result = minifyJson('{"message": "keep  spaces\\nand\\ttabs"}');

  assert.equal(result.minifiedText, '{"message":"keep  spaces\\nand\\ttabs"}');
  assert.equal(JSON.parse(result.minifiedText).message, "keep  spaces\nand\ttabs");
});

test("returns a helpful invalid result and no output", () => {
  const input = '{"name": "ByteBench",}';
  const result = minifyJson(input);

  assert.equal(result.status, "invalid");
  assert.equal(result.minifiedText, "");
  assert.equal(result.originalLength, input.length);
  assert.equal(result.minifiedLength, 0);
  assert.match(result.hint, /comma|quote|colon/i);
});

test("minifies primitives and empty containers", () => {
  assert.equal(minifyJson(" null ").minifiedText, "null");
  assert.equal(minifyJson("[  ]").minifiedText, "[]");
  assert.equal(minifyJson("{\n  }").minifiedText, "{}");
});

test("does not claim savings for already compact JSON", () => {
  const result = minifyJson('{"ok":true}');

  assert.equal(result.minifiedText, '{"ok":true}');
  assert.equal(result.originalLength, result.minifiedLength);
  assert.equal(result.reductionPercent, 0);
});
