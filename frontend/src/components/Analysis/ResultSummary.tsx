/**
 * Result Summary Component with stress gauge and suggestions
 */

import { motion } from 'framer-motion';
import { Lightbulb, AlertTriangle, Brain } from 'lucide-react';
import Card from '../UI/Card';
import ProgressBar from '../UI/ProgressBar';
import { AnalysisResponse } from '../../utils/types';

interface ResultSummaryProps {
  result: AnalysisResponse;
}

export default function ResultSummary({ result }: ResultSummaryProps) {
  const getEmotionEmoji = (emotion: string): string => {
    const emojiMap: Record<string, string> = {
      joy: '😊',
      sadness: '😢',
      anxiety: '😰',
      anger: '😠',
      calm: '😌',
    };
    return emojiMap[emotion] || '🙂';
  };

  return (
    <div className="space-y-6">
      {/* Primary Emotion & Stress Score */}
      <Card glass gradient>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Primary Emotion */}
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-400 mb-2">Primary Emotion</p>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <span className="text-5xl">{getEmotionEmoji(result.primary_emotion)}</span>
              <div>
                <h3 className="text-3xl font-bold capitalize">{result.primary_emotion}</h3>
                <p className="text-sm text-gray-400">Detected emotion</p>
              </div>
            </div>
          </div>

          {/* Stress Gauge */}
          <div className="flex justify-center">
            <ProgressBar value={result.stress_score} size="lg" />
          </div>
        </div>
      </Card>

      {/* AI Summary */}
      <Card glass>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">AI Summary</h3>
            <p className="text-gray-300 leading-relaxed">{result.summary}</p>
          </div>
        </div>
      </Card>

      {/* Cognitive Distortions */}
      {result.cognitive_distortions.length > 0 && (
        <Card glass className="bg-amber-500/5 border-amber-500/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-3 text-amber-400">
                Thinking Patterns Detected
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.cognitive_distortions.map((distortion) => (
                  <motion.span
                    key={distortion}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-medium capitalize"
                  >
                    {distortion.replace(/-/g, ' ')}
                  </motion.span>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-3">
                These are common thinking patterns that might not always be helpful. Consider exploring
                alternative perspectives.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Suggestions */}
      <Card glass>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Personalized Suggestions</h3>
            <p className="text-sm text-gray-400">Gentle guidance for your wellbeing</p>
          </div>
        </div>

        <div className="space-y-3">
          {result.suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <span className="text-primary font-bold flex-shrink-0">{index + 1}.</span>
              <p className="text-gray-300 text-sm leading-relaxed">{suggestion}</p>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
