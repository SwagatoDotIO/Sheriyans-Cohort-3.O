// ==========================================
// SELECT HTML ELEMENTS
// ==========================================

const taskTitle = document.querySelector("#taskTitle");
const taskCategory = document.querySelector("#taskCategory");
const addTaskBtn = document.querySelector("#addTaskBtn");
const taskContainer = document.querySelector("#taskContainer");

const themeBtn = document.querySelector("#themeBtn");
const demoInput = document.querySelector("#demoInput");


// ==========================================
// PHASE 27 - BONUS ELEMENTS
// ==========================================

const searchInput = document.querySelector("#searchInput");
const categoryFilter = document.querySelector("#categoryFilter");
const clearAllBtn = document.querySelector("#clearAllBtn");

const totalCount = document.querySelector("#totalCount");
const completedCount = document.querySelector("#completedCount");
const pendingCount = document.querySelector("#pendingCount");


// ==========================================
// TASK ID
// ==========================================

let taskId = 1;


// ==========================================
// ADD TASK
// ==========================================

addTaskBtn.addEventListener("click", function () {

    const title = taskTitle.value;
    const category = taskCategory.value;


    // ======================================
    // DON'T CREATE EMPTY TASK
    // ======================================

    if (title.trim() === "") {
        alert("Please enter a task");
        return;
    }


    // ======================================
    // CREATE TASK CARD
    // ======================================

    const card = document.createElement("div");

    card.classList.add("task-card");


    // ======================================
    // ADD DATA ATTRIBUTES
    // ======================================

    card.setAttribute("data-id", taskId);
    card.setAttribute("data-status", "pending");
    card.setAttribute("data-category", category);


    // ======================================
    // CREATE TITLE
    // ======================================

    const heading = document.createElement("h3");

    const headingText = document.createTextNode(title);

    heading.appendChild(headingText);


    // ======================================
    // CREATE CATEGORY
    // ======================================

    const categoryText = document.createElement("p");

    categoryText.textContent = `Category: ${category}`;


    // ======================================
    // CREATE BUTTON CONTAINER
    // ======================================

    const buttonContainer = document.createElement("div");

    buttonContainer.classList.add("task-actions");


    // ======================================
    // CREATE EDIT BUTTON
    // ======================================

    const editBtn = document.createElement("button");

    editBtn.classList.add("edit-btn");

    editBtn.textContent = "Edit";


    // ======================================
    // CREATE COMPLETE BUTTON
    // ======================================

    const completeBtn = document.createElement("button");

    completeBtn.classList.add("complete-btn");

    completeBtn.textContent = "Complete";


    // ======================================
    // CREATE DELETE BUTTON
    // ======================================

    const deleteBtn = document.createElement("button");

    deleteBtn.classList.add("delete-btn");

    deleteBtn.textContent = "Delete";


    // ======================================
    // PUT BUTTONS INSIDE BUTTON CONTAINER
    // ======================================

    buttonContainer.append(
        editBtn,
        completeBtn,
        deleteBtn
    );


    // ======================================
    // PUT EVERYTHING INSIDE CARD
    // ======================================

    card.append(
        heading,
        categoryText,
        buttonContainer
    );


    // ======================================
    // DATASET DEMONSTRATION
    // ======================================

    console.log("ID:", card.dataset.id);
    console.log("Status:", card.dataset.status);
    console.log("Category:", card.dataset.category);


    // ======================================
    // ADD CARD TO CONTAINER
    // ======================================

    taskContainer.prepend(card);


    // ======================================
    // CLEAR INPUT
    // ======================================

    taskTitle.value = "";

    taskId++;


    // ======================================
    // UPDATE COUNTERS
    // ======================================

    updateCounters();
});


// ==========================================
// EVENT DELEGATION
// ==========================================

taskContainer.addEventListener("click", function (event) {

    // Find the task card containing
    // the clicked button

    const card = event.target.closest(".task-card");


    // If the click wasn't inside a task card

    if (!card) {
        return;
    }


    // ======================================
    // COMPLETE TASK
    // ======================================

    if (event.target.classList.contains("complete-btn")) {

        card.dataset.status = "completed";

        card.classList.add("completed");

        console.log(
            "Task status:",
            card.dataset.status
        );

        updateCounters();
    }


    // ======================================
    // DELETE TASK
    // ======================================

    if (event.target.classList.contains("delete-btn")) {

        card.remove();

        updateCounters();
    }


    // ======================================
    // EDIT TASK
    // ======================================

    if (event.target.classList.contains("edit-btn")) {

        const oldHeading = card.querySelector("h3");


        // Create input

        const editInput = document.createElement("input");

        editInput.type = "text";

        editInput.value = oldHeading.textContent;


        // ==================================
        // REPLACE OLD HEADING
        // ==================================

        oldHeading.replaceWith(editInput);


        // ==================================
        // CREATE SAVE BUTTON
        // ==================================

        const saveBtn = document.createElement("button");

        saveBtn.textContent = "Save";

        saveBtn.classList.add("save-btn");


        // ==================================
        // INSERT SAVE BUTTON AFTER INPUT
        // ==================================

        editInput.after(saveBtn);


        // ==================================
        // SAVE EDIT
        // ==================================

        saveBtn.addEventListener("click", function () {

            const newHeading = document.createElement("h3");

            newHeading.textContent = editInput.value;


            // Replace input with new heading

            editInput.replaceWith(newHeading);


            // Remove save button

            saveBtn.remove();


            // Re-apply filters

            filterTasks();
        });
    }
});


// ==========================================
// UPDATE COUNTERS
// ==========================================

function updateCounters() {

    const cards = document.querySelectorAll(".task-card");

    let completed = 0;
    let pending = 0;


    cards.forEach(function (card) {

        if (card.dataset.status === "completed") {

            completed++;

        } else {

            pending++;
        }
    });


    totalCount.textContent = cards.length;

    completedCount.textContent = completed;

    pendingCount.textContent = pending;
}


// ==========================================
// SEARCH + CATEGORY FILTER
// ==========================================

function filterTasks() {

    const searchValue =
        searchInput.value.toLowerCase();

    const selectedCategory =
        categoryFilter.value;


    const cards =
        document.querySelectorAll(".task-card");


    cards.forEach(function (card) {

        const title =
            card.querySelector("h3")
                .textContent
                .toLowerCase();


        const cardCategory =
            card.dataset.category;


        // Search condition

        const matchesSearch =
            title.includes(searchValue);


        // Category condition

        const matchesCategory =
            selectedCategory === "all" ||
            cardCategory === selectedCategory;


        // Both conditions must be true

        if (matchesSearch && matchesCategory) {

            card.style.display = "block";

        } else {

            card.style.display = "none";
        }
    });
}


// ==========================================
// SEARCH TASKS
// ==========================================

searchInput.addEventListener("input", function () {

    filterTasks();
});


// ==========================================
// CATEGORY FILTER
// ==========================================

categoryFilter.addEventListener("change", function () {

    filterTasks();
});


// ==========================================
// CLEAR ALL TASKS
// ==========================================

clearAllBtn.addEventListener("click", function () {

    taskContainer.replaceChildren();

    updateCounters();
});


// ==========================================
// ATTRIBUTES VS PROPERTIES
// ==========================================

console.log("Input property value:");

console.log(demoInput.value);


console.log("Input attribute value:");

console.log(
    demoInput.getAttribute("value")
);


// ==========================================
// THEME TOGGLE
// ==========================================

themeBtn.addEventListener("click", function () {


    // Get current theme using dataset

    const currentTheme =
        document.body.dataset.theme;


    // ======================================
    // LIGHT → DARK
    // ======================================

    if (currentTheme === "light") {


        // Change dataset

        document.body.dataset.theme = "dark";


        // Change data-theme attribute

        document.body.setAttribute(
            "data-theme",
            "dark"
        );


        // Add dark class

        document.body.classList.add("dark");


        // Change button text

        themeBtn.textContent = "Light Mode";
    }


    // ======================================
    // DARK → LIGHT
    // ======================================

    else {


        // Change dataset

        document.body.dataset.theme = "light";


        // Change data-theme attribute

        document.body.setAttribute(
            "data-theme",
            "light"
        );


        // Remove dark class

        document.body.classList.remove("dark");


        // Change button text

        themeBtn.textContent = "Dark Mode";
    }
});


// ==========================================
// PHASE 24 - EVENT PROPAGATION
// ==========================================

const grandparent =
    document.querySelector("#grandparent");

const parent =
    document.querySelector("#parent");

const bubbleBtn =
    document.querySelector("#bubbleBtn");

const captureBtn =
    document.querySelector("#captureBtn");

const bubblingResult =
    document.querySelector("#bubblingResult");

const capturingResult =
    document.querySelector("#capturingResult");


// ==========================================
// BUBBLING
// ==========================================

let bubblingOrder = [];


bubbleBtn.addEventListener("click", function () {

    bubblingOrder = [];

    bubblingOrder.push("Child");
});


parent.addEventListener("click", function (event) {

    if (event.target === bubbleBtn) {

        bubblingOrder.push("Parent");
    }
});


grandparent.addEventListener("click", function (event) {

    if (event.target === bubbleBtn) {

        bubblingOrder.push("Grandparent");

        bubblingResult.textContent =
            bubblingOrder.join(" → ");
    }
});


// ==========================================
// CAPTURING
// ==========================================

let capturingOrder = [];


grandparent.addEventListener("click", function (event) {

    if (event.target === captureBtn) {

        capturingOrder = [];

        capturingOrder.push("Grandparent");
    }

}, true);


parent.addEventListener("click", function (event) {

    if (event.target === captureBtn) {

        capturingOrder.push("Parent");
    }

}, true);


captureBtn.addEventListener("click", function () {

    capturingOrder.push("Child");

    capturingResult.textContent =
        capturingOrder.join(" → ");

}, true);