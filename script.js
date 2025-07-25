// --- Global Helper Functions ---

// Helper function to format time into Years, Months, Days, Hours, Minutes, Seconds
function formatTime(milliseconds) {
    if (milliseconds < 0) {
        milliseconds = Math.abs(milliseconds);
    }

    const referenceDate = new Date();
    const futureDate = new Date(referenceDate.getTime() + milliseconds);

    let years = futureDate.getFullYear() - referenceDate.getFullYear();
    let months = futureDate.getMonth() - referenceDate.getMonth();
    let days = futureDate.getDate() - referenceDate.getDate();

    if (days < 0) {
        months--;
        const daysInLastMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 0).getDate();
        days += daysInLastMonth;
    }

    if (months < 0) {
        years--;
        months += 12;
    }

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

// --- Timer Sections (Existing Functionality with Font Size Tweaks) ---

// Function to apply saved font sizes
function applyTimerFontSizes() {
    const fontSizeInputs = document.querySelectorAll('.font-size-input');
    fontSizeInputs.forEach(input => {
        const targetId = input.dataset.target;
        const targetElement = document.getElementById(targetId);
        const savedSize = localStorage.getItem(`timerFontSize_${targetId}`);
        if (savedSize) {
            targetElement.style.fontSize = `${savedSize}px`;
            input.value = savedSize;
        } else {
            targetElement.style.fontSize = `${input.value}px`; // Apply default if no saved
        }

        input.addEventListener('input', (event) => {
            const newSize = event.target.value;
            targetElement.style.fontSize = `${newSize}px`;
            localStorage.setItem(`timerFontSize_${targetId}`, newSize);
        });
    });
}

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

// --- Recurrent Pomodoro Timer ---
const pomodoroDisplay = document.getElementById('pomodoro-display');
const startPomodoroBtn = document.getElementById('startPomodoro');
const pausePomodoroBtn = document.getElementById('pausePomodoro');
const resetPomodoroBtn = document.getElementById('resetPomodoro');
const skipBreakBtn = document.getElementById('skipBreak');
const pomodoroSection = document.querySelector('#card-timers .sub-timer-section:last-of-type');

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

// Initial setup and event listeners for Timers
resetPomodoro();
startPomodoroBtn.addEventListener('click', startPomodoro);
pausePomodoroBtn.addEventListener('click', pausePomodoro);
resetPomodoroBtn.addEventListener('click', resetPomodoro);
skipBreakBtn.addEventListener('click', skipBreak);

// Run initial updates and apply font sizes
applyTimerFontSizes();
update75thBirthdayCountdown();
update2025Countdown();
updateCountUpFeb2025();

// --- Customisable Dashboard Layout ---
const dashboardContainer = document.getElementById('dashboard-container');
const layoutSelector = document.getElementById('layout-selector');
const customLayoutControls = document.getElementById('custom-layout-controls');
const cardOrderInput = document.getElementById('card-order-input');
const applyOrderBtn = document.getElementById('apply-order-btn');
const dashboardCards = document.querySelectorAll('.dashboard-card'); // Get all cards

// Mapping card IDs to their elements
const cardElements = {};
dashboardCards.forEach(card => {
    cardElements[card.dataset.cardId] = card;
});
const defaultOrder = Object.keys(cardElements); // ['timers', 'todo', 'notes', etc.]

function applyLayout(layoutClass, customOrder = defaultOrder) {
    dashboardContainer.classList.remove('layout-two-columns', 'layout-three-columns', 'layout-custom');

    // Reset order for all cards first
    dashboardCards.forEach(card => {
        card.style.order = ''; // Remove custom order
        card.style.width = ''; // Reset width for non-custom layouts
        card.style.flex = ''; // Reset flex for non-custom layouts
    });

    if (layoutClass === 'default') {
        // Cards will flow naturally (flex-wrap default)
        customLayoutControls.style.display = 'none';
    } else if (layoutClass === 'two-columns') {
        dashboardContainer.classList.add('layout-two-columns');
        customLayoutControls.style.display = 'none';
    } else if (layoutClass === 'three-columns') {
        dashboardContainer.classList.add('layout-three-columns');
        customLayoutControls.style.display = 'none';
    } else if (layoutClass === 'custom') {
        dashboardContainer.classList.add('layout-custom');
        customLayoutControls.style.display = 'flex'; // Show custom controls

        // Apply custom order
        customOrder.forEach((cardId, index) => {
            const card = cardElements[cardId];
            if (card) {
                card.style.order = index;
            }
        });
    }
    localStorage.setItem('dashboardLayout', layoutClass);
    localStorage.setItem('dashboardCustomOrder', JSON.stringify(customOrder));
}

// Load saved layout and order on page load
const savedLayout = localStorage.getItem('dashboardLayout') || 'default';
const savedCustomOrder = JSON.parse(localStorage.getItem('dashboardCustomOrder')) || defaultOrder;

layoutSelector.value = savedLayout;
cardOrderInput.value = savedCustomOrder.join(',');
applyLayout(savedLayout, savedCustomOrder);

layoutSelector.addEventListener('change', (event) => {
    const selectedLayout = event.target.value;
    if (selectedLayout === 'custom') {
        applyLayout(selectedLayout, savedCustomOrder); // Use existing saved order
    } else {
        applyLayout(selectedLayout, defaultOrder); // Reset order for non-custom layouts
    }
});

applyOrderBtn.addEventListener('click', () => {
    const newOrderString = cardOrderInput.value.trim();
    const newOrderArray = newOrderString.split(',').map(id => id.trim()).filter(id => id && cardElements[id]); // Filter out invalid IDs
    if (newOrderArray.length > 0) {
        applyLayout('custom', newOrderArray);
        layoutSelector.value = 'custom'; // Set dropdown to custom
    } else {
        alert('Please enter a comma-separated list of valid card IDs (e.g., timers,todo,notes).');
    }
});


// --- Simple To-Do List (Persistent) ---
const newTodoInput = document.getElementById('new-todo-input');
const addTodoBtn = document.getElementById('add-todo-btn');
const todoList = document.getElementById('todo-list');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

function renderTodos() {
    todoList.innerHTML = '';
    if (todos.length === 0) {
        todoList.innerHTML = '<p style="text-align: center; color: #7f8c8d;">No tasks added yet.</p>';
        return;
    }
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
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        });
        todoList.appendChild(li);
    });
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
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

renderTodos();


// --- Quick Notes / Scratchpad (Persistent) ---
const notesTextarea = document.getElementById('notes-textarea');

notesTextarea.value = localStorage.getItem('quickNotes') || '';

notesTextarea.addEventListener('input', () => {
    localStorage.setItem('quickNotes', notesTextarea.value);
});


// --- Habit Tracker (Daily Check-off) ---
const newHabitInput = document.getElementById('new-habit-input');
const addHabitBtn = document.getElementById('add-habit-btn');
const habitListContainer = document.getElementById('habit-list-container');
const currentDateDisplay = document.getElementById('current-date-display');

let habits = JSON.parse(localStorage.getItem('habits')) || [];

function getCurrentDateKey() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

function renderHabits() {
    habitListContainer.innerHTML = '';
    const todayKey = getCurrentDateKey();
    currentDateDisplay.textContent = new Date().toLocaleDateString('en-GB', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});

    if (habits.length === 0) {
        habitListContainer.innerHTML = '<p style="text-align: center; color: #7f8c8d;">No habits added yet.</p>';
        return;
    }

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
                delete habit.completedDates[todayKey];
            } else {
                habit.completedDates[todayKey] = true;
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
}

function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

addHabitBtn.addEventListener('click', () => {
    const name = newHabitInput.value.trim();
    if (name) {
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

renderHabits();


// --- Quick Link Launcher ---
const newLinkNameInput = document.getElementById('new-link-name');
const newLinkUrlInput = document.getElementById('new-link-url');
const addLinkBtn = document.getElementById('add-link-btn');
const linkList = document.getElementById('link-list');

let links = JSON.parse(localStorage.getItem('quickLinks')) || [];

function renderLinks() {
    linkList.innerHTML = '';
    if (links.length === 0) {
        linkList.innerHTML = '<p style="text-align: center; color: #7f8c8d;">No links added yet.</p>';
        return;
    }
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
}

function saveLinks() {
    localStorage.setItem('quickLinks', JSON.stringify(links));
}

addLinkBtn.addEventListener('click', () => {
    const name = newLinkNameInput.value.trim();
    const url = newLinkUrlInput.value.trim();

    if (name && url) {
        try {
            new URL(url);
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

renderLinks();


// --- Goal Progress Visualiser (Multiple Goals) ---
const addGoalNameInput = document.getElementById('add-goal-name');
const addGoalTargetInput = document.getElementById('add-goal-target');
const addGoalBtn = document.getElementById('add-goal-btn');
const goalsListContainer = document.getElementById('goals-list-container');
const noGoalsMessage = document.getElementById('no-goals-message');

let goals = JSON.parse(localStorage.getItem('goals')) || [];

function renderGoals() {
    goalsListContainer.innerHTML = ''; // Clear current list
    if (goals.length === 0) {
        noGoalsMessage.style.display = 'block';
        return;
    }
    noGoalsMessage.style.display = 'none';

    goals.forEach((goal, index) => {
        const goalItem = document.createElement('div');
        goalItem.className = 'goal-item';
        const percentage = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
        const progressText = goal.current >= goal.target && goal.target > 0 ? `Goal Achieved!` : `${Math.floor(percentage)}%`;
        const progressFillColor = goal.current >= goal.target && goal.target > 0 ? '#28a745' : '#28a745'; // Green for completion

        goalItem.innerHTML = `
            <h3>${goal.name}</h3>
            <p>Current: <span data-id="current-value">${goal.current}</span> / <span data-id="target-value">${goal.target}</span></p>
            <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: ${Math.min(100, percentage)}%; background-color: ${progressFillColor};"></div>
                <span class="progress-bar-text">${progressText}</span>
            </div>
            <div class="goal-controls">
                <button data-action="increase">+</button>
                <button data-action="decrease">-</button>
            </div>
            <button class="goal-delete-btn">Delete Goal</button>
        `;

        goalItem.querySelector('[data-action="increase"]').addEventListener('click', () => {
            goals[index].current = Math.min(goals[index].target, goals[index].current + 1);
            saveGoals();
        });

        goalItem.querySelector('[data-action="decrease"]').addEventListener('click', () => {
            goals[index].current = Math.max(0, goals[index].current - 1);
            saveGoals();
        });

        goalItem.querySelector('.goal-delete-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this goal?')) {
                goals.splice(index, 1);
                saveGoals();
            }
        });
        goalsListContainer.appendChild(goalItem);
    });
}

function saveGoals() {
    localStorage.setItem('goals', JSON.stringify(goals));
    renderGoals(); // Re-render to update display
}

addGoalBtn.addEventListener('click', () => {
    const name = addGoalNameInput.value.trim();
    const target = parseInt(addGoalTargetInput.value);

    if (name && !isNaN(target) && target > 0) {
        const newGoal = {
            name: name,
            target: target,
            current: 0
        };
        goals.push(newGoal);
        addGoalNameInput.value = '';
        addGoalTargetInput.value = '';
        saveGoals();
    } else {
        alert('Please enter a valid goal name and a positive target value.');
    }
});

renderGoals(); // Initial render of goals
