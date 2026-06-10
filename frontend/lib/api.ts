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

export async function getDashboard() {
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
