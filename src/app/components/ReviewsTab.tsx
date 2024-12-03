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
      avatarUrl: "data:image/jpeg;base64,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",
    },
    imageUrl: "data:image/jpeg;base64,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",
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
      avatarUrl: "data:image/jpeg;base64,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",
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
      avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRge15mCcZx7Vo5AfyJJLjA9SRuW85PGAaBsg&s",
    },
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/07/Lounge_Burger_with_Bacon.jpg",
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
      <div className="bg-gray-900/50 rounded-lg shadow-2xl p-6 backdrop-blur-lg border border-gray-800">
        <CircularProgress className="text-blue-400" />
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
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
        }`}
      />
    ));
  };

  return (
    <div className="bg-gray-900/50 rounded-xl shadow-2xl p-6 backdrop-blur-lg border border-gray-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
          Customer Reviews
        </h2>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-2">
            <select
              className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={handleLanguageChange}
              value={selectedLanguage}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
            </select>
            <button
              onClick={translateAllReviews}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 disabled:opacity-50"
              disabled={isReviewsLoading}
            >
              {isReviewsLoading ? (
                <CircularProgress size={20} className="mr-2 text-white" />
              ) : null}
              <span>Translate All</span>
            </button>
          </div>
          <select
            className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className={`p-6 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 bg-gray-800/50 backdrop-blur-lg border ${
              review.responded ? "border-green-500/30" : "border-yellow-500/30"
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
                    className="rounded-full ring-2 ring-gray-700"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${
                      review.responded ? "bg-green-500" : "bg-yellow-500"
                    } ring-2 ring-gray-900`}
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-lg text-gray-200">
                      {review.user.username}
                    </h3>
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                    <span>{review.lang}</span>
                    <span>•</span>
                    <Clock className="w-4 h-4" />
                    <span>{review.responseTime}</span>
                    <span>•</span>
                    {review.responded ? (
                      <span className="flex items-center text-green-400">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Responded
                      </span>
                    ) : (
                      <span className="flex items-center text-yellow-400">
                        <MessagesSquare className="w-4 h-4 mr-1" />
                        Awaiting Response
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-lg mb-4 text-gray-300 ${
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
                  className="rounded-lg shadow-md ring-1 ring-gray-700"
                />
              </div>
            )}

            <div className="mt-4 flex items-center space-x-4">
              <Link
                href={`/dashboard/reviews/${review.id}`}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <span>Respond</span>
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Link>
              <button
                onClick={() => translateReview(review.id)}
                className="px-4 py-2 rounded-lg transition-all duration-200 bg-gray-700 hover:bg-gray-600 text-sm font-medium shadow-md hover:shadow-lg text-gray-200 flex items-center disabled:opacity-50"
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