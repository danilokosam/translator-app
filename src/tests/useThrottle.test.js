import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useThrottle } from "../hooks/useThrottle";

describe("useThrottle", () => {
  // Before each test, we "mock" JavaScript timers.
  // This allows us to control time within our tests.
  beforeEach(() => {
    vi.useFakeTimers();
  });

  // After each test, we restore the real timers.
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should throttle the function calls", () => {
    const func = vi.fn(); // We create a mock function to see how many times it's called
    const limit = 1000; // 1 second

    // renderHook lets you render your custom hook in a React test environment.
    const { result } = renderHook(() => useThrottle(func, limit));
    const throttledFunc = result.current;

    // Initial calls:
    act(() => {
      // `act` ensures that state updates and effects are handled ( limit = 1000 ms )
      throttledFunc(); // Calls the throttled function (should trigger the function since it's the first call)
      throttledFunc(); // Calls it again immediately (should NOT trigger the function yet)
      throttledFunc(); // Calls it again immediately (should NOT trigger the function yet)
    });

    // At this point, `func` should have been called only once (the first call since the limit is 1000 ms).
    expect(func).toHaveBeenCalledTimes(1);

    // We advance the time just before the limit
    act(() => {
      vi.advanceTimersByTime(limit - 1); // We advance the time almost to the limit (1000 ms - 1 ms = 999 ms)
    });

    act(() => {
      throttledFunc(); // This should NOT trigger the function since the limit hasn't passed yet
    });
    expect(func).toHaveBeenCalledTimes(1); // Still only once

    // We advance the time beyond the limit
    act(() => {
      vi.advanceTimersByTime(1); // Total: limit - 1 + 1 = limit (999 ms + 1 ms = 1000 ms)
    });

    act(() => {
      throttledFunc(); // Now it should trigger the function since the limit has passed
    });
    expect(func).toHaveBeenCalledTimes(2); // It should have been called a second time

    // Call again immediately, should not trigger
    act(() => {
      throttledFunc(); // Should not trigger the function since we are within the limit again
    });
    expect(func).toHaveBeenCalledTimes(2); // Still only twice
  });

  it("should pass arguments correctly to the throttled function", () => {
    const func = vi.fn((a, b) => a + b); // Mock that can also return a value
    const limit = 500;

    const { result } = renderHook(() => useThrottle(func, limit));
    const throttledFunc = result.current;

    let returnedValue; // Variable to store the return value
    act(() => {
      returnedValue = throttledFunc(10, 20); // Passing arguments
    });

    expect(func).toHaveBeenCalledWith(10, 20); // Check that the arguments were passed correctly
    expect(returnedValue).toBe(30); // Check that the return value is propagated too

    // Advance the time and test again
    act(() => {
      vi.advanceTimersByTime(limit); // Here we advance time so the limit is reached and we can call again
    });
    act(() => {
      throttledFunc("hello", "world"); // Call again with different arguments
    });
    expect(func).toHaveBeenCalledWith("hello", "world"); // Verify that the new arguments were passed
    expect(func).toHaveBeenCalledTimes(2); // Should have been called twice now
  });

  it("should reset the throttle if func or limit changes", () => {
    const func1 = vi.fn(); // Mock for the first function
    const func2 = vi.fn(); // Mock for the second function
    const limit1 = 1000; // 1 second
    const limit2 = 500; // 0.5 seconds

    // Render the hook with the first function and the first limit
    const { result, rerender } = renderHook(
      ({ fn, delay }) => useThrottle(fn, delay),
      {
        initialProps: { fn: func1, delay: limit1 },
      },
    );
    const throttledFunc1 = result.current; // Store the throttled function

    // Call the first function
    act(() => {
      throttledFunc1(); // This should call func1
    });
    expect(func1).toHaveBeenCalledTimes(1); // func1 should have been called once

    act(() => {
      vi.advanceTimersByTime(limit1 - 100); // Advance the time but not enough for it to trigger again (1000 ms - 100 ms = 900 ms)
    });

    // Rerender with the second function and a new limit
    rerender({ fn: func2, delay: limit2 });
    const throttledFunc2 = result.current; // Store the new throttled function

    // Even though not enough time passed for func1, this is a new throttled function for func2
    // It should call func2 immediately because its own timer started fresh.
    act(() => {
      throttledFunc2(); // This should trigger func2 immediately
    });

    expect(func1).toHaveBeenCalledTimes(1); // func1 still 1
    expect(func2).toHaveBeenCalledTimes(1); // func2 should be 1
  });
});
