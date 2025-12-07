/**
 * Premium About Page
 */

import { motion } from 'framer-motion';
import { Brain, Heart, Shield, Code, Sparkles, AlertTriangle } from 'lucide-react';
import Card from '../components/UI/Card';

export default function About() {
  const techStack = [
    { name: 'FastAPI', category: 'Backend', color: 'text-green-400' },
    { name: 'React', category: 'Frontend', color: 'text-cyan-400' },
    { name: 'TypeScript', category: 'Language', color: 'text-blue-400' },
    { name: 'Tailwind CSS', category: 'Styling', color: 'text-teal-400' },
    { name: 'Framer Motion', category: 'Animations', color: 'text-purple-400' },
    { name: 'Recharts', category: 'Visualization', color: 'text-pink-400' },
  ];

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">About InsightSphere AI</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Understanding Minds with{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Technology
            </span>
          </h1>
        </motion.div>

        {/* Vision Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card glass gradient>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-3">Our Vision</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  InsightSphere AI was created to make emotional awareness accessible to everyone. We believe
                  that understanding your emotions is the first step toward better mental wellness.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Our mission is to provide a supportive, non-judgmental space where you can explore your
                  feelings, identify patterns, and receive gentle guidance—all powered by intelligent technology.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card glass>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-3">How It Works</h2>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h3 className="font-semibold text-white mb-2">1. Natural Language Processing</h3>
                    <p className="text-sm leading-relaxed">
                      Our lightweight NLP engine analyzes your text using keyword matching and pattern recognition
                      to identify emotions like joy, sadness, anxiety, anger, and calm.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">2. Stress Assessment</h3>
                    <p className="text-sm leading-relaxed">
                      We calculate your stress level (0-100) based on negative emotion density, intensity markers,
                      and text patterns to give you a clear picture of your mental pressure.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">3. Pattern Detection</h3>
                    <p className="text-sm leading-relaxed">
                      The system identifies cognitive distortions like catastrophizing, overgeneralization, and
                      black-and-white thinking to help you recognize unhelpful thought patterns.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">4. Personalized Guidance</h3>
                    <p className="text-sm leading-relaxed">
                      Based on your analysis, we provide tailored coping strategies, journaling prompts, and
                      supportive suggestions to help you manage your emotions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <Card glass className="bg-red-500/5 border-red-500/20">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-3 text-red-400">Important: Not a Medical Tool</h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>
                    <strong className="text-white">InsightSphere AI is NOT a medical or psychiatric diagnostic tool.</strong>{' '}
                    It is designed as a supportive wellness companion to help you gain awareness of your emotional patterns.
                  </p>
                  <p>
                    This application:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Does not provide medical advice, diagnosis, or treatment</li>
                    <li>Should not replace professional mental health care</li>
                    <li>Is intended for educational and self-reflection purposes only</li>
                    <li>Encourages users to seek professional help when needed</li>
                  </ul>
                  <p className="text-red-300 font-semibold">
                    If you're experiencing a mental health crisis, please contact a mental health professional
                    or emergency services immediately.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <Card glass>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">Technology Stack</h2>
                <p className="text-gray-300 mb-6">
                  Built with modern, production-grade technologies for performance, reliability, and beautiful user experience.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {techStack.map((tech, index) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="p-3 rounded-lg bg-white/5 border border-white/10"
                    >
                      <p className={`font-semibold ${tech.color}`}>{tech.name}</p>
                      <p className="text-xs text-gray-500">{tech.category}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Academic Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card glass className="bg-primary/5 border-primary/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-3">Academic Project</h2>
                <p className="text-gray-300 leading-relaxed">
                  InsightSphere AI was developed as a final year college project to demonstrate full-stack
                  development skills, modern UI/UX design principles, natural language processing concepts,
                  and software engineering best practices.
                </p>
                <p className="text-gray-400 text-sm mt-4">
                  This project showcases the integration of AI technology with mental wellness support,
                  emphasizing ethical design, user privacy, and responsible technology use.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
