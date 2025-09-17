import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTranslationState } from "../hooks/useTranslationState.js";
import { TranslationApiError } from "../services/translationApi.js";
import { useInteractionTracker } from "../hooks/useInteractionTracker.js";
import { getErrorMessage } from "../utils/errorHandler.js";

// Mock the dependencies
vi.mock("../hooks/useInteractionTracker.js", () => ({
  useInteractionTracker: vi.fn(),
}));
vi.mock("../utils/errorHandler.js", () => ({
  getErrorMessage: vi.fn(),
}));

describe("useTranslationState", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useInteractionTracker.mockReturnValue(false);
    getErrorMessage.mockReturnValue("Failed to translate. Please try again.");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initial state", () => {
    it("should return initial state correctly", () => {
      const queryResult = { data: undefined, error: null };

      const { result } = renderHook(() => useTranslationState("", queryResult));

      expect(result.current.toText).toBe("");
      expect(result.current.error).toBe(null);
      expect(typeof result.current.setToText).toBe("function");
    });
  });

  describe("No interaction scenarios", () => {
    it("should not set error when user has not interacted and text is empty", () => {
      //   useInteractionTracker.mockReturnValue(false);
      const queryResult = { data: undefined, error: null };

      const { result } = renderHook(() => useTranslationState("", queryResult));

      expect(result.current.toText).toBe("");
      expect(result.current.error).toBe(null);
      expect(useInteractionTracker).toHaveBeenCalledWith("");
    });

    it("should not set error when user has not interacted and text is whitespace", () => {
      //   useInteractionTracker.mockReturnValue(false);
      const queryResult = { data: undefined, error: null };

      const { result } = renderHook(() =>
        useTranslationState("   ", queryResult),
      );

      expect(result.current.toText).toBe("");
      expect(result.current.error).toBe(null);
    });

    it("should not set error when user has not interacted and text is null", () => {
      //   useInteractionTracker.mockReturnValue(false);
      const queryResult = { data: undefined, error: null };

      const { result } = renderHook(() =>
        useTranslationState(null, queryResult),
      );

      expect(result.current.toText).toBe("");
      expect(result.current.error).toBe(null);
    });
  });

  describe("User has interacted scenarios", () => {
    it("should set error when user has interacted and text becomes empty", () => {
      useInteractionTracker.mockReturnValue(true);
      const queryResult = { data: undefined, error: null };

      const { result } = renderHook(() => useTranslationState("", queryResult));

      expect(result.current.toText).toBe("");
      expect(result.current.error).toBe(
        "Text must be at least 1 character long",
      );
    });

    it("should set error when user has interacted and text is only whitespace", () => {
      useInteractionTracker.mockReturnValue(true);
      const queryResult = { data: undefined, error: null };

      const { result } = renderHook(() =>
        useTranslationState("   ", queryResult),
      );

      expect(result.current.toText).toBe("");
      expect(result.current.error).toBe(
        "Text must be at least 1 character long",
      );
    });

    it("should handle transition from no interaction to interaction", () => {
      useInteractionTracker.mockReturnValue(false);
      const queryResult = { data: undefined, error: null };

      const { result, rerender } = renderHook(
        ({ debouncedText }) => useTranslationState(debouncedText, queryResult),
        { initialProps: { debouncedText: "" } },
      );

      // Initially no interaction, no error
      expect(result.current.error).toBe(null);

      // User starts interacting
      useInteractionTracker.mockReturnValue(true);
      rerender({ debouncedText: "" });

      // Now should show error because user has interacted but text is empty
      expect(result.current.error).toBe(
        "Text must be at least 1 character long",
      );
    });
  });

  describe("Query error handling", () => {
    it("should handle query errors and set error message", () => {
      useInteractionTracker.mockReturnValue(true);
      const queryError = new TranslationApiError("API Error", 500);
      const queryResult = { data: undefined, error: queryError };

      getErrorMessage.mockReturnValue("Failed to translate. Please try again.");

      const { result } = renderHook(() =>
        useTranslationState("hello", queryResult),
      );

      expect(result.current.toText).toBe("");
      expect(result.current.error).toBe(
        "Failed to translate. Please try again.",
      );
      expect(getErrorMessage).toHaveBeenCalledWith(queryError);
    });

    it("should handle different types of query errors", () => {
      useInteractionTracker.mockReturnValue(true);
      const networkError = new Error("Network error");
      const queryResult = { data: undefined, error: networkError };

      getErrorMessage.mockReturnValue("Network connection failed");

      const { result } = renderHook(() =>
        useTranslationState("hello", queryResult),
      );

      expect(result.current.error).toBe("Network connection failed");
      expect(getErrorMessage).toHaveBeenCalledWith(networkError);
    });

    it("should clear toText when query error occurs", () => {
      useInteractionTracker.mockReturnValue(true);
      const queryError = new Error("API Error");

      // First render with successful data
      const { result, rerender } = renderHook(
        ({ queryResult }) => useTranslationState("hello", queryResult),
        {
          initialProps: {
            queryResult: { data: "Hola", error: null },
          },
        },
      );

      expect(result.current.toText).toBe("Hola");
      expect(result.current.error).toBe(null);

      // Then render with error
      rerender({
        queryResult: { data: undefined, error: queryError },
      });

      expect(result.current.toText).toBe("");
      expect(result.current.error).toBe(
        "Failed to translate. Please try again.",
      );
    });
  });

  describe("Successful translation handling", () => {
    it("should set toText and clear error on successful translation", () => {
      useInteractionTracker.mockReturnValue(true);
      const queryResult = { data: "Hola mundo", error: null };

      const { result } = renderHook(() =>
        useTranslationState("hello world", queryResult),
      );

      expect(result.current.toText).toBe("Hola mundo");
      expect(result.current.error).toBe(null);
    });

    it("should handle empty translation result", () => {
      useInteractionTracker.mockReturnValue(true);
      const queryResult = { data: "", error: null };

      const { result } = renderHook(() =>
        useTranslationState("hello", queryResult),
      );

      expect(result.current.toText).toBe("");
      expect(result.current.error).toBe(null);
    });

    it("should update toText when translation data changes", () => {
      useInteractionTracker.mockReturnValue(true);

      const { result, rerender } = renderHook(
        ({ queryResult }) => useTranslationState("hello", queryResult),
        {
          initialProps: {
            queryResult: { data: "Hola", error: null },
          },
        },
      );

      expect(result.current.toText).toBe("Hola");

      rerender({
        queryResult: { data: "Hola mundo", error: null },
      });

      expect(result.current.toText).toBe("Hola mundo");
      expect(result.current.error).toBe(null);
    });
  });

  describe("State transitions", () => {
    it("should handle transition from error to success", () => {
      useInteractionTracker.mockReturnValue(true);
      const queryError = new Error("API Error");

      const { result, rerender } = renderHook(
        ({ queryResult }) => useTranslationState("hello", queryResult),
        {
          initialProps: {
            queryResult: { data: undefined, error: queryError },
          },
        },
      );

      // Initially error state
      expect(result.current.toText).toBe("");
      expect(result.current.error).toBe(
        "Failed to translate. Please try again.",
      );

      // Transition to success
      rerender({
        queryResult: { data: "Hola", error: null },
      });

      expect(result.current.toText).toBe("Hola");
      expect(result.current.error).toBe(null);
    });

    it("should handle transition from success to error", () => {
      useInteractionTracker.mockReturnValue(true);

      const { result, rerender } = renderHook(
        ({ queryResult }) => useTranslationState("hello", queryResult),
        {
          initialProps: {
            queryResult: { data: "Hola", error: null },
          },
        },
      );

      // Initially success state
      expect(result.current.toText).toBe("Hola");
      expect(result.current.error).toBe(null);

      // Transition to error
      const queryError = new Error("Network error");
      rerender({
        queryResult: { data: undefined, error: queryError },
      });

      expect(result.current.toText).toBe("");
      expect(result.current.error).toBe(
        "Failed to translate. Please try again.",
      );
    });
  });

  describe("setToText function", () => {
    it("should provide setToText function that works correctly", () => {
      useInteractionTracker.mockReturnValue(false);
      const queryResult = { data: undefined, error: null };

      const { result } = renderHook(() => useTranslationState("", queryResult));

      expect(typeof result.current.setToText).toBe("function");

      act(() => {
        result.current.setToText("Manual text");
      });

      expect(result.current.toText).toBe("Manual text");
    });

    it("should allow manual override of toText even with query data", () => {
      useInteractionTracker.mockReturnValue(true);
      const queryResult = { data: "Hola", error: null };

      const { result } = renderHook(() =>
        useTranslationState("hello", queryResult),
      );

      // Initially from query
      expect(result.current.toText).toBe("Hola");

      // Manual override
      act(() => {
        result.current.setToText("Manual override");
      });

      expect(result.current.toText).toBe("Manual override");
    });
  });

  describe("Complex scenarios", () => {
    it("should handle rapid state changes correctly", () => {
      useInteractionTracker.mockReturnValue(true);

      const { result, rerender } = renderHook(
        ({ debouncedText, queryResult }) =>
          useTranslationState(debouncedText, queryResult),
        {
          initialProps: {
            debouncedText: "",
            queryResult: { data: undefined, error: null },
          },
        },
      );

      // Empty text -> error
      expect(result.current.error).toBe(
        "Text must be at least 1 character long",
      );

      // Add text with success -> clear error
      rerender({
        debouncedText: "hello",
        queryResult: { data: "Hola", error: null },
      });
      expect(result.current.toText).toBe("Hola");
      expect(result.current.error).toBe(null);

      // Query error -> show error, clear text
      const queryError = new Error("API Error");
      rerender({
        debouncedText: "hello",
        queryResult: { data: undefined, error: queryError },
      });
      expect(result.current.toText).toBe("");
      expect(result.current.error).toBe(
        "Failed to translate. Please try again.",
      );

      // Back to empty text -> different error message
      rerender({
        debouncedText: "",
        queryResult: { data: undefined, error: null },
      });
      expect(result.current.error).toBe(
        "Text must be at least 1 character long",
      );
    });

    it("should handle interaction tracker changes during component lifecycle", () => {
      const queryResult = { data: undefined, error: null };

      // Start with no interaction
      useInteractionTracker.mockReturnValue(false);

      const { result, rerender } = renderHook(
        ({ debouncedText }) => useTranslationState(debouncedText, queryResult),
        { initialProps: { debouncedText: "" } },
      );

      expect(result.current.error).toBe(null);

      // User interacts
      useInteractionTracker.mockReturnValue(true);
      rerender({ debouncedText: "" });

      expect(result.current.error).toBe(
        "Text must be at least 1 character long",
      );
    });
  });

  describe("Dependencies and effects", () => {
    it("should call useInteractionTracker with correct parameter", () => {
      const queryResult = { data: undefined, error: null };

      renderHook(() => useTranslationState("hello world", queryResult));

      expect(useInteractionTracker).toHaveBeenCalledWith("hello world");
    });

    it("should re-run effect when debouncedFromText changes", () => {
      useInteractionTracker.mockReturnValue(true);
      const queryResult = { data: "Hola", error: null };

      const { rerender } = renderHook(
        ({ debouncedText }) => useTranslationState(debouncedText, queryResult),
        { initialProps: { debouncedText: "hello" } },
      );

      expect(useInteractionTracker).toHaveBeenCalledWith("hello");

      rerender({ debouncedText: "world" });

      expect(useInteractionTracker).toHaveBeenCalledWith("world");
    });

    it("should re-run effect when queryResult changes", () => {
      useInteractionTracker.mockReturnValue(true);

      const { result, rerender } = renderHook(
        ({ queryResult }) => useTranslationState("hello", queryResult),
        {
          initialProps: {
            queryResult: { data: undefined, error: null },
          },
        },
      );

      const initialError = result.current.error;

      expect(initialError).toBe(null);

      rerender({
        queryResult: { data: "Hola", error: null },
      });

      // Should have updated based on new queryResult
      expect(result.current.toText).toBe("Hola");
      expect(result.current.error).toBe(null);
    });
  });
});
