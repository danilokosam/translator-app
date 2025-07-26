import { useState, useCallback, useEffect, useRef } from "react";
import { useDebounce } from "../hooks/useDebounce.js";
import { useQuery } from "@tanstack/react-query";

export const useTranslator = (
  initialFromLanguage = "en-GB",
  initialToLanguage = "es-ES"
) => {
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [fromLanguage, setFromLanguage] = useState(initialFromLanguage);
  const [toLanguage, setToLanguage] = useState(initialToLanguage);
  const [error, setError] = useState(null);
  const hasInteracted = useRef(false);

  // Debounce inputs to avoid excessive API calls
  const debouncedFromText = useDebounce(fromText, 500);
  const debouncedFromLanguage = useDebounce(fromLanguage, 500);
  const debouncedToLanguage = useDebounce(toLanguage, 500);

  // Function to perform the translation
  const fetchTranslation = async ({ queryKey }) => {
    const [, { text, fromLang, toLang }] = queryKey;
    if (!text.trim()) throw new Error("Text must be at least 1 character long");

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text.trim()
    )}&langpair=${fromLang}|${toLang}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Translation API error");
    const data = await res.json();
    return data.responseData.translatedText;
  };

  // Using TanStack Query to manage translation
  const {
    data: translatedText,
    isFetching,
    error: queryError,
  } = useQuery({
    queryKey: [
      "translation",
      {
        text: debouncedFromText,
        fromLang: debouncedFromLanguage,
        toLang: debouncedToLanguage,
      },
    ],
    queryFn: fetchTranslation,
    enabled: debouncedFromText.trim().length > 0, // Only execute if there is text
    retry: 1, // Retry only once in case of error
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  // Detect if the user has interacted with the input
  useEffect(() => {
    if (!hasInteracted.current && fromText.trim().length > 0) {
      console.log("User interaction detected:", fromText);
      hasInteracted.current = true; // User has typed something
      console.log("User has interacted with the input. Actual state:", {
        fromText,
      });
    }
  }, [fromText]);

  // Update the error status and toText according to the query result
  useEffect(() => {
    // If the hasInteracted flag is false and the debounced text is empty, do nothing
    if (!hasInteracted.current && debouncedFromText.trim().length === 0) {
      return;
    }

    // If the debounced text is empty and, set toText to empty and show an error
    if (debouncedFromText.trim().length === 0) {
      setToText("");
      setError("Text must be at least 1 character long");
      return;
    }

    // If there is an error from the query, set the error message and clear toText
    if (queryError) {
      setError("Failed to translate. Please try again.");
      setToText("");
    } else if (translatedText) {
      setToText(translatedText);
      setError(null);
    }
  }, [debouncedFromText, translatedText, queryError]);

  // Language and text exchange function
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
    loading: isFetching,
    error,
    // handleTranslate: () => {}, // Not used, delete later
    handleExchange,
  };
};
