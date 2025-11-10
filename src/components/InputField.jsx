import React, { useState } from "react";
import clsx from "clsx";
import { FiEye, FiEyeOff } from "react-icons/fi";

/**
 * InputField
 * - size: "md" (default) | "sm" (compact)
 * - variant: "default" (white bg, dark text) | "inverted" (transparent bg, white text) - for colored backgrounds
 * - showToggle: password eye toggle
 * - multiline: textarea
 */
const InputField = ({
  label,
  type = "text",
  name = "",
  value,
  onChange,
  required = false,
  error = "",
  helperText = "",
  showToggle = false,
  multiline = false,
  rows = 3,
  className = "",
  size = "md",
  variant = "default",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const currentType =
    isPassword && showToggle ? (showPassword ? "text" : "password") : type;

  // size styles
  const sizePadding = size === "sm" ? "px-2 py-1.5 text-sm pt-4" : "px-3 py-2.5 text-sm pt-5";
  const labelTopShown = size === "sm" ? "top-2.5" : "top-3.5";

  // variant styles
  const isInverted = variant === "inverted";
  const inputBg = isInverted ? "bg-transparent text-white placeholder-white/60" : "bg-white text-gray-900";
  const borderColor = isInverted ? "border-white/30 focus:ring-white/40" : "border-gray-300 focus:ring-[#27AECC]";
  const labelTextColor = isInverted ? "text-white/90" : "text-gray-500";

  return (
    <div className={clsx("relative flex flex-col w-full mb-3", className)}>
      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder=" "
          required={required}
          rows={rows}
          className={clsx(
            "peer w-full border rounded-md resize-none outline-none transition-all ",
            sizePadding,
            inputBg,
            borderColor,
            error ? "border-red-500" : ""
          )}
        />
      ) : (
        <input
          name={name}
          type={currentType}
          value={value}
          onChange={onChange}
          placeholder=" "
          required={required}
          className={clsx(
            "peer w-full border rounded-md outline-none transition-all ",
            sizePadding,
            inputBg,
            borderColor,
            (isPassword && showToggle) && "pr-9",
            error ? "border-red-500" : ""
          )}
        />
      )}

      {label && (
        <label
          className={clsx(
            "absolute left-2 px-1 transition-all duration-150 pointer-events-none",
            labelTextColor,
            value ? (size === "sm" ? "-top-2 text-xs" : "-top-2 text-xs") : `${labelTopShown} text-sm`,
            "peer-focus:-top-2 peer-focus:text-xs",
            error && "text-red-500"
          )}
        >
          {label}
        </label>
      )}

      {isPassword && showToggle && (
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

      {error ? (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      ) : helperText ? (
        <p className={clsx(isInverted ? "text-white/80" : "text-gray-400", "text-xs mt-1")}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default InputField;

