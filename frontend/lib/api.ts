const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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
  const response = await fetch(`${API_URL}/onboarding`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to submit onboarding data');
  }

  return response.json();
}

export async function getDashboard() {
  const response = await fetch(`${API_URL}/dashboard`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }

  return response.json();
}

export async function askAI(query: string) {
  const response = await fetch(`${API_URL}/ai-tutor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
  const response = await fetch(`${API_URL}/daily/today-focus`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch daily focus');
  }

  return response.json();
}

export async function completeDailyTask(taskText: string) {
  const response = await fetch(`${API_URL}/daily/complete-task`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ taskText }),
  });

  if (!response.ok) {
    throw new Error('Failed to complete task');
  }

  return response.json();
}

export async function getTopicProgress() {
  const response = await fetch(`${API_URL}/progress/topics`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store'
  });
  if (!response.ok) {
    throw new Error('Failed to fetch topic progress');
  }
  return response.json();
}

export async function saveTopicProgress(subject: string, topic: string, completed: boolean) {
  const response = await fetch(`${API_URL}/progress/topics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subject, topic, completed }),
  });
  if (!response.ok) {
    throw new Error('Failed to save topic progress');
  }
  return response.json();
}

export async function getRoadmapProgress() {
  const response = await fetch(`${API_URL}/progress/roadmap`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store'
  });
  if (!response.ok) {
    throw new Error('Failed to fetch roadmap progress');
  }
  return response.json();
}

export async function saveRoadmapProgress(phase: string, item: string, completed: boolean) {
  const response = await fetch(`${API_URL}/progress/roadmap`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phase, item, completed }),
  });
  if (!response.ok) {
    throw new Error('Failed to save roadmap progress');
  }
  return response.json();
}
