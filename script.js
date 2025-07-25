// --- Global Helper Functions ---

// Helper function to format time into Years, Months, Days, Hours, Minutes, Seconds
function formatTime(milliseconds) {
    if (milliseconds < 0) {
        milliseconds = Math.abs(milliseconds); // Use absolute value for display if showing elapsed time
    }

    const referenceDate = new Date(); // Start from current time
    const futureDate = new Date(referenceDate.getTime() + milliseconds);

    let years = futureDate.getFullYear() - referenceDate.getFullYear();
    let months = futureDate.getMonth() - referenceDate.getMonth();
    let days = futureDate.getDate() - referenceDate.getDate();

    // Adjust months and years if days are negative
    if (days < 0) {
        months--;
        const daysInLastMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 0).getDate();
        days += daysInLastMonth;
    }

    // Adjust years if months are negative
    if (months < 0) {
        years--;
        months += 12;
    }

    // Calculate remaining hours, minutes, seconds from milliseconds
    const remainingMillisecondsForHMS = milliseconds % (1000 * 60 * 60 * 24);
    const hours = Math.floor(remainingMillisecondsForHMS / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMillisecondsForHMS % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingMillisecondsForHMS % (1000 * 60)) / 1000);

    const pad = (num) => String(num).padStart(2, '0');

    if (years > 0) {
        return `${years}y ${months}mth ${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
    } else if (months > 0) {
        return `${months}mth ${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
    } else if (days > 0) {
        return `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
    } else {
        return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
    }
}

// --- Timer Sections (Existing Functionality) ---

function update75thBirthdayCountdown() {
    // IMPORTANT: Replace '1990-01-01' with your actual birth date (YYYY-MM-DD).
    const birthDate = new Date('1981-08-04');
    const targetAge = 75;
    const targetDate = new Date(birthDate.getFullYear() + targetAge, birthDate.getMonth(), birthDate.getDate());

    const now = new Date();
    const timeRemaining = targetDate.getTime() - now.getTime();
    const displayElement = document.getElementById('countdown-75');

    if (timeRemaining > 0) {
        displayElement.textContent = formatTime(timeRemaining);
    } else {
        displayElement.textContent = "You are 75 or older!";
    }
}
update75thBirthdayCountdown();
setInterval(update75thBirthdayCountdown, 1000);

function update2025Countdown() {
    const endOf2025 = new Date('2025-12-31T23:59:59').getTime();
    const now = new Date().getTime();
    const timeRemaining = endOf2025 - now;
    const displayElement = document.getElementById('countdown-2025');

    if (timeRemaining > 0) {
        displayElement.textContent = formatTime(timeRemaining);
    } else {
        displayElement.textContent = "2025 has ended!";
    }
}
update2025Countdown();
setInterval(update2025Countdown, 1000);

function updateCountUpFeb2025() {
    const startDate = new Date('2025-02-01T00:00:00').getTime();
    const now = new Date().getTime();
    const elapsedTime = now - startDate;
    const displayElement = document.getElementById('countup-feb-2025');

    if (elapsedTime > 0) {
        displayElement.textContent = formatTime(elapsedTime);
    } else {
        displayElement.textContent = "Not yet Feb 1, 2025.";
    }
}
updateCountUpFeb2025();
setInterval(updateCountUpFeb2025, 1000);

// --- Recurrent Pomodoro Timer ---
const pomodoroDisplay = document.getElementById('pomodoro-display');
const startPomodoroBtn = document.getElementById('startPomodoro');
const pausePomodoroBtn = document.getElementById('pausePomodoro');
const resetPomodoroBtn = document.getElementById('resetPomodoro');
const skipBreakBtn = document.getElementById('skipBreak');
const pomodoroSection = document.getElementById('card-timers').querySelector('.sub-timer-section:last-of-type'); // Adjust selector to fit new structure

let pomodoroInterval;
let timeRemaining;
let isPaused = true;
let isWorkSession = true;
const WORK_TIME = 25 * 60;
const SHORT_BREAK_TIME = 5 * 60;
let sessionCount = 0;

function updatePomodoroDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = Math.floor(timeRemaining % 60);
    pomodoroDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startPomodoro() {
    if (!isPaused) return;
    isPaused = false;
    startPomodoroBtn.disabled = true;
    pausePomodoroBtn.disabled = false;
    resetPomodoroBtn.disabled = false;
    skipBreakBtn.style.display = 'none';

    if (timeRemaining === undefined || timeRemaining < 0 || (isWorkSession && timeRemaining === 0)) {
        timeRemaining = WORK_TIME;
        isWorkSession = true;
        pomodoroSection.classList.remove('pomodoro-break-active');
    } else if (!isWorkSession && timeRemaining === 0) {
        timeRemaining = WORK_TIME;
        isWorkSession = true;
        pomodoroSection.classList.remove('pomodoro-break-active');
    }

    pomodoroInterval = setInterval(() => {
        timeRemaining--;
        updatePomodoroDisplay();

        if (timeRemaining <= 0) {
            clearInterval(pomodoroInterval);
            playAlarmSound();

            if (isWorkSession) {
                sessionCount++;
                alert('Work session finished! Time for a break.');
                timeRemaining = SHORT_BREAK_TIME;
                isWorkSession = false;
                pomodoroSection.classList.add('pomodoro-break-active');
                skipBreakBtn.style.display = 'inline-block';
            } else {
                alert('Break finished! Time to work.');
                timeRemaining = WORK_TIME;
                isWorkSession = true;
                pomodoroSection.classList.remove('pomodoro-break-active');
                skipBreakBtn.style.display = 'none';
            }
            isPaused = true;
            startPomodoroBtn.disabled = false;
            pausePomodoroBtn.disabled = true;
            updatePomodoroDisplay();
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
    if (!isWorkSession && isPaused && timeRemaining > 0) {
        clearInterval(pomodoroInterval);
        timeRemaining = WORK_TIME;
        isWorkSession = true;
        isPaused = false;
        pomodoroSection.classList.remove('pomodoro-break-active');
        skipBreakBtn.style.display = 'none';
        startPomodoro();
    }
}

function playAlarmSound() {
    // Add actual sound logic here if desired
}

resetPomodoro();
startPomodoroBtn.addEventListener('click', startPomodoro);
pausePomodoroBtn.addEventListener('click', pausePomodoro);
resetPomodoroBtn.addEventListener('click', resetPomodoro);
skipBreakBtn.addEventListener('click', skipBreak);

// --- Customisable Dashboard Layout ---
const dashboardContainer = document.getElementById('dashboard-container');
const layoutSelector = document.getElementById('layout-selector');

function applyLayout(layoutClass) {
    dashboardContainer.classList.remove('layout-two-columns', 'layout-three-columns');
    if (layoutClass !== 'default') {
        dashboardContainer.classList.add(layoutClass);
    }
    localStorage.setItem('dashboardLayout', layoutClass); // Save preference
}

// Load saved layout on page load
const savedLayout = localStorage.getItem('dashboardLayout') || 'default';
layoutSelector.value = savedLayout;
applyLayout(savedLayout);

layoutSelector.addEventListener('change', (event) => {
    applyLayout(event.target.value);
});


// --- Simple To-Do List (Persistent) ---
const newTodoInput = document.getElementById('new-todo-input');
const addTodoBtn = document.getElementById('add-todo-btn');
const todoList = document.getElementById('todo-list');

let todos = JSON.parse(localStorage.getItem('todos')) || []; // Load from localStorage

function renderTodos() {
    todoList.innerHTML = ''; // Clear current list
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = todo.completed ? 'completed' : '';
        li.innerHTML = `
            <span>${todo.text}</span>
            <div class="todo-actions">
                <button class="complete-btn">${todo.completed ? 'Uncomplete' : 'Complete'}</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        li.querySelector('.complete-btn').addEventListener('click', () => {
            todos[index].completed = !todos[index].completed;
            saveTodos();
            renderTodos();
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
            todos.splice(index, 1); // Remove from array
            saveTodos();
            renderTodos();
        });
        todoList.appendChild(li);
    });
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos)); // Save to localStorage
}

addTodoBtn.addEventListener('click', () => {
    const text = newTodoInput.value.trim();
    if (text) {
        todos.push({ text: text, completed: false });
        newTodoInput.value = '';
        saveTodos();
        renderTodos();
    }
});

renderTodos(); // Initial render


// --- Quick Notes / Scratchpad (Persistent) ---
const notesTextarea = document.getElementById('notes-textarea');

// Load notes from localStorage
notesTextarea.value = localStorage.getItem('quickNotes') || '';

// Save notes to localStorage on input change
notesTextarea.addEventListener('input', () => {
    localStorage.setItem('quickNotes', notesTextarea.value);
});


// --- Habit Tracker (Daily Check-off) ---
const newHabitInput = document.getElementById('new-habit-input');
const addHabitBtn = document.getElementById('add-habit-btn');
const habitListContainer = document.getElementById('habit-list-container');
const currentDateDisplay = document.getElementById('current-date-display');

let habits = JSON.parse(localStorage.getItem('habits')) || []; // Array of {name: string, completedDates: {date: boolean}}

function getCurrentDateKey() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

function renderHabits() {
    habitListContainer.innerHTML = '';
    const todayKey = getCurrentDateKey();
    currentDateDisplay.textContent = new Date().toLocaleDateString('en-GB', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});

    habits.forEach((habit, index) => {
        const isCompletedToday = habit.completedDates[todayKey] === true;

        const div = document.createElement('div');
        div.className = `habit-item ${isCompletedToday ? 'completed-today' : ''}`;
        div.innerHTML = `
            <span>${habit.name}</span>
            <div class="habit-actions">
                <button class="mark-habit-btn">${isCompletedToday ? 'Unmark' : 'Mark Done'}</button>
                <button class="delete-habit-btn">Delete</button>
            </div>
        `;

        div.querySelector('.mark-habit-btn').addEventListener('click', () => {
            if (isCompletedToday) {
                delete habit.completedDates[todayKey]; // Unmark
            } else {
                habit.completedDates[todayKey] = true; // Mark done
            }
            saveHabits();
            renderHabits();
        });

        div.querySelector('.delete-habit-btn').addEventListener('click', () => {
            habits.splice(index, 1);
            saveHabits();
            renderHabits();
        });
        habitListContainer.appendChild(div);
    });

    // If no habits, display a message
    if (habits.length === 0) {
        habitListContainer.innerHTML = '<p style="text-align: center; color: #7f8c8d;">No habits added yet.</p>';
    }
}

function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

addHabitBtn.addEventListener('click', () => {
    const name = newHabitInput.value.trim();
    if (name) {
        // Check if habit already exists to prevent duplicates
        const existingHabit = habits.find(h => h.name.toLowerCase() === name.toLowerCase());
        if (!existingHabit) {
            habits.push({ name: name, completedDates: {} });
            newHabitInput.value = '';
            saveHabits();
            renderHabits();
        } else {
            alert('This habit already exists!');
        }
    }
});

renderHabits(); // Initial render


// --- Quick Link Launcher ---
const newLinkNameInput = document.getElementById('new-link-name');
const newLinkUrlInput = document.getElementById('new-link-url');
const addLinkBtn = document.getElementById('add-link-btn');
const linkList = document.getElementById('link-list');

let links = JSON.parse(localStorage.getItem('quickLinks')) || []; // Array of {name: string, url: string}

function renderLinks() {
    linkList.innerHTML = '';
    links.forEach((link, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.name}</a>
            <button class="delete-link-btn">Delete</button>
        `;
        li.querySelector('.delete-link-btn').addEventListener('click', () => {
            links.splice(index, 1);
            saveLinks();
            renderLinks();
        });
        linkList.appendChild(li);
    });
    if (links.length === 0) {
        linkList.innerHTML = '<p style="text-align: center; color: #7f8c8d;">No links added yet.</p>';
    }
}

function saveLinks() {
    localStorage.setItem('quickLinks', JSON.stringify(links));
}

addLinkBtn.addEventListener('click', () => {
    const name = newLinkNameInput.value.trim();
    const url = newLinkUrlInput.value.trim();

    if (name && url) {
        // Basic URL validation
        try {
            new URL(url); // Throws error if invalid URL
            links.push({ name: name, url: url });
            newLinkNameInput.value = '';
            newLinkUrlInput.value = '';
            saveLinks();
            renderLinks();
        } catch (e) {
            alert('Please enter a valid URL (e.g., https://example.com)');
        }
    } else {
        alert('Please enter both link name and URL.');
    }
});

renderLinks(); // Initial render


// --- Goal Progress Visualiser (Simple) ---
const goalNameInput = document.getElementById('goal-name-input');
const goalTargetInput = document.getElementById('goal-target-input');
const setGoalBtn = document.getElementById('set-goal-btn');
const currentGoalDisplay = document.getElementById('current-goal-display');
const goalTitle = document.getElementById('goal-title');
const goalCurrentValue = document.getElementById('goal-current-value');
const goalTargetValue = document.getElementById('goal-target-value');
const goalProgressFill = document.getElementById('goal-progress-fill');
const goalProgressText = document.getElementById('goal-progress-text');
const increaseProgressBtn = document.getElementById('increase-progress-btn');
const decreaseProgressBtn = document.getElementById('decrease-progress-btn');
const noGoalMessage = document.getElementById('no-goal-message');

let currentGoal = JSON.parse(localStorage.getItem('currentGoal')) || null;
let goalProgressInterval; // For potential future real-time updates

function renderGoal() {
    if (currentGoal) {
        noGoalMessage.style.display = 'none';
        currentGoalDisplay.style.display = 'block';

        goalNameInput.value = currentGoal.name; // Pre-fill input with current goal
        goalTargetInput.value = currentGoal.target;

        goalTitle.textContent = currentGoal.name;
        goalCurrentValue.textContent = currentGoal.current;
        goalTargetValue.textContent = currentGoal.target;

        const percentage = currentGoal.target > 0 ? (currentGoal.current / currentGoal.target) * 100 : 0;
        goalProgressFill.style.width = `${Math.min(100, percentage)}%`; // Cap at 100%
        goalProgressText.textContent = `${Math.floor(percentage)}%`;

        if (currentGoal.current >= currentGoal.target && currentGoal.target > 0) {
            goalProgressText.textContent = `Goal Achieved!`;
            goalProgressFill.style.backgroundColor = '#28a745'; // Green for completion
            // Play confetti or other celebration here
        } else {
            goalProgressFill.style.backgroundColor = '#28a745'; // Reset to default green
        }

    } else {
        noGoalMessage.style.display = 'block';
        currentGoalDisplay.style.display = 'none';
        goalNameInput.value = '';
        goalTargetInput.value = '';
    }
}

function saveGoal() {
    localStorage.setItem('currentGoal', JSON.stringify(currentGoal));
    renderGoal();
}

setGoalBtn.addEventListener('click', () => {
    const name = goalNameInput.value.trim();
    const target = parseInt(goalTargetInput.value);

    if (name && !isNaN(target) && target > 0) {
        currentGoal = {
            name: name,
            target: target,
            current: 0 // Start at 0 for a new goal
        };
        saveGoal();
        alert('Goal set!');
    } else {
        alert('Please enter a valid goal name and a positive target value.');
    }
});

increaseProgressBtn.addEventListener('click', () => {
    if (currentGoal) {
        currentGoal.current = Math.min(currentGoal.target, currentGoal.current + 1); // Increment, cap at target
        saveGoal();
    }
});

decreaseProgressBtn.addEventListener('click', () => {
    if (currentGoal) {
        currentGoal.current = Math.max(0, currentGoal.current - 1); // Decrement, don't go below 0
        saveGoal();
    }
});

renderGoal(); // Initial render
