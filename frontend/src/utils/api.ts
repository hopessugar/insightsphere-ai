/**
 * API client for InsightSphere AI backend
 */

import { AnalysisResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errorType?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function analyzeText(text: string): Promise<AnalysisResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze_text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      // Try to parse error response
      try {
        const errorData = await response.json();
        throw new APIError(
          errorData.detail || 'Analysis failed',
          response.status,
          errorData.error_type
        );
      } catch (parseError) {
        throw new APIError(
          `Server error: ${response.statusText}`,
          response.status
        );
      }
    }

    const data = await response.json();
    return data as AnalysisResponse;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }

    // Network errors
    if (error instanceof TypeError) {
      throw new APIError(
        "We're having trouble connecting right now. Please try again in a moment."
      );
    }

    // JSON parsing errors
    if (error instanceof SyntaxError) {
      throw new APIError('Invalid response from server. Please try again.');
    }

    // Unknown errors
    throw new APIError('An unexpected error occurred. Please try again.');
  }
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    return response.ok;
  } catch {
    return false;
  }
}

export async function sendChatMessage(
  message: string,
  conversationHistory?: Array<{ role: string; content: string }>,
  emotionalContext?: {
    primary_emotion?: string;
    stress_score?: number;
    cognitive_distortions?: string[];
  }
): Promise<import('./types').ChatResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversation_history: conversationHistory,
        emotional_context: emotionalContext,
      }),
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new APIError(
          errorData.detail || 'Chat failed',
          response.status,
          errorData.error_type
        );
      } catch (parseError) {
        throw new APIError(
          `Server error: ${response.statusText}`,
          response.status
        );
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new APIError(
        "We're having trouble connecting right now. Please try again in a moment."
      );
    }

    if (error instanceof SyntaxError) {
      throw new APIError('Invalid response from server. Please try again.');
    }

    throw new APIError('An unexpected error occurred. Please try again.');
  }
}
