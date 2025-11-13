import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import InputField from "./InputField";

const SignupForm = ({ onToggle }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password, confirmPassword } = form;

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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName: name,
        email: user.email,
        createdAt: serverTimestamp(),
      });

      toast.success("Successfully Signed Up!");
      onToggle();
      setForm({ name: "", email: "", password: "", confirmPassword: "" });
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
    <div className="w-full max-w-sm sm:max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-2xl mx-auto transform transition-all duration-200 hover:scale-[1.01]">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">
        Signup Form
      </h2>

      {/* Toggle Buttons */}
      <div className="flex flex-row sm:flex-row mb-6 rounded-xl overflow-hidden border border-gray-200">
        <button
          onClick={onToggle}
          className="flex-1 bg-gray-100 text-gray-700 py-2.5 sm:py-3 hover:bg-gray-200 transition"
        >
          Login
        </button>
        <button className="flex-1 bg-gradient-to-r from-[#090979] to-[#27AECC] text-white py-2.5 sm:py-3">
          Signup
        </button>
      </div>

      <form onSubmit={handleSignup}>
        <InputField
          label="Full Name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <InputField
          label="Email Address"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <InputField
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          showToggle
        />
        <InputField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          showToggle
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#090979] to-[#27AECC] text-white py-2.5 sm:py-3 rounded-xl text-sm sm:text-base hover:opacity-90 transition"
        >
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>

      {error && (
        <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
      )}

      <p className="text-center text-xs sm:text-sm mt-4">
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


