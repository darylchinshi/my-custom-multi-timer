// Helper function to format time (e.g., 01 for 1 second)
function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const pad = (num) => String(num).padStart(2, '0');

    if (days > 0) {
        return `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
    } else if (hours > 0) {
        return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
    } else {
        return `${pad(minutes)}m ${pad(seconds)}s`;
    }
}

// --- Countdown to 75 Years Old ---
function update75thBirthdayCountdown() {
    // IMPORTANT: Replace '1990-01-01' with your actual birth date (YYYY-MM-DD).
    const birthDate = new Date('1981-08-04'); // Example: Replace with your actual birth date
    const targetAge = 75;

    // Calculate the target 75th birthday date
    const targetDate = new Date(birthDate.getFullYear() + targetAge, birthDate.getMonth(), birthDate.getDate());

    const now = new Date();
    const timeRemaining = targetDate.getTime() - now.getTime();

    const displayElement = document.getElementById('countdown-75');

    if (timeRemaining > 0) {
        displayElement.textContent = formatTime(timeRemaining);
    } else {
        displayElement.textContent = "You are 75 or older!";
        // clearInterval(this.interval); // If you want to stop updating after target reached
    }
}
// Run immediately and then every second
update75thBirthdayCountdown();
setInterval(update75thBirthdayCountdown, 1000);


// --- Countdown to End of 2025 ---
function update2025Countdown() {
    const endOf2025 = new Date('2025-12-31T23:59:59').getTime(); // End of 2025 in milliseconds
    const now = new Date().getTime();
    const timeRemaining = endOf2025 - now;

    const displayElement = document.getElementById('countdown-2025');

    if (timeRemaining > 0) {
        displayElement.textContent = formatTime(timeRemaining);
    } else {
        displayElement.textContent = "2025 has ended!";
        // clearInterval(this.interval); // If you want to stop updating after target reached
    }
}
// Run immediately and then every second
update2025Countdown();
setInterval(update2025Countdown, 1000);


// --- Timer from Feb 1, 2025 (Count-up) ---
function updateCountUpFeb2025() {
    const startDate = new Date('2025-02-01T00:00:00').getTime(); // Feb 1, 2025 in milliseconds
    const now = new Date().getTime();
    const elapsedTime = now - startDate;

    const displayElement = document.getElementById('countup-feb-2025');

    if (elapsedTime > 0) {
        displayElement.textContent = formatTime(elapsedTime);
    } else {
        displayElement.textContent = "Not yet Feb 1, 2025.";
    }
}
// Run immediately and then every second
updateCountUpFeb2025();
setInterval(updateCountUpFeb2025, 1000);

// --- Recurrent Pomodoro Timer ---
const pomodoroDisplay = document.getElementById('pomodoro-display');
const startPomodoroBtn = document.getElementById('startPomodoro');
const pausePomodoroBtn = document.getElementById('pausePomodoro');
const resetPomodoroBtn = document.getElementById('resetPomodoro');
const skipBreakBtn = document.getElementById('skipBreak');
const pomodoroSection = document.querySelector('.timer-section:last-of-type'); // Selects the Pomodoro section

let pomodoroInterval;
let timeRemaining;
let isPaused = true;
let isWorkSession = true; // true for work, false for break
const WORK_TIME = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK_TIME = 5 * 60; // 5 minutes in seconds
// const LONG_BREAK_TIME = 15 * 60; // Not used in this basic version
let sessionCount = 0; // To track sessions for longer breaks, if implemented

function updatePomodoroDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = Math.floor(timeRemaining % 60);
    pomodoroDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startPomodoro() {
    if (!isPaused) return; // Prevent multiple starts
    isPaused = false;
    startPomodoroBtn.disabled = true;
    pausePomodoroBtn.disabled = false;
    resetPomodoroBtn.disabled = false;
    skipBreakBtn.style.display = 'none'; // Hide skip break button initially

    if (timeRemaining === undefined || timeRemaining < 0 || (isWorkSession && timeRemaining === 0)) {
        // If undefined, negative, or a completed work session, start a new work cycle
        timeRemaining = WORK_TIME;
        isWorkSession = true;
        pomodoroSection.classList.remove('pomodoro-break-active'); // Ensure work session style
    } else if (!isWorkSession && timeRemaining === 0) {
        // If a completed break session, start a new work cycle
        timeRemaining = WORK_TIME;
        isWorkSession = true;
        pomodoroSection.classList.remove('pomodoro-break-active'); // Ensure work session style
    }


    pomodoroInterval = setInterval(() => {
        timeRemaining--;
        updatePomodoroDisplay();

        if (timeRemaining <= 0) {
            clearInterval(pomodoroInterval);
            // playAlarmSound(); // Call your sound function here

            if (isWorkSession) {
                sessionCount++;
                alert('Work session finished! Time for a break.');
                timeRemaining = SHORT_BREAK_TIME;
                isWorkSession = false;
                pomodoroSection.classList.add('pomodoro-break-active'); // Apply break style
                skipBreakBtn.style.display = 'inline-block'; // Show skip break button
            } else {
                alert('Break finished! Time to work.');
                timeRemaining = WORK_TIME;
                isWorkSession = true;
                pomodoroSection.classList.remove('pomodoro-break-active'); // Remove break style
                skipBreakBtn.style.display = 'none'; // Hide skip break button
            }
            isPaused = true; // Pause after session ends, ready for next start
            startPomodoroBtn.disabled = false;
            pausePomodoroBtn.disabled = true;
            updatePomodoroDisplay(); // Update display for new session/break time
        }
    }, 1000);
}

function pausePomodoro() {
    if (isPaused) return;
    isPaused = true;
    clearInterval(pomodoroInterval);
    startPomodoroBtn.disabled = false;
    pausePomodoroBtn.disabled = true;
}

function resetPomodoro() {
    clearInterval(pomodoroInterval);
    timeRemaining = WORK_TIME;
    isPaused = true;
    isWorkSession = true;
    sessionCount = 0;
    updatePomodoroDisplay();
    startPomodoroBtn.disabled = false;
    pausePomodoroBtn.disabled = true;
    resetPomodoroBtn.disabled = false;
    pomodoroSection.classList.remove('pomodoro-break-active');
    skipBreakBtn.style.display = 'none';
}

function skipBreak() {
    // Only allow skipping if currently on a break session (not work) and it's paused.
    // Also, timeRemaining must be greater than 0, otherwise the break has already finished.
    if (!isWorkSession && isPaused && timeRemaining > 0) {
        clearInterval(pomodoroInterval);
        timeRemaining = WORK_TIME; // Set time for next work session
        isWorkSession = true; // Switch to work session
        isPaused = false; // Automatically start the next work session
        pomodoroSection.classList.remove('pomodoro-break-active');
        skipBreakBtn.style.display = 'none';
        startPomodoro(); // Call startPomodoro to begin the next work cycle
    }
}


// Function to play a simple alarm sound (you'll need an audio file or more complex Web Audio API)
function playAlarmSound() {
    // To add sound:
    // 1. Find a short, simple alarm sound file (e.g., 'alarm.mp3').
    // 2. Place it in the same folder as your HTML/CSS/JS files.
    // 3. Uncomment the two lines below and replace 'alarm.mp3' with your file name.
    // const audio = new Audio('alarm.mp3');
    // audio.play().catch(e => console.error("Audio playback failed:", e)); // Add error handling for playback
    // Browsers often require a user interaction before playing audio for the first time.
}

// Initial setup for Pomodoro
resetPomodoro(); // Sets initial display to 25:00

// Event Listeners for Pomodoro buttons
startPomodoroBtn.addEventListener('click', startPomodoro);
pausePomodoroBtn.addEventListener('click', pausePomodoro);
resetPomodoroBtn.addEventListener('click', resetPomodoro);
skipBreakBtn.addEventListener('click', skipBreak);
