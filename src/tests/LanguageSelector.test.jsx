import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { LanguageSelector } from "../components/LanguageSelector";

// Mock data for available languages
const languages = {
  "en-GB": "English",
  "es-ES": "Spanish",
  "fr-FR": "French",
};

describe("LanguageSelector component", () => {
  test("should render correctly", () => {
    render(
      <LanguageSelector
        id='from' // Unique ID for the selector
        value='en-GB' // Initial selected language
        onChange={() => {}} // Mock function for onChange event handler
        languages={languages} // Available languages to display
        onIconClick={() => {}} // Placeholder for onIconClick event handler
      />,
    );

    expect(screen.getByLabelText("Select from language")).toBeInTheDocument(); // Check if the select element is present
    expect(screen.getByDisplayValue("English")).toBeInTheDocument(); // Check if the initial value is displayed
  });

  test("should call onChange when a new language is selected", () => {
    // Mock function to track onChange calls
    const onChange = vi.fn();
    render(
      <LanguageSelector
        id='from'
        value='en-GB'
        onChange={onChange} // Pass the mock function to onChange
        languages={languages}
        onIconClick={() => {}}
      />,
    );

    const select = screen.getByLabelText("Select from language"); // Get the select element by its label
    fireEvent.change(select, { target: { value: "es-ES" } }); // Simulate a change event to select a new language

    expect(onChange).toHaveBeenCalled(); // Verify that onChange was called
  });
});
