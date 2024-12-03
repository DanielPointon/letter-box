"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ReviewDetails() {
  const { id } = useParams();
  const [response, setResponse] = useState("");
  const [translation, setTranslation] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Mock review data
  const mockReview = {
    language: "Spanish",
    content: "The service was fantastic! I received my order on time, and the quality was excellent.",
    date: "Nov 29, 2024"
  };

  // Mock translations
  const mockTranslations = {
    Spanish: {
      "Thank you for your feedback! We're glad you enjoyed your experience and will strive to make it even better.":
        "¡Gracias por sus comentarios! ¡Nos alegra que haya disfrutado de su experiencia y nos esforzaremos por mejorarla aún más!"
    }
  };

  const getTranslation = (text: string): string => {
    return mockTranslations[mockReview.language]?.[text] || 
      `[${mockReview.language} translation would go here]`;
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
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isTyping) {
      setResponse(e.target.value);
      setTranslation(getTranslation(e.target.value));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        {/* Review Header */}
        <div className="flex items-center mb-6">
          <div className="bg-blue-500 text-white w-12 h-12 flex justify-center items-center rounded-full text-xl font-bold">
            A
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Customer Review #{id}
            </h2>
            <p className="text-sm text-gray-500">Posted on {mockReview.date}</p>
          </div>
        </div>

        {/* Review Content */}
        <div className="mb-6">
          <p className="text-lg text-gray-700 mb-2">
            {mockReview.content}
          </p>
          <p className="text-sm text-gray-500">Language: {mockReview.language}</p>
        </div>

        {/* Respond Section */}
        {!isSubmitted ? (
          <div>
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              Respond to Review
            </h3>

            {/* Dual Language Response Display */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">English</label>
                <textarea
                  value={response}
                  onChange={handleResponseChange}
                  className="w-full h-32 border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Write your response..."
                  disabled={isTyping}
                />
                {isTyping && (
                  <span className="absolute bottom-3 right-3 animate-pulse text-blue-500">▍</span>
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">{mockReview.language}</label>
                <textarea
                  value={translation}
                  className="w-full h-32 border-gray-300 rounded p-2 bg-gray-50 text-gray-900"
                  disabled
                  placeholder="Translation will appear here..."
                />
                {isTyping && (
                  <span className="absolute bottom-3 right-3 animate-pulse text-blue-500">▍</span>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGenerateAIResponse}
                className={`${
                  aiLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-500"
                } text-white px-4 py-2 rounded shadow flex items-center space-x-2`}
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
                  ${isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-500'} 
                  text-white px-4 py-2 rounded shadow flex items-center space-x-2
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
          <div className="text-center py-8">
            <div className="text-2xl font-bold text-green-600 mb-2">
              Response submitted!
            </div>
            <p className="text-gray-600">
              Your response has been successfully submitted and translated.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}