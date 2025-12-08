import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Area, AreaChart
} from 'recharts';
import { 
  Calendar, TrendingUp, TrendingDown, Award, Flame, Target, Brain, 
  Moon, Dumbbell, Users, Zap, AlertCircle, CheckCircle2, 
  Plus, Minus, Activity, Smile
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

interface MoodEntry {
  id: string;
  date: string;
  timestamp: number;
  mood: number; // 0-10
  energy: number; // 0-10
  anxiety: number; // 0-10
  sleep: number; // 0-10
  exercise: boolean;
  social: boolean;
  meditation: boolean;
  notes: string;
  symptoms: string[];
}

interface Pattern {
  type: 'trigger' | 'booster' | 'time' | 'day';
  title: string;
  description: string;
  confidence: number; // 0-100
  icon: any;
}

const MOOD_EMOJIS = ['😢', '😟', '😕', '😐', '🙂', '😊', '😄', '😁', '🤩', '🥳', '🌟'];

export default function Insights() {
  const [view, setView] = useState<'dashboard' | 'tracker' | 'patterns' | 'journal'>('dashboard');
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  
  // Quick log state
  const [quickMood, setQuickMood] = useState(5);
  const [quickEnergy, setQuickEnergy] = useState(5);
  const [quickAnxiety, setQuickAnxiety] = useState(5);
  const [quickSleep, setQuickSleep] = useState(5);
  const [quickExercise, setQuickExercise] = useState(false);
  const [quickSocial, setQuickSocial] = useState(false);
  const [quickMeditation, setQuickMeditation] = useState(false);
  const [quickNotes, setQuickNotes] = useState('');

  const [isLoadingEntries, setIsLoadingEntries] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load mood entries from database
  useEffect(() => {
    const loadMoodEntries = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setIsLoadingEntries(false);
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${API_URL}/api/mood-logs?limit=100`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Transform API data to match MoodEntry interface
          const transformedEntries: MoodEntry[] = data.mood_logs.map((log: any) => ({
            id: log._id,
            date: log.date,
            timestamp: new Date(log.created_at).getTime(),
            mood: log.mood,
            energy: log.energy,
            anxiety: log.anxiety,
            sleep: log.sleep,
            exercise: log.activities.exercise,
            social: log.activities.social,
            meditation: log.activities.meditation,
            notes: log.notes || '',
            symptoms: []
          }));
          setMoodEntries(transformedEntries);
        }
      } catch (error) {
        console.error('Failed to load mood entries:', error);
      } finally {
        setIsLoadingEntries(false);
      }
    };

    loadMoodEntries();
  }, []);

  // Save mood entry to database
  const saveMoodEntry = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('auth_token');
      if (!token) {
        alert('Please log in to save mood entries');
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/mood-logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0],
          mood: quickMood,
          energy: quickEnergy,
          anxiety: quickAnxiety,
          sleep: quickSleep,
          activities: {
            exercise: quickExercise,
            social: quickSocial,
            meditation: quickMeditation
          },
          notes: quickNotes
        }),
      });

      if (response.ok) {
        const savedLog = await response.json();
        // Transform and add to local state
        const newEntry: MoodEntry = {
          id: savedLog._id,
          date: savedLog.date,
          timestamp: new Date(savedLog.created_at).getTime(),
          mood: savedLog.mood,
          energy: savedLog.energy,
          anxiety: savedLog.anxiety,
          sleep: savedLog.sleep,
          exercise: savedLog.activities.exercise,
          social: savedLog.activities.social,
          meditation: savedLog.activities.meditation,
          notes: savedLog.notes || '',
          symptoms: []
        };

        setMoodEntries([newEntry, ...moodEntries]);
        
        // Reset form
        setShowQuickLog(false);
        setQuickNotes('');
      } else {
        const error = await response.json();
        alert(`Failed to save mood entry: ${error.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to save mood entry:', error);
      alert('Failed to save mood entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (moodEntries.length === 0) return null;

    const last7Days = moodEntries.filter(e => 
      Date.now() - e.timestamp < 7 * 24 * 60 * 60 * 1000
    );
    const last30Days = moodEntries.filter(e => 
      Date.now() - e.timestamp < 30 * 24 * 60 * 60 * 1000
    );

    const avgMood = last7Days.reduce((sum, e) => sum + e.mood, 0) / last7Days.length || 0;
    const avgEnergy = last7Days.reduce((sum, e) => sum + e.energy, 0) / last7Days.length || 0;
    const avgAnxiety = last7Days.reduce((sum, e) => sum + e.anxiety, 0) / last7Days.length || 0;
    const avgSleep = last7Days.reduce((sum, e) => sum + e.sleep, 0) / last7Days.length || 0;

    const exerciseCount = last7Days.filter(e => e.exercise).length;
    const socialCount = last7Days.filter(e => e.social).length;
    const meditationCount = last7Days.filter(e => e.meditation).length;

    // Calculate streak
    let currentStreak = 0;
    const sortedEntries = [...moodEntries].sort((a, b) => b.timestamp - a.timestamp);
    
    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].timestamp).toISOString().split('T')[0];
      const expectedDate = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      if (entryDate === expectedDate) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate wellness score (0-100)
    const wellnessScore = Math.round(
      (avgMood * 0.3 + avgEnergy * 0.2 + (10 - avgAnxiety) * 0.2 + avgSleep * 0.15 + 
       (exerciseCount / 7 * 10) * 0.1 + (socialCount / 7 * 10) * 0.05) * 10
    );

    // Week over week comparison
    const prevWeek = moodEntries.filter(e => 
      e.timestamp < Date.now() - 7 * 24 * 60 * 60 * 1000 &&
      e.timestamp > Date.now() - 14 * 24 * 60 * 60 * 1000
    );
    const prevWeekAvgMood = prevWeek.reduce((sum, e) => sum + e.mood, 0) / prevWeek.length || 0;
    const moodChange = avgMood - prevWeekAvgMood;

    return {
      avgMood: avgMood.toFixed(1),
      avgEnergy: avgEnergy.toFixed(1),
      avgAnxiety: avgAnxiety.toFixed(1),
      avgSleep: avgSleep.toFixed(1),
      exerciseCount,
      socialCount,
      meditationCount,
      currentStreak,
      wellnessScore,
      moodChange: moodChange.toFixed(1),
      totalEntries: moodEntries.length,
      last7Days: last7Days.length,
      last30Days: last30Days.length
    };
  }, [moodEntries]);

  // Detect patterns
  const patterns = useMemo((): Pattern[] => {
    if (moodEntries.length < 7) return [];

    const detectedPatterns: Pattern[] = [];

    // Exercise correlation
    const withExercise = moodEntries.filter(e => e.exercise);
    const withoutExercise = moodEntries.filter(e => !e.exercise);
    if (withExercise.length > 3 && withoutExercise.length > 3) {
      const avgMoodWithEx = withExercise.reduce((sum, e) => sum + e.mood, 0) / withExercise.length;
      const avgMoodWithoutEx = withoutExercise.reduce((sum, e) => sum + e.mood, 0) / withoutExercise.length;
      
      if (avgMoodWithEx - avgMoodWithoutEx > 1) {
        detectedPatterns.push({
          type: 'booster',
          title: 'Exercise Boosts Your Mood',
          description: `Your mood is ${(avgMoodWithEx - avgMoodWithoutEx).toFixed(1)} points higher on days you exercise.`,
          confidence: Math.min(95, Math.round((avgMoodWithEx - avgMoodWithoutEx) * 15)),
          icon: Dumbbell
        });
      }
    }

    // Social interaction correlation
    const withSocial = moodEntries.filter(e => e.social);
    const withoutSocial = moodEntries.filter(e => !e.social);
    if (withSocial.length > 3 && withoutSocial.length > 3) {
      const avgMoodWithSocial = withSocial.reduce((sum, e) => sum + e.mood, 0) / withSocial.length;
      const avgMoodWithoutSocial = withoutSocial.reduce((sum, e) => sum + e.mood, 0) / withoutSocial.length;
      
      if (avgMoodWithSocial - avgMoodWithoutSocial > 0.8) {
        detectedPatterns.push({
          type: 'booster',
          title: 'Social Connection Helps',
          description: `You feel ${(avgMoodWithSocial - avgMoodWithoutSocial).toFixed(1)} points better after social interaction.`,
          confidence: Math.min(90, Math.round((avgMoodWithSocial - avgMoodWithoutSocial) * 12)),
          icon: Users
        });
      }
    }

    // Sleep quality correlation
    const goodSleep = moodEntries.filter(e => e.sleep >= 7);
    const poorSleep = moodEntries.filter(e => e.sleep < 5);
    if (goodSleep.length > 2 && poorSleep.length > 2) {
      const avgMoodGoodSleep = goodSleep.reduce((sum, e) => sum + e.mood, 0) / goodSleep.length;
      const avgMoodPoorSleep = poorSleep.reduce((sum, e) => sum + e.mood, 0) / poorSleep.length;
      
      if (avgMoodGoodSleep - avgMoodPoorSleep > 1) {
        detectedPatterns.push({
          type: 'trigger',
          title: 'Poor Sleep Affects Your Mood',
          description: `Your mood drops ${(avgMoodGoodSleep - avgMoodPoorSleep).toFixed(1)} points after poor sleep.`,
          confidence: Math.min(95, Math.round((avgMoodGoodSleep - avgMoodPoorSleep) * 15)),
          icon: Moon
        });
      }
    }

    // Day of week pattern
    const dayMoods: { [key: string]: number[] } = {};
    moodEntries.forEach(entry => {
      const day = new Date(entry.timestamp).toLocaleDateString('en-US', { weekday: 'long' });
      if (!dayMoods[day]) dayMoods[day] = [];
      dayMoods[day].push(entry.mood);
    });

    const dayAverages = Object.entries(dayMoods).map(([day, moods]) => ({
      day,
      avg: moods.reduce((sum, m) => sum + m, 0) / moods.length
    }));

    const bestDay = dayAverages.reduce((best, curr) => curr.avg > best.avg ? curr : best, dayAverages[0]);
    const worstDay = dayAverages.reduce((worst, curr) => curr.avg < worst.avg ? curr : worst, dayAverages[0]);

    if (dayAverages.length >= 5 && bestDay && worstDay && bestDay.avg - worstDay.avg > 1.5) {
      detectedPatterns.push({
        type: 'day',
        title: `${worstDay.day}s Are Harder for You`,
        description: `Your mood is ${(bestDay.avg - worstDay.avg).toFixed(1)} points lower on ${worstDay.day}s compared to ${bestDay.day}s.`,
        confidence: 75,
        icon: Calendar
      });
    }

    // Meditation correlation
    const withMeditation = moodEntries.filter(e => e.meditation);
    if (withMeditation.length > 3) {
      const avgAnxietyWithMed = withMeditation.reduce((sum, e) => sum + e.anxiety, 0) / withMeditation.length;
      const avgAnxietyOverall = moodEntries.reduce((sum, e) => sum + e.anxiety, 0) / moodEntries.length;
      
      if (avgAnxietyOverall - avgAnxietyWithMed > 1) {
        detectedPatterns.push({
          type: 'booster',
          title: 'Meditation Reduces Anxiety',
          description: `Your anxiety is ${(avgAnxietyOverall - avgAnxietyWithMed).toFixed(1)} points lower on days you meditate.`,
          confidence: 85,
          icon: Brain
        });
      }
    }

    return detectedPatterns;
  }, [moodEntries]);

  // Prepare chart data
  const moodTrendData = useMemo(() => {
    return moodEntries
      .slice(0, 30)
      .reverse()
      .map(entry => ({
        date: new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: entry.mood,
        energy: entry.energy,
        anxiety: entry.anxiety,
        sleep: entry.sleep
      }));
  }, [moodEntries]);

  const wellnessRadarData = useMemo(() => {
    if (!stats) return [];
    return [
      { category: 'Mood', value: parseFloat(stats.avgMood), fullMark: 10 },
      { category: 'Energy', value: parseFloat(stats.avgEnergy), fullMark: 10 },
      { category: 'Sleep', value: parseFloat(stats.avgSleep), fullMark: 10 },
      { category: 'Exercise', value: (stats.exerciseCount / 7) * 10, fullMark: 10 },
      { category: 'Social', value: (stats.socialCount / 7) * 10, fullMark: 10 },
      { category: 'Low Anxiety', value: 10 - parseFloat(stats.avgAnxiety), fullMark: 10 }
    ];
  }, [stats]);

  // Render Quick Log Modal (always available)
  const renderQuickLogModal = () => (
    <AnimatePresence>
      {showQuickLog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowQuickLog(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Quick Daily Log</h2>
                <button
                  onClick={() => setShowQuickLog(false)}
                  className="w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <Minus className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Mood */}
                <div>
                  <label className="block text-lg font-semibold mb-3">
                    How's your mood today? {MOOD_EMOJIS[quickMood]}
                  </label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">😢</span>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={quickMood}
                      onChange={(e) => setQuickMood(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #ef4444 0%, #eab308 50%, #22c55e 100%)`
                      }}
                    />
                    <span className="text-sm text-gray-400">🌟</span>
                    <span className="text-2xl font-bold w-12 text-center">{quickMood}</span>
                  </div>
                </div>

                {/* Energy */}
                <div>
                  <label className="block text-lg font-semibold mb-3">
                    Energy Level <Zap className="w-5 h-5 inline text-yellow-400" />
                  </label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">Low</span>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={quickEnergy}
                      onChange={(e) => setQuickEnergy(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm text-gray-400">High</span>
                    <span className="text-2xl font-bold w-12 text-center">{quickEnergy}</span>
                  </div>
                </div>

                {/* Anxiety */}
                <div>
                  <label className="block text-lg font-semibold mb-3">
                    Anxiety Level <AlertCircle className="w-5 h-5 inline text-red-400" />
                  </label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">None</span>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={quickAnxiety}
                      onChange={(e) => setQuickAnxiety(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm text-gray-400">Severe</span>
                    <span className="text-2xl font-bold w-12 text-center">{quickAnxiety}</span>
                  </div>
                </div>

                {/* Sleep */}
                <div>
                  <label className="block text-lg font-semibold mb-3">
                    Sleep Quality <Moon className="w-5 h-5 inline text-purple-400" />
                  </label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">Poor</span>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={quickSleep}
                      onChange={(e) => setQuickSleep(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm text-gray-400">Great</span>
                    <span className="text-2xl font-bold w-12 text-center">{quickSleep}</span>
                  </div>
                </div>

                {/* Activities */}
                <div>
                  <label className="block text-lg font-semibold mb-3">Today's Activities</label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setQuickExercise(!quickExercise)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        quickExercise
                          ? 'bg-green-500/20 border-green-500'
                          : 'bg-white/5 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <Dumbbell className={`w-8 h-8 mx-auto mb-2 ${quickExercise ? 'text-green-400' : 'text-gray-400'}`} />
                      <div className="text-sm font-semibold">Exercise</div>
                    </button>

                    <button
                      onClick={() => setQuickSocial(!quickSocial)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        quickSocial
                          ? 'bg-blue-500/20 border-blue-500'
                          : 'bg-white/5 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <Users className={`w-8 h-8 mx-auto mb-2 ${quickSocial ? 'text-blue-400' : 'text-gray-400'}`} />
                      <div className="text-sm font-semibold">Social</div>
                    </button>

                    <button
                      onClick={() => setQuickMeditation(!quickMeditation)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        quickMeditation
                          ? 'bg-purple-500/20 border-purple-500'
                          : 'bg-white/5 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <Brain className={`w-8 h-8 mx-auto mb-2 ${quickMeditation ? 'text-purple-400' : 'text-gray-400'}`} />
                      <div className="text-sm font-semibold">Meditation</div>
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-lg font-semibold mb-3">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={quickNotes}
                    onChange={(e) => setQuickNotes(e.target.value)}
                    placeholder="How are you feeling? What happened today?"
                    className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 resize-none"
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                  <Button
                    onClick={() => setShowQuickLog(false)}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveMoodEntry}
                    disabled={isSaving}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Save Entry
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Loading state
  if (isLoadingEntries) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your insights...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (moodEntries.length === 0) {
    return (
      <>
        <div className="min-h-screen pt-20 pb-12 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="text-6xl mb-6">📊</div>
              <h1 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Track Your Mental Health Journey
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Start logging your daily mood, energy, and activities to unlock powerful insights
              </p>

              <Card className="p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">What You'll Get:</h2>
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div className="flex gap-3">
                    <TrendingUp className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Progress Tracking</h3>
                      <p className="text-gray-400 text-sm">See your mood, energy, and wellness improve over time</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Brain className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Pattern Recognition</h3>
                      <p className="text-gray-400 text-sm">Discover what triggers and boosts your mental health</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Flame className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Streak Tracking</h3>
                      <p className="text-gray-400 text-sm">Build consistency with daily check-ins and habits</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Target className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Wellness Score</h3>
                      <p className="text-gray-400 text-sm">Overall mental health score based on multiple factors</p>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => setShowQuickLog(true)}
                  size="lg"
                  className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-blue-600"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Log Your First Entry
                </Button>
              </Card>

              <p className="text-gray-500 text-sm">
                ⏱️ Takes 30 seconds • 🔒 Stored locally on your device • 📈 Insights appear after 3+ entries
              </p>
            </motion.div>
          </div>
        </div>
        {renderQuickLogModal()}
      </>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Your Insights
                </span>
              </h1>
              <p className="text-gray-400">Track patterns, progress, and mental health analytics</p>
            </div>

            <Button
              onClick={() => setShowQuickLog(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600"
            >
              <Plus className="w-5 h-5 mr-2" />
              Quick Log
            </Button>
          </div>
        </motion.div>

        {/* View Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Activity },
            { id: 'tracker', label: 'Mood Tracker', icon: Smile },
            { id: 'patterns', label: 'Patterns', icon: Brain },
            { id: 'journal', label: 'Journal', icon: Calendar }
          ].map(tab => (
            <Button
              key={tab.id}
              onClick={() => setView(tab.id as any)}
              variant={view === tab.id ? 'primary' : 'ghost'}
              size="sm"
              className="whitespace-nowrap"
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {view === 'dashboard' && stats && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Personalized Profile Summary */}
              <Card className="p-8 mb-8 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 border-purple-500/30">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Your Mental Health Journey</h2>
                    <p className="text-gray-300">Tracking since {new Date(moodEntries[moodEntries.length - 1]?.timestamp || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Total Entries</div>
                    <div className="text-4xl font-bold text-purple-400">{stats.totalEntries}</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Last 7 Days</div>
                        <div className="text-2xl font-bold">{stats.last7Days} entries</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">
                      {stats.last7Days === 7 ? '🎉 Perfect week!' : stats.last7Days >= 5 ? '✨ Great consistency!' : '💪 Keep it up!'}
                    </p>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Last 30 Days</div>
                        <div className="text-2xl font-bold">{stats.last30Days} entries</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">
                      {Math.round((stats.last30Days / 30) * 100)}% completion rate
                    </p>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Overall Trend</div>
                        <div className="text-2xl font-bold">
                          {parseFloat(stats.moodChange) > 0 ? '📈 Improving' : parseFloat(stats.moodChange) < 0 ? '📉 Declining' : '➡️ Stable'}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">
                      {parseFloat(stats.moodChange) > 0 
                        ? `+${stats.moodChange} points vs last week` 
                        : parseFloat(stats.moodChange) < 0 
                        ? `${stats.moodChange} points vs last week`
                        : 'Maintaining current levels'}
                    </p>
                  </div>
                </div>

                {/* Quick Insights */}
                <div className="mt-6 p-4 bg-white/5 rounded-xl">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    Quick Insights
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Smile className="w-4 h-4 text-cyan-400" />
                      <span>Your average mood is <strong>{stats.avgMood}/10</strong> {MOOD_EMOJIS[Math.round(parseFloat(stats.avgMood))]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span>Energy levels at <strong>{stats.avgEnergy}/10</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dumbbell className="w-4 h-4 text-green-400" />
                      <span>Exercised <strong>{stats.exerciseCount}</strong> times this week</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-purple-400" />
                      <span>Sleep quality at <strong>{stats.avgSleep}/10</strong></span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Wellness Score & Streak */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="p-8 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Wellness Score</h2>
                    <Target className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div className="flex items-end gap-4">
                    <div className="text-6xl font-bold text-cyan-400">{stats.wellnessScore}</div>
                    <div className="text-2xl text-gray-400 mb-2">/100</div>
                  </div>
                  <p className="text-gray-400 mt-2">
                    Based on mood, energy, sleep, and activities
                  </p>
                  {parseFloat(stats.moodChange) > 0 ? (
                    <div className="flex items-center gap-2 mt-4 text-green-400">
                      <TrendingUp className="w-5 h-5" />
                      <span>+{stats.moodChange} from last week</span>
                    </div>
                  ) : parseFloat(stats.moodChange) < 0 ? (
                    <div className="flex items-center gap-2 mt-4 text-red-400">
                      <TrendingDown className="w-5 h-5" />
                      <span>{stats.moodChange} from last week</span>
                    </div>
                  ) : null}
                </Card>

                <Card className="p-8 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Current Streak</h2>
                    <Flame className="w-8 h-8 text-orange-400" />
                  </div>
                  <div className="flex items-end gap-4">
                    <div className="text-6xl font-bold text-orange-400">{stats.currentStreak}</div>
                    <div className="text-2xl text-gray-400 mb-2">days</div>
                  </div>
                  <p className="text-gray-400 mt-2">
                    Keep logging daily to maintain your streak!
                  </p>
                  {stats.currentStreak >= 7 && (
                    <div className="flex items-center gap-2 mt-4 text-orange-400">
                      <Award className="w-5 h-5" />
                      <span>1 week milestone! 🎉</span>
                    </div>
                  )}
                  {stats.currentStreak >= 30 && (
                    <div className="flex items-center gap-2 mt-4 text-orange-400">
                      <Award className="w-5 h-5" />
                      <span>1 month milestone! 🏆</span>
                    </div>
                  )}
                </Card>
              </div>

              {/* Key Metrics */}
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Smile className="w-6 h-6 text-blue-400" />
                    <span className="text-sm text-gray-400">Avg Mood</span>
                  </div>
                  <div className="text-3xl font-bold">{stats.avgMood}/10</div>
                  <div className="text-4xl mt-2">{MOOD_EMOJIS[Math.round(parseFloat(stats.avgMood))]}</div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-6 h-6 text-yellow-400" />
                    <span className="text-sm text-gray-400">Avg Energy</span>
                  </div>
                  <div className="text-3xl font-bold">{stats.avgEnergy}/10</div>
                  <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                      style={{ width: `${parseFloat(stats.avgEnergy) * 10}%` }}
                    />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                    <span className="text-sm text-gray-400">Avg Anxiety</span>
                  </div>
                  <div className="text-3xl font-bold">{stats.avgAnxiety}/10</div>
                  <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 to-pink-500"
                      style={{ width: `${parseFloat(stats.avgAnxiety) * 10}%` }}
                    />
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Moon className="w-6 h-6 text-purple-400" />
                    <span className="text-sm text-gray-400">Avg Sleep</span>
                  </div>
                  <div className="text-3xl font-bold">{stats.avgSleep}/10</div>
                  <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                      style={{ width: `${parseFloat(stats.avgSleep) * 10}%` }}
                    />
                  </div>
                </Card>
              </div>

              {/* Activity Stats */}
              <Card className="p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">This Week's Activities</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <Dumbbell className="w-8 h-8 text-green-400" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{stats.exerciseCount}/7</div>
                      <div className="text-sm text-gray-400">Exercise days</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Users className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{stats.socialCount}/7</div>
                      <div className="text-sm text-gray-400">Social days</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <Brain className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{stats.meditationCount}/7</div>
                      <div className="text-sm text-gray-400">Meditation days</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Wellness Radar Chart */}
              <Card className="p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">Wellness Balance</h2>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={wellnessRadarData}>
                      <PolarGrid stroke="#ffffff20" />
                      <PolarAngleAxis dataKey="category" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                      <PolarRadiusAxis angle={90} domain={[0, 10]} stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                      <Radar name="Your Wellness" dataKey="value" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-gray-400 text-center mt-4">
                  A balanced wellness profile shows similar scores across all areas
                </p>
              </Card>

              {/* Mood Trend Chart */}
              <Card className="p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">30-Day Mood Trend</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={moodTrendData}>
                      <defs>
                        <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                      <YAxis domain={[0, 10]} stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="mood" stroke="#22d3ee" fillOpacity={1} fill="url(#colorMood)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Patterns Section */}
              {patterns.length > 0 && (
                <Card className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Brain className="w-8 h-8 text-purple-400" />
                    <h2 className="text-2xl font-bold">Detected Patterns</h2>
                  </div>
                  <div className="space-y-4">
                    {patterns.map((pattern, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-xl border ${
                          pattern.type === 'booster' 
                            ? 'bg-green-500/10 border-green-500/30' 
                            : pattern.type === 'trigger'
                            ? 'bg-red-500/10 border-red-500/30'
                            : 'bg-blue-500/10 border-blue-500/30'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            pattern.type === 'booster' ? 'bg-green-500/20' : 
                            pattern.type === 'trigger' ? 'bg-red-500/20' : 'bg-blue-500/20'
                          }`}>
                            <pattern.icon className={`w-6 h-6 ${
                              pattern.type === 'booster' ? 'text-green-400' : 
                              pattern.type === 'trigger' ? 'text-red-400' : 'text-blue-400'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold">{pattern.title}</h3>
                              <span className="text-xs px-2 py-1 rounded-full bg-white/10">
                                {pattern.confidence}% confidence
                              </span>
                            </div>
                            <p className="text-gray-300">{pattern.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              )}
            </motion.div>
          )}

          {view === 'tracker' && (
            <motion.div
              key="tracker"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Mood Tracker</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Mood Chart */}
                  <div className="lg:col-span-2">
                    <h3 className="font-bold mb-4">Mood Over Time</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={moodTrendData}>
                          <XAxis dataKey="date" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                          <YAxis domain={[0, 10]} stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                          />
                          <Line type="monotone" dataKey="mood" stroke="#22d3ee" strokeWidth={2} dot={{ fill: '#22d3ee' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Energy Chart */}
                  <div className="lg:col-span-2">
                    <h3 className="font-bold mb-4">Energy Over Time</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={moodTrendData}>
                          <XAxis dataKey="date" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                          <YAxis domain={[0, 10]} stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                          />
                          <Line type="monotone" dataKey="energy" stroke="#eab308" strokeWidth={2} dot={{ fill: '#eab308' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Anxiety Chart */}
                  <div className="lg:col-span-2">
                    <h3 className="font-bold mb-4">Anxiety Over Time</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={moodTrendData}>
                          <XAxis dataKey="date" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                          <YAxis domain={[0, 10]} stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                          />
                          <Line type="monotone" dataKey="anxiety" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Sleep Chart */}
                  <div className="lg:col-span-2">
                    <h3 className="font-bold mb-4">Sleep Quality Over Time</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={moodTrendData}>
                          <XAxis dataKey="date" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                          <YAxis domain={[0, 10]} stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                          />
                          <Line type="monotone" dataKey="sleep" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {view === 'patterns' && (
            <motion.div
              key="patterns"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">Your Patterns & Insights</h2>
                
                {patterns.length === 0 ? (
                  <div className="text-center py-12">
                    <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-2">Not enough data to detect patterns yet</p>
                    <p className="text-sm text-gray-500">Keep logging for 7+ days to see insights</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {patterns.map((pattern, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-xl border ${
                          pattern.type === 'booster' 
                            ? 'bg-green-500/10 border-green-500/30' 
                            : pattern.type === 'trigger'
                            ? 'bg-red-500/10 border-red-500/30'
                            : 'bg-blue-500/10 border-blue-500/30'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                            pattern.type === 'booster' ? 'bg-green-500/20' : 
                            pattern.type === 'trigger' ? 'bg-red-500/20' : 'bg-blue-500/20'
                          }`}>
                            <pattern.icon className={`w-8 h-8 ${
                              pattern.type === 'booster' ? 'text-green-400' : 
                              pattern.type === 'trigger' ? 'text-red-400' : 'text-blue-400'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-2xl font-bold">{pattern.title}</h3>
                              <span className={`text-xs px-3 py-1 rounded-full ${
                                pattern.type === 'booster' ? 'bg-green-500/20 text-green-400' :
                                pattern.type === 'trigger' ? 'bg-red-500/20 text-red-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}>
                                {pattern.confidence}% confidence
                              </span>
                            </div>
                            <p className="text-lg text-gray-300 mb-4">{pattern.description}</p>
                            
                            {pattern.type === 'booster' && (
                              <div className="flex items-center gap-2 text-green-400">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="font-semibold">Keep doing this! It's helping you.</span>
                              </div>
                            )}
                            {pattern.type === 'trigger' && (
                              <div className="flex items-center gap-2 text-red-400">
                                <AlertCircle className="w-5 h-5" />
                                <span className="font-semibold">Try to minimize this when possible.</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Correlation Insights */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Activity Correlations</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Exercise → Mood</span>
                      <span className="text-green-400">+{
                        (moodEntries.filter(e => e.exercise).reduce((sum, e) => sum + e.mood, 0) / 
                        moodEntries.filter(e => e.exercise).length || 0).toFixed(1)
                      } avg</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Social → Mood</span>
                      <span className="text-blue-400">+{
                        (moodEntries.filter(e => e.social).reduce((sum, e) => sum + e.mood, 0) / 
                        moodEntries.filter(e => e.social).length || 0).toFixed(1)
                      } avg</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '75%' }} />
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Meditation → Anxiety</span>
                      <span className="text-purple-400">-{
                        Math.abs((moodEntries.filter(e => e.meditation).reduce((sum, e) => sum + e.anxiety, 0) / 
                        moodEntries.filter(e => e.meditation).length || 0) - 
                        (moodEntries.reduce((sum, e) => sum + e.anxiety, 0) / moodEntries.length)).toFixed(1)
                      } avg</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: '70%' }} />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {view === 'journal' && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Your Journal Entries</h2>
                <div className="space-y-4">
                  {moodEntries.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-4xl">{MOOD_EMOJIS[entry.mood]}</span>
                            <div>
                              <div className="font-bold text-lg">
                                {new Date(entry.timestamp).toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </div>
                              <div className="text-sm text-gray-400">
                                {new Date(entry.timestamp).toLocaleTimeString('en-US', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-400">Mood</div>
                          <div className="text-2xl font-bold text-cyan-400">{entry.mood}/10</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Energy</div>
                          <div className="text-2xl font-bold text-yellow-400">{entry.energy}/10</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Anxiety</div>
                          <div className="text-2xl font-bold text-red-400">{entry.anxiety}/10</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Sleep</div>
                          <div className="text-2xl font-bold text-purple-400">{entry.sleep}/10</div>
                        </div>
                      </div>

                      <div className="flex gap-2 mb-4">
                        {entry.exercise && (
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm flex items-center gap-1">
                            <Dumbbell className="w-4 h-4" /> Exercise
                          </span>
                        )}
                        {entry.social && (
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm flex items-center gap-1">
                            <Users className="w-4 h-4" /> Social
                          </span>
                        )}
                        {entry.meditation && (
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm flex items-center gap-1">
                            <Brain className="w-4 h-4" /> Meditation
                          </span>
                        )}
                      </div>

                      {entry.notes && (
                        <div className="p-4 bg-white/5 rounded-lg">
                          <div className="text-sm text-gray-400 mb-1">Notes:</div>
                          <div className="text-gray-300">{entry.notes}</div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Log Modal */}
        {renderQuickLogModal()}
      </div>
    </div>
  );
}
