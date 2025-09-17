import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { ActionsButtons } from "../components/ActionsButtons";

describe("ActionsButtons component", () => {
  test("should call onIconClick with 'speak' when the speak icon is clicked", () => {
    const onIconClick = vi.fn();

    render(<ActionsButtons id='from' onIconClick={onIconClick} />);

    const speakButton = screen.getByLabelText("Speak source text");
    fireEvent.click(speakButton);

    expect(onIconClick).toHaveBeenCalledWith("speak", "from");
  });

  test('should call onIconClick with "copy" when the copy icon is clicked', () => {
    const onIconClick = vi.fn();

    render(<ActionsButtons id='to' onIconClick={onIconClick} />);

    const copyButton = screen.getByLabelText("Copy translated text");
    fireEvent.click(copyButton);

    expect(onIconClick).toHaveBeenCalledWith("copy", "to");
  });
});
