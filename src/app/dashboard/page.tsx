"use client";

import { useState } from "react";
import { SummaryTab } from "../components/SummaryTab";
import { Activity, MessageCircle, Star, BarChart2, Sparkles } from "lucide-react";
import { ReviewsTab } from "../components/ReviewsTab";
import "leaflet/dist/leaflet.css";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("summary");
  const [darkMode, setDarkMode] = useState(false);
  const [placeIds, setPlaceIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlaceIdsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const ids = event.target.value.split(",").map((id) => id.trim());
    setPlaceIds(ids);
  };

  const fetchData = () => {
    setIsLoading(true);
    // Mock API call with timeout
    setTimeout(() => {
      // TODO: use placeIds to fetch data
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      {/* Header section only */}
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-8 h-8" />
                <h1 className="text-3xl font-bold">Insightify</h1>
              </div>
              <div className="hidden md:flex items-center text-sm text-blue-100 border-l border-blue-400 pl-4">
                <span>Powered by <b>Gemini Nano</b></span>
                <Sparkles className="w-4 h-4 ml-1" />
              </div>
            </div>
            <button
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              onClick={() => setDarkMode(!darkMode)}
            >
              Toggle Dark Mode
            </button>
          </div>
        </div>
      </header>

      {/* Place IDs Input */}
      <div className="flex items-center justify-center my-4">
        <input
          type="text"
          className="border-gray-300 rounded p-2 mr-2"
          placeholder="Enter Place IDs (comma separated)"
          onChange={handlePlaceIdsChange}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={fetchData}
        >
          Fetch Data
        </button>
      </div>

      {/* Tab Navigation */}
      <div
        className={`bg-white shadow-md sticky top-0 z-10 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
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
        {activeTab === "summary" && (
          <SummaryTab darkMode={darkMode} isLoading={isLoading} />
        )}
        {activeTab === "reviews" && (
          <ReviewsTab darkMode={darkMode} isLoading={isLoading} />
        )}
      </main>
    </div>
  );
}
