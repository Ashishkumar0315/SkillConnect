// =====================================================
// SKILLCONNECT DASHBOARD
// =====================================================


// Get logged-in user
const userData = localStorage.getItem("user");


// =====================================================
// LOGIN CHECK
// =====================================================

if (!userData) {

    window.location.href = "login.html";

} else {

    const user = JSON.parse(userData);


    // =================================================
    // BASIC USER INFORMATION
    // =================================================

    const userName = document.getElementById("userName");
    const userNameCard = document.getElementById("userNameCard");
    const userEmail = document.getElementById("userEmail");
    const userRole = document.getElementById("userRole");


    if (userName) {
        userName.textContent = user.name || "User";
    }

    if (userNameCard) {
        userNameCard.textContent = user.name || "—";
    }

    if (userEmail) {
        userEmail.textContent = user.email || "—";
    }

    if (userRole) {
        userRole.textContent = user.role || "Student";
    }


    // =================================================
    // TOP USER
    // =================================================

    const topUserName =
        document.getElementById("topUserName");

    const topUserInitials =
        document.getElementById("topUserInitials");


    if (topUserName) {

        topUserName.textContent =
            user.name || "User";

    }


    if (topUserInitials) {

        const name =
            user.name || "SC";

        const initials =
            name
                .split(" ")
                .map(word => word.charAt(0))
                .join("")
                .substring(0, 2)
                .toUpperCase();

        topUserInitials.textContent =
            initials || "SC";
    }


    // =================================================
    // LOAD DASHBOARD DATA
    // =================================================

    loadDashboardData(user.id);

}


// =====================================================
// LOAD DASHBOARD DATA
// =====================================================

async function loadDashboardData(userId) {

    try {

        // ---------------------------------------------
        // Load profile
        // ---------------------------------------------

        const profileResponse =
            await fetch(
                `http://localhost:5000/api/profile/${userId}`
            );


        let profile = null;


        if (profileResponse.ok) {

            profile =
                await profileResponse.json();

        }


        // ---------------------------------------------
        // Load skills
        // ---------------------------------------------

        const skillsResponse =
            await fetch(
                `http://localhost:5000/api/skills/${userId}`
            );


        let skills = [];


        if (skillsResponse.ok) {

            skills =
                await skillsResponse.json();

        }


        // ---------------------------------------------
        // Load projects
        // ---------------------------------------------

        const projectsResponse =
            await fetch(
                `http://localhost:5000/api/projects/${userId}`
            );


        let projects = [];


        if (projectsResponse.ok) {

            projects =
                await projectsResponse.json();

        }


        // ---------------------------------------------
        // Update statistics
        // ---------------------------------------------

        updateStatistics(
            profile,
            skills,
            projects
        );


        // ---------------------------------------------
        // Display projects
        // ---------------------------------------------

        displayDashboardProjects(projects);


    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}


// =====================================================
// UPDATE STATISTICS
// =====================================================

function updateStatistics(
    profile,
    skills,
    projects
) {

    const projectCount =
        document.getElementById("projectCount");

    const skillCount =
        document.getElementById("skillCount");


    if (projectCount) {

        animateNumber(
            projectCount,
            projects.length
        );

    }


    if (skillCount) {

        animateNumber(
            skillCount,
            skills.length
        );

    }


    // ---------------------------------------------
    // Calculate profile completion
    // ---------------------------------------------

    const completion =
        calculateProfileCompletion(profile);


    const profileProgress =
        document.getElementById("profileProgress");

    const profileProgressText =
        document.getElementById("profileProgressText");

    const profileProgressBadge =
        document.getElementById("profileProgressBadge");

    const profileProgressBar =
        document.getElementById("profileProgressBar");


    if (profileProgress) {

        animatePercentage(
            profileProgress,
            completion
        );

    }


    if (profileProgressText) {

        animatePercentage(
            profileProgressText,
            completion
        );

    }


    if (profileProgressBadge) {

        animatePercentage(
            profileProgressBadge,
            completion
        );

    }


    if (profileProgressBar) {

        setTimeout(function() {

            profileProgressBar.style.width =
                completion + "%";

        }, 200);

    }

}


// =====================================================
// PROFILE COMPLETION
// =====================================================

function calculateProfileCompletion(profile) {

    if (!profile) {

        return 0;

    }


    const fields = [
        profile.headline,
        profile.location,
        profile.bio,
        profile.education,
        profile.github_url,
        profile.linkedin_url
    ];


    const completedFields =
        fields.filter(
            field =>
                field &&
                String(field).trim() !== ""
        ).length;


    return Math.round(
        (completedFields / fields.length) * 100
    );

}


// =====================================================
// DISPLAY PROJECTS
// =====================================================

function displayDashboardProjects(projects) {

    const container =
        document.getElementById(
            "dashboardProjects"
        );


    if (!container) {

        return;

    }


    // ---------------------------------------------
    // No projects
    // ---------------------------------------------

    if (!projects || projects.length === 0) {

        container.innerHTML = `

            <div class="dashboard-empty-state">

                <div>
                    ◈
                </div>

                <h3>
                    Build your portfolio
                </h3>

                <p>
                    Add your first project to
                    showcase your skills.
                </p>

                <a href="profile.html">
                    Add Project →
                </a>

            </div>

        `;

        return;

    }


    // ---------------------------------------------
    // Show projects
    // ---------------------------------------------

    container.innerHTML =
        projects
            .slice(0, 3)
            .map(function(project) {

                const technologies =
                    project.technologies ||
                    "Project";

                return `

                    <a
                        href="profile.html#projectsSection"
                        class="dashboard-project-card"
                    >

                        <div class="dashboard-project-icon">
                            ◈
                        </div>

                        <div class="dashboard-project-content">

                            <h3>
                                ${escapeHtml(
                                    project.title ||
                                    "Untitled Project"
                                )}
                            </h3>

                            <p>
                                ${escapeHtml(
                                    technologies
                                )}
                            </p>

                        </div>

                        <span class="dashboard-project-arrow">
                            →
                        </span>

                    </a>

                `;

            })
            .join("");

}


// =====================================================
// NUMBER ANIMATION
// =====================================================

function animateNumber(
    element,
    target
) {

    const finalValue =
        Number(target) || 0;

    const duration =
        900;

    const startTime =
        performance.now();


    function update(currentTime) {

        const elapsed =
            currentTime - startTime;

        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        // Ease out
        const eased =
            1 - Math.pow(
                1 - progress,
                3
            );


        const currentValue =
            Math.round(
                finalValue * eased
            );


        element.textContent =
            currentValue;


        if (progress < 1) {

            requestAnimationFrame(update);

        }

    }


    requestAnimationFrame(update);

}


// =====================================================
// PERCENTAGE ANIMATION
// =====================================================

function animatePercentage(
    element,
    target
) {

    const finalValue =
        Number(target) || 0;

    const duration =
        1000;

    const startTime =
        performance.now();


    function update(currentTime) {

        const elapsed =
            currentTime - startTime;

        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        const eased =
            1 - Math.pow(
                1 - progress,
                3
            );


        const currentValue =
            Math.round(
                finalValue * eased
            );


        element.textContent =
            currentValue + "%";


        if (progress < 1) {

            requestAnimationFrame(update);

        }

    }


    requestAnimationFrame(update);

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =====================================================
// LOGOUT
// =====================================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();


            localStorage.removeItem(
                "user"
            );


            window.location.href =
                "login.html";

        }
    );

}
// =====================================================
// FADE ON SCROLL
// =====================================================

const fadeSections =
    document.querySelectorAll(".fade-section");


const fadeObserver =
    new IntersectionObserver(
        function(entries) {

            entries.forEach(function(entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "fade-visible"
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


fadeSections.forEach(function(section) {

    fadeObserver.observe(section);

});
// ACTIVE SIDEBAR PAGE
const currentPage =
    window.location.pathname
        .split("/")
        .pop();

const dashboardNavLinks =
    document.querySelectorAll(
        ".dashboard-nav a"
    );

dashboardNavLinks.forEach(function(link) {
    const linkPage =
        link.getAttribute("href");

    if (
        linkPage &&
        linkPage !== "#" &&
        linkPage.split("#")[0] === currentPage
    ) {
        dashboardNavLinks.forEach(function(item) {
            item.classList.remove("active");
        });

        link.classList.add("active");
    }
});
// DASHBOARD SEARCH
const dashboardSearchInput =
    document.querySelector(
        ".dashboard-search input"
    );

if (dashboardSearchInput) {
    dashboardSearchInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key !== "Enter") {
                return;
            }

            const searchTerm =
                dashboardSearchInput.value.trim();

            if (!searchTerm) {
                return;
            }

            window.location.href =
                "opportunities.html?search=" +
                encodeURIComponent(searchTerm);
        }
    );
}