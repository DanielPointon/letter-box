"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";

export default function ReviewDetails() {
  const { id } = useParams();
  const { data: session } = useSession();

  const [response, setResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleGenerateAIResponse = async () => {
    setAiLoading(true);
    setTimeout(() => {
      setResponse(
        "Thank you for your feedback! We're glad you enjoyed your experience and will strive to make it even better."
      );
      setAiLoading(false);
    }, 2000);
  };

  const handleSubmitResponse = async () => {
    if (!session?.accessToken) {
      console.error("No access token available");
      return;
    }

    setSubmitLoading(true);
    try {
      const result = await fetch('/api/reviews/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          placeId: id,
          response: response,
          accessToken: session.accessToken
        })
      });

      if (!result.ok) {
        throw new Error('Failed to publish review');
      }

      // Handle success (e.g., show success message, redirect)
    } catch (error) {
      console.error('Failed to publish review:', error);
      // Handle error (e.g., show error message)
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <div className="bg-blue-500 text-white w-12 h-12 flex justify-center items-center rounded-full text-xl font-bold">
            A
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Customer Review #{id}
            </h2>
            <p className="text-sm text-gray-500">Posted on Nov 29, 2024</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-lg text-gray-700 mb-2">
            "The service was fantastic! I received my order on time, and the
            quality was excellent."
          </p>
          <p className="text-sm text-gray-500">Language: English</p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-4">
            Respond to Review
          </h3>

          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="w-full h-32 border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Write your response..."
          />

          <div className="flex items-center space-x-4 mt-4">
            <button
              onClick={handleGenerateAIResponse}
              className={`${
                aiLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-500"
              } text-white px-4 py-2 rounded shadow flex items-center space-x-2`}
              disabled={aiLoading}
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
            
            {!session ? (
              <button
                onClick={() => signIn("google")}
                className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-500"
              >
                Sign in with Google to Respond
              </button>
            ) : (
              <button 
                onClick={handleSubmitResponse}
                disabled={submitLoading}
                className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-500 disabled:bg-gray-400"
              >
                {submitLoading ? 'Submitting...' : 'Submit Response'}
              </button>
            )}
          </div>
        </div>

        {response && (
          <div className="mt-6 bg-gray-50 p-4 rounded border border-gray-300">
            <h4 className="font-semibold text-gray-700">Your Response:</h4>
            <p className="text-gray-600 mt-2">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}