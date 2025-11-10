import React from "react";
import clsx from "clsx";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  icon,
  disabled = false,
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-all focus:outline-none";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#090979] to-[#27AECC] text-white hover:opacity-90",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    danger: "text-red-600 hover:text-red-700",
     icon: "text-gray-500 hover:text-blue-600 p-1 rounded-full w-8 h-8 flex items-center justify-center", // 👈 tightened icon button
    white: "bg-white text-[#090979] hover:bg-gray-100",
  };

  const sizeStyles = {
    sm: "text-xs px-2 py-1",
    md: "text-base px-5 py-2.5",
    lg: "text-base px-5 py-2.5",
  };

  const classes = clsx(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && "w-full",
    disabled && "opacity-60 cursor-not-allowed"
  );

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={loading || disabled}
    >
      {loading ? (
        <span>Loading...</span>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
