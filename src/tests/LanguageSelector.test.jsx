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
        id="from" // Unique ID for the selector
        value="en-GB" // Initial selected language
        onChange={() => {}} // Mock function for onChange event handler
        languages={languages} // Available languages to display
        onIconClick={() => {}} // Placeholder for onIconClick event handler
      />
    );

    expect(screen.getByLabelText("Select from language")).toBeInTheDocument(); // Check if the select element is present
    expect(screen.getByDisplayValue("English")).toBeInTheDocument(); // Check if the initial value is displayed
  });

  test("should call onChange when a new language is selected", () => {
    // Mock function to track onChange calls
    const onChange = vi.fn();
    render(
      <LanguageSelector
        id="from"
        value="en-GB"
        onChange={onChange} // Pass the mock function to onChange
        languages={languages}
        onIconClick={() => {}}
      />
    );

    const select = screen.getByLabelText("Select from language"); // Get the select element by its label
    fireEvent.change(select, { target: { value: "es-ES" } }); // Simulate a change event to select a new language

    expect(onChange).toHaveBeenCalled(); // Verify that onChange was called
  });

  test('should call onIconClick with "speak" when the speak icon is clicked', () => {
    // Mock function to track onIconClick calls
    const onIconClick = vi.fn();
    render(
      <LanguageSelector
        id="from" // The ID here is crucial as it's passed to onIconClick
        value="en-GB"
        onChange={() => {}}
        languages={languages}
        onIconClick={onIconClick} // Pass the mock function to onIconClick
      />
    );

    const speakButton = screen.getByLabelText("Speak source text"); // Get the speak icon button by its accessibility label
    fireEvent.click(speakButton); // Simulate a click event on the speak icon

    expect(onIconClick).toHaveBeenCalledWith("speak", "from"); // Verify that onIconClick was called with the correct parameters
  });

  test('should call onIconClick with "copy" when the copy icon is clicked', () => {
    // Mock function to track onIconClick calls
    const onIconClick = vi.fn();
    render(
      <LanguageSelector
        id="to" // The ID here is crucial as it's passed to onIconClick
        value="es-ES"
        onChange={() => {}}
        languages={languages}
        onIconClick={onIconClick} // Pass the mock function to onIconClick
      />
    );

    const copyButton = screen.getByLabelText("Copy translated text"); // Get the copy icon button by its accessibility label
    fireEvent.click(copyButton); // Simulate a click event on the copy icon

    expect(onIconClick).toHaveBeenCalledWith("copy", "to"); // Verify that onIconClick was called with the correct parameters
  });
});
