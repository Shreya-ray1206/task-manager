import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "./Button";
import InputField from "./InputField";
import { firebaseErrorToMessage } from "../utils/error";

const LoginForm = ({ onToggle }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Email verification resend
  const [unverifiedUser, setUnverifiedUser] = useState(null);
  const [cooldown, setCooldown] = useState(0);

  // Forgot password cooldown
  const [resetCooldown, setResetCooldown] = useState(0);

  const navigate = useNavigate();

  // -------------------------------
  // Email verification cooldown
  // -------------------------------
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // -------------------------------
  // Forgot password cooldown
  // -------------------------------
  useEffect(() => {
    if (resetCooldown <= 0) return;
    const timer = setTimeout(() => setResetCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resetCooldown]);

  // -------------------------------
  // Login handler
  // -------------------------------
  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  if (!email || !password) {
    setError("Please fill in all fields.");
    return;
  }

  setLoading(true);

  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;

    if (!user.emailVerified) {
      setUnverifiedUser(user); // store FULL user
      setError("Your email is not verified.");
      return; // ❌ DO NOT sign out yet
    }

    navigate("/dashboard");
  } catch (err) {
    console.log("LOGIN ERROR:", err);
    setError(firebaseErrorToMessage(err));
  } finally {
    setLoading(false);
  }
};


  // -------------------------------
  // Resend verification email
  // -------------------------------
  const handleResendVerification = async () => {
  if (!unverifiedUser || cooldown > 0) return;

  try {
    await sendEmailVerification(unverifiedUser);
     toast.success("Verification email sent! Check your inbox.", {
      duration: 5000, // 5 seconds
    });
    setCooldown(60);

    await auth.signOut(); 
    // ❌ DO NOT setUnverifiedUser(null) here
  } catch (err) {
    console.log("RESEND ERROR:", err);
    toast.error("Failed to resend verification email.");
  }
};


  // -------------------------------
  // Forgot password
  // -------------------------------
  const handleForgotPassword = async () => {
    setError("");

    if (resetCooldown > 0) return;

    if (!email) {
      setError("Please enter your email to reset your password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent. Check your inbox.");
      setResetCooldown(60);
    } catch (err) {
      console.log("FORGOT PASSWORD ERROR:", err);
      setError(firebaseErrorToMessage(err));
    }
  };

  // -------------------------------
  // JSX
  // -------------------------------
  return (
    <div className="w-full max-w-sm sm:max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-2xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">
        Login Form
      </h2>

      <div className="flex flex-row mb-6 rounded-xl overflow-hidden border border-gray-200">
        <button className="flex-1 text-white py-3 font-semibold bg-gradient-to-r from-[#090979] to-[#27AECC]">
          Login
        </button>
        <button
          onClick={onToggle}
          className="flex-1 bg-gray-100 text-gray-700 py-3 hover:bg-gray-200 transition"
        >
          Signup
        </button>
      </div>

      <form onSubmit={handleLogin}>
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showToggle
          required
        />

        {/* Forgot password */}
        <p className="text-right text-sm mt-2 mb-4">
          <span
            onClick={handleForgotPassword}
            className={
              resetCooldown > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 cursor-pointer hover:underline"
            }
          >
            {resetCooldown > 0
              ? `Resend in ${resetCooldown}s`
              : "Forgot password?"}
          </span>
        </p>

        <Button
          variant="primary"
          fullWidth
          loading={loading}
          type="submit"
          className="mt-2"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      {error && (
        <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
      )}

      {unverifiedUser && (
        <p className="text-center mt-3 text-sm">
          Didn’t receive verification email?{" "}
          <span
            onClick={handleResendVerification}
            className={
              cooldown > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 cursor-pointer hover:underline"
            }
          >
            {cooldown > 0
              ? `Resend in ${cooldown}s`
              : "Resend verification email"}
          </span>
        </p>
      )}

      <p className="text-center text-xs sm:text-sm mt-4">
        Not a member?{" "}
        <span
          onClick={onToggle}
          className="text-blue-500 cursor-pointer hover:underline"
        >
          Signup now
        </span>
      </p>
    </div>
  );
};

export default LoginForm;
