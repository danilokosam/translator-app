import { useState, useCallback } from "react";

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

  const handleTranslate = useCallback(async () => {
    if (!fromText) {
      setError("Please enter text to translate");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        fromText
      )}&langpair=${fromLanguage}|${toLanguage}`;
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
  }, [fromText, fromLanguage, toLanguage]);

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
