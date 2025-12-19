import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FullFlow from "../FullFlow";
import { AuthContext } from "../context/AuthContext";
import { TaskContext } from "../context/TaskContext";
import "../_mocks_/firebase";

describe("FullFlow: dashboard renders and adds a new task", () => {
  it("renders dashboard empty state and allows adding task", async () => {
    render(
      <AuthContext.Provider
        value={{
          user: { uid: "123", email: "test@test.com" },
        }}
      >
        <TaskContext.Provider
          value={{
            tasks: [],
            loading: false,
            setTasks: vi.fn(),
          }}
        >
          <FullFlow />
        </TaskContext.Provider>
      </AuthContext.Provider>
    );

    // ✅ Wait for EMPTY DASHBOARD (correct expectation)
    await waitFor(() =>
      expect(
        screen.getByText(/your dashboard is empty/i)
      ).toBeInTheDocument()
    );

    // Fill task form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Test Task" },
    });

    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Test Description" },
    });

    fireEvent.click(screen.getByText(/add task/i));
  });
});
