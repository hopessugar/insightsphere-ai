/**
 * Premium Home Page with stunning animations and glassmorphism
 */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, Sparkles, TrendingUp, Shield, ArrowRight, Zap, Heart, BarChart3 } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

export default function Home() {
  const features = [
    {
      icon: Brain,
      title: 'Personalized Wellness Plans',
      description: 'Get a complete daily schedule with mind exercises, lifestyle tips, and routines tailored to your mental health needs.',
      gradient: 'from-primary/20 to-primary/5',
    },
    {
      icon: TrendingUp,
      title: 'Evidence-Based Techniques',
      description: 'Access proven mental health exercises like breathing techniques, meditation, and cognitive strategies.',
      gradient: 'from-secondary/20 to-secondary/5',
    },
    {
      icon: Sparkles,
      title: 'AI Therapy Chat',
      description: 'Talk to an AI therapist that provides supportive guidance and helps you work through challenges.',
      gradient: 'from-accent/20 to-accent/5',
    },
    {
      icon: BarChart3,
      title: 'Deep Self-Awareness',
      description: 'Discover your blind spots, emotional patterns, and hidden triggers with our unique mirror and shadow work tools.',
      gradient: 'from-primary/20 to-secondary/5',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Share How You Feel',
      description: 'Write freely about your emotions, thoughts, and experiences in a safe, private space.',
    },
    {
      number: '02',
      title: 'AI Analyzes Patterns',
      description: 'Our intelligent system processes your text to identify emotions, stress levels, and thinking patterns.',
    },
    {
      number: '03',
      title: 'Get Insights & Guidance',
      description: 'Receive personalized insights, coping strategies, and supportive suggestions for your wellbeing.',
    },
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">AI-Powered Mental Wellness</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Understand Your Mind with{' '}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Gentle Insights
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              InsightSphere AI is your supportive companion for emotional awareness. Analyze your feelings,
              track patterns, and receive personalized guidance—all in a beautiful, private space.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/wellness-plan">
                <Button size="lg" className="group">
                  Get Your Wellness Plan
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 flex items-center gap-6 justify-center lg:justify-start text-sm text-gray-400"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span>100% Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-secondary" />
                <span>Non-Diagnostic</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Animated Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <Card glass gradient className="p-8">
              <div className="space-y-6">
                {/* Mock Stress Gauge */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Stress Level</p>
                    <p className="text-3xl font-bold text-primary">35</p>
                  </div>
                  <div className="w-24 h-24 rounded-full border-4 border-primary/30 border-t-primary flex items-center justify-center">
                    <span className="text-2xl font-bold">😌</span>
                  </div>
                </div>

                {/* Mock Emotion Bars */}
                <div className="space-y-3">
                  {['Joy', 'Calm', 'Anxiety'].map((emotion, i) => (
                    <div key={emotion}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">{emotion}</span>
                        <span className="text-white">{[70, 60, 20][i]}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${[70, 60, 20][i]}%` }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                          className={`h-full rounded-full ${
                            i === 0 ? 'bg-primary' : i === 1 ? 'bg-secondary' : 'bg-accent'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mock Suggestion */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-sm text-gray-300">
                    💡 <strong>Suggestion:</strong> Take a moment to savor this positive feeling...
                  </p>
                </div>
              </div>
            </Card>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl blur-xl opacity-50"
            />
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl blur-xl opacity-50"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features for Your{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Mental Wellness
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to understand and improve your emotional wellbeing
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover glass className={`h-full bg-gradient-to-br ${feature.gradient}`}>
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-400">Simple, private, and supportive</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <Card glass className="h-full text-center">
                  <div className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </Card>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-primary/50" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Ethics Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card glass className="text-center bg-gradient-to-br from-accent/10 to-secondary/10 border-accent/20">
              <Shield className="w-16 h-16 text-accent mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Your Safety Matters</h2>
              <p className="text-lg text-gray-300 mb-6">
                InsightSphere AI is <strong>not a medical or diagnostic tool</strong>. It's designed as a
                supportive wellness companion to help you gain awareness of your emotional patterns.
              </p>
              <p className="text-gray-400 mb-6">
                This application does not replace professional mental health care. If you're experiencing
                a mental health crisis or need support, please reach out to a qualified mental health
                professional or emergency services.
              </p>
              <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-500">
                <span>🔒 100% Private & Secure</span>
                <span>•</span>
                <span>🚫 No Medical Diagnosis</span>
                <span>•</span>
                <span>💚 Supportive Guidance Only</span>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Understand Your Mind Better?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Start your journey to emotional awareness today
            </p>
            <Link to="/wellness-plan">
              <Button size="lg" className="group">
                Get Your Free Plan
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
