const STORAGE_KEYS = {
  memorizedCount: "asmaUlHusna.memorizedCount",
  reviseIndex: "asmaUlHusna.reviseIndex",
};

const elements = {
  arabicName: document.getElementById("arabicNameField"),
  name: document.getElementById("nameField"),
  meaning: document.getElementById("meaningField"),
  position: document.getElementById("positionField"),
  modeLabel: document.getElementById("modeLabel"),
  progressLabel: document.getElementById("progressLabel"),
  progressFill: document.getElementById("progressFill"),
  listenButton: document.getElementById("listenButton"),
  learnModeButton: document.getElementById("learnModeButton"),
  reviseModeButton: document.getElementById("reviseModeButton"),
  rememberButton: document.getElementById("rememberButton"),
  previousButton: document.getElementById("previousButton"),
  nextButton: document.getElementById("nextButton"),
  studyActions: document.querySelector(".study-actions"),
};

let names = [];
let currentName = null;
let currentAudio = null;
let mode = "learn";
let memorizedCount = 0;
let reviseIndex = 0;

async function LoadLocalData() {
  if (LoadLocalData.cache) {
    return LoadLocalData.cache;
  }

  const response = await fetch(chrome.runtime.getURL("db/data.json"));
  const data = await response.json();
  LoadLocalData.cache = data;
  return LoadLocalData.cache;
}

function GetStoredNumber(key, fallback) {
  const value = Number.parseInt(localStorage.getItem(key), 10);
  return Number.isFinite(value) ? value : fallback;
}

function Clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function LoadProgress() {
  memorizedCount = Clamp(
    GetStoredNumber(STORAGE_KEYS.memorizedCount, 0),
    0,
    names.length,
  );
  reviseIndex = Clamp(
    GetStoredNumber(STORAGE_KEYS.reviseIndex, 0),
    0,
    Math.max(memorizedCount - 1, 0),
  );
}

function SaveProgress() {
  localStorage.setItem(STORAGE_KEYS.memorizedCount, String(memorizedCount));
  localStorage.setItem(STORAGE_KEYS.reviseIndex, String(reviseIndex));
}

function StopAudio() {
  if (!currentAudio) {
    return;
  }

  currentAudio.pause();
  currentAudio.currentTime = 0;
  currentAudio = null;
}

function SetCurrentName(name, index) {
  currentName = name;
  elements.arabicName.textContent = name.name;
  elements.name.textContent = name.transliteration;
  elements.meaning.textContent = name.translation;
  elements.position.textContent = `Name ${index + 1} of ${names.length}`;
  elements.listenButton.disabled = !name.audioName;
}

function SetCompleteState() {
  currentName = names[names.length - 1] || null;
  elements.arabicName.textContent = "أسماء الله الحسنى";
  elements.name.textContent = "All 99 names memorized";
  elements.meaning.textContent = "Use Revise to keep them fresh";
  elements.position.textContent = "Complete";
  elements.listenButton.disabled = true;
}

function UpdateProgressUi() {
  const percent = names.length ? (memorizedCount / names.length) * 100 : 0;
  elements.progressLabel.textContent = `${memorizedCount} of ${names.length} memorized`;
  elements.progressFill.style.width = `${percent}%`;
}

function UpdateModeUi() {
  const isLearnMode = mode === "learn";
  elements.modeLabel.textContent = isLearnMode ? "Learn" : "Revise";
  elements.learnModeButton.classList.toggle("active", isLearnMode);
  elements.reviseModeButton.classList.toggle("active", !isLearnMode);
  elements.studyActions.classList.toggle("learn-mode", isLearnMode);
  elements.studyActions.classList.toggle("revise-mode", !isLearnMode);
  elements.rememberButton.hidden = !isLearnMode;
  elements.previousButton.hidden = isLearnMode;
  elements.nextButton.hidden = isLearnMode;
  elements.reviseModeButton.disabled = memorizedCount === 0;
  elements.previousButton.disabled = reviseIndex <= 0;
  elements.nextButton.disabled = reviseIndex >= memorizedCount - 1;
}

function Render() {
  StopAudio();
  UpdateProgressUi();
  UpdateModeUi();

  if (!names.length) {
    throw new Error("No names found in local data");
  }

  if (mode === "revise") {
    reviseIndex = Clamp(reviseIndex, 0, Math.max(memorizedCount - 1, 0));
    SetCurrentName(names[reviseIndex], reviseIndex);
    SaveProgress();
    return;
  }

  if (memorizedCount >= names.length) {
    SetCompleteState();
    elements.rememberButton.disabled = true;
    return;
  }

  elements.rememberButton.disabled = false;
  SetCurrentName(names[memorizedCount], memorizedCount);
}

function SwitchToLearnMode() {
  mode = "learn";
  Render();
}

function SwitchToReviseMode() {
  if (memorizedCount === 0) {
    return;
  }

  mode = "revise";
  reviseIndex = Clamp(reviseIndex, 0, memorizedCount - 1);
  Render();
}

function MarkCurrentNameRemembered() {
  if (mode !== "learn" || memorizedCount >= names.length) {
    return;
  }

  memorizedCount += 1;
  reviseIndex = Math.max(memorizedCount - 1, 0);
  SaveProgress();
  Render();
}

function ShowPreviousRevision() {
  if (mode !== "revise") {
    return;
  }

  reviseIndex = Clamp(reviseIndex - 1, 0, Math.max(memorizedCount - 1, 0));
  Render();
}

function ShowNextRevision() {
  if (mode !== "revise") {
    return;
  }

  reviseIndex = Clamp(reviseIndex + 1, 0, Math.max(memorizedCount - 1, 0));
  Render();
}

function PlayCurrentName() {
  if (!currentName?.audioName) {
    return;
  }

  StopAudio();
  currentAudio = new Audio(
    chrome.runtime.getURL(`assets/audio/${currentName.audioName}`),
  );
  currentAudio.play().catch((error) => {
    console.error("Error playing audio:", error);
  });
}

async function Init() {
  try {
    const data = await LoadLocalData();
    names = data.data.names;
    LoadProgress();
    Render();
  } catch (error) {
    console.error("Error loading local data:", error);
    elements.arabicName.textContent = "أسماء الله الحسنى";
    elements.name.textContent = "Could not load names";
    elements.meaning.textContent = "Please try again";
    elements.position.textContent = "Unavailable";
    elements.listenButton.disabled = true;
    elements.rememberButton.disabled = true;
    elements.reviseModeButton.disabled = true;
  }
}

elements.learnModeButton.addEventListener("click", SwitchToLearnMode);
elements.reviseModeButton.addEventListener("click", SwitchToReviseMode);
elements.rememberButton.addEventListener("click", MarkCurrentNameRemembered);
elements.previousButton.addEventListener("click", ShowPreviousRevision);
elements.nextButton.addEventListener("click", ShowNextRevision);
elements.listenButton.addEventListener("click", PlayCurrentName);

Init();
