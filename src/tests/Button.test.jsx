import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../components/Button";


test("renders button text", () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText("Click me")).toBeInTheDocument();
});

test("handles click event", () => {
  const handleClick =vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  fireEvent.click(screen.getByText("Click me"));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test("shows loading state", () => {
  render(<Button loading={true}>Login</Button>);
  expect(screen.getByText("Loading...")).toBeInTheDocument();
});
