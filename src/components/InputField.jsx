import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { FiEye, FiEyeOff } from "react-icons/fi";

const InputField = ({
  label,
  type = "text",
  name = "",
  value,
  onChange,
  required = false,
  className = "",
  size = "md",
  variant = "default",
  validate,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");

  // 👇 GENERATE UNIQUE id for accessibility + testing
  const id = name || label.replace(/\s+/g, "-").toLowerCase();

  useEffect(() => {
    if (touched && validate) {
      setError(validate(value));
    }
  }, [value, touched, validate]);

  const handleBlur = () => {
    setTouched(true);
    if (validate) setError(validate(value));
  };

  const isPassword = type === "password";
  const currentType = isPassword ? (showPassword ? "text" : "password") : type;

  const sizePadding =
    size === "sm"
      ? "px-2 py-1.5 text-sm pt-4"
      : "px-3 py-2.5 text-sm pt-5";

  const labelTopShown = size === "sm" ? "top-2.5" : "top-3.5";

  const isInverted = variant === "inverted";
  const inputBg = isInverted
    ? "bg-transparent text-white placeholder-white/60"
    : "bg-white text-gray-900";

  const borderColor = isInverted
    ? "border-white/30 focus:ring-white/40"
    : "border-gray-300 focus:ring-[#27AECC]";

  const labelTextColor = isInverted
    ? "text-white/90"
    : "text-gray-500";

  return (
    <div className={clsx("relative flex flex-col w-full mb-3", className)}>
      <input
        id={id}               // 👈 important
        name={name}
        type={currentType}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        placeholder=" "       // 👈 still blank for floating UX
        required={required}
        className={clsx(
          "peer w-full border rounded-md outline-none transition-all",
          sizePadding,
          inputBg,
          borderColor,
          isPassword && "pr-9",
          touched && error && "border-red-500"
        )}
      />

      {label && (
        <label
          htmlFor={id}         // 👈 important
          className={clsx(
            "absolute left-2 px-1 transition-all duration-150 pointer-events-none",
            labelTextColor,
            value ? "-top-2 text-xs" : `${labelTopShown} text-sm`,
            "peer-focus:-top-2 peer-focus:text-xs",
            touched && error && "text-red-500"
          )}
        >
          {label}
        </label>
      )}

      {isPassword && (
        <div
          onClick={() => setShowPassword(!showPassword)}
          className={clsx(
            "absolute right-2 cursor-pointer select-none",
            size === "sm" ? "top-2.5" : "top-3.5",
            isInverted ? "text-white/90" : "text-gray-500"
          )}
        >
          {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
        </div>
      )}

      {touched && error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default InputField;
