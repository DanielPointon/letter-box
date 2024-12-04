"use client";

import { useState } from "react";
import { SummaryTab } from "../components/SummaryTab";
import { Sparkles } from "lucide-react";
import { ReviewsTab } from "../components/ReviewsTab";
import "leaflet/dist/leaflet.css";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("summary");
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
    <div className="min-h-screen bg-gray-900">
      {/* Place IDs Input */}
      <div className="flex items-center justify-center my-4 px-4">
        <input
          type="text"
          className="bg-gray-800/50 border-gray-700 text-gray-200 rounded-lg p-2 mr-2 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-lg w-full max-w-md"
          placeholder="ChIJPTacEpBQwokRKwIlDXelxkA,ChIJpTvG15DL1IkRd8S0KlBVNTI,ChIJ2eUgeAK6j4ARbn5u_wAGqWA"
          onChange={handlePlaceIdsChange}
        />
        <button
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          onClick={fetchData}
        >
          Fetch Data
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-800/50 backdrop-blur-lg shadow-xl border-b border-gray-700">
        <div className="flex justify-center space-x-8 text-lg">
          <button
            className={`py-3 px-6 font-medium transition-all duration-200 ${
              activeTab === "summary"
                ? "border-b-4 border-blue-500 text-blue-400"
                : "text-gray-400 hover:text-blue-400"
            }`}
            onClick={() => setActiveTab("summary")}
          >
            Summary
          </button>
          <button
            className={`py-3 px-6 font-medium transition-all duration-200 ${
              activeTab === "reviews"
                ? "border-b-4 border-blue-500 text-blue-400"
                : "text-gray-400 hover:text-blue-400"
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            All Reviews
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <main className="p-6 max-w-6xl mx-auto">
        {activeTab === "summary" && <SummaryTab isLoading={isLoading} />}
        {activeTab === "reviews" && <ReviewsTab isLoading={isLoading} />}
      </main>
    </div>
  );
}
