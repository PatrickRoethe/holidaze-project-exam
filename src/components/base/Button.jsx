export default function Button({
  children,
  type = "button",
  onClick,
  variant = "primary",
  disabled = false,
}) {
  const baseStyle =
    "px-4 py-2 rounded-md font-medium transition-colors duration-200";
  const variants = {
    primary: "bg-primary text-white hover:bg-blue-800",
    secondary: "bg-secondary text-white hover:bg-blue-600",
    accent: "bg-accent text-white hover:bg-yellow-500",
    success: "bg-success text-white hover:bg-emerald-600",
    error: "bg-error text-white hover:bg-red-600",
  };
  const disabledStyle = "opacity-50 cursor-not-allowed";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${
        disabled ? disabledStyle : ""
      }`}
    >
      {children}
    </button>
  );
}
