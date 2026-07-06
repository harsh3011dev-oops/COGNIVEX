import type { User } from "firebase/auth";
import { auth } from "./firebase";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export { BASE_URL };

if (typeof window !== "undefined" && !process.env.NEXT_PUBLIC_API_URL) {
  console.warn("NEXT_PUBLIC_API_URL is not set. API calls will target localhost.");
}

async function getAuthHeaders(user?: User | null): Promise<HeadersInit> {
  const authUser = user ?? auth.currentUser;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (!authUser) {
    return headers;
  }

  headers["user-id"] = authUser.uid;

  try {
    const token = await authUser.getIdToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn("Failed to get Firebase ID token, using user-id fallback:", error);
  }

  return headers;
}

export async function createUserProfile(
  data: { name: string; email: string },
  user?: User | null
): Promise<{ isNewUser: boolean }> {
  const authUser = user ?? auth.currentUser;

  const response = await fetch(`${BASE_URL}/auth/profile`, {
    method: "POST",
    headers: await getAuthHeaders(authUser),
    body: JSON.stringify({
      ...data,
      userId: authUser?.uid,
    }),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error || "Failed to create user profile");
  }

  const isNewUser = response.status === 201;
  return { isNewUser };
}

export async function submitOnboarding(data: { 
  goal: string, 
  days_left?: number, 
  domain: string, 
  level: string, 
  confidence: number,
  semester?: string,
  target_timeline_months?: number,
  placement_target?: string
}) {
  const response = await fetch(`${BASE_URL}/onboarding`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to submit onboarding data');
  }

  return response.json();
}

export async function getDashboard(): Promise<DashboardData> {
  const response = await fetch(`${BASE_URL}/dashboard`, {
    method: 'GET',
    headers: await getAuthHeaders(),
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }

  return response.json();
}

export async function askAI(query: string) {
  const response = await fetch(`${BASE_URL}/ai-tutor`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ query }),
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      response: data?.fallback || 'AI Mentor is temporarily unavailable. Please try again later.',
    };
  }

  return data;
}

export async function getDailyFocus() {
  const response = await fetch(`${BASE_URL}/daily/today-focus`, {
    method: 'GET',
    headers: await getAuthHeaders(),
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch daily focus');
  }

  return response.json();
}

export async function completeDailyTask(taskText: string) {
  const response = await fetch(`${BASE_URL}/daily/complete-task`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ taskText }),
  });

  if (!response.ok) {
    throw new Error('Failed to complete task');
  }

  return response.json();
}

export async function getTopicProgress() {
  const response = await fetch(`${BASE_URL}/progress/topics`, {
    method: 'GET',
    headers: await getAuthHeaders(),
    cache: 'no-store'
  });
  if (!response.ok) {
    throw new Error('Failed to fetch topic progress');
  }
  return response.json();
}

export async function saveTopicProgress(subject: string, topic: string, completed: boolean) {
  const response = await fetch(`${BASE_URL}/progress/topics`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ subject, topic, completed }),
  });
  if (!response.ok) {
    throw new Error('Failed to save topic progress');
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cognivex:ml-refetch"));
  }
  return response.json();
}

export async function getRoadmapProgress() {
  const response = await fetch(`${BASE_URL}/progress/roadmap`, {
    method: 'GET',
    headers: await getAuthHeaders(),
    cache: 'no-store'
  });
  if (!response.ok) {
    throw new Error('Failed to fetch roadmap progress');
  }
  return response.json();
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

export interface DashboardData {
  score: number;
  speed: number;
  accuracy: number;
  confidence: number;
  weak_areas: string[];
  current_focus: string;
  semester: string;
  goal: string;
  target_timeline_months: number;
  placement_target: string;
  subject_completion_pct: number;
  roadmap_completion_pct: number;
  next_recommended_subject: string;
  last_test_score: number;
  total_tests: number;
  total_questions_attempted: number;
  overall_accuracy_percent: number;
  topics_completed_count: number;
  subject_accuracy_breakdown: SubjectAccuracy[];
  recent_tests: RecentTest[];
  weekly_activity: WeeklyActivity[];
}

export interface MLRecommendedTopic {
  topic: string;
  subject: string;
  weakness_score: number;
  reason: string;
  priority: "high" | "medium" | "low";
}

export interface MLProfile {
  recommended_topics: MLRecommendedTopic[];
  strongest_subject: string | null;
  weakest_subject: string | null;
  difficulty_level: string;
  learning_velocity: string;
  daily_goal: number;
  insight_message: string;
  cached?: boolean;
}

export async function getMLProfile(userId: string): Promise<MLProfile> {
  const response = await fetch(`${BASE_URL}/ml/profile/${userId}`, {
    method: "GET",
    headers: await getAuthHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch ML profile");
  }

  return response.json();
}

export async function saveRoadmapProgress(phase: string, item: string, completed: boolean) {
  const response = await fetch(`${BASE_URL}/progress/roadmap`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ phase, item, completed }),
  });
  if (!response.ok) {
    throw new Error('Failed to save roadmap progress');
  }
  return response.json();
}

export interface QuestionSubject {
  id: number;
  name: string;
  code: string;
  topic_count: number;
}

export interface QuizQuestion {
  id: number | string;
  subject_id: number;
  topic_id: number;
  topic_name: string | null;
  question: string;
  options: string[];
  explanation: string;
  difficulty: string;
}

export interface QuizAnswerSubmission {
  questionId: number | string;
  selectedAnswer: number;
  timeTaken: number;
}

export interface QuizReviewItem {
  questionId: number | string;
  question: string;
  options: string[];
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  explanation: string;
  topic_name: string | null;
  difficulty: string;
}

export interface QuizSubmitResult {
  attemptId: string | null;
  score: number;
  correctCount: number;
  total: number;
  accuracy: number;
  review: QuizReviewItem[];
}

export async function getQuestionSubjects(): Promise<QuestionSubject[]> {
  const response = await fetch(`${BASE_URL}/questions/subjects`, {
    method: "GET",
    headers: await getAuthHeaders(),
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      typeof data?.error === "string" ? data.error : "Failed to fetch subjects"
    );
  }

  if (!Array.isArray(data)) {
    throw new Error("Invalid subjects response from server");
  }

  return data;
}

export async function getRandomQuestions(params: {
  subject?: number;
  count?: number;
  difficulty?: string;
}): Promise<{ count: number; questions: QuizQuestion[] }> {
  const search = new URLSearchParams();
  if (params.subject) search.set('subject', String(params.subject));
  if (params.count) search.set('count', String(params.count));
  if (params.difficulty && params.difficulty !== 'mixed') {
    search.set('difficulty', params.difficulty);
  }

  const response = await fetch(`${BASE_URL}/questions/random?${search.toString()}`, {
    method: 'GET',
    headers: await getAuthHeaders(),
    cache: 'no-store',
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch questions');
  }

  return response.json();
}

export async function submitQuiz(
  userId: string,
  answers: QuizAnswerSubmission[]
): Promise<QuizSubmitResult> {
  const payload = { userId, answers };

  const response = await fetch(`${BASE_URL}/questions/quiz/submit`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      typeof data?.error === "string"
        ? data.details
          ? `${data.error}: ${data.details}`
          : data.error
        : "Failed to submit quiz"
    );
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cognivex:ml-refetch"));
  }

  return data as QuizSubmitResult;
}
export interface PracticeTestSubmission {
  answers: number[];
  correct_answers: number[];
  time_taken: number;
  topics: string[];
  subject?: string;
}

export async function submitPracticeTest(payload: PracticeTestSubmission): Promise<{ success: boolean; testId: string | null; results: { score: number; accuracy: number; correctCount: number; total: number } }> {
  const response = await fetch(`${BASE_URL}/practice/submit-test`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Failed to submit practice test");
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cognivex:ml-refetch"));
  }

  return data;
}

// Raw question format returned by the PDF quiz generation endpoint
export interface PdfQuizRawQuestion {
  question: string;
  options: string[];
  correct: number; // index of the correct option (0-based)
  topic?: string;
  explanation?: string;
}

export async function generateQuizFromPdf(
  file: File,
  options?: { questionCount?: number; subject?: string }
): Promise<{ success: boolean; questions: PdfQuizRawQuestion[]; quizId?: string; metadata?: Record<string, unknown> }> {
  const formData = new FormData();
  formData.append('file', file);
  if (options?.questionCount) {
    formData.append('questionCount', String(options.questionCount));
  }
  if (options?.subject) {
    formData.append('subject', options.subject);
  }

  const authUser = auth.currentUser;
  const headers: Record<string, string> = {};
  if (authUser) {
    headers['user-id'] = authUser.uid;
    try {
      const token = await authUser.getIdToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    } catch (tokenErr) {
      console.warn('generateQuizFromPdf: failed to get ID token', tokenErr);
    }
  }

  const response = await fetch(`${BASE_URL}/practice/generate-from-pdf`, {
    method: 'POST',
    headers, // no Content-Type — browser sets multipart boundary automatically
    body: formData,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to generate quiz from PDF');
  }

  return data;
}
