import React from "react";
import { useState, useEffect } from "react";

const SAMPLE_LANGUAGE_PAIR = {
  sourceLanguage: "en",
  targetLanguage: "es",
};

export function useTranslator(languagePair = SAMPLE_LANGUAGE_PAIR) {
  const [translator, setTranslator] = useState(null);

  useEffect(() => {
    async function createTranslator() {
      if (window.translation == null) {
        console.error("Translation API not available");
        return;
      }

      try {
        const canTranslate = await window.translation.canTranslate(
          languagePair
        );

        if (canTranslate !== "no") {
          if (canTranslate === "readily") {
            // The translator can immediately be used.
            const translator = await window.translation.createTranslator(
              languagePair
            );
            setTranslator(translator);
          } else {
            console.error(
              "The translator can be used after the model download."
            );
          }
        } else {
          console.error("The chosen language pair is not supported.");
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error(String(error));
        }
      }
    }

    createTranslator();
  }, [languagePair]);

  const translateTextWithAi = React.useCallback(
    (text: string) => {
      if (translator == null) {
        console.error("Translator API not available");
        return;
      }

      return translator.translate(text);
    },
    [translator]
  );

  return { translateTextWithAi };
}
