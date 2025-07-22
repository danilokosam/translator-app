import { useState, useCallback, useEffect, useRef } from "react";
import { useDebounce } from "../hooks/useDebounce.js";

export const useTranslator = (
  initialFromLanguage = "en-GB",
  initialToLanguage = "hi-IN"
) => {
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [fromLanguage, setFromLanguage] = useState(initialFromLanguage);
  const [toLanguage, setToLanguage] = useState(initialToLanguage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFirstRun = useRef(true);

  // Debounce inputs to avoid excessive API calls
  const debouncedFromText = useDebounce(fromText, 500);
  const debouncedFromLanguage = useDebounce(fromLanguage, 500);
  const debouncedToLanguage = useDebounce(toLanguage, 500);

  // Function to handle translation
  const handleTranslate = useCallback(async () => {
    setLoading(true);
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        debouncedFromText.trim()
      )}&langpair=${debouncedFromLanguage}|${debouncedToLanguage}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Translation API error");
      const data = await res.json();
      setToText(data.responseData.translatedText);
    } catch (error) {
      setError("Failed to translate. Please try again.");
      console.error("Translation error:", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedFromText, debouncedFromLanguage, debouncedToLanguage]);

  useEffect(() => {
    console.log(
      "EFFECT RUNNING",
      debouncedFromText,
      "isFirstRun:",
      isFirstRun.current
    );

    if (isFirstRun.current && debouncedFromText.trim().length === 0) {
      isFirstRun.current = false;
      return; // Skip only if it's the first run AND the input is empty
    }
    isFirstRun.current = false;

    // If the input text is empty, reset the translated text and show an error
    if (debouncedFromText.trim().length === 0) {
      console.log("SETTING ERROR");
      setToText("");
      setError("Text must be at least 1 character long");
      return;
    }
    setError(null);
    handleTranslate();
  }, [debouncedFromText, handleTranslate]);

  const handleExchange = useCallback(() => {
    setFromText(toText);
    setToText(fromText);
    setFromLanguage(toLanguage);
    setToLanguage(fromLanguage);
  }, [fromText, toText, fromLanguage, toLanguage]);

  return {
    fromText,
    setFromText,
    toText,
    setToText,
    fromLanguage,
    setFromLanguage,
    toLanguage,
    setToLanguage,
    loading,
    error,
    handleTranslate,
    handleExchange,
  };
};
