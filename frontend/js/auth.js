document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const messageEl = document.getElementById("message");

        try {
            messageEl.style.color = "#007bff";
            messageEl.innerText = "Authenticating...";

            // Clean & Professional call using ApiClient
            const response = await api.post("/user/login", { email, password });

            messageEl.style.color = "#28a745";
            messageEl.innerText = response.message || "Login Successful!";

            // Save user profile data temporarily if returned
            if (response.data && response.data.user) {
                localStorage.setItem("user", JSON.stringify(response.data.user));
            }

            // Redirect smoothly to dashboard
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 700);

        } catch (error) {
            messageEl.style.color = "#dc3545";
            messageEl.innerText = error.message;
        }
    });
});