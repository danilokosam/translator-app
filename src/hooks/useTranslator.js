import { useState, useCallback, useEffect } from "react";
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

  const debouncedFromText = useDebounce(fromText, 500);
  const debouncedFromLanguage = useDebounce(fromLanguage, 500);
  const debouncedToLanguage = useDebounce(toLanguage, 500);

  const handleTranslate = useCallback(async () => {
    if (!debouncedFromText.trim()) {
      setError("Please enter text to translate");
      setToText("");
      return;
    }
    if (debouncedFromText.trim().length < 2) {
      setError("Text must be at least 2 characters long");
      setToText("");
      return;
    }
    setLoading(true);
    setError(null);
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
    handleTranslate();
  }, [handleTranslate]);

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
