/**
 * Type definitions for InsightSphere AI
 */

export interface EmotionScores {
  joy: number;
  sadness: number;
  anxiety: number;
  anger: number;
  calm: number;
}

export interface AnalysisResponse {
  emotions: EmotionScores;
  primary_emotion: string;
  stress_score: number;
  cognitive_distortions: string[];
  summary: string;
  suggestions: string[];
  timestamp: string;
}

export interface Session {
  id: string;
  timestamp: string;
  text: string;
  result: AnalysisResponse;
}

export type TimeFilter = '7d' | '30d' | 'all';

export interface ChartDataPoint {
  date: string;
  stress: number;
  timestamp: number;
}

export interface EmotionFrequency {
  emotion: string;
  count: number;
  color: string;
}

export const EMOTION_COLORS: Record<string, string> = {
  joy: '#22d3ee',      // cyan
  sadness: '#8b5cf6',  // purple
  anxiety: '#f59e0b',  // amber
  anger: '#ef4444',    // red
  calm: '#10b981',     // green
};

export const EMOTION_LABELS: Record<string, string> = {
  joy: 'Joy',
  sadness: 'Sadness',
  anxiety: 'Anxiety',
  anger: 'Anger',
  calm: 'Calm',
};

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  conversation_history?: Array<{ role: string; content: string }>;
  emotional_context?: {
    primary_emotion?: string;
    stress_score?: number;
    cognitive_distortions?: string[];
  };
}

export interface ChatResponse {
  response: string;
  crisis_detected: boolean;
  crisis_severity: string;
  crisis_resources?: {
    immediate?: Array<{
      name: string;
      contact: string;
      description: string;
    }>;
    international?: Array<{
      name: string;
      contact: string;
      description: string;
    }>;
    online?: Array<{
      name: string;
      contact: string;
      description: string;
    }>;
  };
  timestamp: string;
}
