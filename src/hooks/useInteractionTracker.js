import { useRef, useEffect } from "react";

export const useInteractionTracker = (text) => {
  // useRef is used to keep track of whether interaction has already been detected
  // It persists across re-renders without causing re-renders when changed
  const hasInteracted = useRef(false);

  useEffect(() => {
    // If the user hasn't interacted yet, and the text is non-empty after trimming
    if (!hasInteracted.current && text?.trim().length > 0) {
      console.log("User has interacted with the text input.");

      // Mark that the interaction has been tracked
      hasInteracted.current = true;

      console.log("Interaction tracked:", text);
    }
  }, [text]); // Re-run this effect only when `text` changes

  // Return the interaction status (true if user has entered text at least once)
  return hasInteracted.current;
};
