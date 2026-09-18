require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const OpenAI = require("openai");
const db = require("./database");

const app = express();

const PORT = 5000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(express.json());
app.use(cors());

// Home API
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to SkillConnect API"
    });
});

// Test Database
app.get("/api/test-db", (req, res) => {
    const sql = "SELECT * FROM users";

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Database query failed"
            });
        }

        res.json(results);
    });
});

// Register User
app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check if email already exists
        const checkSql = "SELECT id FROM users WHERE email = ?";

        db.query(checkSql, [email], async (err, results) => {
            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (results.length > 0) {
                return res.status(409).json({
                    message: "Email already registered"
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user
            const insertSql = `
                INSERT INTO users (name, email, password, role)
                VALUES (?, ?, ?, ?)
            `;

            db.query(
                insertSql,
                [name, email, hashedPassword, role],
                (err, result) => {
                    if (err) {
                        console.error(err);

                        return res.status(500).json({
                            message: "Registration failed"
                        });
                    }

                    res.status(201).json({
                        message: "Registration successful",
                        userId: result.insertId
                    });
                }
            );
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user by email
        const sql = "SELECT * FROM users WHERE email = ?";

        db.query(sql, [email], async (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Database error"
                });
            }

            // User not found
            if (results.length === 0) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            const user = results[0];

            // Compare entered password with hashed password
            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!passwordMatch) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            // Login successful
            res.json({
                message: "Login successful",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});
// Create Student Profile
// =========================
// CREATE OR UPDATE PROFILE
// =========================

app.post("/api/profile", (req, res) => {

    const {
        user_id,
        headline,
        bio,
        education,
        location,
        github_url,
        linkedin_url
    } = req.body;


    // Check required fields
    if (!user_id || !headline || !bio || !education) {

        return res.status(400).json({
            message: "Required profile fields are missing"
        });

    }


    // Check if profile already exists
    const checkSql = `
        SELECT id
        FROM student_profiles
        WHERE user_id = ?
    `;


    db.query(checkSql, [user_id], (err, results) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                message: "Database error"
            });

        }


        // =========================
        // UPDATE EXISTING PROFILE
        // =========================

        if (results.length > 0) {

            const profileId = results[0].id;


            const updateSql = `
                UPDATE student_profiles
                SET
                    headline = ?,
                    bio = ?,
                    education = ?,
                    location = ?,
                    github_url = ?,
                    linkedin_url = ?
                WHERE id = ?
            `;


            db.query(
                updateSql,
                [
                    headline,
                    bio,
                    education,
                    location,
                    github_url,
                    linkedin_url,
                    profileId
                ],
                (err) => {

                    if (err) {

                        console.error(err);

                        return res.status(500).json({
                            message: "Profile update failed"
                        });

                    }


                    return res.json({
                        message: "Profile updated successfully"
                    });

                }
            );

            return;
        }


        // =========================
        // CREATE NEW PROFILE
        // =========================

        const insertSql = `
            INSERT INTO student_profiles
            (
                user_id,
                headline,
                bio,
                education,
                location,
                github_url,
                linkedin_url
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;


        db.query(
            insertSql,
            [
                user_id,
                headline,
                bio,
                education,
                location,
                github_url,
                linkedin_url
            ],
            (err, result) => {

                if (err) {

                    console.error(err);

                    return res.status(500).json({
                        message: "Profile creation failed"
                    });

                }


                res.status(201).json({
                    message: "Profile created successfully",
                    profileId: result.insertId
                });

            }
        );

    });

});
// =========================
// SAVE SKILLS
// =========================

app.post("/api/skills", (req, res) => {

    const { user_id, skills } = req.body;


    // Check required data
    if (!user_id || !Array.isArray(skills)) {

        return res.status(400).json({
            message: "User ID and skills are required"
        });

    }


    // Delete old skills
    const deleteSql = `
        DELETE FROM skills
        WHERE user_id = ?
    `;


    db.query(deleteSql, [user_id], (err) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                message: "Could not update skills"
            });

        }


        // If there are no skills
        if (skills.length === 0) {

            return res.json({
                message: "Skills updated successfully"
            });

        }


        // Prepare values
        const values = skills.map(skill => [
            user_id,
            skill
        ]);


        const insertSql = `
            INSERT INTO skills
            (user_id, skill_name)
            VALUES ?
        `;


        db.query(insertSql, [values], (err) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    message: "Could not save skills"
                });

            }


            res.json({
                message: "Skills updated successfully"
            });

        });

    });

});
// =========================
// GET PROFILE
// =========================
app.post("/api/projects", (req, res) => {

    const {
        user_id,
        title,
        description,
        technologies,
        project_url,
        github_url
    } = req.body;


    // Check required fields
    if (!user_id || !title) {

        return res.status(400).json({
            message: "User ID and project title are required"
        });

    }


    // SQL query
    const sql = `
        INSERT INTO projects
        (
            user_id,
            title,
            description,
            technologies,
            project_url,
            github_url
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;


    // Insert project
    db.query(
        sql,
        [
            user_id,
            title,
            description,
            technologies,
            project_url,
            github_url
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "Project creation error:",
                    err
                );

                return res.status(500).json({
                    message: "Could not save project"
                });

            }


            res.status(201).json({

                message: "Project created successfully",

                projectId: result.insertId

            });

        }
    );

});
app.get("/api/profile/:userId", (req, res) => {

    const userId = req.params.userId;

    const sql = `
        SELECT
            id,
            user_id,
            headline,
            bio,
            education,
            location,
            github_url,
            linkedin_url
        FROM student_profiles
        WHERE user_id = ?
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Could not load profile"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        res.json(results[0]);

    });

});


// =========================
// GET USER SKILLS
// =========================

app.get("/api/skills/:userId", (req, res) => {

    const userId = req.params.userId;

    const sql = `
        SELECT id, skill_name
        FROM skills
        WHERE user_id = ?
        ORDER BY id ASC
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Could not load skills"
            });
        }

        res.json(results);

    });

});
// =========================
// GET USER PROJECTS
// =========================

app.get("/api/projects/:userId", (req, res) => {

    const userId = req.params.userId;

    const sql = `
        SELECT
            id,
            user_id,
            title,
            description,
            technologies,
            project_url,
            github_url
        FROM projects
        WHERE user_id = ?
        ORDER BY id ASC
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Could not load projects"
            });
        }

        res.json(results);

    });

});
// =========================
// DELETE PROJECT
// =========================

app.delete("/api/projects/:projectId", (req, res) => {

    const projectId = req.params.projectId;

    const sql = `
        DELETE FROM projects
        WHERE id = ?
    `;

    db.query(sql, [projectId], (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Could not delete project"
            });
        }

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Project not found"
            });

        }

        res.json({
            message: "Project deleted successfully"
        });

    });

});
// =========================
// AI CONNECTION TEST
// =========================

app.get("/api/ai/test", async (req, res) => {

    try {

        const response = await openai.responses.create({
            model: "gpt-5.6-luna",
            input: "Reply with exactly: AI connection successful"
        });

        res.json({
            message: response.output_text
        });

    } catch (error) {

        console.error("OpenAI error:", error);

        res.status(500).json({
            message: "OpenAI connection failed"
        });

    }

});
// =========================
// AI PROJECT ANALYZER
// =========================

app.post("/api/ai/analyze-project", async (req, res) => {

    try {

        const {
            title,
            description,
            technologies,
            project_url,
            github_url
        } = req.body;

        // Check project title
        if (!title) {

            return res.status(400).json({
                message: "Project title is required"
            });

        }

        // Create AI prompt
        const prompt = `
You are an AI career advisor for SkillConnect,
a student freelance and opportunities platform.

Analyze the following student project.

PROJECT TITLE:
${title}

PROJECT DESCRIPTION:
${description || "Not provided"}

TECHNOLOGIES:
${technologies || "Not provided"}

LIVE PROJECT URL:
${project_url || "Not provided"}

GITHUB URL:
${github_url || "Not provided"}

Give a practical career-focused analysis.

Include these sections:

1. Project Score out of 100
2. Strengths
3. Recommended Skills
4. Industry Relevance
5. Specific Improvements
6. Recruiter Impact

Give specific and useful advice that helps the student
improve their portfolio and become more attractive to
recruiters and freelance clients.
`;

        // Send project to OpenAI
        const response = await openai.responses.create({

            model: "gpt-5.6-luna",

            input: prompt

        });

        // Send AI result to frontend
        res.json({

            analysis: response.output_text

        });

    } catch (error) {

        console.error(
            "AI project analysis error:",
            error
        );

        res.status(500).json({

            message: "Could not analyze project with AI"

        });

    }

});
// Start Server
app.listen(PORT, () => {
    console.log(
        `SkillConnect server running on http://localhost:${PORT}`
    );
});