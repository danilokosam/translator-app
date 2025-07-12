import { renderHook, act } from "@testing-library/react";
import { expect, test, describe, vi } from "vitest";
import { useDebounce } from "../hooks/useDebounce";

describe("useDebounce hook", () => {
  test("should return the initial value", () => {
    const { result } = renderHook(() => useDebounce("test", 500)); // Render the hook with initial value 'test' and delay of 500ms
    expect(result.current).toBe("test"); // Assert that the current value is the initial value 'test'
  });

  test("should update the value after the delay", async () => {
    vi.useFakeTimers(); // Vitest's fake timers to control time in the test

    // Render the hook with initial props
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "test", delay: 500 },
      }
    );

    expect(result.current).toBe("test"); // Initial value should be 'test'

    rerender({ value: "new test", delay: 500 }); // Update the hook's props with new value

    expect(result.current).toBe("test"); // Value should still be 'test' because delay hasn't passed yet

    await act(async () => {
      vi.advanceTimersByTime(500); // Fast-forward time by 500ms using fake timers
    });

    expect(result.current).toBe("new test"); // After delay, value should update to 'new test'
    vi.useRealTimers(); // Restore real timers
  });
});
