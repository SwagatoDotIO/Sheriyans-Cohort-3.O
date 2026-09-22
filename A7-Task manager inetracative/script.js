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


let taskId = 1;




addTaskBtn.addEventListener("click", function () {

    const title = taskTitle.value;
    const category = taskCategory.value;


    

    if (title.trim() === "") {
        alert("Please enter a task");
        return;
    }


   

    const card = document.createElement("div");

    card.classList.add("task-card");


   

    card.setAttribute("data-id", taskId);
    card.setAttribute("data-status", "pending");
    card.setAttribute("data-category", category);


   
    const heading = document.createElement("h3");

    const headingText = document.createTextNode(title);

    heading.appendChild(headingText);


    
    const categoryText = document.createElement("p");

    categoryText.textContent = `Category: ${category}`;


   

    const buttonContainer = document.createElement("div");

    buttonContainer.classList.add("task-actions");


    
    const editBtn = document.createElement("button");

    editBtn.classList.add("edit-btn");

    editBtn.textContent = "Edit";


    

    const completeBtn = document.createElement("button");

    completeBtn.classList.add("complete-btn");

    completeBtn.textContent = "Complete";


    

    const deleteBtn = document.createElement("button");

    deleteBtn.classList.add("delete-btn");

    deleteBtn.textContent = "Delete";


    

    buttonContainer.append(
        editBtn,
        completeBtn,
        deleteBtn
    );


    

    card.append(
        heading,
        categoryText,
        buttonContainer
    );


   

    console.log("ID:", card.dataset.id);
    console.log("Status:", card.dataset.status);
    console.log("Category:", card.dataset.category);


   

    taskContainer.prepend(card);


  

    taskTitle.value = "";

    taskId++;




    updateCounters();
});




taskContainer.addEventListener("click", function (event) {

    // Find the task card containing
    // the clicked button

    const card = event.target.closest(".task-card");



    if (!card) {
        return;
    }




    if (event.target.classList.contains("complete-btn")) {

        card.dataset.status = "completed";

        card.classList.add("completed");

        console.log(
            "Task status:",
            card.dataset.status
        );

        updateCounters();
    }


  

    if (event.target.classList.contains("delete-btn")) {

        card.remove();

        updateCounters();
    }


    

    if (event.target.classList.contains("edit-btn")) {

        const oldHeading = card.querySelector("h3");


        

        const editInput = document.createElement("input");

        editInput.type = "text";

        editInput.value = oldHeading.textContent;


        

        oldHeading.replaceWith(editInput);


        

        const saveBtn = document.createElement("button");

        saveBtn.textContent = "Save";

        saveBtn.classList.add("save-btn");


        

        editInput.after(saveBtn);


        

        saveBtn.addEventListener("click", function () {

            const newHeading = document.createElement("h3");

            newHeading.textContent = editInput.value;


            

            editInput.replaceWith(newHeading);


            

            saveBtn.remove();


            

            filterTasks();
        });
    }
});




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


        

        const matchesSearch =
            title.includes(searchValue);


        

        const matchesCategory =
            selectedCategory === "all" ||
            cardCategory === selectedCategory;


        e

        if (matchesSearch && matchesCategory) {

            card.style.display = "block";

        } else {

            card.style.display = "none";
        }
    });
}



searchInput.addEventListener("input", function () {

    filterTasks();
});




categoryFilter.addEventListener("change", function () {

    filterTasks();
});




clearAllBtn.addEventListener("click", function () {

    taskContainer.replaceChildren();

    updateCounters();
});




console.log("Input property value:");

console.log(demoInput.value);


console.log("Input attribute value:");

console.log(
    demoInput.getAttribute("value")
);




themeBtn.addEventListener("click", function () {


    

    const currentTheme =
        document.body.dataset.theme;


    

    if (currentTheme === "light") {


       

        document.body.dataset.theme = "dark";


        

        document.body.setAttribute(
            "data-theme",
            "dark"
        );


        
        document.body.classList.add("dark");



        themeBtn.textContent = "Light Mode";
    }


    

    else {


       

        document.body.dataset.theme = "light";


        

        document.body.setAttribute(
            "data-theme",
            "light"
        );


        

        document.body.classList.remove("dark");


        

        themeBtn.textContent = "Dark Mode";
    }
});




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