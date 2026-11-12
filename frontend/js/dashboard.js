
console.log("Dashboard JavaScript is loaded!");
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function () {
    // LocalStorage clear karein
    localStorage.clear();
    
    // Login page par wapas bhej dein
    window.location.href = "index.html";
});



// Add Expense Modal Elements
const addExpenseBtn = document.getElementById("addExpenseBtn");
const addExpenseModal = document.getElementById("addExpenseModal");
const closeAddModal = document.getElementById("closeAddModal");


// Open Add Expense Modal
addExpenseBtn.addEventListener("click", function () {
    addExpenseModal.style.display = "flex";
});

// Close Add Expense Modal
closeAddModal.addEventListener("click", function () {
    addExpenseModal.style.display = "none";
});

