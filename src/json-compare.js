import { parseJsonDocument } from "./json-formatter.js";

function isObject(value) {
  return value !== null && typeof value === "object";
}

function pathForKey(path, key) {
  if (/^[A-Za-z_$][\w$]*$/.test(key)) return `${path}.${key}`;
  return `${path}[${JSON.stringify(key)}]`;
}

function pathForIndex(path, index) {
  return `${path}[${index}]`;
}

export function formatJsonValue(value) {
  if (value === undefined) return "—";
  return JSON.stringify(value);
}

function addDifference(differences, type, path, originalValue, updatedValue) {
  differences.push({ type, path, originalValue, updatedValue });
}

function compareValues(originalValue, updatedValue, path, differences) {
  const originalIsObject = isObject(originalValue);
  const updatedIsObject = isObject(updatedValue);

  if (originalIsObject !== updatedIsObject || Array.isArray(originalValue) !== Array.isArray(updatedValue)) {
    addDifference(differences, "changed", path, originalValue, updatedValue);
    return;
  }

  if (!originalIsObject) {
    if (originalValue !== updatedValue) addDifference(differences, "changed", path, originalValue, updatedValue);
    return;
  }

  if (Array.isArray(originalValue)) {
    const length = Math.max(originalValue.length, updatedValue.length);
    for (let index = 0; index < length; index += 1) {
      const childPath = pathForIndex(path, index);
      if (index >= originalValue.length) {
        addDifference(differences, "added", childPath, undefined, updatedValue[index]);
      } else if (index >= updatedValue.length) {
        addDifference(differences, "removed", childPath, originalValue[index], undefined);
      } else {
        compareValues(originalValue[index], updatedValue[index], childPath, differences);
      }
    }
    return;
  }

  const keys = [...new Set([...Object.keys(originalValue), ...Object.keys(updatedValue)])].sort();
  for (const key of keys) {
    const childPath = pathForKey(path, key);
    if (!(key in originalValue)) {
      addDifference(differences, "added", childPath, undefined, updatedValue[key]);
    } else if (!(key in updatedValue)) {
      addDifference(differences, "removed", childPath, originalValue[key], undefined);
    } else {
      compareValues(originalValue[key], updatedValue[key], childPath, differences);
    }
  }
}

function countsFor(differences) {
  return differences.reduce(
    (counts, difference) => {
      counts[difference.type] += 1;
      counts.total += 1;
      return counts;
    },
    { added: 0, removed: 0, changed: 0, total: 0 },
  );
}

export function compareJson(originalInput, updatedInput) {
  const original = parseJsonDocument(originalInput);
  const updated = parseJsonDocument(updatedInput);

  if (original.status === "invalid" || updated.status === "invalid") {
    return {
      status: "invalid",
      original,
      updated,
      differences: [],
      counts: { added: 0, removed: 0, changed: 0, total: 0 },
    };
  }

  const differences = [];
  compareValues(original.value, updated.value, "$", differences);

  return {
    status: differences.length ? "different" : "identical",
    original,
    updated,
    differences,
    counts: countsFor(differences),
  };
}

export function formatComparisonReport(result) {
  if (result.status === "invalid") return "Comparison unavailable: fix the invalid JSON input first.";
  if (result.status === "identical") return "JSON documents are identical.\nNo semantic differences found.";

  const { added, removed, changed } = result.counts;
  const lines = [`JSON documents differ. ${result.counts.total} difference${result.counts.total === 1 ? "" : "s"}.`, `Added: ${added} · Removed: ${removed} · Changed: ${changed}`, ""];
  for (const difference of result.differences) {
    if (difference.type === "added") lines.push(`[ADDED] ${difference.path}: ${formatJsonValue(difference.updatedValue)}`);
    if (difference.type === "removed") lines.push(`[REMOVED] ${difference.path}: ${formatJsonValue(difference.originalValue)}`);
    if (difference.type === "changed") lines.push(`[CHANGED] ${difference.path}: ${formatJsonValue(difference.originalValue)} → ${formatJsonValue(difference.updatedValue)}`);
  }
  return lines.join("\n");
}
