/**
 * Premium Footer Component
 */

import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-dark/50 backdrop-blur-xl mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              InsightSphere AI
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Understand your mind with gentle, AI-powered insights
            </p>
          </div>

          {/* Disclaimer */}
          <div className="max-w-2xl">
            <p className="text-xs text-gray-500">
              <strong className="text-gray-400">Important:</strong> InsightSphere AI does not provide medical or psychiatric diagnosis.
              This tool is designed as a supportive wellness companion. If you're experiencing a mental health crisis,
              please contact a mental health professional or emergency services.
            </p>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>© 2025 InsightSphere AI</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Built with <Heart className="w-4 h-4 text-red-500 fill-current" /> for mental wellness
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
