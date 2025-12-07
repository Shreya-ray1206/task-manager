import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import FullFlow from "../FullFlow";
import { AuthContext } from "../context/AuthContext";
import { TasksContext } from "../context/TasksContext"; // <-- IMPORTANT
import "../_mocks_/firebase";

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

// Mock TasksContext values
const mockTasksValue = {
  loading: false,
  tasks: [],
  recentTasks: [],
  tasksByStatus: { todo: [], progress: [], done: [] },
  addTask: vi.fn((task) => mockTasksValue.tasks.push(task)),
};

test("FullFlow: dashboard renders and adds a new task", async () => {
  render(
    <AuthContext.Provider value={{ user: fakeUser }}>
      <TasksContext.Provider value={mockTasksValue}>
        <FullFlow />
      </TasksContext.Provider>
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

  // Confirm addTask() was called
  expect(mockTasksValue.addTask).toHaveBeenCalled();

  // Fake the task appearing in UI
  mockTasksValue.tasks.push({ title: "Test Task" });

  // Now the task should appear
  await waitFor(() => {
    expect(screen.getByText(/Test Task/i)).toBeInTheDocument();
  });
});
