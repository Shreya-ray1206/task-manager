import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import InputField from "../components/InputField";


describe("InputField Component", () => {
  it("renders the input and label", () => {
    render(<InputField label="Email" value="" onChange={() => {}} />);

    const input = screen.getByLabelText("Email");
    expect(input).toBeInTheDocument();
  });

  it("allows typing inside the input", () => {
    const handleChange = vi.fn();

    render(
      <InputField
        label="Name"
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByLabelText("Name");
    fireEvent.change(input, { target: { value: "John" } });

    expect(handleChange).toHaveBeenCalled();
  });

  it("shows a validation error after blur", () => {
    const validate = vi.fn((value) =>
      value.length < 3 ? "Too short" : ""
    );

    render(
      <InputField
        label="Username"
        value=""
        onChange={() => {}}
        validate={validate}
      />
    );

    const input = screen.getByLabelText("Username");

    // blur triggers validation
    fireEvent.blur(input);

    expect(screen.getByText("Too short")).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    render(
      <InputField
        label="Password"
        type="password"
        value="secret"
        onChange={() => {}}
      />
    );

    const input = screen.getByLabelText("Password");
    const toggle = screen.getByRole("button", { hidden: true });

    // Initially hidden
    expect(input.type).toBe("password");

    // Click to show
    fireEvent.click(toggle);
    expect(input.type).toBe("text");

    // Click to hide again
    fireEvent.click(toggle);
    expect(input.type).toBe("password");
  });
});
