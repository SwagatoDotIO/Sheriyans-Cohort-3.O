


"use strict";

function readStorage(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
    } catch (error) {
        console.warn("Could not read saved data:", key, error);
        return fallback;
    }
}

function writeStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error("Could not save data:", key, error);
        return false;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("Productivity Dashboard is ready.");
});




const dashboardView = document.getElementById("dashboardView");
const featureViews = document.querySelectorAll(".feature-view");
const featureCards = document.querySelectorAll(".feature-card");
const navItems = document.querySelectorAll(".nav-item");
const backButtons = document.querySelectorAll(".back-button");

function setActiveNav(featureId) {
    navItems.forEach(function (button) {
        const isHome = button.dataset.home === "true";
        const isSelected = featureId
            ? button.dataset.feature === featureId
            : isHome;

        button.classList.toggle("active", isSelected);
        button.setAttribute("aria-current", isSelected ? "page" : "false");
    });
}

function openFeature(featureId) {
    const selectedView = document.getElementById(featureId);

    if (!selectedView || !selectedView.classList.contains("feature-view")) {
        return;
    }

    dashboardView.classList.add("hidden");

    featureViews.forEach(function (view) {
        view.classList.add("hidden");
    });

    selectedView.classList.remove("hidden");
    setActiveNav(featureId);

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (featureId === "plannerView") {
        updatePlannerDate();
        highlightCurrentPlannerHour();
    }

    if (featureId === "goalsView") {
        renderGoals();
    }
}

function returnToDashboard() {
    featureViews.forEach(function (view) {
        view.classList.add("hidden");
    });

    dashboardView.classList.remove("hidden");
    setActiveNav(null);
    updateDashboardStatistics();

    window.scrollTo({ top: 0, behavior: "smooth" });
}

navItems.forEach(function (button) {
    button.addEventListener("click", function () {
        if (button.dataset.home === "true") {
            returnToDashboard();
        } else {
            openFeature(button.dataset.feature);
        }
    });
});

featureCards.forEach(function (button) {
    button.addEventListener("click", function () {
        openFeature(button.dataset.feature);
    });
});

backButtons.forEach(function (button) {
    button.addEventListener("click", returnToDashboard);
});




const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoMessage = document.getElementById("todoMessage");
const todoTotal = document.getElementById("todoTotal");
const todoCompleted = document.getElementById("todoCompleted");
const todoPending = document.getElementById("todoPending");
const emptyTodoMessage = document.getElementById("emptyTodoMessage");

const TODO_STORAGE_KEY = "productivityTodos";

let todos = readStorage(TODO_STORAGE_KEY, []);

if (!Array.isArray(todos)) {
    todos = [];
}

todos = todos.filter(function (todo) {
    return (
        todo &&
        typeof todo.id === "string" &&
        typeof todo.text === "string" &&
        typeof todo.completed === "boolean"
    );
});

todos.forEach(function (todo) {
    todo.important = Boolean(todo.important);
});

function saveTodos() {
    return writeStorage(TODO_STORAGE_KEY, todos);
}




todoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = todoInput.value.trim();

    if (!taskText) {
        todoMessage.textContent = "Please enter a task.";
        todoInput.focus();
        return;
    }

    const newTodo = {
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        text: taskText,
        completed: false,
        important: false
    };

    todos.push(newTodo);

    if (!saveTodos()) {
        todos.pop();
        todoMessage.textContent =
            "Unable to save your task. Check your browser storage.";
        return;
    }

    todoInput.value = "";
    todoMessage.textContent = "";
    renderTodos();
    todoInput.focus();
});



function renderTodos() {
    todoList.replaceChildren();

    todos.forEach(function (todo) {
        const item = document.createElement("li");
        item.className = "todo-item";

        if (todo.completed) {
            item.classList.add("completed");
        }

        if (todo.important) {
            item.classList.add("important");
        }

        const text = document.createElement("span");
        text.className = "todo-text";
        text.textContent = todo.text;

        const actions = document.createElement("div");
        actions.className = "todo-actions";

        const completeButton = document.createElement("button");
        completeButton.type = "button";
        completeButton.dataset.action = "complete";
        completeButton.dataset.id = todo.id;
        completeButton.textContent = todo.completed ? "Undo" : "Complete";
        completeButton.setAttribute(
            "aria-label",
            todo.completed ? "Mark task incomplete" : "Complete task"
        );

        const importantButton = document.createElement("button");
        importantButton.type = "button";
        importantButton.dataset.action = "important";
        importantButton.dataset.id = todo.id;
        importantButton.textContent = todo.important
            ? "★ Important"
            : "☆ Important";
        importantButton.setAttribute("aria-pressed", String(todo.important));

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.id = todo.id;
        deleteButton.textContent = "Delete";

        actions.append(completeButton, importantButton, deleteButton);
        item.append(text, actions);
        todoList.appendChild(item);
    });

    updateTodoSummary();

    emptyTodoMessage.classList.toggle("hidden", todos.length > 0);

    updateDashboardStatistics();
}

function updateTodoSummary() {
    const completedCount = todos.filter(function (todo) {
        return todo.completed;
    }).length;

    todoTotal.textContent = "Total: " + todos.length;
    todoCompleted.textContent = "Completed: " + completedCount;
    todoPending.textContent = "Pending: " + (todos.length - completedCount);
}




todoList.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button || !todoList.contains(button)) {
        return;
    }

    const index = todos.findIndex(function (todo) {
        return todo.id === button.dataset.id;
    });

    if (index === -1) {
        return;
    }

    const oldTodo = { ...todos[index] };
    const action = button.dataset.action;

    if (action === "complete") {
        todos[index].completed = !todos[index].completed;
    } else if (action === "important") {
        todos[index].important = !todos[index].important;
    } else if (action === "delete") {
        todos.splice(index, 1);
    } else {
        return;
    }

    if (!saveTodos()) {
        if (action === "delete") {
            todos.splice(index, 0, oldTodo);
        } else {
            todos[index] = oldTodo;
        }

        todoMessage.textContent = "Unable to save your changes.";
        renderTodos();
        return;
    }

    todoMessage.textContent = "";
    renderTodos();
});




const plannerSlots = document.getElementById("plannerSlots");
const plannerDate = document.getElementById("plannerDate");
const plannerSavedStatus = document.getElementById("plannerSavedStatus");

const PLANNER_STORAGE_KEY = "productivityPlanner";

let plannerEntries = readStorage(PLANNER_STORAGE_KEY, {});

if (
    !plannerEntries ||
    typeof plannerEntries !== "object" ||
    Array.isArray(plannerEntries)
) {
    plannerEntries = {};
}

function formatPlannerTime(hour) {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;

    return String(displayHour).padStart(2, "0") + ":00 " + period;
}

function updatePlannerDate() {
    plannerDate.textContent = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function savePlannerEntries() {
    const saved = writeStorage(PLANNER_STORAGE_KEY, plannerEntries);

    plannerSavedStatus.textContent = saved
        ? "All changes saved."
        : "Unable to save. Check your browser storage.";

    plannerSavedStatus.style.color = saved ? "#a9f5d0" : "#ffb4ca";

    return saved;
}



function renderPlannerSlots() {
    plannerSlots.replaceChildren();

    for (let hour = 0; hour < 24; hour++) {
        const timeKey = String(hour).padStart(2, "0");

        const slot = document.createElement("article");
        slot.className = "planner-slot";
        slot.dataset.hour = timeKey;

        const label = document.createElement("label");
        label.className = "planner-time";
        label.htmlFor = "planner-" + timeKey;
        label.textContent = formatPlannerTime(hour);

        const note = document.createElement("textarea");
        note.id = "planner-" + timeKey;
        note.className = "planner-note";
        note.dataset.hour = timeKey;
        note.placeholder = "Add your plan for this hour...";
        note.maxLength = 1000;
        note.rows = 2;
        note.value = typeof plannerEntries[timeKey] === "string"
            ? plannerEntries[timeKey]
            : "";

        const actions = document.createElement("div");
        actions.className = "planner-actions";

        const saveButton = document.createElement("button");
        saveButton.type = "button";
        saveButton.dataset.action = "save";
        saveButton.dataset.hour = timeKey;
        saveButton.textContent = "Save";

        const clearButton = document.createElement("button");
        clearButton.type = "button";
        clearButton.dataset.action = "clear";
        clearButton.dataset.hour = timeKey;
        clearButton.textContent = "Clear";

        actions.append(saveButton, clearButton);
        slot.append(label, note, actions);
        plannerSlots.appendChild(slot);
    }

    highlightCurrentPlannerHour();
}

function highlightCurrentPlannerHour() {
    const currentHour = String(new Date().getHours()).padStart(2, "0");

    plannerSlots.querySelectorAll(".planner-slot").forEach(function (slot) {
        slot.classList.toggle("current-hour", slot.dataset.hour === currentHour);
    });
}




function savePlannerSlot(hour, value) {
    const previousValue = plannerEntries[hour];

    if (value.trim() === "") {
        delete plannerEntries[hour];
    } else {
        plannerEntries[hour] = value;
    }

    if (!savePlannerEntries()) {
        if (previousValue === undefined) {
            delete plannerEntries[hour];
        } else {
            plannerEntries[hour] = previousValue;
        }

        return false;
    }

    return true;
}

plannerSlots.addEventListener("input", function (event) {
    if (!event.target.matches(".planner-note")) {
        return;
    }

    savePlannerSlot(event.target.dataset.hour, event.target.value);
});

plannerSlots.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const hour = button.dataset.hour;
    const action = button.dataset.action;
    const note = document.getElementById("planner-" + hour);

    if (!note) {
        return;
    }

    if (action === "save") {
        if (savePlannerSlot(hour, note.value)) {
            note.blur();
        }
    } else if (action === "clear") {
        const oldValue = note.value;
        note.value = "";

        if (!savePlannerSlot(hour, "")) {
            note.value = oldValue;
        }
    }
});

updatePlannerDate();
renderPlannerSlots();
setInterval(highlightCurrentPlannerHour, 60_000);




const goalForm = document.getElementById("goalForm");
const goalInput = document.getElementById("goalInput");
const goalList = document.getElementById("goalList");
const goalProgress = document.getElementById("goalProgress");
const goalProgressBar = document.getElementById("goalProgressBar");
const goalProgressFill = document.getElementById("goalProgressFill");
const goalProgressMessage = document.getElementById("goalProgressMessage");
const goalMessage = document.getElementById("goalMessage");
const emptyGoalMessage = document.getElementById("emptyGoalMessage");
const goalFilterButtons = document.querySelectorAll(".goal-filter");

const GOALS_STORAGE_KEY = "productivityGoals";

let goals = readStorage(GOALS_STORAGE_KEY, []);
let activeGoalFilter = "all";

if (!Array.isArray(goals)) {
    goals = [];
}

goals = goals.filter(function (goal) {
    return (
        goal &&
        typeof goal.id === "string" &&
        typeof goal.text === "string" &&
        typeof goal.completed === "boolean"
    );
});

function saveGoals() {
    return writeStorage(GOALS_STORAGE_KEY, goals);
}



goalForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = goalInput.value.trim();

    if (!text) {
        goalMessage.textContent = "Please enter a goal.";
        goalInput.focus();
        return;
    }

    const newGoal = {
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        text: text,
        completed: false
    };

    goals.push(newGoal);

    if (!saveGoals()) {
        goals.pop();
        goalMessage.textContent = "Unable to save your goal.";
        return;
    }

    goalInput.value = "";
    goalMessage.textContent = "";
    activeGoalFilter = "all";
    updateGoalFilterButtons();
    renderGoals();
    goalInput.focus();
});




goalFilterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        activeGoalFilter = button.dataset.goalFilter;
        updateGoalFilterButtons();
        renderGoals();
    });
});

function updateGoalFilterButtons() {
    goalFilterButtons.forEach(function (button) {
        const isActive = button.dataset.goalFilter === activeGoalFilter;

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}

function renderGoals() {
    goalList.replaceChildren();

    let filteredGoals = goals;

    if (activeGoalFilter === "pending") {
        filteredGoals = goals.filter(function (goal) {
            return !goal.completed;
        });
    } else if (activeGoalFilter === "completed") {
        filteredGoals = goals.filter(function (goal) {
            return goal.completed;
        });
    }

    filteredGoals.forEach(function (goal) {
        const item = document.createElement("li");
        item.className = "goal-item";

        if (goal.completed) {
            item.classList.add("completed");
        }

        const label = document.createElement("label");
        label.className = "goal-label";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = goal.completed;
        checkbox.dataset.action = "toggle";
        checkbox.dataset.id = goal.id;
        checkbox.setAttribute("aria-label", "Complete goal: " + goal.text);

        const text = document.createElement("span");
        text.className = "goal-text";
        text.textContent = goal.text;

        label.append(checkbox, text);

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.id = goal.id;
        deleteButton.setAttribute("aria-label", "Delete goal: " + goal.text);

        item.append(label, deleteButton);
        goalList.appendChild(item);
    });

    if (filteredGoals.length === 0) {
        emptyGoalMessage.classList.remove("hidden");

        if (goals.length === 0) {
            emptyGoalMessage.textContent = "No goals yet. Add your first goal above!";
        } else if (activeGoalFilter === "completed") {
            emptyGoalMessage.textContent = "No completed goals yet.";
        } else if (activeGoalFilter === "pending") {
            emptyGoalMessage.textContent = "Great! There are no pending goals.";
        }
    } else {
        emptyGoalMessage.classList.add("hidden");
    }

    updateGoalProgress();
    updateDashboardStatistics();
}



function updateGoalProgress() {
    const total = goals.length;
    const completed = goals.filter(function (goal) {
        return goal.completed;
    }).length;

    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    goalProgress.textContent = completed + " of " + total + " completed";
    goalProgressFill.style.width = percentage + "%";
    goalProgressBar.setAttribute("aria-valuenow", String(percentage));

    if (total === 0) {
        goalProgressMessage.textContent = "Start with one small goal.";
    } else if (percentage === 100) {
        goalProgressMessage.textContent = "Amazing! You completed all your goals!";
    } else {
        goalProgressMessage.textContent = percentage + "% completed. Keep going!";
    }
}

goalList.addEventListener("change", function (event) {
    const checkbox = event.target;

    if (!checkbox.matches('input[data-action="toggle"]')) {
        return;
    }

    const index = goals.findIndex(function (goal) {
        return goal.id === checkbox.dataset.id;
    });

    if (index === -1) {
        return;
    }

    const oldCompleted = goals[index].completed;
    goals[index].completed = checkbox.checked;

    if (!saveGoals()) {
        goals[index].completed = oldCompleted;
        goalMessage.textContent = "Unable to save your changes.";
    } else {
        goalMessage.textContent = "";
    }

    renderGoals();
});

goalList.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button || button.dataset.action !== "delete") {
        return;
    }

    const index = goals.findIndex(function (goal) {
        return goal.id === button.dataset.id;
    });

    if (index === -1) {
        return;
    }

    const removedGoal = goals.splice(index, 1)[0];

    if (!saveGoals()) {
        goals.splice(index, 0, removedGoal);
        goalMessage.textContent = "Unable to save your changes.";
    } else {
        goalMessage.textContent = "";
    }

    renderGoals();
});

updateGoalFilterButtons();



const pomodoroDisplay = document.getElementById("pomodoroDisplay");
const pomodoroSession = document.getElementById("pomodoroSession");
const pomodoroStatus = document.getElementById("pomodoroStatus");

const pomodoroStart = document.getElementById("pomodoroStart");
const pomodoroPause = document.getElementById("pomodoroPause");
const pomodoroReset = document.getElementById("pomodoroReset");

const pomodoroModeButtons = document.querySelectorAll(".pomodoro-mode");

const POMODORO_SESSIONS = {
    work: {
        label: "Work Session",
        duration: 25 * 60
    },
    short: {
        label: "Short Break",
        duration: 5 * 60
    },
    long: {
        label: "Long Break",
        duration: 15 * 60
    }
};

const FOCUS_STORAGE_KEY = "productivityFocusSeconds";

let focusSeconds = readStorage(FOCUS_STORAGE_KEY, 0);

if (typeof focusSeconds !== "number" || !Number.isFinite(focusSeconds)) {
    focusSeconds = 0;
}

let currentPomodoroMode = "work";
let pomodoroRemainingSeconds = POMODORO_SESSIONS.work.duration;
let pomodoroInterval = null;
let pomodoroEndTime = null;



function formatPomodoroTime(seconds) {
    const safeSeconds = Math.max(0, Math.floor(seconds));
    const minutes = Math.floor(safeSeconds / 60);
    const remainder = safeSeconds % 60;

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(remainder).padStart(2, "0")
    );
}


function updatePomodoroDisplay() {
    pomodoroDisplay.textContent =
        formatPomodoroTime(pomodoroRemainingSeconds);
}


function stopPomodoroInterval() {
    if (pomodoroInterval !== null) {
        clearInterval(pomodoroInterval);
        pomodoroInterval = null;
    }

    pomodoroEndTime = null;
}



function updatePomodoroModeButtons() {
    pomodoroModeButtons.forEach(function (button) {
        const isActive =
            button.dataset.pomodoroMode === currentPomodoroMode;

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}



function selectPomodoroMode(mode) {
    if (!POMODORO_SESSIONS[mode]) {
        return;
    }

    stopPomodoroInterval();

    currentPomodoroMode = mode;
    pomodoroRemainingSeconds = POMODORO_SESSIONS[mode].duration;

    pomodoroSession.textContent = POMODORO_SESSIONS[mode].label;
    pomodoroStatus.textContent =
        mode === "work"
            ? "Ready when you are."
            : "Take a moment to recharge.";

    updatePomodoroModeButtons();
    updatePomodoroDisplay();
}



function notifyPomodoroComplete(title, message) {
    if ("Notification" in window && Notification.permission === "granted") {
        try {
            new Notification(title, {
                body: message
            });
        } catch (error) {
            console.warn("Could not display desktop notification:", error);
            alert(title + "\n" + message);
        }
    } else {
        alert(title + "\n" + message);
    }
}



function completePomodoroSession() {
    stopPomodoroInterval();

    pomodoroRemainingSeconds = 0;
    updatePomodoroDisplay();

    if (currentPomodoroMode === "work") {
        focusSeconds += POMODORO_SESSIONS.work.duration;
        writeStorage(FOCUS_STORAGE_KEY, focusSeconds);

        pomodoroSession.textContent = "Work Session Complete";
        pomodoroStatus.textContent =
            "Great work! Choose a short or long break.";

        updateDashboardStatistics();

        notifyPomodoroComplete(
            "Pomodoro complete!",
            "Great work! Take a 5-minute short break or a 15-minute long break."
        );

    } else {
        const completedLabel = POMODORO_SESSIONS[currentPomodoroMode].label;

        pomodoroSession.textContent = completedLabel + " Complete";
        pomodoroStatus.textContent =
            "Break finished. Ready to focus again?";

        notifyPomodoroComplete(
            completedLabel + " complete!",
            "Your break is over. Choose Work to begin another focus session."
        );
    }
}



function runPomodoroCountdown() {
    if (pomodoroInterval !== null) {
        return;
    }

    if (pomodoroRemainingSeconds <= 0) {
        pomodoroStatus.textContent =
            "Choose a session or press Reset to start again.";
        return;
    }

    pomodoroEndTime =
        Date.now() + pomodoroRemainingSeconds * 1000;

    pomodoroStatus.textContent =
        currentPomodoroMode === "work"
            ? "Focus session in progress."
            : "Break in progress. Relax and recharge.";

    pomodoroInterval = setInterval(function () {
        const remaining = Math.ceil(
            (pomodoroEndTime - Date.now()) / 1000
        );

        pomodoroRemainingSeconds = Math.max(0, remaining);
        updatePomodoroDisplay();

        if (pomodoroRemainingSeconds <= 0) {
            completePomodoroSession();
        }
    }, 250);
}



pomodoroModeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        selectPomodoroMode(button.dataset.pomodoroMode);
    });
});



pomodoroStart.addEventListener("click", function () {
    runPomodoroCountdown();
});



pomodoroPause.addEventListener("click", function () {
    if (pomodoroInterval === null) {
        pomodoroStatus.textContent = "The timer is not running.";
        return;
    }

    pomodoroRemainingSeconds = Math.max(
        0,
        Math.ceil((pomodoroEndTime - Date.now()) / 1000)
    );

    stopPomodoroInterval();
    updatePomodoroDisplay();

    if (pomodoroRemainingSeconds === 0) {
        completePomodoroSession();
    } else {
        pomodoroStatus.textContent = "Timer paused.";
    }
});



pomodoroReset.addEventListener("click", function () {
    stopPomodoroInterval();

    pomodoroRemainingSeconds =
        POMODORO_SESSIONS[currentPomodoroMode].duration;

    pomodoroSession.textContent =
        POMODORO_SESSIONS[currentPomodoroMode].label;

    pomodoroStatus.textContent = "Timer reset. Ready when you are.";

    updatePomodoroDisplay();
});



updatePomodoroModeButtons();
updatePomodoroDisplay();




const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const quoteStatus = document.getElementById("quoteStatus");
const newQuoteBtn = document.getElementById("newQuoteBtn");

const QUOTE_API_URL = "https://dummyjson.com/quotes/random";

const fallbackQuotes = [
    {
        quote: "Great things are done by a series of small things brought together.",
        author: "Vincent van Gogh"
    },
    {
        quote: "It always seems impossible until it's done.",
        author: "Nelson Mandela"
    },
    {
        quote: "The secret of getting ahead is getting started.",
        author: "Mark Twain"
    },
    {
        quote: "Well done is better than well said.",
        author: "Benjamin Franklin"
    },
    {
        quote: "It does not matter how slowly you go as long as you do not stop.",
        author: "Confucius"
    },
    {
        quote: "The future depends on what you do today.",
        author: "Mahatma Gandhi"
    }
];

let quoteIsLoading = false;
let lastQuoteId = null;
let fallbackQuoteIndex = 0;

function showFallbackQuote(statusElement, textElement, authorElement) {
    let quote = fallbackQuotes[fallbackQuoteIndex % fallbackQuotes.length];

    if (fallbackQuotes.length > 1 && quote.id === lastQuoteId) {
        fallbackQuoteIndex++;
        quote = fallbackQuotes[fallbackQuoteIndex % fallbackQuotes.length];
    }

    fallbackQuoteIndex++;
    lastQuoteId = quote.id || null;

    textElement.textContent = quote.quote;
    authorElement.textContent = "— " + quote.author;

    if (statusElement) {
        statusElement.textContent =
            "Showing a saved quote while the quote service is unavailable.";
    }
}

async function fetchQuote(textElement, authorElement, statusElement, button) {
    if (quoteIsLoading) {
        return;
    }

    quoteIsLoading = true;

    if (button) {
        button.disabled = true;
        button.textContent = "Loading...";
    }

    if (statusElement) {
        statusElement.textContent = "Fetching a new quote...";
    }

    try {
        const response = await fetch(QUOTE_API_URL);

        if (!response.ok) {
            throw new Error("The quote service returned an error.");
        }

        const data = await response.json();

        if (
            typeof data.quote !== "string" ||
            typeof data.author !== "string" ||
            !data.quote.trim() ||
            !data.author.trim()
        ) {
            throw new Error("The quote response was invalid.");
        }

        textElement.textContent = data.quote;
        authorElement.textContent = "— " + data.author;
        lastQuoteId = data.id ?? null;

        if (statusElement) {
            statusElement.textContent = "";
        }
    } catch (error) {
        console.warn("Unable to fetch a quote:", error);
        showFallbackQuote(statusElement, textElement, authorElement);
    } finally {
        quoteIsLoading = false;

        if (button) {
            button.disabled = false;
            button.textContent = "↻ Get a New Quote";
        }
    }
}

newQuoteBtn.addEventListener("click", function () {
    fetchQuote(quoteText, quoteAuthor, quoteStatus, newQuoteBtn);
});




const dashboardQuoteText = document.getElementById("dashboardQuoteText");
const dashboardQuoteAuthor = document.getElementById("dashboardQuoteAuthor");
const dashboardQuoteStatus = document.getElementById("dashboardQuoteStatus");
const dashboardNewQuoteBtn = document.getElementById("dashboardNewQuoteBtn");

dashboardNewQuoteBtn.addEventListener("click", function () {
    fetchQuote(
        dashboardQuoteText,
        dashboardQuoteAuthor,
        dashboardQuoteStatus,
        dashboardNewQuoteBtn
    );
});


fetchQuote(quoteText, quoteAuthor, quoteStatus, null);
fetchQuote(dashboardQuoteText, dashboardQuoteAuthor, dashboardQuoteStatus, null);




const weatherLocation = document.getElementById("weatherLocation");
const weatherTemperature = document.getElementById("weatherTemperature");
const weatherCondition = document.getElementById("weatherCondition");
const weatherIcon = document.getElementById("weatherIcon");
const weatherHumidity = document.getElementById("weatherHumidity");
const weatherWind = document.getElementById("weatherWind");
const weatherStatus = document.getElementById("weatherStatus");
const weatherUpdated = document.getElementById("weatherUpdated");
const refreshWeatherBtn = document.getElementById("refreshWeatherBtn");
const dashboardWeatherInsight =
    document.getElementById("dashboardWeatherInsight");

const weatherSearchForm = document.getElementById("weatherSearchForm");
const weatherSearchInput = document.getElementById("weatherSearchInput");
const weatherSearchBtn = document.getElementById("weatherSearchBtn");
const weatherSearchResults =
    document.getElementById("weatherSearchResults");
const weatherSearchHint = document.getElementById("weatherSearchHint");
const useMyLocationBtn = document.getElementById("useMyLocationBtn");
const weatherBackToDetectedBtn =
    document.getElementById("weatherBackToDetectedBtn");

let weatherRequestId = 0;
let weatherBusy = false;
let detectedLocation = null;
let displayedLocation = null;
let weatherSearchBusy = false;



function getWeatherDescription(code) {
    const descriptions = {
        0: ["Clear sky", "☀️"],
        1: ["Mainly clear", "🌤️"],
        2: ["Partly cloudy", "⛅"],
        3: ["Overcast", "☁️"],
        45: ["Foggy", "🌫️"],
        48: ["Depositing rime fog", "🌫️"],
        51: ["Light drizzle", "🌦️"],
        53: ["Moderate drizzle", "🌦️"],
        55: ["Dense drizzle", "🌧️"],
        56: ["Light freezing drizzle", "🌧️"],
        57: ["Dense freezing drizzle", "🌧️"],
        61: ["Slight rain", "🌦️"],
        63: ["Moderate rain", "🌧️"],
        65: ["Heavy rain", "🌧️"],
        66: ["Light freezing rain", "🌧️"],
        67: ["Heavy freezing rain", "🌧️"],
        71: ["Slight snowfall", "🌨️"],
        73: ["Moderate snowfall", "❄️"],
        75: ["Heavy snowfall", "❄️"],
        77: ["Snow grains", "🌨️"],
        80: ["Slight rain showers", "🌦️"],
        81: ["Moderate rain showers", "🌧️"],
        82: ["Violent rain showers", "⛈️"],
        85: ["Slight snow showers", "🌨️"],
        86: ["Heavy snow showers", "❄️"],
        95: ["Thunderstorm", "⛈️"],
        96: ["Thunderstorm with slight hail", "⛈️"],
        99: ["Thunderstorm with heavy hail", "⛈️"]
    };

    return descriptions[code] || [
        "Weather conditions unavailable",
        "🌡️"
    ];
}



function updateWeatherInsight(location, description, temperature) {
    dashboardWeatherInsight.textContent =
        description[1] + " " + description[0] +
        " — " + temperature + "°C at " + location + ".";
}



function displayWeatherError(message, locationName) {
    weatherLocation.textContent = locationName || "Location unavailable";
    weatherTemperature.textContent = "--°C";
    weatherCondition.textContent = "Weather unavailable";
    weatherIcon.textContent = "🌡️";
    weatherHumidity.textContent = "--%";
    weatherWind.textContent = "-- km/h";
    weatherUpdated.textContent = "";
    weatherStatus.textContent = message;

    dashboardWeatherInsight.textContent =
        "🌤️ Weather information is temporarily unavailable.";
}



async function fetchWeather(latitude, longitude, locationName) {
    const requestId = ++weatherRequestId;

    displayedLocation = {
        latitude: latitude,
        longitude: longitude,
        name: locationName
    };

    weatherLocation.textContent = locationName;
    weatherTemperature.textContent = "--°C";
    weatherCondition.textContent = "Loading weather...";
    weatherIcon.textContent = "🌤️";
    weatherHumidity.textContent = "--%";
    weatherWind.textContent = "-- km/h";
    weatherUpdated.textContent = "";
    weatherStatus.textContent = "Loading current weather...";

    const apiUrl =
        "https://api.open-meteo.com/v1/forecast" +
        "?latitude=" + encodeURIComponent(latitude) +
        "&longitude=" + encodeURIComponent(longitude) +
        "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m" +
        "&temperature_unit=celsius" +
        "&wind_speed_unit=kmh" +
        "&timezone=auto";

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error("The weather service returned an error.");
        }

        const data = await response.json();

     
        if (requestId !== weatherRequestId) {
            return;
        }

        const current = data.current;

        if (
            !current ||
            typeof current.temperature_2m !== "number" ||
            typeof current.relative_humidity_2m !== "number" ||
            typeof current.wind_speed_10m !== "number"
        ) {
            throw new Error("The weather data is incomplete.");
        }

        const description = getWeatherDescription(current.weather_code);
        const temperature = Math.round(current.temperature_2m);

        weatherTemperature.textContent = temperature + "°C";
        weatherHumidity.textContent =
            current.relative_humidity_2m + "%";
        weatherWind.textContent =
            current.wind_speed_10m + " km/h";
        weatherCondition.textContent = description[0];
        weatherIcon.textContent = description[1];

        const updatedTime = data.current.time
            ? new Date(data.current.time)
            : new Date();

        weatherUpdated.textContent =
            "Weather time: " +
            updatedTime.toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short"
            });

        weatherStatus.textContent = "Weather updated successfully.";

        updateWeatherInsight(
            locationName,
            description,
            temperature
        );
    } catch (error) {
        if (requestId !== weatherRequestId) {
            return;
        }

        console.error("Unable to fetch weather:", error);

        displayWeatherError(
            "Unable to load weather. Check your internet connection and try again.",
            locationName
        );
    }
}



async function getLocationName(latitude, longitude) {
    try {
        const url =
            "https://api.bigdatacloud.net/data/reverse-geocode-client" +
            "?latitude=" + encodeURIComponent(latitude) +
            "&longitude=" + encodeURIComponent(longitude) +
            "&localityLanguage=en";

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Could not resolve the location name.");
        }

        const data = await response.json();

        const locality =
            data.city ||
            data.locality ||
            data.principalSubdivision ||
            data.countryName;

        const region = data.principalSubdivision;
        const country = data.countryName;

        if (!locality) {
            return "Your detected location";
        }

        const parts = [locality];

        if (region && region !== locality) {
            parts.push(region);
        }

        if (country && !parts.includes(country)) {
            parts.push(country);
        }

        return parts.join(", ");
    } catch (error) {
        console.warn("Could not get the city name:", error);
        return "Your detected location";
    }
}



function getWeatherByLocation() {
    if (!navigator.geolocation) {
        weatherStatus.textContent =
            "Location access is not supported. Search for a city instead.";
        weatherSearchHint.textContent =
            "Your browser does not support location detection. You can still search for a city.";
        return;
    }

    weatherStatus.textContent = "Requesting location permission...";
    weatherLocation.textContent = "Finding your location...";

    navigator.geolocation.getCurrentPosition(
        async function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const locationName = await getLocationName(
                latitude,
                longitude
            );

            detectedLocation = {
                latitude: latitude,
                longitude: longitude,
                name: locationName
            };

            await fetchWeather(
                latitude,
                longitude,
                locationName
            );

            weatherSearchHint.textContent =
                "Showing weather for your detected location. Search to view another city.";
        },
        function (error) {
            let message =
                "Could not access your location. Search for a city to see its weather.";

            if (error.code === error.PERMISSION_DENIED) {
                message =
                    "Location permission was denied. Allow location access in your browser settings, or search for a city.";
            } else if (error.code === error.TIMEOUT) {
                message =
                    "Location detection timed out. Try again or search for a city.";
            }

            weatherStatus.textContent = message;
            weatherLocation.textContent = "Location not detected";
            weatherSearchHint.textContent =
                "Location access is unavailable. City search still works.";
        },
        {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 300000
        }
    );
}



weatherSearchForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (weatherSearchBusy) {
        return;
    }

    const query = weatherSearchInput.value.trim();

    if (!query) {
        weatherSearchHint.textContent =
            "Enter a city or town name to search.";
        weatherSearchInput.focus();
        return;
    }

    weatherSearchBusy = true;
    weatherSearchBtn.disabled = true;
    weatherSearchBtn.textContent = "Searching...";
    weatherSearchResults.replaceChildren();
    weatherSearchResults.classList.add("hidden");
    weatherSearchHint.textContent = "Searching for locations...";

    try {
        const url =
            "https://geocoding-api.open-meteo.com/v1/search" +
            "?name=" + encodeURIComponent(query) +
            "&count=8&language=en&format=json";

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Location search failed.");
        }

        const data = await response.json();
        const results = Array.isArray(data.results)
            ? data.results
            : [];

        if (results.length === 0) {
            weatherSearchHint.textContent =
                "No matching locations found. Try another city name.";
            return;
        }

        results.forEach(function (place) {
            const item = document.createElement("li");
            const button = document.createElement("button");

            const parts = [place.name];

            if (place.admin1 && place.admin1 !== place.name) {
                parts.push(place.admin1);
            }

            if (place.country) {
                parts.push(place.country);
            }

            button.type = "button";
            button.textContent = parts.join(", ");

            button.addEventListener("click", async function () {
                const locationName = parts.join(", ");

                weatherSearchResults.classList.add("hidden");
                weatherSearchHint.textContent =
                    "Loading weather for " + locationName + "...";

                await fetchWeather(
                    place.latitude,
                    place.longitude,
                    locationName
                );

                weatherSearchHint.textContent =
                    "Showing weather for " + locationName + ".";
            });

            item.appendChild(button);
            weatherSearchResults.appendChild(item);
        });

        weatherSearchResults.classList.remove("hidden");
        weatherSearchHint.textContent =
            "Select a location from the results below.";
    } catch (error) {
        console.error("Location search error:", error);

        weatherSearchHint.textContent =
            "Unable to search right now. Check your internet connection and try again.";
    } finally {
        weatherSearchBusy = false;
        weatherSearchBtn.disabled = false;
        weatherSearchBtn.textContent = "Search";
    }
});



useMyLocationBtn.addEventListener("click", function () {
    getWeatherByLocation();
});

weatherBackToDetectedBtn.addEventListener("click", function () {
    if (detectedLocation) {
        fetchWeather(
            detectedLocation.latitude,
            detectedLocation.longitude,
            detectedLocation.name
        );

        weatherSearchHint.textContent =
            "Showing weather for your detected location.";
    } else {
        getWeatherByLocation();
    }
});



refreshWeatherBtn.addEventListener("click", async function () {
    if (weatherBusy) {
        return;
    }

    weatherBusy = true;
    refreshWeatherBtn.disabled = true;
    refreshWeatherBtn.textContent = "Refreshing...";

    try {
        if (displayedLocation) {
            await fetchWeather(
                displayedLocation.latitude,
                displayedLocation.longitude,
                displayedLocation.name
            );
        } else {
            getWeatherByLocation();
        }
    } finally {
        weatherBusy = false;
        refreshWeatherBtn.disabled = false;
        refreshWeatherBtn.textContent = "↻ Refresh Weather";
    }
});



getWeatherByLocation();




const currentDateElement = document.getElementById("currentDate");
const currentTimeElement = document.getElementById("currentTime");

function updateDateTime() {
    const now = new Date();

    currentDateElement.textContent = now.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    currentTimeElement.textContent = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });
}

updateDateTime();
setInterval(updateDateTime, 1000);




function updateDynamicBackground() {
    const hour = new Date().getHours();

    document.body.classList.remove(
        "bg-morning",
        "bg-afternoon",
        "bg-evening",
        "bg-night"
    );

    if (hour >= 5 && hour < 12) {
        document.body.classList.add("bg-morning");
    } else if (hour >= 12 && hour < 17) {
        document.body.classList.add("bg-afternoon");
    } else if (hour >= 17 && hour < 20) {
        document.body.classList.add("bg-evening");
    } else {
        document.body.classList.add("bg-night");
    }
}

updateDynamicBackground();
setInterval(updateDynamicBackground, 60_000);




const themeToggle = document.getElementById("themeToggle");
const THEME_STORAGE_KEY = "productivityTheme";

function applyTheme(theme) {
    const isDark = theme === "dark";

    document.body.classList.toggle("dark-theme", isDark);
    document.body.classList.toggle("light-theme", !isDark);

    themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    themeToggle.setAttribute("aria-pressed", String(isDark));
}

let savedTheme = "dark";

try {
    savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "dark";
} catch (error) {
    console.warn("Could not load the saved theme:", error);
}

applyTheme(savedTheme === "light" ? "light" : "dark");

themeToggle.addEventListener("click", function () {
    const isCurrentlyDark = document.body.classList.contains("dark-theme");
    const newTheme = isCurrentlyDark ? "light" : "dark";

    applyTheme(newTheme);

    try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
        console.warn("Could not save the selected theme:", error);
    }
});




const STREAK_STORAGE_KEY = "productivityStreak";
const streakValue = document.getElementById("streakValue");

function localDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return year + "-" + month + "-" + day;
}

function updateStreak() {
    const today = localDateKey(new Date());
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = localDateKey(yesterdayDate);

    let streak = readStorage(STREAK_STORAGE_KEY, {
        lastActiveDate: "",
        count: 1
    });

    if (
        !streak ||
        typeof streak !== "object" ||
        typeof streak.count !== "number"
    ) {
        streak = { lastActiveDate: "", count: 1 };
    }

    if (streak.lastActiveDate !== today) {
        if (streak.lastActiveDate === yesterday) {
            streak.count += 1;
        } else if (streak.lastActiveDate !== today) {
            streak.count = 1;
        }

        streak.lastActiveDate = today;
        writeStorage(STREAK_STORAGE_KEY, streak);
    }

    streakValue.textContent = streak.count + (
        streak.count === 1 ? " day" : " days"
    );
}

updateStreak();




function updateDashboardStatistics() {
    const completedTodos = todos.filter(function (todo) {
        return todo.completed;
    }).length;

    const completedGoals = goals.filter(function (goal) {
        return goal.completed;
    }).length;

    const totalItems = todos.length + goals.length;
    const completedItems = completedTodos + completedGoals;

    const productivity = totalItems === 0
        ? 0
        : Math.round((completedItems / totalItems) * 100);

    document.getElementById("dashboardTasksCompleted").textContent =
        String(completedTodos);

    document.getElementById("dashboardProductivity").textContent =
        productivity + "%";

    const totalMinutes = Math.floor(focusSeconds / 60);
    const focusHoursValue = Math.floor(totalMinutes / 60);
    const focusMinutesValue = totalMinutes % 60;

    document.getElementById("focusHours").textContent =
        focusHoursValue > 0
            ? focusHoursValue + "h " + focusMinutesValue + "m"
            : focusMinutesValue + "m";


    const pillarIds = [
        ["tradingPercent", "tradingProgress"],
        ["fitnessPercent", "fitnessProgress"],
        ["developmentPercent", "developmentProgress"],
        ["healthPercent", "healthProgress"],
        ["productivityPercent", "productivityProgress"]
    ];

    pillarIds.forEach(function (ids) {
        const percentageLabel = document.getElementById(ids[0]);
        const progressBar = document.getElementById(ids[1]);

        percentageLabel.textContent = productivity + "%";
        progressBar.style.width = productivity + "%";
    });
}

renderTodos();
renderGoals();
updateDashboardStatistics();
