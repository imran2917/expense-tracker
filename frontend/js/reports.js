

// Print the Data into PDF file
document.getElementById("generateReport")?.addEventListener("click", async function () {
    const token = localStorage.getItem("access_token");

    if (!token) {
        alert("Please log in first.");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/expenses/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
 
        if (!response.ok) {
            alert("Unable to fetch expenses for PDF.");
            return;
        }

        const result = await response.json();
        const expenses = result.data?.expenses || [];

        if (expenses.length === 0) {
            alert("No expenses available to export.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Expense Report", 14, 18);

        const tableRows = expenses.map(function (expense) {
            return [
                expense.title,
                expense.description || "-",
                "Rs. " + Number(expense.amount).toLocaleString(),
                new Date(expense.created_at).toLocaleDateString()
            ];
        });

        const totalAmount = expenses.reduce(function (sum, expense) {
            return sum + Number(expense.amount);
        }, 0);

        doc.autoTable({
            head: [["Title", "Description", "Amount", "Date"]],
            body: tableRows,
            startY: 25
        });

        const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 40;
        doc.setFontSize(12);
        doc.text("Total Expenses: Rs. " + totalAmount.toLocaleString(), 14, finalY);

        doc.save("expenses-report.pdf");
    } catch (error) {
        console.error("PDF Export Error:", error);
        alert("Unable to generate PDF.");
    }
});

console.log("Expenses.js file is here !!");