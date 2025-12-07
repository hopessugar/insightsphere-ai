import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { ChefHat, Clock, Users, Sparkles } from 'lucide-react';

interface Recipe {
  name: string;
  emotion: string;
  icon: string;
  difficulty: string;
  prepTime: string;
  servings: string;
  ingredients: string[];
  instructions: string[];
  benefits: string[];
  color: string;
}

const recipes: Record<string, Recipe> = {
  anxiety: {
    name: 'Calm Mind Soufflé',
    emotion: 'Anxiety',
    icon: '😰',
    difficulty: 'Easy',
    prepTime: '5 minutes',
    servings: '1 anxious soul',
    color: 'from-amber-500 to-orange-500',
    ingredients: [
      '2 minutes of deep breathing (4-4-4 pattern)',
      '1 grounding exercise (5-4-3-2-1 technique)',
      '1 positive memory recall',
      'A pinch of self-compassion',
      '3 drops of present-moment awareness',
    ],
    instructions: [
      'Start by finding a comfortable position. Close your eyes if it feels safe.',
      'Mix in deep breathing: Inhale for 4 counts, hold for 4, exhale for 4. Repeat 5 times.',
      'Add grounding: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.',
      'Fold in a positive memory: Recall a moment when you felt safe and calm. Let it fill you.',
      'Season with self-compassion: Say "This anxiety is temporary. I am safe right now."',
      'Let it settle for 30 seconds. Notice how you feel.',
    ],
    benefits: [
      'Reduces physical tension',
      'Brings you back to the present',
      'Activates parasympathetic nervous system',
      'Reminds you of your resilience',
    ],
  },
  sadness: {
    name: 'Comfort Soul Stew',
    emotion: 'Sadness',
    icon: '😢',
    difficulty: 'Medium',
    prepTime: '10 minutes',
    servings: '1 heavy heart',
    color: 'from-blue-500 to-purple-500',
    ingredients: [
      '5 minutes of gentle movement (stretching or walking)',
      '2 cups of self-validation',
      '1 comforting activity (music, tea, or soft blanket)',
      '3 tablespoons of tears (if needed)',
      'A handful of kind words to yourself',
    ],
    instructions: [
      'Begin by acknowledging your sadness. Say "It\'s okay to feel this way."',
      'Gently move your body. Stretch, walk, or sway to release stuck emotions.',
      'Brew your comfort: Put on music you love, make tea, or wrap yourself in something soft.',
      'Let tears flow if they come. They\'re releasing what you\'ve been holding.',
      'Speak kindly to yourself: "I\'m doing my best. This feeling will pass."',
      'Rest in this gentle space for as long as you need.',
    ],
    benefits: [
      'Validates your emotions',
      'Releases emotional tension',
      'Activates self-soothing',
      'Reminds you that sadness is temporary',
    ],
  },
  anger: {
    name: 'Rage Release Reduction',
    emotion: 'Anger',
    icon: '😠',
    difficulty: 'Medium',
    prepTime: '8 minutes',
    servings: '1 fired-up person',
    color: 'from-red-500 to-pink-500',
    ingredients: [
      '3 minutes of intense physical movement',
      '2 minutes of journaling or venting',
      '1 boundary-setting statement',
      'A dash of perspective-taking',
      '5 deep cooling breaths',
    ],
    instructions: [
      'Channel the energy: Do jumping jacks, punch a pillow, or go for a brisk walk.',
      'Write it out: Scribble your angry thoughts on paper. Don\'t filter.',
      'Set a boundary: Identify what you need. "I need respect" or "I need space."',
      'Shift perspective: Ask "What am I really protecting?" Often anger guards hurt.',
      'Cool down: Take 5 slow, deep breaths. Imagine releasing the heat with each exhale.',
      'Check in: Notice if the intensity has shifted.',
    ],
    benefits: [
      'Releases pent-up energy safely',
      'Clarifies what you need',
      'Prevents reactive behavior',
      'Reveals deeper emotions',
    ],
  },
  stress: {
    name: 'Pressure Cooker Antidote',
    emotion: 'Stress',
    icon: '😫',
    difficulty: 'Easy',
    prepTime: '7 minutes',
    servings: '1 overwhelmed mind',
    color: 'from-yellow-500 to-orange-500',
    ingredients: [
      '1 brain dump (write everything down)',
      '2 minutes of progressive muscle relaxation',
      '1 priority identification',
      '3 "I can only control..." statements',
      'A sprinkle of time boundaries',
    ],
    instructions: [
      'Dump it all: Write every task, worry, and thought on paper. Get it out of your head.',
      'Relax your body: Tense and release each muscle group from toes to head.',
      'Pick ONE thing: What\'s the most important task right now? Focus only on that.',
      'Release control: Say "I can only control my actions, not outcomes."',
      'Set a boundary: "I will work for 25 minutes, then take a 5-minute break."',
      'Take that break. You\'ve earned it.',
    ],
    benefits: [
      'Clears mental clutter',
      'Reduces physical tension',
      'Focuses scattered energy',
      'Prevents burnout',
    ],
  },
  loneliness: {
    name: 'Connection Casserole',
    emotion: 'Loneliness',
    icon: '😔',
    difficulty: 'Medium',
    prepTime: '15 minutes',
    servings: '1 isolated heart',
    color: 'from-indigo-500 to-purple-500',
    ingredients: [
      '1 reach-out message to someone',
      '5 minutes of self-companionship meditation',
      '1 community activity (online or in-person)',
      '2 cups of self-love affirmations',
      'A generous portion of patience',
    ],
    instructions: [
      'Reach out: Text or call someone. Even "Hi, thinking of you" counts.',
      'Be with yourself: Sit quietly and imagine giving yourself a hug. You\'re not alone.',
      'Join something: Comment on a post, join a Discord, or attend a meetup.',
      'Affirm yourself: "I am worthy of connection. People care about me."',
      'Be patient: Connection takes time. You\'re taking the first steps.',
      'Celebrate the effort, not just the outcome.',
    ],
    benefits: [
      'Initiates connection',
      'Builds self-relationship',
      'Reminds you you\'re not alone',
      'Creates momentum for more connection',
    ],
  },
  joy: {
    name: 'Happiness Amplifier',
    emotion: 'Joy',
    icon: '😊',
    difficulty: 'Easy',
    prepTime: '5 minutes',
    servings: '1 grateful soul',
    color: 'from-green-500 to-cyan-500',
    ingredients: [
      '3 things you\'re grateful for right now',
      '1 moment of savoring',
      '2 minutes of sharing your joy',
      'A handful of celebration',
      'Unlimited smiles',
    ],
    instructions: [
      'List gratitude: Write or think of 3 specific things you\'re grateful for.',
      'Savor this moment: Close your eyes and really feel the joy. Let it fill you.',
      'Share it: Tell someone what made you happy, or post about it.',
      'Celebrate yourself: Dance, jump, or just smile big. You deserve this!',
      'Take a mental snapshot: Remember this feeling for harder days.',
      'Carry this lightness with you.',
    ],
    benefits: [
      'Amplifies positive emotions',
      'Creates lasting positive memories',
      'Spreads joy to others',
      'Builds resilience for tough times',
    ],
  },
};

export default function EmotionalRecipes() {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const emotions = [
    { key: 'anxiety', label: 'Anxious', icon: '😰', color: 'from-amber-500 to-orange-500' },
    { key: 'sadness', label: 'Sad', icon: '😢', color: 'from-blue-500 to-purple-500' },
    { key: 'anger', label: 'Angry', icon: '😠', color: 'from-red-500 to-pink-500' },
    { key: 'stress', label: 'Stressed', icon: '😫', color: 'from-yellow-500 to-orange-500' },
    { key: 'loneliness', label: 'Lonely', icon: '😔', color: 'from-indigo-500 to-purple-500' },
    { key: 'joy', label: 'Joyful', icon: '😊', color: 'from-green-500 to-cyan-500' },
  ];

  const selectedRecipe = selectedEmotion ? recipes[selectedEmotion] : null;

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-4">🧑‍🍳</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Emotional Recipes
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Cook Your Feelings into Solutions
          </p>
          <p className="text-gray-400">
            Select how you're feeling, and we'll give you a recipe to transform it
          </p>
        </motion.div>

        {!selectedEmotion ? (
          /* Emotion Selection */
          <div className="grid md:grid-cols-3 gap-6">
            {emotions.map((emotion, index) => (
              <motion.div
                key={emotion.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setSelectedEmotion(emotion.key)}
                >
                  <div className="text-center p-6">
                    <div className="text-6xl mb-4">{emotion.icon}</div>
                    <h3 className="text-2xl font-bold mb-2">
                      <span className={`bg-gradient-to-r ${emotion.color} bg-clip-text text-transparent`}>
                        {emotion.label}
                      </span>
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Click for your recipe
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Recipe Display */
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedEmotion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Button
                onClick={() => {
                  setSelectedEmotion(null);
                  setIsCompleted(false);
                }}
                variant="secondary"
                className="mb-6"
              >
                ← Back to Emotions
              </Button>

              <Card className="p-8">
                {/* Recipe Header */}
                <div className="text-center mb-8">
                  <div className="text-7xl mb-4">{selectedRecipe!.icon}</div>
                  <h2 className="text-4xl font-bold mb-2">
                    <span className={`bg-gradient-to-r ${selectedRecipe!.color} bg-clip-text text-transparent`}>
                      {selectedRecipe!.name}
                    </span>
                  </h2>
                  <p className="text-gray-400">
                    A recipe to transform {selectedRecipe!.emotion.toLowerCase()}
                  </p>
                </div>

                {/* Recipe Info */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>Prep: {selectedRecipe!.prepTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <ChefHat className="w-5 h-5 text-secondary" />
                    <span>{selectedRecipe!.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Users className="w-5 h-5 text-accent" />
                    <span>Serves: {selectedRecipe!.servings}</span>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary" />
                    Ingredients
                  </h3>
                  <ul className="space-y-2">
                    {selectedRecipe!.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-primary mt-1">✓</span>
                        <span className="text-gray-300">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4">Instructions</h3>
                  <ol className="space-y-4">
                    {selectedRecipe!.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-4">
                        <span className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r ${selectedRecipe!.color} flex items-center justify-center font-bold text-white`}>
                          {index + 1}
                        </span>
                        <span className="text-gray-300 pt-1">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Benefits */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4">Benefits</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedRecipe!.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-300">
                        <span className="text-green-500">●</span>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Completion */}
                <div className="text-center">
                  {!isCompleted ? (
                    <Button
                      onClick={() => setIsCompleted(true)}
                      size="lg"
                      className={`bg-gradient-to-r ${selectedRecipe!.color}`}
                    >
                      I've Completed This Recipe! 🎉
                    </Button>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-green-500/20 border border-green-500/50 rounded-lg p-6"
                    >
                      <div className="text-5xl mb-3">🎉</div>
                      <h4 className="text-2xl font-bold text-green-400 mb-2">
                        Well Done, Chef!
                      </h4>
                      <p className="text-gray-300">
                        You've taken care of yourself. That takes courage and commitment.
                      </p>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
