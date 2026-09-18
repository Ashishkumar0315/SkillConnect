const profileForm = document.getElementById("profileForm");

// =========================
// GET LOGGED-IN USER
// =========================

const userData = localStorage.getItem("user");

// Check login
if (!userData) {

    alert("Please login first.");

    window.location.href = "login.html";

} else {

    // Convert stored data into JavaScript object
    const user = JSON.parse(userData);


    // =========================
    // SKILLS
    // =========================

    // Store all skills in this array
    let skills = [];


    // =========================
    // PROJECTS
    // =========================

    let projects = [];


    // =========================
    // AI DRAWER
    // =========================

    const aiDrawerOverlay =
        document.getElementById("aiDrawerOverlay");

    const closeAiDrawer =
        document.getElementById("closeAiDrawer");

    const aiProjectTitle =
        document.getElementById("aiProjectTitle");

    const aiProjectTechnologies =
        document.getElementById("aiProjectTechnologies");

    const aiAnalysisContent =
        document.getElementById("aiAnalysisContent");


    // =========================
    // CLOSE AI DRAWER
    // =========================

    closeAiDrawer.addEventListener(
        "click",
        function() {

            aiDrawerOverlay.classList.remove("active");

        }
    );


    // =========================
    // CLOSE AI DRAWER
    // WHEN CLICKING OUTSIDE
    // =========================

    aiDrawerOverlay.addEventListener(
        "click",
        function(event) {

            if (event.target === aiDrawerOverlay) {

                aiDrawerOverlay.classList.remove("active");

            }

        }
    );


    // =========================
    // CLOSE AI DRAWER WITH ESCAPE
    // =========================

    document.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Escape") {

                aiDrawerOverlay.classList.remove("active");

            }

        }
    );


    // =========================
    // GET SKILL ELEMENTS
    // =========================

    const skillInput =
        document.getElementById("skill");

    const addSkillButton =
        document.getElementById("addSkillButton");

    const skillsList =
        document.getElementById("skillsList");


    // =========================
    // DISPLAY SKILLS
    // =========================

    function displaySkills() {

        skillsList.innerHTML = "";

        skills.forEach(function(skill, index) {

            const skillTag =
                document.createElement("span");

            skillTag.className =
                "skill-tag";

            skillTag.innerHTML = `
                ${skill}

                <button
                    type="button"
                    onclick="removeSkill(${index})"
                >
                    ×
                </button>
            `;

            skillsList.appendChild(skillTag);

        });

    }


    // =========================
    // REMOVE SKILL
    // =========================

    function removeSkill(index) {

        skills.splice(index, 1);

        displaySkills();

    }


    // =========================
    // ADD SKILL
    // =========================

    addSkillButton.addEventListener(
        "click",
        function() {

            const skill =
                skillInput.value.trim();

            if (skill === "") {

                alert("Please enter a skill.");

                return;

            }

            if (skills.includes(skill)) {

                alert(
                    "This skill has already been added."
                );

                return;

            }

            skills.push(skill);

            displaySkills();

            skillInput.value = "";

            skillInput.focus();

        }
    );


    // =========================
    // LOAD EXISTING PROFILE
    // =========================

    async function loadProfile() {

        try {

            const response = await fetch(
                `http://localhost:5000/api/profile/${user.id}`
            );


            if (response.status === 404) {

                console.log(
                    "No profile found. Create a new profile."
                );

                return;

            }


            const data =
                await response.json();


            if (!response.ok) {

                console.error(data.message);

                return;

            }


            // =========================
            // FILL PROFILE FORM
            // =========================

            document.getElementById("headline").value =
                data.headline || "";

            document.getElementById("bio").value =
                data.bio || "";

            document.getElementById("education").value =
                data.education || "";

            document.getElementById("location").value =
                data.location || "";

            document.getElementById("github").value =
                data.github_url || "";

            document.getElementById("linkedin").value =
                data.linkedin_url || "";


            console.log(
                "Profile loaded successfully."
            );

        } catch (error) {

            console.error(
                "Profile loading error:",
                error
            );

        }

    }


    // =========================
    // LOAD EXISTING SKILLS
    // =========================

    async function loadSkills() {

        try {

            const response = await fetch(
                `http://localhost:5000/api/skills/${user.id}`
            );


            const data =
                await response.json();


            if (!response.ok) {

                console.error(data.message);

                return;

            }


            // =========================
            // CONVERT DATABASE SKILLS
            // INTO SKILL NAMES
            // =========================

            skills = data.map(
                function(skill) {

                    return skill.skill_name;

                }
            );


            // Display skills
            displaySkills();


            console.log(
                "Skills loaded:",
                skills
            );

        } catch (error) {

            console.error(
                "Skills loading error:",
                error
            );

        }

    }


    // =========================
    // LOAD EXISTING PROJECTS
    // =========================

    async function loadProjects() {

        try {

            const response = await fetch(
                `http://localhost:5000/api/projects/${user.id}`
            );


            const data =
                await response.json();


            if (!response.ok) {

                console.error(data.message);

                return;

            }


            projects = data;


            console.log(
                "Projects loaded:",
                projects
            );


            displayProjects();

        } catch (error) {

            console.error(
                "Projects loading error:",
                error
            );

        }

    }


    // =========================
    // DISPLAY PROJECTS
    // =========================

    function displayProjects() {

        const projectsList =
            document.getElementById("projectsList");


        projectsList.innerHTML = "";


        projects.forEach(function(project) {

            const projectCard =
                document.createElement("div");


            projectCard.className =
                "project-card";


            projectCard.innerHTML = `

                <h3>
                    ${project.title}
                </h3>


                <p>
                    ${project.description || ""}
                </p>


                <p>
                    <strong>Technologies:</strong>
                    ${project.technologies || ""}
                </p>


                ${
                    project.project_url
                    ? `
                        <a
                            href="${project.project_url}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Live Project
                        </a>
                    `
                    : ""
                }


                ${
                    project.github_url
                    ? `
                        <a
                            href="${project.github_url}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            GitHub
                        </a>
                    `
                    : ""
                }


                <button
                    type="button"
                    class="ai-analyze-button"
                    onclick="analyzeProject(${project.id})"
                >
                    ✨ Analyze with AI
                </button>


                <button
                    type="button"
                    class="delete-project-button"
                    onclick="deleteProject(${project.id})"
                >
                    Delete Project
                </button>

            `;


            projectsList.appendChild(projectCard);

        });

    }


    // =========================
    // DELETE PROJECT
    // =========================

    async function deleteProject(projectId) {

        const confirmDelete =
            confirm(
                "Are you sure you want to delete this project?"
            );


        if (!confirmDelete) {

            return;

        }


        try {

            const response = await fetch(
                `http://localhost:5000/api/projects/${projectId}`,
                {
                    method: "DELETE"
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                alert(data.message);

                return;

            }


            projects = projects.filter(
                function(project) {

                    return project.id !== projectId;

                }
            );


            displayProjects();


            alert(
                "Project deleted successfully."
            );


        } catch (error) {

            console.error(
                "Delete project error:",
                error
            );


            alert(
                "Unable to connect to server."
            );

        }

    }


    // =========================================================
    // AI ANALYSIS DISPLAY
    // =========================================================

    function renderAIAnalysis(analysis) {

        // =========================
        // GET PROJECT SCORE
        // =========================

        let score = 0;


        const scoreMatch = analysis.match(
            /(\d{1,3})\s*\/\s*100/
        );


        if (scoreMatch) {

            score = parseInt(
                scoreMatch[1],
                10
            );

        }


        // Keep score between 0 and 100
        score = Math.max(
            0,
            Math.min(
                100,
                score
            )
        );


        console.log(
            "AI SCORE:",
            score
        );


        // =========================
        // GET SECTION CONTENT
        // =========================

        function getSection(startText, endTexts) {

            const lowerAnalysis =
                analysis.toLowerCase();


            const startIndex =
                lowerAnalysis.indexOf(
                    startText.toLowerCase()
                );


            if (startIndex === -1) {

                return "";

            }


            let endIndex =
                analysis.length;


            endTexts.forEach(
                function(endText) {

                    const index =
                        lowerAnalysis.indexOf(
                            endText.toLowerCase(),
                            startIndex + startText.length
                        );


                    if (
                        index !== -1 &&
                        index < endIndex
                    ) {

                        endIndex = index;

                    }

                }
            );


            return analysis
                .substring(
                    startIndex + startText.length,
                    endIndex
                )
                .trim();

        }


        // =========================
        // GET EACH AI SECTION
        // =========================

        const strengths =
            getSection(
                "2. Strengths",
                [
                    "3. Recommended Skills",
                    "4. Industry Relevance",
                    "5. Specific Improvements",
                    "6. Recruiter Impact"
                ]
            );


        const recommendedSkills =
            getSection(
                "3. Recommended Skills",
                [
                    "4. Industry Relevance",
                    "5. Specific Improvements",
                    "6. Recruiter Impact"
                ]
            );


        const industryRelevance =
            getSection(
                "4. Industry Relevance",
                [
                    "5. Specific Improvements",
                    "6. Recruiter Impact"
                ]
            );


        const improvements =
            getSection(
                "5. Specific Improvements",
                [
                    "6. Recruiter Impact"
                ]
            );


        const recruiterImpact =
            getSection(
                "6. Recruiter Impact",
                []
            );


        // =========================
        // CLEAN AI TEXT
        // =========================

        function cleanText(text) {

            if (!text) {

                return "";

            }


            return text
                .replace(/#{1,6}\s*/g, "")
                .replace(/\*\*/g, "")
                .replace(/^\s*[-*•]\s*/gm, "")
                .replace(/^\s*\d+[.)]\s*/gm, "")
                .replace(/```[\s\S]*?```/g, "")
                .replace(/`/g, "")
                .replace(/\n+/g, " ")
                .replace(/\s+/g, " ")
                .trim();

        }


        // =========================
        // SHORT SUMMARY
        // =========================

        function shortSummary(
            text,
            maxLength
        ) {

            const cleaned =
                cleanText(text);


            if (
                cleaned.length <=
                maxLength
            ) {

                return cleaned;

            }


            return (
                cleaned
                    .substring(
                        0,
                        maxLength
                    )
                    .trim() +
                "..."
            );

        }


        // =========================
        // CREATE BULLET LIST
        // =========================

        function makeList(text) {

            if (!text) {

                return `
                    <li>
                        No specific information provided.
                    </li>
                `;

            }


            const items =
                text
                    .split("\n")
                    .map(
                        function(line) {

                            return line
                                .replace(
                                    /```[\w-]*/g,
                                    ""
                                )
                                .replace(
                                    /```/g,
                                    ""
                                )
                                .replace(
                                    /^#{1,6}\s*/g,
                                    ""
                                )
                                .replace(
                                    /^\s*[-*•]\s*/,
                                    ""
                                )
                                .replace(
                                    /^\s*\d+[.)]\s*/,
                                    ""
                                )
                                .replace(
                                    /\*\*/g,
                                    ""
                                )
                                .replace(
                                    /`/g,
                                    ""
                                )
                                .trim();

                        }
                    )
                    .filter(
                        function(line) {

                            if (!line) {

                                return false;

                            }


                            if (
                                /^(realistic product idea|technical skills to develop|priority technical skills)$/i
                                    .test(line)
                            ) {

                                return false;

                            }


                            return true;

                        }
                    );


            // If AI returned everything in one paragraph,
            // split it into sentences as a fallback.
            if (items.length === 1) {

                const sentences =
                    items[0]
                        .split(/(?<=[.!?])\s+/)
                        .map(
                            function(sentence) {

                                return sentence.trim();

                            }
                        )
                        .filter(
                            function(sentence) {

                                return sentence.length > 0;

                            }
                        );


                if (sentences.length > 1) {

                    return sentences
                        .slice(0, 3)
                        .map(
                            function(item) {

                                if (item.length > 90) {

                                    item =
                                        item
                                            .substring(0, 87)
                                            .trim() +
                                        "...";

                                }


                                return `<li>${item}</li>`;

                            }
                        )
                        .join("");

                }

            }


            return items
                .slice(0, 3)
                .map(
                    function(item) {

                        // Keep each bullet compact
                        if (item.length > 90) {

                            item =
                                item
                                    .substring(0, 87)
                                    .trim() +
                                "...";

                        }


                        return `<li>${item}</li>`;

                    }
                )
                .join("");

        }


        // =========================
        // SCORE LABEL
        // =========================

        let scoreLabel =
            "Needs Improvement";


        if (score >= 85) {

            scoreLabel =
                "Excellent Project";

        } else if (score >= 70) {

            scoreLabel =
                "Strong Project";

        } else if (score >= 50) {

            scoreLabel =
                "Good Start";

        }


        // =========================
        // BUILD AI DASHBOARD
        // =========================

        aiAnalysisContent.innerHTML = `

            <!-- PROJECT SCORE -->

            <div class="ai-score-card">

                <div
                    class="ai-score-circle"
                    style="--score:0deg"
                    data-score="${score}"
                >

                    <div class="ai-score-number">

                        <span class="ai-score-value">
                            0
                        </span>

                        <span>
                            /100
                        </span>

                    </div>

                </div>


                <div class="ai-score-info">

                    <h3>
                        Project Score
                    </h3>


                    <div class="ai-score-label">

                        ${scoreLabel}

                        <span>
                            ↑
                        </span>

                    </div>


                    <p>
                        AI evaluation based on your
                        project's structure, technologies
                        and portfolio value.
                    </p>

                </div>

            </div>


            <!-- STRENGTHS -->

            <div class="ai-insight-card ai-strengths">

                <div class="ai-insight-icon">
                    👍
                </div>


                <div class="ai-insight-body">

                    <h3>
                        Strengths
                    </h3>


                    <ul>
                        ${makeList(strengths)}
                    </ul>

                </div>


                <span class="ai-chevron">
                    ⌄
                </span>

            </div>


            <!-- RECOMMENDED SKILLS -->

            <div class="ai-insight-card ai-skills">

                <div class="ai-insight-icon">
                    ⚙
                </div>


                <div class="ai-insight-body">

                    <h3>
                        Recommended Skills
                    </h3>


                    <ul>
                        ${makeList(recommendedSkills)}
                    </ul>

                </div>


                <span class="ai-chevron">
                    ⌄
                </span>

            </div>


            <!-- INDUSTRY RELEVANCE -->

            <div class="ai-insight-card ai-industry">

                <div class="ai-insight-icon">
                    📊
                </div>


                <div class="ai-insight-body">

                    <h3>
                        Industry Relevance
                    </h3>


                    <strong>
                        High Relevance
                    </strong>


                    <p>
                        ${shortSummary(
                            industryRelevance,
                            130
                        )}
                    </p>

                </div>


                <span class="ai-chevron">
                    ⌄
                </span>

            </div>


            <!-- SPECIFIC IMPROVEMENTS -->

            <div class="ai-insight-card ai-improvements">

                <div class="ai-insight-icon">
                    🔧
                </div>


                <div class="ai-insight-body">

                    <h3>
                        Specific Improvements
                    </h3>


                    <ul>
                        ${makeList(improvements)}
                    </ul>

                </div>


                <span class="ai-chevron">
                    ⌄
                </span>

            </div>


            <!-- RECRUITER IMPACT -->

            <div class="ai-insight-card ai-recruiter">

                <div class="ai-insight-icon">
                    🎯
                </div>


                <div class="ai-insight-body">

                    <h3>
                        Recruiter Impact
                    </h3>


                    <strong>
                        Strong Impact
                    </strong>


                    <p>
                        ${shortSummary(
                            recruiterImpact,
                            130
                        )}
                    </p>

                </div>


                <span class="ai-chevron">
                    ⌄
                </span>

            </div>

        `;


        // =========================
        // ANIMATE SCORE
        // =========================

        animateAIScore(score);

    }


    // =========================================================
    // ANIMATE AI PROJECT SCORE
    // =========================================================

    function animateAIScore(score) {

        const circle =
            document.querySelector(
                ".ai-score-circle"
            );


        const scoreValue =
            document.querySelector(
                ".ai-score-value"
            );


        if (
            !circle ||
            !scoreValue
        ) {

            return;

        }


        const duration = 1800;

        const startTime =
            performance.now();


        function animate(currentTime) {

            const elapsed =
                currentTime - startTime;


            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            // Smooth ease-out animation
            const easedProgress =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );


            const currentScore =
                Math.round(
                    score * easedProgress
                );


            const currentDegrees =
                currentScore * 3.6;


            // Update circular ring
            circle.style.setProperty(
                "--score",
                currentDegrees + "deg"
            );


            // Update number
            scoreValue.textContent =
                currentScore;


            if (progress < 1) {

                requestAnimationFrame(
                    animate
                );

            } else {

                scoreValue.textContent =
                    score;


                circle.style.setProperty(
                    "--score",
                    (score * 3.6) + "deg"
                );

            }

        }


        requestAnimationFrame(
            animate
        );

    }


    // =========================================================
    // ANALYZE PROJECT WITH AI
    // =========================================================

    async function analyzeProject(projectId) {

        const project =
            projects.find(
                function(project) {

                    return project.id === projectId;

                }
            );


        if (!project) {

            alert("Project not found.");

            return;

        }


        // =========================
        // SHOW PROJECT INFORMATION
        // =========================

        aiProjectTitle.textContent =
            project.title;


        aiProjectTechnologies.textContent =
            project.technologies ||
            "Technologies not provided";


        // =========================
        // SHOW LOADING ANIMATION
        // =========================

        aiAnalysisContent.innerHTML = `

            <div class="ai-loading">

                <div class="ai-loading-icon">
                    ✨
                </div>


                <div class="ai-loading-text">

                    <h3>
                        AI is analyzing your project
                    </h3>


                    <p>
                        SkillConnect AI is reviewing your
                        project, technologies, strengths,
                        industry relevance, and improvement
                        opportunities.
                    </p>

                </div>


                <div class="ai-loading-dots">

                    <span></span>
                    <span></span>
                    <span></span>

                </div>

            </div>

        `;


        // =========================
        // OPEN DRAWER IMMEDIATELY
        // =========================

        aiDrawerOverlay.classList.add(
            "active"
        );


        // =========================
        // CALL AI API
        // =========================

        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/ai/analyze-project",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            title:
                                project.title,

                            description:
                                project.description,

                            technologies:
                                project.technologies,

                            project_url:
                                project.project_url,

                            github_url:
                                project.github_url

                        })

                    }
                );


            const data =
                await response.json();


            // =========================
            // HANDLE AI ERROR
            // =========================

            if (!response.ok) {

                aiAnalysisContent.innerHTML = `

                    <div class="ai-error">

                        <h3>
                            ⚠️ Analysis failed
                        </h3>


                        <p>
                            ${
                                data.message ||
                                "Unable to analyze this project."
                            }
                        </p>

                    </div>

                `;

                return;

            }


            // =========================
            // SHOW AI RESULT
            // =========================

            renderAIAnalysis(
                data.analysis
            );


            console.log(
                "AI analysis:",
                data
            );


        } catch (error) {

            console.error(
                "AI project analysis error:",
                error
            );


            // =========================
            // SHOW CONNECTION ERROR
            // =========================

            aiAnalysisContent.innerHTML = `

                <div class="ai-error">

                    <h3>
                        ⚠️ Connection error
                    </h3>


                    <p>
                        Unable to connect to the AI service.
                        Please make sure your server is running.
                    </p>

                </div>

            `;

        }

    }


    // =========================
    // MAKE FUNCTIONS AVAILABLE
    // TO HTML ONCLICK
    // =========================

    window.analyzeProject =
        analyzeProject;


    window.deleteProject =
        deleteProject;


    window.removeSkill =
        removeSkill;


    // =========================
    // LOAD PROFILE + SKILLS + PROJECTS
    // =========================

    loadProfile();

    loadSkills();

    loadProjects();


    // =========================
    // SAVE PROFILE
    // =========================

    profileForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            // =========================
            // GET FORM VALUES
            // =========================

            const headline =
                document.getElementById(
                    "headline"
                ).value.trim();


            const bio =
                document.getElementById(
                    "bio"
                ).value.trim();


            const education =
                document.getElementById(
                    "education"
                ).value.trim();


            const location =
                document.getElementById(
                    "location"
                ).value.trim();


            const github =
                document.getElementById(
                    "github"
                ).value.trim();


            const linkedin =
                document.getElementById(
                    "linkedin"
                ).value.trim();


            // =========================
            // GET PROJECT VALUES
            // =========================

            const projectTitle =
                document.getElementById(
                    "projectTitle"
                ).value.trim();


            const projectDescription =
                document.getElementById(
                    "projectDescription"
                ).value.trim();


            const projectTechnologies =
                document.getElementById(
                    "projectTechnologies"
                ).value.trim();


            const projectUrl =
                document.getElementById(
                    "projectUrl"
                ).value.trim();


            const projectGithub =
                document.getElementById(
                    "projectGithub"
                ).value.trim();


            // =========================
            // CHECK REQUIRED FIELDS
            // =========================

            if (
                headline === "" ||
                bio === "" ||
                education === ""
            ) {

                alert(
                    "Please fill in all required profile fields."
                );

                return;

            }


            // =========================
            // CHECK SKILLS
            // =========================

            if (skills.length === 0) {

                alert(
                    "Please add at least one skill."
                );

                return;

            }


            // =========================
            // CHECK PROJECT
            // =========================

            if (projectTitle === "") {

                alert(
                    "Please enter a project title."
                );

                return;

            }


            try {

                // =========================
                // SAVE PROFILE
                // =========================

                const response =
                    await fetch(
                        "http://localhost:5000/api/profile",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                user_id:
                                    user.id,

                                headline:
                                    headline,

                                bio:
                                    bio,

                                education:
                                    education,

                                location:
                                    location,

                                github_url:
                                    github,

                                linkedin_url:
                                    linkedin

                            })

                        }
                    );


                const data =
                    await response.json();


                // =========================
                // CHECK PROFILE RESPONSE
                // =========================

                if (!response.ok) {

                    alert(
                        data.message
                    );

                    return;

                }


                // =========================
                // SAVE ALL SKILLS
                // =========================

                const skillResponse =
                    await fetch(
                        "http://localhost:5000/api/skills",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                user_id:
                                    user.id,

                                skills:
                                    skills

                            })

                        }
                    );


                const skillData =
                    await skillResponse.json();


                // =========================
                // CHECK SKILLS RESPONSE
                // =========================

                if (!skillResponse.ok) {

                    alert(
                        skillData.message
                    );

                    return;

                }


                console.log(
                    "Skills updated:",
                    skillData
                );


                // =========================
                // SAVE PROJECT
                // =========================

                const projectResponse =
                    await fetch(
                        "http://localhost:5000/api/projects",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                user_id:
                                    user.id,

                                title:
                                    projectTitle,

                                description:
                                    projectDescription,

                                technologies:
                                    projectTechnologies,

                                project_url:
                                    projectUrl,

                                github_url:
                                    projectGithub

                            })

                        }
                    );


                const projectData =
                    await projectResponse.json();


                // =========================
                // CHECK PROJECT RESPONSE
                // =========================

                if (!projectResponse.ok) {

                    alert(
                        projectData.message
                    );

                    return;

                }


                console.log(
                    "Project saved:",
                    projectData
                );


                // =========================
                // SUCCESS
                // =========================

                alert(
                    "Profile, skills and project saved successfully!"
                );


                // Go to dashboard
                window.location.href =
                    "dashboard.html";

            } catch (error) {

                console.error(
                    "Save profile error:",
                    error
                );


                alert(
                    "Unable to connect to server."
                );

            }

        }
    );

}