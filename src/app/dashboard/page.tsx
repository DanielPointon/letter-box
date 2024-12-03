"use client";

import { useState, useCallback } from "react";
import { SummaryTab } from "../components/SummaryTab";
import { ReviewsTab } from "../components/ReviewsTab";
import { PlaceDetails, fetchPlaceDetails } from "@/services/googlePlaces";
import "leaflet/dist/leaflet.css";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("summary");
  const [darkMode, setDarkMode] = useState(false);
  const [placeIds, setPlaceIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [places, setPlaces] = useState<Array<{ id: string; details: PlaceDetails }>>([]);
  const [inputValue, setInputValue] = useState("");  // New state for input

  const handlePlaceIdsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value); // Store the input value but don't set placeIds yet
  };

  const fetchData = useCallback(async () => {
    const ids = inputValue.split(",").map((id) => id.trim()).filter(Boolean);
    console.log('Fetching data for place IDs:', ids);
    
    if (ids.length === 0) {
      console.log('No place IDs to fetch');
      return;
    }

    setIsLoading(true);
    try {
      setPlaceIds(ids); // This will trigger the useEffect in ReviewsTab

      // Actually fetch the data here
      const fetchedPlaces = await Promise.all(
        ids.map(async (id) => {
          const details = await fetchPlaceDetails(id);
          return {
            id,
            details: details.result
          };
        })
      );

      setPlaces(fetchedPlaces);
      console.log('Successfully fetched place details:', fetchedPlaces);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue]);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Header remains the same */}
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Business Dashboard</h1>
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded"
            onClick={() => setDarkMode(!darkMode)}
          >
            Toggle Dark Mode
          </button>
        </div>
      </header>

      {/* Place IDs Input */}
      <div className="flex items-center justify-center my-4">
        <input
          type="text"
          className="border border-gray-300 rounded p-2 mr-2 w-96 text-black"
          placeholder="Enter Place IDs (comma separated)"
          value={inputValue}
          onChange={handlePlaceIdsChange}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          onClick={fetchData}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Fetch Data'}
        </button>
      </div>

      {/* Debug Info */}
      <div className="max-w-6xl mx-auto px-4 mb-4">
        <div className="bg-gray-100 p-4 rounded text-black">
          <p>Current Place IDs: {placeIds.join(', ') || 'None'}</p>
          <p>Loading State: {isLoading ? 'True' : 'False'}</p>
          <p>Active Tab: {activeTab}</p>
          <p>Places Fetched: {places.length}</p>
        </div>
      </div>

      {/* Tab Navigation remains the same */}
      <div className={`bg-white shadow-md sticky top-0 z-10 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        {places.length === 0 && !isLoading ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-2">Welcome to your Business Dashboard</h2>
            <p className="text-gray-500">
              Enter Google Place IDs above to get started
            </p>
          </div>
        ) : (
          <>
            {activeTab === "summary" && (
              <SummaryTab 
                darkMode={darkMode} 
                isLoading={isLoading} 
                places={places}
              />
            )}
            {activeTab === "reviews" && (
              <ReviewsTab 
                darkMode={darkMode} 
                isLoading={isLoading} 
                placeIds={placeIds}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}