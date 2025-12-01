import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import FullFlow from "../FullFlow"; // your main component
import { AuthContext } from "../context/AuthContext";
import "../_mocks_/firebase"; // corrected folder name

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

// Fake logged-in user
const fakeUser = {
  uid: "user123",
  email: "john@example.com",
  emailVerified: true,
};

test("FullFlow: dashboard renders and adds a new task", async () => {
  render(
    <AuthContext.Provider value={{ user: fakeUser }}>
      <FullFlow />
    </AuthContext.Provider>
  );

  // Wait for dashboard greeting
  await waitFor(() => expect(screen.getByText(/Hi,/i)).toBeInTheDocument());

  // Fill out "Create New Task" form using label text
  const titleInput = screen.getByLabelText(/Title/i);
  const descInput = screen.getByLabelText(/Description/i);
  const addButton = screen.getByRole("button", { name: /Add Task/i });

  fireEvent.change(titleInput, { target: { value: "Test Task" } });
  fireEvent.change(descInput, { target: { value: "Test description" } });
  fireEvent.click(addButton);

  // Wait for the new task to appear in the list
  await waitFor(() => expect(screen.getByText(/Test Task/i)).toBeInTheDocument());
});
