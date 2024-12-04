"use client";

import { useReviews } from "@/context/reviewsContext";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ReviewDetails() {
  const { id } = useParams();
  const { getReviewById, markAsResponded, translations } = useReviews();
  const review = getReviewById(id as string);
  
  const [response, setResponse] = useState("");
  const [translation, setTranslation] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const getTranslation = (text: string): string => {
    if (!review?.lang || review.lang === "English") return text;
    return translations[review.lang]?.[text] || `[${review.lang} translation would go here]`;
  };

  const typewriterEffect = async (text: string, translatedText: string, speed: number = 30) => {
    setIsTyping(true);
    let currentText = "";
    let currentTranslation = "";
    
    for (let i = 0; i < text.length || i < translatedText.length; i++) {
      if (i < text.length) {
        currentText += text[i];
        setResponse(currentText);
      }
      if (i < translatedText.length) {
        currentTranslation += translatedText[i];
        setTranslation(currentTranslation);
      }
      await new Promise(resolve => setTimeout(resolve, speed));
    }
    
    setIsTyping(false);
  };

  const handleGenerateAIResponse = async () => {
    setAiLoading(true);
    const aiResponse = "Thank you for your feedback! We're glad you enjoyed your experience and will strive to make it even better.";
    const translatedResponse = getTranslation(aiResponse);
    
    setResponse("");
    setTranslation("");
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await typewriterEffect(aiResponse, translatedResponse);
    setAiLoading(false);
  };

  const handleSubmitResponse = async () => {
    if (!id) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    markAsResponded(id);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isTyping) {
      setResponse(e.target.value);
      setTranslation(getTranslation(e.target.value));
    }
  };

  if (!review) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-white">Review not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto bg-gray-800/50 backdrop-blur-lg rounded-lg shadow-2xl p-6 border border-gray-700">
        {/* Review Header */}
        <div className="flex items-center mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white w-12 h-12 flex justify-center items-center rounded-full text-xl font-bold shadow-lg">
            {review.user.username[0]}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-200">
              {review.user.username}
            </h2>
            <p className="text-sm text-gray-400">Posted {review.responseTime} ago</p>
          </div>
        </div>

        {/* Review Content */}
        <div className="mb-6 p-4 rounded-lg bg-gray-900/50 border border-gray-700">
          <p className="text-lg text-gray-300 mb-2">
            {review.text}
          </p>
          <p className="text-sm text-gray-400">Language: {review.lang}</p>
        </div>

        {/* Respond Section */}
        {!isSubmitted ? (
          <div>
            <h3 className="text-lg font-bold text-gray-200 mb-4">
              Respond to Review
            </h3>

            {/* Dual Language Response Display */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">English</label>
                <textarea
                  value={response}
                  onChange={handleResponseChange}
                  className="w-full h-32 bg-gray-900/70 border-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-500"
                  placeholder="Write your response..."
                  disabled={isTyping}
                />
                {isTyping && (
                  <span className="absolute bottom-3 right-3 animate-pulse text-blue-400">▍</span>
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">{review.lang}</label>
                <textarea
                  value={translation}
                  className="w-full h-32 bg-gray-900/50 border-gray-700 rounded-lg p-2 text-gray-300"
                  disabled
                  placeholder="Translation will appear here..."
                />
                {isTyping && (
                  <span className="absolute bottom-3 right-3 animate-pulse text-blue-400">▍</span>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGenerateAIResponse}
                className={`${
                  aiLoading ? "bg-gray-700" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                } text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl flex items-center space-x-2 transition-all duration-200`}
                disabled={aiLoading || isSubmitting || isTyping}
              >
                {aiLoading && (
                  <svg
                    className="animate-spin h-5 w-5 text-white mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                )}
                <span>Generate AI Response</span>
              </button>
              <button 
                onClick={handleSubmitResponse}
                disabled={isSubmitting || !response || isTyping}
                className={`
                  ${isSubmitting || !response || isTyping ? 'bg-gray-700' : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500'} 
                  text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl flex items-center space-x-2 transition-all duration-200 disabled:opacity-50
                `}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Response</span>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-900/50 rounded-lg border border-green-500/30">
            <div className="text-2xl font-bold text-green-400 mb-2">
              Response submitted!
            </div>
            <p className="text-gray-300">
              Your response has been successfully submitted and translated.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}