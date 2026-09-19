# SkillConnect 🚀

SkillConnect is a full-stack student freelance and portfolio platform designed to help students showcase their skills, manage projects, discover opportunities, and build a professional online presence.

The platform combines a modern frontend with a Node.js/Express backend, MySQL database, and AI-powered project analysis.

## 🌐 Live Demo

**Live Website:**  
https://skill-connect-eta.vercel.app/

> The frontend is hosted on Vercel and the backend/database are hosted on Railway.

---

## ✨ Features

### 👤 User Authentication
- Student registration
- Secure login
- Password hashing with bcrypt
- Session information stored using localStorage
- Protected dashboard access

### 📋 Student Profiles
- Create and update a professional profile
- Add headline
- Add location
- Add biography
- Add education
- Add GitHub profile
- Add LinkedIn profile
- Track profile completion

### 💼 Projects
- Add portfolio projects
- Add project descriptions
- Add technologies used
- Add GitHub repository links
- View projects from the dashboard
- Delete projects

### 🛠️ Skills
- Add technical and professional skills
- Display saved skills
- Manage skills from the profile

### 🔎 Opportunities
- Browse available opportunities
- Search opportunities
- Explore opportunities suitable for students

### 🤖 AI-Powered Features
SkillConnect includes an AI-powered project analysis feature.

The AI feature can analyze project information and provide useful feedback to help users improve their project presentation.

### 📊 Dashboard
The dashboard provides:
- Project count
- Skill count
- Profile completion
- Opportunities
- Account information
- Recent projects
- Quick actions

---

## 🧰 Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript
- Responsive UI
- Modern CSS design system

### Backend
- Node.js
- Express.js
- REST API
- CORS
- bcrypt
- OpenAI API

### Database
- MySQL

### Deployment
- Vercel — Frontend
- Railway — Backend
- Railway MySQL — Database

### Development Tools
- Visual Studio Code
- Git
- GitHub
- MySQL Workbench

---

## 🏗️ Project Structure

```text
SkillConnect/
│
├── backend/
│   ├── database.js
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── reset-password.js
│
├── database/
│   └── schema.sql
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── dashboard.js
│   │   ├── login.js
│   │   ├── main.js
│   │   ├── profile.js
│   │   └── register.js
│   │
│   ├── dashboard.html
│   ├── index.html
│   ├── login.html
│   ├── opportunities.html
│   ├── profile.html
│   └── register.html
│
├── .gitignore
└── README.md

🗄️ Database

SkillConnect uses MySQL with the following main tables:

users
student_profiles
skills
projects
opportunities
applications

The database schema is available in:

database/schema.sql
⚙️ Running the Project Locally
1. Clone the repository
git clone https://github.com/Ashishkumar0315/SkillConnect.git

Move into the project directory:

cd SkillConnect
2. Install backend dependencies
cd backend
npm install
3. Configure environment variables

Create a file:

backend/.env

Add your own credentials:

DB_PASSWORD=your_mysql_password
OPENAI_API_KEY=your_openai_api_key

Never commit .env files, passwords, API keys, or other secrets to GitHub.

4. Set up MySQL

Create a MySQL database named:

skillconnect

Then import:

database/schema.sql

You can use MySQL Workbench or the MySQL command line.

5. Start the backend

From the backend directory:

node server.js

The backend runs on:

http://localhost:5000

You can test the API with:

http://localhost:5000/
6. Run the frontend

Open the frontend folder using a local development server.

For example, using the VS Code Live Server extension:

frontend/index.html

Then open the URL provided by Live Server.

🔐 Security

Sensitive credentials are intentionally excluded from this repository.

The .gitignore file prevents files such as:

backend/.env
backend/node_modules/
*.log

from being committed.

Never upload:
Database passwords
OpenAI API keys
.env files
Private credentials
MySQL data directories
☁️ Deployment Architecture

The deployed application uses a cloud-based architecture:

                 ┌──────────────────┐
                 │      Visitor     │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │      Vercel      │
                 │    Frontend      │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │     Railway      │
                 │ Node.js/Express  │
                 │     Backend      │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │  Railway MySQL   │
                 │     Database     │
                 └──────────────────┘
                          │
                          │
                          ▼
                 ┌──────────────────┐
                 │    OpenAI API    │
                 │   AI Features    │
                 └──────────────────┘

The website does not depend on the developer's personal computer being turned on.

🔌 API Overview

The backend provides REST API endpoints for:

Authentication
POST /api/register
POST /api/login
Profile
GET  /api/profile/:userId
POST /api/profile
Skills
GET  /api/skills/:userId
POST /api/skills
Projects
GET    /api/projects/:userId
POST   /api/projects
DELETE /api/projects/:id
Opportunities
GET /api/opportunities
AI
GET  /api/ai/test
POST /api/ai/analyze-project
Database Test
GET /api/test-db
🤖 AI Feature

SkillConnect integrates the OpenAI API to provide AI-powered project analysis.

Users can provide project information and receive AI-generated feedback related to their project.

The OpenAI API key is stored securely as an environment variable and is not included in the repository.

📈 Current Status
Feature	Status
User Registration	✅ Complete
User Login	✅ Complete
Student Profiles	✅ Complete
Skills Management	✅ Complete
Project Management	✅ Complete
Opportunities	✅ Complete
Dashboard	✅ Complete
AI Project Analysis	✅ Complete
MySQL Database	✅ Complete
Backend Deployment	✅ Complete
Frontend Deployment	✅ Complete
🚀 Future Improvements

Possible future improvements include:

Real-time notifications
Advanced opportunity filtering
Student-to-client messaging
Project recommendations
AI-powered resume improvement
AI skill recommendations
Profile verification
File/image uploads
Advanced search
Improved mobile experience
👨‍💻 Author

Ashish Kumar

GitHub:
https://github.com/Ashishkumar0315

📄 License

This project is created for educational and portfolio purposes.

⭐ Support

If you find this project interesting, consider giving the repository a ⭐ on GitHub.