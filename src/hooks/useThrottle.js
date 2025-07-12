import { useRef, useCallback } from "react";

export const useThrottle = (func, limit) => {
  const lastCall = useRef(0);

  return useCallback(
    (...args) => {
      const now = Date.now();
      if (now - lastCall.current >= limit) {
        lastCall.current = now;
        return func(...args);
      }
    },
    [func, limit]
  );
};
