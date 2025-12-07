/**
 * Premium Analyze Page - Main text analysis interface
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertCircle } from 'lucide-react';
import { useAnalysis } from '../hooks/useAnalysis';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import ResultSummary from '../components/Analysis/ResultSummary';
import EmotionChart from '../components/Analysis/EmotionChart';

export default function Analyze() {
  const [text, setText] = useState('');
  const { analyze, result, isLoading, error, clearError } = useAnalysis();

  const characterCount = text.length;
  const minChars = 20;
  const maxChars = 5000;
  const isValid = characterCount >= minChars && characterCount <= maxChars;

  const handleAnalyze = async () => {
    if (!isValid) return;
    clearError();
    await analyze(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && isValid) {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">AI-Powered Analysis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Analyze Your{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Mind
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Write freely about how you're feeling right now. Our AI will provide gentle insights and supportive guidance.
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card glass className="mb-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-lg font-semibold">Share Your Thoughts</label>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm ${
                      characterCount < minChars
                        ? 'text-gray-500'
                        : characterCount > maxChars
                        ? 'text-red-400'
                        : 'text-primary'
                    }`}
                  >
                    {characterCount} / {maxChars}
                  </span>
                </div>
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Example: I've been feeling anxious about my exams and my future. I try to stay positive, but sometimes it feels overwhelming..."
                className="w-full min-h-[250px] bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none"
                disabled={isLoading}
              />

              {characterCount > 0 && characterCount < minChars && (
                <p className="text-sm text-gray-500">
                  Please write at least {minChars - characterCount} more characters
                </p>
              )}

              {characterCount > maxChars && (
                <p className="text-sm text-red-400">
                  Please reduce your text by {characterCount - maxChars} characters
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleAnalyze}
                  disabled={!isValid || isLoading}
                  loading={isLoading}
                  className="flex-1"
                  size="lg"
                >
                  {isLoading ? 'Analyzing...' : 'Analyze My Mind'}
                </Button>
                {text && (
                  <Button
                    onClick={() => {
                      setText('');
                      clearError();
                    }}
                    variant="ghost"
                    disabled={isLoading}
                  >
                    Clear
                  </Button>
                )}
              </div>

              <p className="text-xs text-gray-500 text-center">
                💡 Tip: Press Ctrl+Enter to analyze quickly
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <Card className="bg-red-500/10 border-red-500/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-400 mb-1">Analysis Error</h3>
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-primary/10 border-primary/20 text-center">
                  <p className="text-primary font-medium">
                    ✨ Analysis complete! Session saved to your history.
                  </p>
                </Card>
              </motion.div>

              {/* Emotion Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <EmotionChart emotions={result.emotions} />
              </motion.div>

              {/* Result Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <ResultSummary result={result} />
              </motion.div>

              {/* Analyze Again Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <Button
                  onClick={() => {
                    setText('');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  variant="secondary"
                >
                  Analyze Another Entry
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
