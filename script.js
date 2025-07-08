const slides = document.querySelector('.slides');
const dots = document.querySelectorAll('.dot');
const leftBtn = document.querySelector('.nav.left');
const rightBtn = document.querySelector('.nav.right');
const alarm = document.getElementById('alarmSound');

let currentIndex = 0;
let timers = [1500, 300, 900, 0]; // Pomodoro, Short, Long, Custom
let intervalIDs = [null, null, null, null];
let isRunning = [false, false, false, false];

function formatTime(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}

function updateTimerDisplay(index) {
  const timerEl = document.getElementById(`timer${index}`);
  if (timerEl) timerEl.textContent = formatTime(timers[index]);
}

function startTimer(index) {
  if (isRunning[index]) return;

  isRunning[index] = true;
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
  } else if (index === 3) {
    const input = document.getElementById("customMinutes");
    if (input.value) {
      timers[3] = parseInt(input.value) * 60;
    }
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
  slides.style.transform = `translateX(-${currentIndex * 100}%)`;
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
}

leftBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + 4) % 4;
  updateSlide();
});

rightBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % 4;
  updateSlide();
});
// Allow editing timer3 directly (Custom Timer)
const editableTimer = document.getElementById("timer3");

editableTimer.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const input = editableTimer.textContent.trim();
    const parts = input.split(":");

    let totalSeconds = 0;
    if (parts.length === 1) {
      // e.g. user types "10"
      const mins = parseInt(parts[0]);
      if (!isNaN(mins)) totalSeconds = mins * 60;
    } else if (parts.length === 2) {
      // e.g. user types "10:30"
      const mins = parseInt(parts[0]);
      const secs = parseInt(parts[1]);
      if (!isNaN(mins) && !isNaN(secs)) {
        totalSeconds = mins * 60 + secs;
      }
    }

    if (totalSeconds > 0) {
      timers[3] = totalSeconds;
      updateTimerDisplay(3); // format and show it correctly
      editableTimer.blur(); // remove focus
    } else {
      // If input is invalid, restore previous time
      editableTimer.textContent = formatTime(timers[3]);
    }
  }
});

// Initialize
timers.forEach((_, i) => updateTimerDisplay(i));
updateSlide();
