"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ReviewDetails() {
  const { id } = useParams();
  const [response, setResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<string>("");
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

  // Typewriter effect function
  const typewriterEffect = async (finalText: string, speed: number = 30) => {
    setIsTyping(true);
    let currentText = "";
    
    for (let i = 0; i < finalText.length; i++) {
      currentText += finalText[i];
      setResponse(currentText);
      await new Promise(resolve => setTimeout(resolve, speed));
    }
    
    setIsTyping(false);
  };

  const handleGenerateAIResponse = async () => {
    setAiLoading(true);
    const aiResponse = "Thank you for your feedback! We're glad you enjoyed your experience and will strive to make it even better.";
    
    // Start typewriter effect
    await typewriterEffect(aiResponse);
    setAiLoading(false);
  };

  const handleSubmitResponse = async () => {
    setIsSubmitting(true);
    setSubmissionStatus(`Translating into ${mockReview.language}...`);

    // Store original text
    const originalText = response;
    
    // Get translation
    const translatedText = mockTranslations[mockReview.language]?.[originalText] || 
      `[${mockReview.language} translation would go here]`;

    // Clear current text and type out translation
    setResponse("");
    await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause
    await typewriterEffect(translatedText);
    
    setSubmissionStatus("Done");
    setIsSubmitted(true);

    // Reset submission status after a moment
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionStatus("");
    }, 1000);
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
        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-4">
            Respond to Review
          </h3>

          {/* Response Input */}
          <div className="relative">
            <textarea
              value={response}
              onChange={(e) => !isTyping && setResponse(e.target.value)}
              className="w-full h-32 border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Write your response..."
              disabled={isSubmitted || isTyping}
            />
            {isTyping && (
              <span className="absolute bottom-3 right-3 animate-pulse text-blue-500">▍</span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-4 mt-4">
            <button
              onClick={handleGenerateAIResponse}
              className={`${
                aiLoading || isSubmitted ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-500"
              } text-white px-4 py-2 rounded shadow flex items-center space-x-2`}
              disabled={aiLoading || isSubmitting || isSubmitted || isTyping}
            >
              {aiLoading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
            <div className="relative">
              <button 
                onClick={handleSubmitResponse}
                disabled={isSubmitting || !response || isSubmitted || isTyping}
                className={`
                  ${isSubmitting || isSubmitted ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-500'} 
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
                  <span>{isSubmitted ? 'Submitted' : 'Submit Response'}</span>
                )}
              </button>
              {submissionStatus && (
                <div className="absolute top-full left-0 mt-2 text-sm text-gray-600">
                  {submissionStatus}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}