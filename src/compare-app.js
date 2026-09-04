import { compareJson, formatComparisonReport, formatJsonValue } from "./json-compare.js";

const originalExample = `{
  "tool": "ByteBench",
  "version": 1,
  "legacy": true,
  "features": ["format", "validate"]
}`;
const updatedExample = `{
  "tool": "ByteBench",
  "version": 2,
  "newTool": "compare",
  "features": ["format", "validate", "compare"]
}`;

const originalInput = document.querySelector("#original-input");
const updatedInput = document.querySelector("#updated-input");
const originalCount = document.querySelector("#original-count");
const updatedCount = document.querySelector("#updated-count");
const resultContent = document.querySelector("#result-content");
const resultMeta = document.querySelector("#result-meta");
const resultToolbar = document.querySelector("#result-toolbar");
const statusDot = document.querySelector("#status-dot");
const statusMessage = document.querySelector("#status-message");
const copyButton = document.querySelector("#copy-report");
const downloadButton = document.querySelector("#download-report");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
let currentResult = null;
let activeFilter = "all";

function setStatus(message, type = "neutral") {
  statusMessage.textContent = message;
  statusMessage.dataset.type = type;
  statusDot.dataset.type = type;
}

function updateCount(element, value) {
  const count = value.length;
  element.textContent = `${count.toLocaleString()} character${count === 1 ? "" : "s"}`;
}

function resetResult() {
  currentResult = null;
  activeFilter = "all";
  resultMeta.textContent = "Waiting for input";
  resultToolbar.hidden = true;
  updateFilterButtons({ added: 0, removed: 0, changed: 0, total: 0 });
  resultContent.replaceChildren(Object.assign(document.createElement("p"), { className: "result-placeholder", textContent: "Your comparison will appear here." }));
  copyButton.disabled = true;
  downloadButton.disabled = true;
  setStatus("Ready when you are.");
}

function updateFilterButtons(counts) {
  for (const button of filterButtons) {
    const filter = button.dataset.filter;
    const count = filter === "all" ? counts.total : counts[filter];
    button.querySelector("span").textContent = count;
    button.classList.toggle("is-active", filter === activeFilter);
    button.setAttribute("aria-pressed", String(filter === activeFilter));
  }
}

function setFilter(filter) {
  activeFilter = filter;
  if (currentResult) renderResult(currentResult);
}

function valueElement(value) {
  const code = document.createElement("code");
  code.textContent = formatJsonValue(value);
  return code;
}

function createDifferenceItem(difference) {
  const item = document.createElement("li");
  item.className = `difference-item difference-${difference.type}`;
  const badge = document.createElement("span");
  badge.className = "difference-badge";
  badge.textContent = difference.type;
  const detail = document.createElement("div");
  detail.className = "difference-detail";
  const path = document.createElement("strong");
  path.textContent = difference.path;
  detail.append(path);
  const values = document.createElement("p");
  if (difference.type === "added") {
    values.append("New value: ", valueElement(difference.updatedValue));
  } else if (difference.type === "removed") {
    values.append("Original value: ", valueElement(difference.originalValue));
  } else {
    values.append("Original: ", valueElement(difference.originalValue), "  →  Updated: ", valueElement(difference.updatedValue));
  }
  detail.append(values);
  item.append(badge, detail);
  return item;
}

function renderInvalid(result) {
  resultMeta.textContent = "Needs attention";
  resultToolbar.hidden = true;
  const list = document.createElement("div");
  list.className = "invalid-list";
  for (const [label, side] of [["Original JSON", result.original], ["Updated JSON", result.updated]]) {
    if (side.status === "valid") continue;
    const item = document.createElement("div");
    item.className = "invalid-item";
    const heading = document.createElement("strong");
    heading.textContent = `${label} is invalid`;
    const message = document.createElement("p");
    const location = side.line && side.column ? ` Line ${side.line}, column ${side.column}.` : "";
    message.textContent = `${side.errorMessage}${location} ${side.hint}`;
    item.append(heading, message);
    list.append(item);
  }
  resultContent.replaceChildren(list);
  copyButton.disabled = true;
  downloadButton.disabled = true;
  const invalidSide = result.original.status === "invalid" && result.updated.status === "invalid" ? "Both documents" : result.original.status === "invalid" ? "Original JSON" : "Updated JSON";
  setStatus(`${invalidSide} needs attention before a comparison can run.`, "invalid");
}

function renderResult(result) {
  currentResult = result;
  if (result.status === "invalid") {
    renderInvalid(result);
    return;
  }

  const { counts } = result;
  resultMeta.textContent = result.status === "identical" ? "No differences" : `${counts.total} difference${counts.total === 1 ? "" : "s"}`;
  resultToolbar.hidden = result.status === "identical";
  updateFilterButtons(counts);
  const summary = document.createElement("div");
  summary.className = `result-summary result-${result.status}`;
  const heading = document.createElement("h3");
  heading.textContent = result.status === "identical" ? "These JSON documents are identical" : "These JSON documents are different";
  summary.append(heading);
  if (result.status === "identical") {
    const text = document.createElement("p");
    text.textContent = "Object key order, whitespace, and formatting do not affect the result.";
    summary.append(text);
  } else {
    const stats = document.createElement("div");
    stats.className = "diff-stats";
    for (const [label, value] of [["Added", counts.added], ["Removed", counts.removed], ["Changed", counts.changed]]) {
      const stat = document.createElement("div");
      stat.innerHTML = `<strong>${value}</strong><span>${label}</span>`;
      stats.append(stat);
    }
    summary.append(stats);
    const visibleDifferences = activeFilter === "all" ? result.differences : result.differences.filter((difference) => difference.type === activeFilter);
    const list = document.createElement("ul");
    list.className = "difference-list";
    visibleDifferences.forEach((difference) => list.append(createDifferenceItem(difference)));
    if (!visibleDifferences.length) {
      const empty = document.createElement("li");
      empty.className = "filtered-empty";
      empty.textContent = `No ${activeFilter} differences in this comparison.`;
      list.append(empty);
    }
    summary.append(list);
  }
  resultContent.replaceChildren(summary);
  copyButton.disabled = false;
  downloadButton.disabled = false;
  setStatus(result.status === "identical" ? "No semantic differences found." : `Found ${counts.total} difference${counts.total === 1 ? "" : "s"}.`, result.status === "identical" ? "valid" : "success");
}

function runCompare() {
  activeFilter = "all";
  renderResult(compareJson(originalInput.value, updatedInput.value));
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.opacity = "0";
  document.body.append(helper);
  helper.select();
  if (!document.execCommand("copy")) throw new Error("Clipboard unavailable");
  helper.remove();
}

async function copyReport() {
  if (!currentResult || currentResult.status === "invalid") return;
  try {
    await copyText(formatComparisonReport(currentResult));
    setStatus("Copied comparison report to your clipboard.", "success");
  } catch {
    setStatus("Copy is unavailable here. Select the report text to copy it manually.");
  }
}

function downloadReport() {
  if (!currentResult || currentResult.status === "invalid") return;
  const url = URL.createObjectURL(new Blob([formatComparisonReport(currentResult)], { type: "text/plain" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "bytebench-json-comparison.txt";
  link.click();
  URL.revokeObjectURL(url);
  setStatus("Download prepared locally as bytebench-json-comparison.txt.", "success");
}

async function shareTool() {
  const shareData = { title: "ByteBench JSON Compare", url: window.location.href };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
      setStatus("Share sheet opened. Your JSON was not included.", "success");
    } else {
      await copyText(window.location.href);
      setStatus("Tool link copied. Your JSON was not included.", "success");
    }
  } catch (error) {
    if (error?.name !== "AbortError") setStatus("Sharing is unavailable here. Copy the page URL from your browser instead.");
  }
}

function clearOnEdit() {
  updateCount(originalCount, originalInput.value);
  updateCount(updatedCount, updatedInput.value);
  if (currentResult) resetResult();
}

originalInput.addEventListener("input", clearOnEdit);
updatedInput.addEventListener("input", clearOnEdit);
document.querySelector("#compare-json").addEventListener("click", runCompare);
document.querySelector("#load-example").addEventListener("click", () => {
  originalInput.value = originalExample;
  updatedInput.value = updatedExample;
  updateCount(originalCount, originalInput.value);
  updateCount(updatedCount, updatedInput.value);
  runCompare();
});
document.querySelector("#swap-json").addEventListener("click", () => {
  [originalInput.value, updatedInput.value] = [updatedInput.value, originalInput.value];
  updateCount(originalCount, originalInput.value);
  updateCount(updatedCount, updatedInput.value);
  resetResult();
  originalInput.focus();
});
document.querySelector("#reset-tool").addEventListener("click", () => {
  originalInput.value = "";
  updatedInput.value = "";
  updateCount(originalCount, originalInput.value);
  updateCount(updatedCount, updatedInput.value);
  resetResult();
  originalInput.focus();
});
copyButton.addEventListener("click", copyReport);
downloadButton.addEventListener("click", downloadReport);
document.querySelector("#share-tool").addEventListener("click", shareTool);
filterButtons.forEach((button) => button.addEventListener("click", () => setFilter(button.dataset.filter)));

updateCount(originalCount, originalInput.value);
updateCount(updatedCount, updatedInput.value);
