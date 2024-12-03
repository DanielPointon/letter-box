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
    <div className="min-h-screen  text-gray-900">
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
      <div className="bg-white shadow-md  bg-white text-gray-900">
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
        {activeTab === "summary" && <SummaryTab isLoading={isLoading} />}
        {activeTab === "reviews" && <ReviewsTab isLoading={isLoading} />}
      </main>
    </div>
  );
}
