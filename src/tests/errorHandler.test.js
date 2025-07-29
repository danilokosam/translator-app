import { describe, it, expect } from "vitest";
import { getErrorMessage } from "../utils/errorHandler.js";
import { TranslationApiError } from "../services/translationApi.js";

describe("errorHandler", () => {
  describe("getErrorMessage", () => {
    it("should return custom message for TranslationApiError", () => {
      const error = new TranslationApiError(
        "Text must be at least 1 character long",
        400
      );

      const result = getErrorMessage(error);

      expect(result).toBe("Text must be at least 1 character long");
    });

    it("should return custom message for TranslationApiError with API error", () => {
      const error = new TranslationApiError("Translation API error", 500);

      const result = getErrorMessage(error);

      expect(result).toBe("Translation API error");
    });

    it("should return default message for generic Error", () => {
      const error = new Error("Some random error");

      const result = getErrorMessage(error);

      expect(result).toBe("Failed to translate. Please try again.");
    });

    it("should return default message for network Error", () => {
      const error = new Error("Network error");

      const result = getErrorMessage(error);

      expect(result).toBe("Failed to translate. Please try again.");
    });

    it("should return default message for TypeError", () => {
      const error = new TypeError("Cannot read property of undefined");

      const result = getErrorMessage(error);

      expect(result).toBe("Failed to translate. Please try again.");
    });

    it("should return default message for string error", () => {
      const error = "String error message";

      const result = getErrorMessage(error);

      expect(result).toBe("Failed to translate. Please try again.");
    });

    it("should return default message for null error", () => {
      const error = null;

      const result = getErrorMessage(error);

      expect(result).toBe("Failed to translate. Please try again.");
    });

    it("should return default message for undefined error", () => {
      const error = undefined;

      const result = getErrorMessage(error);

      expect(result).toBe("Failed to translate. Please try again.");
    });

    it("should return default message for object error", () => {
      const error = { message: "Some object error" };

      const result = getErrorMessage(error);

      expect(result).toBe("Failed to translate. Please try again.");
    });

    it("should handle TranslationApiError without message", () => {
      // Create error without explicit message
      const error = new TranslationApiError();

      const result = getErrorMessage(error);

      // Should return the empty or undefined message that has the error
      expect(result).toBe(error.message);
    });

    it("should handle TranslationApiError with empty message", () => {
      const error = new TranslationApiError("");

      const result = getErrorMessage(error);

      expect(result).toBe("");
    });

    it("should handle Error with empty message", () => {
      const error = new Error("");

      const result = getErrorMessage(error);

      expect(result).toBe("Failed to translate. Please try again.");
    });

    describe("Edge cases", () => {
      it("should handle error with numeric value", () => {
        const error = 404;

        const result = getErrorMessage(error);

        expect(result).toBe("Failed to translate. Please try again.");
      });

      it("should handle error with boolean value", () => {
        const error = false;

        const result = getErrorMessage(error);

        expect(result).toBe("Failed to translate. Please try again.");
      });

      it("should handle error with array", () => {
        const error = ["error1", "error2"];

        const result = getErrorMessage(error);

        expect(result).toBe("Failed to translate. Please try again.");
      });

      it("should preserve TranslationApiError instance check", () => {
        const error = new TranslationApiError("Custom error message", 400);

        // Verify that it is still instance of TranslationApiError
        expect(error instanceof TranslationApiError).toBe(true);
        expect(error instanceof Error).toBe(true);

        const result = getErrorMessage(error);
        expect(result).toBe("Custom error message");
      });
    });

    describe("Real-world scenarios", () => {
      it("should handle fetch network error", () => {
        const error = new Error("fetch: network request failed");

        const result = getErrorMessage(error);

        expect(result).toBe("Failed to translate. Please try again.");
      });

      it("should handle JSON parse error", () => {
        const error = new SyntaxError("Unexpected end of JSON input");

        const result = getErrorMessage(error);

        expect(result).toBe("Failed to translate. Please try again.");
      });

      it("should handle validation error from API", () => {
        const error = new TranslationApiError("Invalid language pair", 400);

        const result = getErrorMessage(error);

        expect(result).toBe("Invalid language pair");
      });

      it("should handle server error from API", () => {
        const error = new TranslationApiError("Internal server error", 500);

        const result = getErrorMessage(error);

        expect(result).toBe("Internal server error");
      });
    });
  });
});
