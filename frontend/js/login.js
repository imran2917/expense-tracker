const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("message");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {

        const response = await fetch("http://127.0.0.1:8000/auth/", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.detail || "Login failed";
            return;
        }

        localStorage.setItem("access_token", data.access_token);

        message.textContent = "Login successful!";

        window.location.href = "dashboard.html";

    } catch (error) {

        console.error("Login Error:", error);

        message.textContent = "Unable to connect to server.";

    }

});