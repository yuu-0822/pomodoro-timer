// ===== 要素取得 =====
const modeEl = document.getElementById("mode");
const timeEl = document.getElementById("time");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const themeToggle = document.getElementById("themeToggle");

// ===== 時間設定 =====
const WORK_TIME = 25 * 60;   // 25分
const BREAK_TIME = 5 * 60;  // 5分

let remainingTime = WORK_TIME;
let timerId = null;
let isRunning = false;
let isWorkTime = true; // true: 作業 / false: 休憩

// ===== 🔊 音ファイル =====
const alarmSound = new Audio("alarm.mp3");
alarmSound.preload = "auto";

// ===== 表示更新 =====
function updateDisplay() {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  timeEl.textContent = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}

// ===== 🔊 音を鳴らす =====
function playAlarm() {
  alarmSound.currentTime = 0; // 連続再生対策
  alarmSound.play().catch(() => {
    // モバイル制限対策（初回ユーザー操作後ならOK）
  });
}

// ===== モード切替 =====
function switchMode() {
  isWorkTime = !isWorkTime;

  if (isWorkTime) {
    modeEl.textContent = "作業";
    remainingTime = WORK_TIME;
  } else {
    modeEl.textContent = "休憩";
    remainingTime = BREAK_TIME;
  }

  playAlarm();   // ← ここで音を鳴らす
  updateDisplay();
}

// ===== タイマー開始 =====
function startTimer() {
  if (isRunning) return;

  isRunning = true;
  startBtn.textContent = "再開";

  timerId = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime--;
      updateDisplay();
    } else {
      clearInterval(timerId);
      isRunning = false;
      switchMode();
      startTimer(); // 次のモードを自動開始
    }
  }, 1000);
}

// ===== 一時停止 =====
function pauseTimer() {
  if (!isRunning) return;

  clearInterval(timerId);
  isRunning = false;
  startBtn.textContent = "再開";
}

// ===== リセット =====
function resetTimer() {
  clearInterval(timerId);
  isRunning = false;
  isWorkTime = true;
  remainingTime = WORK_TIME;
  modeEl.textContent = "作業";
  startBtn.textContent = "開始";
  updateDisplay();
}

// ===== ボタンイベント =====
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

// ===== 初期表示 =====
updateDisplay();

// =======================
// ダークモード（PC対応）
// =======================

// 初期テーマ（保存 or OS）
if (
  localStorage.getItem("theme") === "dark" ||
  (!localStorage.getItem("theme") &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.body.classList.add("dark");
  if (themeToggle) themeToggle.textContent = "☀️";
}

// 切り替え
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
  });
}
