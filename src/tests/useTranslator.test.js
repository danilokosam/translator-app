import { renderHook, act, waitFor } from "@testing-library/react";
import { useTranslator } from "../hooks/useTranslator";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock the useDebounce hook
vi.mock("../hooks/useDebounce", () => ({
  useDebounce: (value) => value,
}));

describe("useTranslator", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should translate text successfully", async () => {
    const mockResponse = {
      responseData: {
        translatedText: "Hola",
      },
    };

    // Mock of fetch to return a successful translation response
    window.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    const { result } = renderHook(() => useTranslator("en-GB", "es-ES"));

    console.log("➡️ Initial state:", result.current);

    // Set initial text to translate
    act(() => {
      result.current.setFromText("Hello");
    });

    console.log("📚 State after setting text:", result.current);

    // Wait for the translation to complete
    await waitFor(() => {
      console.log("✅ State after translation:", result.current);
      expect(result.current.toText).toBe("Hola");
    });

    console.log("🎯 Final translate:", result.current.toText);
    console.log("📦 Full status:", result.current);

    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("should set error if translation API fails", async () => {
    window.fetch = vi.fn(
      () => Promise.resolve({ ok: false }) // <- Simulate a failed response
    );

    const { result } = renderHook(() => useTranslator("en-GB", "es-ES"));

    act(() => {
      result.current.setFromText("Hello");
    });

    await waitFor(() => {
      expect(result.current.error).toBe(
        "Failed to translate. Please try again."
      );
    });

    expect(result.current.toText).toBe("");
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("should show error when text is empty", async () => {
    // Mock fetch as a spy to check if it is called
    window.fetch = vi.fn();

    const { result } = renderHook(() => useTranslator("en-GB", "es-ES"));

    act(() => {
      result.current.setFromText(" ");
    });

    await waitFor(() => {
      expect(result.current.error).toBe(
        "Text must be at least 1 character long"
      );
      expect(result.current.toText).toBe("");
    });

    expect(fetch).not.toHaveBeenCalled();
  });

  it("should trigger translation when language changes", async () => {
    window.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ responseData: { translatedText: "Hola" } }),
      })
    );

    const { result } = renderHook(() => useTranslator("en-GB", "es-ES"));

    act(() => {
      result.current.setFromText("Hello");
    });

    // Reset fetch mock call count before changing language
    fetch.mockClear();

    // Cambiar idioma origen
    act(() => {
      result.current.setFromLanguage("en-US");
    });

    await waitFor(() => {
      expect(result.current.toText).toBe("Hola");
    });

    expect(fetch).toHaveBeenCalledTimes(1); // Podrías verificar la URL si quieres más precisión
  });

  it("should not translate if fromText is empty", async () => {
    window.fetch = vi.fn();

    const { result } = renderHook(() => useTranslator("en-GB", "es-ES"));

    // First render to avoid the first render
    act(() => {
      result.current.setFromText("Hello");
    });

    // Wait for the first effect to wear off
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    // Now set empty text, it will no longer be the first rendering.
    act(() => {
      result.current.setFromText("");
    });

    await waitFor(() => {
      expect(result.current.error).toBe(
        "Text must be at least 1 character long"
      );
      expect(result.current.toText).toBe("");
    });

    // Must have been called only once
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("should exchange languages and texts correctly", () => {
    const { result } = renderHook(() => useTranslator("en-GB", "es-ES"));

    act(() => {
      result.current.setFromText("Hello");
      result.current.setToText("Hola");
    });

    act(() => {
      result.current.handleExchange();
    });

    expect(result.current.fromText).toBe("Hola");
    expect(result.current.toText).toBe("Hello");
    expect(result.current.fromLanguage).toBe("es-ES");
    expect(result.current.toLanguage).toBe("en-GB");
  });
});
