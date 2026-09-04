import { convertBase64 } from "./base64.js";

const encodeExample = "Hello, ByteBench!";
const decodeExample = "SGVsbG8sIEJ5dGVCZW5jaCE=";
const input = document.querySelector("#base64-input");
const inputLabel = document.querySelector("#input-label");
const inputHelp = document.querySelector("#input-help");
const inputCount = document.querySelector("#input-count");
const output = document.querySelector("#base64-output");
const outputLabel = document.querySelector("#output-label");
const outputMeta = document.querySelector("#output-meta");
const statusDot = document.querySelector("#status-dot");
const statusMessage = document.querySelector("#status-message");
const convertButton = document.querySelector("#convert-base64");
const copyButton = document.querySelector("#copy-base64");
const downloadButton = document.querySelector("#download-base64");
const modeButtons = [...document.querySelectorAll("[data-mode]")];
let mode = "encode";
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

function updateModeUi() {
  const isEncode = mode === "encode";
  inputLabel.textContent = isEncode ? "Text input" : "Base64 input";
  inputHelp.textContent = isEncode ? "Unicode text and whitespace are preserved." : "Whitespace is ignored while decoding.";
  input.placeholder = isEncode ? "Type or paste text here…" : "Paste a Base64 value here…";
  outputLabel.textContent = isEncode ? "Base64 output" : "Decoded text";
  convertButton.innerHTML = `${isEncode ? "Encode text" : "Decode Base64"} <span aria-hidden="true">→</span>`;
  modeButtons.forEach((button) => {
    const isActive = button.dataset.mode === mode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function resetResult(message = "Ready when you are.") {
  currentResult = null;
  outputMeta.textContent = "Waiting for input";
  output.textContent = "Your converted value will appear here.";
  copyButton.disabled = true;
  downloadButton.disabled = true;
  setStatus(message);
}

function renderResult(result) {
  currentResult = result;
  if (result.status === "invalid") {
    outputMeta.textContent = "Needs attention";
    output.textContent = "No output until the input is fixed.";
    copyButton.disabled = true;
    downloadButton.disabled = true;
    setStatus(`${result.errorMessage} ${result.hint}`, "invalid");
    return;
  }

  output.textContent = result.output;
  outputMeta.textContent = `${result.outputLength.toLocaleString()} characters`;
  copyButton.disabled = false;
  downloadButton.disabled = false;
  setStatus(result.mode === "encode" ? "Text encoded successfully." : "Base64 decoded successfully.", "success");
}

function runConversion() {
  renderResult(convertBase64(input.value, mode));
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
    await copyText(currentResult.output);
    setStatus("Copied the converted value to your clipboard.", "success");
  } catch {
    setStatus("Copy is unavailable here. Select the output to copy it manually.");
  }
}

function downloadResult() {
  if (!currentResult || currentResult.status === "invalid") return;
  const extension = currentResult.mode === "encode" ? "txt" : "txt";
  const url = URL.createObjectURL(new Blob([currentResult.output], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `bytebench-base64.${extension}`;
  link.click();
  URL.revokeObjectURL(url);
  setStatus(`Download prepared locally as bytebench-base64.${extension}.`, "success");
}

async function shareTool() {
  const shareData = { title: "ByteBench Base64 Encoder & Decoder", url: window.location.href };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
      setStatus("Share sheet opened. Your text was not included.", "success");
    } else {
      await copyText(window.location.href);
      setStatus("Tool link copied. Your text was not included.", "success");
    }
  } catch (error) {
    if (error?.name !== "AbortError") setStatus("Sharing is unavailable here. Copy the page URL from your browser instead.");
  }
}

modeButtons.forEach((button) => button.addEventListener("click", () => {
  mode = button.dataset.mode;
  updateModeUi();
  resetResult();
  input.focus();
}));
input.addEventListener("input", () => {
  updateCount();
  if (currentResult) resetResult();
});
convertButton.addEventListener("click", runConversion);
document.querySelector("#load-example").addEventListener("click", () => {
  input.value = mode === "encode" ? encodeExample : decodeExample;
  updateCount();
  runConversion();
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

updateModeUi();
updateCount();

