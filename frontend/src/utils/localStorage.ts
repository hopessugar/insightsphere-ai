/**
 * LocalStorage utilities for session management
 */

import { Session, AnalysisResponse } from './types';

const SESSIONS_KEY = 'insightsphere_sessions';

export function saveSession(text: string, result: AnalysisResponse): Session {
  const session: Session = {
    id: crypto.randomUUID(),
    timestamp: result.timestamp,
    text,
    result,
  };

  try {
    const sessions = getSessions();
    sessions.unshift(session); // Add to beginning
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    return session;
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      // Storage full - remove oldest sessions
      const sessions = getSessions();
      const trimmedSessions = sessions.slice(0, 50); // Keep only 50 most recent
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(trimmedSessions));
      
      // Try again
      trimmedSessions.unshift(session);
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(trimmedSessions));
      return session;
    }
    throw error;
  }
}

export function getSessions(): Session[] {
  try {
    const data = localStorage.getItem(SESSIONS_KEY);
    if (!data) return [];
    return JSON.parse(data) as Session[];
  } catch {
    return [];
  }
}

export function getSessionsByTimeframe(days: number): Session[] {
  const sessions = getSessions();
  if (days === 0) return sessions; // 'all' filter

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const cutoffTime = cutoffDate.getTime();

  return sessions.filter((session) => {
    const sessionTime = new Date(session.timestamp).getTime();
    return sessionTime >= cutoffTime;
  });
}

export function clearSessions(): void {
  localStorage.removeItem(SESSIONS_KEY);
}

export function getSession(id: string): Session | null {
  const sessions = getSessions();
  return sessions.find((s) => s.id === id) || null;
}
