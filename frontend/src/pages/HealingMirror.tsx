import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { analyzeText } from '../utils/api';
import { Eye, AlertCircle, TrendingUp, Lightbulb, Map, Sparkles } from 'lucide-react';

interface MirrorInsight {
  trigger: string;
  pattern: string;
  blindSpot: string;
  whyYouReact: string;
  deeperTruth: string;
  actionableInsight: string;
}

export default function HealingMirror() {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<MirrorInsight[]>([]);
  const [showResults, setShowResults] = useState(false);

  const generateInsights = (text: string, emotions: any, distortions: string[]): MirrorInsight[] => {
    const insights: MirrorInsight[] = [];
    
    // Pattern 1: Emotional Triggers
    if (emotions.anxiety > 0.5 || emotions.stress_score > 60) {
      insights.push({
        trigger: 'High Anxiety or Stress Response',
        pattern: 'You tend to catastrophize future outcomes',
        blindSpot: 'You may not realize that your mind is predicting worst-case scenarios as if they\'re certainties',
        whyYouReact: 'Your nervous system is trying to protect you by preparing for danger, but it\'s overactive. This likely stems from past experiences where being prepared felt safer than being surprised.',
        deeperTruth: 'The anxiety isn\'t about the future - it\'s about feeling out of control in the present. You\'re trying to control outcomes to feel safe.',
        actionableInsight: 'Notice when you say "What if..." and ask yourself: "What evidence do I have that this will happen?" Ground yourself in what\'s actually happening right now, not what might happen.',
      });
    }

    if (emotions.sadness > 0.5) {
      insights.push({
        trigger: 'Persistent Sadness',
        pattern: 'You may be grieving something you haven\'t acknowledged',
        blindSpot: 'Sadness often masks unmet needs or losses you haven\'t processed. You might be sad about who you\'re not becoming, not just what you\'ve lost.',
        whyYouReact: 'Sadness is your psyche\'s way of saying "something important is missing." It slows you down to process loss and reassess what matters.',
        deeperTruth: 'This sadness might be protecting you from anger or disappointment. It\'s safer to feel sad than to feel let down by yourself or others.',
        actionableInsight: 'Ask yourself: "What am I grieving?" It might be a dream, a relationship, or a version of yourself. Name it to begin healing it.',
      });
    }

    if (emotions.anger > 0.4) {
      insights.push({
        trigger: 'Anger Response',
        pattern: 'Your anger is a secondary emotion - it\'s protecting something vulnerable',
        blindSpot: 'Anger often covers hurt, fear, or feeling disrespected. You might not see that you\'re actually feeling powerless or unheard.',
        whyYouReact: 'Anger gives you energy and a sense of control when you feel threatened. It\'s easier to feel angry than to feel hurt or scared.',
        deeperTruth: 'The anger is pointing to a boundary that was crossed or a need that wasn\'t met. It\'s information, not a character flaw.',
        actionableInsight: 'When you feel angry, pause and ask: "What am I really protecting? What do I need that I\'m not getting?" The answer is usually underneath the anger.',
      });
    }

    // Pattern 2: Cognitive Distortions
    if (distortions.includes('catastrophizing')) {
      insights.push({
        trigger: 'Catastrophic Thinking Pattern',
        pattern: 'You jump to worst-case scenarios automatically',
        blindSpot: 'Your brain has learned that imagining the worst prepares you for pain. But it\'s causing more suffering than it prevents.',
        whyYouReact: 'This pattern likely developed when you experienced something unexpected and painful. Your mind decided: "If I imagine the worst, I won\'t be blindsided again."',
        deeperTruth: 'Catastrophizing is a trauma response. It\'s your mind trying to protect you, but it\'s stuck in the past.',
        actionableInsight: 'When you catastrophize, write down: 1) Worst case, 2) Best case, 3) Most likely case. Your brain needs to see there are other possibilities.',
      });
    }

    if (distortions.includes('overgeneralization')) {
      insights.push({
        trigger: 'All-or-Nothing Thinking',
        pattern: 'You see patterns where there might not be any',
        blindSpot: 'One bad experience becomes "this always happens to me." You\'re not seeing the exceptions.',
        whyYouReact: 'Generalizing helps your brain make quick decisions, but it\'s making you miss nuance. You might be protecting yourself from hope to avoid disappointment.',
        deeperTruth: 'This pattern keeps you stuck because if "nothing ever works," why try? It\'s a self-fulfilling prophecy.',
        actionableInsight: 'When you think "always" or "never," challenge it. Find ONE exception. That exception proves the pattern isn\'t absolute.',
      });
    }

    if (distortions.includes('self-blame')) {
      insights.push({
        trigger: 'Self-Blame Pattern',
        pattern: 'You take responsibility for things outside your control',
        blindSpot: 'Blaming yourself feels safer than accepting that some things are random or others\' fault. It gives you an illusion of control.',
        whyYouReact: 'If everything is your fault, then you can fix it. This pattern developed to help you feel less powerless.',
        deeperTruth: 'Self-blame is often a way to avoid feeling angry at others or accepting that life is unpredictable. It\'s a control mechanism.',
        actionableInsight: 'Ask yourself: "Would I blame a friend for this?" If not, you\'re holding yourself to an impossible standard. Practice self-compassion.',
      });
    }

    if (distortions.includes('mind reading')) {
      insights.push({
        trigger: 'Mind Reading Assumption',
        pattern: 'You assume you know what others think about you',
        blindSpot: 'You\'re projecting your own fears onto others. What you think they\'re thinking is usually what YOU think about yourself.',
        whyYouReact: 'Mind reading is an attempt to predict social threats. If you can guess what others think, you can protect yourself from rejection.',
        deeperTruth: 'The harsh judgments you imagine others making are the ones you make about yourself. This is your inner critic, not reality.',
        actionableInsight: 'When you catch yourself mind reading, ask: "What evidence do I have?" Then ask: "Is this what I think about myself?" The answer is usually yes.',
      });
    }

    // Pattern 3: Relationship Patterns
    if (text.toLowerCase().includes('always') || text.toLowerCase().includes('never')) {
      insights.push({
        trigger: 'Absolute Language in Relationships',
        pattern: 'You speak in absolutes when describing others\' behavior',
        blindSpot: 'This black-and-white thinking prevents you from seeing people\'s complexity. It also makes conflicts harder to resolve.',
        whyYouReact: 'Absolutes feel safer than nuance. If someone "always" does something, you can predict them. But it\'s not accurate.',
        deeperTruth: 'Using absolutes is often a sign you feel unheard. You exaggerate to make your point feel valid.',
        actionableInsight: 'Replace "always" and "never" with "sometimes" or "often." Notice how this changes the conversation and your feelings.',
      });
    }

    // Default insight if none triggered
    if (insights.length === 0) {
      insights.push({
        trigger: 'General Emotional Pattern',
        pattern: 'You\'re experiencing a mix of emotions',
        blindSpot: 'You might be focusing on one emotion while ignoring others that are equally important',
        whyYouReact: 'Your mind prioritizes certain emotions based on what felt safe to express in your past',
        deeperTruth: 'All emotions are information. The ones you ignore might be the most important.',
        actionableInsight: 'Notice which emotions you dismiss or minimize. Those are often the ones that need your attention most.',
      });
    }

    return insights.slice(0, 3); // Return top 3 insights
  };

  const handleAnalyze = async () => {
    if (!inputText.trim() || inputText.length < 50) {
      alert('Please write at least 50 characters to get meaningful insights');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeText(inputText);
      const mirrorInsights = generateInsights(inputText, result, result.cognitive_distortions);
      setInsights(mirrorInsights);
      setShowResults(true);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setInputText('');
    setInsights([]);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-4">🪞</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              The Healing Mirror
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            See Your Hidden Blind Spots
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Not therapy. Not motivation. A mirror to patterns you DON'T see.
            Deep psychological self-awareness.
          </p>
        </motion.div>

        {!showResults ? (
          /* Input Section */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                  <Eye className="w-6 h-6 text-cyan-400" />
                  What's on your mind?
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  Write about a situation, feeling, or pattern you've noticed. The more honest and detailed, the deeper the insights.
                </p>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Example: I always feel anxious before social events. I keep thinking people will judge me, and I end up avoiding them. I know it's irrational but I can't stop..."
                  className="w-full h-48 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">
                    {inputText.length} characters (min 50)
                  </span>
                  <span className="text-sm text-gray-500">
                    {inputText.length >= 50 ? '✓ Ready' : 'Keep writing...'}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || inputText.length < 50}
                size="lg"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600"
              >
                {isAnalyzing ? 'Analyzing Your Patterns...' : 'Show Me My Blind Spots'}
              </Button>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-300">
                  💡 <strong>Tip:</strong> The mirror works best when you write about recurring patterns, not one-time events. Think: "I always..." or "I tend to..."
                </p>
              </div>
            </Card>
          </motion.div>
        ) : (
          /* Results Section */
          <AnimatePresence mode="wait">
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Button
                onClick={handleReset}
                variant="secondary"
                className="mb-6"
              >
                ← Analyze Something Else
              </Button>

              <div className="space-y-6">
                {insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <Card className="p-6 md:p-8">
                      {/* Trigger */}
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-red-400" />
                          <h3 className="text-xl font-bold text-red-400">Trigger Detected</h3>
                        </div>
                        <p className="text-gray-300 text-lg">{insight.trigger}</p>
                      </div>

                      {/* Pattern */}
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-orange-400" />
                          <h3 className="text-xl font-bold text-orange-400">Your Pattern</h3>
                        </div>
                        <p className="text-gray-300">{insight.pattern}</p>
                      </div>

                      {/* Blind Spot */}
                      <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Eye className="w-5 h-5 text-yellow-400" />
                          <h3 className="text-xl font-bold text-yellow-400">Your Blind Spot</h3>
                        </div>
                        <p className="text-gray-300 font-medium">{insight.blindSpot}</p>
                      </div>

                      {/* Why You React */}
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Map className="w-5 h-5 text-blue-400" />
                          <h3 className="text-xl font-bold text-blue-400">Why You React This Way</h3>
                        </div>
                        <p className="text-gray-300">{insight.whyYouReact}</p>
                      </div>

                      {/* Deeper Truth */}
                      <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="w-5 h-5 text-purple-400" />
                          <h3 className="text-xl font-bold text-purple-400">The Deeper Truth</h3>
                        </div>
                        <p className="text-gray-300 italic">{insight.deeperTruth}</p>
                      </div>

                      {/* Actionable Insight */}
                      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-5 h-5 text-green-400" />
                          <h3 className="text-xl font-bold text-green-400">What You Can Do</h3>
                        </div>
                        <p className="text-gray-300">{insight.actionableInsight}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Summary */}
              <Card className="mt-8 p-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30">
                <h3 className="text-2xl font-bold mb-3">🪞 Mirror Reflection</h3>
                <p className="text-gray-300 mb-4">
                  These insights aren't judgments - they're observations. Your patterns developed to protect you, but they might not serve you anymore.
                </p>
                <p className="text-gray-400 text-sm">
                  Self-awareness is the first step to change. Now that you see these patterns, you can choose differently.
                </p>
              </Card>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
