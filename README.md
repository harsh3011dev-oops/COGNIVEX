# Cognivex — Adaptive Learning Portal for CS/IT Engineers

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![Express.js](https://img.shields.io/badge/Express-5.2-gray?style=flat-square&logo=express)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-emerald?style=flat-square&logo=supabase)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

Cognivex is a focused learning sanctuary for Computer Science and Information Technology engineering students. It provides a structured environment to master core subjects for semester exams, track placement readiness roadmap checklists, and practice questions with adaptive, context-aware AI feedback.

---

## 🌟 Key Features

- **🎯 Goal-Aware Dashboard**: Tailors metrics, streaks, and subject completion cards dynamically based on whether you are preparing for semester exams, placement loops, or both.
- **📚 Semester Exam Prep Hub**: Access 6 core CS subjects (DSA, OS, DBMS, CN, OOP, SE) listing high-weightage exam topics, checkable study marks, and practice redirects.
- **🚀 Placement Roadmap Checklist**: Interactive 4-phase preparation guide tracking DSA basics, advanced topics, core concepts, and soft skills with interactive completion meters.
- **💬 Context-Aware AI Mentor**: Custom AI counselor integrated with Groq (Llama 3.3 model) that knows your target semester, weak areas, and current progress metrics to answer questions and quiz you.
- **🧠 Cognitive Scoring Engine**: Backstage statistical calculator that monitors test submissions and shifts speed, accuracy, and cognitive ratings.
- **📂 Document-to-Test Generator**: Drag and drop PDF notes to instantly create mock quizzes.

---

## 🔗 Demo
* **Live Demo Link**: [Deploy on Vercel (Placeholder)](https://cognivex-learning.vercel.app)

---

## 🛠️ Tech Stack
* **Frontend**: Next.js 16 (App Router), TypeScript, TailwindCSS v4, Framer Motion, Lucide Icons.
* **Backend**: Node.js, Express.js, Supabase JS client.
* **Database**: Supabase PostgreSQL.
* **AI Model**: Llama-3.3-70b-versatile via Groq API.

---

## 🚀 Local Setup & Installation

### Prerequisite: Database Setup
Apply the schema updates located in:
* [`backend/src/config/migration.sql`](file:///c:/Users/harsh/OneDrive/Desktop/COGNIVEX/backend/src/config/migration.sql)
Run these commands in your Supabase SQL Editor.

### 1. Set Up Backend Server
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   GROQ_API_KEY=your_groq_api_key
   ```
4. Run the backend development server:
   ```bash
   npm run dev
   ```

### 2. Set Up Frontend Client
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the `frontend/` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
4. Launch the Next.js development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📸 Screenshots
*(Placeholders)*

| Dashboard View | Exam Prep Hub | Placement Roadmap |
| :---: | :---: | :---: |
| ![Dashboard Mockup](https://via.placeholder.com/600x400?text=Dashboard+View) | ![Exam Prep Mockup](https://via.placeholder.com/600x400?text=Exam+Prep+View) | ![Roadmap Mockup](https://via.placeholder.com/600x400?text=Placement+Roadmap+View) |
