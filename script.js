let timer;
let timeLeft = 1500;
let isRunning = false;
let isPaused = false;

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");
const tabs = document.querySelectorAll(".tab");
const customInput = document.getElementById("customInput");
const customMinutes = document.getElementById("customMinutes");
const setCustom = document.getElementById("setCustom");
const alarm = document.getElementById("alarmSound");

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    isPaused = false;
    startBtn.textContent = "Pause";
    timer = setInterval(() => {
      if (!isPaused) {
        timeLeft--;
        updateDisplay();
        if (timeLeft <= 0) {
          clearInterval(timer);
          isRunning = false;
          startBtn.textContent = "Start";
          alarm.play();
        }
      }
    }, 1000);
  } else {
    // Pause the timer
    isPaused = !isPaused;
    startBtn.textContent = isPaused ? "Start" : "Pause";
  }
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  isPaused = false;
  startBtn.textContent = "Start";

  const activeTab = document.querySelector(".tab.active");
  timeLeft = parseInt(activeTab.dataset.time) || (parseInt(customMinutes.value) * 60) || 1500;
  updateDisplay();
}

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    if (tab.classList.contains("custom")) {
      customInput.classList.remove("hidden");
    } else {
      customInput.classList.add("hidden");
      timeLeft = parseInt(tab.dataset.time);
    }

    resetTimer();
  });
});

setCustom.addEventListener("click", () => {
  const minutes = parseInt(customMinutes.value);
  if (!isNaN(minutes) && minutes > 0) {
    timeLeft = minutes * 60;
    resetTimer();
  }
});

startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);
const settingsBtn = document.getElementById("settings");
const settingsPanel = document.getElementById("settingsPanel");
const color1Input = document.getElementById("color1");
const color2Input = document.getElementById("color2");

settingsBtn.addEventListener("click", () => {
  settingsPanel.classList.toggle("hidden");
  // Optional: close when open elsewhere
});

function applyColors() {
  const textColor = color1Input.value;
  const bgColor = color2Input.value;

  document.querySelector(".container").style.backgroundColor = bgColor;
  document.querySelector(".container").style.color = textColor;

  const buttons = document.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.style.backgroundColor = textColor;
    btn.style.color = bgColor;
    btn.style.border = `1px solid ${textColor}`;
  });

  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(tab => {
    if (!tab.classList.contains("active")) {
      tab.style.color = textColor;
      tab.style.border = `1px solid ${textColor}`;
      tab.style.background = 'transparent';
    }
  });

  const activeTab = document.querySelector(".tab.active");
  if (activeTab) {
    activeTab.style.backgroundColor = textColor;
    activeTab.style.color = bgColor;
  }

  // Timer text color
  document.getElementById("timer").style.color = textColor;
}

color1Input.addEventListener("input", applyColors);
color2Input.addEventListener("input", applyColors);


updateDisplay();
