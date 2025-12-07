/**
 * Custom hook for text analysis
 */

import { useState } from 'react';
import { AnalysisResponse } from '../utils/types';
import { analyzeText, APIError } from '../utils/api';
import { saveSession } from '../utils/localStorage';

interface UseAnalysisReturn {
  analyze: (text: string) => Promise<void>;
  result: AnalysisResponse | null;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  clearResult: () => void;
}

export function useAnalysis(): UseAnalysisReturn {
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (text: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeText(text);
      setResult(analysisResult);
      
      // Save to localStorage
      try {
        saveSession(text, analysisResult);
      } catch (storageError) {
        console.error('Failed to save session:', storageError);
        // Don't fail the analysis if storage fails
      }
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);
  const clearResult = () => setResult(null);

  return {
    analyze,
    result,
    isLoading,
    error,
    clearError,
    clearResult,
  };
}
