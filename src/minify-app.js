import { minifyJson } from "./json-minifier.js";

const exampleJson = `{
  "tool": "ByteBench",
  "purpose": "Your digital workbench",
  "features": ["format", "compare", "minify"],
  "privateByDefault": true
}`;
const input = document.querySelector("#json-input");
const output = document.querySelector("#json-output");
const inputCount = document.querySelector("#input-count");
const outputMeta = document.querySelector("#output-meta");
const statusDot = document.querySelector("#status-dot");
const statusMessage = document.querySelector("#status-message");
const metrics = document.querySelector("#minify-metrics");
const originalSize = document.querySelector("#original-size");
const minifiedSize = document.querySelector("#minified-size");
const savedSize = document.querySelector("#saved-size");
const copyButton = document.querySelector("#copy-json");
const downloadButton = document.querySelector("#download-json");
let currentResult = null;

function setStatus(message, type = "neutral") {
  statusMessage.textContent = message;
  statusMessage.dataset.type = type;
  statusDot.dataset.type = type;
}

function updateCount() {
  const count = input.value.length;
  inputCount.textContent = `${count.toLocaleString()} character${count === 1 ? "" : "s"}`;
}

function resetResult() {
  currentResult = null;
  output.textContent = "Your compact JSON will appear here.";
  outputMeta.textContent = "Waiting for input";
  metrics.hidden = true;
  copyButton.disabled = true;
  downloadButton.disabled = true;
  setStatus("Ready when you are.");
}

function renderResult(result) {
  currentResult = result;
  if (result.status === "invalid") {
    output.textContent = "No minified output yet. Fix the input and try again.";
    outputMeta.textContent = "Needs attention";
    metrics.hidden = true;
    copyButton.disabled = true;
    downloadButton.disabled = true;
    const location = result.line && result.column ? ` Line ${result.line}, column ${result.column}.` : "";
    setStatus(`${result.errorMessage}${location} ${result.hint}`, "invalid");
    return;
  }

  output.textContent = result.minifiedText;
  outputMeta.textContent = `${result.minifiedLength.toLocaleString()} characters`;
  originalSize.textContent = result.originalLength.toLocaleString();
  minifiedSize.textContent = result.minifiedLength.toLocaleString();
  savedSize.textContent = `${result.reductionPercent}%`;
  metrics.hidden = false;
  copyButton.disabled = false;
  downloadButton.disabled = false;
  setStatus(result.reductionPercent ? `Minified successfully — ${result.reductionPercent}% smaller.` : "JSON is already minified.", "valid");
}

function runMinify() {
  renderResult(minifyJson(input.value));
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

async function copyResult() {
  if (!currentResult || currentResult.status === "invalid") return;
  try {
    await copyText(currentResult.minifiedText);
    setStatus("Copied minified JSON to your clipboard.", "success");
  } catch {
    setStatus("Copy is unavailable here. Select the output to copy it manually.");
  }
}

function downloadResult() {
  if (!currentResult || currentResult.status === "invalid") return;
  const url = URL.createObjectURL(new Blob([currentResult.minifiedText], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "bytebench-minified.json";
  link.click();
  URL.revokeObjectURL(url);
  setStatus("Download prepared locally as bytebench-minified.json.", "success");
}

async function shareTool() {
  const shareData = { title: "ByteBench JSON Minifier", url: window.location.href };
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

input.addEventListener("input", () => {
  updateCount();
  if (currentResult) resetResult();
});
document.querySelector("#minify-json").addEventListener("click", runMinify);
document.querySelector("#validate-json").addEventListener("click", runMinify);
document.querySelector("#load-example").addEventListener("click", () => {
  input.value = exampleJson;
  updateCount();
  input.focus();
  runMinify();
});
document.querySelector("#reset-tool").addEventListener("click", () => {
  input.value = "";
  updateCount();
  resetResult();
  input.focus();
});
copyButton.addEventListener("click", copyResult);
downloadButton.addEventListener("click", downloadResult);
document.querySelector("#share-tool").addEventListener("click", shareTool);

updateCount();
