const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder("utf-8", { fatal: true });

function encodeText(input) {
  const bytes = textEncoder.encode(input);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function decodeText(input) {
  const binary = atob(input);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return textDecoder.decode(bytes);
}

function invalidResult(mode, errorMessage, hint) {
  return { status: "invalid", mode, output: "", outputLength: 0, errorMessage, hint };
}

export function convertBase64(input, mode = "encode") {
  const source = String(input ?? "");
  if (mode !== "encode" && mode !== "decode") {
    throw new RangeError(`Unsupported Base64 mode: ${mode}`);
  }

  if (!source.length) {
    return invalidResult(mode, mode === "encode" ? "There is no text to encode." : "There is no Base64 value to decode.", "Add a value and try again.");
  }

  if (mode === "encode") {
    const output = encodeText(source);
    return { status: "valid", mode, inputLength: source.length, output, outputLength: output.length };
  }

  const compact = source.replace(/\s+/g, "");
  if (!compact || compact.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(compact)) {
    return invalidResult("decode", "That is not a valid Base64 value.", "Use standard Base64 characters and include padding when needed.");
  }

  try {
    const output = decodeText(compact);
    return { status: "valid", mode, inputLength: source.length, output, outputLength: output.length };
  } catch {
    return invalidResult("decode", "That Base64 value could not be decoded as UTF-8 text.", "Check that the value was copied completely and try again.");
  }
}

