// src/FullFlow.jsx
import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import DashboardContent from "./components/DashboardContent";
import MyTasksBoard from "./components/MyTasksBoard";
import { useAuth } from "./context/AuthProvider";

export default function FullFlow() {
  const [showSignup, setShowSignup] = useState(false);
  const { user } = useAuth(); // your AuthContext provides logged-in user

  // Toggle between login and signup
  const handleToggle = () => setShowSignup((prev) => !prev);

  if (!user) {
    return showSignup ? (
      <SignupForm onToggle={handleToggle} />
    ) : (
      <LoginForm onToggle={handleToggle} />
    );
  }

  // User is logged in → show dashboard + tasks
  return (
    <div>
      <DashboardContent />
      <MyTasksBoard />
    </div>
  );
}
