import { parseJsonDocument } from "./json-formatter.js";

export function minifyJson(input) {
  const text = String(input ?? "");
  const parsed = parseJsonDocument(text);

  if (parsed.status === "invalid") {
    return {
      ...parsed,
      minifiedText: "",
      originalLength: text.length,
      minifiedLength: 0,
      reductionPercent: 0,
    };
  }

  const minifiedText = JSON.stringify(parsed.value);
  const originalLength = text.length;
  const minifiedLength = minifiedText.length;
  const reductionPercent = originalLength === 0
    ? 0
    : Math.max(0, Math.round(((originalLength - minifiedLength) / originalLength) * 100));

  return {
    ...parsed,
    minifiedText,
    originalLength,
    minifiedLength,
    reductionPercent,
  };
}
