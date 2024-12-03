import React, { useState } from "react";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
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
  isTranslating?: boolean;
  originalText?: string;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    text: "Great service!",
    originalText: "Great service!", // to allow this demo to run on non-gemini-nano machines
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
    originalText: "My favourite product!",
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
    originalText: "Very good product!",
  },
];

export const ReviewsTab: React.FC<{
  isLoading: boolean;
}> = ({ isLoading }) => {
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [filter, setFilter] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("English");

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 bg-white text-gray-900">
        <CircularProgress />
      </div>
    );
  }

  const translateReview = async (reviewId: string) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              isTranslating: true,
              originalText: review.originalText || review.text,
            }
          : review
      )
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              isTranslating: false,
              text: `Translated to ${selectedLanguage}: ${review.originalText}`,
            }
          : review
      )
    );
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedLanguage(event.target.value as Language);
  };

  const translateAllReviews = async () => {
    setIsReviewsLoading(true);

    setReviews((prevReviews) =>
      prevReviews.map((review) => ({
        ...review,
        isTranslating: true,
        originalText: review.originalText || review.text,
      }))
    );

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setReviews((prevReviews) =>
      prevReviews.map((review) => ({
        ...review,
        isTranslating: false,
        text: `Translated to ${selectedLanguage}: ${review.originalText}`,
      }))
    );

    setIsReviewsLoading(false);
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
    <div className="bg-white rounded-lg shadow p-6 bg-white text-gray-900">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <select
              className="border-gray-300 rounded p-2"
              onChange={handleLanguageChange}
              value={selectedLanguage}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
            </select>
            <button
              onClick={translateAllReviews}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-200"
              disabled={isReviewsLoading}
            >
              {isReviewsLoading ? (
                <span className="flex items-center">
                  <CircularProgress size={20} className="mr-2" />
                  Translating...
                </span>
              ) : (
                "Translate All"
              )}
            </button>
          </div>
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

      <ul className="space-y-4">
        {filteredReviews.map((review) => (
          <li
            key={review.id}
            className="p-4 rounded-lg shadow flex flex-col hover:bg-gray-100 bg-gray-50
           transition-all duration-300"
          >
            <div className="flex items-center mb-4">
              <Image
                width={40}
                height={40}
                src={review.user.avatarUrl}
                alt={review.user.username}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div className="flex-grow">
                <div
                  className={`font-medium ${
                    review.isTranslating
                      ? "animate-pulse"
                      : "transition-opacity duration-300"
                  }`}
                >
                  {review.isTranslating ? "Translating..." : review.text}
                </div>
                <div className="text-sm">
                  {review.user.username} - Original Language: {review.lang}
                </div>
                <div className="flex items-center space-x-4 mt-2">
                  <Link href={`/dashboard/reviews/${review.id}`}>
                    <span className="text-blue-600 hover:underline">
                      Respond
                    </span>
                  </Link>
                  <button
                    onClick={() => translateReview(review.id)}
                    className="text-green-600 hover:text-green-700 text-sm"
                    disabled={review.isTranslating}
                  >
                    {review.isTranslating ? "Translating..." : "Translate"}
                  </button>
                </div>
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
        ))}
      </ul>
    </div>
  );
};
