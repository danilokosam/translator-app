// Custom error class for handling translation-related errors
export class TranslationApiError extends Error {
  constructor(message, status) {
    super(message); // Call the parent Error constructor with the message
    this.name = "TranslationApiError"; // Set a custom error name
    this.status = status; // Store the HTTP-like status code for context
  }
}

// Object that provides access to translation functionality via an external API
export const translationApi = {
  // Asynchronous method to translate text from one language to another
  async translate(text, fromLang, toLang) {
    // Validate input: if the text is empty or only whitespace, throw an error
    if (!text?.trim()) {
      throw new TranslationApiError(
        "Text must be at least 1 character long",
        400, // Bad Request
      );
    }

    // Construct the API URL with encoded query text and language pair
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text.trim(),
    )}&langpair=${fromLang}|${toLang}`;

    // Make the HTTP request to the translation API
    const response = await fetch(url);

    // If the response is not OK (e.g. 500, 404), throw an error with the status code
    if (!response.ok) {
      throw new TranslationApiError("Translation API error", response.status);
    }

    // Parse the response as JSON
    const data = await response.json();

    // Return the translated text from the response payload
    return data.responseData.translatedText;
  },
};
