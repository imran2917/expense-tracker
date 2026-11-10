
const signupForm = document.getElementById("signup-form");

const signupName = document.getElementById("signup-name");
const signupUsername = document.getElementById("signup-username");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");

const message = document.getElementById("message");


signupForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const userData = {
        name: signupName.value.trim(),
        username: signupUsername.value.trim(),
        email: signupEmail.value.trim(),
        password: signupPassword.value
    };

    try {

        const response = await fetch("http://127.0.0.1:8000/user/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {

            message.textContent = result.message || "Signup successful!";
            message.className = "message-success";

            signupForm.reset();

        } else {

            message.textContent = result.message || result.detail || "Signup failed.";
            message.className = "message-error";

        }

    } catch (error) {

        message.textContent = "Unable to connect to the server.";
        message.className = "message-error";

        console.error("Signup Error:", error);

    }

});
