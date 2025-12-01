import { vi } from "vitest";

// ----------- Auth mocks -----------
export const auth = {
  currentUser: { uid: "user123", email: "john@example.com", emailVerified: true },
  signOut: vi.fn(() => Promise.resolve()),
};

export const signInWithEmailAndPassword = vi.fn(() =>
  Promise.resolve({ user: { uid: "user123", email: "john@example.com", emailVerified: true } })
);

export const sendEmailVerification = vi.fn(() => Promise.resolve());

// ----------- Firestore mocks -----------
const fakeTask = {
  id: "task123",
  title: "Sample Task",
  description: "Task description",
  status: "todo",
  priority: "medium",
  createdAt: { toDate: () => new Date() },
};

const fakeTasksSnapshot = {
  docs: [
    {
      id: fakeTask.id,
      data: () => ({ ...fakeTask }),
    },
  ],
};

export const db = {
  collection: vi.fn(() => ({
    // For Firestore queries
    onSnapshot: vi.fn((callback) => {
      callback(fakeTasksSnapshot);
      return vi.fn(); // return unsubscribe
    }),
    addDoc: vi.fn(() => Promise.resolve({ id: "newTask123" })),
    updateDoc: vi.fn(() => Promise.resolve()),
    doc: vi.fn(() => ({
      update: vi.fn(() => Promise.resolve()),
    })),
    getDocs: vi.fn(() => Promise.resolve(fakeTasksSnapshot)),
  })),
};

// ----------- Messaging mocks -----------
export const messaging = {
  getToken: vi.fn(() => Promise.resolve("fake-token")),
};

export const requestPermission = vi.fn(() => Promise.resolve("granted"));
