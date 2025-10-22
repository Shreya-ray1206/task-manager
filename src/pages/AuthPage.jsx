import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => setIsLogin((prev) => !prev);

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-r from-[#89BAFA] to-[#FAB0FF] fixed top-0 left-0">
      {isLogin ? (
        <LoginForm onToggle={toggleForm} />
      ) : (
        <SignupForm onToggle={toggleForm} />
      )}
    </div>
  );
};

export default AuthPage;
