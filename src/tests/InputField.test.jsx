import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import InputField from "../components/InputField";

describe("InputField Component", () => {
  it("renders the input and label", () => {
    render(<InputField label="Email" value="" onChange={() => {}} />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
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

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "John" },
    });

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

    fireEvent.blur(screen.getByLabelText("Username"));

    expect(screen.getByText("Too short")).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    render(
      <InputField
        label="Password"
        type="password"
        value="secret"
        onChange={() => {}}
        showToggle
      />
    );

    const input = screen.getByLabelText("Password");
    const toggle = screen.getByRole("button", {
      name: /toggle password visibility/i,
    });

    expect(input.type).toBe("password");

    fireEvent.click(toggle);
    expect(input.type).toBe("text");

    fireEvent.click(toggle);
    expect(input.type).toBe("password");
  });
});
