
// Get HTML elements
(function () {

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

const formTitle = document.getElementById("form-title");
const formDescription = document.getElementById("form-description");

const switchButton = document.getElementById("switch-button");
const switchDescription = document.getElementById("switch-description");


// Switch between Login and Signup

switchButton.addEventListener("click", function () {

    if (loginForm.classList.contains("hidden")) {

        // Show Login Form

        loginForm.classList.remove("hidden");
        signupForm.classList.add("hidden");

        formTitle.textContent = "Welcome Back";
        formDescription.textContent = "Please enter your details to login.";

        switchDescription.textContent = "Don't have an account?";
        switchButton.textContent = "Sign Up";

    } else {

        // Show Signup Form

        loginForm.classList.add("hidden");
        signupForm.classList.remove("hidden");

        formTitle.textContent = "Create Account";
        formDescription.textContent = "Enter your details to create an account.";

        switchDescription.textContent = "Already have an account?";
        switchButton.textContent = "Login";

    }

});


})();