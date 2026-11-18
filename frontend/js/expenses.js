
console.log("Expenses JavaScript is loaded!");
let selectedExpenseId = null;
const editExpenseModal = document.getElementById("editExpenseModal");
const closeEditModal = document.getElementById("closeEditModal");

closeEditModal.addEventListener("click", function(){
    editExpenseModal.style.display  = "none";
})

// get the edit expense form data 
const editExpenseForm = document.getElementById("editExpenseForm");

// Handle From Submissin
editExpenseForm.addEventListener("submit", async function(event){
    //stop the page from the refreshing
    event.preventDefault();

    // make sure expense is selected
    if(selectedExpenseId === null){
        alert("No Expense is  selected for editing");
        return;
    }

    // collect updated form data
    const title = document.getElementById("editExpenseTitle").value;
    const description = document.getElementById("editExpenseDescription").value;
    const amount = document.getElementById("editExpenseAmount").value;

    // get loging token
    const token = localStorage.getItem("access_token");

    // send update data to fastAPI bakcend router
    try{
        const response = await fetch(
            `http://127.0.0.1:8000/expenses/${selectedExpenseId}`,
            {
                method : "PUT",
                headers : {
                    "Content-Type" : "application/json",
                    "Authorization" : `Bearer ${token}`
                },

                body : JSON.stringify({
                    title : title,
                    description : description,
                    amount : Number(amount),
                    show : true
                })
            }
            
        );
        const result = await response.json();
        // check response 

        if(!response.ok || result.status !== "Success"){
            alert("Error: " + (result.message || "Unable to update expense" ));
            return;
        }
           alert("Expense updated successfully!");
        // reset the form 
        editExpenseForm.reset();
        // close the modal
        editExpenseModal.style.display = "none";
        // reload the expense
        await loadExpenses();
        selectedExpenseId = null;
    }
    catch(error){
        console.log("Error:", error);
        alert("Unable to connect to the backend.");
    }
 
});


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
        await loadExpenses();

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
                    <td colspan="6" class="empty-message">
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

            const updatedAtCell = document.createElement("td");
            updatedAtCell.textContent = expense.updated_at
                ? new Date(expense.updated_at).toLocaleDateString()
                : new Date(expense.created_at).toLocaleDateString();

            // const actionCell = document.createElement("td");
            // actionCell.textContent = "Actions coming soon";
            const actionCell = document.createElement("td");

            // create edit button
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.classList.add("btn-edit");
            editButton.dataset.id = expense.id;

            // handle edit button click

            editButton.addEventListener("click", function() {
                // remember which expeense is being edited
                selectedExpenseId = expense.id;
                // fill te form with the existing data
                document.getElementById("editExpenseTitle").value = expense.title;
                document.getElementById("editExpenseDescription").value = expense.description;
                document.getElementById("editExpenseAmount").value = expense.amount;

                // show the expense modal
                document.getElementById("editExpenseModal").style.display = "flex";

            });

            // create deleate button 

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("btn-delete");
            deleteButton.dataset.id = expense.id;
            // add the event listener for delete button

            deleteButton.addEventListener("click", async function(){
                const confirmed = confirm("Are you sure you want to delete this expense?");
                if(!confirmed){
                    return;
                }
                const token = localStorage.getItem("access_token");
                try{
                    const response = await fetch(
                        `http://localhost:8000/expenses/${expense.id}`,
                        {
                            method : "DELETE",
                            headers : {
                                "Authorization" : `Bearer ${token}`
                            }
                        }
                    );
                    const result = await response.json();
                    if(!response.ok || result.status !== "Success"){
                        alert("Error" + (result.message || "Unable to delete expense"));
                        return;
                    }
                    alert("Expense deleted successfully!");
                    await loadExpenses();
                }
                catch (error){
                    console.log("Error:", error);
                    alert("Unable to connect to the backend.");
                }
            });

            // add button inside action cell
            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);


            row.appendChild(titleCell);
            row.appendChild(descriptionCell);
            row.appendChild(amountCell);
            row.appendChild(dateCell);
            row.appendChild(updatedAtCell);
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
