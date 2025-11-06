import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword,signOut  } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";

const SignupForm = ({ onToggle }) => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName: name,
        email: user.email,
        createdAt: serverTimestamp(),
      });

      await signOut(auth)
      toast.success("Sucessfully Signed Up !!");
      onToggle();
      
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Signup error:", err);
      switch (err.code) {
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/email-already-in-use":
          setError("An account already exists with this email.");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters long.");
          break;
        case "auth/network-request-failed":
          setError("Network error — please check your internet connection.");
          break;
        default:
          setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[360px] bg-white p-8 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-bold text-center mb-6">Signup Form</h2>

      <div className="flex mb-6 rounded-xl overflow-hidden border border-gray-200">
        <button
          onClick={onToggle}
          className="flex-1 bg-gray-100 text-gray-700 py-2 hover:bg-gray-200 transition"
        >
          Login
        </button>
        <button className="flex-1 bg-gradient-to-r from-[#090979] to-[#27AECC] text-white py-2">
          Signup
        </button>
      </div>

      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Password Field */}
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="relative mb-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
          >
            {showConfirmPassword ? (
              <FiEyeOff size={20} />
            ) : (
              <FiEye size={20} />
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#090979] to-[#27AECC] text-white py-2 rounded-xl hover:opacity-90 transition"
        >
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>

      {error && (
        <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
      )}

      <p className="text-center text-sm mt-4">
        Already a member?{" "}
        <span
          onClick={onToggle}
          className="text-blue-500 cursor-pointer hover:underline"
        >
          Login now
        </span>
      </p>
    </div>
  );
};

export default SignupForm;
