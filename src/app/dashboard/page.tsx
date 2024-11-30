"use client";

import { useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("summary");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 shadow-md">
        <h1 className="text-3xl font-semibold">Business Dashboard</h1>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="flex justify-center space-x-8 text-lg">
          <button
            className={`py-3 px-6 font-medium transition ${
              activeTab === "summary"
                ? "border-b-4 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab("summary")}
          >
            Summary
          </button>
          <button
            className={`py-3 px-6 font-medium transition ${
              activeTab === "reviews"
                ? "border-b-4 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            All Reviews
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <main className="p-6 max-w-6xl mx-auto">
        {activeTab === "summary" && <SummaryTab />}
        {activeTab === "reviews" && <ReviewsTab />}
      </main>
    </div>
  );
}

function SummaryTab() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">
        Feedback Summary
      </h2>
      <p className="text-gray-600">
        Here’s a quick overview of recurring themes and insights from customer
        feedback.
      </p>

      {/* Example insights */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        <InsightCard
          title="Common Praise"
          description="Customers love the fast delivery times and friendly customer support!"
          icon="👍"
        />
        <InsightCard
          title="Recurring Complaint"
          description="Some customers mentioned difficulty in navigating the mobile app."
          icon="⚠️"
        />
        <InsightCard
          title="Top Language"
          description="The majority of reviews are written in English."
          icon="🌐"
        />
        <InsightCard
          title="Sentiment Analysis"
          description="Most reviews have a positive sentiment score (85%)."
          icon="📊"
        />
      </div>
    </div>
  );
}

function InsightCard({ title, description, icon }) {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg shadow">
      <div className="flex items-center mb-2">
        <span className="text-3xl mr-3">{icon}</span>
        <h3 className="font-bold text-lg text-blue-600">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function ReviewsTab() {
  const reviews = [
    { id: 1, text: "Great service!", lang: "English" },
    { id: 2, text: "Muy buen producto", lang: "Spanish" },
    { id: 3, text: "Produit de qualité", lang: "French" },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-700">Customer Reviews</h2>
        <select className="border-gray-300 rounded p-2 text-gray-600">
          <option value="English">Translate to English</option>
          <option value="Spanish">Translate to Spanish</option>
          <option value="French">Translate to French</option>
        </select>
      </div>

      <ul className="space-y-4">
        {reviews.map((review) => (
          <li
            key={review.id}
            className="bg-gray-50 p-4 rounded-lg shadow flex justify-between items-center hover:bg-gray-100"
          >
            <div>
              <div className="font-medium text-gray-700">{review.text}</div>
              <div className="text-sm text-gray-500">
                Language: {review.lang}
              </div>
              <Link href={`/dashboard/reviews/${review.id}`}>
                <div className="text-blue-600 hover:underline">Respond</div>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
