import { TranslationApiError } from "../services/translationApi.js";

export const getErrorMessage = (error) => {
  if (error instanceof TranslationApiError) {
    return error.message;
  }
  return "Failed to translate. Please try again.";
};
