
let selectedExpenseId = null;

// Get Edit Expense Modal
const editExpenseModal = document.getElementById("editExpenseModal");
const closeEditModal = document.getElementById("closeEditModal");

// Close Edit Expense Modal
closeEditModal.addEventListener("click", function () {
    editExpenseModal.style.display = "none";
});


// Get Edit Expense Form
const editExpenseForm = document.getElementById("editExpenseForm");

// Handle Edit Form Submission
editExpenseForm.addEventListener("submit", async function (event) {

    // Stop the page from refreshing
    event.preventDefault();

    // Make sure an expense is selected
    if (selectedExpenseId === null) {
        alert("No Expense is selected for editing");
        return;
    }

    // Collect updated form data
    const title = document.getElementById("editExpenseTitle").value;
    const description = document.getElementById("editExpenseDescription").value;
    const amount = document.getElementById("editExpenseAmount").value;

    // Get login token
    const token = localStorage.getItem("access_token");

    // Send updated data to FastAPI
    try {

        const response = await fetch(
            `http://127.0.0.1:8000/expenses/${selectedExpenseId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    title: title,
                    description: description,
                    amount: Number(amount),
                    show: true
                })
            }
        );

        const result = await response.json();

        // Check response
        if (!response.ok || result.status !== "Success") {
            alert("Error: " + (result.message || "Unable to update expense"));
            return;
        }

        alert("Expense updated successfully!");

        // Reset the form
        editExpenseForm.reset();

        // Close the modal
        editExpenseModal.style.display = "none";

        // Clear selected expense ID
        selectedExpenseId = null;

        // Reload expenses
        await loadExpenses();

    }
    catch (error) {

        console.log("Error:", error);
        alert("Unable to connect to the backend.");
    }

});


// Get Add Expense Form
const addExpenseForm = document.getElementById("addExpenseForm");

// Handle Add Form Submission
addExpenseForm.addEventListener("submit", async function (event) {

    // Prevent the page from refreshing
    event.preventDefault();

    // Collect form values
    const title = document.getElementById("expenseTitle").value;
    const description = document.getElementById("expenseDescription").value;
    const amount = document.getElementById("expenseAmount").value;

    // Get login token
    const token = localStorage.getItem("access_token");

    try {

        // Send data to FastAPI
        const response = await fetch("http://127.0.0.1:8000/expenses/", {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
                title: title,
                description: description,
                amount: Number(amount),
                show: true
            })
        });

        // Check response
        if (!response.ok) {

            const errorData = await response.json();

            alert("Error: " + JSON.stringify(errorData));
            return;
        }

        // Success
        alert("Expense added successfully!");

        // Reset form
        addExpenseForm.reset();

        // Close modal
        addExpenseModal.style.display = "none";

        // Reload expenses
        await loadExpenses();

    }
    catch (error) {

        console.log("Error:", error);
        alert("Unable to connect to the backend.");
    }

});


// Get Expenses Table
const expenseTableBody = document.getElementById("expenseTableBody");

// Get Search Input
const searchExpense = document.getElementById("searchExpense");


// Search Expenses Function
function searchExpenses() {

    const searchValue = searchExpense
        ? searchExpense.value.toLowerCase().trim()
        : "";

    const startDate = document.getElementById("startDate")?.value || "";
    const endDate = document.getElementById("endDate")?.value || "";

    const rows = expenseTableBody.querySelectorAll("tr");

    rows.forEach(function (row) {

        if (row.cells.length < 2) {
            return;
        }

        const title = row.cells[0].textContent.toLowerCase();
        const description = row.cells[1].textContent.toLowerCase();

        // Search condition
        const matchesSearch =
            title.includes(searchValue) ||
            description.includes(searchValue);

        // Convert expense date to local YYYY-MM-DD
        const date = new Date(row.dataset.date);

        const expenseDate = [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0")
        ].join("-");

        // Date conditions
        const matchesStartDate =
            !startDate || expenseDate >= startDate;

        const matchesEndDate =
            !endDate || expenseDate <= endDate;

        // Apply all conditions
        const matches =
            matchesSearch &&
            matchesStartDate &&
            matchesEndDate;

        row.style.display = matches ? "" : "none";

    });
}
// Date filter event listeners
document.getElementById("startDate")?.addEventListener("change", searchExpenses);

document.getElementById("endDate")?.addEventListener("change", searchExpenses);


// Clear all filters
document.getElementById("clearFilters")?.addEventListener("click", function () {

    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";

    searchExpense.value = "";

    searchExpenses();

});

// Listen for typing in the search input
if (searchExpense) {

    searchExpense.addEventListener("input", function () {

        searchExpenses();

    });

}


// Get Dashboard Summary Elements
const totalExpensesElement = document.getElementById("totalExpenses");
const totalTransactionsElement = document.getElementById("totalTransactions");
const averageExpenseElement = document.getElementById("averageExpense");

const result = null;
// Function to Fetch and Display Expenses
async function loadExpenses() {

    // Get login token
    const token = localStorage.getItem("access_token");

    try {

        // Ask FastAPI for the user's expenses
        const response = await fetch("http://127.0.0.1:8000/expenses/", {

            method: "GET",

            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        // Check whether the request was successful
        if (!response.ok) {

            alert("Unable to fetch expenses.");
            return;
        }

        // Convert response into JavaScript data
        const result = await response.json();

        // Get expenses from the response
        const expenses = result.data.expenses;

        // sort expenses from newest to oldest
        expenses.sort((a,b) =>
            new Date(b.created_at) - new Date(a.created_at)
        )


        const displayedExpenses = totalExpensesElement
            ? expenses.slice(0,5)
            : expenses;

        // Clear existing table rows
        expenseTableBody.innerHTML = "";

        // If there are no expenses
        if (expenses.length === 0) {

            expenseTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-message">
                        No expenses found.
                    </td>
                </tr>
            `;

        }
        else {

            // Display each expense in the table
            displayedExpenses.forEach(function (expense) {

                // Create a new table row
                const row = document.createElement("tr");
                row.dataset.date = expense.created_at;
                row.dataset.amount = expense.amount;



                // Title Column
                const titleCell = document.createElement("td");
                titleCell.textContent = expense.title;


                // Description Column
                const descriptionCell = document.createElement("td");
                descriptionCell.textContent = expense.description || "-";


                // Amount Column
                const amountCell = document.createElement("td");
                amountCell.textContent =
                    "Rs. " + Number(expense.amount).toLocaleString();


                // Date Column
                const dateCell = document.createElement("td");
                dateCell.textContent =
                    new Date(expense.created_at).toLocaleDateString();


                // Last Updated Column
                const updatedAtCell = document.createElement("td");

                updatedAtCell.textContent = expense.updated_at
                    ? new Date(expense.updated_at).toLocaleDateString()
                    : new Date(expense.created_at).toLocaleDateString();


                // Action Column
                const actionCell = document.createElement("td");


                // Create Edit Button
                const editButton = document.createElement("button");

                editButton.textContent = "Edit";
                editButton.classList.add("btn-edit");
                editButton.dataset.id = expense.id;


                // Handle Edit Button Click
                editButton.addEventListener("click", function () {

                    // Remember which expense is being edited
                    selectedExpenseId = expense.id;

                    // Fill the form with existing data
                    document.getElementById("editExpenseTitle").value =
                        expense.title;

                    document.getElementById("editExpenseDescription").value =
                        expense.description || "";

                    document.getElementById("editExpenseAmount").value =
                        expense.amount;

                    // Show the Edit Expense Modal
                    editExpenseModal.style.display = "flex";

                });


                // Create Delete Button
                const deleteButton = document.createElement("button");

                deleteButton.textContent = "Delete";
                deleteButton.classList.add("btn-delete");
                deleteButton.dataset.id = expense.id;


                // Handle Delete Button Click
                deleteButton.addEventListener("click", async function () {

                    // Ask for confirmation
                    const confirmed = confirm(
                        "Are you sure you want to delete this expense?"
                    );

                    if (!confirmed) {
                        return;
                    }

                    // Get login token
                    const token = localStorage.getItem("access_token");

                    try {

                        // Send DELETE request to FastAPI
                        const response = await fetch(
                            `http://127.0.0.1:8000/expenses/${expense.id}`,
                            {
                                method: "DELETE",

                                headers: {
                                    "Authorization": `Bearer ${token}`
                                }
                            }
                        );

                        const result = await response.json();

                        // Check response
                        if (!response.ok || result.status !== "Success") {

                            alert(
                                "Error: " +
                                (result.message || "Unable to delete expense")
                            );

                            return;
                        }

                        alert("Expense deleted successfully!");

                        // Reload expenses
                        await loadExpenses();

                    }
                    catch (error) {

                        console.log("Error:", error);
                        alert("Unable to connect to the backend.");
                    }

                });


                // Add buttons inside Action Column
                actionCell.appendChild(editButton);
                actionCell.appendChild(deleteButton);


                // Add all columns inside the row
                row.appendChild(titleCell);
                row.appendChild(descriptionCell);
                row.appendChild(amountCell);
                row.appendChild(dateCell);
                row.appendChild(updatedAtCell);
                row.appendChild(actionCell);


                // Add row inside the table
                expenseTableBody.appendChild(row);

            });

        }


        // Calculate Dashboard Summary
        const total = expenses.reduce(function (sum, expense) {

            return sum + Number(expense.amount);

        }, 0);


        // Count total transactions
        const transactionCount = expenses.length;


        // Calculate average expense
        const average = transactionCount > 0
            ? total / transactionCount
            : 0;


        // Update Summary Cards
        if (totalExpensesElement) {

            totalExpensesElement.textContent =
                "Rs. " + total.toLocaleString();

        }

        if (totalTransactionsElement) {

            totalTransactionsElement.textContent = transactionCount;

        }

        if (averageExpenseElement) {

            averageExpenseElement.textContent =
                "Rs. " + average.toLocaleString();

        }


        // Apply search again after table reload
        searchExpenses();


    }
    catch (error) {

        console.log("Fetch Expenses Error:", error);

        alert("Something went wrong while fetching expenses.");

    }

}


// Load expenses when the page opens
loadExpenses();
// Date filter event listeners
document.getElementById("startDate")?.addEventListener("change", searchExpenses);

document.getElementById("endDate")?.addEventListener("change", searchExpenses);


// Clear all filters
document.getElementById("clearFilters")?.addEventListener("click", function () {

    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";

    searchExpense.value = "";

    searchExpenses();

});

// Sorting functionality

let dateAscending = false;
let amountAscending = false;

document.getElementById("sortDate")?.addEventListener("click", function () {

    dateAscending = !dateAscending;

    const rows = Array.from(expenseTableBody.querySelectorAll("tr"))
        .filter(row => row.cells.length >= 2);

    rows.sort((a, b) => {
        const dateA = new Date(a.dataset.date);
        const dateB = new Date(b.dataset.date);

        return dateAscending ? dateA - dateB : dateB - dateA;
    });

    rows.forEach(row => expenseTableBody.appendChild(row));

    this.textContent = dateAscending ? "Date ↑" : "Date ↓";
});


document.getElementById("sortAmount")?.addEventListener("click", function () {

    amountAscending = !amountAscending;

    const rows = Array.from(expenseTableBody.querySelectorAll("tr"))
        .filter(row => row.cells.length >= 2);

    rows.sort((a, b) => {
        const amountA = Number(a.dataset.amount);
        const amountB = Number(b.dataset.amount);

        return amountAscending
            ? amountA - amountB
            : amountB - amountA;
    });

    rows.forEach(row => expenseTableBody.appendChild(row));

    this.textContent = amountAscending ? "Amount ↑" : "Amount ↓";
});
// 

// document.getElementById("generateReport")?.addEventListener("click", async function (){
//     const token = localStorage.getItem("access_token");

//     if (!token) {
//         alert(" Unable to fetch expense for pdf")
//         return ;
//     }

//     try{
//         const response = await fetch("http://127.0.0.1:8000/expenses", {
//             method : "GET",
//             headers : {
//                 "Authorization" : `Bearer ${token}`
//             }

//         });
//         // if the response in success
//         if (!response.ok) {
//             alert ("Unable to fetch the  expenses for PDF")
//             return 
//         }

//         const result = await response.json();
//         const expenses = result.data?.expenses || [];

//         if (expenses.length === 0){
//             alert("No Expenses available to expoert")
//             return;
//         }

//         // make use the js pdf 
//         const { jsPDF } = window.jspdf;
//         const doc = new jsPDF();

//         // font size 
//         doc.setFontSize(16);
//         doc.text("Expense Report", 14, 18);
        
//         const tableRows = expenses.map(function (expense) {
//             return [
//                 expense.title,
//                 expense.description || "-",
//                 "Rs. "+ Number(expense.amount).toLocaleString(),
//                 new Date(expense.created_at).toLocaleString()
//             ];
//         });

//         const totalAmount = expenses.reduce(function (sum, expense){
//             return sum + Number(expense.amount);
//         }, 0);

//         doc.autoTable({
//             head: [["Title", "Description", "Amount", "Date"]],
//             body : tableRows,
//             startY: 25
//         });

//         const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 40;
//         doc.setFontSize(12);
//         doc.text("Total Expenses: Rs. " + totalAmount.toLocaleString(), 14, finalY);

//         doc.save("ExpenseReport.pdf");


//     } catch (error){
//         console.error("PDF Export Error", error);
//         alert("Unable to generate pdf")
//     }
        

// }) 