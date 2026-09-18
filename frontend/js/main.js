console.log("SkillConnect loaded successfully!");

const userData = localStorage.getItem("user");

const loginNavLink = document.getElementById("loginNavLink");
const registerNavLink = document.getElementById("registerNavLink");
const dashboardNavLink = document.getElementById("dashboardNavLink");
const profileNavLink = document.getElementById("profileNavLink");
const logoutNavLink = document.getElementById("logoutNavLink");

if (userData) {
    // User is logged in
    if (loginNavLink) {
        loginNavLink.style.display = "none";
    }

    if (registerNavLink) {
        registerNavLink.style.display = "none";
    }

    if (dashboardNavLink) {
        dashboardNavLink.style.display = "inline-block";
    }

    if (profileNavLink) {
        profileNavLink.style.display = "inline-block";
    }

    if (logoutNavLink) {
        logoutNavLink.style.display = "inline-block";

        logoutNavLink.addEventListener("click", function (event) {
            event.preventDefault();

            localStorage.removeItem("user");

            window.location.href = "index.html";
        });
    }
}