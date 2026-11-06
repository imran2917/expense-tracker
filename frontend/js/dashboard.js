const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function () {
    // LocalStorage clear karein
    localStorage.clear();
    
    // Login page par wapas bhej dein
    window.location.href = "index.html";
});