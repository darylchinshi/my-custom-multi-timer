// ============================================
// TIMER INITIALIZATION
// ============================================
function initializeTimers() {
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

    function update75thBirthdayCountdown() {
        const elem = document.getElementById('countdown-75');
        if (!elem) return;

        const birthDate = new Date('1981-08-04');
        const targetAge = 75;
        const targetDate = new Date(birthDate.getFullYear() + targetAge, birthDate.getMonth(), birthDate.getDate());

        const now = new Date();
        const timeRemaining = targetDate.getTime() - now.getTime();

        if (timeRemaining > 0) {
            elem.textContent = formatTime(timeRemaining);
        } else {
            elem.textContent = "You are 75 or older!";
        }
    }

    function updateCountUpFeb2025() {
        const elem = document.getElementById('countup-feb-2025');
        if (!elem) return;

        const startDate = new Date('2025-02-01T00:00:00').getTime();
        const now = new Date().getTime();
        const elapsedTime = now - startDate;

        if (elapsedTime > 0) {
            elem.textContent = formatTime(elapsedTime);
        } else {
            elem.textContent = "Not yet Feb 1, 2025.";
        }
    }

    function updateCountUpJan122026() {
        const elem = document.getElementById('countup-jan12-2026');
        if (!elem) return;

        const startDate = new Date('2026-01-12T00:00:00').getTime();
        const now = new Date().getTime();
        const elapsedTime = now - startDate;

        if (elapsedTime > 0) {
            elem.textContent = formatTime(elapsedTime);
        } else {
            elem.textContent = "Not yet Jan 12, 2026.";
        }
    }

    function updateCountdownDec312026() {
        const elem = document.getElementById('countdown-dec31-2026');
        if (!elem) return;

        const endDate = new Date('2026-12-31T23:59:59').getTime();
        const now = new Date().getTime();
        const timeRemaining = endDate - now;

        if (timeRemaining > 0) {
            elem.textContent = formatTime(timeRemaining);
        } else {
            elem.textContent = "2026 has ended!";
        }
    }

    // Promotion and increment eligibility runs from one year's completion.
    // Start date 12 January 2026, so the gate is 12 January 2027 — four weeks
    // past the December exit target, which is what makes it a real trade.
    function updateCountdownJan122027() {
        const elem = document.getElementById('countdown-jan12-2027');
        if (!elem) return;

        const gateDate = new Date('2027-01-12T00:00:00').getTime();
        const now = new Date().getTime();
        const timeRemaining = gateDate - now;

        if (timeRemaining > 0) {
            elem.textContent = formatTime(timeRemaining);
        } else {
            elem.textContent = "Eligibility gate reached.";
        }
    }

    update75thBirthdayCountdown();
    updateCountUpFeb2025();
    updateCountUpJan122026();
    updateCountdownDec312026();
    updateCountdownJan122027();

    setInterval(update75thBirthdayCountdown, 1000);
    setInterval(updateCountUpFeb2025, 1000);
    setInterval(updateCountUpJan122026, 1000);
    setInterval(updateCountdownDec312026, 1000);
    setInterval(updateCountdownJan122027, 1000);
}

// ============================================
// POMODORO TIMER
// ============================================
function initializePomodoro() {
    const pomodoroDisplay = document.getElementById('pomodoro-display');
    const startPomodoroBtn = document.getElementById('startPomodoro');
    const pausePomodoroBtn = document.getElementById('pausePomodoro');
    const resetPomodoroBtn = document.getElementById('resetPomodoro');
    const skipBreakBtn = document.getElementById('skipBreak');
    const pomodoroSection = document.querySelector('#card-timers .sub-timer-section:first-of-type');

    if (!pomodoroDisplay || !startPomodoroBtn) return;

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

    resetPomodoro();
    startPomodoroBtn.addEventListener('click', startPomodoro);
    pausePomodoroBtn.addEventListener('click', pausePomodoro);
    resetPomodoroBtn.addEventListener('click', resetPomodoro);
    skipBreakBtn.addEventListener('click', skipBreak);
}

// ============================================
// TODO LIST
// ============================================
function initializeTodos() {
    const newTodoInput = document.getElementById('new-todo-input');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const todoList = document.getElementById('todo-list');

    if (!newTodoInput || !addTodoBtn || !todoList) return;

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function renderTodos() {
        todoList.innerHTML = '';
        if (todos.length === 0) {
            todoList.innerHTML = '<p class="empty-message">No tasks added yet.</p>';
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
}

// ============================================
// QUICK NOTES
// ============================================
function initializeNotes() {
    const notesTextarea = document.getElementById('notes-textarea');
    if (!notesTextarea) return;

    notesTextarea.value = localStorage.getItem('quickNotes') || '';

    notesTextarea.addEventListener('input', () => {
        localStorage.setItem('quickNotes', notesTextarea.value);
    });
}

// ============================================
// HABIT TRACKER
// ============================================
function initializeHabits() {
    const newHabitInput = document.getElementById('new-habit-input');
    const addHabitBtn = document.getElementById('add-habit-btn');
    const habitListContainer = document.getElementById('habit-list-container');
    const currentDateDisplay = document.getElementById('current-date-display');

    if (!newHabitInput || !addHabitBtn || !habitListContainer) return;

    let habits = JSON.parse(localStorage.getItem('habits')) || [];

    function getCurrentDateKey() {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }

    function renderHabits() {
        habitListContainer.innerHTML = '';
        const todayKey = getCurrentDateKey();
        currentDateDisplay.textContent = new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        if (habits.length === 0) {
            habitListContainer.innerHTML = '<p class="empty-message">No habits added yet.</p>';
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
}

// ============================================
// QUICK LINKS
// ============================================
function initializeLinks() {
    const newLinkNameInput = document.getElementById('new-link-name');
    const newLinkUrlInput = document.getElementById('new-link-url');
    const addLinkBtn = document.getElementById('add-link-btn');
    const linkList = document.getElementById('link-list');

    if (!newLinkNameInput || !addLinkBtn || !linkList) return;

    let links = JSON.parse(localStorage.getItem('quickLinks')) || [];

    function renderLinks() {
        linkList.innerHTML = '';
        if (links.length === 0) {
            linkList.innerHTML = '<p class="empty-message">No links added yet.</p>';
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
}

// ============================================
// GOALS
// ============================================
function initializeGoals() {
    const addGoalNameInput = document.getElementById('add-goal-name');
    const addGoalTargetInput = document.getElementById('add-goal-target');
    const addGoalBtn = document.getElementById('add-goal-btn');
    const goalsListContainer = document.getElementById('goals-list-container');
    const noGoalsMessage = document.getElementById('no-goals-message');

    if (!addGoalNameInput || !addGoalBtn || !goalsListContainer) return;

    let goals = JSON.parse(localStorage.getItem('goals')) || [];

    function renderGoals() {
        goalsListContainer.innerHTML = '';
        if (goals.length === 0) {
            goalsListContainer.appendChild(noGoalsMessage);
            noGoalsMessage.style.display = 'block';
            return;
        }
        noGoalsMessage.style.display = 'none';

        goals.forEach((goal, index) => {
            const goalItem = document.createElement('div');
            goalItem.className = 'goal-item';
            const percentage = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
            const progressText = goal.current >= goal.target && goal.target > 0 ? `Goal Achieved!` : `${Math.floor(percentage)}%`;

            goalItem.innerHTML = `
                <h3>${goal.name}</h3>
                <p>Current: <span data-id="current-value">${goal.current}</span> / <span data-id="target-value">${goal.target}</span></p>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${Math.min(100, percentage)}%;"></div>
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
        renderGoals();
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

    renderGoals();
}

// ============================================
// SINKING FUND (SGD)
// ============================================
function initializeFund() {
    const targetInput = document.getElementById('fund-target-input');
    const entryDateInput = document.getElementById('fund-entry-date');
    const entryAmountInput = document.getElementById('fund-entry-amount');
    const addEntryBtn = document.getElementById('add-fund-entry-btn');
    const entryList = document.getElementById('fund-entry-list');
    const progressFill = document.getElementById('fund-progress-fill');
    const progressText = document.getElementById('fund-progress-text');
    const totalDisplay = document.getElementById('fund-total-display');

    if (!targetInput || !addEntryBtn) return;

    // Malaysia is the active surrogacy track: RM310,000 base is roughly S$98,000
    // at 18 Jul 2026 rates. The old 300,000 default was the California benchmark.
    const DEFAULT_TARGET = 98000;
    let fund = JSON.parse(localStorage.getItem('sinkingFund')) || { target: DEFAULT_TARGET, entries: [] };
    if (!fund.target || fund.target <= 0) fund.target = DEFAULT_TARGET;
    if (!Array.isArray(fund.entries)) fund.entries = [];

    function todayKey() {
        const t = new Date();
        return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
    }

    function fmtSGD(n) {
        return 'S$' + Number(n).toLocaleString('en-SG', { maximumFractionDigits: 0 });
    }

    function saveFund() {
        localStorage.setItem('sinkingFund', JSON.stringify(fund));
    }

    function renderFund() {
        const total = fund.entries.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
        const pct = fund.target > 0 ? (total / fund.target) * 100 : 0;

        progressFill.style.width = Math.min(100, pct) + '%';
        progressText.textContent = pct >= 100 ? 'Funded' : Math.floor(pct) + '%';
        totalDisplay.textContent = fmtSGD(total) + ' saved of ' + fmtSGD(fund.target);

        entryList.innerHTML = '';
        if (fund.entries.length === 0) {
            entryList.innerHTML = '<p class="empty-message">No contributions logged yet.</p>';
            return;
        }
        [...fund.entries]
            .sort((a, b) => b.date.localeCompare(a.date))
            .forEach((entry) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span class="fund-entry-date">${entry.date}</span>
                    <span class="fund-entry-amount">${fmtSGD(entry.amount)}</span>
                    <button class="delete-fund-btn">Delete</button>
                `;
                li.querySelector('.delete-fund-btn').addEventListener('click', () => {
                    fund.entries = fund.entries.filter((e) => e !== entry);
                    saveFund();
                    renderFund();
                });
                entryList.appendChild(li);
            });
    }

    targetInput.value = fund.target;
    entryDateInput.value = todayKey();

    targetInput.addEventListener('change', () => {
        const v = parseInt(targetInput.value, 10);
        if (!isNaN(v) && v > 0) {
            fund.target = v;
            saveFund();
            renderFund();
        }
    });

    addEntryBtn.addEventListener('click', () => {
        const date = entryDateInput.value || todayKey();
        const amount = parseFloat(entryAmountInput.value);
        if (isNaN(amount) || amount === 0) {
            alert('Enter a contribution amount in Singapore dollars. Negative amounts are allowed for withdrawals.');
            return;
        }
        fund.entries.push({ date: date, amount: amount });
        entryAmountInput.value = '';
        entryDateInput.value = todayKey();
        saveFund();
        renderFund();
    });

    renderFund();
}

// ============================================
// BACKUP — EXPORT / IMPORT ALL + 14-DAY NUDGE
// ============================================
function initializeBackup() {
    const exportBtn = document.getElementById('export-all-btn');
    const importInput = document.getElementById('import-all-input');
    const statusEl = document.getElementById('backup-status');
    const bannerEl = document.getElementById('backup-banner');

    if (!exportBtn || !importInput) return;

    const BACKUP_KEYS = ['todos', 'quickLinks', 'quickNotes', 'habits', 'goals', 'sinkingFund', 'training-tracker-v1', 'hard75', 'sleepLog'];
    const NUDGE_DAYS = 14;

    function refreshStatus() {
        const last = localStorage.getItem('lastExportAll');
        if (!last) {
            statusEl.textContent = 'No backup yet. Everything on this page lives in this browser only.';
            statusEl.classList.add('overdue');
            bannerEl.textContent = 'No backup has ever been exported. Use Export All in the Backup card below.';
            bannerEl.style.display = 'block';
            return;
        }
        const lastDate = new Date(parseInt(last, 10));
        const days = Math.floor((Date.now() - lastDate.getTime()) / (24 * 3600 * 1000));
        statusEl.textContent = 'Last backup: ' + lastDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) + ' (' + days + (days === 1 ? ' day' : ' days') + ' ago)';
        if (days >= NUDGE_DAYS) {
            statusEl.classList.add('overdue');
            bannerEl.textContent = 'Backup overdue: last export was ' + days + ' days ago. Use Export All in the Backup card below.';
            bannerEl.style.display = 'block';
        } else {
            statusEl.classList.remove('overdue');
            bannerEl.style.display = 'none';
        }
    }

    exportBtn.addEventListener('click', () => {
        const payload = { exportedAt: new Date().toISOString(), source: 'mox-nox-dashboard', data: {} };
        BACKUP_KEYS.forEach((key) => {
            const raw = localStorage.getItem(key);
            if (raw !== null) {
                try {
                    payload.data[key] = JSON.parse(raw);
                } catch (e) {
                    payload.data[key] = raw; // quickNotes is a plain string
                }
            }
        });
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const t = new Date();
        a.href = url;
        a.download = 'mox-nox-backup-' + t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0') + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        localStorage.setItem('lastExportAll', String(Date.now()));
        refreshStatus();
    });

    importInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        e.target.value = '';
        if (!file) return;
        if (!confirm('Import will replace this browser\'s data for every card (and the Training Tracker) with the file\'s contents. Continue?')) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const parsed = JSON.parse(reader.result);
                if (!parsed || typeof parsed !== 'object' || !parsed.data) throw new Error('bad format');
                BACKUP_KEYS.forEach((key) => {
                    if (key in parsed.data) {
                        const value = parsed.data[key];
                        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
                    }
                });
                alert('Import complete. Reloading.');
                location.reload();
            } catch (err) {
                alert('Import failed: that file is not a valid backup.');
            }
        };
        reader.readAsText(file);
    });

    refreshStatus();
}


// ============================================
// 75 HARD — strict. Any missed box resets the streak to 0 the next day.
// Day Zero rehearsal 14-27 Aug 2026. Day 1 targeted 28 Aug 2026.
// ============================================
function initialize75Hard() {
    const listEl = document.getElementById('hard-list');
    const streakNumEl = document.getElementById('hard-streak-number');
    const streakLabelEl = document.getElementById('hard-streak-label');
    const badgeEl = document.getElementById('hard-phase-badge');
    const noteEl = document.getElementById('hard-phase-note');
    const progressEl = document.getElementById('hard-progress');
    const startBtn = document.getElementById('hard-start-btn');
    const resetBtn = document.getElementById('hard-reset-btn');

    if (!listEl || !streakNumEl) return;

    const TASKS = [
        { id: 'w1',      label: 'Workout 1',       meta: '06:45 · bike + block' },
        { id: 'reading', label: 'Reading',         meta: '10 pages' },
        { id: 'water',   label: 'Water',           meta: '8 glasses · 1 gallon', water: true },
        { id: 'diet',    label: 'Diet',            meta: 'no cheat meals' },
        { id: 'alcohol', label: 'No alcohol',      meta: '' },
        { id: 'w2',      label: 'Workout 2',       meta: '19:45 · outdoor 45 min' },
        { id: 'photo',   label: 'Progress photo',  meta: '' }
    ];
    const WATER_GLASSES = 8;
    const DAY_ZERO_START = '2026-08-14';
    const DAY_ONE_TARGET = '2026-08-28';

    let state = JSON.parse(localStorage.getItem('hard75')) || {
        started: false,
        startDate: null,
        streak: 0,
        best: 0,
        days: {}
    };
    if (!state.days) state.days = {};

    function todayKey() {
        const t = new Date();
        return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
    }

    function prevKey(key) {
        const d = new Date(key + 'T00:00:00');
        d.setDate(d.getDate() - 1);
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    function blankDay() {
        const d = { water: 0 };
        TASKS.forEach((t) => { if (!t.water) d[t.id] = false; });
        return d;
    }

    function dayComplete(d) {
        if (!d) return false;
        return TASKS.every((t) => (t.water ? d.water >= WATER_GLASSES : d[t.id] === true));
    }

    function save() {
        localStorage.setItem('hard75', JSON.stringify(state));
    }

    // Roll the streak forward. Called on every load. Strict: a day that ended
    // incomplete zeroes the count. Silent, per the rule set 14 Aug 2026.
    function rollForward() {
        const today = todayKey();
        if (!state.started) return;
        if (state.lastRolled === today) return;

        let cursor = state.lastRolled || state.startDate;
        while (cursor && cursor < today) {
            if (cursor >= state.startDate) {
                if (dayComplete(state.days[cursor])) {
                    state.streak += 1;
                    if (state.streak > state.best) state.best = state.streak;
                } else {
                    state.streak = 0;
                }
            }
            cursor = (function (k) {
                const d = new Date(k + 'T00:00:00');
                d.setDate(d.getDate() + 1);
                return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
            })(cursor);
        }
        state.lastRolled = today;
        save();
    }

    function render() {
        const today = todayKey();
        if (!state.days[today]) state.days[today] = blankDay();
        const d = state.days[today];

        if (state.started) {
            const displayed = dayComplete(d) ? state.streak + 1 : state.streak;
            streakNumEl.textContent = displayed;
            streakLabelEl.textContent = 'of 75' + (state.best > displayed ? ' · best ' + state.best : '');
            badgeEl.textContent = 'Day ' + (displayed + (dayComplete(d) ? 0 : 1));
            badgeEl.classList.add('live');
            noteEl.textContent = 'Strict rules. Any box left unticked when the day ends resets this to 0 tomorrow morning.';
            noteEl.classList.remove('warn');
            startBtn.style.display = 'none';
        } else {
            const dz = Math.max(1, Math.round((new Date(today) - new Date(DAY_ZERO_START)) / 86400000) + 1);
            streakNumEl.textContent = '0';
            streakLabelEl.textContent = 'of 75 · rehearsal, no streak at stake';
            badgeEl.textContent = 'Day zero · ' + dz + ' of 14';
            badgeEl.classList.remove('live');
            noteEl.textContent = 'Two-week rehearsal. Day 1 starts ' + DAY_ONE_TARGET + '. Nothing counts until you press Start Day 1.';
            noteEl.classList.remove('warn');
            startBtn.style.display = 'inline-block';
        }

        listEl.innerHTML = '';
        TASKS.forEach((t) => {
            if (t.water) {
                const li = document.createElement('li');
                li.className = 'water-row';
                li.style.cursor = 'default';
                let glasses = '';
                for (let i = 0; i < WATER_GLASSES; i++) {
                    glasses += '<button class="water-glass' + (i < d.water ? ' filled' : '') + '" data-i="' + (i + 1) + '" aria-label="Glass ' + (i + 1) + '"></button>';
                }
                li.innerHTML = '<span class="hard-box' + (d.water >= WATER_GLASSES ? '' : '') + '"' +
                    ' style="' + (d.water >= WATER_GLASSES ? 'background:var(--optic);border-color:var(--optic);color:#141810' : '') + '">' +
                    (d.water >= WATER_GLASSES ? '&#10003;' : '') + '</span>' +
                    '<div class="water-glasses">' + glasses + '</div>' +
                    '<span class="hard-meta">' + d.water + '/' + WATER_GLASSES + '</span>';
                li.querySelectorAll('.water-glass').forEach((btn) => {
                    btn.addEventListener('click', () => {
                        const n = parseInt(btn.dataset.i, 10);
                        d.water = (d.water === n) ? n - 1 : n;
                        save();
                        render();
                    });
                });
                listEl.appendChild(li);
                return;
            }

            const li = document.createElement('li');
            li.className = d[t.id] ? 'done' : '';
            li.innerHTML = '<span class="hard-box">&#10003;</span>' +
                '<span class="hard-label">' + t.label + '</span>' +
                (t.meta ? '<span class="hard-meta">' + t.meta + '</span>' : '');
            li.addEventListener('click', () => {
                d[t.id] = !d[t.id];
                save();
                render();
            });
            listEl.appendChild(li);
        });

        const done = TASKS.filter((t) => (t.water ? d.water >= WATER_GLASSES : d[t.id] === true)).length;
        progressEl.textContent = done + ' of ' + TASKS.length + ' done today' + (done === TASKS.length ? ' — day complete.' : '');
    }

    startBtn.addEventListener('click', () => {
        if (!confirm('Start Day 1 of 75 Hard today? Strict rules apply from now on — any missed box resets the count to 0.')) return;
        state.started = true;
        state.startDate = todayKey();
        state.lastRolled = todayKey();
        state.streak = 0;
        save();
        render();
    });

    resetBtn.addEventListener('click', () => {
        if (!confirm('Reset the streak to 0 and clear today\'s boxes? This does not delete earlier days.')) return;
        state.streak = 0;
        state.days[todayKey()] = blankDay();
        save();
        render();
    });

    rollForward();
    render();
}

// ============================================
// SLEEP — manual nightly log of the time you fell asleep.
// Target 23:30. Garmin remains the source of truth for the Sunday review;
// this exists for the nightly nudge, not for measurement accuracy.
// ============================================
function initializeSleep() {
    const input = document.getElementById('sleep-time-input');
    const logBtn = document.getElementById('sleep-log-btn');
    const listEl = document.getElementById('sleep-list');
    const lastValEl = document.getElementById('sleep-last-value');
    const lastLabelEl = document.getElementById('sleep-last-label');
    const avgEl = document.getElementById('sleep-avg');

    if (!input || !logBtn) return;

    const TARGET_MIN = 23 * 60 + 30; // 23:30

    let entries = JSON.parse(localStorage.getItem('sleepLog')) || [];
    if (!Array.isArray(entries)) entries = [];

    function todayKey() {
        const t = new Date();
        return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
    }

    // Minutes past midday, so 23:15 and 01:12 sort and average correctly
    // across the midnight boundary.
    function toAxis(hhmm) {
        const [h, m] = hhmm.split(':').map(Number);
        const mins = h * 60 + m;
        return mins < 12 * 60 ? mins + 24 * 60 : mins;
    }

    function fmtDelta(axisAvg) {
        const delta = Math.round(axisAvg - toAxis('23:30'));
        if (delta <= 0) return Math.abs(delta) + ' min inside target';
        return delta + ' min past target';
    }

    function axisToClock(axis) {
        let mins = Math.round(axis) % (24 * 60);
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
    }

    function save() {
        localStorage.setItem('sleepLog', JSON.stringify(entries));
    }

    function render() {
        const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

        if (sorted.length === 0) {
            lastValEl.textContent = '--:--';
            lastValEl.classList.remove('late');
            lastLabelEl.textContent = 'no entry yet · target 23:30';
            avgEl.textContent = 'Log seven nights to see a rolling average.';
            avgEl.classList.remove('late');
            listEl.innerHTML = '';
            return;
        }

        const last = sorted[0];
        const lastAxis = toAxis(last.time);
        lastValEl.textContent = last.time;
        lastValEl.classList.toggle('late', lastAxis > TARGET_MIN);
        lastLabelEl.textContent = last.date + ' · target 23:30';

        const recent = sorted.slice(0, 7);
        const avgAxis = recent.reduce((s, e) => s + toAxis(e.time), 0) / recent.length;
        avgEl.textContent = recent.length + '-night average ' + axisToClock(avgAxis) + ' — ' + fmtDelta(avgAxis);
        avgEl.classList.toggle('late', avgAxis > TARGET_MIN);

        listEl.innerHTML = '';
        sorted.slice(0, 7).forEach((entry) => {
            const li = document.createElement('li');
            const lateCls = toAxis(entry.time) > TARGET_MIN ? ' late' : '';
            li.innerHTML = '<span class="sleep-entry-date">' + entry.date + '</span>' +
                '<span class="sleep-entry-time' + lateCls + '">' + entry.time + '</span>' +
                '<button class="delete-sleep-btn">Delete</button>';
            li.querySelector('.delete-sleep-btn').addEventListener('click', () => {
                entries = entries.filter((e) => e !== entry);
                save();
                render();
            });
            listEl.appendChild(li);
        });
    }

    logBtn.addEventListener('click', () => {
        const time = input.value;
        if (!time) {
            alert('Enter the time you fell asleep.');
            return;
        }
        const key = todayKey();
        entries = entries.filter((e) => e.date !== key);
        entries.push({ date: key, time: time });
        save();
        render();
    });

    render();
}

// ============================================
// MASTER INITIALIZATION (single-run guard)
// ============================================
function masterInit() {
    // Guard: prior version ran this up to three times, stacking duplicate
    // click listeners (one click could add multiple tasks). Run once only.
    if (window.__moxNoxInitialised) return;
    window.__moxNoxInitialised = true;

    initializeTimers();
    initializePomodoro();
    initializeTodos();
    initializeNotes();
    initializeHabits();
    initializeLinks();
    initializeGoals();
    initializeFund();
    initialize75Hard();
    initializeSleep();
    initializeBackup();
}

// Script is loaded at the end of <body>, so the DOM is ready immediately.
masterInit();

// Backup: if the script is ever moved into <head>, this still initialises once.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', masterInit);
}
