import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ onToggle }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState("")

  const navigate = useNavigate();

   const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // 🧩 Basic validation
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ Sign in user with Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);

      // ✅ Redirect to dashboard
      navigate("/dashboard");
      alert("Login successful!");
    } catch (err) {
      console.error("Login error:", err);
      // Show friendly error messages
      if (err.code === "auth/invalid-email") setError("Invalid email format.");
      else if (err.code === "auth/user-not-found")
        setError("No account found with this email.");
      else if (err.code === "auth/wrong-password")
        setError("Incorrect password.");
      else setError("Failed to log in. Try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-[360px] bg-white p-8 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-bold text-center mb-6">Login Form</h2>

      <div className="flex mb-6 rounded-xl overflow-hidden border border-gray-200">
        <button className="flex-1 bg-blue-600 text-white py-2">Login</button>
        <button
          onClick={onToggle}
          className="flex-1 bg-gray-100 text-gray-700 py-2 hover:bg-gray-200 transition"
        >
          Signup
        </button>
      </div>

      <form onClick={handleLogin}>
        <input
          type="email"
          placeholder="Email Address"
          value ={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          value = {password}
          onChange={(e)=> setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <a href="#" className="text-sm text-blue-500 block mb-4 hover:underline">
          Forgot password?
        </a>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
      )}

      <p className="text-center text-sm mt-4">
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
