import { formatJson } from "./json-formatter.js";

const exampleJson = `{
  "tool": "ByteBench",
  "purpose": "Your digital workbench",
  "features": ["format", "validate", "share"],
  "privateByDefault": true
}`;

const input = document.querySelector("#json-input");
const output = document.querySelector("#json-output");
const indentation = document.querySelector("#indentation");
const inputCount = document.querySelector("#input-count");
const outputMeta = document.querySelector("#output-meta");
const statusMessage = document.querySelector("#status-message");
const statusDot = document.querySelector("#status-dot");
const formatButton = document.querySelector("#format-json");
const validateButton = document.querySelector("#validate-json");
const copyButton = document.querySelector("#copy-json");
const downloadButton = document.querySelector("#download-json");
let currentFormattedText = "";
let hasValidResult = false;

function setStatus(message, type = "neutral") {
  statusMessage.textContent = message;
  statusMessage.dataset.type = type;
  statusDot.dataset.type = type;
}

function updateInputCount() {
  const count = input.value.length;
  inputCount.textContent = `${count.toLocaleString()} character${count === 1 ? "" : "s"}`;
}

function clearResult() {
  currentFormattedText = "";
  hasValidResult = false;
  output.textContent = "Your formatted JSON will appear here.";
  outputMeta.textContent = "Waiting for input";
  copyButton.disabled = true;
  downloadButton.disabled = true;
  setStatus("Ready when you are.");
}

function renderResult(result, action) {
  if (result.status === "valid") {
    currentFormattedText = result.formattedText;
    hasValidResult = true;
    output.textContent = result.formattedText;
    outputMeta.textContent = `${result.formattedText.split("\n").length} lines`;
    copyButton.disabled = false;
    downloadButton.disabled = false;
    setStatus(action === "validate" ? "Valid JSON — ready to use." : "JSON formatted successfully.", "valid");
    return;
  }

  currentFormattedText = "";
  hasValidResult = false;
  output.textContent = "No formatted output yet. Fix the input and try again.";
  outputMeta.textContent = "Needs attention";
  copyButton.disabled = true;
  downloadButton.disabled = true;

  const location = result.line && result.column ? ` Line ${result.line}, column ${result.column}.` : "";
  setStatus(`${result.errorMessage}${location} ${result.hint}`, "invalid");
}

function runFormat(action) {
  renderResult(formatJson(input.value, indentation.value), action);
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.opacity = "0";
  document.body.append(helper);
  helper.select();
  const copied = document.execCommand("copy");
  helper.remove();
  if (!copied) throw new Error("Clipboard unavailable");
  return true;
}

async function copyResult() {
  if (!hasValidResult) return;
  try {
    await copyText(currentFormattedText);
    setStatus("Copied formatted JSON to your clipboard.", "success");
  } catch {
    setStatus("Copy is unavailable in this browser. Select the output to copy it manually.", "neutral");
  }
}

function downloadResult() {
  if (!hasValidResult) return;
  const blob = new Blob([currentFormattedText], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "bytebench-formatted.json";
  link.click();
  URL.revokeObjectURL(url);
  setStatus("Download prepared locally as bytebench-formatted.json.", "success");
}

async function shareTool() {
  const shareData = { title: "ByteBench JSON Formatter & Validator", url: window.location.href };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
      setStatus("Share sheet opened. Your JSON was not included.", "success");
      return;
    }
    await copyText(window.location.href);
    setStatus("Tool link copied. Your JSON was not included.", "success");
  } catch (error) {
    if (error?.name === "AbortError") return;
    setStatus("Sharing is unavailable here. Copy the page URL from your browser instead.", "neutral");
  }
}

input.addEventListener("input", () => {
  updateInputCount();
  if (hasValidResult || statusMessage.dataset.type !== "neutral") clearResult();
});

indentation.addEventListener("change", () => {
  if (input.value.trim()) runFormat("format");
});

formatButton.addEventListener("click", () => runFormat("format"));
validateButton.addEventListener("click", () => runFormat("validate"));
copyButton.addEventListener("click", copyResult);
downloadButton.addEventListener("click", downloadResult);
document.querySelector("#load-example").addEventListener("click", () => {
  input.value = exampleJson;
  updateInputCount();
  input.focus();
  runFormat("format");
});
document.querySelector("#reset-tool").addEventListener("click", () => {
  input.value = "";
  indentation.value = "2";
  updateInputCount();
  clearResult();
  input.focus();
});
document.querySelector("#share-tool").addEventListener("click", shareTool);

updateInputCount();
