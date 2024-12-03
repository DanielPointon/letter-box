import { useState, useEffect, useCallback } from 'react';

export function useSummarizer() {
  const [summarizer, setSummarizer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function createSummarizer() {
      // Check if the AI API is available
      if (!window.ai?.summarizer) { //@ts-ignore
        setError('Summarization API not available');
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
          setError('Summarization is not supported on this device');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
      } finally {
        setIsLoading(false);
      }
    }

    createSummarizer();

    // Cleanup function
    return () => {
      if (summarizer) {
        summarizer.destroy();
      }
    };
  }, []);

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
  };
}