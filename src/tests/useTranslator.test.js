import { renderHook, act } from "@testing-library/react";
import { expect, test, describe } from "vitest";
import { useTranslator } from "../hooks/useTranslator";

describe("useTranslator hook", () => {
  test("should initialize with default values", () => {
    const { result } = renderHook(() => useTranslator()); // Render the hook without initial props

    // Assert default state values
    expect(result.current.fromLanguage).toBe("en-GB"); // Default source language
    expect(result.current.toLanguage).toBe("hi-IN"); // Default target language
    expect(result.current.fromText).toBe(""); // Empty source text
    expect(result.current.toText).toBe(""); // Empty translated text
    expect(result.current.loading).toBe(false); // Not loading initially
    expect(result.current.error).toBe(null); // No errors initially
  });

  test("should exchange languages and text", () => {
    const { result } = renderHook(() => useTranslator("en-GB", "es-ES")); // Render the hook with custom initial languages (en-GB -> es-ES)

    // Simulate user input using act() to batch updates
    act(() => {
      result.current.setFromText("Hello"); // Set source text
      result.current.setToText("Hola"); // Set translated text
    });

    // Trigger language exchange
    act(() => {
      result.current.handleExchange(); // Swap languages and texts
    });

    // Assert post-exchange state
    expect(result.current.fromLanguage).toBe("es-ES"); // Swapped to previous target
    expect(result.current.toLanguage).toBe("en-GB"); // Swapped to previous source
    expect(result.current.fromText).toBe("Hola"); // Swapped text (previous translation)
    expect(result.current.toText).toBe("Hello"); // Swapped text (previous source)
  });
});
