import { useQuery } from "@tanstack/react-query";
import { translationApi } from "../services/translationApi.js";

export const useTranslationQuery = (text, fromLang, toLang) => {
  return useQuery({
    // Unique key for the query; used for caching and refetching
    queryKey: ["translation", { text, fromLang, toLang }],

    // The function that will be called when the query runs
    // It's wrapped in an arrow function to prevent immediate execution
    queryFn: () => translationApi.translate(text, fromLang, toLang),

    // Only run the query if text is non-empty after trimming
    enabled: text?.trim().length > 0,

    // Number of retry attempts if the request fails
    retry: 1,

    // Time in milliseconds before the cached data becomes stale (1 hour)
    staleTime: 1000 * 60 * 60,
  });
};
