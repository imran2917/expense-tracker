
console.log("Expenses JavaScript is loaded!");

// Get the Add Expense Form
const addExpenseForm = document.getElementById("addExpenseForm");

// // Get the Add Expense Modal
// const addExpenseModal = document.getElementById("addExpenseModal");

// Handle Form Submission
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

    } catch (error) {

        console.log("Error:", error);
        alert("Unable to connect to the backend.");
    }

});


// Get dashboard elements
const expenseTableBody = document.getElementById("expenseTableBody");
const totalExpensesElement = document.getElementById("totalExpenses");
const totalTransactionsElement = document.getElementById("totalTransactions");
const averageExpenseElement = document.getElementById("averageExpense");

// Function to fetch and display expenses
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

        // Get the expenses from the response
        const expenses = result.data.expenses;

        // Clear the existing table rows
        expenseTableBody.innerHTML = "";

        // If there are no expenses
        if (expenses.length === 0) {
            expenseTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-message">
                        No expenses found.
                    </td>
                </tr>
            `;
        }

        // Display each expense in the table
        expenses.forEach(function (expense) {

            const row = document.createElement("tr");

            const titleCell = document.createElement("td");
            titleCell.textContent = expense.title;

            const descriptionCell = document.createElement("td");
            descriptionCell.textContent = expense.description || "-";

            const amountCell = document.createElement("td");
            amountCell.textContent = "Rs. " + Number(expense.amount).toLocaleString();

            const dateCell = document.createElement("td");
            dateCell.textContent = new Date(expense.created_at).toLocaleDateString();

            const actionCell = document.createElement("td");
            actionCell.textContent = "Actions coming soon";

            row.appendChild(titleCell);
            row.appendChild(descriptionCell);
            row.appendChild(amountCell);
            row.appendChild(dateCell);
            row.appendChild(actionCell);

            expenseTableBody.appendChild(row);
        });

        // Calculate dashboard summary
        const total = expenses.reduce(function (sum, expense) {
            return sum + Number(expense.amount);
        }, 0);

        const transactionCount = expenses.length;

        const average = transactionCount > 0
            ? total / transactionCount
            : 0;

        // Update summary cards
        totalExpensesElement.textContent = "Rs. " + total.toLocaleString();
        totalTransactionsElement.textContent = transactionCount;
        averageExpenseElement.textContent = "Rs. " + average.toLocaleString();

    } catch (error) {

        console.log("Fetch Expenses Error:", error);
        alert("Something went wrong while fetching expenses.");
    }
}

// Load expenses when the dashboard opens
loadExpenses();
