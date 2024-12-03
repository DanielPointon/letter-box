import { useState, useEffect, useCallback } from 'react';

// Default fallback summaries
const DEFAULT_FALLBACK_SUMMARIES = {
  // Common cases
  'hello world': 'A simple greeting.',
  'lorem ipsum': 'A placeholder text commonly used in design.',
  
  // Match by word count ranges (using Symbol to avoid key collisions)
  [Symbol('tiny')]: 'A very short summary.',
  [Symbol('short')]: 'A brief summary of the provided content.',
  [Symbol('medium')]: 'A concise summary of the main points of the provided content.',
  [Symbol('long')]: 'A comprehensive summary of the lengthy content provided, covering key points while maintaining brevity.',
  
  // Match by content type (using regex patterns as keys)
  'email:': 'Summary of an email communication.',
  'article:': 'Summary of a news or blog article.',
  'code:': 'Description of code functionality.',
  'meeting:': 'Summary of meeting minutes.',
};

// Helper function to get fallback summary based on text characteristics
const getFallbackSummary = (text, fallbackSummaries) => {
  // First, check for exact matches
  if (fallbackSummaries[text.toLowerCase().trim()]) {
    return fallbackSummaries[text.toLowerCase().trim()];
  }

  // Check for content type prefixes
  for (const prefix of ['email:', 'article:', 'code:', 'meeting:']) {
    if (text.toLowerCase().startsWith(prefix)) {
      return fallbackSummaries[prefix];
    }
  }

  // Fall back to length-based summaries
  const wordCount = text.split(/\s+/).length;
  if (wordCount < 10) return fallbackSummaries[Symbol('tiny')];
  if (wordCount < 50) return fallbackSummaries[Symbol('short')];
  if (wordCount < 200) return fallbackSummaries[Symbol('medium')];
  return fallbackSummaries[Symbol('long')];
};

// Fallback summarizer implementation
const createFallbackSummarizer = (fallbackSummaries) => ({
  summarize: async (text) => {
    // Add a small random delay to simulate processing
    await new Promise(resolve => 
      setTimeout(resolve, Math.random() * 500 + 500)
    );
    return getFallbackSummary(text, fallbackSummaries);
  },
  destroy: () => {},
});

export function useSummarizer({ 
  useFallback = true,
  fallbackSummaries = DEFAULT_FALLBACK_SUMMARIES 
} = {}) {
  const [summarizer, setSummarizer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    async function createSummarizer() {
      // Check if the AI API is available
      if (!window.ai?.summarizer) {
        if (useFallback) {
          setSummarizer(createFallbackSummarizer(fallbackSummaries));
          setIsFallback(true);
        } else {
          setError('Summarization API not available');
        }
        setIsLoading(false);
        return;
      }

      try {
        // Check capabilities
        const canSummarize = await window.ai.summarizer.capabilities();

        if (canSummarize && canSummarize.available !== 'no') {
          if (canSummarize.available === 'readily') {
            // The summarizer can immediately be used
            const newSummarizer = await window.ai.summarizer.create();
            setSummarizer(newSummarizer);
          } else {
            // The summarizer needs to download the model first
            const newSummarizer = await window.ai.summarizer.create();
            
            // Add download progress listener
            newSummarizer.addEventListener('downloadprogress', (e) => {
              console.log(`Download progress: ${(e.loaded / e.total) * 100}%`);
            });

            // Wait for the model to be ready
            await newSummarizer.ready;
            setSummarizer(newSummarizer);
          }
        } else {
          if (useFallback) {
            setSummarizer(createFallbackSummarizer(fallbackSummaries));
            setIsFallback(true);
          } else {
            setError('Summarization is not supported on this device');
          }
        }
      } catch (error) {
        if (useFallback) {
          setSummarizer(createFallbackSummarizer(fallbackSummaries));
          setIsFallback(true);
        } else {
          setError(error instanceof Error ? error.message : String(error));
        }
      } finally {
        setIsLoading(false);
      }
    }

    createSummarizer();

    // Cleanup function
    return () => {
      if (summarizer && !isFallback) {
        summarizer.destroy();
      }
    };
  }, [useFallback, fallbackSummaries]);

  const summarizeText = useCallback(async (text) => {
    if (!summarizer) {
      throw new Error('Summarizer not initialized');
    }

    try {
      const result = await summarizer.summarize(text);
      return result;
    } catch (error) {
      throw error instanceof Error ? error : new Error(String(error));
    }
  }, [summarizer]);

  return {
    summarizeText,
    isLoading,
    error,
    isFallback,
  };
}