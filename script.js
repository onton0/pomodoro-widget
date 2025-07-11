
const slides = document.querySelector('.slides');
const dots = document.querySelectorAll('.dot');
const leftBtn = document.querySelector('.nav.left');
const rightBtn = document.querySelector('.nav.right');
const alarm = document.getElementById('alarmSound');

let currentIndex = 0;
const totalSlides = document.querySelectorAll('.slide').length;
let timers = [1500, 300, 900, 0];
let intervalIDs = [null, null, null, null];
let isRunning = [false, false, false, false];

function formatTime(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return \`\${mins}:\${secs}\`;
}

function updateTimerDisplay(index) {
  const timerEl = document.getElementById(\`timer\${index}\`);
  if (timerEl) timerEl.textContent = formatTime(timers[index]);
}

function startTimer(index) {
  const btn = document.querySelector(\`.start[data-index="\${index}"]\`);
  if (isRunning[index]) {
    clearInterval(intervalIDs[index]);
    isRunning[index] = false;
    btn.textContent = "Start";
    return;
  }
  isRunning[index] = true;
  btn.textContent = "Pause";
  intervalIDs[index] = setInterval(() => {
    if (timers[index] > 0) {
      timers[index]--;
      updateTimerDisplay(index);
    } else {
      clearInterval(intervalIDs[index]);
      isRunning[index] = false;
      alarm.play();
    }
  }, 1000);
}

function resetTimer(index) {
  clearInterval(intervalIDs[index]);
  isRunning[index] = false;
  const slide = document.querySelectorAll('.slide')[index];
  const defaultTime = slide.getAttribute('data-time');
  if (defaultTime) {
    timers[index] = parseInt(defaultTime);
  }
  updateTimerDisplay(index);
}

document.querySelectorAll('.start').forEach(btn => {
  btn.addEventListener('click', () => {
    const i = parseInt(btn.dataset.index);
    startTimer(i);
  });
});

document.querySelectorAll('.reset').forEach(btn => {
  btn.addEventListener('click', () => {
    const i = parseInt(btn.dataset.index);
    resetTimer(i);
  });
});

function updateSlide() {
  slides.style.transform = \`translateX(-\${currentIndex * 100}%)\`;
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
}

leftBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  updateSlide();
});
rightBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % totalSlides;
  updateSlide();
});

// Editable timer (Custom)
const editableTimer = document.getElementById("timer3");
editableTimer.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const input = editableTimer.textContent.trim();
    const parts = input.split(":");
    let totalSeconds = 0;
    if (parts.length === 1) {
      const mins = parseInt(parts[0]);
      if (!isNaN(mins)) totalSeconds = mins * 60;
    } else if (parts.length === 2) {
      const mins = parseInt(parts[0]);
      const secs = parseInt(parts[1]);
      if (!isNaN(mins) && !isNaN(secs)) {
        totalSeconds = mins * 60 + secs;
      }
    }
    if (totalSeconds > 0) {
      timers[3] = totalSeconds;
      updateTimerDisplay(3);
      editableTimer.blur();
    } else {
      editableTimer.textContent = formatTime(timers[3]);
    }
  }
});

// Color Settings
document.querySelectorAll(".settings-btn").forEach((btn) => {
  const index = btn.dataset.index;
  btn.addEventListener("click", () => {
    const panel = document.querySelector(\`.settings-panel[data-index="\${index}"]\`);
    panel.classList.toggle("hidden");

    const colorText = document.getElementById("colorText-" + index);
    const colorBg = document.getElementById("colorBg-" + index);
    const hexText = document.getElementById("hexText-" + index);
    const hexBg = document.getElementById("hexBg-" + index);
    const slide = btn.closest(".slide");

    colorText.value = rgbToHex(getComputedStyle(slide).color);
    colorBg.value = rgbToHex(getComputedStyle(slide).backgroundColor);
    hexText.value = colorText.value;
    hexBg.value = colorBg.value;

    colorText.addEventListener("input", () => {
      slide.style.color = colorText.value;
      hexText.value = colorText.value;
    });
    colorBg.addEventListener("input", () => {
      slide.style.backgroundColor = colorBg.value;
      hexBg.value = colorBg.value;
    });
    hexText.addEventListener("change", () => {
      if (/^#([0-9A-F]{3}){1,2}$/i.test(hexText.value)) {
        slide.style.color = hexText.value;
        colorText.value = hexText.value;
      }
    });
    hexBg.addEventListener("change", () => {
      if (/^#([0-9A-F]{3}){1,2}$/i.test(hexBg.value)) {
        slide.style.backgroundColor = hexBg.value;
        colorBg.value = hexBg.value;
      }
    });
  });
});

function rgbToHex(rgb) {
  const result = rgb.match(/\d+/g);
  if (!result || result.length < 3) return "#000000";
  return "#" + result.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, "0")).join("");
}

timers.forEach((_, i) => updateTimerDisplay(i));
updateSlide();
