import React, { useState } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import InputField from "./InputField";
import { firebaseErrorToMessage } from "../utils/error";

const SignupForm = ({ onToggle }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // -------------------------------
  // Update form values
  // -------------------------------
  const change = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // realtime validation: revalidate the field being typed
    setErrors((prev) => ({
      ...prev,
      [name]: rules[name](value),
    }));
  };

  // -------------------------------
  // Validation rules
  // -------------------------------
  const rules = {
    name: (v) => {
      if (!v.trim()) return "Name is required.";
      if (v.trim().length < 3) return "Name must be at least 3 characters.";
      if (!v.includes(" ")) return "Enter full name (first + last).";
      return "";
    },
    email: (v) => {
      if (!v.trim()) return "Email is required.";
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(v) ? "" : "Invalid email.";
    },
    password: (v) => {
      if (!v.trim()) return "Password is required.";
      const rule = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
      return rule.test(v)
        ? ""
        : "At least 6 characters, 1 uppercase, 1 special character.";
    },
    confirmPassword: (v) => {
      if (!v.trim()) return "Please confirm your password.";
      return v !== form.password ? "Passwords do not match." : "";
    },
  };

  // -------------------------------
  // Validate all fields at submit
  // -------------------------------
  const validateAll = () => {
    const newErrors = {};
    Object.keys(rules).forEach((field) => {
      const msg = rules[field](form[field]);
      if (msg) newErrors[field] = msg;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------------------
  // Signup handler
  // -------------------------------
  const handleSignup = async (e) => {
    e.preventDefault();
    setSubmitError("");

    // validate before submitting
    if (!validateAll()) return;

    setLoading(true);

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCred.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName: form.name,
        email: form.email,
        createdAt: serverTimestamp(),
      });

      await sendEmailVerification(user);
      await auth.signOut();

       toast.success("Verification email sent. Check your inbox.", {
      duration: 5000, // 5 seconds
    });

      // reset form & errors
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});

      // navigate back to login
      setTimeout(onToggle, 300);
    } catch (err) {
      setSubmitError(firebaseErrorToMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // JSX
  // -------------------------------
  return (
    <div className="w-full max-w-sm sm:max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-2xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-4">
        Signup Form
      </h2>

      <div className="flex flex-row mb-6 rounded-xl overflow-hidden border border-gray-200">
        <button
          onClick={onToggle}
          className="flex-1 bg-gray-100 text-gray-700 py-3"
        >
          Login
        </button>
        <button className="flex-1 bg-gradient-to-r from-[#090979] to-[#27AECC] text-white py-3">
          Signup
        </button>
      </div>

      <form onSubmit={handleSignup}>
        <InputField
          label="Full Name"
          name="name"
          value={form.name}
          onChange={change}
          error={errors.name}
          autoComplete="name"
        />

        <InputField
          label="Email Address"
          name="email"
          value={form.email}
          onChange={change}
          error={errors.email}
          autoComplete="email"
        />

        <InputField
          type="password"
          showToggle
          label="Password"
          name="password"
          value={form.password}
          onChange={change}
          error={errors.password}
          autoComplete="new-password"
        />

        <InputField
          type="password"
          showToggle
          label="Confirm Password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={change}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#090979] to-[#27AECC] text-white py-3 rounded-xl mt-3"
        >
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>

      {submitError && (
        <p className="text-red-500 text-sm mt-3 text-center">{submitError}</p>
      )}
    </div>
  );
};

export default SignupForm;
