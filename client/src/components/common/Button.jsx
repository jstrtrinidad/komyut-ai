function Button({
  children,
  className = "",
  variant = "primary",
}) {
  const variants = {
    primary:
      "bg-[#f4b400] text-black hover:bg-[#ffca28]",

    secondary:
      "border border-[#ece7dc] bg-white text-black hover:bg-[#faf7f2]",
  };

  return (
    <button
      className={`rounded-2xl px-6 py-3 font-semibold shadow-sm transition ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;