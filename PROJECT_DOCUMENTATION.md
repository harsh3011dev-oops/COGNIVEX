# COGNIVEX — Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Features](#features)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Setup & Deployment](#setup--deployment)
8. [File Structure](#file-structure)
9. [Core Services](#core-services)
10. [Authentication Flow](#authentication-flow)
11. [ML Profiling System](#ml-profiling-system)
12. [Deployment Status](#deployment-status)

---

## Project Overview

**Cognivex** is an adaptive learning platform designed for Computer Science and Information Technology engineering students. It provides a structured environment to master core subjects for semester exams, track placement readiness roadmap checklists, and practice questions with adaptive, context-aware AI feedback.

### Key Statistics
- **Frontend Framework**: Next.js 16 with React 19
- **Backend Framework**: Express.js 5.2
- **Database**: Supabase PostgreSQL
- **AI Engine**: Groq API (Llama 3.3-70b-versatile)
- **Authentication**: Firebase + Supabase
- **Deployment**: Render (Backend) + Vercel (Frontend) + Supabase (Database)

---

## Tech Stack

### Frontend
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Next.js | 16.2.2 |
| UI Library | React | 19.2.4 |
| Language | TypeScript | 5.x |
| Styling | TailwindCSS | v4 |
| Animations | Framer Motion | 12.38.0 |
| Icons | Lucide React | 1.7.0 |
| Authentication | Firebase | 12.14.0 |
| Utilities | clsx, tailwind-merge | Latest |

### Backend
| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | Latest |
| Framework | Express.js | 5.2.1 |
| Database Client | @supabase/supabase-js | 2.103.3 |
| SSR Support | @supabase/ssr | 0.10.2 |
| Auth | firebase-admin | 13.10.0 |
| File Upload | multer | 2.1.1 |
| PDF Processing | pdf-parse | 2.4.5 |
| CORS | cors | 2.8.6 |
| Environment | dotenv | 17.4.2 |
| HTTP | node-fetch | 3.3.2 |

---

## Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Vercel)                         │
│                    Next.js 16 + React 19                         │
│  (Login, Dashboard, Exam Prep, Practice, AI Mentor, Roadmap)   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTPS REST API Calls
                         │ (Bearer Token + user-id header)
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                   Backend (Render)                               │
│              Express.js + Node.js                                │
│  (Auth, Dashboard, Practice, AI Tutor, ML Profile, Daily Tasks) │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Supabase JS Client
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                 Supabase (PostgreSQL)                            │
│  (user_profile, test_results, topic_progress, roadmap_progress) │
└─────────────────────────────────────────────────────────────────┘

External Services:
- Firebase Auth (Authentication)
- Groq API (AI Mentor Responses)
- PDF-Parse (Document Processing)
```

### Frontend Folder Structure
```
frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Auth routes
│   │   ├── login/               # Login page
│   │   └── signup/              # Signup page
│   ├── dashboard/               # Dashboard main page
│   ├── ai-mentor/               # AI Tutor interface
│   ├── exam-prep/               # Semester exam prep hub
│   │   └── [subject]/           # Subject-specific prep
│   ├── onboarding/              # User onboarding flow
│   ├── placement/               # Placement section
│   │   ├── practice/            # Placement practice
│   │   └── roadmap/             # Roadmap checklist
│   ├── practice/                # General practice section
│   ├── roadmap/                 # Roadmap overview
│   ├── page.tsx                 # Home page
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── ai/                      # AI Mentor components
│   │   └── ChatBox.tsx
│   ├── dashboard/               # Dashboard components
│   │   ├── DailyFocus.tsx
│   │   ├── FocusCard.tsx
│   │   ├── ProgressChart.tsx
│   │   ├── StatsCard.tsx
│   │   └── WeakAreas.tsx
│   ├── layout/                  # Layout components
│   │   ├── DashboardLayout.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── onboarding/              # Onboarding components
│   │   └── OnboardingForm.tsx
│   ├── practice/                # Practice components
│   │   ├── QuestionCard.tsx
│   │   └── Timer.tsx
│   ├── roadmap/                 # Roadmap components
│   │   └── RoadmapList.tsx
│   ├── ui/                      # Generic UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── ... (other UI components)
│   ├── ProtectedRoute.tsx       # Route protection wrapper
│   └── Providers.tsx            # Context providers
├── hooks/
│   └── useMLProfile.ts          # ML profile custom hook
├── lib/
│   ├── api.ts                   # API client functions
│   ├── AuthContext.tsx          # Auth context
│   ├── firebase.ts              # Firebase configuration
│   ├── supabase.ts              # Supabase client
│   └── utils.ts                 # Utility functions
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── vercel.json
├── README.md
├── CLAUDE.md
└── AGENTS.md
```

### Backend Folder Structure
```
backend/
├── src/
│   ├── server.js                # Express server entry point
│   ├── config/
│   │   ├── db.js               # Supabase connection
│   │   ├── gemini.js           # Groq API integration
│   │   ├── firebase_auth_migration.sql
│   │   ├── migration.sql       # Database migrations
│   │   ├── ml_migration.sql
│   │   ├── question_bank_rls.sql
│   │   ├── question_bank_seed.sql
│   │   └── setup_supabase.sql
│   ├── controllers/            # Route handlers
│   │   ├── ai.controller.js
│   │   ├── authController.js
│   │   ├── dailyController.js
│   │   ├── dashboardController.js
│   │   ├── mlController.js
│   │   ├── onboardingController.js
│   │   ├── practiceController.js
│   │   ├── progressController.js
│   │   ├── questionController.js
│   │   └── quizController.js
│   ├── routes/                 # API routes
│   │   ├── ai.routes.js
│   │   ├── authRoutes.js
│   │   ├── dailyRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── mlRoutes.js
│   │   ├── onboardingRoutes.js
│   │   ├── practiceRoutes.js
│   │   ├── progressRoutes.js
│   │   └── questionRoutes.js
│   ├── services/               # Business logic
│   │   ├── ai.service.js       # AI response generation
│   │   ├── cognitive.service.js # Cognitive scoring
│   │   ├── daily.service.js    # Daily tasks
│   │   ├── ml.service.js       # ML profiling
│   │   ├── pdf.service.js      # PDF processing
│   │   └── quiz.service.js     # Quiz generation
│   ├── middleware/
│   │   ├── authMiddleware.js   # Auth verification
│   │   └── uploadMiddleware.js # File upload handling
│   ├── models/                 # Data models (if needed)
│   ├── constants/              # App constants
│   └── utils/                  # Utility functions
├── scripts/
│   ├── build-all-seed.js       # Seed builder
│   ├── generate_400.js         # Question generation
│   ├── generate_os_100.js      # OS topic questions
│   ├── generate-question-seed.js
│   ├── os_seed_100.sql         # OS questions SQL
│   ├── question-bank-data-partial.json
│   └── question-banks-compact.js
├── package.json
└── README.md
```

---

## Features

### 1. Goal-Aware Dashboard
- **Dynamic Metrics**: Tailors display based on user goals (semester exams, placements, or both)
- **Real-time Scoring**: Cognitive score, speed, accuracy, confidence tracking
- **Progress Visualization**: Subject completion percentage, roadmap completion percentage
- **Weak Area Identification**: Automatically identifies and highlights weak topics
- **Next Recommended Subject**: AI-powered subject suggestion based on progress

### 2. Semester Exam Prep Hub
- **6 Core CS Subjects**:
  - Data Structures and Algorithms (DSA)
  - Operating Systems (OS)
  - Database Management Systems (DBMS)
  - Computer Networks (CN)
  - Object-Oriented Programming (OOP)
  - Software Engineering (SE)
- **Topic Checklist**: Checkable study marks for each topic
- **High-Weightage Topics**: Prioritized by exam importance
- **Progress Tracking**: Subject-wise completion percentage
- **Practice Redirects**: Direct links to practice questions

### 3. Placement Roadmap Checklist
- **4-Phase Structure**:
  1. **DSA Basics**: Core data structures (Arrays, Linked Lists, Trees)
  2. **Advanced Topics**: Complex algorithms and patterns
  3. **Core Concepts**: CS fundamentals (OS, DBMS, CN)
  4. **Soft Skills**: Communication, aptitude, behavioral
- **Interactive Completion Meters**: Visual progress per phase
- **Tracking**: Marks items as completed/incomplete
- **Timeline Integration**: Syncs with placement target timeline

### 4. Context-Aware AI Mentor
- **Powered by Groq API** (Llama 3.3-70b-versatile)
- **User Context Awareness**:
  - Target semester level
  - Goal (exam/placement/both)
  - Weak areas from ML profiling
  - Recent test scores
  - Current progress metrics
- **Response Types**:
  - Answer questions on any CS topic
  - Quiz generation from study materials
  - Recommend learning strategies
  - Provide encouragement based on learning velocity
- **Dynamic Prompting**: Constructs context-aware prompts combining user profile + ML insights

### 5. Cognitive Scoring Engine
- **Speed Metric**: Time efficiency in solving problems (0-100)
- **Accuracy Metric**: Percentage of correct answers (0-100)
- **Confidence Metric**: Consistency across attempts (0-100)
- **Cognitive Score**: Overall mastery level (0-100)
- **Real-time Updates**: Refreshed after each quiz/test
- **Trend Analysis**: Tracks improvement over time

### 6. Document-to-Test Generator
- **PDF Upload**: Drag & drop interface for PDF notes
- **Automatic Quiz Generation**: AI creates MCQs from document
- **Custom Settings**:
  - Question count (3-10)
  - Difficulty level selection
  - Subject/topic tagging
- **Adaptive Difficulty**: Matches user's current difficulty level
- **Explanation Support**: Each question includes detailed explanation

### 7. Daily Focus Tasks
- **AI-Generated Tasks**: Custom daily study plan
- **Personalized Recommendations**: Based on weak areas
- **Focus Topics**: Prioritized subjects needing attention
- **Time Estimates**: Expected duration for each task
- **Progress Tracking**: Mark tasks as complete

---

## Database Schema

### Core Tables

#### 1. user_profile
Stores user onboarding and performance data.

```sql
CREATE TABLE user_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    goal VARCHAR(50),                      -- 'Crack Placements', 'Semester Exams', 'Both'
    semester VARCHAR(50),                  -- '3rd', '4th', '5th', '6th', etc.
    target_timeline_months INT,            -- Months until target (e.g., 6)
    placement_target VARCHAR(100),         -- 'Product company', 'Service company', etc.
    domain VARCHAR(100),                   -- Primary focus area (e.g., 'DSA')
    level VARCHAR(50),                     -- 'Beginner', 'Intermediate', 'Advanced'
    days_left INT,                         -- Days until exam/placement
    confidence INT,                        -- Confidence score 0-100
    cognitive_score INT DEFAULT 50,        -- Cognitive score 0-100
    speed INT DEFAULT 50,                  -- Speed metric 0-100
    accuracy INT DEFAULT 50,               -- Accuracy metric 0-100
    weak_areas TEXT[],                     -- Array of weak topic names
    last_score INT,                        -- Last test score
    total_tests INT DEFAULT 0,             -- Total tests taken
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. topic_progress
Tracks semester exam study progress per topic.

```sql
CREATE TABLE topic_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profile(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,        -- 'DSA', 'OS', 'DBMS', etc.
    topic VARCHAR(255) NOT NULL,          -- Specific topic
    completed BOOLEAN DEFAULT FALSE,      -- Study checklist
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, subject, topic)
);
```

#### 3. roadmap_progress
Tracks placement roadmap checklist completion.

```sql
CREATE TABLE roadmap_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profile(id) ON DELETE CASCADE,
    phase VARCHAR(255) NOT NULL,          -- 'DSA Basics', 'Advanced Topics', etc.
    item VARCHAR(255) NOT NULL,           -- Specific checklist item
    completed BOOLEAN DEFAULT FALSE,      -- Completion status
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, phase, item)
);
```

#### 4. test_results
Stores quiz/test submissions and scores.

```sql
CREATE TABLE test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profile(id) ON DELETE CASCADE,
    topic VARCHAR(255),                   -- Topic tested (nullable for full tests)
    subject VARCHAR(255),                 -- Subject tested
    score INT NOT NULL,                   -- Score out of 100
    time_taken INT,                       -- Time in seconds
    questions_attempted INT,
    questions_correct INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. question_bank
Preloaded database of CS questions for practice.

```sql
CREATE TABLE question_bank (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject VARCHAR(100) NOT NULL,        -- 'DSA', 'OS', etc.
    topic VARCHAR(255) NOT NULL,
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer VARCHAR(1) NOT NULL,   -- 'a', 'b', 'c', 'd'
    explanation TEXT,
    difficulty VARCHAR(20),               -- 'Easy', 'Medium', 'Hard'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 6. daily_tasks
AI-generated daily study recommendations.

```sql
CREATE TABLE daily_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profile(id) ON DELETE CASCADE,
    task_date DATE DEFAULT CURRENT_DATE,
    tasks JSONB NOT NULL,                 -- Array of task objects
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, task_date)
);
```

---

## API Endpoints

### Authentication Routes (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------| 
| POST | `/auth/profile` | Create user profile after signup | Yes |
| POST | `/auth/login` | Firebase auth login (handled by Firebase) | No |
| POST | `/auth/logout` | Logout (client-side) | Yes |

### Onboarding Routes (`/onboarding`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------| 
| POST | `/onboarding` | Submit goals, semester, timeline data | Yes |
| GET | `/onboarding/:userId` | Fetch saved onboarding data | Yes |

### Dashboard Routes (`/dashboard`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------| 
| GET | `/dashboard` | Get user dashboard metrics | Yes |
| GET | `/dashboard/weak-areas` | Get weak topics | Yes |
| GET | `/dashboard/subject-progress` | Get subject completion % | Yes |

### Practice Routes (`/practice`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------| 
| GET | `/practice/questions` | Get questions by subject/topic | Yes |
| POST | `/practice/submit-quiz` | Submit quiz answers | Yes |
| GET | `/practice/history` | Get past quiz attempts | Yes |

### AI Tutor Routes (`/ai-tutor`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------| 
| POST | `/ai-tutor/ask` | Submit question to AI mentor | Yes |
| POST | `/ai-tutor/generate-quiz` | Generate quiz from PDF | Yes |

### Daily Routes (`/daily`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------| 
| GET | `/daily/tasks` | Get today's study tasks | Yes |
| POST | `/daily/mark-complete` | Mark task as complete | Yes |

### Progress Routes (`/progress`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------| 
| GET | `/progress` | Get overall progress metrics | Yes |
| GET | `/progress/:subject` | Get subject-specific progress | Yes |

### ML Routes (`/ml`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------| 
| GET | `/ml/:userId` | Get ML profiling data | Yes |

### Questions Routes (`/questions`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------| 
| GET | `/questions/topics` | Get all topics by subject | Yes |
| GET | `/questions/:subject` | Get questions by subject | Yes |

---

## Setup & Deployment

### Local Development Setup

#### Backend Setup
```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file in backend/ root
echo "PORT=5000" > .env
echo "SUPABASE_URL=your_supabase_project_url" >> .env
echo "SUPABASE_KEY=your_supabase_anon_key" >> .env
echo "GROQ_API_KEY=your_groq_api_key" >> .env
echo "FIREBASE_PROJECT_ID=your_firebase_project_id" >> .env
echo "FIREBASE_PRIVATE_KEY_ID=your_firebase_key_id" >> .env
echo "FIREBASE_PRIVATE_KEY=your_firebase_private_key" >> .env
echo "FIREBASE_CLIENT_EMAIL=your_firebase_client_email" >> .env
echo "FIREBASE_CLIENT_ID=your_firebase_client_id" >> .env
echo "FIREBASE_AUTH_URI=your_firebase_auth_uri" >> .env
echo "FIREBASE_TOKEN_URI=your_firebase_token_uri" >> .env

# 4. Run backend server
npm run dev
# Server runs on http://localhost:5000
```

#### Frontend Setup
```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Create .env.local file in frontend/ root
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
echo "NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key" >> .env.local
echo "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain" >> .env.local
echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id" >> .env.local
echo "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket" >> .env.local
echo "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id" >> .env.local
echo "NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id" >> .env.local

# 4. Run frontend server
npm run dev
# Frontend runs on http://localhost:3000
```

#### Database Setup
```bash
# 1. Go to Supabase Dashboard
# 2. Create new project or use existing one
# 3. Navigate to SQL Editor
# 4. Run migration scripts in order:
#    - migration.sql
#    - question_bank_seed.sql (for initial questions)
#    - question_bank_rls.sql (for row-level security)
```

### Production Deployment

#### Backend Deployment (Render)

1. **Create Render Account**: Go to [render.com](https://render.com)
2. **Connect GitHub Repository**: Link your GitHub repo
3. **Create New Web Service**:
   - Build Command: `npm install`
   - Start Command: `npm run dev` or `node src/server.js`
   - Environment Variables:
     ```
     PORT=5000
     SUPABASE_URL=your_production_supabase_url
     SUPABASE_KEY=your_production_supabase_key
     GROQ_API_KEY=your_groq_api_key
     FIREBASE_PROJECT_ID=...
     ... (all Firebase credentials)
     ```

4. **Deploy**: Render automatically deploys on Git push
5. **Get Backend URL**: Note your Render service URL (e.g., `https://cognivex-backend.onrender.com`)

#### Frontend Deployment (Vercel)

1. **Create Vercel Account**: Go to [vercel.com](https://vercel.com)
2. **Import Project**: Import your GitHub repository
3. **Configure Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://cognivex-backend.onrender.com
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   ... (all Firebase credentials)
   ```
4. **Deploy**: Vercel automatically deploys on Git push
5. **Update CORS**: In backend, add Vercel deployment URL to CORS origins

#### Database (Supabase - Already Cloud-Based)

1. **Create Supabase Project**: Go to [supabase.com](https://supabase.com)
2. **Run Migrations**: Use SQL Editor to run:
   - `backend/src/config/migration.sql`
   - `backend/src/config/question_bank_seed.sql`
3. **Configure Row-Level Security**: Run `question_bank_rls.sql`
4. **Get Credentials**:
   - Go to Settings → API
   - Copy Project URL (SUPABASE_URL)
   - Copy Anon Key (SUPABASE_KEY)

#### Update Backend Render Configuration

After frontend deployment, update backend CORS:

```javascript
// backend/src/server.js
app.use(cors({
  origin: [
    "http://localhost:3000",                    // Local dev
    "https://your-vercel-frontend.vercel.app",  // Production frontend
    /\.vercel\.app$/                            // All Vercel deployments
  ]
}));
```

---

## Core Services

### ai.service.js
**Purpose**: Generate context-aware AI mentor responses

**Key Functions**:
- `generateMentorResponse(userQuery, userProfile)`: Builds dynamic prompt with user context, fetches Groq API response
- Incorporates ML profile, weak areas, test scores, subject completion

**Flow**:
1. Collect user profile data
2. Fetch ML profile recommendations
3. Query recent test results
4. Build context-aware prompt
5. Call Groq API (Llama 3.3-70b)
6. Return response

### ml.service.js
**Purpose**: Adaptive ML profiling and recommendations

**Key Functions**:
- `generateMLProfile(userId)`: Computes weakness scores for all topics
- Calculates difficulty level based on test performance
- Recommends top weak topics needing review
- Determines learning velocity (slow/stable/fast)

**Algorithms**:
- **Weakness Score**: `(wrongAnswerRate × 0.5) + (recencyWeight × 0.3) + (incompletionPenalty × 0.2)`
- **Recency Weight**: Scores older tests lower (7+ days = 0.4x weight)
- **Difficulty Level**: Beginner (<50%), Intermediate (50-75%), Advanced (>75%)

### quiz.service.js
**Purpose**: Generate quizzes from PDF documents using AI

**Key Functions**:
- `generateQuizFromPDF(fileBuffer, userProfile, questionCount)`: Extracts PDF text, generates structured quiz
- Validates question count (3-10 range)
- Creates MCQs with correct answer indices and explanations

**Flow**:
1. Parse uploaded PDF
2. Extract text content
3. Build quiz generation prompt
4. Call Groq API with document content
5. Parse and validate structured quiz
6. Return MCQ questions with explanations

### daily.service.js
**Purpose**: Generate personalized daily study tasks

**Key Functions**:
- `getOrGenerateDailyTasks(userId)`: Fetches cached tasks or generates new ones
- `generateNewDailyTasks(userProfile, mlProfile)`: Creates 4-5 personalized tasks

**Task Generation**:
- Prioritizes weak areas from ML profile
- Suggests practice tests on low-scoring topics
- Recommends review of incomplete topics
- Provides time estimates

### cognitive.service.js
**Purpose**: Calculate cognitive metrics from test results

**Key Functions**:
- `calculateCognitiveScore(testResults)`: Average of recent scores
- `calculateSpeed(testResults)`: Time efficiency metric
- `calculateAccuracy(testResults)`: Correct answer percentage
- `updateCognitiveMetrics(userId, testResults)`: Update user_profile

---

## Authentication Flow

### Signup Flow
```
User fills signup form
↓
Firebase Auth creates user (Email + Password / Google)
↓
Firebase returns ID Token and UID
↓
Frontend calls POST /auth/profile with email, name
↓
Backend verifies Firebase ID Token
↓
Backend creates user_profile in Supabase
↓
Redirect to Onboarding
```

### Login Flow
```
User fills login form
↓
Firebase Auth authenticates user
↓
Firebase returns ID Token
↓
Frontend stores token in localStorage
↓
Frontend redirects to Dashboard
↓
All API calls include Authorization: Bearer <idToken>
```

### API Request Authentication
```
Frontend Request:
- Headers:
  - Authorization: Bearer <Firebase ID Token>
  - user-id: <Firebase UID>
  - Content-Type: application/json

Backend Middleware (authMiddleware.js):
- Verifies Firebase ID Token
- Extracts user UID
- Attaches user to req.user
- Routes proceed with authentication

Protected Routes:
- /onboarding (POST)
- /dashboard (GET)
- /practice/* (all)
- /ai-tutor/* (all)
- /daily/* (all)
- /progress/* (all)
- /ml/* (all)
- /questions/* (all)
```

---

## ML Profiling System

### Profiling Algorithm

The ML system computes personalized recommendations by analyzing user performance across 5 dimensions:

#### 1. Topic Weakness Scoring

For each topic, calculate:
```
weaknessScore = (wrongAnswerRate × 0.5) 
              + (recencyWeight × 0.3) 
              + (incompletionPenalty × 0.2)

wrongAnswerRate = (questions_wrong / questions_attempted)
recencyWeight = {
  1.0 if tested in last 7 days,
  0.7 if tested 7-30 days ago,
  0.4 if tested >30 days ago,
  0.9 if never tested
}
incompletionPenalty = 0.2 if topic marked incomplete, else 0
```

#### 2. Difficulty Level Calculation

```
overallAccuracy = (total_correct / total_attempted)

if overallAccuracy < 50%:
  difficulty_level = "beginner"
else if overallAccuracy < 75%:
  difficulty_level = "intermediate"
else:
  difficulty_level = "advanced"
```

#### 3. Learning Velocity Determination

```
recentTests = last 10 tests (exclude full-subject tests)
if recentTests.length < 3:
  learning_velocity = "stable"  // Not enough data

avgRecentScore = average(recentTests[0:3].score)
avgOldScore = average(recentTests[3:6].score)
velocityTrend = avgRecentScore - avgOldScore

if velocityTrend > 10:
  learning_velocity = "fast"    // Improving
else if velocityTrend < -10:
  learning_velocity = "slow"    // Declining
else:
  learning_velocity = "stable"  // Consistent
```

#### 4. Subject Strength Analysis

```
for each subject:
  subject_accuracy = (correct_in_subject / attempts_in_subject)
  
strongest_subject = subject with highest accuracy
weakest_subject = subject with lowest accuracy
```

#### 5. Recommended Topics

```
weakTopics = []
for each topic:
  if weaknessScore >= 60:
    weakTopics.append({
      topic: topicName,
      subject: subjectName,
      priority: priorityFromScore(weaknessScore)
    })

return sorted(weakTopics, by: -weaknessScore)[0:3]
```

### ML Profile Usage

The ML profile is integrated into:
- **AI Mentor**: Adjust explanations to user's difficulty level
- **Quiz Generation**: Match question difficulty to user's level
- **Daily Tasks**: Prioritize weak areas for daily recommendations
- **Dashboard**: Show recommended topics and next focus area

---

## Deployment Status

### Current Deployment Configuration

#### Frontend (Vercel)
- **Status**: Ready for deployment
- **URL**: `https://cognivex-jvjeo2592-harsh3011dev-oops-projects.vercel.app` (current preview)
- **Environment**: Production Next.js
- **Auto-deploy**: On Git push to main branch

#### Backend (Render)
- **Status**: ✅ Deployed and running
- **URL**: Render service URL (e.g., `https://cognivex-backend.onrender.com`)
- **Environment**: Node.js Express.js
- **Auto-deploy**: On Git push to main branch

#### Database (Supabase)
- **Status**: ✅ Cloud-hosted PostgreSQL
- **URL**: Supabase project dashboard
- **Configuration**: 
  - Region: [Your region]
  - Backups: Automatic daily
  - SSL: Enabled

### CORS Configuration

Backend CORS settings for deployed apps:
```javascript
app.use(cors({
  origin: [
    "http://localhost:3000",                    // Local dev
    "https://cognivex-jvjeo2592-harsh3011dev-oops-projects.vercel.app",
    /\.vercel\.app$/
  ]
}));
```

### Environment Variables Checklist

**Backend (Render) Required**:
- [ ] PORT=5000
- [ ] SUPABASE_URL
- [ ] SUPABASE_KEY
- [ ] GROQ_API_KEY
- [ ] FIREBASE_PROJECT_ID
- [ ] FIREBASE_PRIVATE_KEY
- [ ] FIREBASE_CLIENT_EMAIL
- [ ] FIREBASE_AUTH_URI
- [ ] FIREBASE_TOKEN_URI

**Frontend (Vercel) Required**:
- [ ] NEXT_PUBLIC_API_URL=`<Render backend URL>`
- [ ] NEXT_PUBLIC_FIREBASE_API_KEY
- [ ] NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- [ ] NEXT_PUBLIC_FIREBASE_PROJECT_ID
- [ ] NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- [ ] NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- [ ] NEXT_PUBLIC_FIREBASE_APP_ID

---

## Testing Deployment

### 1. Backend Health Check
```bash
curl https://your-render-backend-url/
# Expected: "Cognivex Backend Running"
```

### 2. Test Auth Endpoint
```bash
curl -X POST https://your-render-backend-url/auth/profile \
  -H "Authorization: Bearer <Firebase_ID_Token>" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'
```

### 3. Test Dashboard Endpoint
```bash
curl https://your-render-backend-url/dashboard \
  -H "Authorization: Bearer <Firebase_ID_Token>"
```

### 4. Test Frontend
- Visit `https://your-vercel-frontend.vercel.app`
- Try signup/login
- Verify dashboard loads
- Check API calls in browser DevTools

---

## Troubleshooting

### Common Issues & Solutions

#### 1. CORS Errors
**Error**: `Access to XMLHttpRequest blocked by CORS policy`
- **Solution**: Add frontend URL to backend CORS origins (server.js)
- **Location**: `backend/src/server.js` line ~24

#### 2. Firebase Auth Errors
**Error**: `Firebase is not initialized`
- **Solution**: Verify `.env.local` has all Firebase config
- **Location**: Check `frontend/lib/firebase.ts`

#### 3. Database Connection Errors
**Error**: `connect ECONNREFUSED` from Supabase
- **Solution**: Verify SUPABASE_URL and SUPABASE_KEY in .env
- **Location**: `backend/src/config/db.js`

#### 4. AI Mentor Not Responding
**Error**: `Unable to compute recommendations` fallback message
- **Solution**: Check GROQ_API_KEY is valid in backend .env
- **Location**: `backend/src/config/gemini.js`

#### 5. PDF Upload Fails
**Error**: `Failed to process PDF`
- **Solution**: Ensure multer is configured and file size limits allow
- **Location**: `backend/src/middleware/uploadMiddleware.js`

---

## Contributing & Maintenance

### Code Organization Principles
- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic (AI, ML, calculations)
- **Middleware**: Process requests before controllers
- **Routes**: Define endpoint paths
- **Config**: Manage external service connections

### Adding New Features

1. **Create Route** → `backend/src/routes/newRoutes.js`
2. **Create Controller** → `backend/src/controllers/newController.js`
3. **Create Service** (if needed) → `backend/src/services/newService.js`
4. **Add to server.js** → Mount new route with auth middleware
5. **Frontend Component** → Create in `frontend/app/` or `frontend/components/`
6. **API Client** → Add function to `frontend/lib/api.ts`

### Database Migrations
1. Create SQL script in `backend/src/config/`
2. Test locally in Supabase SQL Editor
3. Run on production via Supabase Dashboard
4. Update `migration.sql` for documentation

---

## Performance Optimization

### Caching Strategy
- **ML Profile**: Cached for 5 minutes (mlController.js)
- **Daily Tasks**: Cached for 24 hours (daily.service.js)
- **Frontend**: Leverage Next.js ISR and Image Optimization

### Database Indexes
- Add indexes on frequently queried columns:
  ```sql
  CREATE INDEX idx_user_profile_email ON user_profile(email);
  CREATE INDEX idx_test_results_user_date ON test_results(user_id, created_at);
  CREATE INDEX idx_topic_progress_user ON topic_progress(user_id);
  ```

### API Response Optimization
- Return only needed fields (avoid SELECT *)
- Paginate large result sets
- Gzip compress responses (Express handles by default)

---

## Security Best Practices

1. **Never commit .env files** → Add to .gitignore
2. **Firebase Security Rules** → Configure in Firebase Console
3. **Row-Level Security (RLS)** → Enabled in Supabase for user data
4. **HTTPS Only** → All external APIs use HTTPS
5. **API Rate Limiting** → Consider adding express-rate-limit for production
6. **Input Validation** → Validate user input before DB queries
7. **SQL Injection Prevention** → Use parameterized queries (Supabase client does this)

---

## Contact & Support

- **GitHub Repository**: [Link to your repo]
- **Project Lead**: [Your name]
- **Bug Reports**: Create GitHub issues

---

**Last Updated**: 2026-06-28
**Version**: 1.0.0
**Status**: Production Deployment Ready
