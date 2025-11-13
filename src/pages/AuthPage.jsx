import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => setIsLogin((prev) => !prev);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#89BAFA] to-[#FAB0FF] px-4 sm:px-6">
      <div className="w-full max-w-sm sm:max-w-md">
        {isLogin ? (
          <LoginForm onToggle={toggleForm} />
        ) : (
          <SignupForm onToggle={toggleForm} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
