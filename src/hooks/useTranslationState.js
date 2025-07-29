import { useState, useEffect } from "react";
import { useInteractionTracker } from "./useInteractionTracker.js";
import { getErrorMessage } from "../utils/errorHandler.js";

export const useTranslationState = (debouncedFromText, queryResult) => {
  const [toText, setToText] = useState("");
  const [error, setError] = useState(null);
  const hasInteracted = useInteractionTracker(debouncedFromText);

  const { data: translatedText, error: queryError } = queryResult;

  useEffect(() => {
    if (!hasInteracted && !debouncedFromText?.trim()) {
      return;
    }

    if (!debouncedFromText?.trim()) {
      setToText("");
      setError("Text must be at least 1 character long");
      return;
    }

    if (queryError) {
      setError(getErrorMessage(queryError));
      setToText("");
    } else if (translatedText) {
      setToText(translatedText);
      setError(null);
    }
  }, [debouncedFromText, translatedText, queryError, hasInteracted]);

  return { toText, setToText, error };
};
