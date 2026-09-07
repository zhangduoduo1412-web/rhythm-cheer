const STAGE_WIDTH = 1920;
const STAGE_HEIGHT = 1080;
const params = new URLSearchParams(window.location.search);
const isCapture = params.get("capture") === "1";
const isTest = params.get("test") === "1";
const previewEffect = params.get("effect") === "1";
const previewCharacter = params.get("character");
const previewResult = params.get("result") === "1";
const previewMobile = params.get("mobile");
const previewStage = Number(params.get("stage")) || 0;
const captureDevice = params.get("device");
if (captureDevice === "tv" || captureDevice === "phone") {
  document.body.dataset.captureDevice = captureDevice;
}
const SONG_TOTAL_LABEL = "01:00";

const characterVideos = {
  normal: "./assets/ip-videos/normal-1.webm",
  normal1: "./assets/ip-videos/normal-1.webm",
  normal2: "./assets/ip-videos/normal-2.webm",
  good: "./assets/ip-videos/good.webm",
  excellent: "./assets/ip-videos/excellent.webm",
  miss: "./assets/ip-videos/miss.webm",
  curtain: "./assets/ip-videos/curtain.webm",
};
const idleCharacterStates = ["normal1", "normal2"];
const cheerStickers = [
  { src: "./assets/cheer-stickers/cheer-01.png", alt: "摇得漂亮！" },
  { src: "./assets/cheer-stickers/cheer-02.png", alt: "全场跟上节拍！" },
  { src: "./assets/cheer-stickers/cheer-03.png", alt: "这一下太准了！" },
  { src: "./assets/cheer-stickers/cheer-04.png", alt: "一起把气氛拉满！" },
  { src: "./assets/cheer-stickers/cheer-05.png", alt: "再来一个 PERFECT！" },
];

const players = [
  { name: "蓝光", color: "#53d8ff" },
  { name: "红色", color: "#ff5f7f" },
  { name: "橙色", color: "#ffad4d" },
  { name: "绿色", color: "#62e7a9" },
];

const lyricLines = [
  "为你翘课的那一天 花落的那一天",
  "教室的那一间 我怎么看不见?",
  "消失的下雨天 我好想再淋一遍",
  "没想到失去的勇气我还留着",
  "好想再问一遍 你会等待还是离开",
  "刮风这天 我试过握着你手",
  "但偏偏 雨渐渐 大到我看你不见",
  "还要多久我才能在你身边?",
  "等到放晴的那天也许我会比较好一点",
  "从前从前 有个人爱你很久",
  "但偏偏 风渐渐 把距离吹得好远",
  "好不容易又能再多爱一天",
  "但故事的最后你好像还是说了拜拜",
  "为你翘课的那一天 花落的那一天",
  "教室的那一间 我怎么看不见?",
  "消失的下雨天 我好想再淋一遍",
  "没想到失去的勇气我还留着 yeah-eh-eh",
  "好想再问一遍 你会等待还是离开",
  "刮风这天 我试过握着你手",
  "但偏偏 雨渐渐 大到我看你不见",
  "还要多久我才能在你身边?",
  "等到放晴的那天也许我会比较好一点",
  "从前从前 有个人爱你很久",
  "偏偏 风渐渐 把距离吹得好远",
  "好不容易又能再多爱一天",
  "但故事的最后你好像还是说了拜拜",
  "刮风这天 我试过握着你手",
  "但偏偏 雨渐渐 大到我看你不见",
  "还要多久我才能够在你身边?",
  "等到放晴那天也许我会比较好一点",
  "从前从前 有个人爱你很久",
  "但偏偏 雨渐渐 把距离吹得好远",
  "好不容易又能再多爱一天",
  "但故事的最后你好像还是说了拜",
];

const durationMs = isTest ? 14000 : 60000;
const travelMs = isTest ? 1800 : 5200;
const noteIntervalMs = isTest ? 900 : 1950;
const perfectWindow = 12;
const goodWindow = 94;

const stage = document.querySelector(".stage");
const noteLane = document.querySelector(".note-lane");
const noteLayer = document.querySelector("#note-layer");
const ringLayer = document.querySelector("#ring-layer");
const energyParticleLayer = document.querySelector("#energy-particle-layer");
const judgement = document.querySelector("#judgement");
const judgementLabel = document.querySelector("#judgement-label");
const judgementScore = document.querySelector("#judgement-score");
const judgementPlayer = document.querySelector("#judgement-player");
const scoreCard = document.querySelector(".score-card");
const scoreLabel = document.querySelector("#score-label");
const scoreValue = document.querySelector("#score-value");
const comboValue = document.querySelector("#combo-value");
const maxComboValue = document.querySelector("#max-combo");
const perfectCount = document.querySelector("#perfect-count");
const goodCount = document.querySelector("#good-count");
const missCount = document.querySelector("#miss-count");
const rankValue = document.querySelector("#rank-value");
const songTime = document.querySelector("#song-time");
const lyricCurrent = document.querySelector("#lyric-current");
const lyricNext = document.querySelector("#lyric-next");
const lyrics = document.querySelector(".lyrics");
const timingToast = document.querySelector("#timing-toast");
const phoneTip = document.querySelector(".phone-tip");
const comboScanner = document.querySelector("#combo-scanner");
const rankGalaxy = document.querySelector("#rank-galaxy");
const rankGalaxyStars = document.querySelector("#rank-galaxy-stars");
const scoreCharacter = document.querySelector("#score-character");
const characterCheer = document.querySelector("#character-cheer");
const characterCheerImage = document.querySelector("#character-cheer-image");
const resultOverlay = document.querySelector("#result-overlay");
const resultConfetti = document.querySelector("#result-confetti");
const resultCharacterConfetti = document.querySelector("#result-character-confetti");
const resultTitle = document.querySelector("#result-title");
const resultSubtitle = document.querySelector("#result-subtitle");
const resultRank = document.querySelector("#result-rank");
const resultScore = document.querySelector("#result-score");
const resultHits = document.querySelector("#result-hits");
const resultCombo = document.querySelector("#result-combo");
const resultCharacter = document.querySelector("#result-character");
const tvViewport = document.querySelector(".tv-viewport");
const phoneCompanion = document.querySelector("#phone-companion");
const mobileViews = [...document.querySelectorAll("[data-mobile-view]")];
const mobileStartButton = document.querySelector("#mobile-start");
const mobileTutorialBackButton = document.querySelector("#mobile-tutorial-back");
const mobileTutorialStartButton = document.querySelector("#mobile-tutorial-start");
const mobileTutorialView = document.querySelector('[data-mobile-view="tutorial"]');
const mobileShakeButton = document.querySelector("#mobile-shake");
const mobileStopButton = document.querySelector("#mobile-stop");
const mobileContinueButton = document.querySelector("#mobile-continue");
const mobileEndButton = document.querySelector("#mobile-end");
const mobileProgressBar = document.querySelector("#mobile-progress-bar");
const mobileLiveFeedback = document.querySelector(".mobile-live-copy");
const mobileLiveTitle = document.querySelector("#mobile-live-title");
const mobileHitCount = document.querySelector("#mobile-hit-count");
const mobileCombo = document.querySelector("#mobile-combo");
const mobileResultRank = document.querySelector("#mobile-result-rank");
const mobileResultScore = document.querySelector("#mobile-result-score");
const mobileResultHits = document.querySelector("#mobile-result-hits");
const mobileResultCombo = document.querySelector("#mobile-result-combo");
const mobileResultTotal = document.querySelector("#mobile-result-total");
const tvLinkStatus = document.querySelector("#tv-link-status");
const phoneLinkStatus = document.querySelector("#phone-link-status");

let notes = [];
let noteId = 0;
let frameId = 0;
let startAt = 0;
let nextNoteTargetAt = 0;
let lastLyricIndex = -1;
let toastTimer = 0;
let comboScannerTimer = 0;
let rankGalaxyTimer = 0;
let phoneTipTimer = 0;
let phoneShakeTimer = 0;
let characterResetTimer = 0;
let characterIdleTimer = 0;
let cheerTimer = 0;
let cheerHideTimer = 0;
let lastCheerIndex = -1;
let activeCharacterState = "";
let characterReturnsToNormal = false;
let lastIdleState = "normal2";
let lastRenderedRank = "B";
let galaxyTriggered = false;
let resultPreviewConsumed = false;
let mobileFeedbackUntil = 0;
let gameState = createInitialState();

function isIdleCharacterState(state) {
  return idleCharacterStates.includes(state);
}

function pickIdleCharacterState() {
  const candidates = idleCharacterStates.filter((state) => state !== lastIdleState);
  const pool = Math.random() < 0.72 && candidates.length ? candidates : idleCharacterStates;
  const nextState = pool[Math.floor(Math.random() * pool.length)];
  lastIdleState = nextState;
  return nextState;
}

function scheduleIdleExpression() {
  window.clearTimeout(characterIdleTimer);
  const delay = 3000 + Math.random() * 2500;
  characterIdleTimer = window.setTimeout(() => {
    if (!isIdleCharacterState(activeCharacterState) || gameState.finished) return;
    playCharacterAnimation(pickIdleCharacterState(), {
      returnToNormal: false,
      idlePlayback: true,
    });
  }, delay);
}

function clearCheerTimers() {
  window.clearTimeout(cheerTimer);
  window.clearTimeout(cheerHideTimer);
  cheerTimer = 0;
  cheerHideTimer = 0;
}

function showCheerSticker() {
  if (gameState.finished) return;
  const choices = cheerStickers
    .map((sticker, index) => ({ ...sticker, index }))
    .filter((sticker) => sticker.index !== lastCheerIndex);
  const sticker = choices[Math.floor(Math.random() * choices.length)] || { ...cheerStickers[0], index: 0 };
  lastCheerIndex = sticker.index;
  characterCheerImage.src = sticker.src;
  characterCheerImage.alt = sticker.alt;
  characterCheer.classList.remove("is-visible");
  void characterCheer.offsetWidth;
  characterCheer.classList.add("is-visible");
  window.clearTimeout(cheerHideTimer);
  cheerHideTimer = window.setTimeout(() => characterCheer.classList.remove("is-visible"), 2450);
}

function scheduleCheerSticker() {
  window.clearTimeout(cheerTimer);
  if (!gameState.running || gameState.finished || isCapture) return;
  cheerTimer = window.setTimeout(() => {
    showCheerSticker();
    scheduleCheerSticker();
  }, 6000 + Math.random() * 4500);
}

function playCharacterAnimation(state, { returnToNormal = true, idlePlayback = false } = {}) {
  const requestedState = state === "normal" ? pickIdleCharacterState() : state;
  const nextState = characterVideos[requestedState] ? requestedState : pickIdleCharacterState();
  const source = characterVideos[nextState];
  const isIdleState = isIdleCharacterState(nextState);
  const shouldLoop = false;

  window.clearTimeout(characterResetTimer);
  window.clearTimeout(characterIdleTimer);
  activeCharacterState = nextState;
  characterReturnsToNormal = returnToNormal && !isIdleState && nextState !== "curtain";
  scoreCharacter.dataset.state = nextState;
  scoreCharacter.loop = shouldLoop;
  scoreCharacter.classList.add("is-switching");

  const absoluteSource = new URL(source, window.location.href).href;
  if (scoreCharacter.currentSrc !== absoluteSource && scoreCharacter.src !== absoluteSource) {
    scoreCharacter.src = source;
    scoreCharacter.load();
  } else {
    scoreCharacter.currentTime = 0;
  }

  if (isIdleState && !idlePlayback) {
    const settleIntoIdle = () => {
      scoreCharacter.pause();
      scoreCharacter.currentTime = 0;
      scheduleIdleExpression();
    };
    if (scoreCharacter.readyState >= 1) settleIntoIdle();
    else scoreCharacter.addEventListener("loadedmetadata", settleIntoIdle, { once: true });
  } else {
    scoreCharacter.play().catch(() => {});
  }
  window.setTimeout(() => scoreCharacter.classList.remove("is-switching"), 120);

  if (characterReturnsToNormal) {
    const fallbackDuration = nextState === "miss" ? 1900 : 3300;
    characterResetTimer = window.setTimeout(() => {
      if (activeCharacterState === nextState) playCharacterAnimation("normal");
    }, fallbackDuration);
  }
}

function playRandomSuccessReaction() {
  playCharacterAnimation(Math.random() < 0.5 ? "good" : "excellent");
  if (Math.random() < 0.58) showCheerSticker();
}

scoreCharacter.addEventListener("ended", () => {
  if (isIdleCharacterState(activeCharacterState)) {
    scheduleIdleExpression();
    return;
  }
  if (characterReturnsToNormal) {
    playCharacterAnimation("normal");
  }
});

function createInitialState() {
  return {
    running: false,
    finished: false,
    score: 0,
    combo: 0,
    maxCombo: 0,
    perfect: 0,
    good: 0,
    miss: 0,
    hits: 0,
  };
}

function fitStage() {
  // The viewport itself is locked to 16:9; cover by the larger fractional ratio
  // so sub-pixel rounding can never reveal a dark seam on the right edge.
  const bounds = tvViewport.getBoundingClientRect();
  const scale = Math.max(bounds.width / STAGE_WIDTH, bounds.height / STAGE_HEIGHT);
  document.documentElement.style.setProperty("--stage-scale", String(scale));
}

function setMobileView(view) {
  phoneCompanion.dataset.view = view;
  mobileViews.forEach((element) => element.classList.toggle("is-active", element.dataset.mobileView === view));
}

function setLinkedStatus(status, phoneStatus = status) {
  tvLinkStatus.textContent = status;
  phoneLinkStatus.textContent = phoneStatus;
}

function updateMobileLiveCopy(label = "", state = "idle", holdMs = 0) {
  mobileLiveTitle.textContent = label;
  mobileLiveFeedback.dataset.state = state;
  mobileFeedbackUntil = holdMs ? performance.now() + holdMs : 0;
}

function showMobileResult() {
  mobileResultRank.textContent = currentRank();
  mobileResultScore.textContent = gameState.score.toLocaleString("zh-CN");
  mobileResultHits.textContent = String(gameState.hits);
  mobileResultCombo.textContent = String(gameState.maxCombo);
  mobileResultTotal.textContent = String(gameState.perfect + gameState.good);
  setMobileView("result");
  setLinkedStatus("本轮应援完成", "已同步结算");
}

function showMobileTutorial() {
  if (gameState.running || gameState.finished) return;
  setMobileView("tutorial");
  setLinkedStatus("手机正在学习玩法", "教程页");
}

function rehearseAndBeginRound() {
  if (gameState.running || gameState.finished) return;
  window.clearTimeout(phoneShakeTimer);
  mobileTutorialView.classList.remove("is-rehearsing");
  phoneCompanion.classList.remove("is-shaking");
  void mobileTutorialView.offsetWidth;
  mobileTutorialView.classList.add("is-rehearsing");
  phoneCompanion.classList.add("is-shaking");
  setLinkedStatus("手机已完成模拟晃动", "正在连接电视");
  phoneShakeTimer = window.setTimeout(() => {
    mobileTutorialView.classList.remove("is-rehearsing");
    phoneCompanion.classList.remove("is-shaking");
    beginRound();
  }, 560);
}

function formatTime(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function currentRank() {
  if (gameState.score >= 42000) return "SSS";
  if (gameState.score >= 26000) return "SS";
  if (gameState.score >= 14000) return "S";
  if (gameState.score >= 6000) return "A";
  return "B";
}

function renderScore() {
  scoreValue.textContent = gameState.score.toLocaleString("zh-CN");
  comboValue.textContent = String(gameState.combo);
  maxComboValue.textContent = String(gameState.maxCombo);
  perfectCount.textContent = String(gameState.perfect);
  goodCount.textContent = String(gameState.good);
  missCount.textContent = String(gameState.miss);
  mobileHitCount.textContent = String(gameState.hits);
  mobileCombo.textContent = String(gameState.combo);
  const rank = currentRank();
  rankValue.textContent = rank;
  rankValue.classList.toggle("rank--triple", rank === "SSS");
  scoreCard.dataset.rank = rank;
  if (rank !== lastRenderedRank && gameState.score > 0) {
    scoreCard.classList.remove("is-rank-up");
    void scoreCard.offsetWidth;
    scoreCard.classList.add("is-rank-up");
    window.setTimeout(() => scoreCard.classList.remove("is-rank-up"), 820);
  }
  if (rank === "S" && lastRenderedRank !== "S" && !galaxyTriggered) {
    galaxyTriggered = true;
    triggerRankGalaxy();
  }
  lastRenderedRank = rank;
}

function buildConfettiLayer(container, count, inner = false) {
  const palette = ["#ff4f89", "#8458ff", "#57cfff", "#ffd36d", "#f493e4"];
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < count; index += 1) {
    const piece = document.createElement("i");
    const isLeft = index % 2 === 0;
    const sideOffset = inner ? 3 + ((index * 17) % 24) : 2 + ((index * 17) % 16);
    const x = isLeft ? sideOffset : 100 - sideOffset;
    piece.style.setProperty("--confetti-x", `${x}%`);
    piece.style.setProperty("--confetti-y", `${5 + ((index * 29) % 84)}%`);
    piece.style.setProperty("--confetti-w", `${7 + ((index * 7) % 10)}px`);
    piece.style.setProperty("--confetti-h", `${12 + ((index * 11) % 21)}px`);
    piece.style.setProperty("--confetti-color", palette[index % palette.length]);
    piece.style.setProperty("--confetti-rotation", `${(index * 37) % 180}deg`);
    piece.style.setProperty("--confetti-drift", `${isLeft ? 18 + (index % 4) * 8 : -18 - (index % 4) * 8}px`);
    piece.style.setProperty("--confetti-duration", `${2.8 + (index % 5) * 0.32}s`);
    piece.style.setProperty("--confetti-delay", `${-(index % 9) * 0.34}s`);
    fragment.appendChild(piece);
  }

  container.replaceChildren(fragment);
}

function buildResultConfetti() {
  buildConfettiLayer(resultConfetti, 42);
  buildConfettiLayer(resultCharacterConfetti, 24, true);
  buildConfettiLayer(document.querySelector("#mobile-result-confetti"), 18);
}

function closeResultOverlay() {
  resultOverlay.classList.remove("is-visible", "is-ended");
  resultOverlay.setAttribute("aria-hidden", "true");
  resultTitle.textContent = "应援圆满落幕";
  resultSubtitle.textContent = "这一段，你们让全场发光";
  resultCharacter.pause();
}

function continueFromResult() {
  closeResultOverlay();
  resetGame();
  beginRound();
}

function endFromResult() {
  resultOverlay.classList.add("is-ended");
  resultTitle.textContent = "谢谢你们的应援";
  resultSubtitle.textContent = "本轮互动已经结束，成绩会留在这里";
  setLinkedStatus("互动已结束", "成绩已保存");
}

function openResultOverlay() {
  clearCheerTimers();
  characterCheer.classList.remove("is-visible");
  resultOverlay.classList.remove("is-ended");
  resultRank.textContent = currentRank();
  resultRank.classList.toggle("rank--triple", currentRank() === "SSS");
  resultScore.textContent = gameState.score.toLocaleString("zh-CN");
  resultHits.textContent = String(gameState.hits);
  resultCombo.textContent = String(gameState.maxCombo);
  resultOverlay.setAttribute("aria-hidden", "false");
  resultOverlay.classList.add("is-visible");

  resultCharacter.loop = true;
  resultCharacter.currentTime = 0;
  resultCharacter.play().catch(() => {});
  showMobileResult();
}

function stopComboScanner() {
  window.clearTimeout(comboScannerTimer);
  comboScanner.classList.remove("is-active");
  stage.classList.remove("is-combo-scanning");
}

function triggerComboScanner() {
  window.clearTimeout(comboScannerTimer);
  comboScanner.classList.remove("is-active");
  stage.classList.remove("is-combo-scanning");
  void comboScanner.offsetWidth;
  comboScanner.classList.add("is-active");
  stage.classList.add("is-combo-scanning");
  comboScannerTimer = window.setTimeout(stopComboScanner, 5000);
}

function buildRankGalaxyStars() {
  const palette = ["#ffffff", "#b8eaff", "#d3c1ff", "#ffb9eb", "#ffe29b"];
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < 128; index += 1) {
    const star = document.createElement("i");
    const bandY = 30 + Math.sin((index / 128) * Math.PI * 2.2) * 13;
    const spread = ((index * 37) % 47) - 23;
    star.style.setProperty("--galaxy-x", `${2 + ((index * 83) % 96)}%`);
    star.style.setProperty("--galaxy-y", `${Math.max(4, Math.min(88, bandY + spread))}%`);
    star.style.setProperty("--galaxy-size", `${2 + ((index * 11) % 8)}px`);
    star.style.setProperty("--galaxy-color", palette[index % palette.length]);
    star.style.setProperty("--galaxy-delay", `${-((index * 17) % 2400)}ms`);
    star.style.setProperty("--galaxy-duration", `${1500 + ((index * 29) % 1800)}ms`);
    fragment.appendChild(star);
  }
  rankGalaxyStars.replaceChildren(fragment);
}

function stopRankGalaxy() {
  window.clearTimeout(rankGalaxyTimer);
  rankGalaxy.classList.remove("is-active");
}

function triggerRankGalaxy() {
  window.clearTimeout(rankGalaxyTimer);
  buildRankGalaxyStars();
  rankGalaxy.classList.remove("is-active");
  void rankGalaxy.offsetWidth;
  rankGalaxy.classList.add("is-active");
  rankGalaxyTimer = window.setTimeout(stopRankGalaxy, 10800);
}

function schedulePhoneTipDismiss() {
  window.clearTimeout(phoneTipTimer);
  phoneTip.classList.remove("is-dismissed");
  if (isCapture) return;
  phoneTipTimer = window.setTimeout(() => phoneTip.classList.add("is-dismissed"), 10000);
}

function renderLyrics(index, immediate = false) {
  const safeIndex = ((index % lyricLines.length) + lyricLines.length) % lyricLines.length;
  if (safeIndex === lastLyricIndex && !immediate) return;
  const line = lyricLines[safeIndex];
  const nextLine = lyricLines[(safeIndex + 1) % lyricLines.length];
  const splitIndex = line.indexOf(" ");
  const highlightEnd = splitIndex > 0 ? splitIndex : Math.min(8, Math.ceil(line.length * 0.42));
  const highlighted = `<span class="sung">${line.slice(0, highlightEnd)}</span>${line.slice(highlightEnd)}`;

  if (immediate) {
    lyricCurrent.innerHTML = highlighted;
    lyricNext.textContent = nextLine;
  } else {
    lyrics.classList.add("is-changing");
    window.setTimeout(() => {
      lyricCurrent.innerHTML = highlighted;
      lyricNext.textContent = nextLine;
      lyrics.classList.remove("is-changing");
    }, 180);
  }
  lastLyricIndex = safeIndex;
}

function buildAutoPlans(id) {
  const baseTargets = [0, -28, 45];
  const successRates = [94, 90, 92];
  const rollMultipliers = [47, 61, 73];
  return [1, 2, 3].map((playerIndex, index) => {
    const jitter = ((id * (playerIndex * 19 + 7)) % 49) - 24;
    const targetX = Math.max(-72, Math.min(72, baseTargets[index] + jitter));
    const roll = (id * rollMultipliers[index] + playerIndex * 31) % 100;
    return {
      playerIndex,
      targetX,
      success: roll < successRates[index],
      quality: Math.abs(targetX) <= perfectWindow ? "perfect" : "good",
      completed: false,
    };
  });
}

function spawnNote(targetAt) {
  const element = document.createElement("i");
  element.className = "rhythm-note";
  noteLayer.appendChild(element);
  const id = ++noteId;
  notes.push({
    id,
    targetAt,
    x: noteLane.clientWidth,
    element,
    resolved: false,
    manualReactionPlayed: false,
    responses: [null, null, null, null],
    autoPlans: buildAutoPlans(id),
  });
}

function removeNote(note, hit = false) {
  note.resolved = true;
  if (hit) {
    note.element.classList.add("is-hit");
    window.setTimeout(() => note.element.remove(), 170);
  } else {
    note.element.remove();
  }
  notes = notes.filter((item) => item !== note);
}

function createRing(type, playerIndex = 0, options = {}) {
  const player = players[playerIndex];
  const combo = Math.max(1, gameState.combo);
  const defaultRingCount = type === "miss"
    ? 1
    : Math.min(12, Math.max(type === "perfect" ? 3 : 1, combo));
  const ringCount = options.ringCount ?? defaultRingCount;
  const endScale = type === "miss"
    ? 0.3
    : Math.min(8.55, (type === "perfect" ? 2.8 : 2.1) + combo * 0.84);
  const duration = Math.min(1650, 820 + combo * 42);

  for (let index = 0; index < ringCount; index += 1) {
    const ring = document.createElement("i");
    ring.className = `hit-ring hit-ring--${type}`;
    ring.style.setProperty("--ring-color", player.color);
    ring.style.setProperty("--ring-end-scale", String(endScale * (0.88 + index * 0.012)));
    ring.style.setProperty("--ring-duration", `${duration}ms`);
    ring.style.setProperty("--ring-alpha", String(Math.max(0.2, 0.94 - index * 0.06)));
    ring.style.animationDelay = `${(options.delayOffset ?? 0) + index * 58}ms`;
    ringLayer.appendChild(ring);
    window.setTimeout(() => ring.remove(), duration + (options.delayOffset ?? 0) + index * 58 + 180);
  }

  if (!options.suppressIon && type !== "miss" && defaultRingCount > 10) createIonDiffusion(playerIndex, combo);
}

function createIonDiffusion(playerIndex, combo, countOverride) {
  const player = players[playerIndex];
  const particleCount = countOverride ?? Math.min(76, 28 + Math.max(0, combo - 10) * 5);
  const maxDistance = Math.min(590, 330 + combo * 24);

  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement("i");
    const angle = (Math.PI * 2 * index) / particleCount + Math.random() * 0.22;
    const distance = maxDistance * (0.42 + Math.random() * 0.58);
    const isNote = index % 7 === 0;
    particle.className = `ion-particle${isNote ? " ion-particle--note" : ""}`;
    if (isNote) particle.textContent = index % 14 === 0 ? "♪" : "♫";
    particle.style.setProperty("--ion-color", player.color);
    particle.style.setProperty("--ion-x", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--ion-y", `${Math.sin(angle) * distance * 0.56}px`);
    particle.style.setProperty("--ion-size", `${isNote ? 20 + Math.random() * 12 : 7 + Math.random() * 9}px`);
    particle.style.setProperty("--ion-delay", `${Math.random() * 260}ms`);
    particle.style.setProperty("--ion-duration", `${1900 + Math.random() * 1000}ms`);
    ringLayer.appendChild(particle);
    window.setTimeout(() => particle.remove(), 3400);
  }
}

function createScoreEnergy(colors, intensity = 1) {
  const palette = colors.length ? colors : [players[0].color];
  const particleCount = Math.min(52, Math.round(16 + gameState.combo * 1.45 + intensity * 5));
  const scatterRadius = Math.min(590, 230 + gameState.combo * 27);
  const scoreX = 1450;
  const scoreY = -12;

  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement("i");
    const angle = Math.PI * 2 * (index / particleCount) + Math.random() * 0.28;
    const distance = scatterRadius * (0.38 + Math.random() * 0.62);
    const isNote = index % 6 === 0;
    particle.className = `energy-particle${isNote ? " energy-particle--note" : ""}`;
    particle.textContent = isNote ? (index % 12 === 0 ? "♪" : "♫") : (index % 3 === 0 ? "✦" : "·");
    particle.style.setProperty("--energy-color", palette[index % palette.length]);
    particle.style.setProperty("--scatter-x", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--scatter-y", `${Math.sin(angle) * distance * 0.62}px`);
    particle.style.setProperty("--score-x", `${scoreX + (Math.random() - 0.5) * 130}px`);
    particle.style.setProperty("--score-y", `${scoreY + (Math.random() - 0.5) * 96}px`);
    particle.style.setProperty("--energy-delay", `${Math.random() * 260}ms`);
    particle.style.setProperty("--energy-duration", `${2300 + Math.random() * 1000}ms`);
    particle.style.setProperty("--energy-size", `${isNote ? 24 + Math.random() * 14 : 14 + Math.random() * 13}px`);
    energyParticleLayer.appendChild(particle);
    window.setTimeout(() => particle.remove(), 3900);
  }

  window.setTimeout(() => {
    scoreCard.classList.remove("is-collecting");
    void scoreCard.offsetWidth;
    scoreCard.classList.add("is-collecting");
    window.setTimeout(() => scoreCard.classList.remove("is-collecting"), 620);
  }, 2180);
}

function createGroupRings(successfulResponses, resultType) {
  const totalLayers = Math.min(12, Math.max(resultType === "perfect" ? 3 : 1, gameState.combo));
  const layersPerPlayer = Math.max(1, Math.ceil(totalLayers / successfulResponses.length));

  successfulResponses.forEach((response, index) => {
    createRing(response.quality, response.playerIndex, {
      ringCount: layersPerPlayer,
      delayOffset: index * 28,
      suppressIon: true,
    });
  });

  if (totalLayers > 10) {
    const ionsPerPlayer = Math.ceil(Math.min(76, 28 + Math.max(0, gameState.combo - 10) * 5) / successfulResponses.length);
    successfulResponses.forEach((response) => createIonDiffusion(response.playerIndex, gameState.combo, ionsPerPlayer));
  }
}

function showJudgement(type, playerIndex = 0, points = 0) {
  const player = players[playerIndex];
  judgement.dataset.state = type;

  if (type === "perfect") {
    judgementLabel.textContent = "PERFECT";
    judgementScore.textContent = `+${points.toLocaleString("zh-CN")}`;
    judgementPlayer.textContent = `${player.name}触发大光圈`;
  } else if (type === "good") {
    judgementLabel.textContent = "GOOD";
    judgementScore.textContent = `+${points.toLocaleString("zh-CN")}`;
    judgementPlayer.textContent = `${player.name}触发小光圈`;
  } else {
    judgementLabel.textContent = "MISS";
    judgementScore.textContent = "连击中断";
    judgementPlayer.textContent = "没有收到摇晃回应";
  }
}

function registerHit(type, playerIndex, note) {
  gameState.combo += 1;
  gameState.maxCombo = Math.max(gameState.maxCombo, gameState.combo);
  gameState.hits += 1;

  const base = type === "perfect" ? 1200 : 620;
  const comboBonus = type === "perfect" ? gameState.combo * 18 : gameState.combo * 8;
  const points = base + comboBonus;
  gameState.score += points;
  gameState[type] += 1;

  if (note) removeNote(note, true);
  createRing(type, playerIndex);
  createScoreEnergy([players[playerIndex].color], type === "perfect" ? 1.5 : 1);
  showJudgement(type, playerIndex, points);
  playRandomSuccessReaction();
  renderScore();
}

function registerGroupSuccess(note, successfulResponses) {
  gameState.combo += 1;
  gameState.maxCombo = Math.max(gameState.maxCombo, gameState.combo);
  gameState.hits += 1;

  const perfectResponses = successfulResponses.filter((response) => response.quality === "perfect").length;
  const resultType = successfulResponses.length === 4 && perfectResponses >= 2 ? "perfect" : "good";
  const points = successfulResponses.length * 260 + perfectResponses * 180 + gameState.combo * 24;
  gameState.score += points;
  gameState[resultType] += 1;

  removeNote(note, true);
  createGroupRings(successfulResponses, resultType);
  createScoreEnergy(
    successfulResponses.map((response) => players[response.playerIndex].color),
    resultType === "perfect" ? 1.65 : 1.15,
  );
  judgement.dataset.state = "success";
  judgementLabel.textContent = "SUCCESS";
  judgementScore.textContent = `+${points.toLocaleString("zh-CN")}`;
  judgementPlayer.textContent = `${successfulResponses.length}/4 位玩家操作成功`;
  updateMobileLiveCopy(resultType === "perfect" ? "PERFECT" : "GOOD", resultType, 1250);
  renderScore();
}

function registerGroupMiss(note, successCount) {
  gameState.combo = 0;
  gameState.miss += 1;
  removeNote(note);
  createRing("miss", 0);
  judgement.dataset.state = "miss";
  judgementLabel.textContent = "MISS";
  judgementScore.textContent = "应援未过半";
  judgementPlayer.textContent = `${successCount}/4 位玩家操作成功`;
  updateMobileLiveCopy();
  playCharacterAnimation("miss");
  renderScore();
}

function finalizeNote(note) {
  if (note.resolved) return;
  const successfulResponses = note.responses
    .map((response, playerIndex) => response?.success ? { ...response, playerIndex } : null)
    .filter(Boolean);

  if (successfulResponses.length >= 3) {
    registerGroupSuccess(note, successfulResponses);
  } else {
    registerGroupMiss(note, successfulResponses.length);
  }
}

function registerMiss(note) {
  gameState.combo = 0;
  gameState.miss += 1;
  removeNote(note);
  createRing("miss", 0);
  showJudgement("miss");
  playCharacterAnimation("miss");
  renderScore();
}

function showTimingToast(playerIndex) {
  timingToast.textContent = `${players[playerIndex].name}已经摇晃，音符还没进入判定区`;
  timingToast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => timingToast.classList.remove("is-visible"), 1100);
}

function animatePlayerButton(playerIndex) {
  const button = document.querySelector(`[data-player="${playerIndex}"]`);
  if (!button) return;
  if (playerIndex === 0) {
    window.clearTimeout(phoneShakeTimer);
    phoneCompanion.classList.remove("is-feedback");
    phoneCompanion.classList.remove("is-shaking");
    void phoneCompanion.offsetWidth;
    phoneCompanion.classList.add("is-feedback");
    phoneCompanion.classList.add("is-shaking");
  } else {
    button.classList.remove("is-shaking");
    void button.offsetWidth;
    button.classList.add("is-shaking");
    window.setTimeout(() => button.classList.remove("is-shaking"), 560);
  }
  if (playerIndex === 0) {
    phoneShakeTimer = window.setTimeout(() => {
      phoneCompanion.classList.remove("is-feedback");
      phoneCompanion.classList.remove("is-shaking");
    }, 700);
  }
}

function showAutoOutcome(playerIndex, success) {
  const card = document.querySelector(`[data-player="${playerIndex}"]`);
  if (!card) return;
  const outcomeLabel = card.querySelector(".player-copy b");
  card.classList.remove("is-success", "is-error");
  card.classList.add(success ? "is-success" : "is-error");
  outcomeLabel.textContent = success ? "操作成功" : "轻微失误";
  window.setTimeout(() => {
    card.classList.remove("is-success", "is-error");
    outcomeLabel.textContent = "自动晃动";
  }, 760);
}

function recordAutoResponse(note, plan) {
  if (plan.completed || note.resolved) return;
  plan.completed = true;
  note.responses[plan.playerIndex] = {
    success: plan.success,
    quality: plan.success ? plan.quality : "miss",
  };
  animatePlayerButton(plan.playerIndex);
  showAutoOutcome(plan.playerIndex, plan.success);
  if (note.responses.every(Boolean)) finalizeNote(note);
}

function attemptHit(playerIndex) {
  animatePlayerButton(playerIndex);
  if (!gameState.running || gameState.finished) return;

  const activeNotes = notes.filter((note) => !note.resolved && !note.responses[playerIndex] && note.x >= -goodWindow);
  if (!activeNotes.length) {
    showTimingToast(playerIndex);
    return;
  }

  const nearest = activeNotes.reduce((best, note) => (
    Math.abs(note.x) < Math.abs(best.x) ? note : best
  ));
  const distance = Math.abs(nearest.x);

  if (distance <= perfectWindow) {
    nearest.responses[playerIndex] = { success: true, quality: "perfect" };
    showJudgement("perfect", playerIndex, 0);
    if (playerIndex === 0) updateMobileLiveCopy("PERFECT", "perfect", 1100);
  } else if (distance <= goodWindow) {
    nearest.responses[playerIndex] = { success: true, quality: "good" };
    showJudgement("good", playerIndex, 0);
    if (playerIndex === 0) updateMobileLiveCopy("GOOD", "good", 1100);
  } else {
    showTimingToast(playerIndex);
    return;
  }
  judgementScore.textContent = `${players[playerIndex].name}已完成`;
  judgementPlayer.textContent = "等待其他玩家结果";
  if (!nearest.manualReactionPlayed) {
    nearest.manualReactionPlayed = true;
    playRandomSuccessReaction();
  }
  if (nearest.responses.every(Boolean)) finalizeNote(nearest);
}

function updateNotes(now) {
  const laneWidth = noteLane.clientWidth;

  while (nextNoteTargetAt <= now + travelMs && nextNoteTargetAt < startAt + durationMs) {
    spawnNote(nextNoteTargetAt);
    nextNoteTargetAt += noteIntervalMs;
  }

  [...notes].forEach((note) => {
    const x = ((note.targetAt - now) / travelMs) * laneWidth;
    note.x = x;
    note.element.style.transform = `translate3d(${x}px,-50%,0)`;
    note.element.classList.toggle("is-near", Math.abs(x) <= goodWindow);
    note.autoPlans.forEach((plan) => {
      if (!plan.completed && x <= plan.targetX) recordAutoResponse(note, plan);
    });
    if (x < -goodWindow && !note.resolved) finalizeNote(note);
  });
}

function finishGame() {
  if (gameState.finished) return;
  gameState.running = false;
  gameState.finished = true;
  notes.forEach((note) => note.element.remove());
  notes = [];
  scoreLabel.textContent = "最终总分";
  scoreCard.classList.add("is-finished");
  judgement.dataset.state = "perfect";
  judgementLabel.textContent = "完成";
  judgementScore.textContent = gameState.score.toLocaleString("zh-CN");
  judgementPlayer.textContent = `最高 ${gameState.maxCombo} 连击`;
  playCharacterAnimation("curtain", { returnToNormal: false });
  songTime.textContent = `${SONG_TOTAL_LABEL} / ${SONG_TOTAL_LABEL}`;
  renderScore();
  openResultOverlay();
  window.cancelAnimationFrame(frameId);
}

function tick(now) {
  if (!gameState.running) return;
  const elapsed = now - startAt;
  updateNotes(now);
  renderLyrics(Math.floor(elapsed / (durationMs / lyricLines.length)));
  songTime.textContent = `${formatTime(elapsed)} / ${SONG_TOTAL_LABEL}`;
  mobileProgressBar.style.width = `${Math.min(100, (elapsed / durationMs) * 100)}%`;

  if (mobileFeedbackUntil && now >= mobileFeedbackUntil) {
    updateMobileLiveCopy();
  }

  if (elapsed >= durationMs) {
    finishGame();
    return;
  }
  frameId = window.requestAnimationFrame(tick);
}

function renderCaptureState() {
  const positions = [1110, 830, 560, 290];
  positions.forEach((x, index) => {
    const element = document.createElement("i");
    element.className = `rhythm-note${index === positions.length - 1 ? " is-near" : ""}`;
    element.style.transform = `translate3d(${x}px,-50%,0)`;
    noteLayer.appendChild(element);
  });
}

function renderStagePreview(stageNumber) {
  if (!Number.isInteger(stageNumber) || stageNumber < 1 || stageNumber > 5) return false;
  document.body.classList.add("capture");

  if (stageNumber === 1) {
    renderCaptureState();
    return true;
  }

  if (stageNumber === 2) {
    showMobileTutorial();
    return true;
  }

  if (stageNumber === 5) {
    gameState.score = 30468;
    gameState.combo = 11;
    gameState.maxCombo = 11;
    gameState.perfect = 16;
    gameState.good = 10;
    gameState.miss = 2;
    gameState.hits = 26;
    finishGame();
    return true;
  }

  gameState.score = stageNumber === 4 ? 14280 : 6840;
  gameState.combo = stageNumber === 4 ? 10 : 6;
  gameState.maxCombo = gameState.combo;
  gameState.perfect = stageNumber === 4 ? 7 : 2;
  gameState.good = stageNumber === 4 ? 3 : 4;
  gameState.miss = 0;
  gameState.hits = gameState.perfect + gameState.good;
  setMobileView("play");
  setLinkedStatus("手机已连接 · 应援进行中", "实时同步中");
  mobileProgressBar.style.width = stageNumber === 4 ? "58%" : "36%";
  mobileHitCount.textContent = String(gameState.hits);
  mobileCombo.textContent = String(gameState.combo);
  songTime.textContent = stageNumber === 4 ? `00:35 / ${SONG_TOTAL_LABEL}` : `00:22 / ${SONG_TOTAL_LABEL}`;
  renderLyrics(stageNumber === 4 ? 18 : 10, true);
  renderCaptureState();

  if (stageNumber === 3) {
    judgement.dataset.state = "good";
    judgementLabel.textContent = "响应中";
    judgementScore.textContent = gameState.score.toLocaleString("zh-CN");
    judgementPlayer.textContent = "多位玩家持续应援";
    updateMobileLiveCopy("GOOD", "good");
    renderScore();
    return true;
  }

  judgement.dataset.state = "perfect";
  judgementLabel.textContent = "PERFECT";
  judgementScore.textContent = "+1,200";
  judgementPlayer.textContent = "4/4 位玩家操作成功";
  updateMobileLiveCopy("PERFECT", "perfect");
  renderScore();
  playCharacterAnimation("excellent", { returnToNormal: false });
  window.setTimeout(() => {
    createRing("perfect", 0, { combo: gameState.combo });
    createIonDiffusion(0, gameState.combo, 48);
    createScoreEnergy(players.map((player) => player.color), 1.5);
  }, 120);
  return true;
}

function beginRound() {
  if (gameState.running || gameState.finished) return;
  setMobileView("play");
  setLinkedStatus("手机已连接 · 应援进行中", "实时同步中");
  updateMobileLiveCopy();
  mobileProgressBar.style.width = "0%";
  const now = performance.now();
  startAt = now;
  nextNoteTargetAt = now + (isTest ? 1100 : 3000);
  gameState.running = true;
  schedulePhoneTipDismiss();
  scheduleCheerSticker();
  frameId = window.requestAnimationFrame(tick);
}

function resetGame() {
  window.cancelAnimationFrame(frameId);
  window.clearTimeout(phoneTipTimer);
  window.clearTimeout(phoneShakeTimer);
  phoneCompanion.classList.remove("is-feedback", "is-shaking");
  clearCheerTimers();
  characterCheer.classList.remove("is-visible");
  closeResultOverlay();
  stopComboScanner();
  stopRankGalaxy();
  notes.forEach((note) => note.element.remove());
  notes = [];
  noteLayer.replaceChildren();
  ringLayer.replaceChildren();
  energyParticleLayer.replaceChildren();
  gameState = createInitialState();
  mobileFeedbackUntil = 0;
  lastRenderedRank = "B";
  galaxyTriggered = false;
  scoreLabel.textContent = "实时总分";
  scoreCard.classList.remove("is-finished", "is-collecting", "is-rank-up");
  judgement.dataset.state = "ready";
  judgementLabel.textContent = "准备";
  judgementScore.textContent = "等待节拍";
  judgementPlayer.textContent = "任意玩家都可以应援";
  songTime.textContent = `00:00 / ${SONG_TOTAL_LABEL}`;
  mobileProgressBar.style.width = "0%";
  setMobileView("start");
  setLinkedStatus("等待手机开启", "未连接");
  lastLyricIndex = -1;
  renderLyrics(0, true);
  renderScore();
  if (previewCharacter && characterVideos[previewCharacter]) {
    playCharacterAnimation(previewCharacter, { returnToNormal: false });
  } else {
    playCharacterAnimation(pickIdleCharacterState(), { returnToNormal: false, idlePlayback: true });
  }

  if (previewResult && !resultPreviewConsumed) {
    resultPreviewConsumed = true;
    gameState.score = 36780;
    gameState.combo = 24;
    gameState.maxCombo = 32;
    gameState.perfect = 18;
    gameState.good = 5;
    gameState.miss = 1;
    gameState.hits = 23;
    if (isCapture) document.body.classList.add("capture");
    finishGame();
    return;
  }

  if (renderStagePreview(previewStage)) return;

  if (previewMobile === "play") {
    setMobileView("play");
    setLinkedStatus("手机已连接 · 应援进行中", "实时同步中");
    const previewJudgement = params.get("judgement");
    if (previewJudgement === "perfect" || previewJudgement === "good") {
      updateMobileLiveCopy(previewJudgement.toUpperCase(), previewJudgement);
    }
    if (isCapture) document.body.classList.add("capture");
    return;
  }

  if (previewEffect) {
    const previewCombo = 10;
    gameState.score = 14000;
    gameState.combo = previewCombo;
    gameState.maxCombo = previewCombo;
    gameState.perfect = previewCombo;
    gameState.hits = previewCombo;
    renderScore();
    window.setTimeout(() => {
      createRing("perfect", 0);
      createIonDiffusion(0, previewCombo, 58);
      createScoreEnergy(players.map((player) => player.color), 1.8);
    }, 240);
  }

  if (isCapture) {
    document.body.classList.add("capture");
    renderCaptureState();
    return;
  }

  if (isTest || previewEffect) beginRound();
}

document.querySelectorAll(".player-shake--manual[data-player]").forEach((button) => {
  button.addEventListener("click", () => attemptHit(Number(button.dataset.player)));
});

mobileStartButton.addEventListener("click", showMobileTutorial);
mobileTutorialBackButton.addEventListener("click", () => {
  setMobileView("start");
  setLinkedStatus("等待手机开启", "未连接");
});
mobileTutorialStartButton.addEventListener("click", rehearseAndBeginRound);
mobileContinueButton.addEventListener("click", continueFromResult);
mobileEndButton.addEventListener("click", endFromResult);
mobileStopButton.addEventListener("click", finishGame);
document.querySelector("#result-continue").addEventListener("click", continueFromResult);
document.querySelector("#result-end").addEventListener("click", endFromResult);
document.querySelector("#result-restart").addEventListener("click", continueFromResult);

window.addEventListener("keydown", (event) => {
  const playerIndex = Number(event.key) - 1;
  if (playerIndex === 0) attemptHit(playerIndex);
});

window.addEventListener("resize", fitStage);

stage.addEventListener("pointermove", (event) => {
  const bounds = stage.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width) * 100;
  const y = ((event.clientY - bounds.top) / bounds.height) * 100;
  stage.style.setProperty("--scanner-x", `${Math.max(0, Math.min(100, x))}%`);
  stage.style.setProperty("--scanner-y", `${Math.max(0, Math.min(100, y))}%`);
});

stage.addEventListener("pointerleave", () => {
  stage.style.setProperty("--scanner-x", "50%");
  stage.style.setProperty("--scanner-y", "50%");
});

window.supportGame = {
  attemptHit,
  reset: resetGame,
  finish: finishGame,
  forcePerfect: (playerIndex = 0) => registerHit("perfect", playerIndex, null),
  forceGood: (playerIndex = 0) => registerHit("good", playerIndex, null),
  playCharacter: (state) => playCharacterAnimation(state, { returnToNormal: false }),
  triggerRankGalaxy,
  getState: () => ({ ...gameState, activeNotes: notes.length }),
};

buildResultConfetti();
fitStage();
resetGame();
