/**
 * Beautiful Emotion Chart Component
 */

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Card from '../UI/Card';
import { EmotionScores, EMOTION_COLORS, EMOTION_LABELS } from '../../utils/types';

interface EmotionChartProps {
  emotions: EmotionScores;
}

export default function EmotionChart({ emotions }: EmotionChartProps) {
  const data = Object.entries(emotions).map(([emotion, value]) => ({
    emotion: EMOTION_LABELS[emotion as keyof EmotionScores] || emotion,
    value: Math.round(value * 100),
    color: EMOTION_COLORS[emotion as keyof EmotionScores],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark/95 backdrop-blur-xl border border-white/20 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold">{payload[0].payload.emotion}</p>
          <p className="text-primary text-sm">{payload[0].value}% intensity</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card glass>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="text-2xl">📊</span>
        Emotion Breakdown
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis
              dataKey="emotion"
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
              axisLine={{ stroke: '#374151' }}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
              axisLine={{ stroke: '#374151' }}
              label={{ value: 'Intensity (%)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
        {data.map((item) => (
          <motion.div
            key={item.emotion}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-3 rounded-lg bg-white/5 border border-white/10"
          >
            <div
              className="w-3 h-3 rounded-full mx-auto mb-2"
              style={{ backgroundColor: item.color }}
            />
            <p className="text-xs text-gray-400">{item.emotion}</p>
            <p className="text-lg font-bold" style={{ color: item.color }}>
              {item.value}%
            </p>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
