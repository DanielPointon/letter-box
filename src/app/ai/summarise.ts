import { useState, useEffect, useCallback } from 'react';

// Mock summaries hashmap
const MOCK_SUMMARIES = {
  // Common cases
  'hello world': 'A simple greeting.',
  'lorem ipsum': 'A placeholder text commonly used in design.',
  
  // Match by word count ranges (using Symbol to avoid key collisions)
  [Symbol('tiny')]: 'A very short summary.',
  [Symbol('short')]: 'A brief summary of the provided content.',
  [Symbol('medium')]: 'A concise summary covering the main points of the provided content.',
  [Symbol('long')]: 'A comprehensive summary of the lengthy content provided, covering key points while maintaining brevity.',
  
  // Match by content type (using regex patterns as keys)
  'email:': 'Summary of an email communication.',
  'article:': 'Summary of a news or blog article.',
  'code:': 'Description of code functionality.',
  'meeting:': 'Overview of meeting minutes.',
};

// Helper function to get mock summary based on text characteristics
const getMockSummary = (text) => {
  // First, check for exact matches
  if (MOCK_SUMMARIES[text.toLowerCase().trim()]) {
    return MOCK_SUMMARIES[text.toLowerCase().trim()];
  }

  // Check for content type prefixes
  for (const prefix of ['email:', 'article:', 'code:', 'meeting:']) {
    if (text.toLowerCase().startsWith(prefix)) {
      return MOCK_SUMMARIES[prefix];
    }
  }

  // Fall back to length-based summaries
  const wordCount = text.split(/\s+/).length;
  if (wordCount < 10) return MOCK_SUMMARIES[Symbol('tiny')];
  if (wordCount < 50) return MOCK_SUMMARIES[Symbol('short')];
  if (wordCount < 200) return MOCK_SUMMARIES[Symbol('medium')];
  return MOCK_SUMMARIES[Symbol('long')];
};

// Mock summarizer implementation
const createMockSummarizer = () => ({
  summarize: async (text) => {
    // Add a small random delay to simulate processing
    await new Promise(resolve => 
      setTimeout(resolve, Math.random() * 500 + 500)
    );
    return getMockSummary(text);
  },
  destroy: () => {},
});

export function useSummarizer({ 
  useMockOnFailure = true,
  mockSummaries = MOCK_SUMMARIES 
} = {}) {
  const [summarizer, setSummarizer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMocked, setIsMocked] = useState(false);

  useEffect(() => {
    async function createSummarizer() {
      // Check if the AI API is available
      if (!window.ai?.summarizer) {
        if (useMockOnFailure) {
          setSummarizer(createMockSummarizer());
          setIsMocked(true);
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
          if (useMockOnFailure) {
            setSummarizer(createMockSummarizer());
            setIsMocked(true);
          } else {
            setError('Summarization is not supported on this device');
          }
        }
      } catch (error) {
        if (useMockOnFailure) {
          setSummarizer(createMockSummarizer());
          setIsMocked(true);
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
      if (summarizer && !isMocked) {
        summarizer.destroy();
      }
    };
  }, [useMockOnFailure]);

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
    isMocked,
  };
}