import React, { useState } from "react";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import {
  MessagesSquare,
  Star,
  Clock,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

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
  rating?: number;
  responseTime?: string;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    text: "Great service!",
    originalText: "Great service!",
    lang: "English",
    userId: "1",
    user: {
      id: "1",
      username: "John Doe",
      avatarUrl: "https://via.placeholder.com/40",
    },
    imageUrl: "https://via.placeholder.com/150",
    responded: false,
    rating: 5,
    responseTime: "2h",
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
    rating: 4,
    responseTime: "1d",
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
    rating: 3,
    responseTime: "3d",
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

  const renderStars = (rating: number = 0) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 bg-gray-800 text-white bg-white text-gray-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
          Customer Reviews
        </h2>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-2">
            <select
              className="border rounded-lg p-2 bg-white border-gray-300">
              onChange={handleLanguageChange}
              value={selectedLanguage}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
            </select>
            <button
              onClick={translateAllReviews}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
              disabled={isReviewsLoading}
            >
              {isReviewsLoading ? (
                <CircularProgress size={20} className="mr-2" />
              ) : null}
              <span>Translate All</span>
            </button>
          </div>
          <select
            className="border rounded-lg p-2 bg-gray-700 border-gray-600 bg-white border-gray-300"
            onChange={handleFilterChange}
          >
            <option value="all">All Reviews</option>
            <option value="responded">Responded</option>
            <option value="not-responded">Not Responded</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className={`p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 bg-gray-50 border ${
              review.responded ? "border-green-500" : "border-yellow-500"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <Image
                    width={48}
                    height={48}
                    src={review.user.avatarUrl}
                    alt={review.user.username}
                    className="rounded-full"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${
                      review.responded ? "bg-green-500" : "bg-yellow-500"
                    } border-2 border-white`}
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-lg">
                      {review.user.username}
                    </h3>
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span>{review.lang}</span>
                    <span>•</span>
                    <Clock className="w-4 h-4" />
                    <span>{review.responseTime}</span>
                    <span>•</span>
                    {review.responded ? (
                      <span className="flex items-center text-green-500">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Responded
                      </span>
                    ) : (
                      <span className="flex items-center text-yellow-500">
                        <MessagesSquare className="w-4 h-4 mr-1" />
                        Awaiting Response
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-lg mb-4 ${
                      review.isTranslating ? "animate-pulse" : ""
                    }`}
                  >
                    {review.isTranslating ? "Translating..." : review.text}
                  </p>
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
                  className="rounded-lg shadow-md"
                />
              </div>
            )}

            <div className="mt-4 flex items-center space-x-4">
              <Link
                href={`/dashboard/reviews/${review.id}`}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <span>Respond</span>
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Link>
              <button
                onClick={() => translateReview(review.id)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 bg-white hover:bg-gray-100 text-sm font-medium shadow-md hover:shadow-lg flex items-center`}
                disabled={review.isTranslating}
              >
                {review.isTranslating ? "Translating..." : "Translate"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsTab;
