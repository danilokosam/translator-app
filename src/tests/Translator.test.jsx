import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { Translator } from "../components/Translator";
import { useTranslator } from "../hooks/useTranslator";

// Mock the useTranslator hook to isolate component testing
vi.mock("../hooks/useTranslator", () => ({
  useTranslator: vi.fn(), // Creates a mock function
}));

describe("Translator component", () => {
  test("should render correctly", () => {
    // Mock return values for the translator hook
    useTranslator.mockReturnValue({
      fromText: "",
      toText: "",
      fromLanguage: "en-GB",
      toLanguage: "es-ES",
      loading: false,
      error: null,
      handleExchange: () => {},
      setFromText: () => {},
      setToText: () => {},
      setFromLanguage: () => {},
      setToLanguage: () => {},
    });

    render(<Translator />);

    // Verify critical elements are present
    expect(screen.getByPlaceholderText("Enter Text")).toBeInTheDocument();
    expect(screen.getByLabelText("Translated text")).toBeInTheDocument();
    expect(screen.getByLabelText("Exchange languages")).toBeInTheDocument();
  });

  test("should update fromText on input change", () => {
    const setFromText = vi.fn(); // Create mock function to track calls
    useTranslator.mockReturnValue({
      fromText: "",
      toText: "",
      fromLanguage: "en-GB",
      toLanguage: "es-ES",
      loading: false,
      error: null,
      handleExchange: () => {},
      setFromText, // Use our mock function
      setToText: () => {},
      setFromLanguage: () => {},
      setToLanguage: () => {},
    });

    render(<Translator />);
    const fromTextArea = screen.getByPlaceholderText("Enter Text");

    fireEvent.change(fromTextArea, { target: { value: "Hello" } }); // Simulate user typing "Hello"

    expect(setFromText).toHaveBeenCalledWith("Hello"); // Verify the state update function was called correctly
  });

  test("should exchange languages and text on button click", () => {
    const handleExchange = vi.fn(); // Create mock function to track calls
    useTranslator.mockReturnValue({
      fromText: "Hello",
      toText: "Hola",
      fromLanguage: "en-GB",
      toLanguage: "es-ES",
      loading: false,
      error: null,
      handleExchange, // Use our mock function
      setFromText: () => {},
      setToText: () => {},
      setFromLanguage: () => {},
      setToLanguage: () => {},
    });

    render(<Translator />);
    const exchangeButton = screen.getByLabelText("Exchange languages");

    fireEvent.click(exchangeButton); // Simulate swap button click

    expect(handleExchange).toHaveBeenCalled(); // Verify the swap handler was called
  });
});
