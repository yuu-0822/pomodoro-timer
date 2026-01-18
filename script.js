// ===== 定数 =====
const WORK_TIME = 25 * 60 * 1000;   // 25分
const BREAK_TIME = 5 * 60 * 1000;   // 5分

// ===== 要素取得 =====
const timeText = document.getElementById('time');
const modeText = document.getElementById('mode');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const alarm = document.getElementById('alarm');

// ===== 状態 =====
let timerId = null;
let startTime = 0;
let mode = 'work';                 // work / break
let remainingTime = WORK_TIME;     // 残り時間(ms)

// ===== ユーティリティ =====
function format(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function getDuration() {
  return mode === 'work' ? WORK_TIME : BREAK_TIME;
}

// ===== メイン処理 =====
function update() {
  const elapsed = Date.now() - startTime;
  remainingTime = getDuration() - elapsed;

  if (remainingTime <= 0) {
    alarm.play();
    switchMode();
    return;
  }

  timeText.textContent = format(remainingTime);
}

function start() {
  if (timerId !== null) return; // 二重起動防止

  startTime = Date.now() - (getDuration() - remainingTime);
  timerId = setInterval(update, 500);

  startBtn.textContent = '開始';
}

function pause() {
  if (timerId === null) return;

  clearInterval(timerId);
  timerId = null;

  startBtn.textContent = '再開';
}

function reset() {
  clearInterval(timerId);
  timerId = null;

  mode = 'work';
  modeText.textContent = '作業';
  remainingTime = WORK_TIME;

  timeText.textContent = '25:00';
  startBtn.textContent = '開始';
}

// ===== モード切替 =====
function switchMode() {
  clearInterval(timerId);
  timerId = null;

  mode = mode === 'work' ? 'break' : 'work';
  modeText.textContent = mode === 'work' ? '作業' : '休憩';
  remainingTime = getDuration();

  startBtn.textContent = '開始';
  start();
}

// ===== ボタンイベント =====
startBtn.onclick = start;
pauseBtn.onclick = pause;
resetBtn.onclick = reset;

// ===== 初期表示 =====
timeText.textContent = '25:00';
modeText.textContent = '作業';
startBtn.textContent = '開始';
