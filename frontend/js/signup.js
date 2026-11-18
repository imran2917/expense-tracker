
const signupForm = document.getElementById("signup-form");

const signupName = document.getElementById("signup-name");
const signupUsername = document.getElementById("signup-username");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const signupConfirmPassword = document.getElementById("signup-confirm-password");

const message = document.getElementById("message");
function validatePassword(password){
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return(
        minLength &&
        hasUppercase &&
        hasLowercase &&
        hasNumber &&
        hasSpecialChar
    )
}


signupForm.addEventListener("submit", async function (event) {

    event.preventDefault();
    if (!validatePassword(signupPassword.value)){
        message.textContent = "Password does not meet the required criteria.";
        message.className = "message-error";
        return;
    }
    // Check weither password and confirm password match
    if (signupPassword.value !== signupConfirmPassword.value){
        message.textContent = "Password and Confirm Password do not match.";
        message.className = "message-error";
        return;
    }

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
            alert("Signup successful! Please log in.");
            signupForm.reset();
            document.getElementById("login-form").classList.remove("hidden");
            document.getElementById("signup-form").classList.add("hidden");

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
