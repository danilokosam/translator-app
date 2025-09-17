import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useInteractionTracker } from "../hooks/useInteractionTracker.js";

describe("useInteractionTracker", () => {
  describe("Initial state", () => {
    it("should return false initially with empty text", () => {
      const { result } = renderHook(() => useInteractionTracker(""));

      expect(result.current).toBe(false);
    });

    it("should return false initially with undefined text", () => {
      const { result } = renderHook(() => useInteractionTracker(undefined));

      expect(result.current).toBe(false);
    });

    it("should return false initially with null text", () => {
      const { result } = renderHook(() => useInteractionTracker(null));

      expect(result.current).toBe(false);
    });

    it("should return false initially with whitespace only", () => {
      const { result } = renderHook(() => useInteractionTracker("   "));

      expect(result.current).toBe(false);
    });
  });

  describe("Interaction detection", () => {
    it("should return true when text has content", () => {
      const { result, rerender } = renderHook(
        ({ text }) => useInteractionTracker(text, true),
        {
          initialProps: { text: "" },
        },
      );

      // Initially false
      expect(result.current.current).toBe(false);

      act(() => {
        rerender({ text: "hello" });
      });
      expect(result.current.current).toBe(true);
    });

    it("should return true when text has content with surrounding whitespace", () => {
      const { result } = renderHook(() =>
        useInteractionTracker("  hello  ", true),
      );

      expect(result.current.current).toBe(true);
    });

    it("should return true for single character", () => {
      const { result } = renderHook(() => useInteractionTracker("a", true));

      expect(result.current.current).toBe(true);
    });

    it("should return true for special characters", () => {
      const { result } = renderHook(() => useInteractionTracker("!@#$%", true));

      expect(result.current.current).toBe(true);
    });

    it("should return true for numbers", () => {
      const { result } = renderHook(() => useInteractionTracker("123", true));

      expect(result.current.current).toBe(true);
    });
  });

  describe("State persistence", () => {
    it("should remain true once interaction is detected, even if text becomes empty", () => {
      const { result, rerender } = renderHook(
        ({ text }) => useInteractionTracker(text, true),
        { initialProps: { text: "" } },
      );

      // Initially false
      expect(result.current.current).toBe(false);

      // Add text - should become true
      rerender({ text: "hello" });
      expect(result.current.current).toBe(true);

      // Remove text - should remain true
      rerender({ text: "" });
      expect(result.current.current).toBe(true);
    });

    it("should remain true when text changes to whitespace only", () => {
      const { result, rerender } = renderHook(
        ({ text }) => useInteractionTracker(text, true),
        { initialProps: { text: "hello" } },
      );

      // Initially true (has content)
      expect(result.current.current).toBe(true);

      // Change to whitespace - should remain true
      rerender({ text: "   " });
      expect(result.current.current).toBe(true);
    });

    it("should remain true when text changes to null or undefined", () => {
      const { result, rerender } = renderHook(
        ({ text }) => useInteractionTracker(text, true),
        { initialProps: { text: "hello" } },
      );

      // Initially true
      expect(result.current.current).toBe(true);

      // Change to null - should remain true
      rerender({ text: null });
      expect(result.current.current).toBe(true);

      // Change to undefined - should remain true
      rerender({ text: undefined });
      expect(result.current.current).toBe(true);
    });
  });

  describe("Text changes", () => {
    it("should track changes from empty to content", () => {
      const { result, rerender } = renderHook(
        ({ text }) => useInteractionTracker(text, true),
        { initialProps: { text: "" } },
      );

      expect(result.current.current).toBe(false);

      rerender({ text: "h" });
      expect(result.current.current).toBe(true);

      rerender({ text: "he" });
      expect(result.current.current).toBe(true);

      rerender({ text: "hello" });
      expect(result.current.current).toBe(true);
    });

    it("should track changes from whitespace to content", () => {
      const { result, rerender } = renderHook(
        ({ text }) => useInteractionTracker(text, true),
        { initialProps: { text: "   " } },
      );

      expect(result.current.current).toBe(false);

      rerender({ text: "  h" });
      expect(result.current.current).toBe(true);
    });

    it("should handle rapid text changes", () => {
      const { result, rerender } = renderHook(
        ({ text }) => useInteractionTracker(text, true),
        { initialProps: { text: "" } },
      );

      expect(result.current.current).toBe(false);

      // Simulate rapid typing
      const texts = ["h", "he", "hel", "hell", "hello"];

      texts.forEach((text) => {
        rerender({ text });
        expect(result.current.current).toBe(true);
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle text that starts with content", () => {
      const { result } = renderHook(() =>
        useInteractionTracker("initial content", true),
      );

      expect(result.current.current).toBe(true);
    });

    it("should handle very long text", () => {
      const longText = "a".repeat(1000);
      const { result } = renderHook(() =>
        useInteractionTracker(longText, true),
      );

      expect(result.current.current).toBe(true);
    });

    it("should handle text with only newlines and tabs", () => {
      const { result } = renderHook(() =>
        useInteractionTracker("\n\t\r", true),
      );

      expect(result.current.current).toBe(false);
    });

    it("should handle text with newlines and content", () => {
      const { result } = renderHook(() =>
        useInteractionTracker("\nhello\n", true),
      );

      expect(result.current.current).toBe(true);
    });

    it("should handle unicode characters", () => {
      const { result } = renderHook(() =>
        useInteractionTracker("🚀 Hello World! 🌍", true),
      );

      expect(result.current.current).toBe(true);
    });
  });

  describe("Multiple instances", () => {
    it("should maintain independent state for different instances", () => {
      const { result: result1 } = renderHook(() =>
        useInteractionTracker("", true),
      );
      const { result: result2 } = renderHook(() =>
        useInteractionTracker("hello", true),
      );

      expect(result1.current.current).toBe(false);
      expect(result2.current.current).toBe(true);
    });

    it("should not affect other instances when one changes", () => {
      const { result: result1, rerender: rerender1 } = renderHook(
        ({ text }) => useInteractionTracker(text, true),
        { initialProps: { text: "" } },
      );

      const { result: result2 } = renderHook(() =>
        useInteractionTracker("", true),
      );

      expect(result1.current.current).toBe(false);
      expect(result2.current.current).toBe(false);

      rerender1({ text: "hello" });

      expect(result1.current.current).toBe(true);
      expect(result2.current.current).toBe(false); // Should remain unchanged
    });
  });

  describe("Performance", () => {
    it("should not cause unnecessary re-renders when text does not change", () => {
      let renderCount = 0;

      const { rerender } = renderHook(
        ({ text }) => {
          renderCount++;
          return useInteractionTracker(text, true);
        },
        { initialProps: { text: "hello" } },
      );

      const initialRenderCount = renderCount;

      // Re-render with same text
      rerender({ text: "hello" });

      // Should only increment by 1 (the rerender itself)
      expect(renderCount).toBe(initialRenderCount + 1);
    });
  });
});
