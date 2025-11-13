import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "./Button";
import InputField from "./InputField";

const LoginForm = ({ onToggle }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged In ✅");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password. Please try again.");
      } else {
        setError("Failed to log in. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-2xl mx-auto transform transition-all duration-200 hover:scale-[1.01]">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">
        Login Form
      </h2>

      {/* Toggle Buttons */}
      <div className="flex flex-row sm:flex-row mb-6 rounded-xl overflow-hidden border border-gray-200">
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
          error={error.includes("email") ? error : ""}
        />

        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showToggle
          required
          error={error.includes("password") ? error : ""}
        />

        <Button
          variant="primary"
          fullWidth
          loading={loading}
          type="submit"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      {error && (
        <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
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
