import { CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import Image from "next/image";
import { fetchPlaceDetails, PlaceReview } from "@/services/googlePlaces";

interface Props {
  darkMode: boolean;
  isLoading: boolean;
  placeIds: string[];
}

export function ReviewsTab({ darkMode, isLoading, placeIds }: Props) {
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const [reviews, setReviews] = useState<PlaceReview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (placeIds.length > 0) {
      fetchReviews();
    }
  }, [placeIds]);

  const fetchReviews = async () => {
    setIsReviewsLoading(true);
    setError(null);
    
    try {
      const allReviews: PlaceReview[] = [];
      
      for (const placeId of placeIds) {
        const response = await fetchPlaceDetails(placeId);
        if (response.result.reviews) {
          allReviews.push(...response.result.reviews);
        }
      }
      
      setReviews(allReviews);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
    } finally {
      setIsReviewsLoading(false);
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };

  const filteredReviews = reviews.filter((review) => {
    if (filter === "all") return true;
    return review.rating.toString() === filter;
  });

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${
      darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Reviews</h2>
        <select
          className="border border-gray-300 rounded p-2 text-gray-900"
          onChange={handleFilterChange}
          value={filter}
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {isReviewsLoading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No reviews found. Try adding some Place IDs.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review, index) => (
            <div
              key={`${review.author_name}-${review.time}-${index}`}
              className={`p-4 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-gray-50"
              }`}
            >
              <div className="flex items-start space-x-4">
                <Image
                  src={review.profile_photo_url}
                  alt={review.author_name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{review.author_name}</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-yellow-400">
                              {i < review.rating ? "★" : "☆"}
                            </span>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                          {review.relative_time_description}
                        </span>
                      </div>
                    </div>
                    {review.language && (
                      <span className="text-sm text-gray-500">
                        Language: {review.language}
                      </span>
                    )}
                  </div>
                  <p className="mt-2">{review.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}