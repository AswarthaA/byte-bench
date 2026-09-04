import test from "node:test";
import assert from "node:assert/strict";
import { formatJson, parseJsonDocument } from "../../src/json-formatter.js";

test("formats a valid JSON object with the requested indentation", () => {
  const result = formatJson('{"name":"ByteBench","tools":["json","base64"]}', 2);

  assert.equal(result.status, "valid");
  assert.equal(result.formattedText, '{\n  "name": "ByteBench",\n  "tools": [\n    "json",\n    "base64"\n  ]\n}');
  assert.equal(JSON.parse(result.formattedText).name, "ByteBench");
});

test("returns a helpful invalid result without replacing the input", () => {
  const input = '{"name":"ByteBench" "version":1}';
  const result = formatJson(input);

  assert.equal(result.status, "invalid");
  assert.equal(result.formattedText, "");
  assert.match(result.errorMessage, /not valid JSON/i);
  assert.match(result.hint, /comma|quote|colon/i);
  assert.equal(result.line, 1);
  assert.ok(result.column > 1);
  assert.equal(input, '{"name":"ByteBench" "version":1}');
});

test("handles nested unicode data and JSON primitives", () => {
  const nested = formatJson('{"message":"こんにちは 🌱","meta":{"active":true},"value":null}', "tab");
  const primitive = parseJsonDocument("null");

  assert.equal(nested.status, "valid");
  assert.match(nested.formattedText, /\t"meta"/);
  assert.equal(JSON.parse(nested.formattedText).message, "こんにちは 🌱");
  assert.equal(primitive.status, "valid");
  assert.equal(primitive.value, null);
});

test("rejects empty input with a non-technical message", () => {
  const result = parseJsonDocument("  \n  ");

  assert.equal(result.status, "invalid");
  assert.equal(result.errorMessage, "Add some JSON to validate.");
  assert.equal(result.line, null);
});
