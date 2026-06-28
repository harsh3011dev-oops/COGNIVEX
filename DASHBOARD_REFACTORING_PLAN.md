# Dashboard Refactoring Implementation Plan
**Status**: Ready for Implementation  
**Date**: 2026-06-28  
**Scope**: Remove hardcoded dashboard data and make it fully dynamic

---

## 1. CURRENT STATE ANALYSIS

### Hardcoded Data (Frontend)
**Location**: `frontend/app/dashboard/page.tsx` (lines 62-80)
```javascript
// Fallback hardcoded values
setDashboardData({
  score: 72,
  speed: 84,
  accuracy: 68,
  confidence: 92,
  weak_areas: [],
  current_focus: "DSA 60-Day Plan",
  semester: "5th",
  goal: "Both",
  subject_completion_pct: 35,
  roadmap_completion_pct: 25,
  next_recommended_subject: "Operating Systems",
  streak: 3
});
```

### Current API Response
**Endpoint**: `GET /dashboard`  
**Source**: `backend/src/controllers/dashboardController.js`

**Current Response**:
```json
{
  "score": 50,
  "speed": 50,
  "accuracy": 50,
  "confidence": 50,
  "weak_areas": [],
  "current_focus": "Exam/Placement Prep - X Days Left",
  "semester": "5th",
  "goal": "Both",
  "subject_completion_pct": 0-100,
  "roadmap_completion_pct": 0-100,
  "next_recommended_subject": "DSA",
  "last_test_score": 80,
  "total_tests": 3
}
```

**Problems**:
1. ❌ No breakdown of questions attempted by subject
2. ❌ No accurate overall accuracy % from test results
3. ❌ No list of recent tests
4. ❌ No weekly activity data
5. ❌ No subject-wise accuracy breakdown

---

## 2. DATA SOURCES & DATABASE QUERIES

### Data Source Tables

#### A. test_results
```sql
Columns:
- id (UUID)
- user_id (UUID) - FK to user_profile
- topic (VARCHAR) - nullable for full tests
- subject (VARCHAR) - DSA, OS, DBMS, CN, OOP, SE
- score (INT) - 0-100
- time_taken (INT) - seconds
- questions_attempted (INT)
- questions_correct (INT)
- created_at (TIMESTAMP)
```

#### B. user_profile
```sql
Columns:
- id (UUID)
- cognitive_score (INT) - 0-100
- accuracy (INT) - 0-100
- speed (INT) - 0-100
- confidence (INT) - 0-100
- total_tests (INT)
- weak_areas (TEXT[])
- semester, goal, placement_target, etc.
```

#### C. topic_progress
```sql
Columns:
- user_id (UUID)
- subject (VARCHAR)
- topic (VARCHAR)
- completed (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

#### D. roadmap_progress
```sql
Columns:
- user_id (UUID)
- phase (VARCHAR)
- item (VARCHAR)
- completed (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

### Required Database Queries

#### Query 1: Total Questions Attempted
```sql
SELECT COALESCE(SUM(questions_attempted), 0) as total_questions_attempted
FROM test_results
WHERE user_id = $1
```

#### Query 2: Overall Accuracy %
```sql
SELECT ROUND(AVG(accuracy), 2) as overall_accuracy_percent
FROM test_results
WHERE user_id = $1
```

#### Query 3: Subject-wise Accuracy
```sql
SELECT 
  subject,
  COUNT(*) as tests_attempted,
  ROUND(AVG(accuracy), 2) as subject_accuracy_percent
FROM test_results
WHERE user_id = $1 AND subject IS NOT NULL
GROUP BY subject
ORDER BY subject_accuracy_percent DESC
```

#### Query 4: Recent Tests (Last 10)
```sql
SELECT 
  subject,
  score,
  questions_correct,
  questions_attempted,
  ROUND((questions_correct::float / questions_attempted) * 100, 2) as accuracy,
  created_at
FROM test_results
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT 10
```

#### Query 5: Weekly Activity (Last 7 Days)
```sql
SELECT 
  DATE(created_at) as date,
  COUNT(*) as quizzes_attempted,
  ROUND(AVG(accuracy), 2) as avg_accuracy
FROM test_results
WHERE user_id = $1 
  AND created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC
```

#### Query 6: Topics Completed Count
```sql
SELECT COUNT(*) as topics_completed
FROM topic_progress
WHERE user_id = $1 AND completed = true
```

---

## 3. IMPLEMENTATION PLAN

### Phase 1: Backend Enhancement

#### File: `backend/src/controllers/dashboardController.js`

**Current**: Fetches only from user_profile, topic_progress, roadmap_progress

**Changes**:
1. Extend `getDashboardData` to include test_results aggregations
2. Add new fields to response:
   - `total_questions_attempted` - from Query 1
   - `overall_accuracy_percent` - from Query 2
   - `subject_accuracy_breakdown` - array from Query 3
   - `recent_tests` - array from Query 4
   - `weekly_activity` - array from Query 5
   - `topics_completed_count` - from Query 6

**Response Structure**:
```javascript
{
  // Existing fields
  score: 72,
  speed: 84,
  accuracy: 68,
  confidence: 92,
  weak_areas: [],
  current_focus: "DSA 60-Day Plan",
  semester: "5th",
  goal: "Both",
  subject_completion_pct: 35,
  roadmap_completion_pct: 25,
  next_recommended_subject: "Operating Systems",
  last_test_score: 80,
  total_tests: 3,
  
  // NEW fields
  total_questions_attempted: 145,
  overall_accuracy_percent: 82.5,
  topics_completed_count: 12,
  
  subject_accuracy_breakdown: [
    { subject: "DSA", accuracy: 85, tests_attempted: 5 },
    { subject: "OS", accuracy: 78, tests_attempted: 3 },
    { subject: "DBMS", accuracy: 88, tests_attempted: 2 }
  ],
  
  recent_tests: [
    {
      subject: "DSA",
      score: 85,
      questions_correct: 17,
      questions_attempted: 20,
      accuracy: 85,
      created_at: "2026-06-28T10:30:00Z"
    }
  ],
  
  weekly_activity: [
    {
      date: "2026-06-28",
      quizzes_attempted: 3,
      avg_accuracy: 82.5
    },
    {
      date: "2026-06-27",
      quizzes_attempted: 2,
      avg_accuracy: 79.0
    }
  ]
}
```

### Phase 2: Frontend Type Definitions

#### File: `frontend/lib/api.ts`

**Changes**:
1. Extend TypeScript interface for dashboard response
2. Update function signature if needed

**New Interface**:
```typescript
export interface DashboardData {
  // Existing
  score: number;
  speed: number;
  accuracy: number;
  confidence: number;
  weak_areas: string[];
  // ... other fields
  
  // NEW
  total_questions_attempted: number;
  overall_accuracy_percent: number;
  topics_completed_count: number;
  
  subject_accuracy_breakdown: SubjectAccuracy[];
  recent_tests: RecentTest[];
  weekly_activity: WeeklyActivity[];
}

export interface SubjectAccuracy {
  subject: string;
  accuracy: number;
  tests_attempted: number;
}

export interface RecentTest {
  subject: string;
  score: number;
  questions_correct: number;
  questions_attempted: number;
  accuracy: number;
  created_at: string;
}

export interface WeeklyActivity {
  date: string;
  quizzes_attempted: number;
  avg_accuracy: number;
}
```

### Phase 3: Frontend Dashboard Page

#### File: `frontend/app/dashboard/page.tsx`

**Changes**:
1. Add new state for new dashboard data
2. Display new metric cards:
   - Questions Attempted
   - Overall Accuracy %
   - Topics Completed
3. Display Subject Accuracy breakdown
4. Display Recent Tests section
5. Keep existing components but update data sources

**New Grid Layout**:
```
Row 1: [Stats Card] [Target Progress] [Today's Focus]
Row 2: [Targeted Revision] [Weekly Improvement]
Row 3: [Subject Accuracy] [Recent Tests]  // NEW
```

### Phase 4: Frontend Components

#### Update: `frontend/components/dashboard/ProgressChart.tsx`
- Replace hardcoded data with real weekly_activity data from API
- Show quizzes_attempted per day
- Show avg_accuracy trend

#### Possible New: Subject Accuracy Card Component
- Show all subjects with their accuracy percentages
- Bar chart or list format
- Color code: Green (>80%), Amber (60-80%), Red (<60%)

#### Possible New: Recent Tests Component
- Show last 5-10 tests with subject, score, accuracy
- Format: "DSA Quiz - 17/20 (85%)"
- Link to retake or review

---

## 4. FILES TO MODIFY

### Backend (3 files)
1. ✅ `backend/src/controllers/dashboardController.js` - **MODIFY**
   - Extend getDashboardData function
   - Add 6 new database queries
   - Build new response structure

2. ⚠️ `backend/src/config/db.js` - **CHECK ONLY**
   - Verify Supabase client is properly exported
   - No changes needed likely

3. ⚠️ `backend/src/server.js` - **CHECK ONLY**
   - Verify dashboard route is properly mounted
   - No changes needed likely

### Frontend (5 files)
1. ✅ `frontend/lib/api.ts` - **MODIFY**
   - Add new TypeScript interfaces
   - Update getDashboard() function signature (optional)

2. ✅ `frontend/app/dashboard/page.tsx` - **MODIFY**
   - Add new metric cards/sections
   - Update to display new data fields
   - Add loading states for new sections

3. ✅ `frontend/components/dashboard/ProgressChart.tsx` - **MODIFY**
   - Update to use real weekly_activity data
   - Replace hardcoded array

4. ❓ `frontend/components/dashboard/SubjectAccuracy.tsx` - **CREATE NEW (optional)**
   - Display subject accuracy breakdown
   - Only if new component is needed (can use Card component)

5. ❓ `frontend/components/dashboard/RecentTests.tsx` - **CREATE NEW (optional)**
   - Display recent tests list
   - Only if new component is needed (can use Card component)

---

## 5. API RESPONSE SHAPE

### Current Response
```json
{
  "score": 50,
  "speed": 50,
  "accuracy": 50,
  "confidence": 50,
  "weak_areas": [],
  "current_focus": "Exam Prep - 60 Days Left",
  "last_test_score": 80,
  "total_tests": 3,
  "semester": "5th",
  "goal": "Both",
  "target_timeline_months": 6,
  "placement_target": "Product company",
  "subject_completion_pct": 0,
  "roadmap_completion_pct": 0,
  "next_recommended_subject": "Data Structures & Algorithms"
}
```

### Extended Response (NEW)
```json
{
  "score": 72,
  "speed": 84,
  "accuracy": 82,
  "confidence": 92,
  "weak_areas": ["Graphs", "Dynamic Programming"],
  "current_focus": "Exam Prep - 60 Days Left",
  "last_test_score": 85,
  "total_tests": 12,
  "semester": "5th",
  "goal": "Both",
  "target_timeline_months": 6,
  "placement_target": "Product company",
  "subject_completion_pct": 65,
  "roadmap_completion_pct": 40,
  "next_recommended_subject": "Operating Systems",
  
  "total_questions_attempted": 245,
  "overall_accuracy_percent": 82.3,
  "topics_completed_count": 18,
  
  "subject_accuracy_breakdown": [
    {
      "subject": "DSA",
      "accuracy": 85.5,
      "tests_attempted": 8
    },
    {
      "subject": "OS",
      "accuracy": 78.2,
      "tests_attempted": 5
    },
    {
      "subject": "DBMS",
      "accuracy": 88.0,
      "tests_attempted": 3
    },
    {
      "subject": "CN",
      "accuracy": 75.0,
      "tests_attempted": 2
    }
  ],
  
  "recent_tests": [
    {
      "subject": "DSA",
      "score": 85,
      "questions_correct": 17,
      "questions_attempted": 20,
      "accuracy": 85,
      "created_at": "2026-06-28T14:30:00Z"
    },
    {
      "subject": "OS",
      "score": 72,
      "questions_correct": 14,
      "questions_attempted": 20,
      "accuracy": 70,
      "created_at": "2026-06-28T10:15:00Z"
    },
    {
      "subject": "DBMS",
      "score": 92,
      "questions_correct": 23,
      "questions_attempted": 25,
      "accuracy": 92,
      "created_at": "2026-06-27T16:45:00Z"
    }
  ],
  
  "weekly_activity": [
    {
      "date": "2026-06-28",
      "quizzes_attempted": 3,
      "avg_accuracy": 82.3
    },
    {
      "date": "2026-06-27",
      "quizzes_attempted": 2,
      "avg_accuracy": 81.5
    },
    {
      "date": "2026-06-26",
      "quizzes_attempted": 1,
      "avg_accuracy": 75.0
    },
    {
      "date": "2026-06-25",
      "quizzes_attempted": 3,
      "avg_accuracy": 84.7
    },
    {
      "date": "2026-06-24",
      "quizzes_attempted": 0,
      "avg_accuracy": 0
    },
    {
      "date": "2026-06-23",
      "quizzes_attempted": 2,
      "avg_accuracy": 79.5
    },
    {
      "date": "2026-06-22",
      "quizzes_attempted": 1,
      "avg_accuracy": 88.0
    }
  ]
}
```

---

## 6. DATABASE QUERIES - DETAILED

### Implementation Location
`backend/src/controllers/dashboardController.js` → `getDashboardData` function

### Query Execution Order (Optimized)
1. Fetch user_profile (already done)
2. Fetch topic_progress count (already done)
3. Fetch roadmap_progress count (already done)
4. **NEW**: Execute test_results queries (4 parallel queries recommended):
   - Total questions attempted
   - Overall accuracy %
   - Subject accuracy breakdown
   - Recent tests

### Supabase Query Examples (JavaScript)

```javascript
// Query 1: Total Questions Attempted
const { data: questionsData } = await db
  .from('test_results')
  .select('questions_attempted')
  .eq('user_id', userId);

const total_questions_attempted = (questionsData || [])
  .reduce((sum, row) => sum + (row.questions_attempted || 0), 0);

// Query 2: Overall Accuracy
const { data: accuracyData } = await db
  .from('test_results')
  .select('accuracy')
  .eq('user_id', userId);

const accuracies = (accuracyData || []).map(r => r.accuracy);
const overall_accuracy_percent = accuracies.length > 0
  ? Math.round((accuracies.reduce((a, b) => a + b) / accuracies.length) * 100) / 100
  : 0;

// Query 3: Subject Accuracy Breakdown
const { data: subjectData } = await db
  .from('test_results')
  .select('subject, accuracy')
  .eq('user_id', userId)
  .not('subject', 'is', null);

const subjectAccuracy = {};
(subjectData || []).forEach(row => {
  if (!subjectAccuracy[row.subject]) {
    subjectAccuracy[row.subject] = { accuracies: [], count: 0 };
  }
  subjectAccuracy[row.subject].accuracies.push(row.accuracy);
  subjectAccuracy[row.subject].count += 1;
});

const subject_accuracy_breakdown = Object.entries(subjectAccuracy)
  .map(([subject, data]) => ({
    subject,
    accuracy: Math.round((data.accuracies.reduce((a, b) => a + b) / data.accuracies.length) * 100) / 100,
    tests_attempted: data.count
  }))
  .sort((a, b) => b.accuracy - a.accuracy);

// Query 4: Recent Tests (Last 10)
const { data: recentTests } = await db
  .from('test_results')
  .select('subject, score, questions_correct, questions_attempted, accuracy, created_at')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(10);

// Query 5: Weekly Activity (Last 7 Days)
const { data: weeklyData } = await db
  .from('test_results')
  .select('created_at, accuracy')
  .eq('user_id', userId)
  .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

const weeklyActivity = {};
const today = new Date();
for (let i = 0; i < 7; i++) {
  const date = new Date(today);
  date.setDate(date.getDate() - i);
  const dateStr = date.toISOString().split('T')[0];
  weeklyActivity[dateStr] = { quizzes_attempted: 0, total_accuracy: 0, count: 0 };
}

(weeklyData || []).forEach(row => {
  const date = row.created_at.split('T')[0];
  if (weeklyActivity[date]) {
    weeklyActivity[date].quizzes_attempted += 1;
    weeklyActivity[date].total_accuracy += row.accuracy;
    weeklyActivity[date].count += 1;
  }
});

const weekly_activity = Object.entries(weeklyActivity)
  .reverse()
  .map(([date, data]) => ({
    date,
    quizzes_attempted: data.quizzes_attempted,
    avg_accuracy: data.count > 0 
      ? Math.round((data.total_accuracy / data.count) * 100) / 100
      : 0
  }));

// Query 6: Topics Completed Count
const { data: topicData } = await db
  .from('topic_progress')
  .select('id')
  .eq('user_id', userId)
  .eq('completed', true);

const topics_completed_count = (topicData || []).length;
```

---

## 7. IMPLEMENTATION CHECKLIST

### Backend Implementation
- [ ] Read existing dashboardController.js
- [ ] Add test_results queries
- [ ] Add data aggregation logic
- [ ] Build extended response object
- [ ] Add error handling for each query
- [ ] Test queries locally

### Frontend TypeScript
- [ ] Update api.ts with new interfaces
- [ ] Verify type compatibility

### Frontend Components
- [ ] Update dashboard page layout
- [ ] Add new metric cards (4 cards)
- [ ] Add Subject Accuracy section
- [ ] Add Recent Tests section
- [ ] Update ProgressChart for weekly activity
- [ ] Add loading states
- [ ] Add error handling

### Testing
- [ ] Verify API response structure
- [ ] Check all new fields populate
- [ ] Verify no hardcoded values remain
- [ ] Test with real database data
- [ ] Test error fallbacks
- [ ] Test loading states

---

## 8. ASSUMPTIONS & CONSTRAINTS

### Assumptions
1. ✅ `test_results` table already exists with required columns
2. ✅ `accuracy` column exists in test_results (confirmed from practiceController.js)
3. ✅ `questions_attempted` and `questions_correct` are stored (confirmed)
4. ✅ `created_at` is properly timestamped (confirmed)
5. ✅ Firebase auth middleware provides `req.user.uid` (confirmed)
6. ⚠️ Assume all test_results have a subject (some might be null for full tests)

### Constraints
- Do NOT modify quiz submission logic
- Do NOT modify authentication flow
- Do NOT break existing functionality
- Do NOT change database schema
- Use existing Supabase client from db.js
- Maintain error handling patterns

---

## 9. ROLLBACK PLAN

If issues occur:
1. Revert dashboardController.js to original version
2. Revert api.ts types (remove new interfaces)
3. Revert dashboard page.tsx (comment out new sections)
4. Frontend will gracefully fall back to existing fields
5. Hardcoded fallback in frontend is still present as safety net

---

## 10. TESTING STEPS

### Manual Testing Checklist
```bash
# 1. Local Setup
cd backend
npm run dev  # Should work without errors

cd frontend
npm run dev  # Should work without errors

# 2. API Testing
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/dashboard

# Response should include:
# - total_questions_attempted
# - overall_accuracy_percent
# - topics_completed_count
# - subject_accuracy_breakdown (array)
# - recent_tests (array)
# - weekly_activity (array)

# 3. Frontend Testing
- Visit http://localhost:3000/dashboard
- Verify new metric cards display
- Verify data is not hardcoded
- Check browser console for errors
- Test with multiple users
- Test with user who has 0 tests

# 4. Edge Cases
- User with no test_results
- User with only 1 test
- User with tests from 30+ days ago
- User with multiple subjects

# 5. Database Verification
SELECT COUNT(*) FROM test_results WHERE user_id = '<userId>';
# Should return actual count, verify it matches dashboard "Total Tests"
```

---

## 11. EXPECTED OUTCOMES

After implementation:
- ✅ Dashboard shows real data from test_results table
- ✅ No hardcoded values
- ✅ Subject-wise accuracy visible
- ✅ Recent test history displayed
- ✅ Weekly activity chart shows real data
- ✅ All metrics calculated dynamically
- ✅ Error handling for missing data
- ✅ Loading states for data fetch
- ✅ Graceful fallbacks if data unavailable

---

## SUMMARY TABLE

| Component | File | Change Type | Complexity | Est. Time |
|-----------|------|-------------|-----------|-----------|
| Backend Controller | dashboardController.js | MODIFY | Medium | 30 min |
| API Types | api.ts | MODIFY | Low | 10 min |
| Dashboard Page | dashboard/page.tsx | MODIFY | Medium | 45 min |
| ProgressChart | ProgressChart.tsx | MODIFY | Low | 15 min |
| New Subject Card | (optional) | CREATE | Low | 20 min |
| New Tests Card | (optional) | CREATE | Low | 20 min |

**Total Estimated Time**: 2-3 hours

---

**Next Step**: Await approval to proceed with implementation.
