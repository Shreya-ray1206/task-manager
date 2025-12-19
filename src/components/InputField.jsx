import React, { useState } from "react";
import clsx from "clsx";
import { FiEye, FiEyeOff } from "react-icons/fi";

const InputField = ({
  label,
  type = "text",
  name = "",
  value,
  onChange,
  onBlur,
  validate,
  error = "",
  required = false,
  className = "",
  size = "md",
  variant = "default",
  showToggle = false,
  autoComplete = "",
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const id = name || label.replace(/\s+/g, "-").toLowerCase();

  const isPassword = type === "password";
  const finalType =
    isPassword && showToggle ? (showPassword ? "text" : "password") : type;

  const handleBlur = (e) => {
    if (validate) {
      const msg = validate(e.target.value);
      setLocalError(msg);
    }
    onBlur?.(e);
  };

  const sizePadding =
    size === "sm"
      ? "px-2 py-1.5 text-sm pt-4"
      : "px-3 py-2.5 text-sm pt-5";

  return (
    <div className={clsx("relative flex flex-col w-full mb-3", className)}>
      <input
        id={id}
        name={name}
        type={finalType}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        required={required}
        autoComplete={autoComplete}
        placeholder=" "
        className={clsx(
          "peer w-full border rounded-md outline-none transition-all",
          sizePadding,
          "bg-white text-gray-900 border-gray-300 focus:ring-[#27AECC]",
          isPassword && showToggle && "pr-9",
          (error || localError) && "border-red-500"
        )}
        {...rest}
      />

      {label && (
        <label
          htmlFor={id}
          className={clsx(
            "absolute left-2 px-1 transition-all duration-150 pointer-events-none text-gray-500",
            value ? "-top-2 text-xs" : "top-3.5 text-sm",
            "peer-focus:-top-2 peer-focus:text-xs",
            (error || localError) && "text-red-500"
          )}
        >
          {label}
        </label>
      )}

      {isPassword && showToggle && (
        <button
          type="button"
          aria-label="Toggle password visibility"
          onClick={() => setShowPassword((p) => !p)}
          className="absolute right-2 top-3.5 text-gray-500"
        >
          {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
        </button>
      )}

      {(error || localError) && (
        <p className="text-red-500 text-xs mt-1">
          {error || localError}
        </p>
      )}
    </div>
  );
};

export default InputField;
