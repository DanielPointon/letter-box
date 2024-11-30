"use client";

import { useState } from "react";
import Link from "next/link";
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

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

const barData = [
  { name: "Positive", value: 85 },
  { name: "Neutral", value: 10 },
  { name: "Negative", value: 5 },
];

const pieData = [
  { name: "English", value: 70 },
  { name: "Spanish", value: 20 },
  { name: "French", value: 10 },
];

const COLORS = ["#2196f3", "#ff9800", "#9c27b0"];

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
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-700">
            Sentiment Analysis
          </h3>
          <BarChart
            width={500}
            height={300}
            data={barData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-700">
            Top Languages
          </h3>
          <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              cx={200}
              cy={200}
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
}

function InsightCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: string;
}) {
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

type Language = "English" | "Spanish" | "French";

interface User {
  id: string;
  username: string;
  avatarUrl: string;
}
interface Review {
  userId: string;
  id: string;
  text: string;
  lang: Language;
  user: User;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    text: "Great service!",
    lang: "English",
    userId: "1",
    user: {
      id: "1",
      username: "John Doe",
      avatarUrl: "https://via.placeholder.com/40",
    },
  },
  {
    id: "2",
    text: "Muy buen producto",
    lang: "Spanish",
    userId: "2",
    user: {
      id: "2",
      username: "Maria Garcia",
      avatarUrl: "https://via.placeholder.com/40",
    },
  },
  {
    id: "3",
    text: "Produit de qualité",
    lang: "French",
    userId: "3",
    user: {
      id: "3",
      username: "Jean Dupont",
      avatarUrl: "https://via.placeholder.com/40",
    },
  },
];

function ReviewsTab() {
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);

  const handleLanguageChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedLanguage = event.target.value;
    setIsReviewsLoading(true);

    // Mock API call with timeout
    setTimeout(() => {
      const translatedReviews = reviews.map((review) => ({
        ...review,
        text: `Translated (${selectedLanguage}): ${review.text}`,
      }));
      setReviews(translatedReviews);
      setIsReviewsLoading(false);
    }, 1000); // Simulate 1 second API call
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-700">Customer Reviews</h2>
        <select
          className="border-gray-300 rounded p-2 text-gray-600"
          onChange={handleLanguageChange}
        >
          <option value="English">Translate to English</option>
          <option value="Spanish">Translate to Spanish</option>
          <option value="French">Translate to French</option>
        </select>
      </div>

      <ul className="space-y-4">
        {isReviewsLoading ? (
          <CircularProgress />
        ) : (
          reviews.map((review) => (
            <li
              key={review.id}
              className="bg-gray-50 p-4 rounded-lg shadow flex justify-between items-center hover:bg-gray-100"
            >
              <div className="flex items-center">
                <Image
                  width={40}
                  height={40}
                  src={review.user.avatarUrl}
                  alt={review.user.username}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <div className="font-medium text-gray-700">{review.text}</div>
                  <div className="text-sm text-gray-500">
                    {review.user.username} - Original Language: {review.lang}
                  </div>
                  <Link href={`/dashboard/reviews/${review.id}`}>
                    <div className="text-blue-600 hover:underline">Respond</div>
                  </Link>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
