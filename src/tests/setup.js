import "@testing-library/jest-dom";
import { vi } from "vitest";

// 🛑 Disable browser Notification API inside tests
global.Notification = {
  requestPermission: vi.fn(() => Promise.resolve("granted")),
};

// 🛑 Mock Firebase Messaging (onMessage, getToken, getMessaging)
vi.mock("firebase/messaging", () => ({
  getMessaging: vi.fn(() => null),
  getToken: vi.fn(() => Promise.resolve(null)),
  onMessage: vi.fn(), // prevents crash "Cannot set properties of null"
}));
