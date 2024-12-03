"use client";

import Link from "next/link";
import {
  Activity,
  MessageCircle,
  Star,
  BarChart2,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <div className={`min-h-screen ${"bg-gray-50 text-gray-900"}`}>
      {/* Hero Section with Animation */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900"></div>
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text animate-pulse">
              Transform Customer Reviews into Actionable Insights
            </h2>
            <p className="text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Harness the power of AI to understand, respond, and learn from
              your customer feedback across all languages
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-8 py-3 rounded-full text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Experience Insightify
            </Link>
          </div>

          {/* Floating Elements Animation */}
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 blur-3xl"></div>
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2">500K+</div>
              <div className="text-gray-600 dark:text-gray-300">
                Reviews Processed
              </div>
            </div>
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="text-4xl font-bold text-indigo-600 mb-2">25+</div>
              <div className="text-gray-600 dark:text-gray-300">
                Languages Supported
              </div>
            </div>
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-gray-600 dark:text-gray-300">
                Customer Satisfaction
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={`py-20 px-6 bg-white`}>
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            Powerful Features for Modern Businesses
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<MessageCircle className="w-8 h-8" />}
              title="Smart Translations"
              description="Real-time translation across 25+ languages with context-aware accuracy"
            />
            <FeatureCard
              icon={<Activity className="w-8 h-8" />}
              title="Live Monitoring"
              description="Track and respond to reviews instantly with real-time notifications"
            />
            <FeatureCard
              icon={<BarChart2 className="w-8 h-8" />}
              title="Deep Analytics"
              description="Transform data into actionable insights with advanced analytics"
            />
            <FeatureCard
              icon={<Star className="w-8 h-8" />}
              title="AI Responses"
              description="Generate authentic, context-aware responses in seconds"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Customer Experience?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of businesses using Insightify to build stronger
            customer relationships
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-8 py-3 rounded-full text-lg font-semibold bg-white text-blue-600 hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            © 2024 Insightify. All rights reserved.
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Powered by gemini nano</span>
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div
      className={`p-6 rounded-2xl shadow-lg  "bg-white"
      } hover:transform hover:scale-105 transition-all duration-200 border border-gray-100 dark:border-gray-600`}
    >
      <div className="text-blue-500 mb-4">{icon}</div>
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
