import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
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

  const [unverifiedUser, setUnverifiedUser] = useState(null);
  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();

  // countdown for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

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
        await sendEmailVerification(user);

        setUnverifiedUser(user);
        setCooldown(60);
        setError("Your email is not verified. Verification email sent.");
        await auth.signOut();

        return;
      }

      // verified → allow login
      navigate("/dashboard");
    } catch (err) {
      console.log("LOGIN ERROR:", err);

      // SPECIAL CASE: Firebase rate limit ("too-many-requests")
      if (err.code === "auth/too-many-requests") {
        setError(
          "Too many login attempts. Check your inbox and verify your email."
        );
        return;
      }

      // Firebase throws this when user exists but is unverified
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/invalid-login"
      ) {
        setError("Your email is not verified. Check your inbox.");
        return;
      }

      setError(firebaseErrorToMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!unverifiedUser || cooldown > 0) return;

    try {
      await sendEmailVerification(unverifiedUser);
      toast.success("Verification email resent!");
      setCooldown(60);
    } catch (_) {
      toast.error("Failed to resend verification email.");
    }
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-2xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">
        Login Form
      </h2>

      <div className="flex flex-row mb-6 rounded-xl overflow-hidden border border-gray-200">
        <button className="flex-1 text-white py-2.5 sm:py-3 font-semibold bg-gradient-to-r from-[#090979] to-[#27AECC]">
          Login
        </button>
        <button
          onClick={onToggle}
          className="flex-1 bg-gray-100 text-gray-700 py-2.5 sm:py-3 hover:bg-gray-200 transition"
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
            onClick={handleResend}
            className={
              cooldown > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 cursor-pointer hover:underline"
            }
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend verification email"}
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


