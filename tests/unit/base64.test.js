import test from "node:test";
import assert from "node:assert/strict";
import { convertBase64 } from "../../src/base64.js";

test("encodes plain text as Base64", () => {
  const result = convertBase64("ByteBench makes local tools.");
  assert.equal(result.status, "valid");
  assert.equal(result.output, "Qnl0ZUJlbmNoIG1ha2VzIGxvY2FsIHRvb2xzLg==");
});

test("round-trips Unicode text safely", () => {
  const source = "Café · 東京";
  const encoded = convertBase64(source);
  const decoded = convertBase64(encoded.output, "decode");
  assert.equal(decoded.status, "valid");
  assert.equal(decoded.output, source);
});

test("preserves whitespace when encoding text", () => {
  const result = convertBase64(" keep  these spaces \n");
  const decoded = convertBase64(result.output, "decode");
  assert.equal(decoded.output, " keep  these spaces \n");
});

test("accepts whitespace around a Base64 value when decoding", () => {
  const result = convertBase64("Qnl0\nZUJlbmNo", "decode");
  assert.equal(result.status, "valid");
  assert.equal(result.output, "ByteBench");
});

test("returns a helpful result for empty input", () => {
  const result = convertBase64("", "decode");
  assert.equal(result.status, "invalid");
  assert.match(result.errorMessage, /no Base64 value/i);
  assert.equal(result.output, "");
});

test("rejects malformed Base64", () => {
  const result = convertBase64("not base64!", "decode");
  assert.equal(result.status, "invalid");
  assert.match(result.hint, /standard Base64/i);
});

