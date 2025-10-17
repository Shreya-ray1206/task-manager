import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const SignupForm = ({ onToggle }) => {
   const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
   const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // 🧩 Basic validation
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
      // 1️⃣ Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2️⃣ Save user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName: name,
        email: user.email,
        createdAt: serverTimestamp(),
      });

      // ✅ Switch back to Login form
      onToggle();


      alert("Signup successful!");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message);
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
        <button className="flex-1 bg-blue-600 text-white py-2">Signup</button>
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
          value = {email}
          onChange= {(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
           value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value = {confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
           {loading ? "Signing up..." : "Signup"}
        </button>
      </form>

      {/* Error Message */}
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
