import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTranslator } from "../hooks/useTranslator.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { useTranslationQuery } from "../hooks/useTranslationQuery.js";
import { useTranslationState } from "../hooks/useTranslationState.js";

// Mock all dependencies
vi.mock("../hooks/useDebounce.js", () => ({
  useDebounce: vi.fn(),
}));

vi.mock("../hooks/useTranslationQuery.js", () => ({
  useTranslationQuery: vi.fn(),
}));

vi.mock("../hooks/useTranslationState.js", () => ({
  useTranslationState: vi.fn(),
}));

describe("useTranslator", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    useDebounce.mockImplementation((value) => value);
    useTranslationQuery.mockReturnValue({
      isFetching: false,
      data: undefined,
      error: null,
    });
    useTranslationState.mockReturnValue({
      toText: "",
      setToText: vi.fn(),
      error: null,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initial state", () => {
    it("should initialize with default language parameters", () => {
      const { result } = renderHook(() => useTranslator());

      expect(result.current.fromText).toBe("");
      expect(result.current.fromLanguage).toBe("en-GB");
      expect(result.current.toLanguage).toBe("es-ES");
      expect(result.current.toText).toBe("");
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it("should initialize with custom language parameters", () => {
      const { result } = renderHook(() => useTranslator("fr-FR", "de-DE"));

      expect(result.current.fromLanguage).toBe("fr-FR");
      expect(result.current.toLanguage).toBe("de-DE");
    });

    it("should provide all required functions", () => {
      const { result } = renderHook(() => useTranslator());

      expect(typeof result.current.setFromText).toBe("function");
      expect(typeof result.current.setToText).toBe("function");
      expect(typeof result.current.setFromLanguage).toBe("function");
      expect(typeof result.current.setToLanguage).toBe("function");
      expect(typeof result.current.handleExchange).toBe("function");
    });
  });

  describe("Debouncing behavior", () => {
    it("should debounce fromText with 500ms delay", () => {
      renderHook(() => useTranslator());
      expect(useDebounce).toHaveBeenCalledWith("", 500);
    });

    it("should debounce fromLanguage with 500ms delay", () => {
      renderHook(() => useTranslator());

      expect(useDebounce).toHaveBeenCalledWith("en-GB", 500);
    });

    it("should debounce toLanguage with 500ms delay", () => {
      renderHook(() => useTranslator());

      expect(useDebounce).toHaveBeenCalledWith("es-ES", 500);
    });

    it("should pass updated values to debounce when state changes", () => {
      const { result } = renderHook(() => useTranslator());

      act(() => {
        result.current.setFromText("hello");
      });

      // Should have been called with new value
      expect(useDebounce).toHaveBeenCalledWith("hello", 500);
    });
  });

  describe("Translation query integration", () => {
    it("should call useTranslationQuery with debounced values", () => {
      // Setup debounce mocks to return specific values
      useDebounce
        .mockReturnValueOnce("debounced-text") // debouncedFromText
        .mockReturnValueOnce("debounced-from") // debouncedFromLanguage
        .mockReturnValueOnce("debounced-to"); // debouncedToLanguage

      renderHook(() => useTranslator());

      expect(useTranslationQuery).toHaveBeenCalledWith(
        "debounced-text",
        "debounced-from",
        "debounced-to"
      );
    });

    it("should pass query result to useTranslationState", () => {
      const mockQueryResult = {
        isFetching: true,
        data: "Hola",
        error: null,
      };

      useTranslationQuery.mockReturnValue(mockQueryResult);
      useDebounce.mockReturnValue("hello"); // For debouncedFromText

      renderHook(() => useTranslator());

      expect(useTranslationState).toHaveBeenCalledWith(
        "hello",
        mockQueryResult
      );
    });
  });

  describe("State management", () => {
    it("should update fromText correctly", () => {
      const { result } = renderHook(() => useTranslator());

      act(() => {
        result.current.setFromText("Hello world");
      });

      expect(result.current.fromText).toBe("Hello world");
    });

    it("should update fromLanguage correctly", () => {
      const { result } = renderHook(() => useTranslator());

      act(() => {
        result.current.setFromLanguage("fr-FR");
      });

      expect(result.current.fromLanguage).toBe("fr-FR");
    });

    it("should update toLanguage correctly", () => {
      const { result } = renderHook(() => useTranslator());

      act(() => {
        result.current.setToLanguage("de-DE");
      });

      expect(result.current.toLanguage).toBe("de-DE");
    });

    it("should reflect toText from useTranslationState", () => {
      useTranslationState.mockReturnValue({
        toText: "Hola mundo",
        setToText: vi.fn(),
        error: null,
      });

      const { result } = renderHook(() => useTranslator());

      expect(result.current.toText).toBe("Hola mundo");
    });

    it("should reflect error from useTranslationState", () => {
      useTranslationState.mockReturnValue({
        toText: "",
        setToText: vi.fn(),
        error: "Translation failed",
      });

      const { result } = renderHook(() => useTranslator());

      expect(result.current.error).toBe("Translation failed");
    });

    it("should reflect loading state from query result", () => {
      useTranslationQuery.mockReturnValue({
        isFetching: true,
        data: undefined,
        error: null,
      });

      const { result } = renderHook(() => useTranslator());

      expect(result.current.loading).toBe(true);
    });
  });

  describe("Exchange functionality", () => {
    it("should exchange text and languages correctly", () => {
      useTranslationState.mockReturnValue({
        toText: "Hola mundo",
        setToText: vi.fn(),
        error: null,
      });

      const { result } = renderHook(() => useTranslator());

      // Set initial state
      act(() => {
        result.current.setFromText("Hello world");
        result.current.setFromLanguage("en-GB");
        result.current.setToLanguage("es-ES");
      });

      // Perform exchange
      act(() => {
        result.current.handleExchange();
      });

      expect(result.current.fromText).toBe("Hola mundo");
      expect(result.current.fromLanguage).toBe("es-ES");
      expect(result.current.toLanguage).toBe("en-GB");
    });

    it("should call setToText with previous fromText on exchange", () => {
      const mockSetToText = vi.fn();
      useTranslationState.mockReturnValue({
        toText: "Hola",
        setToText: mockSetToText,
        error: null,
      });

      const { result } = renderHook(() => useTranslator());

      act(() => {
        result.current.setFromText("Hello");
      });

      act(() => {
        result.current.handleExchange();
      });

      expect(mockSetToText).toHaveBeenCalledWith("Hello");
    });

    it("should handle exchange with empty text", () => {
      useTranslationState.mockReturnValue({
        toText: "",
        setToText: vi.fn(),
        error: null,
      });

      const { result } = renderHook(() => useTranslator());

      act(() => {
        result.current.handleExchange();
      });

      expect(result.current.fromText).toBe("");
      expect(result.current.fromLanguage).toBe("es-ES");
      expect(result.current.toLanguage).toBe("en-GB");
    });
  });

  describe("Integration scenarios", () => {
    it("should handle complete translation workflow", () => {
      const mockSetToText = vi.fn();

      // Setup mocks for a complete workflow
      useDebounce
        .mockImplementation((value) => value) // Return immediate values for simplicity
        .mockReturnValueOnce("hello")
        .mockReturnValueOnce("en-GB")
        .mockReturnValueOnce("es-ES");

      useTranslationQuery.mockReturnValue({
        isFetching: false,
        data: "Hola",
        error: null,
      });

      useTranslationState.mockReturnValue({
        toText: "Hola",
        setToText: mockSetToText,
        error: null,
      });

      const { result } = renderHook(() => useTranslator());

      // User types text
      act(() => {
        result.current.setFromText("hello");
      });

      // Check final state
      expect(result.current.fromText).toBe("hello");
      expect(result.current.toText).toBe("Hola");
      expect(result.current.error).toBe(null);
      expect(result.current.loading).toBe(false);
    });

    it("should handle error states correctly", () => {
      useTranslationQuery.mockReturnValue({
        isFetching: false,
        data: undefined,
        error: new Error("API Error"),
      });

      useTranslationState.mockReturnValue({
        toText: "",
        setToText: vi.fn(),
        error: "Failed to translate. Please try again.",
      });

      const { result } = renderHook(() => useTranslator());

      expect(result.current.error).toBe(
        "Failed to translate. Please try again."
      );
      expect(result.current.toText).toBe("");
      expect(result.current.loading).toBe(false);
    });

    it("should handle loading states correctly", () => {
      useTranslationQuery.mockReturnValue({
        isFetching: true,
        data: undefined,
        error: null,
      });

      const { result } = renderHook(() => useTranslator());

      expect(result.current.loading).toBe(true);
    });
  });

  describe("Language changes", () => {
    it("should trigger re-debouncing when languages change", () => {
      const { result } = renderHook(() => useTranslator());

      act(() => {
        result.current.setFromLanguage("fr-FR");
      });

      // Should have debounced the new language
      expect(useDebounce).toHaveBeenCalledWith("fr-FR", 500);

      act(() => {
        result.current.setToLanguage("de-DE");
      });

      expect(useDebounce).toHaveBeenCalledWith("de-DE", 500);
    });

    it("should pass updated debounced languages to translation query", () => {
      // Mock specific debounce returns
      useDebounce
        .mockReturnValueOnce("") // debouncedFromText
        .mockReturnValueOnce("fr-FR") // debouncedFromLanguage
        .mockReturnValueOnce("de-DE"); // debouncedToLanguage

      const { result } = renderHook(() => useTranslator());

      act(() => {
        result.current.setFromLanguage("fr-FR");
        result.current.setToLanguage("de-DE");
      });

      expect(useTranslationQuery).toHaveBeenCalledWith("", "fr-FR", "de-DE");
    });
  });

  describe("Hook dependencies and updates", () => {
    it("should re-render when hook dependencies change", () => {
      let renderCount = 0;

      const { rerender } = renderHook(() => {
        renderCount++;
        return useTranslator();
      });

      const initialCount = renderCount;

      // Force re-render
      rerender();

      expect(renderCount).toBe(initialCount + 1);
    });

    it("should maintain stable function references", () => {
      const { result, rerender } = renderHook(() => useTranslator());

      const initialSetFromText = result.current.setFromText;
      const initialSetToText = result.current.setToText;

      rerender();

      // Functions should maintain reference equality due to useCallback
      expect(result.current.setFromText).toBe(initialSetFromText);
      expect(result.current.setToText).toBe(initialSetToText);
    });
  });

  describe("Edge cases", () => {
    it("should handle null/undefined in translation state", () => {
      useTranslationState.mockReturnValue({
        toText: null,
        setToText: vi.fn(),
        error: undefined,
      });

      const { result } = renderHook(() => useTranslator());

      expect(result.current.toText).toBe(null);
      expect(result.current.error).toBe(undefined);
    });

    it("should handle setToText function from translation state", () => {
      const mockSetToText = vi.fn();
      useTranslationState.mockReturnValue({
        toText: "Hola",
        setToText: mockSetToText,
        error: null,
      });

      const { result } = renderHook(() => useTranslator());

      act(() => {
        result.current.setToText("Manual text");
      });

      expect(mockSetToText).toHaveBeenCalledWith("Manual text");
    });

    it("should handle extreme language code lengths", () => {
      const veryLongLanguageCode = "x".repeat(100);

      const { result } = renderHook(() =>
        useTranslator(veryLongLanguageCode, veryLongLanguageCode)
      );

      expect(result.current.fromLanguage).toBe(veryLongLanguageCode);
      expect(result.current.toLanguage).toBe(veryLongLanguageCode);
    });
  });

  describe("Performance considerations", () => {
    it("should not cause excessive re-renders", () => {
      let queryCallCount = 0;
      let stateCallCount = 0;

      useTranslationQuery.mockImplementation(() => {
        queryCallCount++;
        return { isFetching: false, data: undefined, error: null };
      });

      useTranslationState.mockImplementation(() => {
        stateCallCount++;
        return { toText: "", setToText: vi.fn(), error: null };
      });

      const { rerender } = renderHook(() => useTranslator());

      const initialQueryCalls = queryCallCount;
      const initialStateCalls = stateCallCount;

    //   console.log("Initial calls:", initialQueryCalls, initialStateCalls);

      // Multiple re-renders shouldn't cause hook calls to multiply excessively
      rerender();
      rerender();

    //   console.log("Query calls:", queryCallCount);
    //   console.log("State calls:", stateCallCount);

      expect(queryCallCount - initialQueryCalls).toBeLessThanOrEqual(2);
      expect(stateCallCount - initialStateCalls).toBeLessThanOrEqual(2);
    });
  });
});
