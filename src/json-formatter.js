const POSITION_PATTERN = /position\s+(\d+)/i;

function getLocation(input, position) {
  if (!Number.isInteger(position)) {
    return { line: null, column: null };
  }

  const beforeError = input.slice(0, position);
  const line = beforeError.split("\n").length;
  const lastNewline = beforeError.lastIndexOf("\n");
  const column = position - lastNewline;

  return { line, column };
}

function errorHint(message) {
  const normalized = message.toLowerCase();

  if (normalized.includes("unexpected end") || normalized.includes("end of json")) {
    return "The JSON ends before all objects or arrays are closed. Check for a missing closing brace or bracket.";
  }

  if (normalized.includes("unexpected character") || normalized.includes("unexpected token")) {
    return "Check the nearby character for a missing comma, quote, colon, or closing bracket.";
  }

  return "Check that keys and text use double quotes, values are separated by commas, and all brackets are closed.";
}

export function parseJsonDocument(input) {
  const text = String(input ?? "");

  if (!text.trim()) {
    return {
      status: "invalid",
      formattedText: "",
      errorMessage: "Add some JSON to validate.",
      hint: "JSON can be an object, array, string, number, true, false, or null.",
      line: null,
      column: null,
    };
  }

  try {
    return {
      status: "valid",
      value: JSON.parse(text),
      formattedText: "",
      errorMessage: "",
      hint: "",
      line: null,
      column: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON.";
    const positionMatch = message.match(POSITION_PATTERN);
    const position = positionMatch ? Number(positionMatch[1]) : null;
    const { line, column } = getLocation(text, position);

    return {
      status: "invalid",
      formattedText: "",
      errorMessage: "This is not valid JSON.",
      hint: errorHint(message),
      line,
      column,
      parserMessage: message,
    };
  }
}

export function formatJson(input, indentation = 2) {
  const parsed = parseJsonDocument(input);

  if (parsed.status === "invalid") {
    return parsed;
  }

  const space = indentation === "tab" ? "\t" : Number(indentation) === 4 ? 4 : 2;

  return {
    ...parsed,
    formattedText: JSON.stringify(parsed.value, null, space),
  };
}
