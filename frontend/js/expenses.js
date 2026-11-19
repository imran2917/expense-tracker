
console.log("Expenses JavaScript is loaded!");

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

    // If the search input does not exist on this page, stop
    if (!searchExpense) {
        return;
    }

    // Get the text entered by the user
    const searchValue = searchExpense.value.toLowerCase().trim();

    // Get all current expense rows
    const rows = expenseTableBody.querySelectorAll("tr");

    // Check every row
    rows.forEach(function (row) {

        // Skip the empty-state row
        if (row.cells.length < 2) {
            return;
        }

        // Get title and description
        const title = row.cells[0].textContent.toLowerCase();
        const description = row.cells[1].textContent.toLowerCase();

        // Check whether title or description matches
        const matches =
            title.includes(searchValue) ||
            description.includes(searchValue);

        // Show or hide the row
        row.style.display = matches ? "" : "none";

    });

}


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
            expenses.forEach(function (expense) {

                // Create a new table row
                const row = document.createElement("tr");


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
