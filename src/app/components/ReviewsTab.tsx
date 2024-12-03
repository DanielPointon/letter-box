import { CircularProgress } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

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
  imageUrl?: string;
  responded: boolean;
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
    imageUrl: "https://via.placeholder.com/150",
    responded: false,
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
    responded: true,
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
    imageUrl: "https://via.placeholder.com/150",
    responded: false,
  },
];

export function ReviewsTab({
  darkMode,
  isLoading,
}: {
  darkMode: boolean;
  isLoading: boolean;
}) {
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [filter, setFilter] = useState("all");

  if (isLoading) {
    return (
      <div
        className={`bg-white rounded-lg shadow p-6 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <CircularProgress />
      </div>
    );
  }

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

  const fetchReviews = () => {
    setIsReviewsLoading(true);
    // Mock API call with timeout
    setTimeout(() => {
      // Here you would fetch reviews based on placeId
      setReviews(MOCK_REVIEWS); // Replace with fetched reviews
      setIsReviewsLoading(false);
    }, 1000); // Simulate 1 second API call
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };

  const filteredReviews = reviews.filter((review) => {
    if (filter === "responded") return review.responded;
    if (filter === "not-responded") return !review.responded;
    return true;
  });

  return (
    <div
      className={`bg-white rounded-lg shadow p-6 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <div className="flex space-x-4">
          <select
            className="border-gray-300 rounded p-2"
            onChange={handleLanguageChange}
          >
            <option value="English">Translate to English</option>
            <option value="Spanish">Translate to Spanish</option>
            <option value="French">Translate to French</option>
          </select>
          <select
            className="border-gray-300 rounded p-2"
            onChange={handleFilterChange}
          >
            <option value="all">All Reviews</option>
            <option value="responded">Responded</option>
            <option value="not-responded">Not Responded</option>
          </select>
        </div>
      </div>

      <div className="flex items-center mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={fetchReviews}
        >
          Fetch Reviews
        </button>
      </div>

      <ul className="space-y-4">
        {isReviewsLoading ? (
          <CircularProgress />
        ) : (
          filteredReviews.map((review) => (
            <li
              key={review.id}
              className={`p-4 rounded-lg shadow flex flex-col hover:bg-gray-100 ${
                darkMode ? "bg-gray-700" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center mb-4">
                <Image
                  width={40}
                  height={40}
                  src={review.user.avatarUrl}
                  alt={review.user.username}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <div className="font-medium">{review.text}</div>
                  <div className="text-sm">
                    {review.user.username} - Original Language: {review.lang}
                  </div>
                  <Link href={`/dashboard/reviews/${review.id}`}>
                    <div className="text-blue-600 hover:underline">Respond</div>
                  </Link>
                </div>
              </div>
              {review.imageUrl && (
                <div className="mt-4">
                  <Image
                    width={150}
                    height={150}
                    src={review.imageUrl}
                    alt="Review Image"
                    className="rounded-lg"
                  />
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
