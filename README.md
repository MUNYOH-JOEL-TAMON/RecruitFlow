# RecruitFlow ATS

RecruitFlow is a modern, full-stack Applicant Tracking System (ATS) designed to streamline the hiring process for teams. Unlike traditional trackers, RecruitFlow uses a highly visual Kanban-style interface and is architecturally prepared to integrate a Machine Learning "Smart Screener" to help recruiters identify top talent instantly.

## 🚀 Key Features

- **Visual Candidate Pipeline**: A drag-and-drop Kanban board (Applied, Screened, Interviewing, Offered, Hired) for real-time status tracking.
- **Dynamic Theming**: Premium glowing UI with support for both Light and Dark mode using highly responsive CSS variables.
- **Resume Management**: Centralized storage for PDF resumes linked entirely to candidate profiles.
- **Smart-Screening Ready**: Backend and UI structure is prepared for seamless integration with a Python/FastAPI NLP model that will parse resumes and calculate Match Scores against Job Descriptions.
- **Secure Authentication**: Express backend protected by JSON Web Tokens (JWT) and Bcrypt secure hashing.
- **Advanced Filtering**: Quickly filter candidates globally by min-score, name, or extracted skills.

## 🛠️ Tech Stack

### Frontend
- React 18 & Vite
- TypeScript
- Tailwind CSS
- `@hello-pangea/dnd` (for Drag-and-Drop)
- Lucide React (for Icons)
- React Router DOM

### Backend
- Node.js & Express.js
- MongoDB Atlas (via Mongoose)
- JSON Web Token (JWT) + BcryptJS
- Multer (for robust PDF file handling)

## 📦 Local Development Setup

To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/MUNYOH-JOEL-TAMON/RecruitFlow.git
cd RecruitFlow
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file inside the `backend/` folder and add the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_cluster_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Start the development server:
```bash
npm run dev
```

### 4. Open Application
Navigate to `http://localhost:5173` in your browser. 

## 🧠 Smart Screener Roadmap (Coming Soon)
The `backend/src/controllers/candidateController.js` includes a placeholder implementation prepared to post candidate PDFs directly to a Python NLP service to automatically extract:
- Top Skills
- Total Match Score (%)
- Position Inference

This significantly scales the recruiter's ability to triage hundreds of applications efficiently without suffering from "resume fatigue".
