import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { 
  Calendar, 
  Clock, 
  Heart, 
  Brain, 
  Activity, 
  Sun, 
  Moon, 
  Coffee,
  Utensils,
  Dumbbell,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface QuizAnswer {
  question: string;
  answer: string;
}

interface WellnessPlan {
  condition: string;
  severity: string;
  dailySchedule: ScheduleItem[];
  mindExercises: Exercise[];
  lifestyleTips: LifestyleTip[];
  weeklyGoals: string[];
}

interface ScheduleItem {
  time: string;
  activity: string;
  description: string;
  duration: string;
  icon: string;
}

interface Exercise {
  name: string;
  description: string;
  duration: string;
  frequency: string;
  benefits: string[];
}

interface LifestyleTip {
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

const quizQuestions = [
  {
    id: 1,
    question: "What is your primary mental health concern?",
    subtitle: "Select the condition that affects you most",
    options: [
      "Generalized Anxiety Disorder (GAD)",
      "Panic Disorder / Panic Attacks",
      "Social Anxiety Disorder",
      "Major Depressive Disorder",
      "Persistent Depressive Disorder (Dysthymia)",
      "Bipolar Disorder",
      "Obsessive-Compulsive Disorder (OCD)",
      "Post-Traumatic Stress Disorder (PTSD)",
      "Attention-Deficit/Hyperactivity Disorder (ADHD)",
      "Insomnia / Sleep Disorders",
      "Eating Disorders (Anorexia, Bulimia, Binge Eating)",
      "Substance Use Disorder",
      "Borderline Personality Disorder (BPD)",
      "Seasonal Affective Disorder (SAD)",
      "Burnout / Chronic Stress",
      "Grief / Bereavement",
      "Other / Not Sure"
    ]
  },
  {
    id: 2,
    question: "How long have you been experiencing these symptoms?",
    subtitle: "Duration helps determine treatment approach",
    options: [
      "Less than 2 weeks",
      "2 weeks to 1 month",
      "1-3 months",
      "3-6 months",
      "6 months to 1 year",
      "1-2 years",
      "More than 2 years",
      "On and off for years"
    ]
  },
  {
    id: 3,
    question: "Rate the severity of your symptoms (0-10 scale)",
    subtitle: "0 = No impact, 10 = Completely debilitating",
    type: "scale",
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
  },
  {
    id: 4,
    question: "Which symptoms do you experience most frequently?",
    subtitle: "Select all that apply",
    type: "multiple",
    options: [
      "Persistent worry or fear",
      "Panic attacks or physical anxiety symptoms",
      "Sadness or hopelessness",
      "Loss of interest in activities",
      "Difficulty concentrating",
      "Racing thoughts",
      "Intrusive thoughts or compulsions",
      "Flashbacks or nightmares",
      "Difficulty falling or staying asleep",
      "Excessive sleeping or fatigue",
      "Changes in appetite or weight",
      "Irritability or anger",
      "Social withdrawal or isolation",
      "Suicidal thoughts (seek immediate help)",
      "Physical symptoms (headaches, stomach issues)",
      "Difficulty making decisions"
    ]
  },
  {
    id: 5,
    question: "What time of day are your symptoms worst?",
    subtitle: "This helps optimize your daily schedule",
    options: [
      "Early morning (5-9 AM)",
      "Late morning (9 AM-12 PM)",
      "Afternoon (12-5 PM)",
      "Evening (5-9 PM)",
      "Night (9 PM-12 AM)",
      "Late night (12-5 AM)",
      "Varies throughout the day",
      "Consistent all day"
    ]
  },
  {
    id: 6,
    question: "Are you currently receiving any treatment?",
    subtitle: "This plan will complement, not replace, professional care",
    options: [
      "No treatment currently",
      "Therapy/Counseling only",
      "Medication only",
      "Both therapy and medication",
      "Alternative treatments (acupuncture, etc.)",
      "Self-help strategies only",
      "Previously treated, not currently"
    ]
  },
  {
    id: 7,
    question: "What triggers or worsens your symptoms?",
    subtitle: "Select all that apply",
    type: "multiple",
    options: [
      "Work or school stress",
      "Relationship conflicts",
      "Financial worries",
      "Health concerns",
      "Social situations",
      "Being alone",
      "Lack of sleep",
      "Caffeine or stimulants",
      "Alcohol or substances",
      "Certain memories or reminders",
      "Seasonal changes",
      "Lack of routine",
      "Physical illness",
      "News or social media",
      "Uncertainty or change",
      "Not sure / Can't identify"
    ]
  },
  {
    id: 8,
    question: "How is your current sleep quality?",
    subtitle: "Sleep is fundamental to mental health",
    options: [
      "Excellent - 7-9 hours, restful",
      "Good - Mostly adequate sleep",
      "Fair - Some difficulty sleeping",
      "Poor - Frequent sleep problems",
      "Very poor - Severe insomnia",
      "Excessive - Sleeping too much (10+ hours)",
      "Irregular - Sleep schedule varies greatly"
    ]
  },
  {
    id: 9,
    question: "How would you rate your current physical activity level?",
    subtitle: "Exercise significantly impacts mental health",
    options: [
      "Very active - Exercise 5+ times/week",
      "Active - Exercise 3-4 times/week",
      "Moderately active - Exercise 1-2 times/week",
      "Lightly active - Occasional walks",
      "Sedentary - Little to no exercise",
      "Unable to exercise due to symptoms"
    ]
  },
  {
    id: 10,
    question: "How is your social support system?",
    subtitle: "Social connection is crucial for recovery",
    options: [
      "Strong - Close friends/family I can rely on",
      "Adequate - Some supportive relationships",
      "Limited - Few people to talk to",
      "Weak - Feel isolated or alone",
      "Strained - Relationships are difficult",
      "None - Completely isolated"
    ]
  },
  {
    id: 11,
    question: "What coping strategies have you tried before?",
    subtitle: "Select all that apply",
    type: "multiple",
    options: [
      "Deep breathing exercises",
      "Meditation or mindfulness",
      "Journaling",
      "Physical exercise",
      "Talking to friends/family",
      "Professional therapy",
      "Medication",
      "Yoga or stretching",
      "Creative activities (art, music)",
      "Reading self-help books",
      "Support groups",
      "Prayer or spiritual practices",
      "Time in nature",
      "Limiting caffeine/alcohol",
      "None - Haven't tried coping strategies"
    ]
  },
  {
    id: 12,
    question: "How much time can you realistically dedicate to wellness activities daily?",
    subtitle: "Be honest - consistency matters more than duration",
    options: [
      "5-15 minutes",
      "15-30 minutes",
      "30-45 minutes",
      "45-60 minutes",
      "1-2 hours",
      "2+ hours",
      "Varies day to day"
    ]
  },
  {
    id: 13,
    question: "What are your main goals for this wellness plan?",
    subtitle: "Select your top 3 priorities",
    type: "multiple",
    maxSelections: 3,
    options: [
      "Reduce anxiety and worry",
      "Improve mood and reduce depression",
      "Sleep better",
      "Increase energy and motivation",
      "Better focus and concentration",
      "Manage stress effectively",
      "Build healthy routines",
      "Improve relationships",
      "Process trauma or difficult emotions",
      "Reduce intrusive thoughts",
      "Develop coping skills",
      "Increase self-esteem",
      "Find purpose and meaning",
      "Manage anger or irritability",
      "Overcome avoidance behaviors"
    ]
  },
  {
    id: 14,
    question: "What type of activities do you prefer?",
    subtitle: "Your plan will be tailored to your preferences",
    type: "multiple",
    options: [
      "Physical/Active (exercise, sports)",
      "Mindful/Meditative (breathing, yoga)",
      "Creative (art, music, writing)",
      "Social (group activities, talking)",
      "Cognitive (reading, learning, puzzles)",
      "Nature-based (outdoors, gardening)",
      "Structured (schedules, routines)",
      "Flexible (spontaneous, varied)"
    ]
  },
  {
    id: 15,
    question: "Do you have any barriers to following a wellness plan?",
    subtitle: "We'll work around these constraints",
    type: "multiple",
    options: [
      "Limited time due to work/school",
      "Financial constraints",
      "Physical health limitations",
      "Lack of motivation or energy",
      "No private space at home",
      "Caregiving responsibilities",
      "Lack of transportation",
      "Don't know where to start",
      "Fear of judgment",
      "Previous failed attempts",
      "No barriers - Ready to commit"
    ]
  }
];

export default function WellnessPlan() {
  const [step, setStep] = useState<'intro' | 'quiz' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [plan, setPlan] = useState<WellnessPlan | null>(null);
  const [multipleSelections, setMultipleSelections] = useState<string[]>([]);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);
  const [isSavingPlan, setIsSavingPlan] = useState(false);

  // Load latest wellness plan from database on mount
  useEffect(() => {
    const loadLatestPlan = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setIsLoadingPlan(false);
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${API_URL}/api/wellness-plans/latest`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data) {
            // Transform API data to match WellnessPlan interface
            setPlan({
              condition: data.quiz_responses.condition,
              severity: data.quiz_responses.severity,
              dailySchedule: data.plan.daily_schedule || [],
              mindExercises: data.plan.mind_exercises || [],
              lifestyleTips: data.plan.lifestyle_tips || [],
              weeklyGoals: data.plan.weekly_goals || []
            });
            setStep('results');
          }
        }
      } catch (error) {
        console.error('Failed to load wellness plan:', error);
      } finally {
        setIsLoadingPlan(false);
      }
    };

    loadLatestPlan();
  }, []);

  const handleStartQuiz = () => {
    setStep('quiz');
    setCurrentQuestion(0);
    setAnswers([]);
    setMultipleSelections([]);
  };

  const handleMultipleToggle = (option: string) => {
    const currentQ = quizQuestions[currentQuestion];
    const maxSelections = currentQ.maxSelections || 999;
    
    if (multipleSelections.includes(option)) {
      setMultipleSelections(multipleSelections.filter(s => s !== option));
    } else {
      if (multipleSelections.length < maxSelections) {
        setMultipleSelections([...multipleSelections, option]);
      }
    }
  };

  const handleAnswer = async (answer: string) => {
    const currentQ = quizQuestions[currentQuestion];
    
    let finalAnswer = answer;
    if (currentQ.type === 'multiple') {
      finalAnswer = multipleSelections.join(', ');
    }

    const newAnswers = [
      ...answers,
      { question: currentQ.question, answer: finalAnswer }
    ];
    setAnswers(newAnswers);
    setMultipleSelections([]);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Generate plan based on answers
      const generatedPlan = generateWellnessPlan(newAnswers);
      setPlan(generatedPlan);
      
      // Save plan to database
      await savePlanToDatabase(newAnswers, generatedPlan);
      
      setStep('results');
    }
  };

  const savePlanToDatabase = async (quizAnswers: QuizAnswer[], generatedPlan: WellnessPlan) => {
    try {
      setIsSavingPlan(true);
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.warn('No auth token - plan not saved to database');
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      // Transform quiz answers to match API schema
      const quizResponses: any = {};
      quizAnswers.forEach((qa, index) => {
        const questionId = quizQuestions[index].id;
        switch (questionId) {
          case 1: quizResponses.condition = qa.answer; break;
          case 2: quizResponses.duration = qa.answer; break;
          case 3: quizResponses.severity = parseInt(qa.answer); break;
          case 4: quizResponses.symptoms = qa.answer.split(', '); break;
          case 5: quizResponses.worst_time = qa.answer; break;
          case 6: quizResponses.current_treatment = qa.answer; break;
          case 7: quizResponses.triggers = qa.answer.split(', '); break;
          case 8: quizResponses.sleep_quality = qa.answer; break;
          case 9: quizResponses.activity_level = qa.answer; break;
          case 10: quizResponses.social_support = qa.answer; break;
          case 11: quizResponses.coping_strategies = qa.answer.split(', '); break;
          case 12: quizResponses.time_available = qa.answer; break;
          case 13: quizResponses.goals = qa.answer.split(', '); break;
          case 14: quizResponses.preferences = qa.answer.split(', '); break;
          case 15: quizResponses.barriers = qa.answer.split(', '); break;
        }
      });

      const response = await fetch(`${API_URL}/api/wellness-plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          quiz_responses: quizResponses,
          plan: {
            daily_schedule: generatedPlan.dailySchedule,
            mind_exercises: generatedPlan.mindExercises,
            lifestyle_tips: generatedPlan.lifestyleTips,
            weekly_goals: generatedPlan.weeklyGoals
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Failed to save wellness plan:', error);
      }
    } catch (error) {
      console.error('Failed to save wellness plan:', error);
    } finally {
      setIsSavingPlan(false);
    }
  };

  const handleMultipleNext = () => {
    if (multipleSelections.length > 0) {
      handleAnswer(multipleSelections.join(', '));
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
      setMultipleSelections([]);
    }
  };

  const handleRestart = () => {
    setStep('intro');
    setCurrentQuestion(0);
    setAnswers([]);
    setPlan(null);
    setMultipleSelections([]);
  };

  const generateWellnessPlan = (quizAnswers: QuizAnswer[]): WellnessPlan => {
    const condition = quizAnswers[0].answer;
    // const duration = quizAnswers[1].answer; // Available for future use
    const severity = parseInt(quizAnswers[2].answer);
    // const symptoms = quizAnswers[3].answer.split(', '); // Available for future use
    const worstTime = quizAnswers[4].answer;
    const currentTreatment = quizAnswers[5].answer;
    const triggers = quizAnswers[6].answer.split(', ');
    const sleepQuality = quizAnswers[7].answer;
    const activityLevel = quizAnswers[8].answer;
    const socialSupport = quizAnswers[9].answer;
    // const copingStrategies = quizAnswers[10].answer.split(', '); // Available for future use
    // const timeAvailable = quizAnswers[11].answer; // Available for future use
    const goals = quizAnswers[12].answer.split(', ');
    const preferences = quizAnswers[13].answer.split(', ');
    // const barriers = quizAnswers[14].answer.split(', '); // Available for future use

    // Generate comprehensive personalized daily schedule
    const dailySchedule: ScheduleItem[] = [];
    
    // Morning routine (adjusted based on worst time)
    if (!worstTime.includes("Early morning")) {
      dailySchedule.push({
        time: "6:00-6:30 AM",
        activity: "Wake Up & Light Exposure",
        description: "Open curtains immediately. Get 10-15 minutes of natural light to regulate circadian rhythm and boost serotonin. This is critical for mood regulation.",
        duration: "15 min",
        icon: "sun"
      });
    } else {
      dailySchedule.push({
        time: "6:00-6:30 AM",
        activity: "Gentle Wake-Up Routine",
        description: "Use a sunrise alarm clock. Stay in bed for 5 minutes doing gentle stretches. Morning anxiety is common - acknowledge it without judgment.",
        duration: "15 min",
        icon: "sun"
      });
    }

    dailySchedule.push({
      time: "6:30-7:00 AM",
      activity: "Morning Mind-Body Practice",
      description: condition.includes("Anxiety") || condition.includes("Panic") 
        ? "4-7-8 breathing (4 rounds) + body scan. This activates your parasympathetic nervous system and reduces morning cortisol."
        : condition.includes("Depression") || condition.includes("Dysthymia")
        ? "Gratitude journaling (3 things) + gentle movement. Even small positive focus rewires neural pathways over time."
        : condition.includes("ADHD")
        ? "5-minute meditation focusing on breath counting. This builds attention muscle. Start with just 2 minutes if needed."
        : "Mindfulness meditation or gentle yoga. Choose what feels sustainable today.",
      duration: "20-30 min",
      icon: "brain"
    });

    dailySchedule.push({
      time: "7:00-7:45 AM",
      activity: "Nourishing Breakfast",
      description: "Protein + complex carbs + healthy fats. Examples: eggs with whole grain toast and avocado, or Greek yogurt with berries and nuts. Avoid high sugar - it destabilizes mood. Eat mindfully, not while scrolling.",
      duration: "30-45 min",
      icon: "utensils"
    });

    dailySchedule.push({
      time: "8:00-9:00 AM",
      activity: "Morning Medication/Supplements (if applicable)",
      description: currentTreatment.includes("Medication") 
        ? "Take prescribed medication with food. Set a daily alarm. Track side effects in a journal to discuss with your doctor."
        : "Consider discussing with a doctor: Vitamin D (2000 IU), Omega-3 (1000mg EPA/DHA), B-Complex. These support neurotransmitter function.",
      duration: "5 min",
      icon: "coffee"
    });

    // Mid-morning
    if (worstTime.includes("Late morning")) {
      dailySchedule.push({
        time: "9:00-10:00 AM",
        activity: "Symptom Management Window",
        description: "Your symptoms peak now. Use your strongest coping tools: grounding techniques, call your support person, or take a brief walk. Don't push through - address it.",
        duration: "As needed",
        icon: "activity"
      });
    }

    dailySchedule.push({
      time: "10:00 AM-12:00 PM",
      activity: "Focused Work/Activity Block",
      description: condition.includes("ADHD")
        ? "Use Pomodoro: 25 min work, 5 min break. Remove all distractions. One task at a time. Use a timer app."
        : condition.includes("Depression")
        ? "Behavioral activation: Do ONE meaningful task, even if you don't feel like it. Action creates motivation, not vice versa."
        : "Peak cognitive hours. Tackle your most important tasks. Take a 5-minute break every hour to prevent burnout.",
      duration: "2 hours",
      icon: "brain"
    });

    // Lunch
    dailySchedule.push({
      time: "12:00-1:00 PM",
      activity: "Mindful Lunch + Movement",
      description: "Eat away from screens. Chew slowly. Notice flavors. After eating, take a 10-15 minute walk outside if possible. Movement + daylight = mood boost.",
      duration: "45-60 min",
      icon: "utensils"
    });

    // Afternoon
    if (worstTime.includes("Afternoon")) {
      dailySchedule.push({
        time: "1:00-2:00 PM",
        activity: "Afternoon Slump Management",
        description: "Energy dips are normal. Options: 10-minute power nap (set alarm), cold water on face, brief walk, or energizing breathing (breath of fire). Avoid caffeine after 2 PM.",
        duration: "15-30 min",
        icon: "activity"
      });
    }

    dailySchedule.push({
      time: "2:00-5:00 PM",
      activity: "Afternoon Activities",
      description: preferences.includes("Creative")
        ? "Creative expression time: art, music, writing. This processes emotions non-verbally and activates different brain regions."
        : preferences.includes("Social")
        ? "Social connection time: call a friend, attend a group, or work in a coffee shop. Connection is medicine."
        : "Continue work/tasks with regular breaks. Stay hydrated. Check in with your body every hour.",
      duration: "2-3 hours",
      icon: "brain"
    });

    // Evening
    dailySchedule.push({
      time: "5:00-6:00 PM",
      activity: "Exercise Session (Critical)",
      description: activityLevel.includes("Sedentary") || activityLevel.includes("Lightly active")
        ? "START SMALL: 10-minute walk. That's it. Build from there. Exercise is as effective as medication for mild-moderate depression. Non-negotiable."
        : activityLevel.includes("Moderately active")
        ? "30 minutes moderate exercise: brisk walk, bike, swim, or yoga. Aim for slight breathlessness. This releases endorphins and reduces cortisol."
        : "Continue your current routine. Mix cardio (3x/week) with strength training (2x/week). Exercise is your most powerful tool.",
      duration: "20-45 min",
      icon: "dumbbell"
    });

    dailySchedule.push({
      time: "6:00-7:30 PM",
      activity: "Dinner & Social Time",
      description: socialSupport.includes("isolated") || socialSupport.includes("alone")
        ? "Eat a balanced dinner. If alone, call someone while cooking or eating. Isolation worsens symptoms. Join an online community or support group."
        : "Share a meal with others if possible. Social eating reduces stress. Keep conversation light and positive during meals.",
      duration: "60-90 min",
      icon: "utensils"
    });

    // Evening wind-down
    if (worstTime.includes("Evening") || worstTime.includes("Night")) {
      dailySchedule.push({
        time: "7:30-8:30 PM",
        activity: "Evening Symptom Management",
        description: "Symptoms peak now. Use your evening protocol: progressive muscle relaxation, warm bath, calming tea (chamomile, valerian), or call your support person. Avoid being alone if possible.",
        duration: "30-60 min",
        icon: "moon"
      });
    }

    dailySchedule.push({
      time: "8:00-9:00 PM",
      activity: "Wind-Down Routine Begins",
      description: "Dim all lights (use lamps, not overhead). No screens (blue light blocks melatonin). Options: read physical books, gentle stretching, bath, journaling, or quiet conversation.",
      duration: "60 min",
      icon: "moon"
    });

    dailySchedule.push({
      time: "9:00-9:30 PM",
      activity: "Evening Reflection & Planning",
      description: "Journal: 3 things that went well today (even tiny things). 1 thing you're grateful for. Tomorrow's top 3 priorities. This creates closure and reduces nighttime rumination.",
      duration: "15-30 min",
      icon: "brain"
    });

    dailySchedule.push({
      time: "9:30-10:00 PM",
      activity: "Sleep Preparation Ritual",
      description: sleepQuality.includes("poor") || sleepQuality.includes("insomnia")
        ? "STRICT routine: Same time nightly. Cool room (65-68°F). Darkness (blackout curtains/eye mask). White noise. 4-7-8 breathing in bed. If not asleep in 20 min, get up and read until drowsy."
        : "Consistent bedtime routine: brush teeth, skincare, comfortable clothes. Keep bedroom cool and dark. Aim for 7-9 hours sleep.",
      duration: "30 min",
      icon: "moon"
    });

    dailySchedule.push({
      time: "10:00-10:30 PM",
      activity: "Lights Out",
      description: "In bed, lights off. If racing thoughts: don't fight them. Observe them like clouds passing. Use body scan meditation. If severe insomnia persists, discuss sleep medication with doctor.",
      duration: "Sleep time",
      icon: "moon"
    });

    // Generate comprehensive, evidence-based mind exercises
    const mindExercises: Exercise[] = [];
    
    // Anxiety-specific exercises
    if (condition.includes("Anxiety") || condition.includes("Panic") || condition.includes("GAD")) {
      mindExercises.push(
        {
          name: "4-7-8 Breathing (Dr. Andrew Weil Method)",
          description: "Sit comfortably. Exhale completely through mouth. Close mouth, inhale through nose for 4 counts. Hold breath for 7 counts. Exhale completely through mouth for 8 counts (making whoosh sound). This is ONE cycle. Repeat 4 cycles. The 7-count hold is key - it allows oxygen to fill bloodstream and activates parasympathetic nervous system. Use during panic attacks or before anxiety-provoking situations.",
          duration: "5-8 minutes",
          frequency: "Minimum 3x daily: morning, before stressful events, bedtime. During panic: repeat until heart rate normalizes",
          benefits: ["Reduces heart rate by 10-20 BPM within 2 minutes", "Stops panic attacks", "Lowers cortisol", "Improves HRV (heart rate variability)", "Can prevent panic attacks if done regularly"]
        },
        {
          name: "Progressive Muscle Relaxation (PMR) - Jacobson Technique",
          description: "Lie down or sit comfortably. Starting with toes: tense muscles as hard as you can for 5 seconds, then release completely for 10 seconds. Notice the difference between tension and relaxation. Move up body: feet, calves, thighs, buttocks, stomach, chest, hands, arms, shoulders, neck, face. Tense each group individually. The contrast teaches your body what relaxation feels like. Most anxiety sufferers hold chronic tension without realizing it.",
          duration: "15-20 minutes",
          frequency: "Once daily (evening recommended). During high anxiety: focus on areas holding most tension",
          benefits: ["Releases chronic muscle tension", "Reduces physical anxiety symptoms", "Improves body awareness", "Aids sleep", "Reduces headaches and jaw clenching"]
        },
        {
          name: "Grounding 5-4-3-2-1 Technique",
          description: "When panic/anxiety hits: Name out loud 5 things you SEE (blue chair, crack in wall, etc.). 4 things you can TOUCH (soft fabric, cold floor). 3 things you HEAR (traffic, birds, AC hum). 2 things you SMELL (coffee, soap). 1 thing you TASTE (mint, water). Go slowly. Describe in detail. This interrupts the amygdala hijack and brings you back to present moment. Anxiety is always about future or past - never present.",
          duration: "3-5 minutes",
          frequency: "As needed during anxiety/panic. Practice daily when calm so it's automatic during crisis",
          benefits: ["Stops panic attacks within minutes", "Interrupts catastrophic thinking", "Grounds you in present", "Reduces dissociation", "Portable - works anywhere"]
        },
        {
          name: "Worry Time Scheduling (Cognitive Behavioral Technique)",
          description: "Set aside 15 minutes daily (same time, not before bed) as designated 'worry time.' When anxious thoughts arise during day, write them down and tell yourself 'I'll think about this during worry time.' During worry time, review your list and problem-solve or challenge thoughts. This contains worry and proves most worries don't materialize. After 2 weeks, you'll notice you forget most worries by worry time.",
          duration: "15 minutes",
          frequency: "Once daily, same time (mid-afternoon ideal)",
          benefits: ["Reduces rumination by 60%", "Teaches worry control", "Improves sleep (no bedtime worry)", "Increases productivity", "Most worries resolve themselves"]
        }
      );
    }

    // Depression-specific exercises
    if (condition.includes("Depression") || condition.includes("Dysthymia") || condition.includes("Bipolar")) {
      mindExercises.push(
        {
          name: "Behavioral Activation Protocol",
          description: "Depression says 'I'll do it when I feel better.' Reality: Action creates motivation. Each morning, schedule 3 activities: 1 necessary (shower, meal), 1 pleasurable (music, walk), 1 meaningful (help someone, work on goal). Do them REGARDLESS of mood. Rate mood before and after each activity (0-10). You'll see mood improves AFTER action, not before. This is the most evidence-based depression treatment after medication.",
          duration: "Plan: 10 min. Activities: varies",
          frequency: "Daily planning + 3 scheduled activities. Non-negotiable even on worst days",
          benefits: ["Breaks inactivity-depression cycle", "Increases dopamine naturally", "Provides sense of accomplishment", "As effective as antidepressants for mild-moderate depression", "Builds momentum"]
        },
        {
          name: "Gratitude Journaling (Specific Method)",
          description: "Every morning, write 3 specific things you're grateful for. NOT generic ('family, health'). Specific: 'My friend texted to check on me.' 'Hot shower felt good.' 'Didn't have panic attack today.' Include WHY you're grateful. Depression brain focuses on negative - this rewires neural pathways. After 21 days, your brain will start noticing positive automatically. Keep journal by bed.",
          duration: "10-15 minutes",
          frequency: "Every morning before checking phone. Miss a day? Don't quit - restart tomorrow",
          benefits: ["Rewires negative bias", "Increases serotonin and dopamine", "Improves sleep quality", "Reduces depression symptoms by 25% in studies", "Builds resilience"]
        },
        {
          name: "Opposite Action (DBT Skill)",
          description: "Depression urges: isolate, stay in bed, avoid. Opposite action: When you feel like isolating, call someone. Feel like staying in bed? Get up and move. Want to avoid? Approach. This isn't toxic positivity - it's behavioral science. Your emotions are valid, but depression's behavioral urges worsen depression. Act opposite to the urge (not the feeling). Track results.",
          duration: "Varies per situation",
          frequency: "Every time you notice a depressive urge. Start with one opposite action daily",
          benefits: ["Breaks depression maintenance cycles", "Increases self-efficacy", "Reduces avoidance", "Improves mood within 30 minutes", "Builds confidence"]
        },
        {
          name: "Self-Compassion Break (Kristin Neff Method)",
          description: "When self-critical thoughts arise: 1) Acknowledge suffering: 'This is really hard right now.' 2) Common humanity: 'Others feel this way too. I'm not alone.' 3) Self-kindness: 'May I be kind to myself. May I give myself what I need.' Place hand on heart. Speak like you'd speak to a suffering friend. Depression thrives on self-criticism. Self-compassion is the antidote.",
          duration: "5 minutes",
          frequency: "Whenever self-critical. Minimum 2x daily",
          benefits: ["Reduces self-criticism", "Lowers depression and anxiety", "Increases motivation (not decreased)", "Improves emotional resilience", "Reduces shame"]
        }
      );
    }

    // PTSD/Trauma-specific
    if (condition.includes("PTSD") || condition.includes("Trauma")) {
      mindExercises.push(
        {
          name: "Grounding for Flashbacks",
          description: "During flashback: Stamp feet on ground. Say out loud: 'I am [name]. Today is [date]. I am in [location]. I am safe now. That was then, this is now.' Touch something cold (ice cube, cold water). Name 5 things you see. This interrupts the flashback by engaging prefrontal cortex. Practice when calm so it's automatic during flashback.",
          duration: "5-10 minutes",
          frequency: "As needed during flashbacks. Practice daily when calm",
          benefits: ["Stops flashbacks", "Reduces dissociation", "Brings you to present", "Decreases PTSD symptoms", "Increases sense of safety"]
        },
        {
          name: "Container Visualization",
          description: "Imagine a strong, secure container (safe, vault, box). When traumatic memories intrude, visualize placing them in the container and locking it. Tell yourself: 'I'll process this in therapy/when I'm ready.' This isn't avoidance - it's containment. You're choosing WHEN to process, not IF. Prevents re-traumatization from constant exposure.",
          duration: "5 minutes",
          frequency: "As needed when triggered. Before bed if nightmares are common",
          benefits: ["Reduces intrusive thoughts", "Improves sleep", "Increases sense of control", "Prevents re-traumatization", "Allows functioning between therapy sessions"]
        }
      );
    }

    // OCD-specific
    if (condition.includes("OCD") || condition.includes("Obsessive")) {
      mindExercises.push(
        {
          name: "Exposure and Response Prevention (ERP) - Self-Guided",
          description: "List your compulsions (checking, washing, counting, etc.). Choose the EASIEST one. Expose yourself to the trigger WITHOUT doing the compulsion. Anxiety will spike (expect 8/10). Stay with it. Don't escape. After 20-30 minutes, anxiety WILL decrease naturally (habituation). This teaches your brain the feared outcome won't happen. Start small. Build up. This is the gold standard OCD treatment.",
          duration: "30-45 minutes per exposure",
          frequency: "Daily exposure practice. Start with one compulsion, master it, move to next",
          benefits: ["Reduces compulsions by 60-80%", "Breaks OCD cycle", "Increases distress tolerance", "Provides long-term relief", "More effective than medication alone"]
        },
        {
          name: "Thought Defusion",
          description: "When intrusive thought appears, don't engage. Say: 'I'm having the thought that [thought].' Or sing it to 'Happy Birthday' tune. Or imagine it on a leaf floating down a stream. The goal isn't to stop thoughts - it's to change your relationship with them. Thoughts are just thoughts, not facts or commands.",
          duration: "2-3 minutes per intrusive thought",
          frequency: "Every time intrusive thought appears",
          benefits: ["Reduces thought-action fusion", "Decreases distress from intrusions", "Reduces compulsions", "Increases psychological flexibility", "Thoughts lose power over time"]
        }
      );
    }

    // ADHD-specific
    if (condition.includes("ADHD") || condition.includes("Focus") || condition.includes("Concentration")) {
      mindExercises.push(
        {
          name: "Pomodoro Technique (ADHD-Modified)",
          description: "Set timer for 25 minutes. ONE task only. Remove ALL distractions (phone in other room, close tabs, noise-canceling headphones). Work until timer rings. Take 5-minute break (move, stretch, water). After 4 pomodoros, take 15-30 minute break. The timer is external structure your ADHD brain needs. Don't rely on willpower - rely on systems.",
          duration: "25-minute work blocks",
          frequency: "Throughout work day. Start with 2 pomodoros, build up",
          benefits: ["Improves focus by 300%", "Reduces procrastination", "Provides structure", "Prevents hyperfocus burnout", "Increases task completion"]
        },
        {
          name: "Mindfulness Meditation for ADHD",
          description: "Sit comfortably. Focus on breath. Count: 'In-1, Out-1, In-2, Out-2' up to 10, then restart. Mind WILL wander (that's ADHD). When you notice, gently return to counting. Don't judge yourself. The practice IS noticing and returning - not perfect focus. This builds your attention muscle. Start with 2 minutes. Add 1 minute weekly.",
          duration: "Start 2 min, build to 10-15 min",
          frequency: "Twice daily: morning and before important tasks",
          benefits: ["Strengthens prefrontal cortex", "Improves attention span", "Reduces impulsivity", "Increases emotional regulation", "Effects compound over time"]
        }
      );
    }

    // Sleep disorder-specific
    if (condition.includes("Insomnia") || condition.includes("Sleep") || sleepQuality.includes("poor")) {
      mindExercises.push(
        {
          name: "Cognitive Behavioral Therapy for Insomnia (CBT-I) - Sleep Restriction",
          description: "Calculate your average sleep time (e.g., 5 hours). That's your 'sleep window.' If you want to wake at 7 AM, don't go to bed before 2 AM. Stay up. This builds sleep pressure. After 1 week of sleeping 85% of time in bed, add 15 minutes earlier bedtime. Repeat weekly. This reconditions your brain: bed = sleep, not worry. Harder than it sounds but 80% effective.",
          duration: "Ongoing protocol",
          frequency: "Daily. Strict sleep/wake times. No naps",
          benefits: ["Cures chronic insomnia", "Rebuilds sleep drive", "Reduces time to fall asleep", "Increases sleep efficiency", "More effective than sleep medication long-term"]
        },
        {
          name: "Body Scan for Sleep",
          description: "In bed, lights off. Starting at toes: notice sensations without judgment. Slowly move attention up body: feet, calves, thighs, hips, stomach, chest, arms, hands, neck, face. If mind wanders to worries, gently return to body. The goal isn't to fall asleep - it's to rest. Paradoxically, this helps you fall asleep by removing performance pressure.",
          duration: "15-20 minutes",
          frequency: "Every night in bed. If not asleep in 20 min, get up and read until drowsy",
          benefits: ["Reduces sleep latency", "Quiets racing thoughts", "Relaxes body", "Reduces sleep anxiety", "Improves sleep quality"]
        }
      );
    }

    // Universal exercises (add for everyone)
    mindExercises.push(
      {
        name: "Daily Mood Tracking",
        description: "Every evening, rate your mood (0-10), energy (0-10), anxiety (0-10), and sleep quality. Note: activities done, medications taken, triggers encountered, coping skills used. After 2 weeks, patterns emerge. You'll see what helps and what doesn't. This data is gold for therapy and medication management. Use an app or simple notebook.",
        duration: "5 minutes",
        frequency: "Every evening, same time",
        benefits: ["Identifies patterns and triggers", "Tracks treatment effectiveness", "Increases self-awareness", "Provides data for healthcare providers", "Predicts and prevents relapses"]
      }
    );

    // Generate comprehensive, evidence-based lifestyle tips
    const lifestyleTips: LifestyleTip[] = [];

    // Sleep (critical for all conditions)
    lifestyleTips.push({
      category: "Sleep Hygiene (CRITICAL)",
      title: "Non-Negotiable Sleep Rules",
      description: "1) Same sleep/wake time daily (±30 min). 2) No screens 1 hour before bed (blue light blocks melatonin). 3) Cool room (65-68°F). 4) Pitch dark (blackout curtains or eye mask). 5) No caffeine after 2 PM. 6) No alcohol (disrupts REM sleep). 7) If not asleep in 20 min, get up and read until drowsy. Sleep deprivation worsens ALL mental health conditions by 50-100%. This is your foundation.",
      priority: "high"
    });

    // Nutrition
    lifestyleTips.push({
      category: "Nutrition (Brain Fuel)",
      title: "Eat for Neurotransmitter Production",
      description: "Your brain needs: 1) Omega-3s (fatty fish 2x/week, walnuts, flaxseed) - builds brain cells. 2) Protein (eggs, chicken, beans) - makes serotonin and dopamine. 3) Complex carbs (oats, quinoa, sweet potato) - stabilizes blood sugar and mood. 4) Fermented foods (yogurt, kimchi, sauerkraut) - gut-brain axis is real. 5) Avoid: sugar crashes, skipping meals, excessive caffeine. Eat within 1 hour of waking. Never skip breakfast.",
      priority: "high"
    });

    // Exercise
    if (activityLevel.includes("Sedentary") || activityLevel.includes("Lightly active")) {
      lifestyleTips.push({
        category: "Exercise (AS EFFECTIVE AS MEDICATION)",
        title: "Start with 10 Minutes Daily - Build from There",
        description: "Exercise is as effective as SSRIs for mild-moderate depression. It increases BDNF (brain fertilizer), releases endorphins, reduces cortisol, improves sleep, and builds self-efficacy. START SMALL: 10-minute walk daily. After 1 week, add 5 minutes. After 1 month, aim for 30 minutes 5x/week. Mix cardio (running, biking, swimming) with strength training. Morning exercise is best for depression. Evening for anxiety. This is non-negotiable.",
        priority: "high"
      });
    } else {
      lifestyleTips.push({
        category: "Exercise Optimization",
        title: "Maintain and Optimize Your Current Routine",
        description: "You're already active - great! Optimize: 1) Mix cardio (3x/week) with strength training (2x/week). 2) Morning exercise for depression (boosts serotonin all day). 3) Evening exercise for anxiety (burns off cortisol). 4) Yoga 1x/week (mind-body connection). 5) Rest days are important (overtraining increases cortisol). 6) Exercise outdoors when possible (nature + movement = powerful combo).",
        priority: "high"
      });
    }

    // Social connection
    if (socialSupport.includes("isolated") || socialSupport.includes("alone") || socialSupport.includes("Weak")) {
      lifestyleTips.push({
        category: "Social Connection (URGENT)",
        title: "Isolation is as Deadly as Smoking 15 Cigarettes Daily",
        description: "Loneliness increases depression risk by 200%. Action steps: 1) Join ONE group (support group, class, club, religious community). 2) Text/call ONE person daily. 3) Volunteer (helping others helps you). 4) Online communities count (Reddit, Discord, forums). 5) Therapy is connection too. 6) Get a pet if possible (unconditional love). Start with one 15-minute social interaction daily. Build from there. This is life-or-death important.",
        priority: "high"
      });
    } else {
      lifestyleTips.push({
        category: "Social Connection",
        title: "Maintain and Deepen Your Support Network",
        description: "You have support - protect it. 1) Schedule regular check-ins with key people. 2) Be honest about your struggles (vulnerability deepens connection). 3) Join a support group (people who get it). 4) Balance giving and receiving support. 5) Quality over quantity - one deep friendship beats 10 acquaintances. 6) Set boundaries with draining relationships. Your support system is your safety net.",
        priority: "medium"
      });
    }

    // Light exposure
    lifestyleTips.push({
      category: "Light Exposure (Regulates Circadian Rhythm)",
      title: "Get Bright Light in Morning, Dim Light at Night",
      description: "Light is the most powerful circadian regulator. Morning: Get 10-30 minutes of bright light (ideally sunlight) within 2 hours of waking. This sets your circadian clock, boosts serotonin, and improves nighttime sleep. Cloudy day? Still go outside (10x brighter than indoor light). Winter/SAD? Consider a 10,000 lux light therapy box (30 min morning use). Evening: Dim all lights after sunset. Use lamps, not overhead lights. Install f.lux on devices. This allows melatonin production.",
      priority: "high"
    });

    // Caffeine and substances
    lifestyleTips.push({
      category: "Caffeine & Substances",
      title: "Strategic Caffeine Use, Eliminate Alcohol",
      description: "Caffeine: Not evil, but timing matters. 1) No caffeine after 2 PM (6-hour half-life). 2) Max 200mg daily (2 cups coffee) if anxious. 3) Wait 90 min after waking (let cortisol peak naturally). 4) Pair with food (prevents jitters). Alcohol: Depressant that disrupts sleep, depletes serotonin, and worsens anxiety the next day. If you drink, limit to 1-2 drinks max, never daily, never to cope. Cannabis: Can worsen anxiety and motivation long-term. Discuss with doctor.",
      priority: "high"
    });

    // Screen time
    lifestyleTips.push({
      category: "Screen Time & Social Media",
      title: "Digital Boundaries for Mental Health",
      description: "Social media increases depression and anxiety. Action: 1) No phone first hour after waking (cortisol spike + comparison = bad start). 2) No phone last hour before bed (blue light + stimulation = poor sleep). 3) Delete apps that worsen mood (you know which ones). 4) Turn off all notifications except calls/texts. 5) Use screen time limits. 6) Unfollow accounts that trigger comparison. 7) Curate feed for positivity. Your attention is your most valuable resource.",
      priority: "high"
    });

    // Routine and structure
    if (condition.includes("Depression") || condition.includes("Bipolar") || condition.includes("ADHD")) {
      lifestyleTips.push({
        category: "Routine & Structure (ESSENTIAL)",
        title: "Build Non-Negotiable Daily Anchors",
        description: "Your condition thrives in chaos. Structure is medicine. Create 3 daily anchors: 1) Same wake time (even weekends). 2) Same meal times. 3) Same bedtime. Build everything else around these. Use alarms, calendars, habit trackers. Automate decisions (same breakfast, same workout time). This frees mental energy for what matters. Routine feels boring but it's the foundation of stability. Miss a day? Restart tomorrow without self-judgment.",
        priority: "high"
      });
    }

    // Medication adherence
    if (currentTreatment.includes("Medication")) {
      lifestyleTips.push({
        category: "Medication Management",
        title: "Maximize Medication Effectiveness",
        description: "1) Take at SAME TIME daily (set phone alarm). 2) Never stop abruptly (causes withdrawal and relapse). 3) Track side effects in journal (discuss with doctor). 4) Give new meds 4-6 weeks to work (don't give up early). 5) Pair with therapy (medication + therapy > either alone). 6) Use pill organizer. 7) Refill before running out. 8) Tell doctor about ALL supplements (interactions exist). 9) Don't drink alcohol with psych meds. 10) Be patient - finding right med/dose takes time.",
        priority: "high"
      });
    }

    // Therapy
    if (!currentTreatment.includes("Therapy")) {
      lifestyleTips.push({
        category: "Professional Support (STRONGLY RECOMMENDED)",
        title: "Consider Adding Therapy to Your Treatment",
        description: "This plan helps, but therapy is irreplaceable. Benefits: 1) Trained professional who sees patterns you miss. 2) Accountability and support. 3) Evidence-based techniques (CBT, DBT, EMDR). 4) Safe space to process difficult emotions. 5) Prevents relapse. Options: In-person, online (BetterHelp, Talkspace), community mental health centers (sliding scale), support groups (free). If cost is barrier: Open Path Collective ($30-80/session), university training clinics, group therapy. Therapy + this plan = best outcomes.",
        priority: "high"
      });
    }

    // Stress management
    lifestyleTips.push({
      category: "Stress Management",
      title: "Build Your Stress Tolerance Window",
      description: "Chronic stress shrinks your window of tolerance (range of stress you can handle). Expand it: 1) Daily relaxation practice (not optional). 2) Say no to non-essential commitments. 3) Delegate tasks. 4) Take breaks before you need them. 5) Identify stress early (body signals: tight shoulders, jaw clenching, shallow breathing). 6) Use stress as information, not enemy. 7) Schedule downtime like appointments. 8) Practice 'good enough' vs perfectionism. You can't eliminate stress, but you can change your response.",
      priority: "medium"
    });

    // Triggers
    if (triggers.length > 2) {
      lifestyleTips.push({
        category: "Trigger Management",
        title: "Identify, Avoid, or Prepare for Your Triggers",
        description: `Your triggers: ${triggers.slice(0, 5).join(', ')}. Strategy: 1) Avoidable triggers: Limit exposure (news, toxic people, substances). 2) Unavoidable triggers: Prepare coping plan before exposure. 3) Use 'if-then' planning: 'If I encounter [trigger], then I will [coping skill].' 4) Notice early warning signs (body sensations, thoughts). 5) Have emergency contacts ready. 6) Practice coping skills when calm so they're automatic when triggered. 7) Gradually expose yourself to triggers in therapy (builds resilience).`,
        priority: "medium"
      });
    }

    // Environment
    lifestyleTips.push({
      category: "Environment Optimization",
      title: "Your Space Affects Your Mental State",
      description: "1) Declutter (clutter = mental chaos). 2) Maximize natural light (open curtains daily). 3) Add plants (improve air quality and mood). 4) Create a 'calm corner' (meditation cushion, soft lighting, no screens). 5) Separate sleep space from work space if possible. 6) Use calming colors (blues, greens). 7) Control noise (white noise machine, earplugs). 8) Temperature: cool for sleep (65-68°F), comfortable for waking hours. 9) Minimize visual stimulation in bedroom. Your environment should support your recovery.",
      priority: "low"
    });

    // Hobbies and meaning
    lifestyleTips.push({
      category: "Purpose & Meaning",
      title: "Engage in Activities That Matter to You",
      description: "Mental health isn't just absence of symptoms - it's presence of meaning. 1) Identify your values (what matters most?). 2) Schedule weekly activities aligned with values. 3) Creative expression (art, music, writing) processes emotions non-verbally. 4) Help others (volunteering, mentoring) - helping others helps you. 5) Learn something new (builds self-efficacy). 6) Connect with nature regularly. 7) Spiritual/religious practice if meaningful to you. 8) Work toward a goal (gives direction). Purpose is protective against relapse.",
      priority: "medium"
    });

    // Crisis plan
    lifestyleTips.push({
      category: "Crisis Safety Plan (ESSENTIAL)",
      title: "Know What to Do When Symptoms Spike",
      description: "Create a written crisis plan: 1) Warning signs I'm getting worse: [list]. 2) Internal coping: [breathing, grounding, distraction]. 3) Social support: [names and numbers of 3 people to call]. 4) Professional contacts: [therapist, psychiatrist, crisis line]. 5) Emergency: 988 (Suicide & Crisis Lifeline), 911, or nearest ER. 6) Remove means if suicidal (guns, pills, etc.). 7) Safety contract: 'I will not harm myself. If I feel unsafe, I will [specific action].' Keep this plan visible. Share with trusted person. Update regularly.",
      priority: "high"
    });

    // Generate personalized weekly goals
    const weeklyGoals: string[] = [];

    // Sleep goal (universal)
    if (sleepQuality.includes("poor") || sleepQuality.includes("insomnia")) {
      weeklyGoals.push("Sleep: Maintain consistent sleep/wake time within 15 minutes, 7 days. Track sleep quality daily (0-10 scale).");
    } else {
      weeklyGoals.push("Sleep: Continue 7-9 hours nightly. Same sleep/wake time on weekends as weekdays.");
    }

    // Exercise goal
    if (activityLevel.includes("Sedentary")) {
      weeklyGoals.push("Exercise: 10-minute walk daily, 7 days. No exceptions. Build the habit first, intensity later.");
    } else if (activityLevel.includes("Lightly active")) {
      weeklyGoals.push("Exercise: 20-30 minutes moderate activity, 5 days this week. Mix cardio and strength.");
    } else {
      weeklyGoals.push("Exercise: Maintain current routine. Add one new activity (yoga, hiking, dance class).");
    }

    // Mind exercise goal
    if (condition.includes("Anxiety") || condition.includes("Panic")) {
      weeklyGoals.push("Anxiety Management: Practice 4-7-8 breathing 3x daily, every day. Track anxiety levels before/after (0-10).");
    } else if (condition.includes("Depression")) {
      weeklyGoals.push("Depression Management: Complete 3 behavioral activation activities daily. Rate mood before/after each.");
    } else if (condition.includes("ADHD")) {
      weeklyGoals.push("Focus: Use Pomodoro technique for all work tasks. Complete minimum 4 pomodoros daily.");
    } else if (condition.includes("PTSD")) {
      weeklyGoals.push("Trauma Processing: Practice grounding technique daily. Use container visualization before bed.");
    } else if (condition.includes("OCD")) {
      weeklyGoals.push("OCD Management: Complete one ERP exposure daily. Track anxiety curve (should decrease after 20-30 min).");
    }

    // Social connection goal
    if (socialSupport.includes("isolated") || socialSupport.includes("alone")) {
      weeklyGoals.push("Social Connection: Initiate contact with one person daily (text, call, or in-person). Join one group this week.");
    } else {
      weeklyGoals.push("Social Connection: Have one meaningful conversation this week. Be vulnerable about your struggles with trusted person.");
    }

    // Medication/treatment goal
    if (currentTreatment.includes("Medication")) {
      weeklyGoals.push("Medication: Take all doses on time, 7 days. Track side effects. Schedule follow-up with prescriber if needed.");
    } else if (!currentTreatment.includes("Therapy")) {
      weeklyGoals.push("Treatment: Research and contact 3 therapists this week. Schedule initial consultation with at least one.");
    }

    // Trigger management goal
    if (triggers.length > 2) {
      weeklyGoals.push(`Trigger Management: Identify early warning signs when encountering triggers. Use coping skills BEFORE symptoms peak.`);
    }

    // Mood tracking goal (universal)
    weeklyGoals.push("Self-Monitoring: Track mood, anxiety, energy, and sleep quality daily. Review patterns at week's end.");

    // Specific goal based on primary goals
    if (goals.includes("Reduce anxiety and worry")) {
      weeklyGoals.push("Worry Reduction: Practice 'worry time' daily. Notice if worries decrease by week's end.");
    }
    if (goals.includes("Improve mood and reduce depression")) {
      weeklyGoals.push("Mood Improvement: Gratitude journal every morning. Notice 3 positive things daily, no matter how small.");
    }
    if (goals.includes("Sleep better")) {
      weeklyGoals.push("Sleep Improvement: No screens 1 hour before bed, 7 nights. Track if sleep latency decreases.");
    }
    if (goals.includes("Increase energy and motivation")) {
      weeklyGoals.push("Energy Building: Complete morning routine (light exposure + movement) within 30 min of waking, daily.");
    }
    if (goals.includes("Better focus and concentration")) {
      weeklyGoals.push("Focus Training: Meditation 5 minutes daily. Increase by 1 minute each week.");
    }

    // Self-compassion goal (universal)
    weeklyGoals.push("Self-Compassion: When you miss a goal or have a bad day, speak to yourself like you'd speak to a friend. No self-criticism.");

    // Limit to top 8 goals
    const finalGoals = weeklyGoals.slice(0, 8);

    return {
      condition,
      severity: severity.toString(),
      dailySchedule,
      mindExercises,
      lifestyleTips,
      weeklyGoals: finalGoals
    };
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      sun: Sun,
      utensils: Utensils,
      brain: Brain,
      coffee: Coffee,
      activity: Activity,
      dumbbell: Dumbbell,
      moon: Moon
    };
    return icons[iconName] || Clock;
  };

  // Loading state
  if (isLoadingPlan) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your wellness plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Intro Screen */}
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="text-6xl mb-6">🧘‍♀️</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Comprehensive Mental Health Treatment Plan
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-4 max-w-3xl mx-auto">
                Get a psychiatrist-level treatment plan tailored to your specific condition.
              </p>
              <p className="text-lg text-gray-400 mb-8 max-w-3xl mx-auto">
                Evidence-based protocols • Hour-by-hour schedules • Condition-specific exercises • Professional-grade guidance
              </p>

              <Card className="p-8 md:p-12 max-w-3xl mx-auto mb-8">
                <h2 className="text-2xl font-bold mb-6">What You'll Get:</h2>
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div className="flex gap-4">
                    <Calendar className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Daily Schedule</h3>
                      <p className="text-gray-400 text-sm">Hour-by-hour plan optimized for your condition</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Brain className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Mind Exercises</h3>
                      <p className="text-gray-400 text-sm">Evidence-based techniques with clear instructions</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Heart className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Lifestyle Tips</h3>
                      <p className="text-gray-400 text-sm">Practical changes for lasting improvement</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold mb-1">Weekly Goals</h3>
                      <p className="text-gray-400 text-sm">Achievable milestones to track progress</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleStartQuiz}
                  size="lg"
                  className="w-full mt-8 bg-gradient-to-r from-green-500 to-blue-600"
                >
                  Start Comprehensive Assessment (15 Questions) <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Card>

              <div className="mt-8 p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl max-w-3xl mx-auto">
                <p className="text-yellow-300 font-semibold mb-2">⚠️ Important Disclaimer</p>
                <p className="text-gray-300 text-sm">
                  This plan is for educational and supportive purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. 
                  If you're experiencing a mental health crisis, please call 988 (Suicide & Crisis Lifeline) or go to your nearest emergency room.
                </p>
              </div>

              <p className="text-gray-500 text-sm mt-4">
                ⏱️ Takes 5-7 minutes • 🔒 Completely private • 💯 Evidence-based protocols • 🏥 Complements professional care
              </p>
            </motion.div>
          )}

          {/* Quiz Screen */}
          {step === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="max-w-3xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                    <span>{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-500 to-blue-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                <Card className="p-8 md:p-12">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    {quizQuestions[currentQuestion].question}
                  </h2>
                  {quizQuestions[currentQuestion].subtitle && (
                    <p className="text-gray-400 mb-6">{quizQuestions[currentQuestion].subtitle}</p>
                  )}

                  <div className="space-y-3">
                    {quizQuestions[currentQuestion].type === 'multiple' ? (
                      // Multiple choice questions
                      <>
                        {quizQuestions[currentQuestion].options.map((option, index) => (
                          <motion.button
                            key={index}
                            onClick={() => handleMultipleToggle(option)}
                            className={`w-full p-4 text-left border rounded-xl transition-all ${
                              multipleSelections.includes(option)
                                ? 'bg-blue-500/20 border-blue-500'
                                : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-blue-500/50'
                            }`}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                multipleSelections.includes(option)
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-500'
                              }`}>
                                {multipleSelections.includes(option) && (
                                  <CheckCircle2 className="w-4 h-4 text-white" />
                                )}
                              </div>
                              <span className="text-base">{option}</span>
                            </div>
                          </motion.button>
                        ))}
                        <div className="flex gap-4 mt-6">
                          {currentQuestion > 0 && (
                            <Button
                              onClick={handleBack}
                              variant="secondary"
                            >
                              ← Back
                            </Button>
                          )}
                          <Button
                            onClick={handleMultipleNext}
                            disabled={multipleSelections.length === 0}
                            className="flex-1"
                          >
                            Continue ({multipleSelections.length} selected)
                          </Button>
                        </div>
                        {quizQuestions[currentQuestion].maxSelections && (
                          <p className="text-sm text-gray-500 mt-2">
                            Select up to {quizQuestions[currentQuestion].maxSelections} options
                          </p>
                        )}
                      </>
                    ) : quizQuestions[currentQuestion].type === 'scale' ? (
                      // Scale questions (0-10)
                      <>
                        <div className="grid grid-cols-11 gap-2">
                          {quizQuestions[currentQuestion].options.map((option, index) => (
                            <motion.button
                              key={index}
                              onClick={() => handleAnswer(option)}
                              className="aspect-square flex items-center justify-center bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500 rounded-lg transition-all"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <span className="text-lg font-bold">{option}</span>
                            </motion.button>
                          ))}
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                          <span>No impact</span>
                          <span>Completely debilitating</span>
                        </div>
                        {currentQuestion > 0 && (
                          <Button
                            onClick={handleBack}
                            variant="secondary"
                            className="mt-6"
                          >
                            ← Back
                          </Button>
                        )}
                      </>
                    ) : (
                      // Single choice questions
                      <>
                        {quizQuestions[currentQuestion].options.map((option, index) => (
                          <motion.button
                            key={index}
                            onClick={() => handleAnswer(option)}
                            className="w-full p-4 text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 rounded-xl transition-all"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <span className="text-base">{option}</span>
                          </motion.button>
                        ))}
                        {currentQuestion > 0 && (
                          <Button
                            onClick={handleBack}
                            variant="secondary"
                            className="mt-6"
                          >
                            ← Back
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Results Screen */}
          {step === 'results' && plan && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Header */}
              <div className="text-center mb-12">
                <div className="text-6xl mb-4">✨</div>
                <h1 className="text-4xl font-bold mb-4">
                  Your Personalized Wellness Plan
                </h1>
                <p className="text-xl text-gray-300">
                  Condition: <span className="text-blue-400 font-semibold">{plan.condition}</span> • 
                  Severity: <span className="text-purple-400 font-semibold">{plan.severity}</span>
                </p>
                <Button
                  onClick={handleRestart}
                  variant="secondary"
                  className="mt-4"
                >
                  Take Quiz Again
                </Button>
              </div>

              {/* Daily Schedule */}
              <Card className="p-8 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-8 h-8 text-green-400" />
                  <h2 className="text-3xl font-bold">Daily Schedule</h2>
                </div>
                <p className="text-gray-400 mb-6">Follow this routine to build healthy habits and manage your symptoms</p>
                
                <div className="space-y-4">
                  {plan.dailySchedule.map((item, index) => {
                    const IconComponent = getIconComponent(item.icon);
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-green-400" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-sm font-mono text-blue-400">{item.time}</span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">{item.duration}</span>
                          </div>
                          <h3 className="font-bold text-lg mb-1">{item.activity}</h3>
                          <p className="text-gray-400 text-sm">{item.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>

              {/* Mind Exercises */}
              <Card className="p-8 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <Brain className="w-8 h-8 text-blue-400" />
                  <h2 className="text-3xl font-bold">Mind Exercises</h2>
                </div>
                <p className="text-gray-400 mb-6">Evidence-based techniques specifically for {plan.condition.toLowerCase()}</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {plan.mindExercises.map((exercise, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/30"
                    >
                      <h3 className="text-xl font-bold mb-3">{exercise.name}</h3>
                      <p className="text-gray-300 mb-4">{exercise.description}</p>
                      
                      <div className="flex gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-400">{exercise.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-purple-400" />
                          <span className="text-gray-400">{exercise.frequency}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-green-400 mb-2">Benefits:</p>
                        <ul className="space-y-1">
                          {exercise.benefits.map((benefit, i) => (
                            <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Lifestyle Tips */}
              <Card className="p-8 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <Heart className="w-8 h-8 text-pink-400" />
                  <h2 className="text-3xl font-bold">Lifestyle Tips</h2>
                </div>
                <p className="text-gray-400 mb-6">Make these changes for lasting mental health improvement</p>
                
                <div className="space-y-4">
                  {plan.lifestyleTips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-xl border ${
                        tip.priority === 'high' 
                          ? 'bg-red-500/10 border-red-500/30' 
                          : tip.priority === 'medium'
                          ? 'bg-yellow-500/10 border-yellow-500/30'
                          : 'bg-green-500/10 border-green-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="text-xs font-semibold text-gray-500 uppercase">{tip.category}</span>
                          <h3 className="text-lg font-bold mt-1">{tip.title}</h3>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          tip.priority === 'high'
                            ? 'bg-red-500/20 text-red-400'
                            : tip.priority === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {tip.priority}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">{tip.description}</p>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Weekly Goals */}
              <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle2 className="w-8 h-8 text-purple-400" />
                  <h2 className="text-3xl font-bold">This Week's Goals</h2>
                </div>
                <p className="text-gray-400 mb-6">Track these milestones to measure your progress</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {plan.weeklyGoals.map((goal, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-white/5 rounded-lg"
                    >
                      <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{goal}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Footer CTA */}
              <div className="mt-12 text-center">
                <Card className="p-8 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30">
                  <h3 className="text-2xl font-bold mb-3">🎯 Ready to Start Your Journey?</h3>
                  <p className="text-gray-300 mb-6">
                    Save this plan and check off activities as you complete them. Consistency is key!
                  </p>
                  <div className="flex gap-4 justify-center flex-wrap">
                    <Button
                      onClick={() => window.print()}
                      className="bg-gradient-to-r from-green-500 to-blue-600"
                    >
                      📄 Print Plan
                    </Button>
                    <Button
                      onClick={handleRestart}
                      variant="secondary"
                    >
                      🔄 Create New Plan
                    </Button>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
